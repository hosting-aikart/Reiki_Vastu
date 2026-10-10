import React from 'react';
import { Settings, Heart, Volume2, Calendar, Users } from 'lucide-react';

const FEATURES_DATA = [
  {
    id: 'practically-implemented',
    title: 'PRACTICALLY IMPLEMENTED',
    description: 'Implementation is the execution or practice of a plan, a method for doing something',
    icon: Settings
  },
  {
    id: 'life-time-entry-free',
    title: 'LIFE TIME ENTRY FREE',
    description: "Every time you visit Life Time, you're taking steps toward living a healthier, happier life.",
    icon: Calendar
  },
  {
    id: 'free-of-cost-meditation',
    title: 'FREE OF COST MEDITATION',
    description: "Every time you visit Life Time, you're taking steps toward living a healthier, happier life.",
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
        backgroundImage:
          'radial-gradient(rgba(210, 4, 45, 0.04) 1px, transparent 1px), radial-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        position: 'relative'
      }}
    >
      <div className="hm-container">
        {/* Content Card with Golden Border matching other sections */}
        <div
          style={{
            position: 'relative',
            maxWidth: '1100px',
            margin: '0 auto',
            background: '#ffffff',
            border: '1.5px solid rgba(212, 175, 55, 0.45)',
            borderRadius: '26px',
            padding: 'clamp(28px, 4.5vw, 54px) clamp(16px, 4vw, 52px)',
            boxShadow: '0 14px 40px rgba(180, 83, 9, 0.08)'
          }}
        >
          {/* Section Heading: OUR FEATURES - Centered with subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2
              className="ff-redhat"
              style={{
                fontSize: 'clamp(26px, 3.4vw, 42px)',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: '#1a1a1a',
                margin: '0 0 12px',
                display: 'inline-block'
              }}
            >
              OUR FEATURES
            </h2>
            <p
              style={{
                color: '#555555',
                fontSize: '15px',
                maxWidth: '640px',
                margin: '0 auto',
                lineHeight: 1.6
              }}
            >
              Experience holistic transformation through authentic ancient practices, lifetime mentorship, and dedicated personal guidance.
            </p>
          </div>

          {/* 2-Column Features Grid — Static layout without popping */}
          <div
            className="features-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              columnGap: 'clamp(24px, 4vw, 60px)',
              rowGap: 'clamp(24px, 3.5vw, 44px)'
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
                      flexShrink: 0
                    }}
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
      </div>
    </section>
  );
}
