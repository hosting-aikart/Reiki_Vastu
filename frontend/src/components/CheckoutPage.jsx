import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { findProductById } from '@reiki-vastu/shared/products.js';
import { createPaymentOrder, getProducts, verifyPayment } from '../api/paymentClient';
import { formatPaise, generateIdempotencyKey, loadRazorpayCheckout } from '../utils/razorpayCheckout';
import { cardStyle, linkButtonStyle, primaryButtonStyle } from './paymentStyles';
import PaymentResult from './PaymentResult';
import TestModeBanner from './TestModeBanner';

const BUSINESS_NAME = 'Reiki & Vaastu World';

// After these errors the same key can never succeed, so the next click uses a new one
const NEW_KEY_ERRORS = ['ORDER_CREATION_FAILED', 'PAYMENT_PROVIDER_ERROR', 'IDEMPOTENCY_KEY_REUSED', 'PAYMENT_ALREADY_COMPLETED'];

const EMPTY_DETAILS = { name: '', phone: '', email: '', line1: '', line2: '', city: '', state: '', pincode: '' };

const FIELDS = [
  { key: 'name', label: 'Full name', autoComplete: 'name', span: 2 },
  { key: 'phone', label: 'Mobile number', autoComplete: 'tel', inputMode: 'tel', placeholder: '10-digit mobile' },
  { key: 'email', label: 'Email', autoComplete: 'email', type: 'email' },
  { key: 'line1', label: 'House / street address', autoComplete: 'address-line1', span: 2 },
  { key: 'line2', label: 'Landmark / area (optional)', autoComplete: 'address-line2', span: 2, optional: true },
  { key: 'city', label: 'City', autoComplete: 'address-level2' },
  { key: 'state', label: 'State', autoComplete: 'address-level1' },
  { key: 'pincode', label: 'PIN code', autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 6 }
];

/** Quick checks for instant feedback. The server validates everything again. */
function validateDetails(d) {
  const errors = {};
  if (d.name.trim().length < 2) errors.name = 'Please enter your full name';
  if (!/^(\+91|0)?[6-9]\d{9}$/.test(d.phone.trim())) errors.phone = 'Please enter a valid 10-digit mobile number';
  if (!/^\S+@\S+\.\S+$/.test(d.email.trim())) errors.email = 'Please enter a valid email address';
  if (d.line1.trim().length < 5) errors.line1 = 'Please enter your house / street address';
  if (d.city.trim().length < 2) errors.city = 'Please enter your city';
  if (d.state.trim().length < 2) errors.state = 'Please enter your state';
  if (!/^[1-9]\d{5}$/.test(d.pincode.trim())) errors.pincode = 'Please enter a valid 6-digit PIN code';
  return errors;
}

function toCustomerPayload(d) {
  return {
    name: d.name.trim(),
    phone: d.phone.trim(),
    email: d.email.trim(),
    address: { line1: d.line1.trim(), line2: d.line2.trim(), city: d.city.trim(), state: d.state.trim(), pincode: d.pincode.trim() }
  };
}

/** Server field names ("customer.address.pincode") -> form field names ("pincode"). */
function serverFieldErrors(fields) {
  const errors = {};
  for (const [path, message] of Object.entries(fields || {})) {
    const key = path.replace(/^customer\.(address\.)?/, '');
    if (key in EMPTY_DETAILS) errors[key] = message;
  }
  return errors;
}

export default function CheckoutPage({ productId, initialQuantity = 1, onBack, onPaymentSubmitted }) {
  const [catalog, setCatalog] = useState({ loading: true, error: null, product: null, paymentsEnabled: false, pricesConfirmed: false });
  const [quantity, setQuantity] = useState(1);
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [fieldErrors, setFieldErrors] = useState({});
  const [phase, setPhase] = useState('idle'); // idle | starting | open | verifying | result
  const [notice, setNotice] = useState(null);
  const [result, setResult] = useState(null);

  // A ref, not state: two fast clicks both run before React re-renders,
  // so a state flag would still read "not busy" for the second click.
  const busyRef = useRef(false);

  // The current attempt's idempotency key. Kept when the customer closes the
  // window and pays again, so they resume the same order instead of creating a
  // new one. Any change to quantity or details starts a new attempt.
  const attemptRef = useRef(null);

  const display = findProductById(productId); // image and title for display only

  useEffect(() => {
    let active = true;
    getProducts().then((res) => {
      if (!active) return;
      if (!res.success) {
        setCatalog({ loading: false, error: res.message, product: null, paymentsEnabled: false, pricesConfirmed: false });
        return;
      }
      const product = res.data.products.find((p) => p.id === productId) || null;
      if (product) {
        setQuantity(Math.min(Math.max(1, Math.floor(initialQuantity) || 1), product.maxQuantity));
      }
      setCatalog({
        loading: false,
        error: product ? null : 'This product does not exist.',
        product,
        paymentsEnabled: res.data.paymentsEnabled,
        pricesConfirmed: res.data.pricesConfirmed
      });
    });
    // Start downloading Checkout early so clicking Pay feels instant. Failure is handled on click.
    loadRazorpayCheckout().catch(() => {});
    return () => {
      active = false;
    };
  }, [productId, initialQuantity]);

  const { product } = catalog;
  const quantityWasCapped = product && initialQuantity > product.maxQuantity;

  const changeQuantity = (value) => {
    setQuantity(value);
    attemptRef.current = null; // different purchase, so a different attempt
    setNotice(null);
  };

  const changeDetail = (key, value) => {
    setDetails((d) => ({ ...d, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
    attemptRef.current = null;
  };

  const getAttemptKey = () => {
    if (!attemptRef.current) {
      attemptRef.current = { key: generateIdempotencyKey() };
    }
    return attemptRef.current.key;
  };

  const release = (nextPhase) => {
    busyRef.current = false;
    setPhase(nextPhase);
  };

  const openCheckout = (Razorpay, order, customer) => {
    let lastFailure = null;
    let completed = false;

    const checkout = new Razorpay({
      key: order.razorpayKeyId, // public Key ID; the secret never leaves the server
      order_id: order.razorpayOrderId, // ties this payment to the order the server created
      amount: order.amountPaise, // display only: Razorpay charges the order's amount
      currency: order.currency,
      name: BUSINESS_NAME,
      description: `${order.product.name} × ${order.quantity}`,
      notes: { reference: order.reference },
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
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

  const startPayment = async (event) => {
    event.preventDefault();
    if (busyRef.current || !product) return;

    const errors = validateDetails(details);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setNotice({ tone: 'error', text: 'Please check the highlighted delivery details.' });
      return;
    }

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

    const customer = toCustomerPayload(details);
    const res = await createPaymentOrder({ productId: product.id, quantity, idempotencyKey: getAttemptKey(), customer });

    if (!res.success) {
      if (NEW_KEY_ERRORS.includes(res.code)) {
        attemptRef.current = null;
      }
      const fromServer = serverFieldErrors(res.fields);
      setFieldErrors(fromServer);
      // Errors for anything that isn't a form box (quantity, the whole address, ...)
      // would otherwise be invisible, so list them in the notice.
      const otherErrors = Object.entries(res.fields || {})
        .filter(([path]) => !(path.replace(/^customer\.(address\.)?/, '') in fromServer))
        .map(([, message]) => message);
      const message =
        res.code === 'ORDER_IN_PROGRESS'
          ? 'Your payment is still being prepared. Please wait a moment and try again.'
          : otherErrors.length
            ? otherErrors.join(' ')
            : Object.keys(fromServer).length
              ? 'Please check the highlighted delivery details.'
              : res.message;
      setNotice({ tone: 'error', text: message });
      release('idle');
      return;
    }

    try {
      openCheckout(Razorpay, res.data, customer);
    } catch {
      setNotice({ tone: 'error', text: 'The payment window could not be opened. Please try again.' });
      release('idle');
    }
  };

  const retry = () => {
    setResult(null);
    setPhase('idle');
  };

  const busy = phase !== 'idle';

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '70px', minHeight: '100vh', background: '#faf5ee' }}>
      <div className="hm-container" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <button onClick={onBack} style={linkButtonStyle} disabled={phase === 'open' || phase === 'starting' || phase === 'verifying'}>
          <ArrowLeft size={16} /> Back to product
        </button>

        <h1 className="ff-redhat" style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#3b0a11', margin: '12px 0 20px' }}>
          Checkout
        </h1>

        <TestModeBanner pricesConfirmed={catalog.pricesConfirmed} />

        {catalog.loading && (
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5e2732' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Loading...
          </p>
        )}

        {catalog.error && <p style={{ color: '#b91c1c' }}>{catalog.error}</p>}

        {phase === 'result' && result && (
          <PaymentResult variant="FAILED" payment={result} onRetry={retry} onBackToProducts={onBack} />
        )}

        {product && phase !== 'result' && (
          <form onSubmit={startPayment} noValidate style={cardStyle}>
            {/* ── Order summary ── */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
              {display?.image && (
                <img
                  src={display.image}
                  alt={display.alt || product.name}
                  style={{ width: '84px', height: '84px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #f1e5c4', flexShrink: 0 }}
                />
              )}
              <div>
                <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#3b0a11', margin: '0 0 4px' }}>{product.name}</h2>
                <p style={{ fontSize: '14px', color: '#5e2732', margin: 0 }}>{product.description}</p>
              </div>
            </div>

            <dl style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px 16px', alignItems: 'center', margin: '0 0 8px', fontSize: '15px' }}>
              <dt style={{ color: '#475569' }}>Price</dt>
              <dd style={{ margin: 0, fontWeight: 600 }}>{formatPaise(product.unitPricePaise)}</dd>

              <dt style={{ color: '#475569' }}>
                <label htmlFor="checkout-quantity">Quantity</label>
              </dt>
              <dd style={{ margin: 0 }}>
                <select
                  id="checkout-quantity"
                  value={quantity}
                  onChange={(e) => changeQuantity(Number(e.target.value))}
                  disabled={busy}
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
            {quantityWasCapped && (
              <p style={{ fontSize: '13px', color: '#92400e', margin: '0 0 8px' }}>
                A maximum of {product.maxQuantity} can be bought in one order.
              </p>
            )}

            {/* ── Delivery details ── */}
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#3b0a11', margin: '22px 0 12px' }}>Delivery details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px 14px', marginBottom: '20px' }}>
              {FIELDS.map((field) => (
                <label key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '13px', fontWeight: 600, color: '#475569', gridColumn: field.span === 2 ? '1 / -1' : undefined }}>
                  {field.label}
                  <input
                    name={field.key}
                    type={field.type || 'text'}
                    value={details[field.key]}
                    onChange={(e) => changeDetail(field.key, e.target.value)}
                    autoComplete={field.autoComplete}
                    inputMode={field.inputMode}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    disabled={busy}
                    aria-invalid={Boolean(fieldErrors[field.key])}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: `1.5px solid ${fieldErrors[field.key] ? '#dc2626' : '#e7d7b5'}`,
                      fontSize: '15px',
                      fontWeight: 400,
                      color: '#1e293b',
                      background: '#ffffff'
                    }}
                  />
                  {fieldErrors[field.key] && <span style={{ color: '#b91c1c', fontWeight: 500 }}>{fieldErrors[field.key]}</span>}
                </label>
              ))}
            </div>

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
                      type="button"
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
                type="submit"
                disabled={busy}
                style={{ ...primaryButtonStyle, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1 }}
              >
                {phase === 'idle' ? (
                  <><Lock size={16} /> Pay {formatPaise(product.unitPricePaise * quantity)}</>
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
              Card and UPI details are entered in Razorpay's secure window and never reach this website.
              Your delivery details are used only to deliver this order.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
