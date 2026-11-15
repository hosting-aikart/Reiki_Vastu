import React from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react';
import { formatPaise } from '@reiki-vastu/shared/products.js';
import './EventPaymentSuccess.css';

/**
 * Shown only for an event registration the SERVER reports as PAID. The
 * WhatsApp link is not part of the website's code: it arrives from the
 * payment status endpoint (payment.access), which includes it only after the
 * payment has been verified with Razorpay.
 */
export default function EventPaymentSuccess({ payment, onBackToEvent }) {
  const groupUrl = payment.access?.whatsappGroupUrl;

  return (
    <section className="eps-page" aria-labelledby="eps-title">
      <div className="eps-card" aria-live="polite">
        <div className="eps-icon" aria-hidden="true">
          <CheckCircle2 size={44} strokeWidth={2.2} />
        </div>

        <p className="eps-kicker">Registration Confirmed</p>
        <h1 id="eps-title" className="eps-title">Payment Successful!</h1>
        <p className="eps-subtitle">
          Congratulations! Your registration for the <strong>{payment.product.name}</strong> is confirmed.
        </p>

        <div className="eps-divider" aria-hidden="true"><span>✦</span></div>

        <p className="eps-message">
          Thank you for registering with Reiki and Vaastu World. We are delighted to have you join us on this
          beautiful journey of healing, learning, and transformation.
        </p>

        <div className="eps-instruction">
          <strong>Important:</strong> Join our official WhatsApp group to receive workshop updates, important
          announcements, and further joining instructions.
        </div>

        {groupUrl && (
          <a className="eps-whatsapp" href={groupUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={22} aria-hidden="true" />
            Join WhatsApp Group
          </a>
        )}

        <p className="eps-lookforward">We look forward to seeing you at the workshop!</p>

        <dl className="eps-details">
          <dt>Reference</dt>
          <dd>{payment.reference}</dd>
          <dt>Workshop</dt>
          <dd>{payment.product.name}</dd>
          <dt>Amount paid</dt>
          <dd>{formatPaise(payment.amountPaise)}</dd>
        </dl>
        <p className="eps-keep">Please keep this page or your reference number. You can reopen this page from the same link at any time.</p>

        <button type="button" className="eps-back" onClick={onBackToEvent}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to events
        </button>
      </div>
    </section>
  );
}
