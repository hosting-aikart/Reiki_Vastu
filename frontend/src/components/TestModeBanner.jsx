import React from 'react';
import { FlaskConical } from 'lucide-react';

/**
 * Shown on the checkout and payment status pages while payments run in
 * Razorpay Test Mode, so nobody mistakes a test for a real purchase.
 */
export default function TestModeBanner({ pricesConfirmed = false }) {
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
        <strong>Test Mode: no real money is charged.</strong> Use Razorpay test card or UPI details only.
        {!pricesConfirmed && ' Prices shown are provisional.'}
      </div>
    </div>
  );
}
