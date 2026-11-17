import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Loader2,
  Plus,
  Star,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { uploadImage } from '../../api/adminClient';
import { resolveMediaUrl } from '../../catalog/media';
import { ICON_NAMES, iconFor } from '../../catalog/icons';

// Building blocks shared by the admin Products, Courses and Events screens.

export const ui = {
  input: {
    width: '100%',
    padding: '9px 11px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    color: '#0f172a',
    background: '#ffffff',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  label: { display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13.5px', fontWeight: 700, color: '#334155' },
  hint: { fontSize: '12.5px', fontWeight: 500, color: '#64748b' },
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '18px 20px',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
  },
  sectionTitle: { fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' },
  button: (tone = 'default') => {
    const tones = {
      primary: { background: '#0f172a', color: '#ffffff', border: '1px solid #0f172a' },
      gold: { background: '#c59b27', color: '#ffffff', border: '1px solid #b4891a' },
      danger: { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' },
      default: { background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1' }
    };
    return {
      ...tones[tone],
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 700,
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    };
  },
  iconButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '7px',
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#334155',
    cursor: 'pointer',
    padding: 0
  },
  grid: (min = 220) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}px), 1fr))`,
    gap: '14px'
  })
};

// ── Small helpers ───────────────────────────────────────────

/** "Reiki Level 2 Workshop" -> "reiki-level-2-workshop" */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

export function paiseToRupees(paise) {
  if (!Number.isFinite(paise)) return '';
  const rupees = paise / 100;
  return Number.isInteger(rupees) ? String(rupees) : rupees.toFixed(2);
}

/** '' -> null; invalid -> NaN; otherwise whole paise */
export function rupeesToPaise(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 1) return NaN;
  return Math.round(num * 100);
}

/** Server field errors ("data.images.0") -> one readable list */
export function describeErrors(fields) {
  if (!fields) return [];
  return Object.entries(fields).map(([name, message]) => {
    const pretty = name.replace(/^(data|privateData)\./, '').replace(/\.(\d+)/g, (_, n) => ` #${Number(n) + 1}`);
    return `${pretty}: ${message}`;
  });
}

// ── Layout pieces ───────────────────────────────────────────

export function Field({ label, hint, children, span }) {
  return (
    <label style={{ ...ui.label, gridColumn: span ? '1 / -1' : undefined }}>
      <span>{label}</span>
      {children}
      {hint && <span style={ui.hint}>{hint}</span>}
    </label>
  );
}

export function TextField({ label, hint, value, onChange, span, multiline = false, rows = 4, ...rest }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <Field label={label} hint={hint} span={span}>
      <Tag
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        rows={multiline ? rows : undefined}
        style={{ ...ui.input, ...(multiline ? { resize: 'vertical', lineHeight: 1.5 } : {}) }}
        {...rest}
      />
    </Field>
  );
}

export function Toggle({ label, hint, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14.5px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
      <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} style={{ width: '18px', height: '18px', marginTop: '2px' }} />
      <span>
        {label}
        {hint && <span style={{ ...ui.hint, display: 'block' }}>{hint}</span>}
      </span>
    </label>
  );
}

export function Section({ title, description, children }) {
  return (
    <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <h3 style={{ ...ui.sectionTitle, margin: 0 }}>{title}</h3>
        {description && <p style={{ ...ui.hint, margin: '4px 0 0', fontSize: '13.5px' }}>{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function Notice({ tone = 'info', children, onClose }) {
  const tones = {
    error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', Icon: AlertCircle },
    success: { background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', Icon: CheckCircle2 },
    info: { background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e3a8a', Icon: AlertCircle }
  };
  const { Icon, ...style } = tones[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} style={{ ...style, padding: '10px 14px', borderRadius: '10px', fontSize: '14.5px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <Icon size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
          <X size={16} />
        </button>
      )}
    </div>
  );
}

/** Full-screen editor with a sticky Save / Cancel bar. */
export function EditorPanel({ title, subtitle, onClose, onSave, saving, error, errors, children, saveLabel = 'Save' }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(15, 23, 42, 0.55)', display: 'flex', justifyContent: 'flex-end' }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width: 'min(980px, 100%)', height: '100%', background: '#f8fafc', display: 'flex', flexDirection: 'column', boxShadow: '-12px 0 40px rgba(15, 23, 42, 0.25)' }}
      >
        <header style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 22px', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: '#0f172a' }}>{title}</h2>
            {subtitle && <p style={{ margin: '2px 0 0', fontSize: '13.5px', color: '#64748b' }}>{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} style={ui.button()} disabled={saving}>Cancel</button>
          <button type="button" onClick={onSave} style={ui.button('gold')} disabled={saving}>
            {saving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
            {saveLabel}
          </button>
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 60px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <Notice tone="error">
              <strong>{error}</strong>
              {errors?.length > 0 && (
                <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
                  {errors.map((e) => <li key={e}>{e}</li>)}
                </ul>
              )}
            </Notice>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Images ──────────────────────────────────────────────────

/**
 * An ordered list of photos: upload several at once, remove, and move left /
 * right to set the order. The first photo is the main one (cards, listings).
 */
export function ImageListEditor({ images, onChange, max = 30, single = false, label = 'Photos' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState(null);

  const addFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setError(null);
    const room = single ? 1 : Math.max(0, max - images.length);
    const chosen = files.slice(0, room);
    if (files.length > chosen.length) setError(`Only ${max} photos are allowed; the extra ones were skipped.`);
    setUploading(chosen.length);
    const added = [];
    for (const file of chosen) {
      const res = await uploadImage(file);
      setUploading((n) => n - 1);
      if (res.success) added.push(res.data);
      else setError(`${file.name}: ${res.message}`);
    }
    if (added.length) onChange(single ? [added[0]] : [...images, ...added]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const move = (from, to) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const remove = (index) => onChange(images.filter((_, i) => i !== index));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
        {images.map((image, index) => (
          <figure
            key={`${image.url}-${index}`}
            style={{ margin: 0, border: index === 0 && !single ? '2px solid #c59b27' : '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#ffffff' }}
          >
            <div style={{ position: 'relative', aspectRatio: '1 / 1', background: '#f1f5f9' }}>
              <img src={resolveMediaUrl(image.url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              {index === 0 && !single && (
                <span style={{ position: 'absolute', top: '6px', left: '6px', background: '#c59b27', color: '#fff', fontSize: '11.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                  <Star size={11} fill="#fff" /> Main
                </span>
              )}
            </div>
            <figcaption style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', padding: '6px' }}>
              {!single && (
                <span style={{ display: 'flex', gap: '4px' }}>
                  <button type="button" style={ui.iconButton} onClick={() => move(index, index - 1)} disabled={index === 0} aria-label={`Move photo ${index + 1} earlier`} title="Move earlier">
                    <ArrowLeft size={15} />
                  </button>
                  <button type="button" style={ui.iconButton} onClick={() => move(index, index + 1)} disabled={index === images.length - 1} aria-label={`Move photo ${index + 1} later`} title="Move later">
                    <ArrowRight size={15} />
                  </button>
                </span>
              )}
              {!single && index > 0 && (
                <button type="button" style={{ ...ui.iconButton, width: 'auto', padding: '0 6px', fontSize: '11.5px', fontWeight: 700 }} onClick={() => move(index, 0)} title="Make this the main photo">
                  Main
                </button>
              )}
              <button type="button" style={{ ...ui.iconButton, color: '#b91c1c', borderColor: '#fecaca' }} onClick={() => remove(index)} aria-label={`Remove photo ${index + 1}`} title="Remove">
                <Trash2 size={15} />
              </button>
            </figcaption>
          </figure>
        ))}

        {(single ? images.length === 0 : images.length < max) && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading > 0}
            style={{ aspectRatio: '1 / 1', border: '2px dashed #cbd5e1', borderRadius: '10px', background: '#f8fafc', color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 700 }}
          >
            {uploading > 0 ? <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} /> : <ImagePlus size={24} />}
            {uploading > 0 ? `Uploading ${uploading}…` : single ? 'Add photo' : 'Add photos'}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={!single}
        hidden
        onChange={(e) => addFiles(e.target.files)}
        aria-label={label}
      />
      <span style={ui.hint}>
        {single
          ? 'JPEG, PNG or WebP. Large photos are resized automatically.'
          : `JPEG, PNG or WebP. Select several at once. The first photo is the main one; use the arrows to change the order. ${images.length}/${max} photos.`}
      </span>
      {error && <Notice tone="error" onClose={() => setError(null)}>{error}</Notice>}
    </div>
  );
}

// ── Lists ───────────────────────────────────────────────────

/** Rows of text (optionally with an icon), with add / remove / reorder. */
export function ListEditor({ items, onChange, placeholder, withIcon = false, multiline = false, addLabel = 'Add item', max = 30 }) {
  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const move = (from, to) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item, index) => {
        const Icon = withIcon ? iconFor(item.icon) : null;
        return (
          <div key={index} style={{ display: 'flex', gap: '6px', alignItems: multiline ? 'flex-start' : 'center' }}>
            {withIcon && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ ...ui.iconButton, cursor: 'default', color: '#b45309' }} aria-hidden="true"><Icon size={16} /></span>
                <select
                  value={item.icon || ''}
                  onChange={(e) => update(index, { icon: e.target.value })}
                  style={{ ...ui.input, width: '128px', padding: '7px 6px', fontSize: '13.5px' }}
                  aria-label="Icon"
                >
                  <option value="">Auto icon</option>
                  {ICON_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
                </select>
              </span>
            )}
            {multiline ? (
              <textarea value={item.text} rows={3} onChange={(e) => update(index, { text: e.target.value })} placeholder={placeholder} style={{ ...ui.input, flex: 1, resize: 'vertical', lineHeight: 1.5 }} />
            ) : (
              <input value={item.text} onChange={(e) => update(index, { text: e.target.value })} placeholder={placeholder} style={{ ...ui.input, flex: 1 }} />
            )}
            <button type="button" style={ui.iconButton} onClick={() => move(index, index - 1)} disabled={index === 0} aria-label="Move up"><ChevronUp size={15} /></button>
            <button type="button" style={ui.iconButton} onClick={() => move(index, index + 1)} disabled={index === items.length - 1} aria-label="Move down"><ChevronDown size={15} /></button>
            <button type="button" style={{ ...ui.iconButton, color: '#b91c1c', borderColor: '#fecaca' }} onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label="Remove"><Trash2 size={15} /></button>
          </div>
        );
      })}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, { text: '', icon: '' }])} style={{ ...ui.button(), alignSelf: 'flex-start' }}>
          <Plus size={15} /> {addLabel}
        </button>
      )}
    </div>
  );
}

/** Label / value rows (product specifications). */
export function PairListEditor({ items, onChange, max = 30 }) {
  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 2fr auto', gap: '6px', alignItems: 'center' }}>
          <input value={item.label} onChange={(e) => update(index, { label: e.target.value })} placeholder="e.g. Bead size" style={ui.input} aria-label="Detail name" />
          <input value={item.value} onChange={(e) => update(index, { value: e.target.value })} placeholder="e.g. 8 mm" style={ui.input} aria-label="Detail value" />
          <button type="button" style={{ ...ui.iconButton, color: '#b91c1c', borderColor: '#fecaca' }} onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label="Remove"><Trash2 size={15} /></button>
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, { label: '', value: '' }])} style={{ ...ui.button(), alignSelf: 'flex-start' }}>
          <Plus size={15} /> Add detail
        </button>
      )}
    </div>
  );
}

// Lists are edited as { text, icon } rows and stored in each item's own shape
export const toRows = (list, key) => (list || []).map((item) => (typeof item === 'string' ? { text: item, icon: '' } : { text: item[key] || '', icon: item.icon || '' }));
export const fromRows = (rows, key) => rows.map((row) => ({ [key]: row.text.trim(), icon: row.icon || '' })).filter((row) => row[key]);
export const textsFromRows = (rows) => rows.map((row) => row.text.trim()).filter(Boolean);

/** Status chip used in the lists. */
export function Chip({ tone = 'slate', children }) {
  const tones = {
    slate: ['#f1f5f9', '#475569'],
    green: ['#ecfdf5', '#047857'],
    amber: ['#fef3c7', '#92400e'],
    red: ['#fef2f2', '#b91c1c'],
    blue: ['#eff6ff', '#1d4ed8'],
    gold: ['#fdf6e3', '#8a6514']
  };
  const [background, color] = tones[tone] || tones.slate;
  return (
    <span style={{ background, color, fontSize: '12px', fontWeight: 750, padding: '2px 9px', borderRadius: '999px', whiteSpace: 'nowrap' }}>{children}</span>
  );
}
