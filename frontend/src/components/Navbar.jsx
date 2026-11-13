import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { getUpcomingEvents } from '../data/events';

// Short date of the next upcoming event (e.g. "22 Nov"), or null when none is scheduled.
function nextEventDateLabel() {
  const next = getUpcomingEvents()[0];
  if (!next) return null;
  return new Date(next.startsAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata'
  });
}

export default function Navbar({
  currentView,
  setCurrentView,
  openModal,
  isDarkTheme = false
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // While an event is upcoming, the Events link is highlighted everywhere in the nav.
  const [eventDate] = useState(nextEventDateLabel);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll and allow Escape to close while the mobile drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setIsDrawerOpen(false);
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isDrawerOpen]);

  return (
    <>
      <header className={`gnav ${isScrolled ? 'gnav-scrolled' : ''} ${isDarkTheme ? 'gnav-dark' : ''}`}>
        <div className="gnav-in">
          {/* Site Logo + Brand Title */}
          <a
            href="/"
            className="gnav-logo"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
            aria-label="Reiki and Vastu World - Home"
          >
            <img
              src="/logo/lotus_pure.png"
              alt="Reiki and Vastu World"
              className="gnav-logo-img"
            />
          </a>

          {/* Nav Links: Home, Courses, Products, Events, Contact Us */}
          <nav className="gnav-links">
            <button
              type="button"
              className="gnav-link"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Home
            </button>

            <button
              type="button"
              className="gnav-link"
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
                setCurrentView('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Products
            </button>

            <button
              type="button"
              className={`gnav-link${eventDate ? ' gnav-link--event' : ''}`}
              aria-current={currentView === 'events' ? 'page' : undefined}
              onClick={() => {
                setCurrentView('events');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {eventDate && <span className="gnav-event-dot" aria-hidden="true" />}
              Events
              {eventDate && (
                <span className="gnav-event-date">
                  <span className="gnav-visually-hidden">, next workshop on </span>
                  {eventDate}
                </span>
              )}
            </button>

            <button
              type="button"
              className="gnav-link"
              onClick={() => {
                if (openModal) {
                  openModal('contact');
                } else {
                  const el = document.getElementById('footer-contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
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
              aria-label={eventDate ? 'Toggle menu (new upcoming event)' : 'Toggle menu'}
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu size={24} />
              {eventDate && <span className="gnav-hamburger-dot" aria-hidden="true" />}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', gap: '10px' }}>
          {/* Site Logo + Brand Title */}
          <div style={{ display: 'inline-flex', alignItems: 'center', minWidth: 0 }}>
            <img
              src="/logo/lotus_pure.png"
              alt="Reiki and Vastu World"
              style={{ height: '34px', width: 'auto', objectFit: 'contain', flexShrink: 0 }}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close navigation menu"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              minWidth: '40px',
              minHeight: '40px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            type="button"
            className="gnav-drawer-link"
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
            className="gnav-drawer-link"
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
            className="gnav-drawer-link"
            onClick={() => {
              setIsDrawerOpen(false);
              setCurrentView('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Products
          </button>
          <button
            type="button"
            className={`gnav-drawer-link${eventDate ? ' gnav-drawer-link--event' : ''}`}
            aria-current={currentView === 'events' ? 'page' : undefined}
            onClick={() => {
              setIsDrawerOpen(false);
              setCurrentView('events');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {eventDate && <span className="gnav-event-dot" aria-hidden="true" />}
            Upcoming Events
            {eventDate && (
              <span className="gnav-event-date">
                <span className="gnav-visually-hidden">, next workshop on </span>
                {eventDate}
              </span>
            )}
          </button>
          <button
            type="button"
            className="gnav-drawer-link"
            onClick={() => {
              setIsDrawerOpen(false);
              if (openModal) {
                openModal('contact');
              } else {
                const el = document.getElementById('footer-contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Contact Us
          </button>
          <a
            href="tel:8446656677"
            className="gnav-drawer-link"
            style={{ textDecoration: 'none', gap: '8px' }}
            onClick={() => setIsDrawerOpen(false)}
          >
            <Phone size={16} color="#f5d68a" />
            <span className="gnav-drawer-helpline-text">Call Helpline: 8446656677</span>
          </a>
          <button
            type="button"
            className="gnav-drawer-cta"
            onClick={() => {
              setIsDrawerOpen(false);
              openModal('meeting');
            }}
          >
            Book Consultation →
          </button>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '32px', borderTop: '1px solid rgba(212,175,55,0.3)' }}>
          <p style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 750, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Direct Helpline:
          </p>
          <p style={{ color: '#ffffff', fontSize: '15px', fontWeight: 650, margin: '0 0 6px' }}>
            +91 8446656677 / 9423424596
          </p>
          <p style={{ color: '#fecaca', fontSize: '13px', margin: 0 }}>
            reiki.vastuworld@gmail.com
          </p>
        </div>
      </div>
    </>
  );
}
