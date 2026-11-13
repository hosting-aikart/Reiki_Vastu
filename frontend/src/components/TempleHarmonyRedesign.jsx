import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  Award,
  Mail,
  Shield,
  Gem,
  Layers
} from 'lucide-react';
import { COURSES_15 } from './CoursesGrid';
import { SACRED_PRODUCTS } from './BusinessNeeds';
import VideoTestimonials from './VideoTestimonials';

const TEMPLE_PRODUCTS = [
  { id: 1, title: 'Energized Rudraksha', subtitle: 'Vedic Consecrated Beads', icon: Sparkles },
  { id: 2, title: 'Sacred Healing Crystals', subtitle: 'Natural Chakra Stones', icon: Gem },
  { id: 3, title: 'Shree Yantra & Meru', subtitle: 'Abundance Sacred Geometry', icon: Shield },
  { id: 4, title: 'Bio-Cosmic Pyramids', subtitle: 'Non-Demolition Vaastu', icon: Layers }
];

// Profiles shown in the "About" section of the home page.
const TEAM = [
  {
    name: 'Dr. Naresh Chhabdiya',
    role: 'Doctor by Profession · Motivational Speaker · Reiki Grandmaster',
    badge: 'Practicing Since 1995 · 31+ Years Experience',
    photo: '/images/team/dr-naresh-chhabdiya.jpg',
    photoPosition: '58% 18%'
  },
  {
    name: 'Dr. Yash Chhabdiya',
    role: 'Reiki Practitioner',
    badge: 'Practicing Reiki Since the Age of 7',
    photo: '/images/team/dr-yash-chhabdiya.jpg',
    photoPosition: '50% 14%'
  }
];

export function OrnamentalFlourish() {
  return (
    <div className="th-flourish" aria-hidden="true">
      <svg width="210" height="18" viewBox="0 0 210 18" fill="none">
        <path
          d="M2 9.5C32 4.5 64 13.5 96 9C100 8.5 103 9 105 9C107 9 110 9.5 114 9C146 4.5 178 13.5 208 8.5"
          stroke="#b8893a"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="105" cy="9" r="4.5" stroke="#b8893a" strokeWidth="1.15" fill="#faf5ee" />
        <circle cx="105" cy="9" r="1.8" fill="#b8893a" />
      </svg>
    </div>
  );
}

const HERO_COURSE_SLIDES = [
  {
    id: 'meditation',
    label: 'Meditation',
    src: '/images/temple-harmony-hero.jpg',
    position: 'center 24%',
    mobilePosition: '50% 24%',
    filter: 'brightness(0.96) contrast(1.08) saturate(1.14) sepia(0.08)',
    topAlpha: 0.34,
    midAlpha: 0.1,
    bottomAlpha: 0.52,
    amberWarmth: 0.18,
    vignetteAlpha: 0.34
  },
  {
    id: 'reiki',
    label: 'Reiki',
    src: '/images/Reiki.png',
    position: 'center 28%',
    mobilePosition: '36% 28%',
    filter: 'brightness(0.95) contrast(1.09) saturate(1.12) sepia(0.06)',
    topAlpha: 0.28,
    midAlpha: 0.14,
    bottomAlpha: 0.5,
    amberWarmth: 0.18,
    vignetteAlpha: 0.34
  },
  {
    id: 'crystal-therapy',
    label: 'Crystal Therapy',
    src: '/images/crystal therapy.png',
    position: 'center 58%',
    mobilePosition: '50% 58%',
    filter: 'brightness(0.96) contrast(1.10) saturate(1.16) sepia(0.03)',
    topAlpha: 0.32,
    midAlpha: 0.08,
    bottomAlpha: 0.48,
    amberWarmth: 0.15,
    vignetteAlpha: 0.32
  },
  {
    id: 'lama-fera',
    label: 'Lama-Fera',
    src: '/images/Lama Fera.png',
    position: 'center 26%',
    mobilePosition: '34% 26%',
    filter: 'brightness(1.0) contrast(1.08) saturate(1.14) sepia(0.05)',
    topAlpha: 0.24,
    midAlpha: 0.08,
    bottomAlpha: 0.44,
    amberWarmth: 0.14,
    vignetteAlpha: 0.3
  }
];

export default function TempleHarmonyRedesign({
  onConsultClick,
  onExploreCourses,
  onSelectCourse,
  onSeeAllCourses,
  onSelectProduct,
  onSeeAllProducts,
  onBookSession,
  onProductInquiry,
  onContactClick,
  onAddStory
}) {
  const rootRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isGlassCardPreview] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_COURSE_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const elements = root.querySelectorAll('.th-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('th-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="th-redesign th-redesign--golden">
      {/* ═════ 1. HERO (5 Top Courses Alternating Background + Cormorant Garamond & Karla) ═════ */}
      <section className="hero-section hero-fullscreen-16x9 th-hero th-hero--golden">
        <div className="hero-bg-video-wrap" aria-hidden="true">
          {HERO_COURSE_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              data-slide={slide.id}
              style={{
                '--slide-top-alpha': slide.topAlpha,
                '--slide-mid-alpha': slide.midAlpha,
                '--slide-bottom-alpha': slide.bottomAlpha,
                '--slide-amber-warmth': slide.amberWarmth,
                '--slide-vignette-alpha': slide.vignetteAlpha,
                '--slide-pos-desktop': slide.position,
                '--slide-pos-mobile': slide.mobilePosition || slide.position,
                '--slide-filter': slide.filter
              }}
              className={`th-hero-slide-layer ${
                index === activeSlide ? 'th-hero-slide-layer--active' : ''
              }`}
            >
              <img
                src={slide.src}
                alt=""
                aria-hidden="true"
                className="th-hero-slide-fill"
              />
              <img
                src={slide.src}
                alt=""
                className={`hero-bg-video th-hero-slide ${
                  index === activeSlide ? 'th-hero-slide--active' : ''
                } th-hero-slide--golden-filter`}
              />
              <div className="th-hero-cinematic-grade" />
            </div>
          ))}
          <div className="th-hero-golden-overlay" />
        </div>

        <div
          className={`hm-container hero-lower-third-container ${
            isGlassCardPreview ? 'hero-lower-third-container--glass-preview' : ''
          }`}
        >
          {isGlassCardPreview ? (
            /* ── PREVIEW MODE: Frosted Glass Hero Card (Matching Uploaded Reference) ── */
            <div className="th-hero-glass-card th-reveal th-visible">
              {/* Top Warm-Ivory Lotus Emblem */}
              <div className="th-glass-top-lotus-wrap" aria-hidden="true">
                <img
                  src="/logo/lotus_pure.png"
                  alt=""
                  className="th-glass-top-lotus"
                />
              </div>

              {/* 3-Line Warm Ivory Serif Heading */}
              <h1 className="th-glass-title">
                <span>Ancient Wisdom for a</span>
                <span>Healthier, Happier &amp;</span>
                <span>More Harmonious Life</span>
              </h1>

              {/* 3-Column Icon + Label Row with Vertical Dividers */}
              <div className="th-glass-pillars">
                <div className="th-glass-pillar">
                  <img
                    src="/logo/lotus_pure.png"
                    alt=""
                    aria-hidden="true"
                    className="th-glass-pillar-lotus"
                  />
                  <span className="th-glass-pillar-label">Heal Your Mind</span>
                </div>

                <span className="th-glass-pillar-divider" aria-hidden="true" />

                <div className="th-glass-pillar">
                  <svg
                    width="34"
                    height="32"
                    viewBox="0 0 36 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="th-glass-pillar-svg"
                  >
                    <path
                      d="M3 16.5L18 3.5L33 16.5"
                      stroke="#e8be6a"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M25.5 7V10L29 13V7H25.5Z"
                      stroke="#e8be6a"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 14.5V30H28.5V14.5"
                      stroke="#e8be6a"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.5 30V20.5H19.5V30"
                      stroke="#e8be6a"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="22"
                      y="19.5"
                      width="3.5"
                      height="3.5"
                      stroke="#e8be6a"
                      strokeWidth="1.6"
                    />
                  </svg>
                  <span className="th-glass-pillar-label">Balance Your Space</span>
                </div>

                <span className="th-glass-pillar-divider" aria-hidden="true" />

                <div className="th-glass-pillar">
                  <svg
                    width="34"
                    height="32"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="th-glass-pillar-svg"
                  >
                    <circle
                      cx="17"
                      cy="17"
                      r="13.5"
                      stroke="#f5dec0"
                      strokeWidth="1.85"
                    />
                    <path
                      d="M11.5 19.5C10.5 15.2 13.4 11 17.8 10.6C20 10.4 22 11.4 23.2 13"
                      stroke="#f5dec0"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                    <path
                      d="M22.5 14.5C23.5 18.8 20.6 23 16.2 23.4C14 23.6 12 22.6 10.8 21"
                      stroke="#f5dec0"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                    <circle cx="17" cy="17" r="2.2" fill="#f5dec0" />
                  </svg>
                  <span className="th-glass-pillar-label">Transform Your Life</span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="th-glass-actions">
                <button
                  type="button"
                  onClick={onExploreCourses}
                  className="th-btn th-glass-btn-primary"
                >
                  <span>Explore Our Courses</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={onConsultClick}
                  className="th-btn th-glass-btn-secondary"
                >
                  <span>Book a Consultation</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── CURRENT HERO MODE (Unchanged) ── */
            <div className="hero-lower-third-content th-hero-golden-card th-reveal th-visible">
              <h1 className="th-hero-title th-hero-title--golden">
                <span className="th-hero-line-crimson">
                  Ancient Wisdom for a Healthier,
                </span>
                <span className="th-hero-line-gold">
                  Happier &amp; More Harmonious Life
                </span>
              </h1>

              {/* Center Diamond Ornamental Rule */}
              <div className="th-golden-diamond-rule" aria-hidden="true">
                <span className="th-golden-diamond-line th-golden-diamond-line--left" />
                <span className="th-golden-diamond-gem">◆</span>
                <span className="th-golden-diamond-line th-golden-diamond-line--right" />
              </div>

              <p className="th-hero-subtitle th-hero-subtitle--golden">
                <span>Heal Your Mind</span>
                <span className="th-golden-dot" aria-hidden="true">&bull;</span>
                <span>Balance Your Space</span>
                <span className="th-golden-dot" aria-hidden="true">&bull;</span>
                <span>Transform Your Life</span>
              </p>

              <div className="hero-modern-actions">
                <button
                  type="button"
                  onClick={onExploreCourses}
                  className="th-btn th-btn--golden-primary"
                >
                  <span>Explore Our Courses</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={onConsultClick}
                  className="th-btn th-btn--golden-secondary"
                >
                  <span>Book a Consultation</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </section>

      {/* ═════ 2. ABOUT US & OUR GUIDES (Temple Ivory Aesthetic) ═════ */}
      <section className="th-section th-section--ivory" aria-labelledby="about-heading">
        <div className="hm-container">
          <div className="th-section-header th-reveal">
            <p className="th-eyebrow">ABOUT US &amp; OUR MISSION</p>
            <h2 id="about-heading" className="th-heading-gradient th-about-heading">
              Welcome to Reiki and Vaastu World
            </h2>
            <OrnamentalFlourish />
            <p className="th-body-p th-about-story">
              Dr. Naresh Chhabdiya has been practicing{' '}
              <strong>Reiki, Meditation, Vaastu, Astrology, Numerology and 16+ courses since 1995</strong>. A
              doctor by profession and motivational mentor with centers in{' '}
              <strong>Amravati and Nagpur, India</strong>, it has always been his dream to empower people
              around the world with genuine Reiki and spiritual healing. Previously Reiki and Vaastu World
              was known as <strong>Sanjeevni Reiki and Vaastu Center</strong>.
            </p>
          </div>

          <div className="th-team-grid">
            {TEAM.map((person) => (
              <article key={person.name} className="th-profile-card th-reveal">
                <figure className="th-profile-photo">
                  <img
                    src={person.photo}
                    alt={`Portrait of ${person.name}`}
                    width="720"
                    height="788"
                    loading="lazy"
                    style={{ objectPosition: person.photoPosition }}
                  />
                </figure>
                <h3 className="th-founder-name">{person.name}</h3>
                <p className="th-founder-role">{person.role}</p>
                <div className="th-founder-badge">
                  <Award size={15} color="#b5091f" aria-hidden="true" />
                  <span>{person.badge}</span>
                </div>
              </article>
            ))}
          </div>



          <div className="th-btn-row th-about-actions th-reveal">
            <button type="button" className="th-btn th-btn--primary" onClick={onConsultClick}>
              <span>Book a Session</span>
            </button>
            <a href="mailto:reiki.vastuworld@gmail.com" className="th-btn th-btn--outline-dark">
              <Mail size={15} color="#b92b27" />
              <span>reiki.vastuworld@gmail.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═════ 3. SACRED COURSES & TRAINING ═════ */}
      <section id="courses-section" className="th-section th-section--cream">
        <div className="hm-container">
          <div className="th-section-header th-reveal">
            <p className="th-eyebrow">OUR SACRED COURSES &amp; TRAINING</p>
            <h2 className="th-heading-gradient">SACRED DISCIPLINES</h2>
            <OrnamentalFlourish />
            <p className="th-lead">
              Comprehensive courses with traditional master attunements, clinical practice, and
              lifetime free alumni access.
            </p>
          </div>

          <div className="courses-marquee-wrapper th-reveal">
            <div className="courses-marquee-track">
              {[1, 2].map((group) => (
                <div
                  key={group}
                  className="courses-marquee-group"
                  aria-hidden={group === 2 ? 'true' : undefined}
                >
                  {COURSES_15.map((course) => {
                    const Icon = course.icon;
                    return (
                      <article
                        key={`th-g${group}-${course.id}`}
                        onClick={() => onSelectCourse && onSelectCourse(course.id, course.title)}
                        className="th-course-card course-card-slider-item"
                      >
                        <div
                          className="th-course-img-wrap"
                          style={course.imageBg ? { background: course.imageBg } : undefined}
                        >
                          <img
                            src={course.image}
                            alt={course.alt || `${course.title} course`}
                            loading="lazy"
                            style={{
                              objectFit: course.imageFit || 'cover',
                              objectPosition: course.imagePosition || 'center center'
                            }}
                          />
                        </div>
                        <div className="th-course-body">
                          <div className="th-course-icon">
                            <Icon size={16} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 className="th-course-title">{course.title}</h4>
                            <p className="th-course-sub">{course.subtitle}</p>
                          </div>
                          <div className="th-course-arrow">
                            <ArrowRight size={13} />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="th-center-cta th-reveal">
            <button type="button" onClick={onSeeAllCourses} className="th-btn th-btn--primary">
              <span>See All Courses</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ═════ 4. OUR PRODUCTS (Sacred Collection) ═════ */}
      <section id="products-section" className="th-section th-section--ivory">
        <div className="hm-container">
          <div className="th-section-header th-reveal">
            <p className="th-eyebrow">
              <Sparkles size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '6px' }} />
              PRANA ENERGIZED COLLECTION
            </p>
            <h2 className="th-heading-gradient">OUR SACRED PRODUCTS</h2>
            <OrnamentalFlourish />
            <p className="th-lead">
              100% authentic crystal bracelets and spiritual remedies, personally cleansed and
              energized with Vedic &amp; Reiki rituals.
            </p>
          </div>

          <div className="th-products-grid th-home-products-grid">
            {SACRED_PRODUCTS.slice(0, 5).map((item, idx) => (
              <article
                key={item.id}
                onClick={() =>
                  onSelectProduct
                    ? onSelectProduct(item.id)
                    : onProductInquiry && onProductInquiry(item)
                }
                className="th-feature-card th-reveal"
                style={{
                  transitionDelay: `${idx * 90}ms`,
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
                    background: '#f5ebe0'
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
                      display: 'block'
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: '18px 16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <h3 className="th-feature-title" style={{ fontSize: '23px' }}>
                    {item.title}
                  </h3>
                  <div className="th-feature-rule" style={{ margin: '10px auto 0' }} />
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '14px',
                      fontFamily: 'var(--font-karla)',
                      fontSize: '12.5px',
                      fontWeight: 750,
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

          {onSeeAllProducts && (
            <div className="th-center-cta th-reveal">
              <button type="button" onClick={onSeeAllProducts} className="th-btn th-btn--primary">
                <span>Explore All Products</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═════ 5. OUR REIKI THERAPY ═════ */}
      <section id="reiki-therapy-section" className="th-section th-section--cream">
        <div className="hm-container">
          <div className="th-therapy-card th-reveal">
            <h2 className="th-heading-gradient" style={{ marginBottom: '6px' }}>
              OUR REIKI THERAPY
            </h2>
            <OrnamentalFlourish />
            <p className="th-body-p" style={{ maxWidth: '720px', margin: '0 auto 16px' }}>
              <strong style={{ color: '#9a5b13' }}>Experience the power of gentle healing.</strong>
            </p>
            <p className="th-body-p" style={{ maxWidth: '720px', margin: '0 auto 16px' }}>
              Reiki is a calming energy healing practice that promotes relaxation, inner peace, and
              emotional balance. It may help reduce stress, calm the mind, improve sleep quality,
              enhance self-awareness, and encourage positive thinking.
            </p>
            <p className="th-body-p" style={{ maxWidth: '720px', margin: '0 auto 16px' }}>
              Reiki also supports mental, emotional, and spiritual well-being, helping you feel more
              balanced, confident, and connected with your inner energy. It encourages love,
              compassion, forgiveness, and understanding, nurturing healthier relationships and
              greater harmony in everyday life.
            </p>
            <p className="th-body-p" style={{ maxWidth: '720px', margin: '0 auto 30px' }}>
              <strong style={{ color: '#9a5b13' }}>
                Discover the path to inner peace and holistic well-being.
              </strong>
            </p>
            <button type="button" onClick={onBookSession} className="th-btn th-btn--primary">
              <span>Book a Reiki Session</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ═════ 6. TESTIMONIALS (IN THEIR WORDS) ═════ */}
      <div className="th-reveal">
        <VideoTestimonials onAddStory={onAddStory} />
      </div>
    </div>
  );
}

