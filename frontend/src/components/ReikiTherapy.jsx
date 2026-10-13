import React from 'react';

export default function ReikiTherapy({ onBookSession }) {
  return (
    <section
      id="reiki-therapy-section"
      style={{
        position: 'relative',
        padding: '70px 24px 85px',
        background: '#fdfbf7',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)'
      }}
    >
      {/* Content box containing data */}
      <div
        style={{
          position: 'relative',
          maxWidth: '880px',
          margin: '0 auto',
          background: '#ffffff',
          border: '1.5px solid rgba(212, 175, 55, 0.45)',
          borderRadius: '26px',
          padding: 'clamp(36px, 5vw, 56px) clamp(24px, 5vw, 64px)',
          boxShadow: '0 14px 40px rgba(180, 83, 9, 0.08)',
          textAlign: 'center'
        }}
      >
        {/* Eyebrow */}
        <p
          style={{
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#D2042D',
            margin: '0 0 14px'
          }}
        >
          ✦ ANCIENT HEALING ART ✦
        </p>

        {/* Title */}
        <h2
          className="ff-redhat"
          style={{
            fontSize: 'clamp(30px, 4.5vw, 48px)',
            fontWeight: 900,
            lineHeight: 1.18,
            color: '#1a1a1a',
            margin: '0 0 20px'
          }}
        >
          Our Reiki Therapy
        </h2>

        {/* Body text */}
        <p
          style={{
            fontSize: 'clamp(14.5px, 1.5vw, 16px)',
            lineHeight: 1.8,
            color: '#5e2732',
            margin: '0 0 16px',
            fontWeight: 500
          }}
        >
          <strong style={{ color: '#b45309', fontWeight: 700 }}>Our best offers.</strong> Advocates believe that there is an energy field around
          the body and that disrupting it can lead to ailments. Reiki therapy aims to remedy these disruptions and the
          subsequent conditions. In Reiki treatment, practitioners will place their hands over various parts of a person's
          body and transfer healing energy.
        </p>
        <p
          style={{
            fontSize: 'clamp(14.5px, 1.5vw, 16px)',
            lineHeight: 1.8,
            color: '#5e2732',
            margin: '0 0 32px',
            fontWeight: 500
          }}
        >
          During a session, practitioners may focus their energy on the sources of specific conditions. Typically a single
          treatment session will last{' '}
          <strong style={{ color: '#D2042D', fontWeight: 700, fontSize: '16.5px' }}>45–90 minutes</strong>.
        </p>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onBookSession}
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 38px',
            borderRadius: '50px',
            fontSize: '15px',
            letterSpacing: '0.02em'
          }}
        >
          Book a Reiki Session
        </button>
      </div>
    </section>
  );
}
