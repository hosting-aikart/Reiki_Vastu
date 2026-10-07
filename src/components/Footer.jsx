import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const COURSES_NAMES = [
  'Meditation',
  'Reiki',
  'Vaastu',
  'Feng-Shui',
  'Dowsing',
  'Lama-Fera',
  'Accupressure',
  'Crystal Therapy',
  'Pyramid',
  'Numerology',
  'Astrology',
  'Rudraksha',
  'Pranic Healing',
  'Gems with Reiki',
  'Color Therapy'
];

export default function Footer({ setCurrentView, openModal }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer-contact" className="akf" style={{ background: '#3b0a11', color: '#fffdf9', paddingTop: '60px' }}>
      <div className="akf-inner" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Main 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            paddingBottom: '48px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)'
          }}
        >
          {/* Column 1: Brand & Centers */}
          <div style={{ maxWidth: '340px' }}>
            <div style={{ marginBottom: '16px' }}>
              <span className="ff-cinzel" style={{ fontSize: '22px', fontWeight: 800, color: '#fef3c7', letterSpacing: '0.04em' }}>
                Reiki &amp; <span style={{ color: '#D2042D' }}>Vaastu</span> World
              </span>
            </div>

            <p style={{ fontSize: '13.5px', lineHeight: 1.65, color: '#fcd5dc', margin: '0 0 20px' }}>
              Training &amp; Treatment Center founded by Dr. Naresh Chhabdiya. Empowering seekers across the globe through Reiki energy healing, scientific Vaastu Shastra, Vedic Astrology, and holistic wellness since 1995.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#D2042D" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#ffe4e6', lineHeight: 1.45 }}>
                  <strong style={{ color: '#fbbf24' }}>Amravati:</strong> Sanjiwani Reiki &amp; Vaastu Center, Khatri Complex, 1st Lane, Shop No. 4, Walcut Compound.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#ffe4e6', lineHeight: 1.45 }}>
                  <strong style={{ color: '#fbbf24' }}>Nagpur:</strong> Reiki &amp; Vaastu World, Near New English High School Mahal.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <Phone size={15} color="#D2042D" />
                <span style={{ color: '#fff', fontWeight: 600 }}>
                  8446656677 / 9423424596
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#d4af37" />
                <span style={{ color: '#fcd5dc' }}>
                  reki.vastuworld@gmail.com
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <a
                href="https://www.facebook.com/reikiandvastuworld/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  textDecoration: 'none'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@reikiandvastuworld"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  textDecoration: 'none'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              <a
                href="https://www.instagram.com/vastuworld/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  textDecoration: 'none'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: (i) OUR COURSES (with just names of the courses) */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#fbbf24',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: '0 0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Our Courses</span>
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px 14px'
              }}
            >
              {COURSES_NAMES.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => scrollToSection('courses-section')}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    color: '#fcd5dc',
                    fontSize: '13.5px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fbbf24')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#fcd5dc')}
                >
                  • {name}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: (ii) QUICK LINKS */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#fbbf24',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: '0 0 16px'
              }}
            >
              Quick Links
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#fffdf9',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D2042D')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#fffdf9')}
              >
                → Home
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('courses-section')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#fffdf9',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D2042D')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#fffdf9')}
              >
                → Courses
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('products-section')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#fffdf9',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D2042D')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#fffdf9')}
              >
                → Products
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('footer-contact')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#fffdf9',
                  fontSize: '14px',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#D2042D')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#fffdf9')}
              >
                → Contact Us
              </button>
            </div>
          </div>

          {/* Column 4: (iii) OPENING HOURS */}
          <div>
            <h4
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#fbbf24',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: '0 0 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Clock size={16} color="#fbbf24" />
              <span>Opening Hours</span>
            </h4>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1.5px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '13.5px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>Mon - Tues:</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>6.00 am - 10.00 pm</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>Wednes - Thurs:</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>8.00 am - 6.00 pm</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>Fri:</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>3.00 pm - 8.00 pm</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#f87171', fontWeight: 700 }}>Sun:</span>
                <span style={{ color: '#f87171', fontWeight: 700 }}>Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            padding: '24px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '13px',
            color: '#fcd5dc'
          }}
        >
          <div>
            © 1995–2026 <strong style={{ color: '#fff' }}>Reiki &amp; Vaastu World</strong>. Founded by Dr. Naresh Chhabdiya. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '18px' }}>
            <button
              type="button"
              onClick={() => openModal('meeting')}
              style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
            >
              Book Consultation
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('footer-contact')}
              style={{ background: 'none', border: 'none', color: '#fcd5dc', cursor: 'pointer', fontSize: '13px' }}
            >
              Amravati &amp; Nagpur
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
