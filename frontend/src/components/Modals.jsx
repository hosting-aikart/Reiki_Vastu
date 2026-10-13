import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, Send, Sparkles, CheckCircle2, ShieldCheck, Play, Compass, Phone, Star, ChevronDown, Check } from 'lucide-react';

const CONSULTATION_SERVICES = [
  'Residential Home Vaastu Audit',
  'Commercial / Factory Vaastu Audit',
  'Vedic Astrology & Kundali Analysis',
  'Reiki Master Course Attunement',
  'Tibetan Lama-Fera Cleansing Session',
  'Chaldean Numerology & Name Correction',
  'Scientific Acupressure Pain Relief'
];

const MEETING_MODES = [
  'In-Person (Amravati Center)',
  'In-Person (Nagpur Center)',
  'Online Video Call (Zoom / Meet)'
];

const TIME_SLOTS = [
  '10:00 AM (Morning)',
  '12:30 PM (Afternoon)',
  '04:30 PM (Evening)',
  '06:30 PM (Late Evening)'
];

const STORY_SERVICES = [
  'Reiki Healing Session',
  'Residential Vaastu Audit',
  'Commercial Vaastu Audit',
  'Kundali & Astrology Reading',
  'Lama-Fera Cleansing',
  'Reiki Level 1 & 2 Course'
];

const RATING_OPTIONS = [
  { value: 5, label: '★★★★★ (5/5 Outstanding)' },
  { value: 4, label: '★★★★☆ (4/5 Very Good)' },
  { value: 3, label: '★★★☆☆ (3/5 Good)' }
];

function CustomDropdown({ value, onChange, options, placeholder = 'Select an option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => (typeof o === 'object' ? o.value === value : o === value));
  const displayLabel = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Box - clean form element, NO golden border */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '38px',
          padding: '0 12px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          background: '#ffffff',
          fontSize: '13px',
          color: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          outline: 'none',
          boxSizing: 'border-box',
          textAlign: 'left'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#D2042D';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px' }}>
          {displayLabel}
        </span>
        <ChevronDown
          size={14}
          color="#666666"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '6px' }}
        />
      </button>

      {/* Dropdown Menu - Styled with GOLDEN BORDER as requested! */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 9999,
            background: '#ffffff',
            border: '1.5px solid #d4af37',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(74, 14, 23, 0.15)',
            maxHeight: '210px',
            overflowY: 'auto',
            padding: '4px',
            animation: 'modalSlideUp 0.15s ease'
          }}
        >
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            const isSelected = val === value;

            return (
              <div
                key={String(val)}
                onClick={() => {
                  onChange(val);
                  setIsOpen(false);
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#ffffff' : '#1a1a1a',
                  background: isSelected ? 'linear-gradient(135deg, #D2042D 0%, #8b0000 100%)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = '#fef2f4';
                    e.currentTarget.style.color = '#D2042D';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#1a1a1a';
                  }
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lbl}</span>
                {isSelected && <Check size={13} color="#ffffff" style={{ flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
  const [storyForm, setStoryForm] = useState({
    name: '',
    city: '',
    service: 'Reiki Healing Session',
    story: '',
    rating: 5
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

  const handleStorySubmit = (e) => {
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
                    <CustomDropdown
                      value={contactForm.center}
                      onChange={(val) => setContactForm({ ...contactForm, center: val })}
                      options={['Amravati Center (Walcut Compound)', 'Nagpur Center (Mahal)', 'Online Video Consultation']}
                    />
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
          <div style={{ padding: '24px 28px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#D2042D',
                background: '#fef2f2',
                padding: '3px 10px',
                borderRadius: '50px'
              }}
            >
              1-ON-1 HOLISTIC SESSION
            </span>
            <h2 className="ff-redhat" style={{ fontSize: '20px', fontWeight: 800, margin: '6px 0 3px', color: '#1a1a1a' }}>
              Book Personal Consultation
            </h2>
            <p style={{ color: '#6b7280', fontSize: '12.5px', margin: '0 0 16px', lineHeight: 1.4 }}>
              Choose your consultation service and preferred timing with Dr. Naresh Chhabdiya.
            </p>

            {submittedStatus ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={42} color="#16a34a" style={{ margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>
                  Consultation Slot Requested!
                </h3>
                <p style={{ color: '#4b5563', fontSize: '13px', margin: 0 }}>
                  We have registered your appointment for <strong>{meetingForm.date || 'upcoming date'} at {meetingForm.time}</strong>. Dr. Naresh's coordinator will confirm your slot via call or WhatsApp at {meetingForm.phone}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMeetingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Row 1: Name & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mayur Wankhade"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        background: '#ffffff',
                        fontSize: '13px',
                        color: '#1a1a1a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      value={meetingForm.name}
                      onChange={(e) => setMeetingForm({ ...meetingForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9823456789"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        background: '#ffffff',
                        fontSize: '13px',
                        color: '#1a1a1a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      value={meetingForm.phone}
                      onChange={(e) => setMeetingForm({ ...meetingForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 2: Email & Service */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        background: '#ffffff',
                        fontSize: '13px',
                        color: '#1a1a1a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      value={meetingForm.email}
                      onChange={(e) => setMeetingForm({ ...meetingForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Consultation Service *
                    </label>
                    <CustomDropdown
                      value={meetingForm.consultationType}
                      onChange={(val) => setMeetingForm({ ...meetingForm, consultationType: val })}
                      options={CONSULTATION_SERVICES}
                    />
                  </div>
                </div>

                {/* Row 3: Mode, Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Meeting Mode *
                    </label>
                    <CustomDropdown
                      value={meetingForm.mode}
                      onChange={(val) => setMeetingForm({ ...meetingForm, mode: val })}
                      options={MEETING_MODES}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        background: '#ffffff',
                        fontSize: '13px',
                        color: '#1a1a1a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 4: Time Slot */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    Preferred Time Slot *
                  </label>
                  <CustomDropdown
                    value={meetingForm.time}
                    onChange={(val) => setMeetingForm({ ...meetingForm, time: val })}
                    options={TIME_SLOTS}
                  />
                </div>

                {/* Center-aligned Confirm Booking button matching other buttons in the site */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 28px',
                      height: '42px',
                      borderRadius: '50px',
                      border: '1.5px solid rgba(212, 175, 55, 0.45)',
                      background: 'linear-gradient(135deg, #D2042D 0%, #8b0000 100%)',
                      color: '#ffffff',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <Calendar size={15} /> Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ─── ADD YOUR STORY MODAL ─── */}
        {activeModal === 'addStory' && (
          <div style={{ padding: '24px 28px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#D2042D',
                background: '#fef2f2',
                padding: '3px 10px',
                borderRadius: '50px'
              }}
            >
              COMMUNITY EXPERIENCE
            </span>
            <h2 className="ff-redhat" style={{ fontSize: '20px', fontWeight: 800, margin: '6px 0 3px', color: '#1a1a1a' }}>
              Share Your Transformation Story
            </h2>
            <p style={{ color: '#6b7280', fontSize: '12.5px', margin: '0 0 16px', lineHeight: 1.4 }}>
              Inspire other seekers on their path to health, mental peace, and spiritual harmony.
            </p>

            {submittedStatus ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={42} color="#16a34a" style={{ margin: '0 auto 10px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>
                  Thank You for Sharing!
                </h3>
                <p style={{ color: '#4b5563', fontSize: '13px', margin: 0 }}>
                  Your story has been submitted and will be featured after our team verifies it.
                </p>
              </div>
            ) : (
              <form onSubmit={handleStorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anjali Sharma"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        background: '#ffffff',
                        fontSize: '13px',
                        color: '#1a1a1a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      value={storyForm.name}
                      onChange={(e) => setStoryForm({ ...storyForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      City / Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune / Nagpur"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        background: '#ffffff',
                        fontSize: '13px',
                        color: '#1a1a1a',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      value={storyForm.city}
                      onChange={(e) => setStoryForm({ ...storyForm, city: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Experience / Course *
                    </label>
                    <CustomDropdown
                      value={storyForm.service}
                      onChange={(val) => setStoryForm({ ...storyForm, service: val })}
                      options={STORY_SERVICES}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Rating
                    </label>
                    <CustomDropdown
                      value={storyForm.rating}
                      onChange={(val) => setStoryForm({ ...storyForm, rating: Number(val) })}
                      options={RATING_OPTIONS}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    Your Experience / Story *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share how Dr. Naresh's guidance or Reiki therapy helped you..."
                    style={{
                      width: '100%',
                      height: '75px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      background: '#ffffff',
                      fontSize: '13px',
                      color: '#1a1a1a',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    value={storyForm.story}
                    onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                  <button
                    type="submit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px 28px',
                      height: '42px',
                      borderRadius: '50px',
                      border: '1.5px solid rgba(212, 175, 55, 0.45)',
                      background: 'linear-gradient(135deg, #D2042D 0%, #8b0000 100%)',
                      color: '#ffffff',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <Send size={15} /> Submit Story
                  </button>
                </div>
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
                  background: authTab === 'login' ? 'linear-gradient(135deg, #D2042D 0%, #8b0000 100%)' : 'transparent',
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
                  background: authTab === 'signup' ? 'linear-gradient(135deg, #D2042D 0%, #8b0000 100%)' : 'transparent',
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
