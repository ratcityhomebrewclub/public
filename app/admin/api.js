// Client for the admin Worker (worker/src/index.js). The Worker holds the
// GitHub credential; the browser only ever has a short-lived session token.
import site from 'config/site';

const SESSION_KEY = 'rchb-admin-session';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const configured = Boolean(site.admin.apiUrl && site.admin.googleClientId);
export const repoSlug = `${site.repo.owner}/${site.repo.name}`;
export const repoUrl = `https://github.com/${repoSlug}`;
export const actionsUrl = `${repoUrl}/actions`;
export const adminsFileUrl = `${repoUrl}/edit/${site.repo.branch}/${site.admin.adminsFile}`;

export class ApiError extends Error {
  constructor(status, message, conflict = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.conflict = conflict;
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  let res;
  try {
    res = await fetch(site.admin.apiUrl.replace(/\/$/, '') + path, {
      method,
      cache: 'no-store',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Could not reach the admin server. Check your connection and try again.');
  }
  let data = {};
  try {
    data = await res.json();
  } catch {
    // empty or non-JSON body
  }
  if (!res.ok) throw new ApiError(res.status, data.message || `Request failed (${res.status}).`, Boolean(data.conflict));
  return data;
}

export function describeError(err) {
  return err?.message || 'Something went wrong.';
}

export const isConflict = (err) => err instanceof ApiError && err.conflict;
export const isAuthError = (err) => err instanceof ApiError && (err.status === 401 || err.status === 403);

/* ---------- base64 ---------- */

function bytesToBase64(bytes) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export const encodeText = (text) => bytesToBase64(new TextEncoder().encode(text));

/* ---------- session ---------- */

function tryStorage(fn) {
  try {
    return fn();
  } catch {
    return null;
  }
}

export function loadSession() {
  return tryStorage(() => localStorage.getItem(SESSION_KEY)) ||
    tryStorage(() => sessionStorage.getItem(SESSION_KEY));
}

export function saveSession(token, remember) {
  clearSession();
  tryStorage(() => (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, token));
}

export function clearSession() {
  tryStorage(() => localStorage.removeItem(SESSION_KEY));
  tryStorage(() => sessionStorage.removeItem(SESSION_KEY));
}

// Exchanges a Google ID token for an admin session. Resolves to { token, user }.
export const signIn = (credential) => request('/session', { method: 'POST', body: { credential } });

// Resolves to { user } if the session is valid and the email is still an admin.
export const checkSession = (token) => request('/session', { token });

/* ---------- files ---------- */

export const getFile = (token, path) => request(`/file?path=${encodeURIComponent(path)}`, { token });

export const putFile = (token, path, content, message, sha) =>
  request('/file', { method: 'PUT', token, body: { path, content, message, sha } });

// Uploads an image and resolves to its repo path (public/images/uploads/...).
export async function uploadImage(token, file) {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Images must be 5 MB or smaller.');
  const content = bytesToBase64(new Uint8Array(await file.arrayBuffer()));
  const { path } = await request('/upload', { method: 'POST', token, body: { name: file.name, content } });
  return path;
}

// Repo path "public/images/x.png" -> site URL "/images/x.png".
export const publicUrl = (repoPath) => repoPath.replace(/^public(?=\/)/, '');
