import React from 'react';
import { FlaskConical } from 'lucide-react';

/**
 * Shown on every page of the placeholder checkout so nobody mistakes it for a real shop.
 */
export default function TestModeBanner() {
  return (
    <div
      role="note"
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        background: '#fffbeb',
        border: '1.5px dashed #d97706',
        borderRadius: '14px',
        padding: '14px 18px',
        color: '#78350f',
        fontSize: '14px',
        lineHeight: 1.5,
        marginBottom: '24px'
      }}
    >
      {/* Spinner animation used by the payment pages */}
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      <FlaskConical size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <strong>Razorpay Test Mode: development preview.</strong> These products and prices are
        placeholders, not real offerings. No real money is charged; use Razorpay test card details only.
      </div>
    </div>
  );
}
