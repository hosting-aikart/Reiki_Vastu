import React from 'react';
import {
  ArrowRight,
  Compass,
  Heart,
  Sparkles,
  Home,
  Shield,
  Sun,
  Droplets,
  Activity,
  Layers,
  Hash,
  CircleDot,
  Gem,
  Palette,
  Award
} from 'lucide-react';

export const COURSES_15 = [
  // Row 1
  {
    id: 'meditation',
    title: 'Meditation',
    subtitle: 'Inner Peace • Mindfulness • Self Growth',
    description: 'Cultivate deep mindfulness, emotional calm, and thoughtless awareness through guided meditation practices.',
    alt: 'Meditation course – guided mindfulness and inner peace practice',
    image: '/images/Meditation.webp',
    hasImage: true,
    icon: Heart
  },
  {
    id: 'reiki',
    title: 'Reiki',
    subtitle: 'Healing Energy • Balance • Well-being',
    description: 'Channel universal life-force energy with traditional Usui Reiki attunements for self-healing and chakra balance.',
    alt: 'Reiki healing course – universal life force energy and chakra balancing',
    image: '/images/Reiki.webp',
    hasImage: true,
    icon: Sparkles
  },
  {
    id: 'vaastu',
    title: 'Vaastu',
    subtitle: 'Harmonious Spaces • Prosperity • Positivity',
    description: 'Align homes and workplaces with the five natural elements and directional energies for lasting harmony.',
    alt: 'Vaastu Shastra course – spatial harmony and directional balance for homes and offices',
    image: '/images/vastu.webp',
    imageFit: 'contain',
    imagePosition: 'center center',
    imageBg: '#f3e5d0',
    hasImage: true,
    icon: Home
  },
  {
    id: 'feng-shui',
    title: 'Feng-Shui',
    subtitle: 'Flow of Energy • Balance • Abundance',
    description: 'Harmonize environmental Chi flow and balance Yin-Yang energies to attract peace and abundance.',
    alt: 'Feng-Shui course – harmonizing Chi energy and five elements in living spaces',
    image: '/images/Feng Shui.webp',
    imageFit: 'contain',
    imagePosition: 'center center',
    imageBg: '#f4ead8',
    hasImage: true,
    icon: Sun
  },

  // Row 2
  {
    id: 'dowsing',
    title: 'Dowsing',
    subtitle: 'Energy Detection • Subtle Vibrations',
    description: 'Master pendulum radiesthesia to detect subtle earth energies, geopathic stress, and intuitive guidance.',
    alt: 'Dowsing course – pendulum radiesthesia and subtle energy detection',
    image: '/images/Dowsing.webp',
    imagePosition: 'center 62%',
    hasImage: true,
    icon: Compass
  },
  {
    id: 'lama-fera',
    title: 'Lama-Fera',
    subtitle: 'Spiritual Healing • Enlightenment • Transformation',
    description: 'Experience ancient Tibetan Buddhist high-frequency healing to clear negative auras and deep blockages.',
    alt: 'Lama-Fera course – Tibetan Buddhist high-frequency spiritual healing',
    image: '/images/Lama Fera.webp',
    imagePosition: 'center center',
    hasImage: true,
    icon: Award
  },
  {
    id: 'crystal-therapy',
    title: 'Crystal Therapy',
    subtitle: 'Energy Cleansing • Emotional Healing',
    description: 'Harness the natural crystalline vibrations of sacred stones to cleanse chakras and restore emotional balance.',
    alt: 'Crystal Therapy course – healing gemstones and chakra energy alignment',
    image: '/images/crystal therapy.webp',
    imagePosition: 'center 58%',
    hasImage: true,
    icon: Gem
  },
  {
    id: 'pyramid',
    title: 'Pyramid Therapy',
    subtitle: 'Positivity • Manifestation • Growth',
    description: 'Utilize bio-cosmic pyramid geometry to amplify positive vibrations, relieve stress, and correct Vaastu defects.',
    alt: 'Pyramid Therapy course – sacred geometric energy for positivity and Vaastu rectification',
    image: '/images/pyramid.webp',
    imagePosition: 'center 55%',
    hasImage: true,
    icon: Layers
  },

  // Row 3
  {
    id: 'numerology',
    title: 'Numerology',
    subtitle: 'Decode Numbers • Understand Life • Find Purpose',
    description: 'Decode the vibrational power of birth dates and names to uncover life purpose, timing, and auspicious remedies.',
    alt: 'Numerology course – decoding sacred numbers, birth dates, and life path insights',
    image: '/images/Numerology.webp',
    hasImage: true,
    icon: Hash
  },
  {
    id: 'astrology',
    title: 'Astrology',
    subtitle: 'Guidance • Self-Discovery • Life Clarity',
    description: 'Explore Vedic Jyotish natal charts, planetary transits, and practical remedies for career and life clarity.',
    alt: 'Vedic Astrology course – birth chart analysis, planetary wisdom, and life guidance',
    image: '/images/Astrology.webp',
    hasImage: true,
    icon: Compass
  },
  {
    id: 'rudraksha',
    title: 'Rudraksha',
    subtitle: 'Spiritual Protection • Focus • Positivity',
    description: 'Learn the science of sacred Mukhi Rudraksha beads for spiritual protection, focus, and planetary harmony.',
    alt: 'Rudraksha therapy course – sacred Mukhi beads for spiritual protection and focus',
    image: '/images/Rudraksha.webp',
    hasImage: true,
    icon: Shield
  },
  {
    id: 'pranic-healing',
    title: 'Pranic Healing',
    subtitle: 'Life Energy • Healing • Vitality',
    description: 'Practice no-touch bio-plasmic energy cleansing and energizing techniques to accelerate physical and emotional recovery.',
    alt: 'Pranic Healing course – no-touch life energy cleansing and vitality restoration',
    image: '/images/Pranic Healing.webp',
    hasImage: true,
    icon: Droplets
  }
];

// Only first 4 courses shown on home page
const HOME_COURSES = COURSES_15.slice(0, 4);

function CourseCard({ course, onSelectCourse, isSlider = false, showDescription = false }) {
  const Icon = course.icon;
  return (
    <article
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
      className={`hover:-translate-y-1.5 hover:shadow-lg ${isSlider ? 'course-card-slider-item' : ''}`}
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
          aspectRatio: '4 / 3',
          width: '100%',
          background: course.imageBg || 'linear-gradient(135deg, #fef8f0 0%, #faf1e2 100%)',
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
            alt={course.alt || `${course.title} course – ${course.subtitle}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: course.imageFit || 'cover',
              objectPosition: course.imagePosition || 'center center',
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
            <span style={{ fontSize: '11px', color: '#b45309', fontWeight: 650, letterSpacing: '0.06em', opacity: 0.5 }}>
              [ Vacant Space ]
            </span>
          </div>
        )}
      </div>

      {/* Card Bottom: Content Area */}
      <div
        style={{
          padding: showDescription ? '16px 18px 18px' : '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: '10px',
          background: '#ffffff'
        }}
      >
        <div
          className="th-course-body"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: 0
          }}
        >
          <div
            className="th-course-icon"
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

          <div className="th-course-text" style={{ flex: 1, minWidth: 0 }}>
            <h4 className="th-course-title" style={{ margin: '0 0 2px', fontSize: showDescription ? '16px' : '14.5px', fontWeight: 750, color: '#3b0a11', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {course.title}
            </h4>
            <p className="th-course-sub" style={{ margin: 0, fontSize: showDescription ? '11.5px' : '10.5px', color: '#8c5360', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {course.subtitle}
            </p>
          </div>

          <div
            className="th-course-arrow"
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
    </article>
  );
}

export default function CoursesGrid({ onSelectCourse, onSeeAllCourses, showAll = false }) {
  return (
    <section id="courses-section" style={{ padding: showAll ? '24px 0 90px' : '70px 0 90px', background: '#faf5ee', overflow: 'hidden' }}>
      <div className="hm-container">
        {/* Section Header (home page only) */}
        {!showAll && (
          <div style={{ textAlign: 'center', marginBottom: '38px' }}>
            <p
              className="hm-eyebrow"
              style={{ color: '#D2042D', marginBottom: '6px', fontWeight: 850, letterSpacing: '0.14em' }}
            >
              OUR SACRED COURSES &amp; TRAINING
            </p>
            <h2
              className="ff-redhat"
              style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', fontWeight: 750, color: '#3b0a11', margin: '0 0 10px' }}
            >
              Explore Our Certified Holistic Sciences
            </h2>
            <p style={{ color: '#784450', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
              Comprehensive courses with traditional master attunements, clinical practice, and lifetime free alumni access.
            </p>
          </div>
        )}

        {/* Courses Section: Continuous Horizontal Sliding on Home, Grid on ShowAll */}
        {!showAll ? (
          <div className="courses-marquee-wrapper">
            <div className="courses-marquee-track">
              {/* Group 1 */}
              <div className="courses-marquee-group">
                {COURSES_15.map((course) => (
                  <CourseCard
                    key={`group1-${course.id}`}
                    course={course}
                    onSelectCourse={onSelectCourse}
                    isSlider={true}
                  />
                ))}
              </div>

              {/* Group 2 (Duplicate for continuous seamless infinite loop) */}
              <div className="courses-marquee-group" aria-hidden="true">
                {COURSES_15.map((course) => (
                  <CourseCard
                    key={`group2-${course.id}`}
                    course={course}
                    onSelectCourse={onSelectCourse}
                    isSlider={true}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="courses-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))',
              gap: '24px'
            }}
          >
            {COURSES_15.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={onSelectCourse}
                showDescription={true}
              />
            ))}
          </div>
        )}

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
