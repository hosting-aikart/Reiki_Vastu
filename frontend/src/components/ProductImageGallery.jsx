import React, { useCallback, useEffect, useRef, useState } from 'react';
import './ProductImageGallery.css';

const SWIPE_THRESHOLD_PX = 40;

/**
 * Main product photo with thumbnails, previous / next buttons, swipe on touch
 * screens and arrow keys. With a single photo it shows just that photo.
 * Photos that fail to load are left out, so a missing file never shows as a
 * broken image.
 */
export default function ProductImageGallery({ images, alt, badge }) {
  const [failed, setFailed] = useState(() => new Set());
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStartX = useRef(null);
  const lbTouchStartX = useRef(null);

  const visible = images.filter((src) => !failed.has(src));
  const count = visible.length;
  const current = Math.min(index, Math.max(count - 1, 0));

  // A different product starts at its first photo
  useEffect(() => {
    setIndex(0);
    setFailed(new Set());
  }, [images]);

  const go = (next) => setIndex(((next % count) + count) % count);
  const markFailed = (src) => setFailed((prev) => new Set(prev).add(src));

  // Close lightbox on Escape, navigate with arrow keys
  const onKeyDown = (e) => {
    if (count < 2) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    if (e.key === 'Escape') setLightbox(false);
  };

  // Close lightbox on Escape globally when open
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => { if (e.key === 'Escape') setLightbox(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null || count < 2) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) go(current + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="pig" onKeyDown={onKeyDown}>
      <div
        className="pig-main"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role={count > 1 ? 'region' : undefined}
        aria-roledescription={count > 1 ? 'carousel' : undefined}
        aria-label={count > 1 ? `${alt}: photo gallery` : undefined}
        tabIndex={count > 1 ? 0 : undefined}
      >
        {visible.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={count > 1 ? `${alt} (view ${i + 1} of ${count})` : alt}
            className={`pig-slide${i === current ? ' is-active' : ''}`}
            aria-hidden={i !== current}
            loading={i === 0 ? 'eager' : 'lazy'}
            draggable={false}
            onError={() => markFailed(src)}
          />
        ))}

        {badge && <span className="pig-badge">✦ {badge} ✦</span>}

        {/* Invisible left / right click zones for side-tap navigation */}
        {count > 1 && (
          <>
            <button
              type="button"
              className="pig-zone pig-zone--prev"
              onClick={() => go(current - 1)}
              aria-label="Previous photo"
            />
            <button
              type="button"
              className="pig-zone pig-zone--next"
              onClick={() => go(current + 1)}
              aria-label="Next photo"
            />
          </>
        )}

        {/* Click centre area to open lightbox */}
        <button
          type="button"
          className="pig-open-lb"
          onClick={() => setLightbox(true)}
          aria-label="View full size"
        />
      </div>

      {/* Dots below the image */}
      {count > 1 && (
        <div className="pig-dots" role="tablist" aria-label="Photo pagination">
          {visible.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`View photo ${i + 1} of ${count}`}
              className={`pig-dot${i === current ? ' is-active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}

      {count > 1 && (
        <div className="pig-thumbs" role="tablist" aria-label="Choose a photo">
          {visible.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Show view ${i + 1}`}
              className={`pig-thumb${i === current ? ' is-active' : ''}`}
              onClick={() => setIndex(i)}
            >
              <img src={src} alt="" loading="lazy" draggable={false} onError={() => markFailed(src)} />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="pig-lb-overlay"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Full-size photo"
          onTouchStart={(e) => { lbTouchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (lbTouchStartX.current === null || count < 2) return;
            const dx = e.changedTouches[0].clientX - lbTouchStartX.current;
            lbTouchStartX.current = null;
            if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) go(current + (dx < 0 ? 1 : -1));
          }}
        >
          {/* Stop click propagation on the image so it doesn't close the lightbox */}
          <div className="pig-lb-box" onClick={(e) => e.stopPropagation()}>
            <img
              src={visible[current]}
              alt={alt}
              className="pig-lb-img"
              draggable={false}
            />

            {/* Close */}
            <button
              type="button"
              className="pig-lb-close"
              onClick={() => setLightbox(false)}
              aria-label="Close"
            >✕</button>

            {/* Prev / Next */}
            {count > 1 && (
              <>
                <button
                  type="button"
                  className="pig-lb-nav pig-lb-nav--prev"
                  onClick={() => go(current - 1)}
                  aria-label="Previous photo"
                >&#8249;</button>
                <button
                  type="button"
                  className="pig-lb-nav pig-lb-nav--next"
                  onClick={() => go(current + 1)}
                  aria-label="Next photo"
                >&#8250;</button>
              </>
            )}

            {/* Counter */}
            {count > 1 && (
              <span className="pig-lb-counter">{current + 1} / {count}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
