import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Sparkles, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { SELLER_STEPS } from '../data/landingData';

export default function BecomeSellerView({ onBackToHome }) {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    modality: 'Reiki Energy Healing (Levels 1 to Grandmaster)',
    experienceLevel: 'Beginner / First Time Seeker',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#fdfbf7', paddingBottom: '80px' }}>
      <div className="hm-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 40px' }}>
          <p className="hm-eyebrow hm-grad" style={{ marginBottom: '8px' }}>
            PRACTITIONER ONBOARDING &amp; CERTIFICATION
          </p>
          <h1 className="ff-redhat" style={{ fontSize: '38px', fontWeight: 700, margin: '0 0 12px', color: '#3b0a11' }}>
            Become a Certified Healer &amp; Vastu Consultant
          </h1>
          <p style={{ color: '#784450', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
            Join Dr. Naresh Chhabdiya's international network of certified practitioners. Receive traditional master attunements, hands-on clinical training, authentic kits, and lifetime free entry for guidance.
          </p>
        </div>

        {/* 6 Step Indicators */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '40px'
          }}
        >
          {SELLER_STEPS.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < activeStep;
            const isCurrent = stepNum === activeStep;

            return (
              <div
                key={step.num}
                onClick={() => setActiveStep(stepNum)}
                style={{
                  background: isCurrent ? '#ffffff' : 'rgba(255,255,255,0.7)',
                  border: isCurrent ? `2px solid ${step.color}` : '1.5px solid rgba(212,175,55,0.3)',
                  borderRadius: '18px',
                  padding: '14px',
                  cursor: 'pointer',
                  boxShadow: isCurrent ? '0 8px 24px rgba(220,38,38,0.1)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: step.color }}>{step.num}</span>
                  {isCompleted && <CheckCircle2 size={16} color="#16a34a" />}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#3b0a11' }}>{step.title}</div>
                <div style={{ fontSize: '11px', color: '#8c5360', marginTop: '2px' }}>{step.subtitle}</div>
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            background: '#ffffff',
            borderRadius: '26px',
            padding: '38px',
            boxShadow: '0 12px 40px rgba(180,83,9,0.08)',
            border: '2px solid rgba(212,175,55,0.45)'
          }}
        >
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fffbeb 100%)',
                  border: '2px solid #d4af37',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  boxShadow: '0 8px 20px rgba(220,38,38,0.2)'
                }}
              >
                <CheckCircle2 size={38} />
              </div>

              <h2 className="ff-redhat" style={{ fontSize: '26px', fontWeight: 700, color: '#3b0a11', margin: '0 0 10px' }}>
                Application Received Successfully!
              </h2>

              <p style={{ color: '#784450', fontSize: '15px', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 24px' }}>
                Thank you for taking this sacred step with Reiki &amp; Vaastu World. Dr. Naresh Chhabdiya's training counselor will contact you via WhatsApp or call within 24 hours to schedule your preliminary energy consultation and course orientation.
              </p>

              <div
                style={{
                  background: '#fffdf9',
                  border: '1.5px solid rgba(212,175,55,0.4)',
                  borderRadius: '16px',
                  padding: '16px',
                  maxWidth: '460px',
                  margin: '0 auto 28px',
                  textAlign: 'left'
                }}
              >
                <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#881337', fontWeight: 700 }}>
                  ✦ Immediate Questions? Call Center Directly:
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#3b0a11', fontWeight: 600 }}>
                  Amravati / Nagpur Helpline: +91 8446656677 / 9423424596
                </p>
              </div>

              <button
                type="button"
                className="gnav-btn-primary"
                onClick={onBackToHome}
                style={{ padding: '12px 32px' }}
              >
                Return to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#dc2626',
                    background: '#fef2f2',
                    padding: '4px 12px',
                    borderRadius: '50px',
                    border: '1px solid #fecaca'
                  }}
                >
                  Practitioner Application Form
                </span>
                <h3 className="ff-redhat" style={{ fontSize: '22px', fontWeight: 700, color: '#3b0a11', margin: '12px 0 4px' }}>
                  Begin Your Journey of Sacred Mastery
                </h3>
                <p style={{ color: '#784450', fontSize: '13.5px', margin: 0 }}>
                  Fill in your details below to apply for upcoming batches in Amravati, Nagpur, or online live attunements.
                </p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Deshmukh"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '12px',
                    border: '1.5px solid #d4af37',
                    background: '#fffdf9',
                    padding: '0 14px',
                    fontSize: '14px',
                    color: '#3b0a11',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9823456789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      height: '46px',
                      borderRadius: '12px',
                      border: '1.5px solid #d4af37',
                      background: '#fffdf9',
                      padding: '0 14px',
                      fontSize: '14px',
                      color: '#3b0a11',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                    Your City &amp; State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amravati, Nagpur, Pune..."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{
                      width: '100%',
                      height: '46px',
                      borderRadius: '12px',
                      border: '1.5px solid #d4af37',
                      background: '#fffdf9',
                      padding: '0 14px',
                      fontSize: '14px',
                      color: '#3b0a11',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                  Modality / Course of Interest *
                </label>
                <select
                  value={formData.modality}
                  onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '12px',
                    border: '1.5px solid #d4af37',
                    background: '#fffdf9',
                    padding: '0 14px',
                    fontSize: '14px',
                    color: '#3b0a11',
                    outline: 'none',
                    fontWeight: 600
                  }}
                >
                  <option>Reiki Energy Healing (Levels 1 to Grandmaster)</option>
                  <option>Complete Vaastu Shastra Professional Consultant Course</option>
                  <option>Tibetan Lama-Fera High Vibration Cleansing &amp; Master Course</option>
                  <option>Vedic Astrology &amp; Janam Kundali Reading</option>
                  <option>Scientific Acupressure &amp; Sujok Meridian Therapy</option>
                  <option>Chakra Crystal Therapy &amp; Gemstone Programming</option>
                  <option>Bio-Tensor &amp; Pendulum Dowsing Course</option>
                  <option>Pranic Energy Healing System</option>
                  <option>Feng-Shui Space Harmonization</option>
                  <option>Chaldean Numerology &amp; Name Correction</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                  Your Current Experience Level
                </label>
                <select
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: '12px',
                    border: '1.5px solid #d4af37',
                    background: '#fffdf9',
                    padding: '0 14px',
                    fontSize: '14px',
                    color: '#3b0a11',
                    outline: 'none'
                  }}
                >
                  <option>Beginner / First Time Seeker</option>
                  <option>Practicing Reiki Level 1 or 2</option>
                  <option>Astrologer / Vastu Practitioner looking to advance</option>
                  <option>Doctor / Medical Practitioner seeking complementary therapies</option>
                  <option>Yoga / Wellness Coach</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                  Any Specific Question or Intention for Dr. Naresh? (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share any health concern, life goal, or preference for in-person / online session..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    border: '1.5px solid #d4af37',
                    background: '#fffdf9',
                    padding: '12px 14px',
                    fontSize: '14px',
                    color: '#3b0a11',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', padding: '10px 14px', borderRadius: '12px', border: '1px solid #fecaca' }}>
                <ShieldCheck size={18} color="#dc2626" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '12.5px', color: '#881337', fontWeight: 600 }}>
                  Includes Lifetime Free Entry to ongoing alumni meditation circles and personal mentorship by Dr. Naresh Chhabdiya.
                </span>
              </div>

              <button
                type="submit"
                className="gnav-btn-primary"
                style={{
                  height: '48px',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}
              >
                <span>Submit Practitioner Application</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
