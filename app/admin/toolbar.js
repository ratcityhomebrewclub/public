'use client';

// Text edits: each takes (value, selStart, selEnd) and returns the new value
// plus the selection to restore.

export const wrap = (before, after, placeholder) => (value, s, e) => {
  const inner = value.slice(s, e) || placeholder;
  const start = s + before.length;
  return {
    value: value.slice(0, s) + before + inner + after + value.slice(e),
    start,
    end: start + inner.length,
  };
};

// Toggles a prefix on every line touched by the selection.
export const prefixLines = (prefix) => (value, s, e) => {
  const lineStart = s === 0 ? 0 : value.lastIndexOf('\n', s - 1) + 1;
  const nl = value.indexOf('\n', e);
  const lineEnd = nl === -1 ? value.length : nl;
  const lines = value.slice(lineStart, lineEnd).split('\n');
  const allPrefixed = lines.every((l) => l.startsWith(prefix));
  const block = lines
    .map((l) => (allPrefixed ? l.slice(prefix.length) : prefix + l))
    .join('\n');
  return {
    value: value.slice(0, lineStart) + block + value.slice(lineEnd),
    start: lineStart + block.length,
    end: lineStart + block.length,
  };
};

export const link = (value, s, e) => {
  const label = value.slice(s, e) || 'link text';
  const url = 'https://';
  const start = s + label.length + 3;
  return {
    value: `${value.slice(0, s)}[${label}](${url})${value.slice(e)}`,
    start,
    end: start + url.length,
  };
};

// Inserts a snippet on its own line, replacing the selection.
export const insertBlock = (snippet) => (value, s, e) => {
  const before = value.slice(0, s);
  const after = value.slice(e);
  const lead = before && !before.endsWith('\n') ? '\n' : '';
  const trail = after.startsWith('\n') ? '' : '\n';
  const pos = s + lead.length + snippet.length + trail.length;
  return { value: before + lead + snippet + trail + after, start: pos, end: pos };
};

const BUTTONS = [
  { label: 'B', title: 'Bold', className: 'font-bold', edit: wrap('**', '**', 'bold text') },
  { label: 'I', title: 'Italic', className: 'italic font-serif', edit: wrap('_', '_', 'italic text') },
  { label: 'H', title: 'Heading', className: 'font-display font-bold', edit: prefixLines('## ') },
  { label: 'Link', title: 'Link', edit: link },
  { label: '• List', title: 'Bulleted list', edit: prefixLines('- ') },
];

export default function Toolbar({ onEdit, onImage, uploading }) {
  const btn = 'px-2.5 py-1 text-sm rounded border border-brew-border bg-brew-surface text-[#e5e5e5] hover:border-brew-amber hover:text-brew-amber-glow transition-colors disabled:opacity-50';
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Formatting">
      {BUTTONS.map((b) => (
        <button
          key={b.title}
          type="button"
          title={b.title}
          aria-label={b.title}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onEdit(b.edit)}
          className={`${btn} ${b.className || ''}`}
        >
          {b.label}
        </button>
      ))}
      <button type="button" title="Upload image" onClick={onImage} disabled={uploading} className={btn}>
        {uploading ? 'Uploading…' : 'Image'}
      </button>
    </div>
  );
}
