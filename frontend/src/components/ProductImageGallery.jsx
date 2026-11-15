import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const touchStartX = useRef(null);

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

  const onKeyDown = (e) => {
    if (count < 2) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
  };

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

        {count > 1 && (
          <>
            <button type="button" className="pig-nav pig-nav--prev" onClick={() => go(current - 1)} aria-label="Previous photo">
              <ChevronLeft size={22} />
            </button>
            <button type="button" className="pig-nav pig-nav--next" onClick={() => go(current + 1)} aria-label="Next photo">
              <ChevronRight size={22} />
            </button>
            <span className="pig-counter" aria-live="polite">
              {current + 1} / {count}
            </span>
          </>
        )}
      </div>

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
    </div>
  );
}
