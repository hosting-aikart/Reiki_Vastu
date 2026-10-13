import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Heart, Compass, Award } from 'lucide-react';
import { MARKETPLACE_CARDS } from '../data/landingData';

export default function MarketplaceCarousel({ onCardClick }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const icons = [Sparkles, ShieldCheck, Compass, Award, Heart];

  return (
    <section className="hm-section">
      <div className="hm-container">
        <div className="hm-mkt-header">
          <div>
            <p className="hm-eyebrow hm-grad">OUR CORE PILLARS &amp; VALUES</p>
            <h2 className="ff-redhat hm-h2">Authentic Healing, Sacred Geometry &amp; Lifelong Guidance</h2>
          </div>

          <div className="hm-mkt-arrows">
            <button
              type="button"
              className="hm-mkt-arrow"
              aria-label="Scroll left"
              onClick={() => scroll('left')}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="hm-mkt-arrow"
              aria-label="Scroll right"
              onClick={() => scroll('right')}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <div className="hm-mkt-wrap">
          <div className="hm-mkt" ref={scrollRef}>
            {MARKETPLACE_CARDS.map((card, idx) => {
              const IconComponent = icons[idx % icons.length];
              const isBottom = card.type === 'bottom' || card.type === 'bottom-left';

              return (
                <div
                  key={card.id}
                  className={`hm-mkt-card ${card.isLight ? 'hm-mkt-card--light' : ''} ${
                    isBottom ? 'hm-mkt-card--bottom' : ''
                  }`}
                  style={{
                    cursor: 'pointer',
                    background: idx % 2 === 0
                      ? 'linear-gradient(135deg, #4a0e17 0%, #3b0a11 50%, #2e0854 100%)'
                      : 'linear-gradient(135deg, #2e0854 0%, #4a0e17 50%, #3b0a11 100%)'
                  }}
                  onClick={() => onCardClick && onCardClick(card.title)}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      zIndex: 3,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(212, 175, 55, 0.22)',
                      border: '1px solid #f59e0b',
                      padding: '4px 10px',
                      borderRadius: '50px',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <IconComponent size={12} color="#fbbf24" />
                    <span style={{ color: '#fffdf9', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {card.badge}
                    </span>
                  </div>

                  <div className="hm-mkt-shade" />

                  <div className="hm-mkt-body">
                    <h3 className="ff-poppins">{card.title}</h3>
                    <p className="ff-inter">{card.subtitle}</p>
                    <p>{card.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
