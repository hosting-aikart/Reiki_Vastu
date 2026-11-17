import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCatalog } from '../catalog/CatalogContext';
import { getPaymentStatus } from '../api/paymentClient';
import { linkButtonStyle } from './paymentStyles';
import PaymentResult from './PaymentResult';
import TestModeBanner from './TestModeBanner';
import EventPaymentSuccess from './events/EventPaymentSuccess';

const POLL_INTERVAL_MS = 4000;
const MAX_POLLS = 45; // about 3 minutes, then the customer can check again manually

// Statuses that can still change while the customer waits on this page
const WAITING_STATUSES = ['PENDING'];

// Outcomes where nothing was charged, so the customer may simply pay again
const RETRYABLE_STATUSES = ['FAILED', 'ORDER_FAILED', 'CREATED'];

/**
 * Shows a payment's status from the server, at /payments/<statusToken>.
 *
 * The URL holds the status token, so the page survives a refresh, and the
 * customer can reopen it later. Each check also asks the server to re-check
 * with Razorpay, which is how a payment whose callback was lost gets confirmed.
 */
export default function PaymentStatusPage({ statusToken, onBackToProducts, onBackToEvents, onRetryPayment }) {
  const { findItem } = useCatalog();
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [polling, setPolling] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const [round, setRound] = useState(0); // incremented by "Check again" to restart polling
  const timerRef = useRef(null);

  useEffect(() => {
    let active = true;
    let polls = 0;

    const check = async () => {
      const res = await getPaymentStatus(statusToken);
      if (!active) return;

      polls += 1;
      if (res.success) {
        setPayment(res.data);
        setError(null);
        if (!WAITING_STATUSES.includes(res.data.status)) {
          setPolling(false);
          return;
        }
      } else if (res.status === 404) {
        setError('We could not find this payment. Please check the link.');
        setPolling(false);
        return;
      }
      // Network errors and 5xx: keep trying, the server or connection may recover

      if (polls >= MAX_POLLS) {
        setTimedOut(true);
        setPolling(false);
        return;
      }
      timerRef.current = setTimeout(check, POLL_INTERVAL_MS);
    };

    check();

    return () => {
      active = false;
      clearTimeout(timerRef.current);
    };
  }, [statusToken, round]);

  const checkAgain = useCallback(() => {
    setTimedOut(false);
    setPolling(true);
    setRound((n) => n + 1);
  }, []);

  const variant = payment?.status === 'PENDING' && timedOut ? 'PENDING_TIMEOUT' : payment?.status;

  // The server says whether this was an event registration; older servers didn't, so fall back to the catalog
  const isEvent = Boolean(payment && (payment.isEvent ?? findItem(payment.product.id)?.isEvent));
  const goBack = isEvent && onBackToEvents ? onBackToEvents : onBackToProducts;
  const backLabel = isEvent ? 'Back to events' : 'Back to products';

  // The server decides success: the joining page needs status PAID AND the
  // access details, which the server only sends for a verified payment.
  if (isEvent && payment.status === 'PAID' && payment.access?.whatsappGroupUrl) {
    return (
      <div style={{ paddingTop: '110px', paddingBottom: '70px', minHeight: '100vh', background: '#fdfbf7' }}>
        <div className="hm-container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          {payment.testMode && <TestModeBanner />}
          <EventPaymentSuccess payment={payment} onBackToEvent={goBack} />
        </div>
      </div>
    );
  }

  const canRetry = isEvent && onRetryPayment && RETRYABLE_STATUSES.includes(payment?.status);

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '70px', minHeight: '100vh', background: '#fdfbf7' }}>
      <div className="hm-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <button onClick={goBack} style={linkButtonStyle}>
          <ArrowLeft size={16} /> {backLabel}
        </button>

        <h1 className="ff-redhat" style={{ fontSize: 'clamp(26.5px, 3.3vw, 35px)', fontWeight: 850, color: '#3b0a11', margin: '12px 0 20px' }}>
          Payment Status
        </h1>

        {payment?.testMode && <TestModeBanner />}

        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

        {!payment && !error && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5e2732' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading payment status...
          </p>
        )}

        {payment && (
          <PaymentResult
            variant={variant}
            payment={payment}
            polling={polling && payment.status === 'PENDING'}
            onCheckAgain={timedOut ? checkAgain : null}
            onRetry={canRetry ? () => onRetryPayment(payment.product.id) : null}
            retryLabel="Retry Payment"
            onBackToProducts={goBack}
            backLabel={backLabel}
          />
        )}
      </div>
    </div>
  );
}
