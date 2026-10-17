import React, { useState, useEffect } from 'react';
import {
  listTestimonials,
  moderateTestimonial,
  toggleFeaturedTestimonial,
  deleteTestimonial
} from '../../api/adminClient';
import {
  Star,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trash2,
  MessageSquare,
  Loader2
} from 'lucide-react';

export default function AdminTestimonials({ initialStatus = 'pending' }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchTestimonials = async (page = 1) => {
    setLoading(true);
    try {
      const res = await listTestimonials({
        page,
        limit: pagination.limit,
        status: statusFilter
      });

      if (res.success) {
        setTestimonials(res.data.testimonials || []);
        setPagination(res.data.pagination);
      }
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(1);
  }, [statusFilter]);

  const handleModerate = async (id, newStatus) => {
    setActionLoadingId(id);
    try {
      const res = await moderateTestimonial(id, { status: newStatus });
      if (res.success) {
        // Update local state
        setTestimonials((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status: newStatus, reviewedAt: new Date() } : t))
        );
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleFeatured = async (id) => {
    setActionLoadingId(id);
    try {
      const res = await toggleFeaturedTestimonial(id);
      if (res.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t._id === id ? { ...t, featured: res.data.testimonial.featured } : t))
        );
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this testimonial?')) return;

    setActionLoadingId(id);
    try {
      const res = await deleteTestimonial(id);
      if (res.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: '#111827' }}>
          Testimonials & Reviews Moderation
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>
          Review public user stories. Only verified & approved stories are rendered on the public website.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
        {[
          { key: 'pending', label: 'Pending Review', color: '#d97706' },
          { key: 'approved', label: 'Approved & Live', color: '#16a34a' },
          { key: 'rejected', label: 'Rejected', color: '#dc2626' },
          { key: 'all', label: 'All Reviews', color: '#4b5563' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: statusFilter === tab.key ? '1px solid #111827' : '1px solid transparent',
              background: statusFilter === tab.key ? '#111827' : '#ffffff',
              color: statusFilter === tab.key ? '#ffffff' : '#4b5563',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Reviews */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
          <p style={{ margin: 0 }}>Loading reviews...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            padding: '48px 24px',
            textAlign: 'center',
            color: '#9ca3af'
          }}
        >
          <MessageSquare size={36} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600, color: '#374151' }}>
            No testimonials in this queue
          </h3>
          <p style={{ margin: 0, fontSize: '13px' }}>
            {statusFilter === 'pending'
              ? 'Great job! All submitted stories have been moderated.'
              : 'No records found for this filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
          {testimonials.map((t) => {
            const isActing = actionLoadingId === t._id;
            return (
              <div
                key={t._id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: t.featured ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  {/* Card Header: Client & Status Badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#111827' }}>{t.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                        {t.city} • <span style={{ textTransform: 'capitalize' }}>{t.serviceKey ? t.serviceKey.replace(/_/g, ' ') : 'General'}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {t.featured && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: '#fef3c7',
                            color: '#b45309',
                            border: '1px solid #fde68a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <Sparkles size={11} /> Featured
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background:
                            t.status === 'approved' ? '#dcfce7' : t.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                          color:
                            t.status === 'approved' ? '#15803d' : t.status === 'rejected' ? '#b91c1c' : '#92400e'
                        }}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={15}
                        fill={s <= t.rating ? '#f59e0b' : 'none'}
                        color={s <= t.rating ? '#f59e0b' : '#d1d5db'}
                      />
                    ))}
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563', marginLeft: '6px' }}>
                      ({t.rating}/5)
                    </span>
                  </div>

                  {/* Story Text */}
                  <p
                    style={{
                      margin: 0,
                      fontSize: '13px',
                      lineHeight: '1.5',
                      color: '#374151',
                      fontStyle: 'italic',
                      background: '#f9fafb',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #f3f4f6'
                    }}
                  >
                    "{t.story}"
                  </p>
                </div>

                {/* Footer Controls */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {t.status !== 'approved' && (
                      <button
                        disabled={isActing}
                        onClick={() => handleModerate(t._id, 'approved')}
                        style={{
                          padding: '6px 12px',
                          background: '#16a34a',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isActing ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={13} /> Approve
                      </button>
                    )}

                    {t.status !== 'rejected' && (
                      <button
                        disabled={isActing}
                        onClick={() => handleModerate(t._id, 'rejected')}
                        style={{
                          padding: '6px 12px',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isActing ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    )}

                    {t.status === 'approved' && (
                      <button
                        disabled={isActing}
                        onClick={() => handleToggleFeatured(t._id)}
                        style={{
                          padding: '6px 12px',
                          background: t.featured ? '#fef3c7' : '#ffffff',
                          color: t.featured ? '#b45309' : '#4b5563',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: isActing ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Star size={13} fill={t.featured ? '#f59e0b' : 'none'} color={t.featured ? '#f59e0b' : '#6b7280'} />
                        {t.featured ? 'Unfeature' : 'Feature'}
                      </button>
                    )}
                  </div>

                  <button
                    disabled={isActing}
                    onClick={() => handleDelete(t._id)}
                    title="Delete permanently"
                    style={{
                      padding: '6px',
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
