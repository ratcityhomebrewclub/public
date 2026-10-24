'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import pages from 'config/pages';
import site from 'config/site';
import Login from './login';
import Editor from './editor';
import Admins from './admins';
import { checkSession, clearSession, configured, loadSession, repoSlug, repoUrl, saveSession, signIn as createSession } from './api';

function PageList({ onSelect }) {
  return (
    <div>
      <p className="text-sm text-brew-muted mb-4">Pick a page to edit. Changes go live a minute or two after you save.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((p) => (
          <div key={p.slug} className="brew-card-flat p-4 flex flex-col gap-3 min-w-0">
            <div className="min-w-0">
              <h3 className="text-xl m-0">{p.title}</h3>
              <code className="text-xs text-brew-muted break-all">{site.contentDir}/{p.file}</code>
            </div>
            <div className="flex items-center gap-3 mt-auto">
              <button type="button" onClick={() => onSelect(p.slug)} className="brew-btn px-4 py-1.5 text-sm">
                Edit
              </button>
              <Link href={p.href} target="_blank" className="text-sm underline underline-offset-2">
                View page ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="brew-card-flat max-w-xl mx-auto p-6 md:p-8">
      <p className="brew-label mb-2">Setup needed</p>
      <h1 className="text-3xl mb-3">Admin isn&apos;t configured yet</h1>
      <p className="text-sm text-brew-muted">
        Set <code>admin.apiUrl</code> and <code>admin.googleClientId</code> in{' '}
        <code>app/config/site.js</code>. See <code>worker/README.md</code> for the one-time setup.
      </p>
    </div>
  );
}

export default function AdminPage() {
  // checking -> signedOut | signedIn
  const [status, setStatus] = useState('checking');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('pages');
  const dirtyRef = useRef(false);

  // Restore a saved session, if it still works.
  useEffect(() => {
    const saved = configured && loadSession();
    if (!saved) {
      setStatus('signedOut');
      return;
    }
    checkSession(saved)
      .then(({ user: u }) => {
        setToken(saved);
        setUser(u);
        setStatus('signedIn');
      })
      .catch((err) => {
        clearSession();
        if (err.status !== 401) setError(err.message);
        setStatus('signedOut');
      });
  }, []);

  const signIn = useCallback(async (credential, remember) => {
    const { token: t, user: u } = await createSession(credential);
    saveSession(t, remember);
    setToken(t);
    setUser(u);
    setError('');
    setStatus('signedIn');
  }, []);

  function signOut() {
    if (dirtyRef.current && !window.confirm('You have unsaved changes. Sign out anyway?')) return;
    clearSession();
    window.google?.accounts?.id?.disableAutoSelect();
    dirtyRef.current = false;
    setToken(null);
    setUser(null);
    setSelected(null);
    setView('pages');
    setStatus('signedOut');
  }

  function go(next) {
    if (next === view && !selected) return;
    if (dirtyRef.current && !window.confirm('You have unsaved changes. Leave anyway?')) return;
    dirtyRef.current = false;
    setSelected(null);
    setView(next);
  }

  const onDirtyChange = useCallback((d) => {
    dirtyRef.current = d;
  }, []);

  const page = pages.find((p) => p.slug === selected);

  return (
    <div className="pt-24 md:pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {status === 'checking' && (
          <p className="text-brew-muted text-sm text-center py-20">Checking your sign-in…</p>
        )}

        {status === 'signedOut' && !configured && <NotConfigured />}
        {status === 'signedOut' && configured && <Login key={error} onSignIn={signIn} initialError={error} />}

        {status === 'signedIn' && (
          <>
            <header className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-brew-border">
              <div className="min-w-0">
                <p className="brew-label m-0">Site admin</p>
                <p className="text-sm text-brew-muted m-0">
                  Editing{' '}
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="break-all">{repoSlug}</a>
                  {' '}on <code>{site.repo.branch}</code>
                </p>
              </div>
              <div className="flex items-center gap-3">
                {user && (
                  <span className="flex items-center gap-2 text-sm text-[#e5e5e5] min-w-0" title={user.email}>
                    {user.picture && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.picture} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full border border-brew-border" />
                    )}
                    <span className="truncate">{user.name || user.email}</span>
                  </span>
                )}
                <button type="button" onClick={signOut} className="brew-btn-outline px-3 py-1 text-sm">
                  Sign out
                </button>
              </div>
            </header>

            <nav className="flex gap-2 mb-6" aria-label="Admin sections">
              {[['pages', 'Pages'], ['admins', 'Admins']].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => go(id)}
                  aria-current={view === id ? 'page' : undefined}
                  className={`${view === id ? 'brew-btn' : 'brew-btn-outline'} px-4 py-1.5 text-sm`}
                >
                  {label}
                </button>
              ))}
            </nav>

            {view === 'admins' ? (
              <Admins token={token} user={user} onDirtyChange={onDirtyChange} />
            ) : page ? (
              <Editor
                key={page.slug}
                token={token}
                page={page}
                onBack={() => {
                  dirtyRef.current = false;
                  setSelected(null);
                }}
                onDirtyChange={onDirtyChange}
              />
            ) : (
              <PageList onSelect={setSelected} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
