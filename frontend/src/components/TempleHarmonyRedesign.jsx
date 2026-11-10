import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  Award,
  Mail,
  SlidersHorizontal,
  CalendarHeart,
  Heart,
  Users,
  Megaphone,
  Clock,
  Shield,
  Gem,
  Layers
} from 'lucide-react';
import { COURSES_15 } from './CoursesGrid';
import { SACRED_PRODUCTS } from './BusinessNeeds';
import VideoTestimonials from './VideoTestimonials';

const TEMPLE_FEATURES = [
  {
    id: 'practically-implemented',
    title: 'Practically Implemented',
    description:
      'Implementation is the execution or practice of a plan, a method for doing something.',
    icon: SlidersHorizontal
  },
  {
    id: 'lifetime-entry-free',
    title: 'Lifetime Entry Free',
    description:
      "Every time you visit Life Time, you're taking steps toward living a healthier, happier life.",
    icon: CalendarHeart
  },
  {
    id: 'free-of-cost-meditation',
    title: 'Free of Cost Meditation',
    description:
      "Every time you visit Life Time, you're taking steps toward living a healthier, happier life.",
    icon: Heart
  },
  {
    id: 'free-counselling',
    title: 'Free Counselling',
    description:
      'You can access many free support, online counselling, also group therapy sessions.',
    icon: Users
  },
  {
    id: 'motivational-speech',
    title: 'Motivational Speech',
    description:
      'A motivational speech is a speech intended to inspire an audience to make a change in their lives.',
    icon: Megaphone
  }
];

const TEMPLE_PRODUCTS = [
  { id: 1, title: 'Energized Rudraksha', subtitle: 'Vedic Consecrated Beads', icon: Sparkles },
  { id: 2, title: 'Sacred Healing Crystals', subtitle: 'Natural Chakra Stones', icon: Gem },
  { id: 3, title: 'Shree Yantra & Meru', subtitle: 'Abundance Sacred Geometry', icon: Shield },
  { id: 4, title: 'Bio-Cosmic Pyramids', subtitle: 'Non-Demolition Vaastu', icon: Layers }
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
    id: 'vaastu',
    label: 'Vaastu',
    src: '/images/vastu.jpg',
    position: 'center 16%',
    mobilePosition: '54% 16%',
    filter: 'brightness(1.02) contrast(1.08) saturate(1.15) sepia(0.04)',
    topAlpha: 0.22,
    midAlpha: 0.08,
    bottomAlpha: 0.46,
    amberWarmth: 0.14,
    vignetteAlpha: 0.3
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

  const topRowFeatures = TEMPLE_FEATURES.slice(0, 3);
  const bottomRowFeatures = TEMPLE_FEATURES.slice(3, 5);

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
                className={`hero-bg-video th-hero-slide ${
                  index === activeSlide ? 'th-hero-slide--active' : ''
                } th-hero-slide--golden-filter`}
              />
              <div className="th-hero-cinematic-grade" />
            </div>
          ))}
          <div className="th-hero-golden-overlay" />
        </div>

        <div className="hm-container hero-lower-third-container">
          <div className="hero-lower-third-content th-hero-golden-card th-reveal th-visible">
            {/* Top Golden Lotus Ornamental Divider */}
            <div className="th-golden-lotus-divider" aria-hidden="true">
              <span className="th-golden-line th-golden-line--left" />
              <img
                src="/logo/lotus_pure.png"
                alt=""
                className="th-golden-lotus-icon"
              />
              <span className="th-golden-line th-golden-line--right" />
            </div>

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
        </div>
      </section>

      {/* ═════ 2. ABOUT DR. NARESH CHHABDIYA (Temple Ivory Aesthetic) ═════ */}
      <section className="th-section th-section--ivory">
        <div className="hm-container">
          <div className="th-about-card th-reveal">
            <div className="th-about-left">
              <img
                src="/logo/lotus_pure.png"
                alt="Reiki & Vaastu World Lotus"
                className="th-about-lotus"
              />
              <h3 className="th-founder-name">Dr. Naresh Chhabdiya</h3>
              <p className="th-founder-role">
                Doctor by Profession &middot; Motivational Speaker &middot; Reiki Grandmaster
              </p>
              <div className="th-founder-badge">
                <Award size={15} color="#b5091f" />
                <span>Practicing Since 1995 &middot; 31+ Years Experience</span>
              </div>
            </div>

            <div className="th-about-right">
              <p className="th-eyebrow">ABOUT OUR FOUNDER &amp; MISSION</p>
              <h2 className="th-heading-left">Welcome to Reiki and Vaastu World</h2>
              <div className="th-gold-rule-left" />
              <p className="th-body-p">
                Dr. Naresh Chhabdiya has been practicing{' '}
                <strong>Reiki, Meditation, Vastu, Astrology, Numerology and 16+ courses since 1995</strong>. A
                doctor by profession and motivational mentor with centers in{' '}
                <strong>Amravati and Nagpur, India</strong>, it has always been his dream to empower
                people around the world with genuine Reiki and spiritual healing. Previously Reiki
                and Vaastu World was known as{' '}
                <strong>Sanjeevni Reiki and Vaastu Center</strong>.
              </p>
              <blockquote className="th-quote">
                “It’s been a beautiful journey with Reiki; it has subtly yet powerfully helped
                thousands hold their lives together, conquer illness, and achieve deep peace.”
              </blockquote>
              <div className="th-btn-row">
                <button type="button" className="th-btn th-btn--primary" onClick={onConsultClick}>
                  <span>Book Session with Dr. Naresh</span>
                </button>
                <a href="mailto:reki.vastuworld@gmail.com" className="th-btn th-btn--outline-dark">
                  <Mail size={15} color="#b92b27" />
                  <span>reki.vastuworld@gmail.com</span>
                </a>
              </div>
            </div>
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

      {/* ═════ 4. OUR FEATURES (Exact Reiki Vaastu Harmony Temple Card Layout) ═════ */}
      <section id="features-section" className="th-section th-features-sec">
        {/* Subtle floating golden prana particles */}
        <span className="th-particle" style={{ top: '14%', left: '7%' }} aria-hidden="true" />
        <span className="th-particle" style={{ top: '26%', right: '11%' }} aria-hidden="true" />
        <span className="th-particle" style={{ top: '38%', left: '49%' }} aria-hidden="true" />
        <span className="th-particle" style={{ bottom: '28%', left: '4%' }} aria-hidden="true" />
        <span className="th-particle" style={{ bottom: '18%', right: '6%' }} aria-hidden="true" />

        <div className="hm-container">
          {/* Section Heading: HOLISTIC TRANSFORMATION / OUR FEATURES */}
          <div className="th-section-header th-reveal">
            <p className="th-eyebrow">HOLISTIC TRANSFORMATION</p>
            <h2 className="th-heading-gradient">OUR FEATURES</h2>
            <OrnamentalFlourish />
            <p className="th-lead">
              Experience holistic transformation through authentic ancient practices, lifetime
              mentorship, and dedicated personal guidance.
            </p>
          </div>

          {/* Top Row: 3 Temple Cards */}
          <div className="th-features-row-3">
            {topRowFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="th-feature-card th-reveal"
                  style={{ transitionDelay: `${idx * 110}ms` }}
                >
                  <div className="th-feature-icon-outer">
                    <div className="th-feature-icon-inner">
                      <Icon size={25} color="#fffdf9" strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3 className="th-feature-title">{item.title}</h3>
                  <div className="th-feature-rule" />
                  <p className="th-feature-desc">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Bottom Row: 2 Centered Temple Cards */}
          <div className="th-features-row-2">
            {bottomRowFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="th-feature-card th-reveal"
                  style={{ transitionDelay: `${(idx + 3) * 110}ms` }}
                >
                  <div className="th-feature-icon-outer">
                    <div className="th-feature-icon-inner">
                      <Icon size={25} color="#fffdf9" strokeWidth={1.8} />
                    </div>
                  </div>
                  <h3 className="th-feature-title">{item.title}</h3>
                  <div className="th-feature-rule" />
                  <p className="th-feature-desc">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════ 5. OUR PRODUCTS (Sacred Collection) ═════ */}
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

          <div className="th-products-grid">
            {SACRED_PRODUCTS.map((item, idx) => (
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

      {/* ═════ 6. OUR REIKI THERAPY ═════ */}
      <section id="reiki-therapy-section" className="th-section th-section--cream">
        <div className="hm-container">
          <div className="th-therapy-card th-reveal">
            <p className="th-eyebrow">✦ ANCIENT HEALING ART ✦</p>
            <h2 className="th-heading-gradient" style={{ marginBottom: '6px' }}>
              OUR REIKI THERAPY
            </h2>
            <OrnamentalFlourish />
            <p className="th-body-p" style={{ maxWidth: '720px', margin: '0 auto 16px' }}>
              <strong style={{ color: '#9a5b13' }}>Our best offers.</strong> Advocates believe that
              there is an energy field around the body and that disrupting it can lead to ailments.
              Reiki therapy aims to remedy these disruptions and the subsequent conditions. In Reiki
              treatment, practitioners will place their hands over various parts of a person&apos;s
              body and transfer healing energy.
            </p>
            <p className="th-body-p" style={{ maxWidth: '720px', margin: '0 auto 30px' }}>
              During a session, practitioners may focus their energy on the sources of specific
              conditions. Typically a single treatment session will last{' '}
              <strong style={{ color: '#b92b27' }}>45–90 minutes</strong>.
            </p>
            <button type="button" onClick={onBookSession} className="th-btn th-btn--primary">
              <span>Book a Reiki Session</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ═════ 7. TESTIMONIALS (IN THEIR WORDS) ═════ */}
      <div className="th-reveal">
        <VideoTestimonials onAddStory={onAddStory} />
      </div>
    </div>
  );
}

