import React, { useState } from 'react';
import { X, Calendar, Send, Sparkles, CheckCircle2, ShieldCheck, Play, Compass, Phone, Star } from 'lucide-react';

export default function Modals({ activeModal, modalData, closeModal }) {
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', center: 'Amravati Center', message: '' });
  const [meetingForm, setMeetingForm] = useState({
    name: '',
    phone: '',
    email: '',
    consultationType: 'Residential Home Vaastu Audit',
    mode: 'In-Person (Amravati Center)',
    date: '',
    time: '10:00 AM',
    note: ''
  });
  const [sandboxPrompt, setSandboxPrompt] = useState('Experiencing financial stagnation and restless sleep in bedroom facing South-West');
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
    }, 2800);
  };

  const handleMeetingSubmit = (e) => {
    e.preventDefault();
    setSubmittedStatus(true);
    setTimeout(() => {
      setSubmittedStatus(false);
      closeModal();
    }, 2800);
  };

  const runSandboxTest = () => {
    setIsExecuting(true);
    setSandboxOutput('Scanning 5 Pancha Tattva cosmic elements (Fire, Earth, Space, Water, Air)...\nEvaluating 16 directional zones & subtle chakra frequencies...\n');
    setTimeout(() => {
      setSandboxOutput((prev) => prev + 'Checking planetary Gochara alignments & geopathic stress resonance...\nSynthesizing non-destructive Vedic & Reiki remedial blueprint...\n');
    }, 900);
    setTimeout(() => {
      setSandboxOutput(
        (prev) =>
          prev +
          `\n✦ [COSMIC ENERGY DIAGNOSIS COMPLETE]:\n` +
          `--------------------------------------------------\n` +
          `• Consultation Subject: "${sandboxPrompt || modalData?.title || 'General Holistic Energy Assessment'}"\n` +
          `• Primary Elemental Status: Earth & Fire Tattva Disbalance detected\n` +
          `• Subtle Body Frequency: 86.4% Harmony Potential\n` +
          `• Immediate Practical Remedies:\n` +
          `   1. Install consecrated Copper Pyramid wire strip in South-West zone (No demolition required).\n` +
          `   2. Wear authentic 7-Mukhi Nepali Rudraksha blessed with Goddess Mahalakshmi Beej mantra.\n` +
          `   3. Attend Dr. Naresh's Free Friday Meditation & Mindset Circle for deep chakra stabilization.\n` +
          `   4. Schedule personal 1-on-1 Janam Kundali verification for exact transit timing.\n` +
          `• Status: Verified Auspicious Guidance from Dr. Naresh Chhabdiya.`
      );
      setIsExecuting(false);
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* ─── CONTACT US MODAL ─── */}
        {activeModal === 'contact' && (
          <div style={{ padding: '36px', maxHeight: '85vh', overflowY: 'auto' }}>
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
              DIRECT HELPLINE
            </span>
            <h2 className="ff-redhat" style={{ fontSize: '26px', fontWeight: 700, margin: '14px 0 6px', color: '#3b0a11' }}>
              Contact Reiki &amp; Vaastu World
            </h2>
            <p style={{ color: '#784450', fontSize: '14px', margin: '0 0 20px' }}>
              Have questions regarding courses, Vaastu site audits, or energized products? Reach our Amravati and Nagpur centers.
            </p>

            {submittedStatus ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#3b0a11', margin: '0 0 6px' }}>
                  Query Dispatched!
                </h3>
                <p style={{ color: '#784450', fontSize: '14px', margin: 0 }}>
                  Thank you. Dr. Naresh Chhabdiya's team will contact you shortly via phone or WhatsApp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chetan Saraf"
                    className="akf-nl-input"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9423424596"
                      className="akf-nl-input"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                      Preferred Center *
                    </label>
                    <select
                      className="akf-nl-input"
                      value={contactForm.center}
                      onChange={(e) => setContactForm({ ...contactForm, center: e.target.value })}
                    >
                      <option>Amravati Center (Walcut Compound)</option>
                      <option>Nagpur Center (Mahal)</option>
                      <option>Online Video Consultation</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    className="akf-nl-input"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                    How can we guide you? *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your inquiry (e.g. learn Reiki level 1, home Vaastu inspection, buy certified Rudraksha)..."
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      border: '1.5px solid #d4af37',
                      background: '#fffdf9',
                      outline: 'none',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      color: '#3b0a11'
                    }}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '10px 14px', fontSize: '12.5px', color: '#881337' }}>
                  📞 Direct Center Hotline: <strong>8446656677 / 9423424596</strong> | Email: <strong>reki.vastuworld@gmail.com</strong>
                </div>

                <button
                  type="submit"
                  className="gnav-btn-primary"
                  style={{
                    padding: '14px',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '4px'
                  }}
                >
                  <Send size={16} /> Send Enquiry
                </button>
              </form>
            )}
          </div>
        )}

        {/* ─── SCHEDULE CONSULTATION MODAL ─── */}
        {(activeModal === 'schedule' || activeModal === 'meeting') && (
          <div style={{ padding: '36px', maxHeight: '85vh', overflowY: 'auto' }}>
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
              1-ON-1 HOLISTIC SESSION
            </span>
            <h2 className="ff-redhat" style={{ fontSize: '26px', fontWeight: 700, margin: '14px 0 6px', color: '#3b0a11' }}>
              Book Personal Consultation with Dr. Naresh
            </h2>
            <p style={{ color: '#784450', fontSize: '14px', margin: '0 0 20px' }}>
              Choose your consultation type and preferred timing. Available in Amravati, Nagpur, or online via live video.
            </p>

            {submittedStatus ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#3b0a11', margin: '0 0 6px' }}>
                  Consultation Slot Requested!
                </h3>
                <p style={{ color: '#784450', fontSize: '14px', margin: 0 }}>
                  We have registered your appointment for <strong>{meetingForm.date} at {meetingForm.time}</strong>. Dr. Naresh's coordinator will confirm your slot via call or WhatsApp at {meetingForm.phone}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMeetingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mayur Wankhade"
                    className="akf-nl-input"
                    value={meetingForm.name}
                    onChange={(e) => setMeetingForm({ ...meetingForm, name: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9823456789"
                      className="akf-nl-input"
                      value={meetingForm.phone}
                      onChange={(e) => setMeetingForm({ ...meetingForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      className="akf-nl-input"
                      value={meetingForm.email}
                      onChange={(e) => setMeetingForm({ ...meetingForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                      Consultation Service *
                    </label>
                    <select
                      className="akf-nl-input"
                      value={meetingForm.consultationType}
                      onChange={(e) => setMeetingForm({ ...meetingForm, consultationType: e.target.value })}
                    >
                      <option>Residential Home Vaastu Audit</option>
                      <option>Commercial / Factory Vaastu Audit</option>
                      <option>Vedic Astrology &amp; Kundali Analysis</option>
                      <option>Reiki Master Course Attunement</option>
                      <option>Tibetan Lama-Fera Cleansing Session</option>
                      <option>Chaldean Numerology &amp; Name Correction</option>
                      <option>Scientific Acupressure Pain Relief</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                      Meeting Mode *
                    </label>
                    <select
                      className="akf-nl-input"
                      value={meetingForm.mode}
                      onChange={(e) => setMeetingForm({ ...meetingForm, mode: e.target.value })}
                    >
                      <option>In-Person (Amravati Center)</option>
                      <option>In-Person (Nagpur Center)</option>
                      <option>Online Video Call (Zoom / Google Meet)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                      Preferred Date *
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
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                      Preferred Time Slot *
                    </label>
                    <select
                      className="akf-nl-input"
                      value={meetingForm.time}
                      onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })}
                    >
                      <option value="10:00 AM">10:00 AM (Morning)</option>
                      <option value="12:30 PM">12:30 PM (Afternoon)</option>
                      <option value="04:30 PM">04:30 PM (Evening)</option>
                      <option value="06:30 PM">06:30 PM (Late Evening)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="gnav-btn-primary"
                  style={{
                    padding: '14px',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '6px'
                  }}
                >
                  <Calendar size={16} /> Confirm Consultation Booking
                </button>
              </form>
            )}
          </div>
        )}

        {/* ─── LIVE ENERGY & VASTU SIMULATOR / SANDBOX MODAL ─── */}
        {activeModal === 'sandbox' && (
          <div style={{ padding: '32px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #fef2f2 0%, #fffbeb 100%)',
                  border: '1.5px solid #d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(220,38,38,0.15)'
                }}
              >
                <Compass size={24} color="#dc2626" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#3b0a11' }}>
                  {modalData?.title || 'Cosmic Energy & Vaastu Scanner'}
                </h3>
                <span style={{ fontSize: '12px', color: '#b45309', fontWeight: 600 }}>
                  Guided by Dr. Naresh Chhabdiya • 28+ Years Energy Expertise
                </span>
              </div>
            </div>

            <p style={{ color: '#5e2732', fontSize: '13.5px', lineHeight: 1.5, margin: '0 0 16px' }}>
              Simulate an energetic diagnosis of your space or subtle body. Enter your residential concern, home entrance direction, or health symptom below to receive immediate Vedic analysis and practical remedies.
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                Your Current Concern, Entrance Direction, or Goal:
              </label>
              <textarea
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid #d4af37',
                  background: '#fffdf9',
                  outline: 'none',
                  fontSize: '13.5px',
                  fontFamily: 'inherit',
                  color: '#3b0a11'
                }}
                placeholder="e.g. Kitchen in North-East direction, severe migraines and disturbed sleep, or interest in learning Reiki master level..."
                value={sandboxPrompt}
                onChange={(e) => setSandboxPrompt(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button
                type="button"
                className="gnav-btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13.5px',
                  padding: '10px 22px'
                }}
                disabled={isExecuting}
                onClick={runSandboxTest}
              >
                <Play size={14} /> {isExecuting ? 'Scanning Cosmic Alignment...' : 'Run Cosmic Diagnosis'}
              </button>
            </div>

            {/* Diagnostic Output Console */}
            <div
              style={{
                background: '#4a0e17',
                border: '1.5px solid #d4af37',
                borderRadius: '16px',
                padding: '18px',
                fontFamily: 'monospace',
                fontSize: '12.5px',
                color: '#fffdf9',
                minHeight: '140px',
                maxHeight: '220px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6
              }}
            >
              {sandboxOutput ||
                `✦ Awaiting input...\nPress "Run Cosmic Diagnosis" to evaluate the 5 Pancha Tattvas, chakra vibration, and non-destructive Vaastu remedies.`}
            </div>
          </div>
        )}

        {/* ─── AUTH / STUDENT PORTAL MODAL ─── */}
        {activeModal === 'auth' && (
          <div style={{ padding: '36px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#fffdf9', padding: '4px', borderRadius: '50px', border: '1.5px solid rgba(212,175,55,0.4)' }}>
              <button
                type="button"
                onClick={() => setAuthTab('login')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '50px',
                  border: 'none',
                  background: authTab === 'login' ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'transparent',
                  color: authTab === 'login' ? '#ffffff' : '#3b0a11',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Seeker Portal Login
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '50px',
                  border: 'none',
                  background: authTab === 'signup' ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'transparent',
                  color: authTab === 'signup' ? '#ffffff' : '#3b0a11',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Register as Student
              </button>
            </div>

            <h2 className="ff-redhat" style={{ fontSize: '24px', fontWeight: 700, color: '#3b0a11', margin: '0 0 6px' }}>
              {authTab === 'login' ? 'Welcome Back to Reiki & Vaastu World' : 'Join Our Sacred Learning Circle'}
            </h2>
            <p style={{ color: '#784450', fontSize: '13.5px', margin: '0 0 20px' }}>
              Access your certified course materials, attunement certificates, and weekly free meditation gatherings.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                closeModal();
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {authTab === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                    Full Name
                  </label>
                  <input type="text" required placeholder="Your Full Name" className="akf-nl-input" />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                  Registered Email / Mobile
                </label>
                <input type="text" required placeholder="name@email.com or 9823456789" className="akf-nl-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#3b0a11', marginBottom: '6px' }}>
                  Password
                </label>
                <input type="password" required placeholder="••••••••" className="akf-nl-input" />
              </div>

              <button
                type="submit"
                className="gnav-btn-primary"
                style={{ padding: '14px', fontSize: '14.5px', marginTop: '6px' }}
              >
                {authTab === 'login' ? 'Log In to Student Portal' : 'Create Free Account'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
