import React, { useState, useEffect } from 'react';
import { Mail, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  openModal,
  isDarkTheme = false
}) {
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
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
          {/* Logo */}
          <a
            href="/"
            className="gnav-logo"
            onClick={(e) => {
              e.preventDefault();
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img
              src="/logo/aikart-logo-full.png"
              alt="aiKart"
              className="gnav-logo-desktop"
              style={{ height: '34px' }}
            />
          </a>

          {/* Nav Links */}
          <nav className="gnav-links">
            <button
              type="button"
              className={`gnav-link ${currentView === 'explore' ? 'gnav-link-active' : ''}`}
              onClick={() => {
                setCurrentView('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Explore
            </button>

            <button
              type="button"
              className={`gnav-link ${currentView === 'become-seller' ? 'gnav-link-active' : ''}`}
              onClick={() => {
                setCurrentView('become-seller');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Become Seller
            </button>

            {/* Solutions Dropdown */}
            <div
              className="relative inline-flex items-center"
              onMouseEnter={() => setIsSolutionsOpen(true)}
              onMouseLeave={() => setIsSolutionsOpen(false)}
            >
              <button
                type="button"
                className="gnav-link gnav-custom-trigger"
                onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
              >
                <span>Solutions</span>
                <span className={`gnav-custom-arrow ${isSolutionsOpen ? 'gnav-custom-arrow--open' : ''}`}>
                  <ChevronDown size={14} />
                </span>
              </button>

              {isSolutionsOpen && (
                <div className="gnav-custom-dropdown">
                  <button
                    type="button"
                    className="gnav-dropdown-card"
                    onClick={() => {
                      setIsSolutionsOpen(false);
                      openModal('custom-solutions');
                    }}
                  >
                    <span>Custom AI Solutions</span>
                  </button>
                  <div className="gnav-dropdown-divider" />
                  <button
                    type="button"
                    className="gnav-dropdown-card"
                    onClick={() => {
                      setIsSolutionsOpen(false);
                      openModal('custom-ml');
                    }}
                  >
                    <span>Custom ML Models</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className="gnav-link"
              onClick={() => openModal('contact')}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Controls */}
          <div className="gnav-right">
            <button
              type="button"
              className="gnav-icon-btn"
              title="Inbox"
              onClick={() => openModal('contact')}
            >
              <img src="/icons/mail.png" alt="Inbox" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
            </button>

            <button
              type="button"
              className="gnav-btn-primary"
              onClick={() => openModal('auth')}
            >
              Log in / Sign Up
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
          <img src="/logo/aikart-logo-light.png" alt="aiKart" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
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
              fontWeight: 500,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setCurrentView('home');
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
              fontWeight: 500,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setCurrentView('explore');
              setIsDrawerOpen(false);
            }}
          >
            Explore Marketplace
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 500,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setCurrentView('become-seller');
              setIsDrawerOpen(false);
            }}
          >
            Become Seller
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 500,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsDrawerOpen(false);
              openModal('custom-solutions');
            }}
          >
            Custom AI Solutions
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 500,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsDrawerOpen(false);
              openModal('custom-ml');
            }}
          >
            Custom ML Models
          </button>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              fontWeight: 500,
              textAlign: 'left',
              padding: '10px 0',
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsDrawerOpen(false);
              openModal('contact');
            }}
          >
            Contact Us
          </button>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.18)', margin: '16px 0' }} />

          <button
            type="button"
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onClick={() => {
              setIsDrawerOpen(false);
              openModal('auth');
            }}
          >
            Log in / Sign Up
          </button>
        </div>
      </div>
    </>
  );
}
