import React from 'react';
import { ArrowLeft, Mail, MapPin, Phone, User } from 'lucide-react';
import { BUSINESS, CONTACT_PAGE, GRIEVANCE_TEXT, POLICIES, POLICY_LINKS, POLICY_TERMS } from '../data/policies';

const colors = { ink: '#3b0a11', body: '#4a2a30', muted: '#7a5a60', red: '#D2042D', card: '#ffffff', line: '#ecdccb' };

const cardStyle = {
  background: colors.card,
  border: `1px solid ${colors.line}`,
  borderRadius: '18px',
  padding: 'clamp(20px, 4vw, 36px)',
  boxShadow: '0 6px 24px rgba(59, 10, 17, 0.06)'
};

const sectionHeadingStyle = { fontSize: '18px', fontWeight: 800, color: colors.ink, margin: '28px 0 10px' };
const textStyle = { fontSize: '15px', lineHeight: 1.75, color: colors.body, margin: '0 0 10px' };

/** A real link (so the URL works when opened directly) that switches pages without a reload. */
function PolicyLink({ slug, label, active, onNavigate }) {
  return (
    <a
      href={`/${slug}`}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(slug);
      }}
      aria-current={active ? 'page' : undefined}
      style={{
        fontSize: '13px',
        fontWeight: 700,
        padding: '7px 14px',
        borderRadius: '999px',
        textDecoration: 'none',
        border: `1px solid ${active ? colors.red : colors.line}`,
        background: active ? colors.red : '#fff',
        color: active ? '#fff' : colors.ink,
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </a>
  );
}

function ContactDetails() {
  const rowStyle = { display: 'flex', gap: '12px', alignItems: 'flex-start', ...textStyle, margin: '0 0 14px' };
  const iconStyle = { flexShrink: 0, marginTop: '4px', color: colors.red };
  return (
    <>
      <p style={textStyle}>
        We are happy to help with orders, deliveries, refunds, courses and consultations. Reach us by phone, WhatsApp or
        email, or visit one of our centres.
      </p>

      <h2 style={sectionHeadingStyle}>Business details</h2>
      <div style={rowStyle}>
        <User size={18} style={iconStyle} />
        <span>
          <strong>{BUSINESS.brand}</strong>
          <br />
          Owned and operated by {BUSINESS.owner}
          <br />
          Founded by {BUSINESS.founder}
        </span>
      </div>
      <div style={rowStyle}>
        <MapPin size={18} style={iconStyle} />
        <span>
          <strong>Registered address</strong>
          <br />
          {BUSINESS.registeredAddress}
        </span>
      </div>

      <h2 style={sectionHeadingStyle}>Phone &amp; email</h2>
      <div style={rowStyle}>
        <Phone size={18} style={iconStyle} />
        <span>
          {BUSINESS.phones.map((p, i) => (
            <React.Fragment key={p}>
              {i > 0 && ' / '}
              <a href={`tel:+91${p}`} style={{ color: colors.red, fontWeight: 700 }}>
                +91 {p}
              </a>
            </React.Fragment>
          ))}
          <br />
          <span style={{ color: colors.muted, fontSize: '14px' }}>Calls and WhatsApp</span>
        </span>
      </div>
      <div style={rowStyle}>
        <Mail size={18} style={iconStyle} />
        <a href={`mailto:${BUSINESS.email}`} style={{ color: colors.red, fontWeight: 700 }}>
          {BUSINESS.email}
        </a>
      </div>

      <h2 style={sectionHeadingStyle}>Our centres</h2>
      {BUSINESS.centers.map((c) => (
        <div key={c.name} style={rowStyle}>
          <MapPin size={18} style={iconStyle} />
          <span>
            <strong>{c.name}</strong>
            <br />
            {c.address}
          </span>
        </div>
      ))}

      <h2 style={sectionHeadingStyle}>Order help</h2>
      <p style={textStyle}>
        For an existing order, please mention your order reference (it starts with “RVP-”). We usually reply within one
        business day.
      </p>

      <h2 style={sectionHeadingStyle}>Grievance Officer</h2>
      <div style={rowStyle}>
        <User size={18} style={iconStyle} />
        <span>
          <strong>{BUSINESS.grievanceOfficer}</strong>
          <br />
          {BUSINESS.brand}
        </span>
      </div>
      <p style={textStyle}>{GRIEVANCE_TEXT}</p>
    </>
  );
}

export default function PolicyPage({ slug, onNavigate, onBack }) {
  const policy = POLICIES.find((p) => p.slug === slug);
  const isContact = slug === CONTACT_PAGE.slug;
  const title = isContact ? CONTACT_PAGE.title : policy?.title;

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '70px', minHeight: '100vh', background: '#faf5ee' }}>
      <div className="hm-container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            padding: 0,
            color: colors.red,
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} /> Back to home
        </button>

        <nav aria-label="Policies" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '18px 0 22px' }}>
          {POLICY_LINKS.map((l) => (
            <PolicyLink key={l.slug} {...l} active={l.slug === slug} onNavigate={onNavigate} />
          ))}
        </nav>

        <article style={cardStyle}>
          <h1 className="ff-redhat" style={{ fontSize: 'clamp(26px, 3.4vw, 36px)', fontWeight: 800, color: colors.ink, margin: '0 0 6px' }}>
            {title}
          </h1>
          {!isContact && (
            <p style={{ fontSize: '13px', color: colors.muted, margin: '0 0 20px' }}>Last updated: {POLICY_TERMS.lastUpdated}</p>
          )}

          {isContact ? (
            <ContactDetails />
          ) : (
            <>
              <p style={textStyle}>{policy.intro}</p>
              {policy.sections.map((s) => (
                <section key={s.heading}>
                  <h2 style={sectionHeadingStyle}>{s.heading}</h2>
                  {s.paragraphs?.map((t) => (
                    <p key={t} style={textStyle}>
                      {t}
                    </p>
                  ))}
                  {s.list && (
                    <ul style={{ ...textStyle, paddingLeft: '22px' }}>
                      {s.list.map((t) => (
                        <li key={t} style={{ marginBottom: '6px' }}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.note && <p style={textStyle}>{s.note}</p>}
                </section>
              ))}
            </>
          )}

          <p style={{ ...textStyle, marginTop: '28px', paddingTop: '18px', borderTop: `1px solid ${colors.line}`, fontSize: '14px' }}>
            {BUSINESS.brand} · {BUSINESS.registeredAddress} · {BUSINESS.phones.map((p) => `+91 ${p}`).join(' / ')} ·{' '}
            <a href={`mailto:${BUSINESS.email}`} style={{ color: colors.red }}>
              {BUSINESS.email}
            </a>
          </p>
        </article>
      </div>
    </div>
  );
}
