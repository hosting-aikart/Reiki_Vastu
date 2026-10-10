import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/landingData';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const prevStep = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : HOW_IT_WORKS_STEPS.length - 1));
  };

  const nextStep = () => {
    setActiveStep((prev) => (prev < HOW_IT_WORKS_STEPS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="hm-works-outer">
      <div className="hm-container">
        <div className="hm-mkt-header">
          <div>
            <p className="hm-eyebrow hm-grad">HOW REIKI &amp; VAASTU WORLD WORKS</p>
            <h2 className="ff-redhat hm-h2">From Diagnosis to Lifelong Transformation in Four Steps</h2>
          </div>

          <div className="hm-mkt-arrows">
            <button
              type="button"
              className="hm-mkt-arrow"
              aria-label="Previous step"
              onClick={prevStep}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="hm-mkt-arrow"
              aria-label="Next step"
              onClick={nextStep}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <div className="hm-works-accordion">
          {HOW_IT_WORKS_STEPS.map((item, index) => {
            const isActive = activeStep === index;

            return (
              <div
                key={item.step}
                className={`hm-work-item ${isActive ? 'hm-work-item--active' : 'hm-work-item--inactive'}`}
                style={{
                  background: index % 2 === 0
                    ? 'linear-gradient(135deg, #4a0e17 0%, #2e0854 100%)'
                    : 'linear-gradient(135deg, #2e0854 0%, #4a0e17 100%)'
                }}
                onClick={() => setActiveStep(index)}
              >
                {isActive ? (
                  <div className="hm-work-overlay">
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: '#fbbf24',
                        textTransform: 'uppercase',
                        marginBottom: '6px'
                      }}
                    >
                      {item.eyebrow}
                    </span>
                    <h3 className="hm-work-pill-title" style={{ color: item.color }}>
                      {item.step}. {item.title}
                    </h3>
                    <p className="hm-work-pill-sub" style={{ marginBottom: '16px' }}>{item.description}</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {item.highlights && item.highlights.map((h, i) => (
                        <span
                          key={i}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            padding: '4px 12px',
                            borderRadius: '50px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#fffdf9'
                          }}
                        >
                          <CheckCircle2 size={13} color="#f59e0b" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="hm-work-vertical-label">
                    <span>{item.step}. {item.title}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
