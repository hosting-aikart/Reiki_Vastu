import React, { useState } from 'react';
import { Calendar, Mail, Sparkles } from 'lucide-react';

export default function FloatingWidgets({ openModal }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 9990,
        bottom: '24px',
        right: '24px'
      }}
    >
      {/* Popover Bubble */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 14px)',
            right: 0,
            width: 'min(300px, calc(100vw - 32px))',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.7)',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow: '0 18px 50px rgba(76, 29, 149, 0.18)',
            padding: '20px',
            animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 10000
          }}
        >
          <div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#2563eb' }}>
              Hi there
            </p>
            <h3 style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              How can we help you today?
            </h3>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openModal('schedule');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '50px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #cbd5e1',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1e293b',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)')}
            >
              <Calendar size={16} color="#2563eb" />
              <span>Schedule a meeting</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openModal('contact');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '50px',
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #cbd5e1',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1e293b',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)')}
            >
              <Mail size={16} color="#2563eb" />
              <span>Contact us</span>
            </button>
          </div>
        </div>
      )}

      {/* 3D Robot Waving Button */}
      <button
        type="button"
        aria-label="How can we help"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          border: 'none',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0
        }}
      >
        <svg
          viewBox="0 0 100 88"
          className="smw-wave"
          style={{
            width: '68px',
            height: '68px',
            filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.3))'
          }}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="rb-screen" cx="50%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#12407a" />
              <stop offset="100%" stopColor="#020712" />
            </radialGradient>
            <linearGradient id="rb-shell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#c9ced6" />
            </linearGradient>
          </defs>
          <rect x="3" y="30" width="9" height="26" rx="4.5" fill="#111" />
          <rect x="9" y="33" width="2.4" height="20" rx="1.2" fill="#2563eb" />
          <rect x="88" y="30" width="9" height="26" rx="4.5" fill="#111" />
          <rect x="88.6" y="33" width="2.4" height="20" rx="1.2" fill="#2563eb" />
          <path
            d="M50 6 C78 6 92 26 92 50 C92 70 78 80 50 80 C22 80 8 70 8 50 C8 26 22 6 50 6Z"
            fill="url(#rb-shell)"
          />
          <rect x="42" y="4.5" width="16" height="5" rx="2.5" fill="#2563eb" />
          <path
            d="M50 14 C74 14 85 28 85 48 C85 64 74 73 50 73 C26 73 15 64 15 48 C15 28 26 14 50 14Z"
            fill="url(#rb-screen)"
          />
          <g style={{ animation: 'rb-face .35s ease-out', transformOrigin: '50px 44px' }}>
            <g fill="#3b82f6">
              <path d="M27 48 q0 -13 9 -13 q9 0 9 13 q-9 -4 -18 0z" />
              <path d="M55 48 q0 -13 9 -13 q9 0 9 13 q-9 -4 -18 0z" />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
