import React, { useEffect, useState } from 'react';
import {
  IndianRupee,
  Loader2,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import {
  listAdminProducts,
  updateAdminProductPrice,
  resetAdminProductPrice
} from '../../api/adminClient';
import { formatPaise } from '@reiki-vastu/shared/products.js';

function paiseToRupeeString(paise) {
  if (typeof paise !== 'number' || !Number.isFinite(paise)) return '';
  const rupees = paise / 100;
  return Number.isInteger(rupees) ? String(rupees) : rupees.toFixed(2);
}

function rupeeStringToPaise(str) {
  const trimmed = String(str ?? '').trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 1) return NaN;
  return Math.round(num * 100);
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [feedback, setFeedback] = useState({});

  const initDrafts = (items) => {
    const next = {};
    for (const item of items) {
      next[item.id] = {
        priceRupees: paiseToRupeeString(item.unitPricePaise),
        originalPriceRupees:
          item.originalPricePaise != null ? paiseToRupeeString(item.originalPricePaise) : '',
        available: item.available
      };
    }
    setDrafts(next);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const res = await listAdminProducts();
    if (!res.success) {
      setError(res.message || 'Could not load products.');
      setLoading(false);
      return;
    }
    const list = res.data?.products || [];
    setProducts(list);
    initDrafts(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateDraft = (id, key, value) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value
      }
    }));
    setFeedback((prev) => ({ ...prev, [id]: null }));
  };

  const handleSave = async (product) => {
    const draft = drafts[product.id];
    if (!draft) return;

    const unitPricePaise = rupeeStringToPaise(draft.priceRupees);
    if (!Number.isInteger(unitPricePaise) || unitPricePaise < 100) {
      setFeedback((prev) => ({
        ...prev,
        [product.id]: { tone: 'error', text: 'Selling price must be at least ₹1.' }
      }));
      return;
    }

    let originalPricePaise = null;
    if (String(draft.originalPriceRupees).trim() !== '') {
      originalPricePaise = rupeeStringToPaise(draft.originalPriceRupees);
      if (!Number.isInteger(originalPricePaise) || originalPricePaise < 100) {
        setFeedback((prev) => ({
          ...prev,
          [product.id]: { tone: 'error', text: 'Original MRP must be empty or at least ₹1.' }
        }));
        return;
      }
    }

    setSavingId(product.id);
    setFeedback((prev) => ({ ...prev, [product.id]: null }));

    const res = await updateAdminProductPrice(product.id, {
      unitPricePaise,
      originalPricePaise,
      available: Boolean(draft.available)
    });

    setSavingId(null);

    if (!res.success) {
      setFeedback((prev) => ({
        ...prev,
        [product.id]: { tone: 'error', text: res.message || 'Failed to update price.' }
      }));
      return;
    }

    const updated = res.data.product;
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setDrafts((prev) => ({
      ...prev,
      [updated.id]: {
        priceRupees: paiseToRupeeString(updated.unitPricePaise),
        originalPriceRupees:
          updated.originalPricePaise != null ? paiseToRupeeString(updated.originalPricePaise) : '',
        available: updated.available
      }
    }));
    setFeedback((prev) => ({
      ...prev,
      [product.id]: {
        tone: 'success',
        text: `Saved (${formatPaise(updated.unitPricePaise)})`
      }
    }));
  };

  const handleReset = async (product) => {
    setSavingId(product.id);
    setFeedback((prev) => ({ ...prev, [product.id]: null }));

    const res = await resetAdminProductPrice(product.id);
    setSavingId(null);

    if (!res.success) {
      setFeedback((prev) => ({
        ...prev,
        [product.id]: { tone: 'error', text: res.message || 'Could not reset price.' }
      }));
      return;
    }

    const restored = res.data.product;
    setProducts((prev) => prev.map((p) => (p.id === restored.id ? restored : p)));
    setDrafts((prev) => ({
      ...prev,
      [restored.id]: {
        priceRupees: paiseToRupeeString(restored.unitPricePaise),
        originalPriceRupees:
          restored.originalPricePaise != null ? paiseToRupeeString(restored.originalPricePaise) : '',
        available: restored.available
      }
    }));
    setFeedback((prev) => ({
      ...prev,
      [product.id]: {
        tone: 'success',
        text: `Reset to default (${formatPaise(restored.unitPricePaise)})`
      }
    }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', padding: '24px 0' }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Loading product catalog and pricing...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShoppingBag size={22} color="#c59b27" />
          Products &amp; Pricing
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Update product selling prices (in ₹), strikethrough MRP, or stock availability. Changes apply immediately on the Product Detail page and Razorpay Checkout.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px'
          }}
        >
          {error}
        </div>
      )}

      {/* Product Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {products.map((product) => {
          const draft = drafts[product.id] || { priceRupees: '', originalPriceRupees: '', available: true };
          const isSaving = savingId === product.id;
          const fb = feedback[product.id];

          return (
            <div
              key={product.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '18px 20px',
                display: 'grid',
                gridTemplateColumns: 'minmax(220px, 1.4fr) repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
              }}
            >
              {/* Product Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      border: '1px solid #e2e8f0',
                      flexShrink: 0
                    }}
                  />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '16px', color: '#0f172a' }}>{product.name}</strong>
                    {product.isCustomized && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#fef3c7',
                          color: '#92400e',
                          padding: '2px 8px',
                          borderRadius: '999px'
                        }}
                      >
                        Custom Price
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                    {product.description}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
                    Default: {formatPaise(product.defaultUnitPricePaise)} &middot; Live: <strong style={{ color: '#0f172a' }}>{formatPaise(product.unitPricePaise)}</strong>
                  </div>
                </div>
              </div>

              {/* Selling Price Input (₹) */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                Selling Price (₹)
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <IndianRupee size={14} style={{ position: 'absolute', left: '10px', color: '#64748b' }} />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={draft.priceRupees}
                    onChange={(e) => updateDraft(product.id, 'priceRupees', e.target.value)}
                    disabled={isSaving}
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 28px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#0f172a'
                    }}
                  />
                </div>
              </label>

              {/* Original / Strikethrough Price Input (₹) */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                MRP / Strikethrough (₹)
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <IndianRupee size={14} style={{ position: 'absolute', left: '10px', color: '#64748b' }} />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Optional"
                    value={draft.originalPriceRupees}
                    onChange={(e) => updateDraft(product.id, 'originalPriceRupees', e.target.value)}
                    disabled={isSaving}
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 28px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      color: '#334155'
                    }}
                  />
                </div>
              </label>

              {/* Stock Availability & Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(draft.available)}
                    onChange={(e) => updateDraft(product.id, 'available', e.target.checked)}
                    disabled={isSaving}
                  />
                  <span>{draft.available ? 'In Stock (Available)' : 'Unavailable'}</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleSave(product)}
                    disabled={isSaving}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#0f172a',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: isSaving ? 'wait' : 'pointer'
                    }}
                  >
                    {isSaving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
                    <span>Save Price</span>
                  </button>

                  {product.isCustomized && (
                    <button
                      type="button"
                      onClick={() => handleReset(product)}
                      disabled={isSaving}
                      title="Reset to default price"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: '#f8fafc',
                        color: '#475569',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: isSaving ? 'wait' : 'pointer'
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Reset</span>
                    </button>
                  )}
                </div>

                {fb && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: fb.tone === 'error' ? '#dc2626' : '#15803d'
                    }}
                  >
                    {fb.tone === 'error' ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
                    <span>{fb.text}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
