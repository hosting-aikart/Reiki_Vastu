import React, { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, ArrowRight, Quote, X, ChevronDown, Plus } from 'lucide-react';
import { TESTIMONIALS_DATA, VIDEO_ITEMS } from '../data/landingData';

const HOME_COUNT = 2; // how many to show initially

function TestimonialCard({ item, idx, isVisible, isExtra = false }) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid rgba(212,175,55,0.35)',
        borderRadius: '20px',
        padding: '20px 22px',
        boxShadow: '0 4px 16px rgba(180,83,9,0.06)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.55s ease ${isExtra ? idx * 140 : 0}ms, transform 0.55s ease ${isExtra ? idx * 140 : 0}ms`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[...Array(5)].map((_, i) => <Star key={i} size={15} color="#f59e0b" fill="#f59e0b" />)}
        </div>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', padding: '2px 8px', borderRadius: '50px' }}>
          Verified Client
        </span>
      </div>

      <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#4a1923', margin: '0 0 12px', fontStyle: 'italic' }}>
        "{item.quote}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h5 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#1a1a1a' }}>{item.name}</h5>
          <span style={{ fontSize: '12px', color: '#8c5360' }}>{item.role} • {item.location}</span>
        </div>
        <Quote size={24} color="#d4af37" style={{ opacity: 0.5 }} />
      </div>
    </div>
  );
}

export default function VideoTestimonials({ onAddStory }) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [initialVisible, setInitialVisible] = useState([false, false]);
  const [extraVisible, setExtraVisible] = useState(false);
  const cardRefs = useRef([]);
  const sectionRef = useRef(null);

  // Animate the first 2 cards on scroll
  useEffect(() => {
    const observers = cardRefs.current.slice(0, HOME_COUNT).map((el, idx) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setInitialVisible(prev => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 180);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o && o.disconnect());
  }, []);

  // Trigger extra cards animation shortly after expand
  useEffect(() => {
    if (showAll) {
      const t = setTimeout(() => setExtraVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setExtraVisible(false);
    }
  }, [showAll]);

  const prevVideo = () => setActiveVideoIndex(prev => prev > 0 ? prev - 1 : VIDEO_ITEMS.length - 1);
  const nextVideo = () => setActiveVideoIndex(prev => prev < VIDEO_ITEMS.length - 1 ? prev + 1 : 0);

  const extraTestimonials = TESTIMONIALS_DATA.slice(HOME_COUNT);

  return (
    <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, #fff9f0 0%, #fdfbf7 100%)', borderTop: '1.5px solid rgba(212,175,55,0.3)' }}>
      <div className="hm-container">
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <p
            className="hm-eyebrow"
            style={{
              color: '#D2042D',
              marginBottom: '6px',
              fontWeight: 800,
              letterSpacing: '0.14em'
            }}
          >
            TESTIMONIALS &amp; VIDEO DISCOURSES
          </p>
          <h2 className="ff-redhat" style={{ margin: 0, fontSize: 'clamp(26px, 3.2vw, 38px)', fontWeight: 800, color: '#1a1a1a' }}>
            Hear from Seekers, Students &amp; Clients Across India
          </h2>
        </div>

        <div
          className="testimonials-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}
        >

          {/* Left: Video Gallery */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>
              Discourses by Dr. Naresh Chhabdiya
            </h3>

            <div style={{ borderRadius: '24px', overflow: 'hidden', border: '2px solid rgba(212,175,55,0.5)', boxShadow: '0 12px 35px rgba(180,83,9,0.12)', background: '#4a0e17' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={VIDEO_ITEMS[activeVideoIndex].embedUrl}
                  title={VIDEO_ITEMS[activeVideoIndex].title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Below Video: Title & Centered Navigation Arrows */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', margin: 0, textAlign: 'center' }}>
                {VIDEO_ITEMS[activeVideoIndex].title}
              </p>

              {/* Bottom-Center Next / Previous Buttons */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={prevVideo}
                  aria-label="Previous video"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1.5px solid #d4af37',
                    background: '#ffffff',
                    color: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fef2f4';
                    e.currentTarget.style.borderColor = '#D2042D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#d4af37';
                  }}
                >
                  <ChevronLeft size={18} />
                </button>

                <span style={{ fontSize: '13px', fontWeight: 700, color: '#8c5360' }}>
                  {activeVideoIndex + 1} / {VIDEO_ITEMS.length}
                </span>

                <button
                  type="button"
                  onClick={nextVideo}
                  aria-label="Next video"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: '1.5px solid #d4af37',
                    background: '#ffffff',
                    color: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fef2f4';
                    e.currentTarget.style.borderColor = '#D2042D';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#d4af37';
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Testimonials */}
          <div ref={sectionRef}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                Real Transformation Experiences
              </h3>
              <span style={{ fontSize: '12px', color: '#8c5360', fontWeight: 600 }}>
                {TESTIMONIALS_DATA.length} clients
              </span>
            </div>

            {/* First 2 always shown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {TESTIMONIALS_DATA.slice(0, HOME_COUNT).map((item, idx) => (
                <div key={idx} ref={el => (cardRefs.current[idx] = el)}>
                  <TestimonialCard item={item} idx={idx} isVisible={initialVisible[idx]} />
                </div>
              ))}
            </div>

            {/* Extra testimonials — slide-down when showAll */}
            <div style={{
              overflow: 'hidden',
              maxHeight: showAll ? `${extraTestimonials.length * 280}px` : '0px',
              transition: 'max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: showAll ? '16px' : '0' }}>
                {extraTestimonials.map((item, idx) => (
                  <TestimonialCard key={idx} item={item} idx={idx} isVisible={extraVisible} isExtra />
                ))}
              </div>
            </div>

            {/* Toggle button and Add Yours button */}
            <div style={{ marginTop: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowAll(prev => !prev)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '11px 24px', borderRadius: '50px',
                    border: '1.5px solid rgba(210,4,45,0.4)',
                    background: showAll
                      ? 'linear-gradient(135deg, #D2042D 0%, #8b0000 100%)'
                      : 'linear-gradient(135deg, #fef2f4 0%, #fffbeb 100%)',
                    color: showAll ? '#ffffff' : '#D2042D',
                    fontSize: '13.5px', fontWeight: 700, cursor: 'pointer',
                    boxShadow: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    if (!showAll) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #D2042D 0%, #8b0000 100%)';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!showAll) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #fef2f4 0%, #fffbeb 100%)';
                      e.currentTarget.style.color = '#D2042D';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {showAll ? (
                    <>
                      <X size={15} /> Show Less
                    </>
                  ) : (
                    <>
                      See All Client Stories
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onAddStory}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '11px 24px', borderRadius: '50px',
                    border: '1.5px solid rgba(212, 175, 55, 0.45)',
                    background: 'linear-gradient(135deg, #D2042D 0%, #8b0000 100%)',
                    color: '#ffffff',
                    fontSize: '13.5px', fontWeight: 700, cursor: 'pointer',
                    boxShadow: 'none',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Plus size={16} /> Add Yours
                </button>
              </div>

              {!showAll && (
                <p style={{ fontSize: '12px', color: '#8c5360', margin: 0 }}>
                  +{extraTestimonials.length} more verified experiences
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
