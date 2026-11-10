import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { createPaymentOrder, getProducts, verifyPayment } from '../api/paymentClient';
import { formatPaise, generateIdempotencyKey, loadRazorpayCheckout } from '../utils/razorpayCheckout';
import { cardStyle, linkButtonStyle, primaryButtonStyle } from './paymentStyles';
import PaymentResult from './PaymentResult';
import TestModeBanner from './TestModeBanner';

const BUSINESS_NAME = 'Reiki & Vaastu World';

// After these errors the same key can never succeed, so the next click uses a new one
const NEW_KEY_ERRORS = ['ORDER_CREATION_FAILED', 'PAYMENT_PROVIDER_ERROR', 'IDEMPOTENCY_KEY_REUSED', 'PAYMENT_ALREADY_COMPLETED'];

export default function CheckoutPage({ productId, onBackToProducts, onPaymentSubmitted }) {
  const [catalog, setCatalog] = useState({ loading: true, error: null, product: null, paymentsEnabled: false });
  const [quantity, setQuantity] = useState(1);
  const [phase, setPhase] = useState('idle'); // idle | starting | open | verifying | result
  const [notice, setNotice] = useState(null);
  const [result, setResult] = useState(null);

  // A ref, not state: two fast clicks both run before React re-renders,
  // so a state flag would still read "not busy" for the second click.
  const busyRef = useRef(false);

  // The current attempt's idempotency key. Kept when the customer closes the
  // window and pays again, so they resume the same order instead of creating a new one.
  const attemptRef = useRef(null);

  useEffect(() => {
    let active = true;
    getProducts().then((res) => {
      if (!active) return;
      if (!res.success) {
        setCatalog({ loading: false, error: res.message, product: null, paymentsEnabled: false });
        return;
      }
      const product = res.data.products.find((p) => p.id === productId) || null;
      setCatalog({
        loading: false,
        error: product ? null : 'This product does not exist.',
        product,
        paymentsEnabled: res.data.paymentsEnabled
      });
    });
    // Start downloading Checkout early so clicking Pay feels instant. Failure is handled on click.
    loadRazorpayCheckout().catch(() => {});
    return () => {
      active = false;
    };
  }, [productId]);

  const { product } = catalog;

  const changeQuantity = (value) => {
    setQuantity(value);
    attemptRef.current = null; // different purchase, so a different attempt
    setNotice(null);
  };

  const getAttemptKey = () => {
    if (!attemptRef.current || attemptRef.current.quantity !== quantity) {
      attemptRef.current = { key: generateIdempotencyKey(), quantity };
    }
    return attemptRef.current.key;
  };

  const release = (nextPhase) => {
    busyRef.current = false;
    setPhase(nextPhase);
  };

  const openCheckout = (Razorpay, order) => {
    let lastFailure = null;
    let completed = false;

    const checkout = new Razorpay({
      key: order.razorpayKeyId, // public Key ID; the secret never leaves the server
      order_id: order.razorpayOrderId, // ties this payment to the order the server created
      amount: order.amountPaise, // display only: Razorpay charges the order's amount
      currency: order.currency,
      name: BUSINESS_NAME,
      description: `TEST MODE · ${order.product.name} × ${order.quantity}`,
      notes: { reference: order.reference },
      theme: { color: '#D2042D' },

      // Runs when Razorpay says the payment succeeded. This is a CLAIM made in
      // the browser, which anyone can fake, so it goes to the server to be
      // verified. Whatever the server answers (or if it can't be reached), the
      // status page then shows the server's view, never this callback's.
      handler: async (response) => {
        completed = true;
        attemptRef.current = null;
        setPhase('verifying');
        await verifyPayment({ statusToken: order.statusToken, checkoutResponse: response });
        busyRef.current = false;
        onPaymentSubmitted(order.statusToken);
      },

      modal: {
        // Runs when the customer closes the window without completing a payment
        ondismiss: () => {
          if (completed) return;
          if (lastFailure) {
            setResult({ ...order, failure: lastFailure });
            release('result');
          } else {
            setNotice({
              tone: 'info',
              text: `Payment window closed. If you completed a payment (for example in a UPI app), do not pay again; it will be confirmed. Reference: ${order.reference}`,
              statusToken: order.statusToken
            });
            release('idle');
          }
        }
      }
    });

    // Fires for each failed attempt. Checkout lets the customer retry inside the
    // window, so a failure is only final once they close it (see ondismiss).
    checkout.on('payment.failed', (response) => {
      lastFailure = {
        code: response.error?.code,
        description: response.error?.description,
        reason: response.error?.reason
      };
    });

    checkout.open();
    setPhase('open');
  };

  const startPayment = async () => {
    if (busyRef.current || !product) return;
    busyRef.current = true;
    setPhase('starting');
    setNotice(null);

    let Razorpay;
    try {
      // Load Checkout before creating an order, so a blocked script doesn't leave an unused order
      Razorpay = await loadRazorpayCheckout();
    } catch {
      setNotice({ tone: 'error', text: 'The payment window could not be loaded. Check your connection or disable content blockers, then try again.' });
      release('idle');
      return;
    }

    const res = await createPaymentOrder({ productId: product.id, quantity, idempotencyKey: getAttemptKey() });

    if (!res.success) {
      if (NEW_KEY_ERRORS.includes(res.code)) {
        attemptRef.current = null;
      }
      const message =
        res.code === 'ORDER_IN_PROGRESS'
          ? 'Your payment is still being prepared. Please wait a moment and try again.'
          : res.fields?.quantity || res.message;
      setNotice({ tone: 'error', text: message });
      release('idle');
      return;
    }

    try {
      openCheckout(Razorpay, res.data);
    } catch {
      setNotice({ tone: 'error', text: 'The payment window could not be opened. Please try again.' });
      release('idle');
    }
  };

  const retry = () => {
    setResult(null);
    setPhase('idle');
  };

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '70px', minHeight: '100vh', background: '#fdfbf7' }}>
      <div className="hm-container" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <button onClick={onBackToProducts} style={linkButtonStyle} disabled={phase === 'open' || phase === 'starting' || phase === 'verifying'}>
          <ArrowLeft size={16} /> Back to products
        </button>

        <h1 className="ff-redhat" style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#3b0a11', margin: '12px 0 20px' }}>
          Checkout
        </h1>

        <TestModeBanner />

        {catalog.loading && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5e2732' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading...
          </p>
        )}

        {catalog.error && <p style={{ color: '#b91c1c' }}>{catalog.error}</p>}

        {phase === 'result' && result && (
          <PaymentResult variant="FAILED" payment={result} onRetry={retry} onBackToProducts={onBackToProducts} />
        )}

        {product && phase !== 'result' && (
          <div style={cardStyle}>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#3b0a11', margin: '0 0 4px' }}>{product.name}</h2>
            <p style={{ fontSize: '14px', color: '#5e2732', margin: '0 0 20px' }}>{product.description}</p>

            <dl style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px 16px', alignItems: 'center', margin: '0 0 20px', fontSize: '15px' }}>
              <dt style={{ color: '#475569' }}>Unit price (dummy)</dt>
              <dd style={{ margin: 0, fontWeight: 600 }}>{formatPaise(product.unitPricePaise)}</dd>

              <dt style={{ color: '#475569' }}>
                <label htmlFor="checkout-quantity">Quantity</label>
              </dt>
              <dd style={{ margin: 0 }}>
                <select
                  id="checkout-quantity"
                  value={quantity}
                  onChange={(e) => changeQuantity(Number(e.target.value))}
                  disabled={phase !== 'idle'}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #d4af37', fontSize: '15px' }}
                >
                  {Array.from({ length: product.maxQuantity }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </dd>

              <dt style={{ fontWeight: 800, color: '#3b0a11', borderTop: '1px solid #f1e5c4', paddingTop: '12px' }}>Total</dt>
              <dd style={{ margin: 0, fontWeight: 800, fontSize: '19px', color: '#D2042D', borderTop: '1px solid #f1e5c4', paddingTop: '12px' }}>
                {formatPaise(product.unitPricePaise * quantity)}
              </dd>
            </dl>

            {notice && (
              <p
                role={notice.tone === 'error' ? 'alert' : 'status'}
                style={{
                  background: notice.tone === 'error' ? '#fef2f2' : '#eff6ff',
                  color: notice.tone === 'error' ? '#991b1b' : '#1e3a8a',
                  border: `1px solid ${notice.tone === 'error' ? '#fecaca' : '#bfdbfe'}`,
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  margin: '0 0 16px'
                }}
              >
                {notice.text}
                {notice.statusToken && (
                  <>
                    {' '}
                    <button
                      onClick={() => onPaymentSubmitted(notice.statusToken)}
                      style={{ background: 'none', border: 'none', padding: 0, color: '#1d4ed8', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}
                    >
                      Check payment status
                    </button>
                  </>
                )}
              </p>
            )}

            {catalog.paymentsEnabled && product.available ? (
              <button
                onClick={startPayment}
                disabled={phase !== 'idle'}
                style={{ ...primaryButtonStyle, cursor: phase === 'idle' ? 'pointer' : 'wait', opacity: phase === 'idle' ? 1 : 0.7 }}
              >
                {phase === 'idle' ? (
                  <><Lock size={16} /> Pay {formatPaise(product.unitPricePaise * quantity)} (test)</>
                ) : (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {phase === 'open' ? 'Payment window open...' : phase === 'verifying' ? 'Confirming payment...' : 'Preparing payment...'}</>
                )}
              </button>
            ) : (
              <p style={{ color: '#b91c1c', margin: 0 }}>
                {product.available ? 'Online payments are not available at the moment.' : 'This product is currently unavailable.'}
              </p>
            )}

            <p style={{ fontSize: '12px', color: '#64748b', margin: '14px 0 0', textAlign: 'center' }}>
              Payment details are entered in Razorpay's secure window and never reach this website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
