import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Download, Loader2, Pencil, Plus, RotateCcw, Trash2, Undo2, Users, X } from 'lucide-react';
import { STATIC_EVENTS, DEFAULT_EVENT_WHATSAPP_GROUP_URL, isEventOver } from '@reiki-vastu/shared/events.js';
import { formatPaise } from '@reiki-vastu/shared/products.js';
import { resolveMediaUrl } from '../../catalog/media';
import { rotatingIcon } from '../../catalog/icons';
import {
  listCatalogItems,
  listAdminProducts,
  saveCatalogItem,
  deleteCatalogItem,
  restoreCatalogItem,
  resetCatalogItem,
  getEventRegistrationSummary,
  listEventRegistrations
} from '../../api/adminClient';
import {
  ui,
  Chip,
  EditorPanel,
  Field,
  ImageListEditor,
  ListEditor,
  Notice,
  Section,
  TextField,
  Toggle,
  describeErrors,
  fromRows,
  paiseToRupees,
  rupeesToPaise,
  slugify,
  textsFromRows,
  toRows
} from './catalogForm';

// Events (workshops): the built-in ones (shared/events.js) merged with those
// added or changed here. Events whose end time has passed are listed under
// "Past events" here and on the website, and can no longer be booked.

const TZ = 'Asia/Kolkata';
const BUILT_IN_IDS = new Set(STATIC_EVENTS.map((e) => e.id));
const isEmpty = (data) => !data || Object.keys(data).length === 0;

// ── Dates (events are always in India time) ──────────────────

/** ISO timestamp -> "YYYY-MM-DDTHH:mm" in India time, for <input type="datetime-local"> */
function toIndiaInput(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() + 330 * 60000).toISOString().slice(0, 16);
}

/** "YYYY-MM-DDTHH:mm" entered as India time -> ISO with +05:30 */
const fromIndiaInput = (value) => (value ? `${value}:00+05:30` : '');

const fmt = (iso, options) => new Date(iso).toLocaleString('en-IN', { timeZone: TZ, ...options });
const dateText = (iso) => fmt(iso, { day: 'numeric', month: 'long', year: 'numeric' });
const timeText = (iso) => fmt(iso, { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();

/** The date / day / time lines shown on the event page, from the start and end times */
function scheduleFrom(startsAt, endsAt) {
  const sameDay = dateText(startsAt) === dateText(endsAt);
  return {
    date: sameDay ? dateText(startsAt) : `${dateText(startsAt)} – ${dateText(endsAt)}`,
    day: sameDay ? fmt(startsAt, { weekday: 'long' }) : `${fmt(startsAt, { weekday: 'short' })} – ${fmt(endsAt, { weekday: 'short' })}`,
    time: `${timeText(startsAt)} – ${timeText(endsAt)}`
  };
}

const formatDateTime = (iso) => (iso ? fmt(iso, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—');

// ── Rows ─────────────────────────────────────────────────────

function mergeRows(docs, legacyPrices) {
  const byId = new Map(docs.map((doc) => [doc.itemId, doc]));
  const rows = STATIC_EVENTS.map((base) => {
    const doc = byId.get(base.id);
    byId.delete(base.id);
    const legacy = legacyPrices.get(base.id);
    const withLegacy = legacy
      ? { ...base, pricePaise: legacy.unitPricePaise, originalPricePaise: legacy.originalPricePaise, registrationOpen: legacy.available }
      : base;
    const edited = doc && !isEmpty(doc.data);
    return {
      id: base.id,
      builtIn: true,
      edited: Boolean(edited || legacy?.isCustomized),
      deleted: Boolean(doc?.deleted),
      data: edited ? { ...withLegacy, ...doc.data } : withLegacy,
      privateData: doc?.privateData || {}
    };
  });
  for (const doc of byId.values()) {
    rows.push({ id: doc.itemId, builtIn: false, edited: true, deleted: doc.deleted, data: doc.data, privateData: doc.privateData || {} });
  }
  return rows.sort((a, b) => new Date(b.data.startsAt) - new Date(a.data.startsAt));
}

// ── Editor ───────────────────────────────────────────────────

const imageToItem = (image) => (image?.src ? [{ url: image.src, width: image.width, height: image.height }] : []);
const itemToImage = (items, alt) => (items[0] ? { src: items[0].url, width: items[0].width || null, height: items[0].height || null, alt } : null);

function formFromRow(row) {
  const d = row?.data || {};
  return {
    id: row?.id || '',
    title: d.title || '',
    tagline: d.tagline || '',
    kicker: d.heroTitle?.kicker || '',
    main: d.heroTitle?.main || '',
    ribbon: d.heroTitle?.ribbon || '',
    startsAt: d.startsAt ? toIndiaInput(d.startsAt) : '',
    endsAt: d.endsAt ? toIndiaInput(d.endsAt) : '',
    mode: d.schedule?.mode || 'Online',
    modeDetail: d.schedule?.modeDetail || 'Live Workshop',
    venue: d.schedule?.venue || '',
    description: toRows(d.description, 'text'),
    benefits: toRows(d.benefits, 'title'),
    whatToExpect: toRows(d.whatToExpect, 'title'),
    priceRupees: paiseToRupees(d.pricePaise),
    originalPriceRupees: paiseToRupees(d.originalPricePaise),
    offerLabel: d.offerLabel || 'Special Offer',
    registrationOpen: d.registrationOpen !== false,
    contacts: (d.contacts || ['8446656677', '9423424596']).join(', '),
    anniversary: d.anniversary || '',
    anniversaryYears: d.anniversaryYears ? String(d.anniversaryYears) : '',
    poster: imageToItem(d.image),
    photo: d.art?.heroMain && d.art.heroMain.src !== d.image?.src ? imageToItem(d.art.heroMain) : [],
    whatsappGroupUrl: row ? row.privateData?.whatsappGroupUrl || '' : DEFAULT_EVENT_WHATSAPP_GROUP_URL
  };
}

const withIcons = (items) => items.map((item, i) => ({ ...item, icon: item.icon || rotatingIcon(i) }));

function EventEditor({ row, onClose, onSaved }) {
  const isNew = !row;
  const [form, setForm] = useState(() => formFromRow(row));
  const [idTouched, setIdTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);

  const set = (key) => (value) =>
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (isNew && !idTouched && (key === 'title' || key === 'startsAt')) {
        next.id = slugify(`${next.title} ${next.startsAt.slice(0, 7)}`);
      }
      return next;
    });

  const save = async () => {
    setError(null);
    setErrors([]);
    const pricePaise = rupeesToPaise(form.priceRupees);
    const originalPricePaise = rupeesToPaise(form.originalPriceRupees);
    const problems = [];
    if (!form.title.trim()) problems.push('Please enter the event title.');
    if (!form.id) problems.push('Please enter a web address id.');
    if (!form.startsAt || !form.endsAt) problems.push('Please enter the start and end date & time.');
    else if (form.endsAt <= form.startsAt) problems.push('The end must be after the start.');
    if (Number.isNaN(pricePaise)) problems.push('Fee must be at least ₹1 (or empty if not yet decided).');
    if (Number.isNaN(originalPricePaise)) problems.push('Actual fee must be empty or at least ₹1.');
    if (!form.poster.length) problems.push('Please add the event poster.');
    if (problems.length) {
      setError('Please fix the following:');
      setErrors(problems);
      return;
    }

    const startsAt = fromIndiaInput(form.startsAt);
    const endsAt = fromIndiaInput(form.endsAt);
    const title = form.title.trim();
    const isOnline = form.mode === 'Online';
    const previous = row?.data || {};
    const photo = itemToImage(form.photo, `${title}`);
    const years = Number.parseInt(form.anniversaryYears, 10);

    const data = {
      ...previous,
      title,
      tagline: form.tagline.trim(),
      heroTitle: { kicker: form.kicker.trim(), main: form.main.trim(), ribbon: form.ribbon.trim() },
      startsAt,
      endsAt,
      schedule: {
        ...scheduleFrom(startsAt, endsAt),
        mode: form.mode,
        modeDetail: form.modeDetail.trim(),
        venue: isOnline ? '' : form.venue.trim(),
        isOnline
      },
      description: textsFromRows(form.description),
      benefits: withIcons(fromRows(form.benefits, 'title')),
      whatToExpect: withIcons(fromRows(form.whatToExpect, 'title')),
      pricePaise,
      originalPricePaise,
      offerLabel: form.offerLabel.trim(),
      registrationOpen: form.registrationOpen,
      contacts: form.contacts.split(/[,\n]/).map((c) => c.trim()).filter(Boolean),
      anniversary: form.anniversary.trim(),
      anniversaryYears: Number.isInteger(years) && years > 0 ? years : null,
      image: itemToImage(form.poster, `Poster for ${title}`),
      art: { ...(previous.art || {}) }
    };
    // Without a separate photo, the event page shows the poster beside the title
    if (photo) data.art.heroMain = photo;
    else delete data.art.heroMain;
    delete data.id;

    setSaving(true);
    const res = await saveCatalogItem('event', form.id, {
      data,
      privateData: { whatsappGroupUrl: form.whatsappGroupUrl.trim() },
      isNew
    });
    setSaving(false);
    if (!res.success) {
      setError(res.message || 'Could not save.');
      setErrors(describeErrors(res.fields));
      return;
    }
    onSaved(`Saved “${title}”.`);
  };

  return (
    <EditorPanel
      title={isNew ? 'Add an event' : `Edit ${row.data.title}`}
      subtitle={isNew ? 'It appears on the Events page as soon as you save, and moves to “Past events” after it ends.' : `Web address id: ${row.id}`}
      onClose={onClose}
      onSave={save}
      saving={saving}
      error={error}
      errors={errors}
      saveLabel={isNew ? 'Add event' : 'Save changes'}
    >
      <Section title="Pictures">
        <div style={ui.grid(260)}>
          <Field label="Event poster *" hint="Shown in the announcement popup and the Past Events list.">
            <ImageListEditor single images={form.poster} onChange={set('poster')} label="Event poster" />
          </Field>
          <Field label="Photo beside the title (optional)" hint="If empty, the poster is used.">
            <ImageListEditor single images={form.photo} onChange={set('photo')} label="Event photo" />
          </Field>
        </div>
      </Section>

      <Section title="Event details">
        <div style={ui.grid(240)}>
          <TextField label="Event title *" value={form.title} onChange={set('title')} placeholder="e.g. Online Reiki 2nd Level Workshop" />
          {isNew && (
            <TextField
              label="Web address id *"
              value={form.id}
              onChange={(v) => {
                setIdTouched(true);
                setForm((prev) => ({ ...prev, id: slugify(v) }));
              }}
              hint="Lowercase words with hyphens. Cannot be changed later."
            />
          )}
          <TextField span label="Tagline" value={form.tagline} onChange={set('tagline')} placeholder="e.g. Learn, Heal & Transform with the Healing Energy of Reiki" />
        </div>
        <Field label="Large title lettering on the event page (optional)" hint="E.g. “Online” / “Reiki” / “2nd Level Workshop”. If empty, the event title is used.">
          <div style={ui.grid(160)}>
            <input value={form.kicker} onChange={(e) => set('kicker')(e.target.value)} placeholder="Small word" style={ui.input} aria-label="Small word" />
            <input value={form.main} onChange={(e) => set('main')(e.target.value)} placeholder="Big word" style={ui.input} aria-label="Big word" />
            <input value={form.ribbon} onChange={(e) => set('ribbon')(e.target.value)} placeholder="Ribbon text" style={ui.input} aria-label="Ribbon text" />
          </div>
        </Field>
      </Section>

      <Section title="When & where" description="Times are India time (IST). The date, day and time shown on the website are filled in from these.">
        <div style={ui.grid(220)}>
          <TextField label="Starts *" type="datetime-local" value={form.startsAt} onChange={set('startsAt')} />
          <TextField label="Ends *" type="datetime-local" value={form.endsAt} onChange={set('endsAt')} />
          <Field label="Mode">
            <select value={form.mode} onChange={(e) => set('mode')(e.target.value)} style={ui.input}>
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
            </select>
          </Field>
          <TextField label="Mode detail" value={form.modeDetail} onChange={set('modeDetail')} placeholder="e.g. Live Workshop" />
          {form.mode !== 'Online' && (
            <TextField span label="Venue" value={form.venue} onChange={set('venue')} placeholder="e.g. Sanjivani Reiki Center, Walcut Compound, Amravati" />
          )}
        </div>
        {form.startsAt && form.endsAt && form.endsAt > form.startsAt && (
          <p style={{ ...ui.hint, margin: 0 }}>
            Shown as: <strong>{(() => { const s = scheduleFrom(fromIndiaInput(form.startsAt), fromIndiaInput(form.endsAt)); return `${s.date} (${s.day}), ${s.time}`; })()}</strong>
          </p>
        )}
      </Section>

      <Section title="Fee & registration">
        <div style={ui.grid(200)}>
          <TextField label="Fee (₹)" type="number" min="1" step="1" value={form.priceRupees} onChange={set('priceRupees')} hint="What the customer pays." />
          <TextField label="Actual fee before offer (₹)" type="number" min="1" step="1" value={form.originalPriceRupees} onChange={set('originalPriceRupees')} hint="Shown crossed out. Optional." />
          <TextField label="Offer label" value={form.offerLabel} onChange={set('offerLabel')} placeholder="e.g. Special Anniversary Offer" />
          <TextField label="Contact numbers" value={form.contacts} onChange={set('contacts')} hint="Separated by commas." />
        </div>
        <Toggle label="Registration open" hint="Untick to stop new registrations. Registration closes automatically when the event ends." checked={form.registrationOpen} onChange={set('registrationOpen')} />
        <TextField
          label="WhatsApp group link (shown only after successful payment)"
          value={form.whatsappGroupUrl}
          onChange={set('whatsappGroupUrl')}
          placeholder={DEFAULT_EVENT_WHATSAPP_GROUP_URL}
          hint={`Customers are asked to join this group after paying. If empty, ${DEFAULT_EVENT_WHATSAPP_GROUP_URL} is used.`}
        />
      </Section>

      <Section title="About the event" description="Each paragraph is shown separately.">
        <ListEditor items={form.description} onChange={set('description')} multiline placeholder="Paragraph" addLabel="Add paragraph" max={12} />
      </Section>

      <Section title="Benefits">
        <ListEditor items={form.benefits} onChange={set('benefits')} withIcon placeholder="e.g. Reiki Level 2 Attunement" addLabel="Add benefit" max={24} />
      </Section>

      <Section title="What to expect">
        <ListEditor items={form.whatToExpect} onChange={set('whatToExpect')} withIcon placeholder="e.g. Hands-On Practice" addLabel="Add item" max={24} />
      </Section>

      <Section title="Anniversary badge (optional)">
        <div style={ui.grid(220)}>
          <TextField label="Text" value={form.anniversary} onChange={set('anniversary')} placeholder="e.g. Celebrating 31 Years of Reiki Journey" />
          <TextField label="Years" type="number" min="1" value={form.anniversaryYears} onChange={set('anniversaryYears')} hint="Leave empty to hide the badge." />
        </div>
      </Section>
    </EditorPanel>
  );
}

// ── Registrations ────────────────────────────────────────────

const STATUS_TONE = { PAID: 'green', PENDING: 'amber', FAILED: 'red', ORDER_FAILED: 'red', CREATED: 'slate' };

// Registration details; registrations made before the registration form
// existed have a delivery address instead, so its city / state are used
function registrationOf(r) {
  const reg = r.customer?.registration || {};
  const addr = r.customer?.address || {};
  return {
    city: reg.city || addr.city || '',
    state: reg.state || addr.state || '',
    age: reg.age ?? '',
    gender: reg.gender ? reg.gender.charAt(0).toUpperCase() + reg.gender.slice(1) : '',
    experience: reg.experience || '',
    message: reg.message || ''
  };
}

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadCsv(event, registrations) {
  const header = ['Reference', 'Status', 'Name', 'Mobile', 'Email', 'City', 'State', 'Age', 'Gender', 'Experience', 'Message', 'Amount (Rs)', 'Paid at', 'Registered at'];
  const lines = registrations.map((r) => [
    r.reference,
    r.status,
    r.customer?.name,
    r.customer?.phone,
    r.customer?.email,
    registrationOf(r).city,
    registrationOf(r).state,
    registrationOf(r).age,
    registrationOf(r).gender,
    registrationOf(r).experience,
    registrationOf(r).message,
    (r.amountPaise / 100).toFixed(2),
    formatDateTime(r.paidAt),
    formatDateTime(r.createdAt)
  ].map(csvCell).join(','));
  const blob = new Blob([`﻿${[header.join(','), ...lines].join('\n')}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.id}-registrations.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function RegistrationsPanel({ row, onClose }) {
  const [registrations, setRegistrations] = useState(null);
  const [error, setError] = useState(null);
  const [paidOnly, setPaidOnly] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    listEventRegistrations(row.id).then((res) => {
      if (res.success) setRegistrations(res.data.registrations);
      else setError(res.message || 'Could not load registrations.');
    });
  }, [row.id]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (registrations || []).filter((r) => {
      if (paidOnly && r.status !== 'PAID') return false;
      if (!q) return true;
      return [r.reference, r.customer?.name, r.customer?.phone, r.customer?.email, registrationOf(r).city, registrationOf(r).state]
        .some((v) => String(v || '').toLowerCase().includes(q));
    });
  }, [registrations, paidOnly, search]);

  const paid = (registrations || []).filter((r) => r.status === 'PAID');
  const total = paid.reduce((sum, r) => sum + r.amountPaise, 0);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(15, 23, 42, 0.55)', display: 'flex', justifyContent: 'flex-end' }}>
      <div role="dialog" aria-modal="true" aria-label={`Registrations for ${row.data.title}`} style={{ width: 'min(1100px, 100%)', height: '100%', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 22px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: '#0f172a' }}>Registrations: {row.data.title}</h2>
            <p style={{ margin: '2px 0 0', fontSize: '13.5px', color: '#64748b' }}>
              {row.data.schedule?.date} · {paid.length} paid · {formatPaise(total)} received
            </p>
          </div>
          <button type="button" style={ui.button()} disabled={!shown.length} onClick={() => downloadCsv(row, shown)}>
            <Download size={15} /> Download (Excel / CSV)
          </button>
          <button type="button" style={ui.button()} onClick={onClose} aria-label="Close"><X size={16} /> Close</button>
        </header>
        <div style={{ padding: '14px 22px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, phone, email, city…" style={{ ...ui.input, maxWidth: '320px' }} aria-label="Search registrations" />
          <Toggle label="Paid registrations only" checked={paidOnly} onChange={setPaidOnly} />
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px 40px' }}>
          {error && <Notice tone="error">{error}</Notice>}
          {!registrations && !error && (
            <p style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#475569' }}><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading…</p>
          )}
          {registrations && shown.length === 0 && <p style={{ color: '#64748b' }}>{paidOnly ? 'No paid registrations yet.' : 'Nobody has registered yet.'}</p>}
          {shown.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff', fontSize: '14px', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                  {['#', 'Name', 'Contact', 'City / State', 'Details', 'Status', 'Amount', 'Paid / registered', 'Reference'].map((h) => (
                    <th key={h} style={{ padding: '9px 10px', fontWeight: 750, color: '#334155', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                    <td style={{ padding: '9px 10px', color: '#94a3b8' }}>{i + 1}</td>
                    <td style={{ padding: '9px 10px', fontWeight: 700, color: '#0f172a' }}>{r.customer?.name}</td>
                    <td style={{ padding: '9px 10px' }}>
                      <a href={`tel:${r.customer?.phone}`}>{r.customer?.phone}</a><br />
                      <a href={`mailto:${r.customer?.email}`} style={{ color: '#475569' }}>{r.customer?.email}</a>
                    </td>
                    <td style={{ padding: '9px 10px', color: '#475569' }}>
                      {[registrationOf(r).city, registrationOf(r).state].filter(Boolean).join(', ')}
                    </td>
                    <td style={{ padding: '9px 10px', color: '#475569', maxWidth: '280px', fontSize: '13.5px' }}>
                      {[
                        registrationOf(r).age !== '' && registrationOf(r).age !== null ? `Age ${registrationOf(r).age}` : null,
                        registrationOf(r).gender || null,
                        registrationOf(r).experience || null
                      ].filter(Boolean).join(' · ')}
                      {registrationOf(r).message && (
                        <div style={{ marginTop: '4px', fontStyle: 'italic' }}>“{registrationOf(r).message}”</div>
                      )}
                    </td>
                    <td style={{ padding: '9px 10px' }}><Chip tone={STATUS_TONE[r.status] || 'slate'}>{r.status}</Chip></td>
                    <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>{formatPaise(r.amountPaise)}</td>
                    <td style={{ padding: '9px 10px', whiteSpace: 'nowrap', color: '#475569' }}>{formatDateTime(r.paidAt || r.createdAt)}</td>
                    <td style={{ padding: '9px 10px', fontFamily: 'monospace', fontSize: '12.5px' }}>{r.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function AdminEvents() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [tab, setTab] = useState('upcoming');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    const [docs, legacy, sum] = await Promise.all([listCatalogItems('event'), listAdminProducts(), getEventRegistrationSummary()]);
    if (!docs.success) {
      setError(docs.message || 'Could not load events.');
      setLoading(false);
      return;
    }
    const legacyPrices = new Map(
      (legacy.success ? legacy.data?.products || [] : []).filter((p) => BUILT_IN_IDS.has(p.id)).map((p) => [p.id, p])
    );
    setRows(mergeRows(docs.data.items, legacyPrices));
    setSummary(sum.success ? sum.data.summary : {});
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (row, action) => {
    const confirmText = {
      delete: `Delete “${row.data.title}” from the website? The list of people who registered is kept, and you can restore the event later.`,
      reset: `Undo all your changes to “${row.data.title}” and go back to its original details?`
    }[action];
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyId(row.id);
    const fn = { delete: deleteCatalogItem, restore: restoreCatalogItem, reset: resetCatalogItem }[action];
    const res = await fn('event', row.id);
    setBusyId(null);
    if (!res.success) return setNotice({ tone: 'error', text: res.message || 'Something went wrong.' });
    setNotice({ tone: 'success', text: { delete: 'Event deleted.', restore: 'Event restored.', reset: 'Original details restored.' }[action] });
    load();
  };

  const groups = useMemo(() => {
    const active = rows.filter((r) => !r.deleted);
    return {
      upcoming: active.filter((r) => !isEventOver(r.data)).reverse(), // soonest first
      past: active.filter((r) => isEventOver(r.data)),
      deleted: rows.filter((r) => r.deleted)
    };
  }, [rows]);

  const tabs = [
    ['upcoming', `Upcoming (${groups.upcoming.length})`],
    ['past', `Past events (${groups.past.length})`],
    ['deleted', `Deleted (${groups.deleted.length})`]
  ];

  return (
    <div style={{ maxWidth: '1180px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '26.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarDays size={22} color="#c59b27" /> Events
          </h1>
          <p style={{ fontSize: '15.5px', color: '#64748b', margin: 0, maxWidth: '700px' }}>
            Add and update upcoming events, and see who registered for each one. Finished events move to “Past events” automatically (here and on the website), with their registrations kept.
          </p>
        </div>
        <button type="button" style={ui.button('gold')} onClick={() => setEditing('new')}>
          <Plus size={16} /> Add event
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {tabs.map(([key, label]) => (
          <button key={key} type="button" style={ui.button(tab === key ? 'primary' : 'default')} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {notice && <div style={{ marginBottom: '14px' }}><Notice tone={notice.tone} onClose={() => setNotice(null)}>{notice.text}</Notice></div>}
      {error && <Notice tone="error">{error}</Notice>}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', padding: '24px 0' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading events...
        </div>
      ) : groups[tab].length === 0 ? (
        <p style={{ color: '#64748b' }}>
          {tab === 'upcoming' ? 'No upcoming events. Click “Add event” to announce one.' : tab === 'past' ? 'No past events yet.' : 'No deleted events.'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {groups[tab].map((row) => {
            const stats = summary[row.id] || { paid: 0, amountPaise: 0, attempts: 0 };
            const busy = busyId === row.id;
            const past = isEventOver(row.data);
            const poster = resolveMediaUrl(row.data.image?.src);
            return (
              <article key={row.id} style={{ ...ui.card, display: 'grid', gridTemplateColumns: '110px 1fr', gap: '16px', alignItems: 'start' }}>
                <div style={{ width: '110px', aspectRatio: '4 / 5', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                  {poster && <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {past ? <Chip tone="slate">Completed</Chip> : row.data.registrationOpen === false || row.data.pricePaise == null ? <Chip tone="red">Registration closed</Chip> : <Chip tone="green">Registration open</Chip>}
                    {!row.builtIn && <Chip tone="blue">Added by you</Chip>}
                    {row.builtIn && row.edited && <Chip tone="amber">Edited</Chip>}
                  </div>
                  <strong style={{ fontSize: '18px', color: '#0f172a' }}>{row.data.title}</strong>
                  <span style={{ fontSize: '14.5px', color: '#475569' }}>
                    {row.data.schedule?.date}{row.data.schedule?.day ? ` (${row.data.schedule.day})` : ''} · {row.data.schedule?.time} · {[row.data.schedule?.mode, row.data.schedule?.venue].filter(Boolean).join(' – ')}
                  </span>
                  <span style={{ fontSize: '14.5px', color: '#334155' }}>
                    Fee: <strong>{formatPaise(row.data.pricePaise)}</strong>
                    {Number.isFinite(row.data.originalPricePaise) && <s style={{ color: '#94a3b8', marginLeft: '6px' }}>{formatPaise(row.data.originalPricePaise)}</s>}
                    <span style={{ margin: '0 10px', color: '#cbd5e1' }}>|</span>
                    <Users size={14} style={{ verticalAlign: '-2px' }} /> <strong>{stats.paid}</strong> paid registration{stats.paid === 1 ? '' : 's'} · {formatPaise(stats.amountPaise)} received
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <button type="button" style={ui.button('gold')} onClick={() => setViewing(row)}><Users size={14} /> Registrations</button>
                    {row.deleted ? (
                      <button type="button" style={ui.button()} disabled={busy} onClick={() => act(row, 'restore')}><Undo2 size={15} /> Restore</button>
                    ) : (
                      <>
                        <button type="button" style={ui.button('primary')} disabled={busy} onClick={() => setEditing(row)}><Pencil size={14} /> Edit</button>
                        <button type="button" style={ui.button('danger')} disabled={busy} onClick={() => act(row, 'delete')}><Trash2 size={14} /> Delete</button>
                        {row.builtIn && row.edited && (
                          <button type="button" style={ui.button()} disabled={busy} onClick={() => act(row, 'reset')}><RotateCcw size={14} /> Original</button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {editing && (
        <EventEditor
          row={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(text) => {
            setEditing(null);
            setNotice({ tone: 'success', text });
            load();
          }}
        />
      )}
      {viewing && <RegistrationsPanel row={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}
