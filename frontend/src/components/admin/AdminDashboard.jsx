import React, { useState, useEffect } from 'react';
import { getAdminProfile, adminLogout, getOverviewStats } from '../../api/adminClient';
import AdminLogin from './AdminLogin';
import AdminOverview from './AdminOverview';
import AdminEnquiries from './AdminEnquiries';
import AdminTestimonials from './AdminTestimonials';
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  LogOut,
  ExternalLink,
  Shield,
  Loader2
} from 'lucide-react';

export default function AdminDashboard({ onExitToSite }) {
  const [admin, setAdmin] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [preselectedEnquiryId, setPreselectedEnquiryId] = useState(null);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all');

  // Verify active session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await getAdminProfile();
        if (res.success && res.data?.admin) {
          setAdmin(res.data.admin);
        } else {
          setAdmin(null);
        }
      } catch {
        setAdmin(null);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

  // Fetch KPI metrics when authenticated
  const loadStats = async () => {
    if (!admin) return;
    setStatsLoading(true);
    try {
      const res = await getOverviewStats();
      if (res.success) {
        setStats(res.data);
      }
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      loadStats();
    }
  }, [admin, activeTab]);

  const handleLogout = async () => {
    try {
      await adminLogout();
    } finally {
      setAdmin(null);
      setActiveTab('overview');
    }
  };

  const navigateTo = (tab, params = {}) => {
    if (params.status) {
      setEnquiryStatusFilter(params.status);
    }
    setActiveTab(tab);
  };

  const handleSelectRecentEnquiry = (id) => {
    setPreselectedEnquiryId(id);
    setActiveTab('enquiries');
  };

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fdfbf7',
          color: '#4b5563',
          fontFamily: 'inherit'
        }}
      >
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px', color: '#c59b27' }} />
        <p style={{ margin: 0, fontWeight: 600 }}>Verifying administrator credentials...</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <AdminLogin
        onLoginSuccess={(loggedAdmin) => setAdmin(loggedAdmin)}
        onBackToSite={onExitToSite}
      />
    );
  }

  const newEnquiriesCount = stats?.enquiries?.new || 0;
  const pendingTestimonialsCount = stats?.testimonials?.pending || 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#f8fafc',
        fontFamily: 'inherit',
        color: '#1e293b'
      }}
    >
      {/* ── Left Sidebar Navigation ── */}
      <aside
        style={{
          width: '260px',
          background: '#0f172a',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <div>
          {/* Brand Header */}
          <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #c59b27, #e5b842)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '18px'
                }}
              >
                ॐ
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '15px', color: '#f8fafc', letterSpacing: '-0.3px' }}>
                  Reiki & Vaastu
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={11} color="#c59b27" /> Admin Center
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'overview' ? '#1e293b' : 'transparent',
                color: activeTab === 'overview' ? '#f8fafc' : '#94a3b8',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutDashboard size={18} color={activeTab === 'overview' ? '#c59b27' : '#94a3b8'} />
                <span>Overview</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('enquiries')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'enquiries' ? '#1e293b' : 'transparent',
                color: activeTab === 'enquiries' ? '#f8fafc' : '#94a3b8',
                fontWeight: activeTab === 'enquiries' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Inbox size={18} color={activeTab === 'enquiries' ? '#c59b27' : '#94a3b8'} />
                <span>Enquiries</span>
              </div>
              {newEnquiriesCount > 0 && (
                <span
                  style={{
                    background: '#f59e0b',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '11px',
                    padding: '1px 6px',
                    borderRadius: '999px'
                  }}
                >
                  {newEnquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'testimonials' ? '#1e293b' : 'transparent',
                color: activeTab === 'testimonials' ? '#f8fafc' : '#94a3b8',
                fontWeight: activeTab === 'testimonials' ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={18} color={activeTab === 'testimonials' ? '#c59b27' : '#94a3b8'} />
                <span>Testimonials</span>
              </div>
              {pendingTestimonialsCount > 0 && (
                <span
                  style={{
                    background: '#8b5cf6',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '11px',
                    padding: '1px 6px',
                    borderRadius: '999px'
                  }}
                >
                  {pendingTestimonialsCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom User Profile & Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#334155',
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px'
              }}
            >
              {admin.name ? admin.name[0] : 'A'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {admin.name}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {admin.email}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              onClick={onExitToSite}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: '#94a3b8',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <ExternalLink size={14} /> View Public Website
            </button>

            <button
              onClick={handleLogout}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Dashboard Workspace ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header
          style={{
            height: '60px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            flexShrink: 0
          }}
        >
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            Workspace: <strong style={{ color: '#0f172a' }}>Reiki & Vaastu World (Amravati & Nagpur)</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              style={{
                fontSize: '12px',
                background: '#ecfdf5',
                color: '#065f46',
                padding: '3px 10px',
                borderRadius: '999px',
                fontWeight: 600,
                border: '1px solid #a7f3d0'
              }}
            >
              System Online
            </span>
          </div>
        </header>

        {/* View Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          {activeTab === 'overview' && (
            <AdminOverview
              stats={stats}
              loading={statsLoading}
              onNavigate={navigateTo}
              onSelectEnquiry={handleSelectRecentEnquiry}
            />
          )}

          {activeTab === 'enquiries' && (
            <AdminEnquiries
              initialStatus={enquiryStatusFilter}
              preselectedId={preselectedEnquiryId}
              onClearPreselected={() => setPreselectedEnquiryId(null)}
            />
          )}

          {activeTab === 'testimonials' && (
            <AdminTestimonials />
          )}
        </main>
      </div>
    </div>
  );
}
