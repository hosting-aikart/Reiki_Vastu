import React, { useEffect, useRef } from 'react';
import { SlidersHorizontal, CalendarHeart, Heart, Users, Megaphone } from 'lucide-react';
import { OrnamentalFlourish } from './TempleHarmonyRedesign';

const FEATURES_DATA = [
  {
    id: 'practically-implemented',
    title: 'Practically Implemented',
    description:
      'Implementation is the execution or practice of a plan, a method for doing something.',
    icon: SlidersHorizontal
  },
  {
    id: 'life-time-entry-free',
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

export default function OurFeatures() {
  const secRef = useRef(null);

  useEffect(() => {
    const root = secRef.current;
    if (!root) return;
    const els = root.querySelectorAll('.th-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('th-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const topRow = FEATURES_DATA.slice(0, 3);
  const bottomRow = FEATURES_DATA.slice(3, 5);

  return (
    <section ref={secRef} id="features-section" className="th-section th-features-sec">
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

        {/* Top Row: 3 Cards */}
        <div className="th-features-row-3">
          {topRow.map((item, idx) => {
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

        {/* Bottom Row: 2 Centered Cards */}
        <div className="th-features-row-2">
          {bottomRow.map((item, idx) => {
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
  );
}
