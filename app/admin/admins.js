'use client';
import { useCallback, useEffect, useState } from 'react';
import { describeError, getAdmins, isConflict, putAdmins } from './api';
import { Notice } from './editor';

const EMAIL = /^[^\s@#]+@[^\s@#]+\.[^\s@#]+$/;

export default function Admins({ token, user, onDirtyChange }) {
  const [status, setStatus] = useState('loading');
  const [loadError, setLoadError] = useState('');
  const [emails, setEmails] = useState([]);
  const [original, setOriginal] = useState([]);
  const [sha, setSha] = useState(null);
  const [input, setInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [conflict, setConflict] = useState(false);
  const [saved, setSaved] = useState(false);

  const self = user?.email?.toLowerCase();
  const dirty = status === 'ready' && emails.join('\n') !== original.join('\n');

  const load = useCallback(async () => {
    setStatus('loading');
    setLoadError('');
    setSaveError('');
    setConflict(false);
    setSaved(false);
    try {
      const res = await getAdmins(token);
      setEmails(res.emails);
      setOriginal(res.emails);
      setSha(res.sha);
      setStatus('ready');
    } catch (err) {
      setLoadError(describeError(err));
      setStatus('error');
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  function add(e) {
    e.preventDefault();
    const email = input.trim().toLowerCase();
    if (!EMAIL.test(email)) {
      setInputError('Enter a full email address, like name@gmail.com.');
      return;
    }
    if (emails.includes(email)) {
      setInputError(`${email} is already an admin.`);
      return;
    }
    setEmails([...emails, email]);
    setInput('');
    setInputError('');
    setSaved(false);
  }

  function remove(email) {
    setEmails(emails.filter((e) => e !== email));
    setSaved(false);
  }

  async function save() {
    if (saving || !dirty) return;
    setSaving(true);
    setSaveError('');
    setConflict(false);
    try {
      const res = await putAdmins(token, emails, sha);
      setEmails(res.emails);
      setOriginal(res.emails);
      setSha(res.sha);
      setSaved(true);
    } catch (err) {
      if (isConflict(err)) setConflict(true);
      else setSaveError(describeError(err));
    } finally {
      setSaving(false);
    }
  }

  if (status === 'loading') return <p className="text-sm text-brew-muted">Loading admins…</p>;
  if (status === 'error') {
    return (
      <div className="max-w-xl flex flex-col gap-3">
        <Notice tone="error">{loadError}</Notice>
        <button type="button" onClick={load} className="brew-btn-outline px-3 py-1 text-sm self-start">Try again</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl flex flex-col gap-4">
      <p className="text-sm text-brew-muted m-0">
        Admins sign in here with their Google account and can edit every page, upload images, and change this list.
        Changes take effect as soon as you save. The list is stored in the public repository, so anyone can see it.
      </p>

      <ul className="brew-card-flat divide-y divide-brew-border m-0 p-0 list-none">
        {emails.map((email) => (
          <li key={email} className="flex items-center justify-between gap-3 px-4 py-2.5 min-w-0">
            <span className="text-sm text-[#e5e5e5] break-all">
              {email}
              {email === self && <span className="text-brew-muted"> (you)</span>}
              {!original.includes(email) && <span className="text-brew-amber-light"> · new</span>}
            </span>
            {email !== self && (
              <button
                type="button"
                onClick={() => remove(email)}
                aria-label={`Remove ${email}`}
                className="text-sm text-red-300 hover:text-red-200 underline underline-offset-2 shrink-0"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="flex flex-wrap gap-2">
        <label htmlFor="new-admin" className="sr-only">Email address</label>
        <input
          id="new-admin"
          type="email"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setInputError('');
          }}
          placeholder="name@gmail.com"
          autoComplete="off"
          className="flex-1 min-w-0 basis-56 rounded-md border border-brew-border bg-brew-surface px-3 py-1.5 text-sm text-[#e5e5e5] focus:outline-none focus:border-brew-amber"
        />
        <button type="submit" className="brew-btn-outline px-4 py-1.5 text-sm">Add</button>
      </form>
      {inputError && <Notice tone="error">{inputError}</Notice>}

      {original.filter((e) => !emails.includes(e)).length > 0 && (
        <Notice tone="warn">
          Will remove: {original.filter((e) => !emails.includes(e)).join(', ')}
        </Notice>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={!dirty || saving} className="brew-btn px-4 py-1.5 text-sm disabled:opacity-50">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {dirty && !saving && (
          <button
            type="button"
            onClick={() => {
              setEmails(original);
              setSaved(false);
            }}
            className="text-sm underline underline-offset-2"
          >
            Discard
          </button>
        )}
      </div>

      {saved && !dirty && <Notice tone="success">Admin list saved.</Notice>}
      {saveError && <Notice tone="error">{saveError}</Notice>}
      {conflict && (
        <Notice tone="warn">
          Someone else changed the admin list since you opened it.{' '}
          <button type="button" onClick={load} className="underline underline-offset-2">Reload the list</button>
          {' '}and make your changes again.
        </Notice>
      )}
    </div>
  );
}
