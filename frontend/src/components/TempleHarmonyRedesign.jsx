import React, { useEffect, useRef } from 'react';
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

export default function TempleHarmonyRedesign({
  onConsultClick,
  onExploreCourses,
  onSelectCourse,
  onSeeAllCourses,
  onBookSession,
  onAddStory
}) {
  const rootRef = useRef(null);

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
    <div ref={rootRef} className="th-redesign">
      {/* ═════ 1. HERO (16:9 Full-Screen Video + Cormorant Garamond & Karla Lower-Third) ═════ */}
      <section className="hero-section hero-fullscreen-16x9 th-hero">
        <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
          <defs>
            <filter id="hero-crisp-sharpen-redesign" colorInterpolationFilters="sRGB">
              <feConvolveMatrix
                order="3 3"
                kernelMatrix="0 -0.22 0 -0.22 1.88 -0.22 0 -0.22 0"
                preserveAlpha="true"
              />
            </filter>
          </defs>
        </svg>

        <div className="hero-bg-video-wrap" aria-hidden="true">
          <img
            src="/images/Meditation.png"
            alt=""
            className="hero-bg-video"
          />
          <div className="hero-bg-vignette" />
        </div>

        <div className="hm-container hero-lower-third-container">
          <div className="hero-lower-third-content th-reveal th-visible">
            <div className="th-hero-eyebrow">
              <Sparkles size={13} color="#e5c168" />
              <span>ALIGN &nbsp;&middot;&nbsp; BALANCE &nbsp;&middot;&nbsp; AWAKEN</span>
            </div>

            <h1 className="th-hero-title">
              Ancient Wisdom for a Healthier, <em>Happier</em> &amp; More Harmonious Life
            </h1>

            <p className="th-hero-subtitle">
              <span>Heal Your Mind</span>
              <span className="hero-modern-dot" aria-hidden="true">&bull;</span>
              <span>Balance Your Space</span>
              <span className="hero-modern-dot" aria-hidden="true">&bull;</span>
              <span>Transform Your Life</span>
            </p>

            <div className="hero-modern-actions">
              <button
                type="button"
                onClick={onExploreCourses}
                className="th-btn th-btn--primary"
              >
                <span>Explore Our Courses</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={onConsultClick}
                className="th-btn th-btn--secondary"
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
                <Award size={15} color="#b92b27" />
                <span>Practicing Since 1995 &middot; 28+ Years Experience</span>
              </div>
            </div>

            <div className="th-about-right">
              <p className="th-eyebrow">ABOUT OUR FOUNDER &amp; MISSION</p>
              <h2 className="th-heading-left">Welcome to Reiki &amp; Vaastu World</h2>
              <div className="th-gold-rule-left" />
              <p className="th-body-p">
                Dr. Naresh Chhabdiya has been practicing{' '}
                <strong>Reiki, Vaastu, Rudraksh, Astrology, and Numerology since 1995</strong>. A
                doctor by profession and motivational mentor with centers in{' '}
                <strong>Amravati and Nagpur, India</strong>, it has always been his dream to empower
                people around the world with genuine Reiki and spiritual healing.
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
                        <div className="th-course-img-wrap">
                          <img
                            src={course.image}
                            alt={course.alt || `${course.title} course`}
                            loading="lazy"
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
          {/* Temple Header Bar inside section (matching reference screenshot 1) */}
          <div className="th-features-topbar th-reveal">
            <div className="th-features-brand">
              <div className="th-features-brand-badge">
                <img src="/logo/lotus_pure.png" alt="" style={{ width: '22px', height: 'auto', filter: 'brightness(2.2)' }} />
              </div>
              <span className="th-features-brand-name">Reiki &amp; Vaastu World</span>
            </div>
            <div className="th-features-mantra">
              ALIGN &nbsp;&middot;&nbsp; BALANCE &nbsp;&middot;&nbsp; AWAKEN
            </div>
          </div>

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
                className="th-feature-card th-reveal"
                style={{
                  transitionDelay: `${idx * 90}ms`,
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
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
                    padding: '20px 18px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    alignItems: 'center'
                  }}
                >
                  <h3 className="th-feature-title" style={{ fontSize: '23px' }}>
                    {item.title}
                  </h3>
                  <div className="th-feature-rule" style={{ margin: '10px auto 10px' }} />
                  <p
                    style={{
                      fontFamily: 'var(--font-karla)',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: '#9a5b13',
                      margin: '0 0 8px',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {item.subtitle}
                  </p>
                  <p className="th-feature-desc" style={{ marginBottom: '14px', flex: 1 }}>
                    {item.description}
                  </p>
                  <span className="th-coming-soon-pill">✦ Reiki Energized ✦</span>
                </div>
              </article>
            ))}
          </div>
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

