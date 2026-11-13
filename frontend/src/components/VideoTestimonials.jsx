import React, { useEffect, useState } from 'react';
import { Quote, Sparkles, Play, ExternalLink } from 'lucide-react';
import { TESTIMONIALS_DATA, VIDEO_ITEMS } from '../data/landingData';

function FlourishDivider() {
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

export default function VideoTestimonials({ onAddStory }) {
  const testimonials = TESTIMONIALS_DATA;
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [visibleVideos, setVisibleVideos] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= 860 ? 2 : 3
  );
  const maxVideoIndex = Math.max(0, VIDEO_ITEMS.length - visibleVideos);

  useEffect(() => {
    const updateVisibleVideos = () => {
      const count = window.innerWidth <= 860 ? 2 : 3;
      setVisibleVideos(count);
      setActiveVideoIndex((index) => Math.min(index, VIDEO_ITEMS.length - count));
    };
    window.addEventListener('resize', updateVisibleVideos);
    return () => window.removeEventListener('resize', updateVisibleVideos);
  }, []);

  return (
    <>
      {/* ═════ YOUTUBE VIDEO DISCOURSES SECTION (from reikiandvastuworld.com) ═════ */}
      <section
        id="video-discourses-section"
        className="th-section th-section--ivory"
        style={{
          borderTop: '1px solid rgba(184, 137, 58, 0.2)'
        }}
      >
        <div className="hm-container">
          <div className="th-section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="th-eyebrow">
              ✦ SACRED DISCOURSES &amp; SESSIONS ✦
            </p>
            <h2
              className="th-heading-gradient"
              style={{
                fontSize: 'clamp(22px, 3.2vw, 42px)',
                marginBottom: '6px'
              }}
            >
              OUR YOUTUBE DISCOURSES
            </h2>
            <FlourishDivider />
            <p className="th-lead">
              Explore authentic sessions, spiritual discourses, and practical guidance on Reiki,
              Vastu Shastra, Lama-Fera, and Rudraksha by Dr. Naresh Chhabdiya.
            </p>
          </div>

          <div className="th-videos-controls">
            <button
              type="button"
              className="th-videos-nav-button"
              onClick={() => setActiveVideoIndex((index) => Math.max(0, index - 1))}
              disabled={activeVideoIndex === 0}
              aria-label="Previous videos"
            >
              ‹
            </button>
            <button
              type="button"
              className="th-videos-nav-button th-videos-next-button"
              onClick={() =>
                setActiveVideoIndex((index) => Math.min(maxVideoIndex, index + 1))
              }
              disabled={activeVideoIndex >= maxVideoIndex}
              aria-label="Next videos"
            >
              <span>Next</span>
              <span aria-hidden="true">›</span>
            </button>
          </div>

          <div className="th-videos-viewport">
            <div
              className={`th-videos-grid th-videos-grid--index-${activeVideoIndex}`}
              aria-live="polite"
            >
              {VIDEO_ITEMS.map((video, idx) => (
                <article key={video.id} className="th-video-card">
                  <div className="th-video-frame-wrap">
                    <a
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="th-video-thumbnail-link"
                      aria-label={`Watch ${video.title} on YouTube`}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        loading="lazy"
                      />
                    </a>
                  </div>

                  <div className="th-video-card-body">
                    <div className="th-video-badge-row">
                      <span className="th-video-ep-badge">
                        <Play size={11} fill="#ffffff" />
                        <span>Discourse 0{idx + 1}</span>
                      </span>

                      <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="th-video-yt-link"
                      >
                        <span>Watch on YouTube</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>

                    <h3 className="th-video-title">{video.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════ CLIENT TESTIMONIALS SECTION (IN THEIR WORDS) ═════ */}
      <section
        id="testimonials-section"
        style={{
          padding: '84px 0 92px',
          background: '#faf5ee'
        }}
      >
        <div className="hm-container">
          {/* Centered Header (Matching OUR REIKI THERAPY style) */}
          <div className="th-section-header" style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p className="th-eyebrow">
              ✦ IN THEIR WORDS ✦
            </p>

            <h2
              className="th-heading-gradient"
              style={{
                fontSize: 'clamp(22px, 3.2vw, 42px)',
                marginBottom: '6px'
              }}
            >
              Trust, built one consultation at a time.
            </h2>

            <FlourishDivider />
          </div>

          {/* 2x2 Testimonial Cards Grid */}
          <div className="testimonials-cards-grid">
            {testimonials.map((item, idx) => (
              <div
                key={item.id || idx}
                className="testimonial-editorial-card"
                style={{
                  background: '#fcf7f1',
                  borderRadius: '18px',
                  padding: '34px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px'
                }}
              >
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <Quote size={26} color="#c5a044" strokeWidth={1.75} />
                  </div>

                  <p
                    style={{
                      margin: '0 0 26px',
                      fontFamily: "var(--font-cormorant)",
                      fontSize: '18.5px',
                      fontWeight: 550,
                      lineHeight: 1.65,
                      color: '#3b2119'
                    }}
                  >
                    {item.quote}
                  </p>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-karla)",
                    fontSize: '14.5px',
                    lineHeight: 1.45,
                    color: '#7c5652'
                  }}
                >
                  <strong style={{ fontWeight: 750, color: '#2b161b' }}>- {item.name}</strong>
                  {item.location ? ` · ${item.location}` : ''}
                  {item.role ? ` · ${item.role}` : ''}
                </p>
              </div>
            ))}
          </div>

          {onAddStory && (
            <div className="th-center-cta" style={{ marginTop: '40px' }}>
              <button
                type="button"
                onClick={onAddStory}
                className="th-btn th-btn--outline-dark"
              >
                <Sparkles size={15} color="#b5091f" />
                <span>Share Your Transformation Story</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
