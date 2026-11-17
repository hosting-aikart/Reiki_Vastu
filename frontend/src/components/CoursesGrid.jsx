import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCatalog } from '../catalog/CatalogContext';
import { iconFor } from '../catalog/icons';

// Course list: built-in courses (src/data/courses.js) plus any added in the
// admin panel, from the catalog. The home page shows the first 4 in its count.
const HOME_COURSE_COUNT = 4;

function CourseCard({ course, onSelectCourse, isSlider = false, showDescription = false }) {
  const Icon = iconFor(course.icon);
  return (
    <article
      onClick={() => onSelectCourse && onSelectCourse(course.id, course.title)}
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid rgba(212, 175, 55, 0.4)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(180, 83, 9, 0.06)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`hover:-translate-y-1.5 hover:shadow-lg ${isSlider ? 'course-card-slider-item' : ''}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#D2042D';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(210, 4, 45, 0.18)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(180, 83, 9, 0.06)';
      }}
    >
      {/* Card Top: Image Area */}
      <div
        style={{
          aspectRatio: '4 / 3',
          width: '100%',
          background: course.imageBg || 'linear-gradient(135deg, #fef8f0 0%, #faf1e2 100%)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {course.image ? (
          <img
            src={course.image}
            alt={course.alt || `${course.title} course – ${course.subtitle}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: course.imageFit || 'cover',
              objectPosition: course.imagePosition || 'center center',
              display: 'block',
              transition: 'transform 0.5s ease'
            }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #fdfbf7 0%, #faf3e8 100%)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '12px', color: '#b45309', fontWeight: 650, letterSpacing: '0.06em', opacity: 0.5 }}>
              [ Vacant Space ]
            </span>
          </div>
        )}
      </div>

      {/* Card Bottom: Content Area */}
      <div
        style={{
          padding: showDescription ? '16px 18px 18px' : '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: '10px',
          background: '#ffffff'
        }}
      >
        <div
          className="th-course-body"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: 0
          }}
        >
          <div
            className="th-course-icon"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#fef2f4',
              border: '1px solid rgba(210, 4, 45, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#D2042D'
            }}
          >
            <Icon size={16} />
          </div>

          <div className="th-course-text" style={{ flex: 1, minWidth: 0 }}>
            <h4 className="th-course-title" style={{ margin: '0 0 2px', fontSize: showDescription ? '17.5px' : '16px', fontWeight: 750, color: '#3b0a11', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {course.title}
            </h4>
            <p className="th-course-sub" style={{ margin: 0, fontSize: showDescription ? '12.5px' : '11.5px', color: '#8c5360', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {course.subtitle}
            </p>
          </div>

          <div
            className="th-course-arrow"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '1px solid #d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#D2042D',
              transition: 'all 0.2s'
            }}
          >
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CoursesGrid({ onSelectCourse, onSeeAllCourses, showAll = false }) {
  const { courses: COURSES_15 } = useCatalog();
  return (
    <section id="courses-section" style={{ padding: showAll ? '24px 0 90px' : '70px 0 90px', background: '#faf5ee', overflow: 'hidden' }}>
      <div className="hm-container">
        {/* Section Header (home page only) */}
        {!showAll && (
          <div style={{ textAlign: 'center', marginBottom: '38px' }}>
            <p
              className="hm-eyebrow"
              style={{ color: '#D2042D', marginBottom: '6px', fontWeight: 850, letterSpacing: '0.14em' }}
            >
              OUR COURSES &amp; TRAINING
            </p>
            <h2
              className="ff-redhat"
              style={{ fontSize: 'clamp(31px, 3.74vw, 46px)', fontWeight: 750, color: '#3b0a11', margin: '0 0 10px' }}
            >
              Explore Our Certified Holistic Sciences
            </h2>
            <p style={{ color: '#784450', fontSize: '16.5px', maxWidth: '640px', margin: '0 auto' }}>
              Comprehensive courses with traditional master attunements, clinical practice, and lifetime free alumni access.
            </p>
          </div>
        )}

        {/* Courses Section: Continuous Horizontal Sliding on Home, Grid on ShowAll */}
        {!showAll ? (
          <div className="courses-marquee-wrapper">
            <div className="courses-marquee-track">
              {/* Group 1 */}
              <div className="courses-marquee-group">
                {COURSES_15.map((course) => (
                  <CourseCard
                    key={`group1-${course.id}`}
                    course={course}
                    onSelectCourse={onSelectCourse}
                    isSlider={true}
                  />
                ))}
              </div>

              {/* Group 2 (Duplicate for continuous seamless infinite loop) */}
              <div className="courses-marquee-group" aria-hidden="true">
                {COURSES_15.map((course) => (
                  <CourseCard
                    key={`group2-${course.id}`}
                    course={course}
                    onSelectCourse={onSelectCourse}
                    isSlider={true}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="courses-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))',
              gap: '24px'
            }}
          >
            {COURSES_15.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={onSelectCourse}
                showDescription={true}
              />
            ))}
          </div>
        )}

        {/* See All Courses Button (only on home page) */}
        {!showAll && (
          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <button
              type="button"
              onClick={onSeeAllCourses}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 36px',
                borderRadius: '50px',
                fontSize: '16.5px',
                letterSpacing: '0.02em'
              }}
            >
              <span>See All Courses</span>
              <ArrowRight size={18} />
            </button>
            <p style={{ color: '#8c5360', fontSize: '14.5px', marginTop: '12px' }}>
              +{COURSES_15.length - HOME_COURSE_COUNT} more disciplines awaiting you
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
