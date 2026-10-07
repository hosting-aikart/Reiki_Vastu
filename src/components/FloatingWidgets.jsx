import React, { useState } from 'react';
import { Calendar, Mail, Phone, MessageCircle, Sparkles, X } from 'lucide-react';

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
            width: 'min(320px, calc(100vw - 32px))',
            borderRadius: '24px',
            border: '2px solid rgba(212, 175, 55, 0.6)',
            background: 'rgba(255, 253, 249, 0.96)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow: '0 18px 50px rgba(74, 14, 23, 0.22)',
            padding: '20px',
            animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 10000
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#dc2626', letterSpacing: '0.04em' }}>
                ✦ NAMASTE &amp; BLESSINGS
              </p>
              <h3 style={{ margin: '4px 0 0', fontSize: '17px', fontWeight: 700, color: '#3b0a11' }}>
                How can we assist you today?
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: '#fef2f2',
                border: 'none',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={15} />
            </button>
          </div>

          <p style={{ fontSize: '12.5px', color: '#784450', margin: '0 0 14px', lineHeight: 1.45 }}>
            Connect directly with Dr. Naresh Chhabdiya's team for Vaastu audits, Reiki training, or Kundali consultations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                openModal('meeting');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '50px',
                background: '#ffffff',
                border: '1.5px solid #d4af37',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#3b0a11',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 2px 6px rgba(180,83,9,0.06)',
                transition: 'all 0.2s'
              }}
            >
              <Calendar size={16} color="#dc2626" />
              <span>Schedule Personal Consultation</span>
            </button>

            <a
              href="https://wa.me/+918446656677/?text=Hello Dr. Naresh, I would like to inquire about Reiki and Vaastu consultation."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '50px',
                background: '#ffffff',
                border: '1.5px solid #22c55e',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#15803d',
                cursor: 'pointer',
                textDecoration: 'none',
                textAlign: 'left',
                boxShadow: '0 2px 6px rgba(34,197,94,0.1)',
                transition: 'all 0.2s'
              }}
            >
              <MessageCircle size={16} color="#22c55e" />
              <span>WhatsApp Us (+91 8446656677)</span>
            </a>

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
                background: '#ffffff',
                border: '1.5px solid rgba(212,175,55,0.4)',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#3b0a11',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <Mail size={16} color="#7c3aed" />
              <span>Send Query / Center Enquiry</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Sacred Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Holistic Help & Consultations"
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #d4af37 100%)',
          border: '2px solid #fbbf24',
          boxShadow: '0 8px 30px rgba(220, 38, 38, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: isOpen ? 'rotate(90deg) scale(1.05)' : 'scale(1)'
        }}
      >
        <img
          src="/logo/reiki-vastu-mark.svg"
          alt="Reiki Mark"
          style={{ width: '38px', height: '38px', objectFit: 'contain' }}
        />
      </button>
    </div>
  );
}
