import React from 'react';
import { Settings, Heart, Volume2, Calendar, Users, Award } from 'lucide-react';

export const FEATURES_DATA = [
  {
    id: 'practically-implemented',
    title: 'PRACTICALLY IMPLEMENTED',
    description: 'Implementation is the execution or practice of a plan, a method for doing something',
    icon: Settings
  },
  {
    id: 'life-time-entry-free',
    title: 'LIFE TIME ENTRY FREE',
    description: "Every time you visit Life Time, you’re taking steps toward living a healthier, happier life.",
    icon: Calendar
  },
  {
    id: 'free-of-cost-meditation',
    title: 'FREE OF COST MEDITATION',
    description: "Every time you visit Life Time, you’re taking steps toward living a healthier, happier life.",
    icon: Heart
  },
  {
    id: 'free-counselling',
    title: 'FREE COUNSELLING',
    description: 'You can access many free support, online counselling, also group therapy sessions.',
    icon: Users
  },
  {
    id: 'motivational-speech',
    title: 'MOTIVATIONAL SPEECH',
    description: 'A motivational speech is a speech intended to inspire an audience to make a change in their lives.',
    icon: Volume2
  }
];

export default function OurFeatures() {
  return (
    <section
      id="features-section"
      style={{
        padding: '70px 0 90px',
        background: '#fdfbf7',
        backgroundImage: 'radial-gradient(rgba(210, 4, 45, 0.04) 1px, transparent 1px), radial-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        position: 'relative'
      }}
    >
      <div className="hm-container">
        {/* Section Heading: OUR FEATURES (matching Image 3) */}
        <div style={{ marginBottom: '50px' }}>
          <h2
            className="ff-redhat"
            style={{
              fontSize: 'clamp(28px, 3.4vw, 42px)',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#3b0a11',
              margin: '0 0 10px',
              display: 'inline-block',
              position: 'relative'
            }}
          >
            OUR <span style={{ color: '#D2042D' }}>FEATURES</span>
          </h2>
          {/* Underline accent matching Image 3 */}
          <div
            style={{
              width: '60px',
              height: '3.5px',
              background: '#D2042D',
              borderRadius: '2px',
              marginTop: '4px'
            }}
          />
        </div>

        {/* 2-Column Features Grid matching Image 3 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            columnGap: '60px',
            rowGap: '44px'
          }}
        >
          {FEATURES_DATA.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px'
                }}
              >
                {/* Circular Cherry Red Icon Badge */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    minWidth: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D2042D 0%, #b00326 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(210, 4, 45, 0.25)',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    flexShrink: 0,
                    transition: 'transform 0.3s ease'
                  }}
                  className="hover:scale-105"
                >
                  <Icon size={24} color="#ffffff" strokeWidth={2.2} />
                </div>

                {/* Content */}
                <div>
                  <h3
                    className="ff-poppins"
                    style={{
                      fontSize: '16.5px',
                      fontWeight: 800,
                      color: '#2e0854',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      margin: '0 0 6px',
                      lineHeight: 1.3
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '14.5px',
                      lineHeight: 1.6,
                      color: '#5e2732',
                      margin: 0,
                      maxWidth: '480px'
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
