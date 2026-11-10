import React from 'react';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { formatPaise } from '../utils/razorpayCheckout';
import { cardStyle, primaryButtonStyle } from './paymentStyles';

// Keyed by the server's payment status. The page never decides the outcome itself.
const VARIANTS = {
  PAID: {
    Icon: CheckCircle2,
    color: '#15803d',
    title: 'Payment confirmed',
    text: 'Razorpay has confirmed this payment. Thank you! (Test Mode: no real money was charged.)'
  },
  PENDING: {
    Icon: Clock,
    color: '#b45309',
    title: 'Confirming your payment...',
    text: 'We are confirming this payment with Razorpay. This usually takes a few seconds. Please do not pay again.'
  },
  PENDING_TIMEOUT: {
    Icon: Clock,
    color: '#b45309',
    title: 'Payment not confirmed yet',
    text:
      'Razorpay has not confirmed this payment yet. If money was deducted, it will be confirmed automatically, or refunded by Razorpay if the payment does not complete. Please do not pay again; check back using the button below.'
  },
  FAILED: {
    Icon: XCircle,
    color: '#b91c1c',
    title: 'Payment failed',
    text: 'The payment did not go through. If money was deducted, it is returned automatically by the bank.'
  },
  ORDER_FAILED: {
    Icon: XCircle,
    color: '#b91c1c',
    title: 'Payment could not be started',
    text: 'This payment was never started, so you have not been charged.'
  },
  CREATED: {
    Icon: XCircle,
    color: '#b91c1c',
    title: 'Payment was not started',
    text: 'This payment was never started, so you have not been charged.'
  }
};

export default function PaymentResult({ variant: variantKey, payment, polling, onRetry, onCheckAgain, onBackToProducts }) {
  const variant = VARIANTS[variantKey] || VARIANTS.PENDING;
  const { Icon } = variant;

  return (
    <div style={{ ...cardStyle, textAlign: 'center' }} aria-live="polite">
      <Icon size={44} color={variant.color} style={{ marginBottom: '10px' }} />
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: variant.color, margin: '0 0 8px' }}>{variant.title}</h2>
      <p style={{ color: '#5e2732', fontSize: '14px', lineHeight: 1.6, margin: '0 auto 18px', maxWidth: '480px' }}>
        {variant.text}
      </p>

      {polling && (
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#92400e', fontSize: '13px', margin: '0 0 18px' }}>
          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Checking...
        </p>
      )}

      {payment.failure?.description && (
        <p style={{ color: '#7f1d1d', fontSize: '14px', margin: '0 0 18px' }}>Reason: {payment.failure.description}</p>
      )}

      <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px', textAlign: 'left', maxWidth: '380px', margin: '0 auto 22px', fontSize: '14px' }}>
        <dt style={{ fontWeight: 700, color: '#475569' }}>Reference</dt>
        <dd style={{ margin: 0 }}>{payment.reference}</dd>
        <dt style={{ fontWeight: 700, color: '#475569' }}>Product</dt>
        <dd style={{ margin: 0 }}>{payment.product.name} × {payment.quantity}</dd>
        <dt style={{ fontWeight: 700, color: '#475569' }}>Amount</dt>
        <dd style={{ margin: 0 }}>{formatPaise(payment.amountPaise)}</dd>
      </dl>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {onRetry && (
          <button onClick={onRetry} style={{ ...primaryButtonStyle, width: 'auto', cursor: 'pointer' }}>
            Try again
          </button>
        )}
        {onCheckAgain && (
          <button onClick={onCheckAgain} style={{ ...primaryButtonStyle, width: 'auto', cursor: 'pointer' }}>
            Check again
          </button>
        )}
        <button
          onClick={onBackToProducts}
          style={{ ...primaryButtonStyle, width: 'auto', background: '#ffffff', color: '#3b0a11', border: '1.5px solid #d4af37', cursor: 'pointer' }}
        >
          Back to products
        </button>
      </div>
    </div>
  );
}
