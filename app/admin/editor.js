'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import site from 'config/site';
import { withBase } from 'core/paths';
import Toolbar, { insertBlock } from './toolbar';
import {
  MAX_UPLOAD_BYTES, actionsUrl, describeError, encodeText, getFile,
  isAuthError, isConflict, publicUrl, putFile, uploadImage,
} from './api';

function Notice({ tone = 'info', children }) {
  const tones = {
    info: 'border-brew-border bg-brew-surface text-[#e5e5e5]',
    success: 'border-lime-800 bg-lime-950/40 text-lime-200',
    error: 'border-red-800 bg-red-950/40 text-red-300',
    warn: 'border-amber-700 bg-amber-950/40 text-amber-200',
  };
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`text-sm rounded-md border px-3 py-2 ${tones[tone]}`}>
      {children}
    </div>
  );
}

function altFromName(name) {
  return name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/[[\]]/g, '').trim() || 'image';
}

export default function Editor({ token, page, onBack, onDirtyChange }) {
  const path = `${site.contentDir}/${page.file}`;
  const defaultMessage = `Update ${page.title} via admin`;

  const [status, setStatus] = useState('loading');
  const [loadError, setLoadError] = useState('');
  const [text, setText] = useState('');
  const [original, setOriginal] = useState('');
  const [sha, setSha] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [conflict, setConflict] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('write');
  const [uploading, setUploading] = useState(false);
  const [uploadNote, setUploadNote] = useState(null);
  const [previews, setPreviews] = useState({});

  const textareaRef = useRef(null);
  const fileRef = useRef(null);
  const previewsRef = useRef(previews);
  previewsRef.current = previews;

  const dirty = status === 'ready' && text !== original;

  const load = useCallback(async () => {
    setStatus('loading');
    setLoadError('');
    setConflict(false);
    setSaveError('');
    setSaveResult(null);
    setCopied(false);
    try {
      const file = await getFile(token, path);
      setText(file.text);
      setOriginal(file.text);
      setSha(file.sha);
      setIsNew(file.isNew);
      setStatus('ready');
    } catch (err) {
      setLoadError(describeError(err));
      setStatus('error');
    }
  }, [token, path]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  // Free object URLs for uploaded-image previews.
  useEffect(() => () => {
    Object.values(previewsRef.current).forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const save = useCallback(async () => {
    if (saving || !dirty) return;
    const snapshot = text;
    setSaving(true);
    setSaveError('');
    setSaveResult(null);
    setConflict(false);
    setCopied(false);
    try {
      const res = await putFile(token, path, encodeText(snapshot), message.trim() || defaultMessage, sha);
      setSha(res.content.sha);
      setOriginal(snapshot);
      setIsNew(false);
      setSaveResult({ commitUrl: res.commit?.html_url });
    } catch (err) {
      if (isConflict(err)) setConflict(true);
      else if (isAuthError(err)) setSaveError(`${describeError(err)} Copy your text somewhere safe before signing out and back in.`);
      else setSaveError(describeError(err));
    } finally {
      setSaving(false);
    }
  }, [saving, dirty, text, token, path, message, defaultMessage, sha]);

  // Ctrl/Cmd+S saves.
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  function applyEdit(edit) {
    const ta = textareaRef.current;
    if (!ta) return;
    const next = edit(ta.value, ta.selectionStart, ta.selectionEnd);
    setText(next.value);
    setTab('write');
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(next.start, next.end);
    });
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadNote({ tone: 'error', text: 'That file is not an image.' });
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadNote({ tone: 'error', text: `That image is ${(file.size / 1048576).toFixed(1)} MB. The limit is 5 MB, so resize it first.` });
      return;
    }
    setUploading(true);
    setUploadNote(null);
    try {
      const url = publicUrl(await uploadImage(token, file));
      setPreviews((p) => ({ ...p, [url]: URL.createObjectURL(file) }));
      applyEdit(insertBlock(`![${altFromName(file.name)}](${url})`));
      setUploadNote({
        tone: 'success',
        text: `Uploaded to ${url}. The preview uses your local copy; the image appears on the live site once it redeploys. Edit the text in [ ] to describe the image.`,
      });
    } catch (err) {
      setUploadNote({ tone: 'error', text: `Upload failed: ${describeError(err)}` });
    } finally {
      setUploading(false);
    }
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = textareaRef.current;
      ta?.select();
      document.execCommand('copy');
    }
    setCopied(true);
  }

  function reload() {
    if (dirty && !window.confirm('Discard your edits and load the latest version from GitHub?')) return;
    load();
  }

  function back() {
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) return;
    onBack();
  }

  const components = useMemo(() => {
    function PreviewImage({ src, alt, title }) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={previews[src] || withBase(src)} alt={alt || ''} title={title} />;
    }
    function PreviewLink({ href, title, children }) {
      return <a href={href} title={title} target="_blank" rel="noopener noreferrer">{children}</a>;
    }
    return { img: PreviewImage, a: PreviewLink };
  }, [previews]);

  const paneHeight = 'h-[60vh] min-h-[320px]';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <button type="button" onClick={back} className="text-sm text-brew-amber-light hover:text-brew-amber-glow mb-1">
            ← All pages
          </button>
          <h2 className="text-2xl md:text-3xl m-0 break-words">{page.title}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-brew-muted">
            <code className="break-all">{path}</code>
            <span aria-hidden="true">·</span>
            <Link href={page.href} target="_blank" className="underline underline-offset-2">View live page ↗</Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isNew && status === 'ready' && <span className="brew-badge">New file</span>}
          {dirty && <span className="brew-badge">Unsaved changes</span>}
          {!dirty && saveResult && <span className="brew-badge !text-lime-300 !border-lime-700 !bg-lime-950/40">Saved</span>}
        </div>
      </div>

      {status === 'loading' && <Notice>Loading {path} from GitHub…</Notice>}

      {status === 'error' && (
        <Notice tone="error">
          <p className="text-red-300 mb-2">Couldn&apos;t load {path}: {loadError}</p>
          <button type="button" onClick={load} className="brew-btn-outline px-3 py-1 text-sm">Try again</button>
        </Notice>
      )}

      {status === 'ready' && (
        <>
          {isNew && <Notice tone="warn">{path} doesn&apos;t exist yet. Saving will create it.</Notice>}

          {/* Mobile tabs */}
          <div className="md:hidden flex rounded-md border border-brew-border overflow-hidden" role="tablist">
            {['write', 'preview'].map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold capitalize ${tab === t ? 'bg-brew-amber text-black' : 'bg-brew-surface text-[#e5e5e5]'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Write */}
            <div className={`${tab === 'write' ? 'flex' : 'hidden'} md:flex flex-col gap-2 min-w-0`}>
              <div className="flex items-center justify-between gap-2">
                <Toolbar onEdit={applyEdit} onImage={() => fileRef.current?.click()} uploading={uploading} />
                <span className="hidden md:inline brew-label">Markdown</span>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck
                aria-label={`${page.title} markdown`}
                className={`${paneHeight} w-full resize-y rounded-md bg-brew-surface border border-brew-border p-3 font-mono text-sm leading-relaxed text-[#e5e5e5] focus:outline-none focus:border-brew-amber`}
              />
            </div>

            {/* Preview */}
            <div className={`${tab === 'preview' ? 'flex' : 'hidden'} md:flex flex-col gap-2 min-w-0`}>
              <div className="hidden md:flex items-center justify-end h-[30px]">
                <span className="brew-label">Preview</span>
              </div>
              <div className={`${paneHeight} overflow-auto rounded-md border border-brew-border bg-brew-bg p-4 md:p-5`}>
                {text.trim() ? (
                  <div className="markdown break-words">
                    <ReactMarkdown remarkPlugins={[remarkBreaks]} components={components}>{text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-brew-muted text-sm">Nothing to preview yet.</p>
                )}
              </div>
            </div>
          </div>

          {uploadNote && <Notice tone={uploadNote.tone}>{uploadNote.text}</Notice>}

          {/* Save bar */}
          <div className="brew-card-flat p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1 min-w-0">
                <label htmlFor="commit-msg" className="block text-xs font-semibold text-brew-muted mb-1">
                  Describe your change
                </label>
                <input
                  id="commit-msg"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={defaultMessage}
                  className="w-full rounded-md bg-brew-surface border border-brew-border px-3 py-2 text-sm text-[#e5e5e5] focus:outline-none focus:border-brew-amber"
                />
              </div>
              <button
                type="button"
                onClick={save}
                disabled={!dirty || saving}
                className="brew-btn px-5 py-2 text-sm disabled:opacity-50 disabled:pointer-events-none"
              >
                {saving ? 'Saving…' : 'Save & publish'}
              </button>
            </div>
            <p className="text-xs text-brew-muted">
              Saving commits to <code>{site.repo.branch}</code> and rebuilds the site. Tip: Ctrl/⌘+S saves.
            </p>

            {saveError && <Notice tone="error">Save failed: {saveError}</Notice>}

            {conflict && (
              <Notice tone="warn">
                <p className="text-amber-200 mb-2">
                  This file was changed on GitHub since you opened it, so your save was not applied.
                  Copy your text first if you want to keep it, then reload the latest version.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={copyText} className="brew-btn-outline px-3 py-1 text-sm">
                    {copied ? 'Copied' : 'Copy my text'}
                  </button>
                  <button type="button" onClick={reload} className="brew-btn px-3 py-1 text-sm">
                    Reload from GitHub
                  </button>
                </div>
              </Notice>
            )}

            {saveResult && !dirty && (
              <Notice tone="success">
                Saved
                {saveResult.commitUrl && (
                  <> (<a href={saveResult.commitUrl} target="_blank" rel="noopener noreferrer" className="underline">view commit</a>)</>
                )}
                . The site redeploys in about 1–2 minutes; you can follow it on the{' '}
                <a href={actionsUrl} target="_blank" rel="noopener noreferrer" className="underline">Actions page</a>.
              </Notice>
            )}
          </div>
        </>
      )}
    </div>
  );
}
