import React, { useState } from 'react';
import { ArrowRight, Sparkles, Leaf, Sun } from 'lucide-react';

export default function Hero({ onSearch, onConsultClick, onExploreCourses }) {
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
        {/* Two-column layout: content left, video on right */}
        <div className="hero-grid">
          {/* Left Column: Content */}
          <div className="hero-content-col">
            {/* Brand Logo: REIKI 🪷 VAASTU — WORLD — */}
            <div style={{ marginBottom: '18px', width: '100%', marginTop: '10px' }}>
              <img
                src="/logo/logo-text-only.png"
                alt="Reiki Vaastu World"
                style={{
                  width: '94%',
                  maxWidth: '520px',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>

            {/* 3. Headline */}
            <h1
              style={{
                fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
                fontSize: 'clamp(20px, 2.3vw, 27.5px)',
                fontWeight: 600,
                lineHeight: 1.34,
                color: '#3b0a11',
                margin: '0 0 24px',
                width: '100%',
                maxWidth: '540px',
                letterSpacing: '-0.01em'
              }}
            >
              Ancient Wisdom for a Healthier, Happier and More Harmonious Life
            </h1>

            {/* 5. Action Buttons (Explore Our Courses & Book a Consultation) */}
            <div className="hero-btn-row">
              <button
                type="button"
                onClick={() => {
                  if (onExploreCourses) onExploreCourses();
                  else {
                    const el = document.getElementById('courses-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else if (onSearch) onSearch();
                  }
                }}
                className="btn-primary"
                style={{
                  padding: '13px 28px',
                  borderRadius: '50px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '15px'
                }}
              >
                <span>Explore Our Courses</span>
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                onClick={onConsultClick}
                className="hero-btn-secondary"
                style={{
                  background: '#ffffff',
                  color: '#7d0e15',
                  fontWeight: 700,
                  fontSize: '15px',
                  padding: '13px 26px',
                  borderRadius: '50px',
                  border: '1.5px solid #d4af37',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'none',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fef2f4';
                  e.currentTarget.style.borderColor = '#8B151B';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Book a Consultation
              </button>
            </div>

            {/* 6. Three Feature Pillars (Heal Your Mind, Balance Your Space, Transform Your Life) */}
            <div className="hero-pillars" style={{ width: '94%', maxWidth: '520px' }}>
              {/* Pillar 1: Heal Your Mind */}
              <div className="hero-pillar-item">
                <div className="hero-pillar-icon">
                  <img
                    src="/logo/lotus_pure.png"
                    alt="Heal Your Mind"
                    style={{ height: '22px', width: 'auto', objectFit: 'contain' }}
                  />
                </div>
                <div className="hero-pillar-text">
                  Heal<span className="hero-pillar-break"><br /></span>{' '}
                  <span className="hero-pillar-sub">Your Mind</span>
                </div>
              </div>

              {/* Divider 1 */}
              <div className="hero-pillar-divider" />

              {/* Pillar 2: Balance Your Space */}
              <div className="hero-pillar-item">
                <div className="hero-pillar-icon">
                  <Leaf size={22} color="#b45309" />
                </div>
                <div className="hero-pillar-text">
                  Balance<span className="hero-pillar-break"><br /></span>{' '}
                  <span className="hero-pillar-sub">Your Space</span>
                </div>
              </div>

              {/* Divider 2 */}
              <div className="hero-pillar-divider" />

              {/* Pillar 3: Transform Your Life */}
              <div className="hero-pillar-item">
                <div className="hero-pillar-icon">
                  <Sun size={22} color="#b45309" />
                </div>
                <div className="hero-pillar-text">
                  Transform<span className="hero-pillar-break"><br /></span>{' '}
                  <span className="hero-pillar-sub">Your Life</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Main Video (enlarged and aligned) */}
          <div className="hero-video-col" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '640px',
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
                  maxHeight: '490px',
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
