import React, { useEffect, useMemo, useState } from 'react';
import { GraduationCap, Loader2, Pencil, Plus, RotateCcw, Trash2, Undo2 } from 'lucide-react';
import { STATIC_COURSES } from '../../data/courses';
import { resolveMediaUrl } from '../../catalog/media';
import { ICON_NAMES, iconFor, rotatingIcon } from '../../catalog/icons';
import {
  listCatalogItems,
  saveCatalogItem,
  deleteCatalogItem,
  restoreCatalogItem,
  resetCatalogItem
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
  describeErrors,
  fromRows,
  slugify,
  toRows
} from './catalogForm';

// Courses on the website: the built-in ones (src/data/courses.js) merged with
// what was added or changed here.

const COURSE_FIELDS = [
  'title', 'subtitle', 'description', 'alt', 'images', 'imageFit', 'imagePosition', 'imageBg', 'icon',
  'eyebrow', 'tagline', 'intro', 'what', 'use', 'philosophy', 'benefits', 'extras', 'journey'
];
const pick = (course) => Object.fromEntries(COURSE_FIELDS.filter((k) => course[k] !== undefined).map((k) => [k, course[k]]));

const BUILT_INS = STATIC_COURSES.map((course) => ({ id: course.id, ...pick(course) }));
const isEmpty = (data) => !data || Object.keys(data).length === 0;

function mergeRows(docs) {
  const byId = new Map(docs.map((doc) => [doc.itemId, doc]));
  const rows = BUILT_INS.map((base) => {
    const doc = byId.get(base.id);
    byId.delete(base.id);
    const edited = doc && !isEmpty(doc.data);
    return { id: base.id, builtIn: true, edited, deleted: Boolean(doc?.deleted), data: edited ? { ...base, ...doc.data } : base };
  });
  for (const doc of byId.values()) {
    rows.push({ id: doc.itemId, builtIn: false, edited: true, deleted: doc.deleted, data: doc.data });
  }
  return rows;
}

function IconSelect({ value, onChange }) {
  const Icon = iconFor(value);
  return (
    <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <span style={{ ...ui.iconButton, cursor: 'default', color: '#b45309' }} aria-hidden="true"><Icon size={16} /></span>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={ui.input}>
        <option value="">Automatic</option>
        {ICON_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
      </select>
    </span>
  );
}

const formFromData = (row) => {
  const d = row?.data || {};
  return {
    id: row?.id || '',
    title: d.title || '',
    subtitle: d.subtitle || '',
    description: d.description || '',
    icon: d.icon || '',
    images: (d.images?.length ? d.images : d.image ? [d.image] : []).map((url) => ({ url })),
    imageFit: d.imageFit || 'cover',
    eyebrow: (d.eyebrow || []).join(', '),
    tagline: d.tagline || '',
    intro: d.intro || '',
    whatTitle: d.what?.title || '',
    whatText: d.what?.text || '',
    whatIcon: d.what?.icon || '',
    useTitle: d.use?.title || '',
    useText: d.use?.text || '',
    useItems: toRows(d.use?.items, 'label'),
    benefitsTitle: d.benefits?.title || '',
    benefitsSubtitle: d.benefits?.subtitle || '',
    benefitsItems: toRows(d.benefits?.items, 'label'),
    journeyTitle: d.journey?.title || '',
    journeyText: d.journey?.text || ''
  };
};

// Rows without a chosen icon get one in turn, so every item has an icon
const withIcons = (items) => items.map((item, i) => ({ ...item, icon: item.icon || rotatingIcon(i) }));

function CourseEditor({ row, onClose, onSaved }) {
  const isNew = !row;
  const [form, setForm] = useState(() => formFromData(row));
  const [idTouched, setIdTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);

  const set = (key) => (value) =>
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (isNew && key === 'title' && !idTouched) next.id = slugify(value);
      return next;
    });

  const save = async () => {
    setError(null);
    setErrors([]);
    if (!form.title.trim() || !form.id) {
      setError('Please enter the course name.');
      return;
    }
    const title = form.title.trim();
    const previous = row?.data || {};
    const data = {
      ...pick(previous),
      title,
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      alt: previous.alt && previous.title === title ? previous.alt : `${title} course`,
      icon: form.icon,
      images: form.images.map((image) => image.url),
      imageFit: form.imageFit,
      imagePosition: previous.imagePosition || 'center center',
      imageBg: form.imageFit === 'contain' ? previous.imageBg || '#f5ead8' : previous.imageBg || '',
      eyebrow: form.eyebrow.split(',').map((w) => w.trim()).filter(Boolean).slice(0, 6),
      tagline: form.tagline.trim(),
      intro: form.intro.trim(),
      what: { title: form.whatTitle.trim(), text: form.whatText.trim(), icon: form.whatIcon || form.icon || 'Sparkles' },
      use: {
        ...(previous.use || {}),
        title: form.useTitle.trim(),
        text: form.useText.trim(),
        items: withIcons(fromRows(form.useItems, 'label'))
      },
      benefits: {
        title: form.benefitsTitle.trim(),
        subtitle: form.benefitsSubtitle.trim(),
        items: withIcons(fromRows(form.benefitsItems, 'label'))
      },
      journey: { ...(previous.journey || {}), title: form.journeyTitle.trim(), text: form.journeyText.trim() }
    };
    delete data.image;

    setSaving(true);
    const res = await saveCatalogItem('course', form.id, { data, isNew });
    setSaving(false);
    if (!res.success) {
      setError(res.message || 'Could not save.');
      setErrors(describeErrors(res.fields));
      return;
    }
    onSaved(`Saved “${title}”.`);
  };

  const extrasCount = row?.data?.extras?.length || 0;

  return (
    <EditorPanel
      title={isNew ? 'Add a course' : `Edit ${row.data.title}`}
      subtitle={isNew ? 'It appears on the website as soon as you save.' : `Web address id: ${row.id}`}
      onClose={onClose}
      onSave={save}
      saving={saving}
      error={error}
      errors={errors}
      saveLabel={isNew ? 'Add course' : 'Save changes'}
    >
      <Section title="Photos" description="Shown one after another on the course page, in this order. The first photo is also the course card image.">
        <ImageListEditor images={form.images} onChange={set('images')} />
        <Field label="How photos fit their frame">
          <select value={form.imageFit} onChange={(e) => set('imageFit')(e.target.value)} style={{ ...ui.input, maxWidth: '360px' }}>
            <option value="cover">Fill the frame (edges may be cropped)</option>
            <option value="contain">Show the whole photo</option>
          </select>
        </Field>
      </Section>

      <Section title="Course card" description="Shown on the home page and the Courses page.">
        <div style={ui.grid(240)}>
          <TextField label="Course name *" value={form.title} onChange={set('title')} placeholder="e.g. Sound Healing" />
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
          <TextField label="Subtitle" value={form.subtitle} onChange={set('subtitle')} placeholder="e.g. Vibration • Calm • Healing" />
          <Field label="Card icon"><IconSelect value={form.icon} onChange={set('icon')} /></Field>
          <TextField span label="Short description" value={form.description} onChange={set('description')} multiline rows={2} />
        </div>
      </Section>

      <Section title="Course page: top">
        <div style={ui.grid(240)}>
          <TextField label="Highlight words" value={form.eyebrow} onChange={set('eyebrow')} hint="Separated by commas, e.g. Calm, Awareness, Well-being" />
          <TextField label="Tagline" value={form.tagline} onChange={set('tagline')} placeholder="e.g. A Path to Inner Peace" />
          <TextField span label="Introduction" value={form.intro} onChange={set('intro')} multiline rows={3} />
        </div>
      </Section>

      <Section title="“What is …?” section">
        <div style={ui.grid(240)}>
          <TextField label="Heading" value={form.whatTitle} onChange={set('whatTitle')} placeholder={`What is ${form.title || 'this course'}?`} />
          <Field label="Icon"><IconSelect value={form.whatIcon} onChange={set('whatIcon')} /></Field>
          <TextField span label="Text" value={form.whatText} onChange={set('whatText')} multiline rows={4} hint="Leave empty to hide this section." />
        </div>
      </Section>

      <Section title="“How can I use it?” section">
        <div style={ui.grid(240)}>
          <TextField label="Heading" value={form.useTitle} onChange={set('useTitle')} />
          <TextField span label="Text" value={form.useText} onChange={set('useText')} multiline rows={3} />
        </div>
        <Field label="Uses (with icons)">
          <ListEditor items={form.useItems} onChange={set('useItems')} withIcon placeholder="e.g. Self-Healing" addLabel="Add use" max={12} />
        </Field>
      </Section>

      <Section title="Benefits">
        <div style={ui.grid(240)}>
          <TextField label="Heading" value={form.benefitsTitle} onChange={set('benefitsTitle')} placeholder={`Benefits of ${form.title || 'the course'}`} />
          <TextField label="Sub-heading" value={form.benefitsSubtitle} onChange={set('benefitsSubtitle')} />
        </div>
        <ListEditor items={form.benefitsItems} onChange={set('benefitsItems')} withIcon placeholder="e.g. Reduces Stress" addLabel="Add benefit" max={24} />
      </Section>

      <Section title="Closing section">
        <div style={ui.grid(240)}>
          <TextField label="Heading" value={form.journeyTitle} onChange={set('journeyTitle')} placeholder={`Begin Your ${form.title || ''} Journey`} />
          <TextField span label="Text" value={form.journeyText} onChange={set('journeyText')} multiline rows={2} />
        </div>
      </Section>

      {extrasCount > 0 && (
        <Notice tone="info">
          This course page also has {extrasCount} special section{extrasCount > 1 ? 's' : ''} (such as training levels) from the original design. They are kept unchanged when you save.
        </Notice>
      )}
    </EditorPanel>
  );
}

export default function AdminCourses() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showDeleted, setShowDeleted] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    const res = await listCatalogItems('course');
    if (!res.success) setError(res.message || 'Could not load courses.');
    else {
      setRows(mergeRows(res.data.items));
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (row, action) => {
    const confirmText = {
      delete: `Delete the “${row.data.title}” course from the website? You can restore it later from “Deleted courses”.`,
      reset: `Undo all your changes to “${row.data.title}” and go back to its original text and photos?`
    }[action];
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyId(row.id);
    const fn = { delete: deleteCatalogItem, restore: restoreCatalogItem, reset: resetCatalogItem }[action];
    const res = await fn('course', row.id);
    setBusyId(null);
    if (!res.success) return setNotice({ tone: 'error', text: res.message || 'Something went wrong.' });
    setNotice({ tone: 'success', text: { delete: 'Course deleted.', restore: 'Course restored.', reset: 'Original course restored.' }[action] });
    load();
  };

  const visible = useMemo(() => rows.filter((row) => row.deleted === showDeleted), [rows, showDeleted]);
  const deletedCount = rows.filter((row) => row.deleted).length;

  return (
    <div style={{ maxWidth: '1180px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '26.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap size={22} color="#c59b27" /> Courses
          </h1>
          <p style={{ fontSize: '15.5px', color: '#64748b', margin: 0, maxWidth: '680px' }}>
            Add new courses, edit course text and photos (add, remove and reorder), or remove courses from the website.
          </p>
        </div>
        <button type="button" style={ui.button('gold')} onClick={() => setEditing('new')}>
          <Plus size={16} /> Add course
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button type="button" style={ui.button(showDeleted ? 'default' : 'primary')} onClick={() => setShowDeleted(false)}>
          On the website ({rows.length - deletedCount})
        </button>
        <button type="button" style={ui.button(showDeleted ? 'primary' : 'default')} onClick={() => setShowDeleted(true)}>
          Deleted courses ({deletedCount})
        </button>
      </div>

      {notice && <div style={{ marginBottom: '14px' }}><Notice tone={notice.tone} onClose={() => setNotice(null)}>{notice.text}</Notice></div>}
      {error && <Notice tone="error">{error}</Notice>}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', padding: '24px 0' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading courses...
        </div>
      ) : visible.length === 0 ? (
        <p style={{ color: '#64748b' }}>{showDeleted ? 'No deleted courses.' : 'No courses yet.'}</p>
      ) : (
        <div style={ui.grid(250)}>
          {visible.map((row) => {
            const images = row.data.images?.length ? row.data.images : row.data.image ? [row.data.image] : [];
            const busy = busyId === row.id;
            return (
              <article key={row.id} style={{ ...ui.card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ aspectRatio: '4 / 3', background: row.data.imageBg || '#f1f5f9' }}>
                  {images[0] && (
                    <img src={resolveMediaUrl(images[0])} alt="" style={{ width: '100%', height: '100%', objectFit: row.data.imageFit || 'cover', display: 'block' }} />
                  )}
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {!row.builtIn && <Chip tone="blue">Added by you</Chip>}
                    {row.builtIn && row.edited && <Chip tone="amber">Edited</Chip>}
                    <Chip tone="gold">{images.length} photo{images.length === 1 ? '' : 's'}</Chip>
                  </div>
                  <strong style={{ fontSize: '17px', color: '#0f172a' }}>{row.data.title}</strong>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>{row.data.subtitle}</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '6px' }}>
                    {row.deleted ? (
                      <button type="button" style={ui.button()} disabled={busy} onClick={() => act(row, 'restore')}><Undo2 size={15} /> Restore</button>
                    ) : (
                      <>
                        <button type="button" style={ui.button('primary')} disabled={busy} onClick={() => setEditing(row)}><Pencil size={14} /> Edit</button>
                        <button type="button" style={ui.button('danger')} disabled={busy} onClick={() => act(row, 'delete')}><Trash2 size={14} /> Delete</button>
                        {row.builtIn && row.edited && (
                          <button type="button" style={ui.button()} disabled={busy} onClick={() => act(row, 'reset')} title="Undo all changes to this built-in course">
                            <RotateCcw size={14} /> Original
                          </button>
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
        <CourseEditor
          row={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(text) => {
            setEditing(null);
            setNotice({ tone: 'success', text });
            load();
          }}
        />
      )}
    </div>
  );
}
