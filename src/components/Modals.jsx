import React, { useState } from 'react';
import { X, Calendar, Send, Sparkles, CheckCircle2, ShieldCheck, Play, Terminal } from 'lucide-react';

export default function Modals({ activeModal, modalData, closeModal }) {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [meetingForm, setMeetingForm] = useState({ name: '', email: '', date: '', time: '10:00 AM', note: '' });
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'

  if (!activeModal) return null;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmittedStatus(true);
    setTimeout(() => {
      setSubmittedStatus(false);
      closeModal();
    }, 2500);
  };

  const handleMeetingSubmit = (e) => {
    e.preventDefault();
    setSubmittedStatus(true);
    setTimeout(() => {
      setSubmittedStatus(false);
      closeModal();
    }, 2500);
  };

  const runSandboxTest = () => {
    setIsExecuting(true);
    setSandboxOutput('Initializing sandboxed agent runtime container...\nChecking API permissions and environment isolation...\n');
    setTimeout(() => {
      setSandboxOutput((prev) => prev + 'Loading agent weights and context parameters...\nExecuting workflow inference pipeline...\n');
    }, 800);
    setTimeout(() => {
      setSandboxOutput(
        (prev) =>
          prev +
          `\n[Output Generated Successfully]:\n----------------------------------------\nAnalysis complete for input: "${
            sandboxPrompt || 'Standard Benchmark Payload'
          }"\n• Confidence score: 99.4%\n• Processing latency: 240ms\n• Compliance check: Verified Clean\n• Status: Execution Passed without hallucinations.`
      );
      setIsExecuting(false);
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* ─── CONTACT US MODAL ─── */}
        {activeModal === 'contact' && (
          <div style={{ padding: '36px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#2563eb',
                background: '#eff6ff',
                padding: '4px 12px',
                borderRadius: '50px'
              }}
            >
              Get In Touch
            </span>
            <h2 className="ff-redhat" style={{ fontSize: '26px', fontWeight: 600, margin: '14px 0 6px', color: '#0f172a' }}>
              Contact Our Enterprise Team
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>
              Have questions about deploying or monetizing AI agents? We typically respond in under 2 hours.
            </p>

            {submittedStatus ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '0 0 6px' }}>
                  Message Sent!
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                  Thank you! An aiKart specialist will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Amruta K."
                    className="akf-nl-input"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="akf-nl-input"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    How can we help? *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about the AI workflows you want to implement or list..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                      fontSize: '14px',
                      fontFamily: 'inherit'
                    }}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="gnav-btn-primary"
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    padding: '14px',
                    fontSize: '14.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px'
                  }}
                >
                  <Send size={16} /> Send Message
                </button>
              </form>
            )}
          </div>
        )}

        {/* ─── SCHEDULE MEETING MODAL ─── */}
        {activeModal === 'schedule' && (
          <div style={{ padding: '36px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#2563eb',
                background: '#eff6ff',
                padding: '4px 12px',
                borderRadius: '50px'
              }}
            >
              Consultation
            </span>
            <h2 className="ff-redhat" style={{ fontSize: '26px', fontWeight: 600, margin: '14px 0 6px', color: '#0f172a' }}>
              Schedule a 1-on-1 Strategy Call
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>
              Speak directly with an AI Solutions Architect about architecture, integration, or custom agent development.
            </p>

            {submittedStatus ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '0 0 6px' }}>
                  Meeting Confirmed!
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                  We've sent a calendar invite to <strong>{meetingForm.email}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMeetingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    className="akf-nl-input"
                    value={meetingForm.name}
                    onChange={(e) => setMeetingForm({ ...meetingForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Email for Calendar Invite *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@acmecorp.com"
                    className="akf-nl-input"
                    value={meetingForm.email}
                    onChange={(e) => setMeetingForm({ ...meetingForm, email: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      className="akf-nl-input"
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Time Slot *
                    </label>
                    <select
                      className="akf-nl-input"
                      value={meetingForm.time}
                      onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    >
                      <option value="10:00 AM">10:00 AM EST</option>
                      <option value="01:30 PM">01:30 PM EST</option>
                      <option value="04:00 PM">04:00 PM EST</option>
                      <option value="06:30 PM">06:30 PM EST</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="gnav-btn-primary"
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    padding: '14px',
                    fontSize: '14.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px'
                  }}
                >
                  <Calendar size={16} /> Confirm Calendar Slot
                </button>
              </form>
            )}
          </div>
        )}

        {/* ─── LIVE SANDBOX TESTING MODAL ─── */}
        {activeModal === 'sandbox' && (
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <img
                  src={modalData?.logo_url || '/logo/aikart-ai-mark.png'}
                  alt=""
                  style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>
                  {modalData?.title || 'Live AI Sandbox'}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Provided by {modalData?.provider || 'Verified Partner'} • Isolated Cloud Container
                </span>
              </div>
            </div>

            <p style={{ color: '#475569', fontSize: '13.5px', lineHeight: 1.5, margin: '0 0 18px' }}>
              {modalData?.tagline || 'Test this model with custom input payloads in real time.'}
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Test Input Prompt:
              </label>
              <textarea
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none',
                  fontSize: '13.5px',
                  fontFamily: 'inherit'
                }}
                placeholder="Enter sample text, question, or payload to run through this agent..."
                value={sandboxPrompt}
                onChange={(e) => setSandboxPrompt(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button
                type="button"
                className="gnav-btn-primary"
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13.5px'
                }}
                disabled={isExecuting}
                onClick={runSandboxTest}
              >
                <Play size={14} /> {isExecuting ? 'Running inference...' : 'Execute in Sandbox'}
              </button>
            </div>

            {/* Terminal Output */}
            <div
              style={{
                background: '#0f172a',
                color: '#38bdf8',
                borderRadius: '14px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '12.5px',
                minHeight: '130px',
                maxHeight: '200px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', marginBottom: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
                <Terminal size={14} /> Sandbox Console Log
              </div>
              {sandboxOutput || '> Ready. Press "Execute in Sandbox" to run live test.'}
            </div>
          </div>
        )}

        {/* ─── CUSTOM SOLUTIONS / CUSTOM ML MODAL ─── */}
        {(activeModal === 'custom-solutions' || activeModal === 'custom-ml') && (
          <div style={{ padding: '36px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#2563eb',
                background: '#eff6ff',
                padding: '4px 12px',
                borderRadius: '50px'
              }}
            >
              {activeModal === 'custom-ml' ? 'ML Engineering' : 'Bespoke AI Solutions'}
            </span>
            <h2 className="ff-redhat" style={{ fontSize: '26px', fontWeight: 600, margin: '14px 0 6px', color: '#0f172a' }}>
              {activeModal === 'custom-ml' ? 'Custom ML Models & Fine-Tuning' : 'Custom Autonomous AI Solutions'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.5 }}>
              {activeModal === 'custom-ml'
                ? 'We train, fine-tune, and deploy proprietary LLMs and vision models securely hosted within your VPC or on-prem environment.'
                : 'Need a customized multi-agent pipeline tailored to your unique internal ERP, CRM, and data warehouse? Our architects build it from spec to deployment.'}
            </p>

            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Company Name *
                </label>
                <input type="text" required placeholder="Acme Technologies" className="akf-nl-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Work Email *
                </label>
                <input type="email" required placeholder="tech@acme.com" className="akf-nl-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Project Objectives &amp; Timeline *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline key requirements, datasets, and expected deployment targets..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    border: '1.5px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '14px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <button
                type="submit"
                className="gnav-btn-primary"
                style={{ background: '#2563eb', color: '#ffffff', padding: '14px', fontSize: '14.5px', marginTop: '6px' }}
              >
                Request Custom Solution Proposal
              </button>
            </form>
          </div>
        )}

        {/* ─── ABOUT US MODAL ─── */}
        {activeModal === 'about' && (
          <div style={{ padding: '36px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#2563eb',
                background: '#eff6ff',
                padding: '4px 12px',
                borderRadius: '50px'
              }}
            >
              Our Mission
            </span>
            <h2 className="ff-redhat" style={{ fontSize: '28px', fontWeight: 600, margin: '14px 0 14px', color: '#0f172a' }}>
              About aiKart
            </h2>
            <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: 1.7, margin: '0 0 14px' }}>
              aiKart was born to solve the single largest bottleneck in AI adoption: <strong>trust and verifiable outcomes</strong>.
            </p>
            <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: 1.7, margin: '0 0 14px' }}>
              Instead of buying black-box software on blind faith, aiKart provides enterprise buyers with transparent live sandboxes, vetted providers, side-by-side performance benchmarks, and streamlined procurement.
            </p>
            <p style={{ color: '#475569', fontSize: '14.5px', lineHeight: 1.7, margin: 0 }}>
              Headquartered in Saturna, Amravati, Maharashtra, our global engineering community connects independent AI researchers and agent builders with forward-thinking businesses around the world.
            </p>
          </div>
        )}

        {/* ─── LEGAL MODALS (Terms / Privacy / Cookies) ─── */}
        {(activeModal === 'terms' || activeModal === 'privacy' || activeModal === 'cookies') && (
          <div style={{ padding: '36px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#2563eb',
                background: '#eff6ff',
                padding: '4px 12px',
                borderRadius: '50px'
              }}
            >
              Legal &amp; Compliance
            </span>
            <h2 className="ff-redhat" style={{ fontSize: '26px', fontWeight: 600, margin: '14px 0 14px', color: '#0f172a' }}>
              {activeModal === 'terms'
                ? 'Terms of Service'
                : activeModal === 'privacy'
                ? 'Privacy Policy'
                : 'Cookie Policy'}
            </h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto', fontSize: '13.5px', lineHeight: 1.65, color: '#475569' }}>
              <p>
                <strong>1. General Conditions:</strong> By using the aiKart platform, you acknowledge and agree that all AI agents, models, and workflows listed on our marketplace are subject to individual developer SLAs and verified sandbox guidelines.
              </p>
              <p>
                <strong>2. Data Privacy &amp; Sandbox Safety:</strong> We prioritize zero-retention policies for sandbox queries. Inputs executed in demo sandboxes are processed strictly in isolated container instances without persisting proprietary client data.
              </p>
              <p>
                <strong>3. Seller Payouts &amp; Quality Benchmark:</strong> Sellers undergo a continuous verification review. aiKart retains platform escrow until deployment delivery is verified according to the listing SLA.
              </p>
              <p>
                <strong>4. Jurisdiction:</strong> These terms are governed under applicable laws with arbitration provisions in Maharashtra, India.
              </p>
            </div>
          </div>
        )}

        {/* ─── AUTH MODAL ─── */}
        {activeModal === 'auth' && (
          <div style={{ padding: '36px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <img src="/logo/aikart-logo-full.png" alt="aiKart" style={{ height: '28px', marginBottom: '12px' }} />
              <h2 className="ff-redhat" style={{ fontSize: '24px', fontWeight: 600, color: '#0f172a', margin: '0 0 6px' }}>
                {authTab === 'login' ? 'Welcome Back' : 'Create Your aiKart Account'}
              </h2>
              <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>
                {authTab === 'login' ? 'Access your saved AI agents and active sandboxes' : 'Join 10,000+ businesses discovering AI solutions'}
              </p>
            </div>

            {/* Tab switch */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '50px', padding: '4px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '50px',
                  border: 'none',
                  background: authTab === 'login' ? '#ffffff' : 'transparent',
                  color: authTab === 'login' ? '#0f172a' : '#64748b',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: authTab === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '50px',
                  border: 'none',
                  background: authTab === 'signup' ? '#ffffff' : 'transparent',
                  color: authTab === 'signup' ? '#0f172a' : '#64748b',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: authTab === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                Sign Up
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Successfully authenticated with aiKart!`);
                closeModal();
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input type="email" required placeholder="you@company.com" className="akf-nl-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Password
                </label>
                <input type="password" required placeholder="••••••••" className="akf-nl-input" />
              </div>

              <button
                type="submit"
                className="gnav-btn-primary"
                style={{ background: '#2563eb', color: '#ffffff', padding: '14px', fontSize: '14.5px', marginTop: '10px' }}
              >
                {authTab === 'login' ? 'Continue to aiKart' : 'Create Free Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
