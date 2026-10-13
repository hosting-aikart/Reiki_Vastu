import React from 'react';
import { TECH_STACK } from '../data/landingData';

export default function TechStack() {
  const duplicatedLogos = [...TECH_STACK, ...TECH_STACK];

  return (
    <section className="tools-sec" aria-label="Sacred Energy Sciences">
      <div className="hm-container">
        <div style={{ textAlign: 'left', marginBottom: '32px' }}>
          <p className="hm-eyebrow hm-grad" style={{ marginBottom: '8px' }}>
            SACRED DISCIPLINES &amp; TRADITIONS
          </p>
          <h2 className="ff-redhat hm-h2" style={{ margin: 0 }}>
            Mastered Across 28+ Years of Vedic &amp; Ancient Energy Practice
          </h2>
        </div>
      </div>

      <div className="tools-marquee-viewport">
        <div className="tools-marquee-track">
          {duplicatedLogos.map((tool, index) => (
            <div key={`${tool.name}-${index}`} className="tools-item" title={`${tool.name}: ${tool.subtitle}`}>
              <span className="tools-item-symbol">{tool.symbol}</span>
              <div>
                <div className="tools-item-name">{tool.name}</div>
                <div style={{ fontSize: '11px', color: '#8c5360' }}>{tool.subtitle}</div>
              </div>
              <span className="tools-item-tag">{tool.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
