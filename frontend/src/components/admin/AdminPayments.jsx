import React, { useCallback, useEffect, useState } from 'react';
import { formatPaise } from '@reiki-vastu/shared/products.js';
import { listPayments, recheckPayment } from '../../api/adminClient';
import { AlertTriangle, ChevronDown, ChevronUp, CreditCard, Loader2, RefreshCw, Search } from 'lucide-react';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'PAID', label: 'Paid' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'FAILED', label: 'Failed' },
  { key: 'ORDER_FAILED', label: 'Could not start' },
  { key: 'CREATED', label: 'Not started' }
];

const STATUS_STYLE = {
  PAID: { bg: '#dcfce7', fg: '#166534', label: 'Paid' },
  PENDING: { bg: '#fef3c7', fg: '#92400e', label: 'Pending' },
  FAILED: { bg: '#fee2e2', fg: '#991b1b', label: 'Failed' },
  ORDER_FAILED: { bg: '#f1f5f9', fg: '#475569', label: 'Could not start' },
  CREATED: { bg: '#f1f5f9', fg: '#475569', label: 'Not started' }
};

// Statuses Razorpay might still change, so a manual re-check is useful
const RECHECKABLE = ['PENDING', 'FAILED'];

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })
    : '—';

function StatusBadge({ status }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE.CREATED;
  return (
    <span style={{ background: style.bg, color: style.fg, fontWeight: 700, fontSize: '11px', padding: '3px 9px', borderRadius: '999px', whiteSpace: 'nowrap' }}>
      {style.label}
    </span>
  );
}

function Detail({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>{label}</div>
      <div style={{ fontSize: '13px', color: '#0f172a', wordBreak: 'break-word' }}>{children || '—'}</div>
    </div>
  );
}

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [counts, setCounts] = useState({});
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [recheckingId, setRecheckingId] = useState(null);
  const [message, setMessage] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await listPayments({ page, limit: 20, status: statusFilter, search });
    if (res.success) {
      setPayments(res.data.payments);
      setCounts(res.data.counts);
      setPagination(res.data.pagination);
      setError(null);
    } else {
      setError(res.message);
    }
    setLoading(false);
  }, [page, statusFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const changeFilter = (key) => {
    setStatusFilter(key);
    setPage(1);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const recheck = async (payment) => {
    setRecheckingId(payment._id);
    setMessage(null);
    const res = await recheckPayment(payment._id);
    setRecheckingId(null);
    setMessage({ tone: res.success ? 'info' : 'error', text: res.message || (res.success ? 'Re-checked.' : 'Re-check failed.') });
    if (res.success) {
      setPayments((list) => list.map((p) => (p._id === payment._id ? res.data.payment : p)));
      load(); // refresh counts
    }
  };

  const totalCount = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={22} color="#c59b27" /> Payments
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Online product orders. Ship orders marked <strong>Paid</strong> to the delivery address shown.
          </p>
        </div>
        <form onSubmit={submitSearch} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Reference, name, phone, email"
              style={{ padding: '8px 10px 8px 32px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', width: '240px' }}
            />
          </div>
          <button type="submit" style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#f8fafc', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
            Search
          </button>
        </form>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {STATUS_TABS.map((tab) => {
          const active = statusFilter === tab.key;
          const count = tab.key === 'all' ? totalCount : counts[tab.key] || 0;
          return (
            <button
              key={tab.key}
              onClick={() => changeFilter(tab.key)}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                border: `1px solid ${active ? '#0f172a' : '#cbd5e1'}`,
                background: active ? '#0f172a' : '#ffffff',
                color: active ? '#f8fafc' : '#334155',
                fontWeight: 600,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {message && (
        <p
          role="status"
          style={{
            background: message.tone === 'error' ? '#fef2f2' : '#eff6ff',
            color: message.tone === 'error' ? '#991b1b' : '#1e3a8a',
            border: `1px solid ${message.tone === 'error' ? '#fecaca' : '#bfdbfe'}`,
            borderRadius: '8px',
            padding: '9px 12px',
            fontSize: '13px',
            margin: '0 0 14px'
          }}
        >
          {message.text}
        </p>
      )}

      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        {loading && payments.length === 0 ? (
          <p style={{ padding: '24px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px' }}>
            <Loader2 size={16} /> Loading payments...
          </p>
        ) : payments.length === 0 ? (
          <p style={{ padding: '24px', margin: 0, color: '#64748b', fontSize: '13px' }}>No payments found.</p>
        ) : (
          payments.map((payment) => {
            const expanded = expandedId === payment._id;
            const address = payment.customer?.address;
            return (
              <div key={payment._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => setExpandedId(expanded ? null : payment._id)}
                  aria-expanded={expanded}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(130px, 1.1fr) minmax(150px, 1.4fr) minmax(130px, 1.2fr) 100px 110px 24px',
                    gap: '12px',
                    alignItems: 'center',
                    padding: '14px 18px',
                    background: expanded ? '#f8fafc' : '#ffffff',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#0f172a'
                  }}
                >
                  <span>
                    <strong style={{ display: 'block' }}>{payment.reference}</strong>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{formatDate(payment.createdAt)}</span>
                  </span>
                  <span>
                    {payment.product?.name} × {payment.quantity}
                    {payment.product?.isPlaceholder && <span style={{ color: '#92400e', fontSize: '11px', display: 'block' }}>Test placeholder</span>}
                  </span>
                  <span>
                    {payment.customer?.name || <span style={{ color: '#94a3b8' }}>No customer details</span>}
                    {payment.customer?.phone && <span style={{ color: '#64748b', fontSize: '12px', display: 'block' }}>{payment.customer.phone}</span>}
                  </span>
                  <strong>{formatPaise(payment.amountPaise)}</strong>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <StatusBadge status={payment.status} />
                    {payment.review?.required && <AlertTriangle size={15} color="#dc2626" aria-label="Needs review" />}
                  </span>
                  {expanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                </button>

                {expanded && (
                  <div style={{ padding: '4px 18px 18px', background: '#f8fafc' }}>
                    {payment.review?.required && (
                      <p style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '8px', padding: '9px 12px', fontSize: '13px', margin: '0 0 14px' }}>
                        <strong>Needs review:</strong> {payment.review.reason} Do not ship until this is checked in the Razorpay Dashboard.
                      </p>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px 20px', marginBottom: '14px' }}>
                      <Detail label="Deliver to">
                        {address ? (
                          <>
                            {payment.customer.name}<br />
                            {address.line1}<br />
                            {address.line2 && (<>{address.line2}<br /></>)}
                            {address.city}, {address.state} {address.pincode}
                          </>
                        ) : null}
                      </Detail>
                      <Detail label="Live location">
                        {payment.customer?.location ? (
                          <>
                            <a
                              href={`https://www.google.com/maps?q=${payment.customer.location.latitude},${payment.customer.location.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#1d4ed8', fontWeight: 600 }}
                            >
                              Open in Google Maps
                            </a>
                            {payment.customer.location.accuracyMeters != null && (
                              <span style={{ color: '#64748b' }}> (±{payment.customer.location.accuracyMeters} m)</span>
                            )}
                          </>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>Not shared</span>
                        )}
                      </Detail>
                      <Detail label="Contact">
                        {payment.customer ? (<>{payment.customer.phone}<br />{payment.customer.email}</>) : null}
                      </Detail>
                      <Detail label="Amount">
                        {formatPaise(payment.amountPaise)} ({payment.quantity} × {formatPaise(payment.product?.unitPricePaise || 0)})
                      </Detail>
                      <Detail label="Paid at">{payment.paidAt ? formatDate(payment.paidAt) : null}</Detail>
                      <Detail label="Confirmed via">{payment.confirmedVia}</Detail>
                      <Detail label="Owner email">
                        {payment.status === 'PAID'
                          ? payment.notification?.adminEmailSent
                            ? 'Sent'
                            : payment.notification?.lastError
                              ? `Failed: ${payment.notification.lastError}`
                              : 'Not sent (email not configured)'
                          : null}
                      </Detail>
                      <Detail label="Razorpay order">{payment.razorpayOrderId}</Detail>
                      <Detail label="Razorpay payment">{payment.razorpayPaymentId}</Detail>
                      {payment.failure?.description && <Detail label="Last failure">{payment.failure.description}</Detail>}
                    </div>

                    {RECHECKABLE.includes(payment.status) && (
                      <button
                        onClick={() => recheck(payment)}
                        disabled={recheckingId === payment._id}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <RefreshCw size={13} /> {recheckingId === payment._id ? 'Checking with Razorpay...' : 'Re-check with Razorpay'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '16px', fontSize: '13px' }}>
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>
            Previous
          </button>
          <span style={{ color: '#64748b' }}>Page {pagination.page} of {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
