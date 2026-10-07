import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Play, Quote } from 'lucide-react';
import { TESTIMONIALS_DATA, VIDEO_ITEMS } from '../data/landingData';

export default function VideoTestimonials() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const prevVideo = () => {
    setActiveVideoIndex((prev) => (prev > 0 ? prev - 1 : VIDEO_ITEMS.length - 1));
  };

  const nextVideo = () => {
    setActiveVideoIndex((prev) => (prev < VIDEO_ITEMS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section style={{ padding: '80px 0', background: 'linear-gradient(180deg, #fff9f0 0%, #fdfbf7 100%)', borderTop: '1.5px solid rgba(212,175,55,0.3)' }}>
      <div className="hm-container">
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <p className="hm-eyebrow hm-grad" style={{ marginBottom: '6px' }}>
            TESTIMONIALS &amp; VIDEO DISCOURSES
          </p>
          <h2 className="ff-redhat hm-h2" style={{ margin: 0 }}>
            Hear from Seekers, Students &amp; Clients Across India
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Video Gallery */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#3b0a11', margin: 0 }}>
                Discourses by Dr. Naresh Chhabdiya
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={prevVideo}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1.5px solid #d4af37',
                    background: '#ffffff',
                    color: '#3b0a11',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="Previous video"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={nextVideo}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1.5px solid #d4af37',
                    background: '#ffffff',
                    color: '#3b0a11',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  aria-label="Next video"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                border: '2px solid rgba(212,175,55,0.5)',
                boxShadow: '0 12px 35px rgba(180,83,9,0.12)',
                background: '#4a0e17'
              }}
            >
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={VIDEO_ITEMS[activeVideoIndex].embedUrl}
                  title={VIDEO_ITEMS[activeVideoIndex].title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '14.5px', fontWeight: 700, color: '#881337', margin: '0 0 4px' }}>
                {VIDEO_ITEMS[activeVideoIndex].title}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {VIDEO_ITEMS.map((vid, idx) => (
                  <button
                    key={vid.id}
                    type="button"
                    onClick={() => setActiveVideoIndex(idx)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '50px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: activeVideoIndex === idx ? '1.5px solid #dc2626' : '1px solid rgba(212,175,55,0.4)',
                      background: activeVideoIndex === idx ? '#dc2626' : '#ffffff',
                      color: activeVideoIndex === idx ? '#ffffff' : '#3b0a11'
                    }}
                  >
                    Video {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Verified Testimonials */}
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#3b0a11', margin: '0 0 16px' }}>
              Real Transformation Experiences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {TESTIMONIALS_DATA.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid rgba(212,175,55,0.35)',
                    borderRadius: '20px',
                    padding: '20px 22px',
                    boxShadow: '0 4px 16px rgba(180,83,9,0.06)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} color="#f59e0b" fill="#f59e0b" />
                      ))}
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
                      <h5 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#dc2626' }}>
                        {item.name}
                      </h5>
                      <span style={{ fontSize: '12px', color: '#8c5360' }}>
                        {item.role} • {item.location}
                      </span>
                    </div>
                    <Quote size={24} color="#d4af37" style={{ opacity: 0.5 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
