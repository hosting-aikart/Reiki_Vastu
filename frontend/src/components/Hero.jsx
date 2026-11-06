import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ onSearch, onConsultClick, onExploreCourses }) {
  const handleExplore = () => {
    if (onExploreCourses) {
      onExploreCourses();
    } else {
      const el = document.getElementById('courses-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else if (onSearch) onSearch();
    }
  };

  return (
    <section className="hero-section hero-fullscreen-16x9">
      {/* Crisp Detail & Lighting SVG Filter */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="hero-crisp-sharpen" colorInterpolationFilters="sRGB">
            <feConvolveMatrix
              order="3 3"
              kernelMatrix="0 -0.22 0 -0.22 1.88 -0.22 0 -0.22 0"
              preserveAlpha="true"
            />
          </filter>
        </defs>
      </svg>

      {/* 16:9 Full-Screen Video Background with Enhanced Lighting & Sharp Details */}
      <div className="hero-bg-video-wrap" aria-hidden="true">
        <video
          src="/images/main-video.mp4"
          poster="/images/Meditation.png"
          preload="metadata"
          autoPlay
          muted
          loop
          playsInline
          className="hero-bg-video"
        />
        {/* Dark Gradient Vignette Overlay */}
        <div className="hero-bg-vignette" />
      </div>

      {/* Lower-Third Clean Modern White UI Text & Two Flat Rounded Buttons */}
      <div className="hm-container hero-lower-third-container">
        <div className="hero-lower-third-content">
          {/* Eyebrow Pill */}
          <div className="hero-modern-badge">
            <Sparkles size={14} color="#fbbf24" />
            <span>Reiki &amp; Vaastu World &nbsp;&middot;&nbsp; Training &amp; Treatment Center</span>
          </div>

          {/* Clean Modern White Headline */}
          <h1 className="hero-modern-title">
            Ancient Wisdom for a Healthier, Happier and More Harmonious Life
          </h1>

          {/* Clean Modern White Subtitle / Pillars */}
          <p className="hero-modern-subtitle">
            <span>Heal Your Mind</span>
            <span className="hero-modern-dot" aria-hidden="true">&bull;</span>
            <span>Balance Your Space</span>
            <span className="hero-modern-dot" aria-hidden="true">&bull;</span>
            <span>Transform Your Life</span>
          </p>

          {/* Two Flat Rounded Buttons */}
          <div className="hero-modern-actions">
            <button
              type="button"
              onClick={handleExplore}
              className="hero-flat-btn hero-flat-btn--primary"
            >
              <span>Explore Our Courses</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              onClick={onConsultClick}
              className="hero-flat-btn hero-flat-btn--secondary"
            >
              <span>Book a Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
