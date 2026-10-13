import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  openModal,
  isDarkTheme = false
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`gnav ${isScrolled ? 'gnav-scrolled' : ''} ${isDarkTheme ? 'gnav-dark' : ''}`}>
        <div className="gnav-in">
          {/* Site Logo */}
          <a
            href="/"
            className="gnav-logo"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            aria-label="Reiki & Vaastu World - Home"
          >
            <img
              src="/logo/reiki-vastu-logo.png"
              alt="Reiki & Vaastu World"
              style={{ height: '48px', width: 'auto', display: 'block', objectFit: 'contain' }}
            />
          </a>

          {/* Nav Links: Home, Courses, Products, Contact Us */}
          <nav className="gnav-links">
            <button
              type="button"
              className={`gnav-link ${currentView === 'home' ? 'gnav-link-active' : ''}`}
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Home
            </button>

            <button
              type="button"
              className={`gnav-link ${currentView === 'courses' || currentView === 'course-detail' ? 'gnav-link-active' : ''}`}
              onClick={() => {
                setCurrentView('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Courses
            </button>

            <button
              type="button"
              className="gnav-link"
              onClick={() => {
                if (currentView !== 'home') {
                  setCurrentView('home');
                  setTimeout(() => {
                    const el = document.getElementById('products-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 120);
                } else {
                  const el = document.getElementById('products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Products
            </button>

            <button
              type="button"
              className="gnav-link"
              onClick={() => {
                const el = document.getElementById('footer-contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Controls */}
          <div className="gnav-right">
            <a
              href="tel:8446656677"
              className="gnav-icon-btn"
              title="Call Helpline: 8446656677"
            >
              <Phone size={18} color="#dc2626" />
            </a>

            <button
              type="button"
              className="gnav-btn-primary"
              onClick={() => openModal('meeting')}
            >
              Book Consultation
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="gnav-hamburger"
              aria-label="Toggle menu"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`gnav-drawer-backdrop ${isDrawerOpen ? 'gnav-drawer-backdrop--open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className={`gnav-drawer-panel ${isDrawerOpen ? 'gnav-drawer-panel--open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          {/* Site Logo */}
          <img
            src="/logo/reiki-vastu-logo.png"
            alt="Reiki & Vaastu World"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 600,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsDrawerOpen(false);
            }}
          >
            Home
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 600,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsDrawerOpen(false);
              setCurrentView('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Courses
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 600,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsDrawerOpen(false);
              if (currentView !== 'home') {
                setCurrentView('home');
                setTimeout(() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 120);
              } else {
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Products
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 600,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsDrawerOpen(false);
              const el = document.getElementById('footer-contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Contact Us
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#fbbf24',
              fontSize: '16px',
              fontWeight: 700,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsDrawerOpen(false);
              openModal('meeting');
            }}
          >
            Book Consultation →
          </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid rgba(212,175,55,0.3)' }}>
          <p style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Direct Helpline:
          </p>
          <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: 600, margin: '0 0 6px' }}>
            +91 8446656677 / 9423424596
          </p>
          <p style={{ color: '#fecaca', fontSize: '13px', margin: 0 }}>
            reki.vastuworld@gmail.com
          </p>
        </div>
      </div>
    </>
  );
}
