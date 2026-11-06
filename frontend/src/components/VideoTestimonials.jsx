import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/landingData';

export default function VideoTestimonials() {
  return (
    <section
      id="testimonials-section"
      style={{
        padding: '84px 0 92px',
        background: '#ffffff'
      }}
    >
      <div className="hm-container">
        {/* Centered Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p
            style={{
              margin: '0 0 14px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#9b2236'
            }}
          >
            IN THEIR WORDS
          </p>

          <h2
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(28px, 3.8vw, 44px)',
              fontWeight: 400,
              lineHeight: 1.2,
              color: '#38181e',
              letterSpacing: '-0.01em'
            }}
          >
            Trust, built one consultation at a time.
          </h2>
        </div>

        {/* 3-Column Testimonial Cards Grid */}
        <div className="testimonials-cards-grid">
          {TESTIMONIALS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="testimonial-editorial-card"
              style={{
                background: '#fcf7f1',
                borderRadius: '18px',
                padding: '34px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '260px'
              }}
            >
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <Quote size={26} color="#c5a044" strokeWidth={1.75} />
                </div>

                <p
                  style={{
                    margin: '0 0 26px',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '17px',
                    fontWeight: 400,
                    lineHeight: 1.65,
                    color: '#3f2e32'
                  }}
                >
                  {item.quote}
                </p>
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: '13.5px',
                  lineHeight: 1.45,
                  color: '#88535d'
                }}
              >
                <strong style={{ fontWeight: 700, color: '#2b161b' }}>{item.name}</strong>
                {' · '}
                {item.location}
                {' · '}
                {item.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
