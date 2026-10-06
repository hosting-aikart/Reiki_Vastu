import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MARKETPLACE_CARDS } from '../data/landingData';

export default function MarketplaceCarousel({ onCardClick }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="hm-section">
      <div className="hm-container">
        <div className="hm-mkt-header">
          <div>
            <p className="hm-eyebrow hm-grad">THE MARKETPLACE</p>
            <h2 className="ff-redhat hm-h2">Everything you need to buy AI with confidence</h2>
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
            {MARKETPLACE_CARDS.map((card) => {
              const isLight = card.isLight;
              const isBottom = card.type === 'bottom' || card.type === 'bottom-left';

              return (
                <div
                  key={card.id}
                  className={`hm-mkt-card ${isLight ? 'hm-mkt-card--light' : ''} ${
                    isBottom ? 'hm-mkt-card--bottom' : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onCardClick && onCardClick(card.title)}
                >
                  {card.isShield ? (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#bfe0ff'
                      }}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        style={{ width: '280px', height: '280px', objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <img src={card.image} alt={card.title} className="hm-mkt-img" />
                  )}

                  <div className="hm-mkt-shade" />

                  <div className="hm-mkt-body">
                    <h3 className="ff-poppins">{card.title}</h3>
                    <p className="ff-inter">{card.subtitle}</p>
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
