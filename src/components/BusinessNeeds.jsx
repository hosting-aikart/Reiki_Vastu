import React from 'react';
import { BUSINESS_NEEDS } from '../data/landingData';

export default function BusinessNeeds({ onSelectIndustry }) {
  // Duplicate for seamless infinite marquee loop
  const duplicatedNeeds = [...BUSINESS_NEEDS, ...BUSINESS_NEEDS];

  return (
    <section className="hm-need-sec">
      <div className="hm-container">
        <div>
          <p className="hm-eyebrow hm-grad">BY BUSINESS NEED</p>
          <h2 className="ff-redhat hm-h2" style={{ color: '#0f172a', marginBottom: '28px' }}>
            Find AI Solutions by Business Need
          </h2>
        </div>
      </div>

      <div className="hm-need-viewport">
        <div className="hm-need-track">
          {duplicatedNeeds.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="hm-need-card"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectIndustry && onSelectIndustry(item.title)}
            >
              <div className="hm-need-imgwrap">
                <img src={item.icon} alt={item.title} />
              </div>
              <h3 className="ff-poppins">{item.title}</h3>
              <p className="ff-inter">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
