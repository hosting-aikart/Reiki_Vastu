import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Compass, Award, Users } from 'lucide-react';

export default function Hero({ onSearch, onConsultClick }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <section
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #fffdfa 0%, #fdfbf7 60%, #faf4ea 100%)',
        paddingTop: '100px',
        paddingBottom: '50px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        overflow: 'hidden'
      }}
    >
      {/* Soft ambient cosmic glow */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(210, 4, 45, 0.08) 0%, rgba(212, 175, 55, 0.08) 50%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '0%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="hm-container">
        {/* Two-column layout matching BlueNeuron: content left, video centered on right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Content */}
          <div>
            {/* Eyebrow tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#D2042D',
                fontSize: '12.5px',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '14px'
              }}
            >
              <span>✦ ESTABLISHED 1995 • DR. NARESH CHHABDIYA</span>
            </div>

            {/* Main Headline (Cherry Red, Golden & Violet combination without black) */}
            <h1
              className="ff-redhat"
              style={{
                fontSize: 'clamp(30px, 3.6vw, 46px)',
                fontWeight: 800,
                lineHeight: 1.18,
                margin: '0 0 16px',
                letterSpacing: '-0.01em'
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #D2042D 0%, #b45309 60%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline'
                }}
              >
                Experience, Learn &amp; Transform With <br></br>
              </span>{' '}
              <span
                style={{
                  color: '#D2042D',
                  textShadow: '0 2px 14px rgba(210, 4, 45, 0.2)'
                }}
              >
                Reiki &amp; Vaastu World
              </span>{' '}
              <span
                style={{
                  display: 'block',
                  fontSize: '0.78em',
                  background: 'linear-gradient(90deg, #d4af37 0%, #b45309 50%, #d4af37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                  marginTop: '8px',
                  letterSpacing: '0.02em'
                }}
              >
                ✦ Holistic Astrological Center ✦
              </span>
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '15.5px',
                lineHeight: 1.65,
                color: '#5e2732',
                margin: '0 0 24px',
                maxWidth: '560px'
              }}
            >
              We deliver authentic energy healing, scientific non-destructive Vaastu audits, and certified practitioner courses—from personal energy diagnosis to life-transforming remedies—guided by Dr. Naresh Chhabdiya across Amravati &amp; Nagpur.
            </p>

            {/* Action Buttons (Cherry Red primary & Golden outlined) */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('courses-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: '#D2042D',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '15px',
                  padding: '13px 30px',
                  borderRadius: '10px',
                  border: '1.5px solid #D2042D',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(210, 4, 45, 0.28)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#b00326')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#D2042D')}
              >
                <span>Get Started</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('features-section') || document.getElementById('courses-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: '#ffffff',
                  color: '#D2042D',
                  fontWeight: 700,
                  fontSize: '15px',
                  padding: '13px 26px',
                  borderRadius: '10px',
                  border: '1.5px solid #d4af37',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(180, 83, 9, 0.08)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D2042D';
                  e.currentTarget.style.background = '#fff8f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                <span>View All Services</span>
              </button>
            </div>
          </div>

          {/* Right Column: Main Video (centered and brought slightly upward) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '560px',
                borderRadius: '26px',
                overflow: 'hidden',
                border: '2.5px solid rgba(212, 175, 55, 0.45)',
                boxShadow: '0 24px 60px rgba(210, 4, 45, 0.16), 0 6px 24px rgba(180, 83, 9, 0.1)',
                background: '#4a0e17'
              }}
            >
              <video
                src="/images/main-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '440px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              {/* Decorative Corner Seal Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  background: 'rgba(59, 10, 17, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(212, 175, 55, 0.6)',
                  borderRadius: '50px',
                  padding: '6px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fffdf9'
                }}
              >
                <Sparkles size={14} color="#fbbf24" />
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
                  Training &amp; Treatment Center
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
