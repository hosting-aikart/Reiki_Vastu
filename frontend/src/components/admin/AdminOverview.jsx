import React from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react';

export default function AdminOverview({ stats, loading, onNavigate, onSelectEnquiry }) {
  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        <p>Loading dashboard metrics...</p>
      </div>
    );
  }

  const enq = stats?.enquiries || { total: 0, new: 0, inProgress: 0, resolved: 0, pendingFollowUps: 0 };
  const test = stats?.testimonials || { total: 0, pending: 0, approved: 0 };
  const recent = stats?.recentActivity || [];

  const cards = [
    {
      title: 'Total Enquiries',
      value: enq.total,
      icon: Inbox,
      color: '#4f46e5',
      bg: 'rgba(79, 70, 229, 0.08)',
      action: () => onNavigate('enquiries', { status: 'all' })
    },
    {
      title: 'New / Unattended',
      value: enq.new,
      icon: Clock,
      color: '#d97706',
      bg: 'rgba(217, 119, 6, 0.08)',
      badge: enq.new > 0 ? 'Needs Attention' : null,
      action: () => onNavigate('enquiries', { status: 'new' })
    },
    {
      title: 'In Progress / Contacted',
      value: enq.inProgress,
      icon: Sparkles,
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.08)',
      action: () => onNavigate('enquiries', { status: 'in_progress' })
    },
    {
      title: 'Confirmed / Resolved',
      value: enq.resolved,
      icon: CheckCircle2,
      color: '#16a34a',
      bg: 'rgba(22, 163, 74, 0.08)',
      action: () => onNavigate('enquiries', { status: 'confirmed' })
    },
    {
      title: 'Due Follow-ups',
      value: enq.pendingFollowUps,
      icon: AlertTriangle,
      color: '#dc2626',
      bg: 'rgba(220, 38, 38, 0.08)',
      badge: enq.pendingFollowUps > 0 ? 'Action Due' : null,
      action: () => onNavigate('enquiries', { status: 'all' })
    },
    {
      title: 'Reviews Awaiting Review',
      value: test.pending,
      icon: MessageSquare,
      color: '#9333ea',
      bg: 'rgba(147, 51, 234, 0.08)',
      badge: test.pending > 0 ? 'Moderation Queue' : null,
      action: () => onNavigate('testimonials', { status: 'pending' })
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: 700, color: '#111827' }}>
          Center Operations Overview
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
          Real-time snapshot of incoming enquiries, consultations, and student stories.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px'
        }}
      >
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              onClick={c.action}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>{c.title}</span>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: c.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={20} color={c.color} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>{c.value}</span>
                {c.badge && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: c.bg,
                      color: c.color
                    }}
                  >
                    {c.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Submissions Feed */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>
              Recent Submissions
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6b7280' }}>
              Latest leads captured across website modals and consultation forms.
            </p>
          </div>
          <button
            onClick={() => onNavigate('enquiries')}
            style={{
              background: 'none',
              border: 'none',
              color: '#c59b27',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            View All <ArrowRight size={14} />
          </button>
        </div>

        {recent.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            No enquiries recorded yet. Test submissions will appear here.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recent.map((item, idx) => (
              <div
                key={item._id || idx}
                onClick={() => onSelectEnquiry(item._id)}
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: idx === recent.length - 1 ? 'none' : '1px solid #f3f4f6',
                  cursor: 'pointer',
                  transition: 'background 0.1s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#fef3c7',
                      color: '#92400e',
                      fontWeight: 700,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {item.name ? item.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{item.name}</span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>({item.reference})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px', fontSize: '12px', color: '#6b7280' }}>
                      <span style={{ textTransform: 'capitalize' }}>Type: {item.type}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={12} /> {item.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: item.status === 'new' ? '#fef3c7' : '#ecfdf5',
                      color: item.status === 'new' ? '#92400e' : '#065f46'
                    }}
                  >
                    {item.status}
                  </span>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
