import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, ArrowLeft, Check,
  PersonStanding, Flower2, Heart, Leaf, Brain, Target, Moon, Users, Sun, Home, Building2,
  TrendingUp, Coins, Compass, Atom, Mountain, Droplet, Flame, Wind, Orbit, Briefcase, Shield,
  Sparkles, TreeDeciduous, CircleDot, Gem, Search, Activity, Radio, Star, Hand, Triangle, Hash,
  Lightbulb, Scale, HandHeart, Layers, Palette
} from 'lucide-react';
import { COURSES_15 } from './CoursesGrid';
import { COURSE_DETAILS } from '../data/courseDetails';
import './CourseDetailPage.css';

// Icon names used in courseDetails.js → components
const ICONS = {
  PersonStanding, Flower2, Heart, Leaf, Brain, Target, Moon, Users, Sun, Home, Building2,
  TrendingUp, Coins, Compass, Atom, Mountain, Droplet, Flame, Wind, Orbit, Briefcase, Shield,
  Sparkles, TreeDeciduous, CircleDot, Gem, Search, Activity, Radio, Star, Hand, Triangle, Hash,
  Lightbulb, Scale, HandHeart, Layers, Palette
};

function Icon({ name, size = 24, strokeWidth = 1.6 }) {
  const Cmp = ICONS[name] || Flower2;
  return <Cmp size={size} strokeWidth={strokeWidth} />;
}

function SectionHeading({ title, subtitle }) {
  return (
    <div className="cd-center">
      <h2 className="cd-h2">{title}</h2>
      {subtitle && <p className="cd-sub">{subtitle}</p>}
    </div>
  );
}

/* Fade/slide sections in as they scroll into view */
function useReveal(deps) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll('.cd-reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

/* ── Column renderer for `columns` blocks ── */
function Column({ col }) {
  return (
    <div className="cd-col">
      {col.title && (
        <div className="cd-col-title">
          <h3 className="cd-h3">{col.title}</h3>
        </div>
      )}
      {col.subtitle && <p className="cd-sub">{col.subtitle}</p>}
      {col.paragraphs?.map((p, i) => <p key={i} className="cd-p">{p}</p>)}

      {col.checklist && (
        <ul className="cd-checklist">
          {col.checklist.map((t) => (
            <li key={t}><span className="cd-check"><Check size={13} strokeWidth={3} /></span>{t}</li>
          ))}
        </ul>
      )}

      {col.numbered && (
        <ol className={`cd-numbered${col.numberedTwoCol ? ' two-col' : ''}`}>
          {col.numbered.map((t, i) => (
            <li key={t}><span className="cd-num">{i + 1}</span>{t}</li>
          ))}
        </ol>
      )}

      {col.tools && (
        <div className="cd-tools">
          {col.tools.map((t) => (
            <div key={t.label} className="cd-tool">
              <div className="cd-icon-circle"><Icon name={t.icon} size={28} /></div>
              {t.label}
            </div>
          ))}
        </div>
      )}

      {col.mukhis && (
        <div className="cd-mukhis">
          {col.mukhis.map((m) => (
            <div key={m} className="cd-mukhi"><div className="cd-bead" />{m}</div>
          ))}
        </div>
      )}

      {col.card && (
        <div className="cd-card">
          <div className="cd-bead-pair"><div className="cd-bead" /><div className="cd-bead" /></div>
          <div>
            <h4>{col.card.title}</h4>
            <p>{col.card.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ExtraBlock({ block }) {
  switch (block.type) {
    case 'columns':
      return (
        <section className="cd-section cd-reveal">
          <div className="cd-container">
            {block.heading && <SectionHeading title={block.heading} />}
            <div className="cd-cols">
              {block.columns.map((c, i) => <Column key={i} col={c} />)}
            </div>
          </div>
        </section>
      );
    case 'elements':
      return (
        <section className="cd-section cd-reveal">
          <div className="cd-container">
            <SectionHeading title={block.title} subtitle={block.subtitle} />
            <div className="cd-elements">
              {block.items.map((el) => (
                <div key={el.name} className="cd-element">
                  <div className="cd-icon-circle"><Icon name={el.icon} size={30} /></div>
                  <strong>{el.name}</strong>
                  <span>{el.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'steps':
      return (
        <section className="cd-section cd-reveal">
          <div className="cd-container">
            <SectionHeading title={block.title} subtitle={block.subtitle} />
            <div className="cd-steps">
              {block.items.map((s, i) => (
                <div key={s.title} className="cd-step">
                  <div className="cd-step-num">{i + 1}</div>
                  <div>
                    <h4>{s.title}{s.icon && <Icon name={s.icon} size={22} />}</h4>
                    <p>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'paragraphs':
      return (
        <section className="cd-section cd-reveal">
          <div className="cd-container">
            <SectionHeading title={block.title} />
            {block.paragraphs.map((p, i) => <p key={i} className="cd-p" style={{ fontSize: '15.5px' }}>{p}</p>)}
          </div>
        </section>
      );
    default:
      return null;
  }
}

export default function CourseDetailPage({ courseId, onBack, onEnroll, onContact }) {
  const data = COURSE_DETAILS[courseId];
  const course = COURSES_15.find((c) => c.id === courseId);
  const ref = useReveal([courseId]);
  const actionsRef = useRef(null);
  const [actionsWidth, setActionsWidth] = useState(null);

  useEffect(() => {
    if (data) document.title = `${data.title} Course | Reiki & Vaastu World`;
  }, [data]);

  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;

    const measure = () => {
      if (el) {
        const w = el.offsetWidth;
        if (w > 0) setActionsWidth(w);
      }
    };

    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(el);
    }
    window.addEventListener('resize', measure);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [courseId, data?.title]);

  if (!data) return null;

  const enroll = () => onEnroll && onEnroll(data.title);
  const contact = () => {
    const el = document.getElementById('footer-contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onContact) {
      onContact(data.title);
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="cd-page" ref={ref}>
      {/* ═════ HERO ═════ */}
      <section className="cd-hero">
        <div className="cd-container cd-hero-grid">
          <div className="cd-hero-text" style={actionsWidth ? { '--hero-actions-w': `${actionsWidth}px` } : undefined}>
            <button type="button" className="cd-back" onClick={onBack} id="course-detail-back">
              <ArrowLeft size={15} /> All Courses
            </button>
            <p className="cd-eyebrow" style={{ marginTop: '22px' }}>
              {data.eyebrow.map((w) => <span key={w}>{w}</span>)}
            </p>
            <h1
              className="cd-hero-title"
              style={{
                maxWidth: actionsWidth ? `${actionsWidth}px` : undefined,
                ...(actionsWidth && data.title.length > 11
                  ? { fontSize: `clamp(26px, ${Math.min(46, Math.floor(actionsWidth / (data.title.length * 0.66)))}px, 48px)` }
                  : {})
              }}
            >
              {data.title}
            </h1>
            <p className="cd-hero-tagline" style={{ maxWidth: actionsWidth ? `${actionsWidth}px` : undefined }}>{data.tagline}</p>
            <p className="cd-hero-intro" style={{ maxWidth: actionsWidth ? `${actionsWidth}px` : undefined }}>{data.intro}</p>
            <div className="cd-hero-actions" ref={actionsRef}>
              <button type="button" className="cd-btn cd-btn-primary" onClick={enroll} id="course-detail-enroll">
                Enroll in {data.title} Course <ArrowRight size={17} />
              </button>
              <button type="button" className="cd-btn cd-btn-outline" onClick={contact} id="course-detail-contact">
                Contact Us
              </button>
            </div>
          </div>
          {course?.image && (
            <div className="cd-hero-media">
              <img src={course.image} alt={`${data.title} course`} />
            </div>
          )}
        </div>
        <div className="cd-hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cdGold" x1="0" x2="1">
                <stop offset="0" stopColor="#e9c27a" />
                <stop offset="0.5" stopColor="#c99a3c" />
                <stop offset="1" stopColor="#f0d394" />
              </linearGradient>
            </defs>
            <path d="M0,40 C360,90 720,0 1080,30 C1260,45 1380,60 1440,50 L1440,80 L0,80 Z" fill="#fdf8f1" />
            <path d="M0,40 C360,90 720,0 1080,30 C1260,45 1380,60 1440,50" fill="none" stroke="url(#cdGold)" strokeWidth="3" />
          </svg>
        </div>
      </section>

      {/* ═════ WHAT IS ═════ */}
      <section className="cd-what cd-reveal">
        <div className="cd-container cd-what-grid">
          <div className="cd-medallion"><Icon name={data.what.icon} size={84} strokeWidth={1.1} /></div>
          <div>
            <h2 className="cd-h2">{data.what.title}</h2>
            <p className="cd-p">{data.what.text}</p>
          </div>
        </div>
      </section>

      {/* ═════ HOW CAN I USE ═════ */}
      <section className="cd-use cd-reveal">
        <div className="cd-container cd-use-grid">
          <div>
            <h2 className="cd-h2">{data.use.title}</h2>
            <p className="cd-p">{data.use.text}</p>
          </div>
          <div className="cd-use-items">
            {data.use.items.map((it) => (
              <div key={it.label} className="cd-use-item">
                <div className="cd-icon-circle"><Icon name={it.icon} size={26} /></div>
                {it.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════ PHILOSOPHY BAND ═════ */}
      {data.philosophy && (
        <section className="cd-phil">
          <div className="cd-phil-deco left"><Flower2 size={170} strokeWidth={0.6} /></div>
          <div className="cd-phil-deco right"><Icon name={data.what.icon} size={130} strokeWidth={0.7} /></div>
          <div className="cd-phil-inner">
            <h2>{data.philosophy.title}</h2>
            <p>{data.philosophy.text}</p>
          </div>
        </section>
      )}

      {/* ═════ BENEFITS ═════ */}
      {data.benefits && (
        <section className="cd-section cd-reveal">
          <div className="cd-container">
            <SectionHeading title={data.benefits.title} subtitle={data.benefits.subtitle} />
            <div className="cd-benefits">
              {data.benefits.items.map((b) => (
                <div key={b.label} className="cd-benefit">
                  <div className="cd-icon-circle"><Icon name={b.icon} size={22} /></div>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═════ COURSE-SPECIFIC BLOCKS ═════ */}
      {data.extras?.map((block, i) => <ExtraBlock key={i} block={block} />)}

      {/* ═════ JOURNEY CTA ═════ */}
      {data.journey.rainbow ? (
        <div className="cd-container">
          <div className="cd-rainbow cd-reveal">
            <div className="cd-rainbow-text">
              <h2 className="cd-h2">{data.journey.title}</h2>
              <p className="cd-p">{data.journey.text}</p>
            </div>
            <div className="cd-rainbow-bars" aria-hidden="true">
              {['#ef4444', '#f97316', '#facc15', '#4ade80', '#38bdf8', '#6366f1', '#c084fc'].map((c) => (
                <span key={c} style={{ background: `linear-gradient(180deg, ${c} 0%, ${c}99 100%)` }} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <section className="cd-journey">
          <div className="cd-container cd-journey-grid">
            <div className="cd-journey-text">
              <h2>{data.journey.title}</h2>
              <p>{data.journey.text}</p>
            </div>
            <div className="cd-journey-actions">
              <button type="button" className="cd-btn cd-btn-gold" onClick={enroll}>
                Explore {data.title} Course <ArrowRight size={17} />
              </button>
              <button type="button" className="cd-btn cd-btn-ghost" onClick={contact}>Contact Us</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
