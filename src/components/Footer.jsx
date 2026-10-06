import React, { useState } from 'react';

export default function Footer({ setCurrentView, openModal }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer id="footer-contact" className="akf">
      <div className="akf-inner">
        <div className="akf-brand-row">
          {/* Brand Info */}
          <div>
            <a
              href="/"
              className="akf-logo"
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img src="/logo/aikart-logo-full.png" alt="aiKart" />
            </a>

            <p className="akf-tagline">
              The marketplace where businesses discover, test, and deploy verified AI solutions without the guesswork.
            </p>

            <a
              href="https://maps.google.com/?q=Tapadia+City+Center+Mall+Badnera+Road+Amravati+Maharashtra+444607"
              target="_blank"
              rel="noopener noreferrer"
              className="akf-address"
              title="Open office location in Google Maps"
            >
              Aikart office Badnera road, Infront of Tapadia City Center Mall,
              <br />
              Saturna, Amravati Maharashtra-444607
            </a>

            {/* Social Icons */}
            <div className="akf-socials">
              <a
                href="https://x.com/aikartco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="akf-social"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/aikart.co/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="akf-social"
              >
                <svg width="20" height="20" viewBox="0 0 132 132">
                  <defs>
                    <linearGradient id="ig-lg1" x1="0.5" y1="1" x2="0.5" y2="0">
                      <stop offset="0" stopColor="#FFC107" />
                      <stop offset="0.507" stopColor="#F44336" />
                      <stop offset="0.99" stopColor="#9C27B0" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="128" height="128" rx="32" fill="url(#ig-lg1)" />
                  <circle cx="66" cy="66" r="26" fill="none" stroke="#fff" strokeWidth="9" />
                  <circle cx="96" cy="36" r="7" fill="#fff" />
                  <rect x="14" y="14" width="104" height="104" rx="24" fill="none" stroke="#fff" strokeWidth="9" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/company/aikart-co"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="akf-social"
              >
                <svg width="20" height="20" viewBox="0 0 72 72">
                  <rect width="72" height="72" rx="12" fill="#0A66C2" />
                  <path
                    fill="#fff"
                    d="M20.1 29.2h7.1V51h-7.1zM23.6 18.5c2.3 0 4.1 1.8 4.1 4.1s-1.8 4.1-4.1 4.1-4.1-1.8-4.1-4.1 1.8-4.1 4.1-4.1M31.5 29.2h6.8v3h.1c.9-1.8 3.2-3.6 6.6-3.6 7.1 0 8.4 4.7 8.4 10.7V51h-7.1v-10c0-2.4 0-5.5-3.3-5.5-3.3 0-3.9 2.6-3.9 5.3V51h-7.1V29.2z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div>
            <p className="akf-nl-label">Stay in the loop</p>
            <h3 className="akf-nl-heading">Get the latest AI solutions in your inbox</h3>
            <p className="akf-nl-sub">Weekly picks, new seller launches, and platform updates.</p>

            {subscribed ? (
              <div
                style={{
                  background: '#dcfce7',
                  border: '1px solid #86efac',
                  color: '#15803d',
                  padding: '12px 20px',
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                ✓ Thanks for subscribing to aiKart updates!
              </div>
            ) : (
              <form className="akf-nl-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email address"
                  className="akf-nl-input"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="akf-nl-btn">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="akf-divider" />

        {/* Navigation Rows */}
        <div className="akf-nav-row">
          <nav className="akf-col">
            <span className="akf-col-h">Product</span>
            <button type="button" onClick={() => setCurrentView('explore')}>
              Explore
            </button>
            <button type="button" onClick={() => setCurrentView('explore')}>
              Sandbox Testing
            </button>
            <button type="button" onClick={() => openModal('custom-solutions')}>
              Custom Solutions
            </button>
            <button type="button" onClick={() => openModal('custom-ml')}>
              Custom ML Models
            </button>
            <button type="button" onClick={() => setCurrentView('explore')}>
              Pricing
            </button>
          </nav>

          <nav className="akf-col">
            <span className="akf-col-h">Sellers</span>
            <button type="button" onClick={() => setCurrentView('become-seller')}>
              Become a Seller
            </button>
            <button type="button" onClick={() => setCurrentView('become-seller')}>
              Seller Dashboard
            </button>
            <button type="button" onClick={() => setCurrentView('become-seller')}>
              Upload Product
            </button>
            <button type="button" onClick={() => setCurrentView('become-seller')}>
              Seller Guidelines
            </button>
          </nav>

          <nav className="akf-col">
            <span className="akf-col-h">Company</span>
            <button type="button" onClick={() => setCurrentView('home')}>
              Home
            </button>
            <button type="button" onClick={() => openModal('about')}>
              About Us
            </button>
            <button type="button" onClick={() => openModal('contact')}>
              Contact
            </button>
          </nav>
        </div>

        <div className="akf-divider" />

        {/* Bottom copyright & legal */}
        <div className="akf-bottom">
          <p style={{ margin: 0 }}>© 2026 aikart. All rights reserved.</p>
          <div className="akf-bottom-links">
            <button type="button" onClick={() => openModal('terms')}>
              Terms of Service
            </button>
            <button type="button" onClick={() => openModal('privacy')}>
              Privacy Policy
            </button>
            <button type="button" onClick={() => openModal('cookies')}>
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
