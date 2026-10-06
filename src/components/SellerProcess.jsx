import React from 'react';
import { SELLER_STEPS } from '../data/landingData';

export default function SellerProcess({ onExploreClick, onBecomeSellerClick }) {
  return (
    <section className="hm-process">
      <div className="hm-container">
        <div className="hm-process-grid">
          <div className="hm-process-left">
            <p className="hm-eyebrow hm-grad">THE PROCESS</p>
            <h2 className="ff-redhat hm-h2" style={{ color: '#ffffff', marginBottom: '16px' }}>
              Launch in six steps, seller side
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: '15.5px', lineHeight: 1.6, margin: '0 0 28px' }}>
              List, configure and start receiving customers the full seller journey, end to end.
            </p>
            <button
              type="button"
              className="gnav-btn-primary"
              style={{ background: '#ffffff', color: '#2563eb', padding: '12px 28px', fontSize: '15px' }}
              onClick={onBecomeSellerClick}
            >
              Start Selling AI
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="hm-cta">
          <div>
            <h3 className="ff-redhat">Ready to try AI before you buy?</h3>
            <p className="ff-inter">Explore verified solutions with live sandbox access.</p>
          </div>
          <button type="button" className="hm-cta-btn ff-inter" onClick={onExploreClick}>
            Explore
          </button>
        </div>
      </div>
    </section>
  );
}
