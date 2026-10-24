'use client';
import { useEffect, useRef, useState } from 'react';
import site from 'config/site';
import { adminsFileUrl } from './api';

const GSI_SRC = 'https://accounts.google.com/gsi/client';

// Loads Google Identity Services once.
function loadGsi() {
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let script = document.querySelector(`script[src="${GSI_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = GSI_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Could not load Google sign-in. Check your connection or ad blocker.')));
  });
}

export default function Login({ onSignIn, initialError = '' }) {
  const buttonRef = useRef(null);
  const rememberRef = useRef(false);
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);

  rememberRef.current = remember;

  useEffect(() => {
    let cancelled = false;
    loadGsi()
      .then(() => {
        if (cancelled || !buttonRef.current) return;
        window.google.accounts.id.initialize({
          client_id: site.admin.googleClientId,
          callback: async ({ credential }) => {
            setBusy(true);
            setError('');
            try {
              await onSignIn(credential, rememberRef.current);
            } catch (err) {
              setError(err.message || 'Sign in failed.');
              setBusy(false);
            }
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'signin_with',
        });
      })
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [onSignIn]);

  return (
    <div className="brew-card-flat max-w-xl mx-auto p-6 md:p-8">
      <p className="brew-label mb-2">Officers only</p>
      <h1 className="text-3xl md:text-4xl mb-3">Sign in to edit</h1>
      <p className="text-sm text-brew-muted mb-6">
        Sign in with the Google account on the club&apos;s admin list. Edits are saved to the
        club&apos;s GitHub repository and go live a minute or two later.
      </p>

      <div className="space-y-5">
        <div ref={buttonRef} className={`min-h-[44px] ${busy ? 'opacity-50 pointer-events-none' : ''}`} />

        <label className="flex items-start gap-2 text-sm text-[#e5e5e5] cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="mt-1 accent-[#d97706]"
          />
          <span>
            Keep me signed in on this device
            <span className="block text-xs text-brew-muted">Only on a personal device. Otherwise you&apos;ll be signed out when this tab closes.</span>
          </span>
        </label>

        {busy && <p className="text-sm text-brew-muted">Checking the admin list…</p>}

        {error && (
          <p role="alert" className="text-sm rounded-md border border-red-800 bg-red-950/40 text-red-300 px-3 py-2">
            {error}
          </p>
        )}

        <p className="text-xs text-brew-muted border-t border-brew-border pt-4">
          Need access? Ask an existing admin to add your email under <strong>Admins</strong>, or
          edit{' '}
          <a href={adminsFileUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {site.admin.adminsFile}
          </a>{' '}
          in the repository.
        </p>
      </div>
    </div>
  );
}
