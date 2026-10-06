import React, { useState, useEffect } from 'react';
import { SEARCH_PLACEHOLDERS } from '../data/landingData';

export default function Hero({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = SEARCH_PLACEHOLDERS[placeholderIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
        if (displayedText.length === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), 1600);
        }
      } else {
        setDisplayedText(currentFullText.substring(0, displayedText.length - 1));
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, placeholderIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue || displayedText);
    }
  };

  return (
    <section className="hm-hero">
      <div className="hm-hero-video-wrap">
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="hm-hero-video"
          poster="/images/earth_low_white_part.jpg"
        />
      </div>

      <div className="hm-hero-veil" />

      <div className="hm-container hm-hero-in">
        <h1 className="ff-redhat hm-hero-title">
          Discover, Test &amp; Buy <span className="hm-grad">AI Solutions</span>
          <br className="hm-hero-br" /> for Your Business
        </h1>

        <div className="hm-pills ff-inter">
          <span className="hm-pill">
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>✓</span> Test ai agents for free
          </span>
          <span className="hm-pill">
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>✓</span> Verified providers
          </span>
        </div>

        <form className="hm-search ff-inter" onSubmit={handleSubmit}>
          <img
            src="/figma/image484.png"
            alt=""
            style={{ width: '20px', height: '20px', objectFit: 'contain', opacity: 0.7 }}
          />

          <div style={{ position: 'relative', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder=" "
              aria-label="Search AI agents"
            />
            {!searchValue && (
              <span
                style={{
                  position: 'absolute',
                  left: '10px',
                  pointerEvents: 'none',
                  color: '#94a3b8',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span>Search {displayedText}</span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '18px',
                    background: '#2563eb',
                    marginLeft: '2px',
                    animation: 'hm-blink 1s infinite'
                  }}
                />
              </span>
            )}
          </div>

          <button type="submit" className="hm-search-ai" aria-label="Search with AI">
            <img
              src="/logo/aikart-ai-mark-white.png"
              alt="AI"
              style={{ height: '18px', width: 'auto', objectFit: 'contain' }}
            />
          </button>
        </form>
      </div>

      <style>{`
        @keyframes hm-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
