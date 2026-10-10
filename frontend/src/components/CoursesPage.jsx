import React from 'react';
import CoursesGrid from './CoursesGrid';

export default function CoursesPage({ onSelectCourse, onBack }) {
  return (
    <div className="courses-page-wrap" style={{ paddingTop: '100px', minHeight: '100vh', background: '#fdfbf7' }}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Page Header — Premium Dark Banner */}
      <div className="courses-header-pad" style={{ textAlign: 'center', padding: '24px 24px 0' }}>

        <div
          className="courses-dark-banner"
          style={{
            textAlign: 'center',
            padding: '36px 24px',
            background: 'linear-gradient(135deg, #3b0a11 0%, #1a0630 50%, #3b0a11 100%)',
            borderRadius: '24px',
            border: '1.5px solid rgba(212,175,55,0.4)',
            boxShadow: '0 16px 48px rgba(59, 10, 17, 0.35)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '0'
          }}
        >
          {/* Decorative glow blobs */}
          <div style={{
            position: 'absolute', top: '-40px', left: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(210,4,45,0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-40px', right: '-40px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <p style={{
            fontSize: '13px', fontWeight: 800, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: '#fbbf24', margin: '0 0 14px', position: 'relative'
          }}>
            ✦ Holistic Astrological Center ✦
          </p>

          <h1
            className="ff-cinzel"
            style={{
              fontSize: 'clamp(22px, 3.5vw, 38px)', fontWeight: 900,
              margin: '0 0 6px', position: 'relative', lineHeight: 1.25,
              background: 'linear-gradient(135deg, #fbbf24 0%, #f87171 30%, #c084fc 60%, #60a5fa 85%, #fbbf24 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', backgroundSize: '200% auto',
              animation: 'gradientShift 4s linear infinite'
            }}
          >
            Experience, Learn &amp; Transform With
          </h1>

          <h2
            className="ff-cinzel"
            style={{
              fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 900,
              margin: '0 0 16px', position: 'relative', lineHeight: 1.2,
              background: 'linear-gradient(135deg, #ff6b9d 0%, #fbbf24 40%, #a78bfa 70%, #ff6b9d 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', backgroundSize: '200% auto',
              animation: 'gradientShift 3s linear infinite reverse'
            }}
          >
            Reiki &amp; Vaastu World
          </h2>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,175,55,0.4)',
            padding: '8px 22px', borderRadius: '50px', position: 'relative'
          }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#fcd5dc', letterSpacing: '0.06em' }}>
              ✦ Holistic Astrological Center ✦
            </span>
          </div>
        </div>
      </div>

      {/* Full courses grid */}
      <CoursesGrid onSelectCourse={onSelectCourse} showAll={true} />
    </div>
  );
}
