import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Upload, Sparkles, ShieldCheck } from 'lucide-react';
import { SELLER_STEPS } from '../data/landingData';

export default function BecomeSellerView({ onBackToHome }) {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    category: 'Marketing',
    pricing_model: 'Free',
    price: '',
    providerName: '',
    email: '',
    sandboxPrompt: 'Analyze this sample quarterly report and highlight top revenue risks.',
    description: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', background: '#f4f4f4', paddingBottom: '80px' }}>
      <div className="hm-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <p className="hm-eyebrow hm-grad" style={{ marginBottom: '8px' }}>
            SELLER ONBOARDING
          </p>
          <h1 className="ff-redhat" style={{ fontSize: '38px', fontWeight: 600, margin: '0 0 12px', color: '#0f172a' }}>
            Monetize &amp; Distribute Your AI Solutions
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
            List your AI agent or model on aiKart to reach thousands of enterprise buyers with built-in live sandbox testing and verified procurement.
          </p>
        </div>

        {/* 6 Step Indicators */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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
                  background: isCurrent ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  border: isCurrent ? `2px solid ${step.color}` : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer',
                  boxShadow: isCurrent ? '0 8px 24px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: step.color }}>{step.num}</span>
                  {isCompleted && <CheckCircle2 size={16} color="#22c55e" />}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{step.title}</div>
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
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}
        >
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}
              >
                <ShieldCheck size={36} />
              </div>
              <h2 className="ff-redhat" style={{ fontSize: '26px', fontWeight: 600, color: '#0f172a', marginBottom: '10px' }}>
                Agent Submitted for Verification!
              </h2>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                Your AI agent "<strong>{formData.title || 'Custom Agent'}</strong>" has been queued for verification. Our technical team will test your sandbox endpoint within 24 hours.
              </p>
              <button
                type="button"
                className="gnav-btn-primary"
                style={{ background: '#2563eb', color: '#ffffff', padding: '12px 32px' }}
                onClick={() => {
                  setIsSubmitted(false);
                  setActiveStep(1);
                  onBackToHome && onBackToHome();
                }}
              >
                Return to Marketplace
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {activeStep === 1 && (
                <div>
                  <h3 className="ff-redhat" style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                    Step 1: Provider Details
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '24px' }}>
                    Tell us about your organization or engineering studio.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Organization / Creator Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme AI Labs"
                        className="akf-nl-input"
                        value={formData.providerName}
                        onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Business Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="founder@company.com"
                        className="akf-nl-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
                    <button
                      type="button"
                      className="gnav-btn-primary"
                      style={{ background: '#2563eb', color: '#ffffff', display: 'inline-flex', gap: '8px' }}
                      onClick={() => setActiveStep(2)}
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div>
                  <h3 className="ff-redhat" style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                    Step 2: Upload Agent Product
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '24px' }}>
                    Define your agent's name, category, and core workflow promise.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Agent Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SalesContract Pro"
                        className="akf-nl-input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        One-Line Tagline *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Automated contract markup and risk triage for B2B deals."
                        className="akf-nl-input"
                        value={formData.tagline}
                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Primary Category *
                      </label>
                      <select
                        className="akf-nl-input"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Marketing">Marketing</option>
                        <option value="Productivity">Productivity</option>
                        <option value="Customer Service">Customer Service</option>
                        <option value="Sales">Sales &amp; CRM</option>
                        <option value="Finance & Accounting">Finance &amp; Accounting</option>
                        <option value="Legal & Compliance">Legal &amp; Compliance</option>
                        <option value="Data Analysis">Data Analysis</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Full Description
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Detail the models used, supported integrations (Slack, Zapier, REST), and accuracy benchmarks."
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '16px',
                          border: '1.5px solid #cbd5e1',
                          outline: 'none',
                          fontSize: '14px',
                          fontFamily: 'inherit'
                        }}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}
                      onClick={() => setActiveStep(1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="gnav-btn-primary"
                      style={{ background: '#2563eb', color: '#ffffff', display: 'inline-flex', gap: '8px' }}
                      onClick={() => setActiveStep(3)}
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div>
                  <h3 className="ff-redhat" style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                    Step 3: Configure Live Sandbox
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '24px' }}>
                    Buyers can test your agent live before purchase. Provide a starter sample prompt.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Default Demo Prompt
                      </label>
                      <textarea
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '16px',
                          border: '1.5px solid #cbd5e1',
                          outline: 'none',
                          fontSize: '14px',
                          fontFamily: 'inherit'
                        }}
                        value={formData.sandboxPrompt}
                        onChange={(e) => setFormData({ ...formData, sandboxPrompt: e.target.value })}
                      />
                    </div>

                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '16px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center'
                      }}
                    >
                      <Sparkles size={20} color="#2563eb" />
                      <span style={{ fontSize: '13px', color: '#475569' }}>
                        Live sandboxes generate <strong>4.2x higher conversion</strong> compared to traditional static software listings.
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}
                      onClick={() => setActiveStep(2)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="gnav-btn-primary"
                      style={{ background: '#2563eb', color: '#ffffff', display: 'inline-flex', gap: '8px' }}
                      onClick={() => setActiveStep(4)}
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div>
                  <h3 className="ff-redhat" style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                    Step 4: Set Pricing
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '24px' }}>
                    Choose your monetization strategy on the aiKart marketplace.
                  </p>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    {['Free', 'Freemium', 'Paid'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setFormData({ ...formData, pricing_model: tier })}
                        style={{
                          flex: 1,
                          padding: '16px 12px',
                          borderRadius: '16px',
                          border: formData.pricing_model === tier ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: formData.pricing_model === tier ? '#eff6ff' : '#ffffff',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '14px',
                          color: formData.pricing_model === tier ? '#2563eb' : '#334155'
                        }}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>

                  {formData.pricing_model === 'Paid' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                        Monthly Subscription Price ($ USD)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 49"
                        className="akf-nl-input"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}
                      onClick={() => setActiveStep(3)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="gnav-btn-primary"
                      style={{ background: '#2563eb', color: '#ffffff', display: 'inline-flex', gap: '8px' }}
                      onClick={() => setActiveStep(5)}
                    >
                      Preview &amp; Publish <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {activeStep >= 5 && (
                <div>
                  <h3 className="ff-redhat" style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                    Step 5 &amp; 6: Review &amp; Launch
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '24px' }}>
                    Review your listing snapshot before submitting to our verification registry.
                  </p>

                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '18px',
                      border: '1px solid #e2e8f0',
                      padding: '20px',
                      marginBottom: '24px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                      >
                        <img src="/logo/aikart-ai-mark.png" alt="" style={{ width: '32px', height: '32px' }} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                          {formData.title || 'Untitled Agent'}
                        </h4>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          By {formData.providerName || 'Independent Seller'} • {formData.category}
                        </span>
                      </div>
                    </div>
                    <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 12px' }}>
                      {formData.tagline || 'No tagline provided yet.'}
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: '#dbeafe',
                        color: '#1d4fd0',
                        fontSize: '12px',
                        fontWeight: 700,
                        borderRadius: '50px'
                      }}
                    >
                      Pricing: {formData.pricing_model} {formData.price ? `$${formData.price}/mo` : ''}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '14px' }}
                      onClick={() => setActiveStep(4)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="gnav-btn-primary"
                      style={{ background: '#2563eb', color: '#ffffff', padding: '12px 30px' }}
                    >
                      Submit for Verification
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
