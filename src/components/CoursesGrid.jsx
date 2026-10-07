import React from 'react';
import { ArrowRight, Compass, Heart, Sparkles, Home, Shield, Sun, Droplets, Activity, Layers, Hash, CircleDot, Gem, Palette, Award } from 'lucide-react';

export const COURSES_15 = [
  // Row 1
  {
    id: 'meditation',
    title: 'Meditation',
    subtitle: 'Inner Peace • Mindfulness • Self Growth',
    image: '/images/meditation.jpeg',
    hasImage: true,
    icon: Heart
  },
  {
    id: 'reiki',
    title: 'Reiki',
    subtitle: 'Healing Energy • Balance • Well-being',
    image: '/images/reiki.jpeg',
    hasImage: true,
    icon: Sparkles
  },
  {
    id: 'vaastu',
    title: 'Vaastu',
    subtitle: 'Harmonious Spaces • Prosperity • Positive Energy',
    image: '/images/vastu.jpeg',
    hasImage: true,
    icon: Home
  },
  {
    id: 'feng-shui',
    title: 'Feng-Shui',
    subtitle: 'Flow of Energy • Balance • Abundance',
    image: '/images/feng-shui.jpeg',
    hasImage: true,
    icon: Sun
  },
  {
    id: 'dowsing',
    title: 'Dowsing',
    subtitle: 'Energy Detection • Subtle Vibrations',
    image: '/images/Dowsing.jpeg',
    hasImage: true,
    icon: Compass
  },

  // Row 2
  {
    id: 'lama-fera',
    title: 'Lama-Fera',
    subtitle: 'Spiritual Healing • Enlightenment • Transformation',
    image: null,
    hasImage: false, // vacant space as requested
    icon: Award
  },
  {
    id: 'accupressure',
    title: 'Accupressure',
    subtitle: 'Natural Healing • Pain Relief • Energy Flow',
    image: '/images/Accupressure.jpeg',
    hasImage: true,
    icon: Activity
  },
  {
    id: 'crystal-therapy',
    title: 'Crystal Therapy',
    subtitle: 'Energy Cleansing • Emotional Healing',
    image: null,
    hasImage: false, // vacant space as requested
    icon: Gem
  },
  {
    id: 'pyramid',
    title: 'Pyramid',
    subtitle: 'Positive Energy • Manifestation • Growth',
    image: '/images/pyramid-therapy.jpeg',
    hasImage: true,
    icon: Layers
  },
  {
    id: 'numerology',
    title: 'Numerology',
    subtitle: 'Decode Numbers • Understand Life • Find Purpose',
    image: '/images/numerology.jpeg',
    hasImage: true,
    icon: Hash
  },

  // Row 3
  {
    id: 'astrology',
    title: 'Astrology',
    subtitle: 'Guidance • Self-Discovery • Life Clarity',
    image: null,
    hasImage: false, // vacant space as requested
    icon: Compass
  },
  {
    id: 'rudraksha',
    title: 'Rudraksha',
    subtitle: 'Spiritual Protection • Focus • Positive Energy',
    image: '/images/rudraksha.jpeg',
    hasImage: true,
    icon: Shield
  },
  {
    id: 'pranic-healing',
    title: 'Pranic Healing',
    subtitle: 'Life Energy • Healing • Vitality',
    image: null,
    hasImage: false, // vacant space as requested
    icon: Droplets
  },
  {
    id: 'gems-with-reiki',
    title: 'Gems with Reiki',
    subtitle: 'Combined Healing • Attract Positivity',
    image: null,
    hasImage: false, // vacant space as requested
    icon: Gem
  },
  {
    id: 'color-therapy',
    title: 'Color Therapy',
    subtitle: 'Heal with Colors • Balance • Enhance Life',
    image: '/images/color-therapy.jpeg',
    hasImage: true,
    icon: Palette
  }
];

export default function CoursesGrid({ onSelectCourse }) {
  return (
    <section id="courses-section" style={{ padding: '70px 0 90px', background: '#fdfbf7' }}>
      <div className="hm-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p
            className="hm-eyebrow"
            style={{
              color: '#D2042D',
              marginBottom: '6px',
              fontWeight: 800,
              letterSpacing: '0.14em'
            }}
          >
            OUR SACRED COURSES &amp; TRAINING
          </p>
          <h2
            className="ff-redhat"
            style={{
              fontSize: 'clamp(28px, 3.4vw, 42px)',
              fontWeight: 700,
              color: '#3b0a11',
              margin: '0 0 10px'
            }}
          >
            Explore Our Certified Holistic Sciences
          </h2>
          <p style={{ color: '#784450', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
            Comprehensive courses with traditional master attunements, clinical practice, and lifetime free alumni access.
          </p>
        </div>

        {/* 15 Courses Grid (5 columns on large screen, 3 on tablet, 1-2 on mobile) matching Image 3 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px'
          }}
        >
          {COURSES_15.map((course) => {
            const Icon = course.icon;

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse && onSelectCourse(course.title)}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(180, 83, 9, 0.06)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="hover:-translate-y-1.5 hover:shadow-lg"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#D2042D';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(210, 4, 45, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(180, 83, 9, 0.06)';
                }}
              >
                {/* Card Top: Image Area */}
                <div
                  style={{
                    height: '145px',
                    width: '100%',
                    background: 'linear-gradient(135deg, #fef8f0 0%, #faf1e2 100%)',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {course.hasImage && course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease'
                      }}
                      onError={(e) => {
                        // Fallback to vacant space if missing
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    /* Vacant space placeholder as explicitly requested:
                       "if some are not present in folder , keep some vacant space there ; dont generate anything new" */
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #fdfbf7 0%, #faf3e8 100%)',
                        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#b45309',
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          opacity: 0.5
                        }}
                      >
                        [ Vacant Space ]
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Bottom: Content Row with Icon, Title, Subtitle and Arrow button */}
                <div
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#ffffff'
                  }}
                >
                  {/* Left: Icon circle */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#fef2f4',
                      border: '1px solid rgba(210, 4, 45, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#D2042D'
                    }}
                  >
                    <Icon size={16} />
                  </div>

                  {/* Middle: Title & Subtitle */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        margin: '0 0 2px',
                        fontSize: '14.5px',
                        fontWeight: 700,
                        color: '#3b0a11',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {course.title}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '10.5px',
                        color: '#8c5360',
                        lineHeight: 1.25,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Right: Circular Arrow Action */}
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: '1px solid #d4af37',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#D2042D',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
