import React from 'react';
import { SELLER_STEPS } from '../data/landingData';

export default function SellerProcess({ onExploreClick, onBecomeSellerClick }) {
  return (
    <section className="hm-process">
      <div className="hm-container">
        <div className="hm-process-grid">
          <div className="hm-process-left">
            <p className="hm-eyebrow hm-grad">PRACTITIONER &amp; SEEKER PATH</p>
            <h2 className="ff-redhat hm-h2" style={{ color: '#ffffff', marginBottom: '16px' }}>
              Master the Sacred Sciences in Six Guided Steps
            </h2>
            <p style={{ color: '#fef3c7', fontSize: '15px', lineHeight: 1.65, margin: '0 0 28px' }}>
              From sacred master symbol attunement to real-world clinical practice and lifetime mentorship under Dr. Naresh Chhabdiya.
            </p>
            <button
              type="button"
              className="gnav-btn-primary"
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #b45309 100%)',
                color: '#3b0a11',
                padding: '12px 28px',
                fontSize: '15px',
                border: '1.5px solid #fffdf9'
              }}
              onClick={onBecomeSellerClick}
            >
              Join Healer Network
            </button>
          </div>

          <div className="hm-flow">
            <div className="hm-frow">
              {SELLER_STEPS.slice(0, 3).map((step) => (
                <div key={step.num} className="hm-scard" style={{ '--c': step.color }}>
                  <span className="hm-scard-n">{step.num}</span>
                  <div>
                    <div className="hm-scard-rule" style={{ background: step.color }} />
                    <span className="hm-scard-t">{step.title}</span>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#fef3c7', opacity: 0.85 }}>
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="hm-frow">
              {SELLER_STEPS.slice(3, 6).map((step) => (
                <div key={step.num} className="hm-scard" style={{ '--c': step.color }}>
                  <span className="hm-scard-n">{step.num}</span>
                  <div>
                    <div className="hm-scard-rule" style={{ background: step.color }} />
                    <span className="hm-scard-t">{step.title}</span>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#fef3c7', opacity: 0.85 }}>
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="hm-cta">
          <div>
            <h3 className="ff-redhat">Ready to bring harmony to your life and home?</h3>
            <p className="ff-inter">Explore 14+ certified courses, authentic remedies, and personal consultations.</p>
          </div>
          <button type="button" className="hm-cta-btn ff-inter" onClick={onExploreClick}>
            Explore Catalog
          </button>
        </div>
      </div>
    </section>
  );
}
