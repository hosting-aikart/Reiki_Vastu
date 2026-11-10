import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SACRED_PRODUCTS } from './BusinessNeeds';
import { OrnamentalFlourish } from './TempleHarmonyRedesign';

export default function ProductsPage({ onSelectProduct }) {
  return (
    <div
      className="products-page-wrap"
      style={{
        paddingTop: '115px',
        paddingBottom: '90px',
        minHeight: '100vh',
        background: '#faf5ee'
      }}
    >
      <div className="hm-container">
        <div className="th-section-header" style={{ marginBottom: '44px' }}>
          <p className="th-eyebrow">
            <Sparkles size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }} />
            PRANA ENERGIZED COLLECTION
          </p>
          <h1 className="th-heading-gradient">OUR SACRED PRODUCTS</h1>
          <OrnamentalFlourish />
          <p className="th-lead">
            100% authentic crystal bracelets and spiritual remedies, personally cleansed and
            energized with Vedic &amp; Reiki rituals. Click on any sacred product to view full details and pricing.
          </p>
        </div>

        <div className="th-products-grid">
          {SACRED_PRODUCTS.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectProduct && onSelectProduct(item.id)}
              className="th-feature-card"
              style={{
                padding: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1.05',
                  overflow: 'hidden',
                  background: '#f5ebe0',
                  position: 'relative'
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.45s ease'
                  }}
                />
              </div>
              <div
                style={{
                  padding: '20px 18px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <h3 className="th-feature-title" style={{ fontSize: '23px' }}>
                  {item.title}
                </h3>
                <div className="th-feature-rule" style={{ margin: '10px auto 12px' }} />
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'var(--font-karla)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#b5091f',
                    letterSpacing: '0.04em'
                  }}
                >
                  <span>View Details</span>
                  <ArrowRight size={13} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

