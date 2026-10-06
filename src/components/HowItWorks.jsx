import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
            <p className="hm-eyebrow hm-grad">HOW AIKART WORKS</p>
            <h2 className="ff-redhat hm-h2">From discovery to deployment in four steps</h2>
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
                onClick={() => setActiveStep(index)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="hm-work-img"
                  style={{ objectPosition: item.objectPosition }}
                />

                {isActive ? (
                  <div className="hm-work-overlay">
                    <h3 className="hm-work-pill-title" style={{ color: item.color }}>
                      {item.step}. {item.title}
                    </h3>
                    <p className="hm-work-pill-sub">{item.description}</p>
                  </div>
                ) : (
                  <div className="hm-work-vertical-label">
                    <span>{item.title}</span>
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
