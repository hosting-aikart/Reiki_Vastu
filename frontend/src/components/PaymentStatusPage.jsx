import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getPaymentStatus } from '../api/paymentClient';
import { linkButtonStyle } from './paymentStyles';
import PaymentResult from './PaymentResult';
import TestModeBanner from './TestModeBanner';

const POLL_INTERVAL_MS = 4000;
const MAX_POLLS = 45; // about 3 minutes, then the customer can check again manually

// Statuses that can still change while the customer waits on this page
const WAITING_STATUSES = ['PENDING'];

/**
 * Shows a payment's status from the server, at /payments/<statusToken>.
 *
 * The URL holds the status token, so the page survives a refresh, and the
 * customer can reopen it later. Each check also asks the server to re-check
 * with Razorpay, which is how a payment whose callback was lost gets confirmed.
 */
export default function PaymentStatusPage({ statusToken, onBackToProducts }) {
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

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '70px', minHeight: '100vh', background: '#fdfbf7' }}>
      <div className="hm-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <button onClick={onBackToProducts} style={linkButtonStyle}>
          <ArrowLeft size={16} /> Back to products
        </button>

        <h1 className="ff-redhat" style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 850, color: '#3b0a11', margin: '12px 0 20px' }}>
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
            onBackToProducts={onBackToProducts}
          />
        )}
      </div>
    </div>
  );
}
