import React, { useState } from 'react';
import { adminLogin } from '../../api/adminClient';
import { Lock, Mail, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onBackToSite }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin({ email: email.trim(), password });

      if (res.success) {
        onLoginSuccess(res.data.admin);
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #12141a 0%, #1a1e28 50%, #0f1117 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'inherit'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(26, 30, 40, 0.85)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(197, 155, 39, 0.25)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 40px rgba(197, 155, 39, 0.08)',
          padding: '40px 32px'
        }}
      >
        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #c59b27, #f3d47c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(197, 155, 39, 0.35)'
            }}
          >
            <Lock size={26} color="#12141a" />
          </div>
          <h1
            style={{
              margin: '0 0 6px',
              fontSize: '22px',
              fontWeight: 700,
              color: '#fdfbf7',
              letterSpacing: '-0.3px'
            }}
          >
            Administrator Portal
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#9da3b4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#c59b27" /> Reiki & Vaastu World Management
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '20px',
              color: '#fca5a5',
              fontSize: '13px',
              lineHeight: '1.4'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label
              htmlFor="admin-email"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#d1d5db',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color="#6b7280"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@reikivaastuworld.com"
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  background: 'rgba(15, 17, 23, 0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#d1d5db',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color="#6b7280"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  background: 'rgba(15, 17, 23, 0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '12px',
              background: loading
                ? 'rgba(197, 155, 39, 0.6)'
                : 'linear-gradient(135deg, #c59b27, #dbb03f)',
              color: '#111827',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(197, 155, 39, 0.3)',
              transition: 'transform 0.15s ease'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Back to Public Site */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onBackToSite}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '13px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} /> Back to public website
          </button>
        </div>
      </div>
    </div>
  );
}
