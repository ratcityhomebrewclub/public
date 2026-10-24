// Run with: node --test worker/test/*.test.mjs
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { handle, parseAdmins, resetCaches, signSession } from '../src/index.js';

const CLIENT_ID = 'client-123.apps.googleusercontent.com';
const env = {
  GOOGLE_CLIENT_ID: CLIENT_ID,
  ALLOWED_ORIGINS: 'https://site.example',
  GITHUB_REPO: 'club/website',
  GITHUB_BRANCH: 'main',
  ADMINS_PATH: 'admins.txt',
  GITHUB_TOKEN: 'gh-secret',
  SESSION_SECRET: 'session-secret',
};

const enc = new TextEncoder();
const b64url = (bytes) => Buffer.from(bytes).toString('base64url');

// A stand-in for Google's signing key.
const { publicKey, privateKey } = await crypto.subtle.generateKey(
  { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
  true, ['sign', 'verify'],
);
const jwk = { ...(await crypto.subtle.exportKey('jwk', publicKey)), kid: 'k1', alg: 'RS256' };

async function googleToken(claims = {}, { kid = 'k1', key = privateKey } = {}) {
  const header = b64url(enc.encode(JSON.stringify({ alg: 'RS256', kid })));
  const payload = b64url(enc.encode(JSON.stringify({
    iss: 'https://accounts.google.com', aud: CLIENT_ID, exp: Math.floor(Date.now() / 1000) + 3600,
    email: 'Officer@Example.com', email_verified: true, name: 'Officer', ...claims,
  })));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(`${header}.${payload}`));
  return `${header}.${payload}.${b64url(new Uint8Array(sig))}`;
}

let files;
let calls;
async function fakeFetch(url, opts = {}) {
  calls.push({ url, ...opts });
  if (url.startsWith('https://www.googleapis.com/')) return Response.json({ keys: [jwk] });
  const path = decodeURIComponent(new URL(url).pathname.split('/contents/')[1] || '');
  assert.equal(opts.headers.Authorization, 'Bearer gh-secret');
  if (opts.method === 'PUT') {
    const body = JSON.parse(opts.body);
    if (files[path] && body.sha !== files[path].sha) return Response.json({ message: 'sha does not match' }, { status: 409 });
    files[path] = { text: Buffer.from(body.content, 'base64').toString(), sha: `sha-${calls.length}` };
    return Response.json({ content: { sha: files[path].sha }, commit: { html_url: 'https://github.com/c/1' } });
  }
  const f = files[path];
  if (!f) return Response.json({ message: 'Not Found' }, { status: 404 });
  if (opts.headers.Accept.includes('raw')) return new Response(f.text);
  return Response.json({ encoding: 'base64', content: Buffer.from(f.text).toString('base64'), sha: f.sha });
}

function req(method, path, { body, token, origin = 'https://site.example' } = {}) {
  return new Request(`https://api.example${path}`, {
    method,
    headers: {
      Origin: origin,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function call(...args) {
  const res = await handle(req(...args), env, fakeFetch);
  return { status: res.status, body: await res.json(), headers: res.headers };
}

const session = (email = 'officer@example.com') => signSession({ email, name: 'Officer', picture: '' }, env.SESSION_SECRET);

beforeEach(() => {
  resetCaches();
  calls = [];
  files = {
    'admins.txt': { text: '# officers\nofficer@example.com  # pres\n\nOther@Example.com\n', sha: 'a' },
    'content/about.md': { text: '# About 🍺', sha: 's1' },
  };
});

test('parseAdmins ignores comments, blanks and case', () => {
  assert.deepEqual([...parseAdmins('# x\nA@B.com # note\n\nnot-an-email\n')], ['a@b.com']);
});

test('admin on the list gets a session', async () => {
  const { status, body, headers } = await call('POST', '/session', { body: { credential: await googleToken() } });
  assert.equal(status, 200);
  assert.equal(body.user.email, 'officer@example.com');
  assert.ok(body.token);
  assert.equal(headers.get('Access-Control-Allow-Origin'), 'https://site.example');
  const me = await call('GET', '/session', { token: body.token });
  assert.equal(me.body.user.email, 'officer@example.com');
});

test('google accounts not on the list are rejected', async () => {
  const { status, body } = await call('POST', '/session', { body: { credential: await googleToken({ email: 'rando@example.com' }) } });
  assert.equal(status, 403);
  assert.match(body.message, /not on the admin list/);
});

test('bad google credentials are rejected', async () => {
  const other = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['sign', 'verify'],
  );
  const cases = [
    await googleToken({}, { key: other.privateKey }),
    await googleToken({ aud: 'someone-else' }),
    await googleToken({ iss: 'evil.example' }),
    await googleToken({ exp: Math.floor(Date.now() / 1000) - 600 }),
    await googleToken({ email_verified: false }),
    await googleToken({}, { kid: 'nope' }),
    'not.a.jwt',
  ];
  for (const credential of cases) {
    const { status } = await call('POST', '/session', { body: { credential } });
    assert.equal(status, 401, credential.slice(0, 20));
  }
});

test('sessions must be valid, unexpired, and still on the list', async () => {
  assert.equal((await call('GET', '/session')).status, 401);
  assert.equal((await call('GET', '/session', { token: (await session()) + 'x' })).status, 401);
  const expired = await signSession({ email: 'officer@example.com' }, env.SESSION_SECRET, -10);
  assert.equal((await call('GET', '/session', { token: expired })).status, 401);
  const forged = await signSession({ email: 'officer@example.com' }, 'wrong-secret');
  assert.equal((await call('GET', '/session', { token: forged })).status, 401);
  assert.equal((await call('GET', '/session', { token: await session('removed@example.com') })).status, 403);
});

test('reads and commits content as the signed-in officer', async () => {
  const token = await session();
  const got = await call('GET', '/file?path=content/about.md', { token });
  assert.deepEqual(got.body, { text: '# About 🍺', sha: 's1', isNew: false });

  const content = Buffer.from('# New 🍺').toString('base64');
  const put = await call('PUT', '/file', { token, body: { path: 'content/about.md', content, message: 'Edit', sha: 's1' } });
  assert.equal(put.status, 200);
  assert.equal(files['content/about.md'].text, '# New 🍺');
  const commit = JSON.parse(calls.at(-1).body);
  assert.deepEqual(commit.author, { name: 'Officer', email: 'officer@example.com' });
  assert.equal(commit.branch, 'main');

  const stale = await call('PUT', '/file', { token, body: { path: 'content/about.md', content, sha: 's1' } });
  assert.equal(stale.status, 409);
  assert.equal(stale.body.conflict, true);

  const missing = await call('GET', '/file?path=content/new-page.md', { token });
  assert.deepEqual(missing.body, { text: '', sha: null, isNew: true });
});

test('only content/*.md can be read or written', async () => {
  const token = await session();
  for (const path of ['admins.txt', '.github/workflows/deploy.yml', 'content/../admins.txt', 'content/x.js', 'content/sub/x.md']) {
    assert.equal((await call('GET', `/file?path=${encodeURIComponent(path)}`, { token })).status, 400, path);
    assert.equal((await call('PUT', '/file', { token, body: { path, content: 'eA==' } })).status, 400, path);
  }
});

test('uploads images under a fresh name and refuses other types', async () => {
  const token = await session();
  const month = new Date().toISOString().slice(0, 7);
  files[`public/images/uploads/${month}-my-photo.jpg`] = { text: 'x', sha: 'u' };
  const up = await call('POST', '/upload', { token, body: { name: 'My Photo.JPG', content: 'AAAA' } });
  assert.equal(up.status, 200);
  assert.equal(up.body.path, `public/images/uploads/${month}-my-photo-2.jpg`);

  assert.equal((await call('POST', '/upload', { token, body: { name: 'x.svg', content: 'AAAA' } })).status, 400);
  const big = 'A'.repeat(Math.ceil((5 * 1024 * 1024 + 10) / 3) * 4);
  assert.equal((await call('POST', '/upload', { token, body: { name: 'x.png', content: big } })).status, 413);
});

test('CORS headers only for allowed origins', async () => {
  const res = await handle(req('OPTIONS', '/session', { origin: 'https://evil.example' }), env, fakeFetch);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), null);
  const ok = await handle(req('OPTIONS', '/session'), env, fakeFetch);
  assert.equal(ok.status, 204);
  assert.equal(ok.headers.get('Access-Control-Allow-Origin'), 'https://site.example');
});
