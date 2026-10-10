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
    image: '/images/lama-fare.jpeg',
    hasImage: true,
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
    image: '/images/crystal-therapy.jpeg',
    hasImage: true,
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
    image: '/images/astrology.jpeg',
    hasImage: true,
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
    image: '/images/pranic-healing.jpeg',
    hasImage: true,
    icon: Droplets
  },
  {
    id: 'gems-with-reiki',
    title: 'Gems with Reiki',
    subtitle: 'Combined Healing • Attract Positivity',
    image: '/images/gems.jpeg',
    hasImage: true,
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

// Only first 4 courses shown on home page
const HOME_COURSES = COURSES_15.slice(0, 4);

function CourseCard({ course, onSelectCourse }) {
  const Icon = course.icon;
  return (
    <div
      onClick={() => onSelectCourse && onSelectCourse(course.id, course.title)}
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
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
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
            <span style={{ fontSize: '11px', color: '#b45309', fontWeight: 600, letterSpacing: '0.06em', opacity: 0.5 }}>
              [ Vacant Space ]
            </span>
          </div>
        )}
      </div>

      {/* Card Bottom: Content Row */}
      <div
        style={{
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#ffffff'
        }}
      >
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

        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: '0 0 2px', fontSize: '14.5px', fontWeight: 700, color: '#3b0a11', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {course.title}
          </h4>
          <p style={{ margin: 0, fontSize: '10.5px', color: '#8c5360', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {course.subtitle}
          </p>
        </div>

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
}

export default function CoursesGrid({ onSelectCourse, onSeeAllCourses, showAll = false }) {
  const displayCourses = showAll ? COURSES_15 : HOME_COURSES;

  return (
    <section id="courses-section" style={{ padding: '70px 0 90px', background: '#fdfbf7' }}>
      <div className="hm-container">
        {/* Section Header (home page only) */}
        {!showAll && (
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p
              className="hm-eyebrow"
              style={{ color: '#D2042D', marginBottom: '6px', fontWeight: 800, letterSpacing: '0.14em' }}
            >
              OUR SACRED COURSES &amp; TRAINING
            </p>
            <h2
              className="ff-redhat"
              style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', fontWeight: 700, color: '#3b0a11', margin: '0 0 10px' }}
            >
              Explore Our Certified Holistic Sciences
            </h2>
            <p style={{ color: '#784450', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
              Comprehensive courses with traditional master attunements, clinical practice, and lifetime free alumni access.
            </p>
          </div>
        )}

        {/* Courses Grid */}
        <div
          className="courses-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: showAll
              ? 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))'
              : 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
            gap: '20px'
          }}
        >
          {displayCourses.map((course) => (
            <CourseCard key={course.id} course={course} onSelectCourse={onSelectCourse} />
          ))}
        </div>

        {/* See All Courses Button (only on home page) */}
        {!showAll && (
          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <button
              type="button"
              onClick={onSeeAllCourses}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 36px',
                borderRadius: '50px',
                fontSize: '15px',
                letterSpacing: '0.02em'
              }}
            >
              <span>See All Courses</span>
              <ArrowRight size={18} />
            </button>
            <p style={{ color: '#8c5360', fontSize: '13px', marginTop: '12px' }}>
              +{COURSES_15.length - HOME_COURSES.length} more sacred disciplines awaiting you
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
