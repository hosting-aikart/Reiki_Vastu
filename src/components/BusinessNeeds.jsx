import React from 'react';
import { Sparkles, Shield, Gem, Layers, Compass, Sun, Clock } from 'lucide-react';

const COMING_SOON_CARDS = [
  { id: 1, icon: Sparkles, color: '#D2042D' },
  { id: 2, icon: Gem, color: '#d4af37' },
  { id: 3, icon: Shield, color: '#7c3aed' },
  { id: 4, icon: Layers, color: '#D2042D' },
  { id: 5, icon: Compass, color: '#b45309' },
  { id: 6, icon: Sun, color: '#d4af37' }
];

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
            <Clock size={14} color="#D2042D" />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#D2042D',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}
            >
              SACRED COLLECTION
            </span>
          </div>

          <h2
            className="ff-redhat"
            style={{
              fontSize: 'clamp(28px, 3.4vw, 40px)',
              fontWeight: 800,
              color: '#3b0a11',
              margin: '0 0 10px'
            }}
          >
            Our Products
          </h2>
          <p style={{ color: '#5e2732', fontSize: '15px', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
            Consecrated spiritual items and energetic remedies are currently being prepared with traditional Vedic energization.
          </p>
        </div>

        {/* Centered, balanced, properly aligned cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            maxWidth: '1080px',
            margin: '0 auto'
          }}
        >
          {COMING_SOON_CARDS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: '#ffffff',
                  borderRadius: '22px',
                  border: '1.5px solid rgba(212, 175, 55, 0.45)',
                  boxShadow: '0 8px 24px rgba(180, 83, 9, 0.08)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="hover:-translate-y-1 hover:shadow-lg"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D2042D';
                  e.currentTarget.style.boxShadow = '0 14px 32px rgba(210, 4, 45, 0.16)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(180, 83, 9, 0.08)';
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fef2f4 0%, #fffbeb 100%)',
                    border: '1.5px solid #d4af37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 4px 14px rgba(210, 4, 45, 0.12)'
                  }}
                >
                  <Icon size={30} color={item.color} />
                </div>

                <h3
                  className="ff-poppins"
                  style={{
                    fontSize: '21px',
                    fontWeight: 800,
                    color: '#D2042D',
                    letterSpacing: '0.03em',
                    margin: '0 0 6px'
                  }}
                >
                  Coming Soon
                </h3>

                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#b45309',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase'
                  }}
                >
                  ✦ Stay Tuned ✦
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
