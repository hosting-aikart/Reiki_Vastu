import React from 'react';
import { Award, Mail } from 'lucide-react';
import CoursesGrid from './CoursesGrid';

export default function AboutAndFeatures({ onConsultClick, onSelectCourse, onSeeAllCourses }) {
  return (
    <>
      {/* 1. Welcome to Reiki & Vaastu World - Dr. Naresh Chhabdiya Section */}
      <section style={{ padding: '60px 0 20px', background: '#fdfbf7' }}>
        <div className="hm-container">
          <div className="about-grid">
            {/* Left: Founder Mark & Pure Lotus Emblem (No circular boundary) */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 18px' }}>
                <img
                  src="/logo/lotus_pure.png"
                  alt="Reiki &amp; Vaastu Lotus"
                  style={{
                    width: '180px',
                    height: 'auto',
                    maxHeight: '120px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>

              <h3 className="ff-cinzel" style={{ fontSize: 'clamp(20px, 2.2vw, 24px)', fontWeight: 800, color: '#1a1a1a', margin: '0 0 6px' }}>
                Dr. Naresh Chhabdiya
              </h3>
              <p style={{ fontSize: '13.5px', color: '#b45309', fontWeight: 700, margin: '0 0 14px', letterSpacing: '0.04em' }}>
                Doctor by Profession • Motivational Speaker • Reiki Grandmaster
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef2f4', border: '1px solid #fecaca', padding: '6px 14px', borderRadius: '50px' }}>
                <Award size={16} color="#D2042D" />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#88021e' }}>
                  Practicing Since 1995 • 28+ Years Experience
                </span>
              </div>
            </div>

            {/* Right: Bio & Mission */}
            <div>
              <p
                className="hm-eyebrow"
                style={{
                  color: '#D2042D',
                  marginBottom: '6px',
                  fontWeight: 800,
                  letterSpacing: '0.14em'
                }}
              >
                ABOUT OUR FOUNDER &amp; MISSION
              </p>
              <h2 className="ff-redhat" style={{ fontSize: 'clamp(22px, 2.6vw, 30px)', fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>
                Welcome to Reiki &amp; Vaastu World
              </h2>

              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#4a1923', margin: '0 0 16px' }}>
                Dr. Naresh Chhabdiya has been practicing <strong>Reiki, Vaastu, Rudraksh, Astrology, and Numerology since 1995</strong>. A doctor by profession and motivational mentor with centers in <strong>Amravati and Nagpur, India</strong>, it has always been his dream to empower people around the world with genuine Reiki and spiritual healing.
              </p>

              <p
                style={{
                  margin: '0 0 22px',
                  padding: 0,
                  fontStyle: 'italic',
                  color: '#88021e',
                  fontSize: '15px',
                  lineHeight: 1.65,
                  fontWeight: 500
                }}
              >
                “It’s been a beautiful journey with Reiki; it has subtly yet powerfully helped thousands hold their lives together, conquer illness, and achieve deep peace.”
              </p>

              <div className="about-btn-row">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={onConsultClick}
                  style={{
                    fontSize: '13.5px',
                    padding: '11px 22px',
                    flexShrink: 0
                  }}
                >
                  Book Session with Dr. Naresh
                </button>
                <a
                  href="mailto:reki.vastuworld@gmail.com"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '11px 20px',
                    borderRadius: '50px',
                    border: '1.5px solid #d4af37',
                    background: '#ffffff',
                    color: '#3b0a11',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    textDecoration: 'none',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fef2f4';
                    e.currentTarget.style.borderColor = '#D2042D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#d4af37';
                  }}
                >
                  <Mail size={15} color="#D2042D" />
                  <span>reki.vastuworld@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR COURSES (4 courses preview on home page) */}
      <CoursesGrid onSelectCourse={onSelectCourse} onSeeAllCourses={onSeeAllCourses} />
    </>
  );
}
