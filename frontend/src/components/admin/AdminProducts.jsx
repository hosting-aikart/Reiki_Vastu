import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Pencil, Plus, RotateCcw, ShoppingBag, Trash2, Undo2 } from 'lucide-react';
import { PRODUCTS as BUILT_IN_PRODUCTS, formatPaise } from '@reiki-vastu/shared/products.js';
import { getProductImages } from '../../data/productImages';
import { resolveMediaUrl } from '../../catalog/media';
import {
  listCatalogItems,
  listAdminProducts,
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
  Notice,
  PairListEditor,
  Section,
  TextField,
  Toggle,
  describeErrors,
  paiseToRupees,
  rupeesToPaise,
  slugify
} from './catalogForm';

// Products shown on the website: the built-in ones (shared/products.js, photos
// in public/Products_images) merged with what was added or changed here.

const BUILT_INS = BUILT_IN_PRODUCTS.filter((p) => !p.isEvent).map((p) => ({
  title: p.title,
  subtitle: p.subtitle,
  badge: p.badge,
  description: p.description,
  longDescription: p.longDescription || '',
  specifications: p.specifications || [],
  pricePaise: p.pricePaise,
  originalPricePaise: p.originalPricePaise,
  maxQuantity: p.maxQuantity,
  available: p.available !== false,
  images: getProductImages(p),
  id: p.id
}));
const BUILT_IN_IDS = new Set(BUILT_INS.map((p) => p.id));

const isEmpty = (data) => !data || Object.keys(data).length === 0;

function mergeRows(docs, legacyPrices) {
  const byId = new Map(docs.map((doc) => [doc.itemId, doc]));
  const rows = BUILT_INS.map((base) => {
    const doc = byId.get(base.id);
    byId.delete(base.id);
    const legacy = legacyPrices.get(base.id);
    const withLegacy = legacy
      ? { ...base, pricePaise: legacy.unitPricePaise, originalPricePaise: legacy.originalPricePaise, available: legacy.available }
      : base;
    const edited = doc && !isEmpty(doc.data);
    return {
      id: base.id,
      builtIn: true,
      edited: Boolean(edited || legacy?.isCustomized),
      deleted: Boolean(doc?.deleted),
      updatedAt: doc?.updatedAt,
      data: edited ? { ...withLegacy, ...doc.data } : withLegacy
    };
  });
  for (const doc of byId.values()) {
    rows.push({ id: doc.itemId, builtIn: false, edited: true, deleted: doc.deleted, updatedAt: doc.updatedAt, data: doc.data });
  }
  return rows;
}

const emptyForm = () => ({
  id: '',
  title: '',
  subtitle: '',
  badge: 'Crystal Bracelet',
  description: '',
  longDescription: '',
  specifications: [],
  priceRupees: '',
  originalPriceRupees: '',
  maxQuantity: 5,
  available: true,
  images: []
});

const formFromData = (row) => ({
  id: row.id,
  title: row.data.title || '',
  subtitle: row.data.subtitle || '',
  badge: row.data.badge || '',
  description: row.data.description || '',
  longDescription: row.data.longDescription || '',
  specifications: (row.data.specifications || []).map((s) => ({ label: s.label, value: s.value })),
  priceRupees: paiseToRupees(row.data.pricePaise),
  originalPriceRupees: paiseToRupees(row.data.originalPricePaise),
  maxQuantity: row.data.maxQuantity || 5,
  available: row.data.available !== false,
  images: (row.data.images || []).map((url) => ({ url }))
});

function ProductEditor({ row, onClose, onSaved }) {
  const isNew = !row;
  const [form, setForm] = useState(() => (row ? formFromData(row) : emptyForm()));
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
    const pricePaise = rupeesToPaise(form.priceRupees);
    const originalPricePaise = rupeesToPaise(form.originalPriceRupees);
    const problems = [];
    if (!form.title.trim()) problems.push('Please enter the product name.');
    if (!form.id) problems.push('Please enter a web address id.');
    if (Number.isNaN(pricePaise)) problems.push('Selling price must be empty (Coming Soon) or at least ₹1.');
    if (Number.isNaN(originalPricePaise)) problems.push('MRP must be empty or at least ₹1.');
    if (problems.length) {
      setError('Please fix the following:');
      setErrors(problems);
      return;
    }

    const data = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      badge: form.badge.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription.trim(),
      specifications: form.specifications
        .map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
        .filter((s) => s.label && s.value),
      pricePaise,
      originalPricePaise,
      maxQuantity: Number(form.maxQuantity) || 5,
      available: form.available,
      images: form.images.map((image) => image.url)
    };

    setSaving(true);
    const res = await saveCatalogItem('product', form.id, { data, isNew });
    setSaving(false);
    if (!res.success) {
      setError(res.message || 'Could not save.');
      setErrors(describeErrors(res.fields));
      return;
    }
    onSaved(`Saved “${data.title}”.`);
  };

  return (
    <EditorPanel
      title={isNew ? 'Add a product' : `Edit ${row.data.title}`}
      subtitle={isNew ? 'It appears on the website as soon as you save.' : `Web address id: ${row.id}`}
      onClose={onClose}
      onSave={save}
      saving={saving}
      error={error}
      errors={errors}
      saveLabel={isNew ? 'Add product' : 'Save changes'}
    >
      <Section title="Photos" description="Customers see these on the product page, in this order. The first photo is shown on product cards.">
        <ImageListEditor images={form.images} onChange={set('images')} />
      </Section>

      <Section title="Details">
        <div style={ui.grid(240)}>
          <TextField label="Product name *" value={form.title} onChange={set('title')} placeholder="e.g. Black Tourmaline" />
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
          <TextField label="Subtitle" value={form.subtitle} onChange={set('subtitle')} placeholder="e.g. Black Tourmaline Bracelet • 8 mm Beads" />
          <TextField label="Badge" value={form.badge} onChange={set('badge')} placeholder="e.g. Crystal Bracelet" />
          <TextField span label="Short description" value={form.description} onChange={set('description')} multiline rows={2} hint="One or two sentences, shown near the price." />
          <TextField span label="Full description" value={form.longDescription} onChange={set('longDescription')} multiline rows={5} />
        </div>
      </Section>

      <Section title="Price & stock">
        <div style={ui.grid(180)}>
          <TextField label="Selling price (₹)" type="number" min="1" step="0.01" value={form.priceRupees} onChange={set('priceRupees')} hint="Leave empty to show “Coming Soon”." />
          <TextField label="MRP before discount (₹)" type="number" min="1" step="0.01" value={form.originalPriceRupees} onChange={set('originalPriceRupees')} hint="Shown crossed out. Optional." />
          <Field label="Most one customer can buy">
            <select value={form.maxQuantity} onChange={(e) => set('maxQuantity')(Number(e.target.value))} style={ui.input}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
        </div>
        <Toggle label="Available to buy" hint="Untick to show the product without letting customers order it (e.g. out of stock)." checked={form.available} onChange={set('available')} />
      </Section>

      <Section title="Specifications" description="Shown as a table on the product page (e.g. Stone, Bead size, Charm).">
        <PairListEditor items={form.specifications} onChange={set('specifications')} />
      </Section>
    </EditorPanel>
  );
}

export default function AdminProducts() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null); // row, or 'new'
  const [showDeleted, setShowDeleted] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    const [docs, legacy] = await Promise.all([listCatalogItems('product'), listAdminProducts()]);
    if (!docs.success) {
      setError(docs.message || 'Could not load products.');
      setLoading(false);
      return;
    }
    const legacyPrices = new Map(
      (legacy.success ? legacy.data?.products || [] : []).filter((p) => BUILT_IN_IDS.has(p.id)).map((p) => [p.id, p])
    );
    setRows(mergeRows(docs.data.items, legacyPrices));
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (row, action) => {
    const labels = {
      delete: `Delete “${row.data.title}” from the website? You can restore it later from “Deleted products”.`,
      reset: `Undo all your changes to “${row.data.title}” and go back to its original details, photos and price?`
    };
    if (labels[action] && !window.confirm(labels[action])) return;
    setBusyId(row.id);
    const fn = { delete: deleteCatalogItem, restore: restoreCatalogItem, reset: resetCatalogItem }[action];
    const res = await fn('product', row.id);
    setBusyId(null);
    if (!res.success) {
      setNotice({ tone: 'error', text: res.message || 'Something went wrong.' });
      return;
    }
    setNotice({ tone: 'success', text: { delete: 'Product deleted.', restore: 'Product restored.', reset: 'Original details restored.' }[action] });
    load();
  };

  const visible = useMemo(() => rows.filter((row) => row.deleted === showDeleted), [rows, showDeleted]);
  const deletedCount = rows.filter((row) => row.deleted).length;

  return (
    <div style={{ maxWidth: '1180px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '26.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="#c59b27" /> Products
          </h1>
          <p style={{ fontSize: '15.5px', color: '#64748b', margin: 0, maxWidth: '680px' }}>
            Add new products, change photos (add, remove and reorder), details and prices, or remove products from the website. Changes appear on the website immediately.
          </p>
        </div>
        <button type="button" style={ui.button('gold')} onClick={() => setEditing('new')}>
          <Plus size={16} /> Add product
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button type="button" style={ui.button(showDeleted ? 'default' : 'primary')} onClick={() => setShowDeleted(false)}>
          On the website ({rows.length - deletedCount})
        </button>
        <button type="button" style={ui.button(showDeleted ? 'primary' : 'default')} onClick={() => setShowDeleted(true)}>
          Deleted products ({deletedCount})
        </button>
      </div>

      {notice && <div style={{ marginBottom: '14px' }}><Notice tone={notice.tone} onClose={() => setNotice(null)}>{notice.text}</Notice></div>}
      {error && <Notice tone="error">{error}</Notice>}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', padding: '24px 0' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading products...
        </div>
      ) : visible.length === 0 ? (
        <p style={{ color: '#64748b' }}>{showDeleted ? 'No deleted products.' : 'No products yet. Click “Add product”.'}</p>
      ) : (
        <div style={ui.grid(260)}>
          {visible.map((row) => {
            const image = resolveMediaUrl(row.data.images?.[0]);
            const busy = busyId === row.id;
            return (
              <article key={row.id} style={{ ...ui.card, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: row.deleted ? 0.75 : 1 }}>
                <div style={{ aspectRatio: '4 / 3', background: '#f1f5f9' }}>
                  {image && <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {!row.builtIn && <Chip tone="blue">Added by you</Chip>}
                    {row.builtIn && row.edited && <Chip tone="amber">Edited</Chip>}
                    {row.data.pricePaise == null ? <Chip tone="slate">Coming Soon</Chip> : row.data.available === false ? <Chip tone="red">Not available</Chip> : <Chip tone="green">For sale</Chip>}
                    <Chip tone="gold">{(row.data.images || []).length} photos</Chip>
                  </div>
                  <strong style={{ fontSize: '17px', color: '#0f172a' }}>{row.data.title}</strong>
                  <span style={{ fontSize: '14.5px', color: '#334155' }}>
                    {formatPaise(row.data.pricePaise)}
                    {Number.isFinite(row.data.originalPricePaise) && (
                      <s style={{ color: '#94a3b8', marginLeft: '8px' }}>{formatPaise(row.data.originalPricePaise)}</s>
                    )}
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '6px' }}>
                    {row.deleted ? (
                      <button type="button" style={ui.button()} disabled={busy} onClick={() => act(row, 'restore')}>
                        <Undo2 size={15} /> Restore
                      </button>
                    ) : (
                      <>
                        <button type="button" style={ui.button('primary')} disabled={busy} onClick={() => setEditing(row)}>
                          <Pencil size={14} /> Edit
                        </button>
                        <button type="button" style={ui.button('danger')} disabled={busy} onClick={() => act(row, 'delete')}>
                          <Trash2 size={14} /> Delete
                        </button>
                        {row.builtIn && row.edited && (
                          <button type="button" style={ui.button()} disabled={busy} onClick={() => act(row, 'reset')} title="Undo all changes to this built-in product">
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
        <ProductEditor
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
