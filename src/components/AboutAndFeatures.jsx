import React from 'react';
import { Award, Mail } from 'lucide-react';
import CoursesGrid from './CoursesGrid';

export default function AboutAndFeatures({ onConsultClick, onSelectCourse }) {
  return (
    <>
      {/* 1. Welcome to Reiki & Vaastu World - Dr. Naresh Chhabdiya Section */}
      <section style={{ padding: '60px 0 20px', background: '#fdfbf7' }}>
        <div className="hm-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
              background: '#ffffff',
              borderRadius: '28px',
              padding: '36px',
              border: '2px solid rgba(212,175,55,0.45)',
              boxShadow: '0 12px 35px rgba(180,83,9,0.07)'
            }}
          >
            {/* Left: Founder Mark & Foundation Badge */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fef2f4 0%, #fffbeb 50%, #f5f3ff 100%)',
                  border: '3px solid #d4af37',
                  margin: '0 auto 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(210,4,45,0.18)'
                }}
              >
                <img
                  src="/logo/reiki-vastu-mark.svg"
                  alt="Reiki &amp; Vaastu World Mark"
                  style={{ width: '110px', height: '110px', objectFit: 'contain' }}
                />
              </div>

              <h3 className="ff-cinzel" style={{ fontSize: '24px', fontWeight: 800, color: '#D2042D', margin: '0 0 6px' }}>
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
              <h2 className="ff-redhat" style={{ fontSize: '30px', fontWeight: 700, color: '#3b0a11', margin: '0 0 16px' }}>
                Welcome to Reiki &amp; Vaastu World
              </h2>

              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#4a1923', margin: '0 0 16px' }}>
                Dr. Naresh Chhabdiya has been practicing <strong>Reiki, Vaastu, Rudraksh, Astrology, and Numerology since 1995</strong>. A doctor by profession and motivational mentor with centers in <strong>Amravati and Nagpur, India</strong>, it has always been his dream to empower people around the world with genuine Reiki and spiritual healing.
              </p>

              <blockquote
                style={{
                  margin: '0 0 20px',
                  padding: '12px 20px',
                  borderLeft: '4px solid #D2042D',
                  background: '#fffdf9',
                  fontStyle: 'italic',
                  color: '#88021e',
                  fontSize: '14.5px',
                  borderRadius: '0 12px 12px 0'
                }}
              >
                “It’s been a beautiful journey with Reiki; it has subtly yet powerfully helped thousands hold their lives together, conquer illness, and achieve deep peace.”
              </blockquote>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="gnav-btn-primary"
                  onClick={onConsultClick}
                  style={{
                    background: '#D2042D',
                    borderColor: '#D2042D',
                    fontSize: '14px',
                    padding: '10px 24px'
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
                    padding: '10px 20px',
                    borderRadius: '50px',
                    border: '1.5px solid #d4af37',
                    background: '#ffffff',
                    color: '#3b0a11',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    textDecoration: 'none'
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

      {/* 2. OUR COURSES (15 Courses in exact format of Image 3, replacing the signature commitments) */}
      <CoursesGrid onSelectCourse={onSelectCourse} />
    </>
  );
}
