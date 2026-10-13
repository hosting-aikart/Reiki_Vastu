import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer({ setCurrentView, openModal }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToCoursesPage = () => {
    if (setCurrentView) {
      setCurrentView('courses');
    }
  };

  return (
    <footer id="footer-contact" className="akf">
      <div className="akf-inner">
        {/* Main 3-Column Section */}
        <div className="akf-cols">
          {/* Column 1: Brand & Quick Links */}
          <div className="akf-col akf-col-brand">
            <h3 className="akf-brand-title">
              REIKI &amp; VAASTU WORLD
            </h3>

            <h4 className="akf-section-title">QUICK LINKS</h4>

            <div className="akf-links-block">
              <div className="akf-links-row">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="akf-link-btn"
                >
                  Home
                </button>
                <span className="akf-dot">•</span>
                <button
                  type="button"
                  onClick={goToCoursesPage}
                  className="akf-link-btn"
                >
                  Courses
                </button>
                <span className="akf-dot">•</span>
                <button
                  type="button"
                  onClick={() => scrollToSection('products-section')}
                  className="akf-link-btn"
                >
                  Products
                </button>
              </div>

              <div className="akf-links-row">
                <button
                  type="button"
                  onClick={() => scrollToSection('products-section')}
                  className="akf-link-btn"
                >
                  Products
                </button>
                <span className="akf-dot">•</span>
                <button
                  type="button"
                  onClick={() => scrollToSection('footer-contact')}
                  className="akf-link-btn"
                >
                  Contact Us
                </button>
                <span className="akf-dot">•</span>
                <button
                  type="button"
                  onClick={() => openModal && openModal('meeting')}
                  className="akf-link-btn"
                >
                  Book Consultation
                </button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="akf-socials">
              <a
                href="https://www.facebook.com/reikiandvastuworld/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="akf-social-icon"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://www.youtube.com/@reikiandvastuworld"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="akf-social-icon"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/vastuworld/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="akf-social-icon"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="akf-vdivider" />

          {/* Column 2: Our Centers & Contact */}
          <div className="akf-col akf-col-centers">
            <h4 className="akf-section-title">
              <MapPin size={16} className="akf-title-icon" />
              <span>OUR CENTERS</span>
            </h4>

            <div className="akf-center-details">
              <div className="akf-detail-row">
                <MapPin size={15} className="akf-row-icon" />
                <span className="akf-row-text">
                  <strong className="akf-highlight">Amravati:</strong> Sanjiwani Center, Khatri Complex, 1st Lane, Shop 4, Walcut Compound.
                </span>
              </div>

              <div className="akf-detail-row">
                <MapPin size={15} className="akf-row-icon" />
                <span className="akf-row-text">
                  <strong className="akf-highlight">Nagpur:</strong> Reiki &amp; Vaastu World, Near New English High School Mahal.
                </span>
              </div>

              <div className="akf-detail-row akf-contact-row">
                <Phone size={14} className="akf-row-icon" />
                <a href="tel:8446656677" className="akf-contact-link">
                  8446656677 / 9423424596
                </a>
              </div>

              <div className="akf-detail-row akf-contact-row">
                <Mail size={14} className="akf-row-icon" />
                <a href="mailto:reiki.vastuworld@gmail.com" className="akf-contact-link">
                  reiki.vastuworld@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="akf-vdivider" />

          {/* Column 3: Opening Hours */}
          <div className="akf-col akf-col-hours">
            <h4 className="akf-section-title">
              <Clock size={16} className="akf-title-icon" />
              <span>OPENING HOURS</span>
            </h4>

            <div className="akf-hours-grid">
              <div className="akf-hour-item">
                <span className="akf-day">Mon – Tue:</span>
                <span className="akf-time">6am – 10pm</span>
              </div>

              <div className="akf-hour-item">
                <span className="akf-day">Wed – Thu:</span>
                <span className="akf-time">8am – 6pm</span>
              </div>

              <div className="akf-hour-item">
                <span className="akf-day">Friday:</span>
                <span className="akf-time">3pm – 8pm</span>
              </div>

              <div className="akf-hour-item">
                <span className="akf-day">Sunday:</span>
                <span className="akf-closed-badge">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="akf-bottom-bar">
          <div className="akf-copyright">
            © 1995–2026 <strong className="akf-brand-bold">Reiki &amp; Vaastu World</strong>. Founded by Dr. Naresh Chhabdiya.
          </div>

          <div className="akf-legal">
            <span className="akf-legal-item">Privacy Policy</span>
            <span className="akf-legal-sep">|</span>
            <span className="akf-legal-item">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
