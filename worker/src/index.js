// Admin API for the static site. Officers sign in on /admin with Google; this
// Worker verifies the Google ID token, checks the email against admins.txt in
// the repo, and commits page edits with a GitHub token only the Worker holds.
//
// Env vars:  GOOGLE_CLIENT_ID, ALLOWED_ORIGINS (comma separated),
//            GITHUB_REPO (owner/name), GITHUB_BRANCH, ADMINS_PATH
// Secrets:   GITHUB_TOKEN (fine-grained, Contents read/write on the repo),
//            SESSION_SECRET (random string used to sign sessions)

const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUERS = ['accounts.google.com', 'https://accounts.google.com'];
const SESSION_TTL = 12 * 60 * 60; // seconds
const ADMINS_TTL = 60 * 1000; // ms to cache admins.txt
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const UPLOADS_DIR = 'public/images/uploads';
const EDITABLE_PATH = /^content\/[a-z0-9][a-z0-9-]*\.md$/;
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp']; // no SVG: it can carry script

export class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

/* ---------- encoding helpers ---------- */

const enc = new TextEncoder();

function b64urlToBytes(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=');
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function bytesToB64url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const b64urlJson = (s) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

function b64ToText(b64) {
  const bytes = Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/* ---------- Google ID token ---------- */

let certsCache = { keys: null, expires: 0 };

async function googleKeys(fetchImpl) {
  if (certsCache.keys && Date.now() < certsCache.expires) return certsCache.keys;
  const res = await fetchImpl(GOOGLE_CERTS_URL);
  if (!res.ok) throw new HttpError(502, 'Could not fetch Google signing keys.');
  const maxAge = Number(/max-age=(\d+)/.exec(res.headers.get('cache-control') || '')?.[1] || 3600);
  certsCache = { keys: (await res.json()).keys, expires: Date.now() + maxAge * 1000 };
  return certsCache.keys;
}

export function resetCaches() {
  certsCache = { keys: null, expires: 0 };
  adminsCache = { emails: null, expires: 0 };
}

export async function verifyGoogleToken(credential, clientId, fetchImpl = fetch) {
  const parts = String(credential || '').split('.');
  if (parts.length !== 3) throw new HttpError(401, 'Malformed Google credential.');
  const [h, p, s] = parts;
  let header;
  try {
    header = b64urlJson(h);
  } catch {
    throw new HttpError(401, 'Malformed Google credential.');
  }
  if (header.alg !== 'RS256') throw new HttpError(401, 'Unexpected token algorithm.');

  const jwk = (await googleKeys(fetchImpl)).find((k) => k.kid === header.kid);
  if (!jwk) throw new HttpError(401, 'Unknown Google signing key.');
  const key = await crypto.subtle.importKey(
    'jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify'],
  );
  let valid = false;
  try {
    valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(s), enc.encode(`${h}.${p}`));
  } catch {
    // malformed signature
  }
  if (!valid) throw new HttpError(401, 'Invalid Google credential.');

  const claims = b64urlJson(p);
  const now = Math.floor(Date.now() / 1000);
  if (!GOOGLE_ISSUERS.includes(claims.iss)) throw new HttpError(401, 'Credential was not issued by Google.');
  if (claims.aud !== clientId) throw new HttpError(401, 'Credential is for a different app.');
  if (!(claims.exp > now - 60)) throw new HttpError(401, 'Google credential expired. Sign in again.');
  if (!claims.email || claims.email_verified !== true) throw new HttpError(401, 'Google account email is not verified.');
  return { email: claims.email.toLowerCase(), name: claims.name || claims.email, picture: claims.picture || '' };
}

/* ---------- sessions (HMAC-signed, stateless) ---------- */

async function hmacKey(secret) {
  if (!secret) throw new HttpError(500, 'SESSION_SECRET is not configured.');
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signSession(user, secret, ttl = SESSION_TTL) {
  const payload = bytesToB64url(enc.encode(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + ttl })));
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(secret), enc.encode(payload));
  return `${payload}.${bytesToB64url(new Uint8Array(sig))}`;
}

export async function verifySession(token, secret) {
  const [payload, sig, extra] = String(token || '').split('.');
  if (!payload || !sig || extra !== undefined) throw new HttpError(401, 'Not signed in.');
  const key = await hmacKey(secret);
  let ok = false;
  try {
    ok = await crypto.subtle.verify('HMAC', key, b64urlToBytes(sig), enc.encode(payload));
  } catch {
    // malformed signature
  }
  if (!ok) throw new HttpError(401, 'Invalid session. Sign in again.');
  const session = b64urlJson(payload);
  if (!(session.exp > Date.now() / 1000)) throw new HttpError(401, 'Your session expired. Sign in again.');
  return session;
}

/* ---------- GitHub ---------- */

function github(env, fetchImpl) {
  const [owner, name] = (env.GITHUB_REPO || '').split('/');
  const branch = env.GITHUB_BRANCH || 'main';
  const contents = (path) =>
    `https://api.github.com/repos/${owner}/${name}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;

  async function call(url, { method = 'GET', body, raw = false } = {}) {
    const res = await fetchImpl(url, {
      method,
      headers: {
        Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        'User-Agent': 'rchb-admin-worker',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      let message = `GitHub returned ${res.status}`;
      try { message = (await res.json()).message || message; } catch { /* non-JSON */ }
      const conflict = res.status === 409 || (res.status === 422 && /sha/i.test(message));
      if (conflict) throw new HttpError(409, 'This file changed on GitHub since you opened it.', { conflict: true });
      if (res.status === 404) throw new HttpError(404, 'Not found on GitHub.');
      throw new HttpError(502, `GitHub error: ${message}`);
    }
    return raw ? res.text() : res.json();
  }

  const ref = `?ref=${encodeURIComponent(branch)}`;
  return {
    readText: (path) => call(contents(path) + ref, { raw: true }),
    async getFile(path) {
      try {
        const data = await call(contents(path) + ref);
        const text = data.encoding === 'base64' ? b64ToText(data.content || '') : await call(contents(path) + ref, { raw: true });
        return { text, sha: data.sha, isNew: false };
      } catch (err) {
        if (err.status === 404) return { text: '', sha: null, isNew: true };
        throw err;
      }
    },
    async exists(path) {
      try {
        await call(contents(path) + ref);
        return true;
      } catch (err) {
        if (err.status === 404) return false;
        throw err;
      }
    },
    putFile: (path, content, message, sha, author) => call(contents(path), {
      method: 'PUT',
      body: { message, content, branch, author, ...(sha ? { sha } : {}) },
    }),
  };
}

/* ---------- admin list ---------- */

let adminsCache = { emails: null, expires: 0 };

export function parseAdmins(text) {
  return new Set(
    text.split('\n')
      .map((line) => line.replace(/#.*/, '').trim().toLowerCase())
      .filter((line) => line.includes('@')),
  );
}

async function admins(gh, env) {
  if (adminsCache.emails && Date.now() < adminsCache.expires) return adminsCache.emails;
  const emails = parseAdmins(await gh.readText(env.ADMINS_PATH || 'admins.txt'));
  adminsCache = { emails, expires: Date.now() + ADMINS_TTL };
  return emails;
}

async function requireAdmin(gh, env, email) {
  if (!(await admins(gh, env)).has(email)) {
    throw new HttpError(403, `${email} is not on the admin list. Ask an officer to add you to admins.txt.`);
  }
}

/* ---------- uploads ---------- */

function uploadName(filename) {
  const dot = filename.lastIndexOf('.');
  const ext = (dot > 0 ? filename.slice(dot + 1) : '').toLowerCase();
  if (!IMAGE_EXTS.includes(ext)) throw new HttpError(400, `Only ${IMAGE_EXTS.join(', ')} images can be uploaded.`);
  const base = (dot > 0 ? filename.slice(0, dot) : filename)
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'image';
  const now = new Date();
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  return { stem: `${UPLOADS_DIR}/${month}-${base}`, ext };
}

/* ---------- request handling ---------- */

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const json = (data, status, headers) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } });

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, 'Request body must be JSON.');
  }
}

async function route(request, env, fetchImpl) {
  const url = new URL(request.url);
  const gh = github(env, fetchImpl);
  const key = `${request.method} ${url.pathname}`;

  if (key === 'POST /session') {
    const { credential } = await readJson(request);
    const user = await verifyGoogleToken(credential, env.GOOGLE_CLIENT_ID, fetchImpl);
    await requireAdmin(gh, env, user.email);
    return { token: await signSession(user, env.SESSION_SECRET), user };
  }

  // Everything else needs a session from an email still on the admin list.
  const auth = request.headers.get('Authorization') || '';
  const session = await verifySession(auth.replace(/^Bearer\s+/i, ''), env.SESSION_SECRET);
  await requireAdmin(gh, env, session.email);
  const user = { email: session.email, name: session.name, picture: session.picture };
  const author = { name: session.name, email: session.email };

  if (key === 'GET /session') return { user };

  if (key === 'GET /file') {
    const path = url.searchParams.get('path') || '';
    if (!EDITABLE_PATH.test(path)) throw new HttpError(400, 'Only content/*.md files can be edited.');
    return gh.getFile(path);
  }

  if (key === 'PUT /file') {
    const { path, content, message, sha } = await readJson(request);
    if (!EDITABLE_PATH.test(path || '')) throw new HttpError(400, 'Only content/*.md files can be edited.');
    if (typeof content !== 'string') throw new HttpError(400, 'Missing content.');
    const res = await gh.putFile(path, content, String(message || `Update ${path} via admin`).slice(0, 200), sha, author);
    return { content: { sha: res.content.sha }, commit: { html_url: res.commit.html_url } };
  }

  if (key === 'POST /upload') {
    const { name, content } = await readJson(request);
    if (typeof content !== 'string') throw new HttpError(400, 'Missing image data.');
    if (content.length * 0.75 > MAX_UPLOAD_BYTES + 3) throw new HttpError(413, 'Images must be 5 MB or smaller.');
    const { stem, ext } = uploadName(String(name || ''));
    for (let i = 1; i <= 20; i++) {
      const path = `${stem}${i > 1 ? `-${i}` : ''}.${ext}`;
      if (await gh.exists(path)) continue;
      await gh.putFile(path, content, `Upload ${path.split('/').pop()} via admin`, null, author);
      return { path };
    }
    throw new HttpError(409, 'Could not find a free file name for that image. Try renaming it.');
  }

  throw new HttpError(404, 'Not found.');
}

export async function handle(request, env, fetchImpl = fetch) {
  const cors = corsHeaders(request, env);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  try {
    return json(await route(request, env, fetchImpl), 200, cors);
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err instanceof HttpError ? err.message : 'Unexpected server error.';
    if (status === 500) console.error(err);
    return json({ message, ...(err.extra || {}) }, status, cors);
  }
}

export default {
  fetch: (request, env) => handle(request, env),
};
