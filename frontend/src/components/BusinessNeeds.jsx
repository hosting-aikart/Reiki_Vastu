import React from 'react';
import { Sparkles } from 'lucide-react';
import { PRODUCTS, formatPaise } from '@reiki-vastu/shared/products.js';

// Product data and prices live in shared/products.js, the same file the backend
// uses to calculate what to charge. `price` and `originalPrice` are formatted
// here so the existing components keep working unchanged.
export const SACRED_PRODUCTS = PRODUCTS.filter((product) => !product.isEvent).map((product) => ({
  ...product,
  price: formatPaise(product.pricePaise),
  originalPrice: product.originalPricePaise ? formatPaise(product.originalPricePaise) : null
}));

export default function BusinessNeeds() {
  return (
    <section
      id="products-section"
      style={{
        background: 'linear-gradient(135deg, #fef2f2 0%, #fffbeb 50%, #f5f3ff 100%)',
        padding: '70px 0 85px',
        scrollMarginTop: '90px',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)'
      }}
    >
      <div className="hm-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#fef2f4',
              border: '1.5px solid #fecaca',
              padding: '5px 16px',
              borderRadius: '50px',
              marginBottom: '12px'
            }}
          >
            <Sparkles size={14} color="#D2042D" />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 850,
                color: '#D2042D',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              PRANA ENERGIZED COLLECTION
            </span>
          </div>

          <h2
            className="ff-redhat"
            style={{
              fontSize: 'clamp(28px, 3.4vw, 40px)',
              fontWeight: 850,
              color: '#3b0a11',
              margin: '0 0 10px'
            }}
          >
            Our Sacred Products
          </h2>
          <p style={{ color: '#5e2732', fontSize: '15px', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            100% authentic crystal bracelets and spiritual remedies, personally cleansed and energized with Vedic &amp; Reiki rituals.
          </p>
        </div>

        {/* 5 Products Grid */}
        <div
          className="products-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 210px), 1fr))',
            gap: '22px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {SACRED_PRODUCTS.map((item) => (
            <article
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                borderRadius: '22px',
                border: '1.5px solid rgba(212, 175, 55, 0.45)',
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(180, 83, 9, 0.08)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="hover:-translate-y-1.5 hover:shadow-lg"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D2042D';
                e.currentTarget.style.boxShadow = '0 14px 32px rgba(210, 4, 45, 0.16)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(180, 83, 9, 0.08)';
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1.05',
                  overflow: 'hidden',
                  background: '#faf3e8',
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
                    transition: 'transform 0.5s ease'
                  }}
                />
              </div>

              {/* Product Content */}
              <div
                style={{
                  padding: '16px 16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                <h3
                  className="ff-redhat"
                  style={{
                    fontSize: '17.5px',
                    fontWeight: 850,
                    color: '#3b0a11',
                    margin: '0 0 4px'
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 750,
                    color: '#b45309',
                    margin: '0 0 8px',
                    letterSpacing: '0.02em'
                  }}
                >
                  {item.subtitle}
                </p>

                <p
                  style={{
                    fontSize: '12.5px',
                    lineHeight: 1.5,
                    color: '#5e2732',
                    margin: '0 0 12px',
                    flex: 1
                  }}
                >
                  {item.description}
                </p>

                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: 750,
                      color: '#D2042D',
                      background: '#fef2f4',
                      border: '1px solid #fecaca',
                      padding: '4px 12px',
                      borderRadius: '50px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    ✦ Reiki Energized ✦
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
