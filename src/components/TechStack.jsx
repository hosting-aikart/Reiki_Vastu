import React from 'react';
import { TECH_STACK } from '../data/landingData';

export default function TechStack() {
  const duplicatedLogos = [...TECH_STACK, ...TECH_STACK];

  return (
    <section className="tools-sec" aria-label="The Tech Stack">
      <div className="tools-container">
        <div style={{ textAlign: 'left', marginBottom: '40px' }}>
          <p className="hm-eyebrow hm-grad" style={{ marginBottom: '8px' }}>
            THE TECH STACK
          </p>
          <h2 className="ff-redhat hm-h2" style={{ margin: 0 }}>
            Built on the tools powering modern AI
          </h2>
        </div>
      </div>

      <div className="tools-marquee-viewport">
        <div className="tools-marquee-track">
          {duplicatedLogos.map((tool, index) => (
            <div key={`${tool.name}-${index}`} className="tools-item" title={tool.name}>
              <img src={tool.logo} alt={tool.name} className="tools-logo-img" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
