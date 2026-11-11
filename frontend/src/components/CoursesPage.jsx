import React from 'react';
import CoursesGrid from './CoursesGrid';
import { OrnamentalFlourish } from './TempleHarmonyRedesign';

export default function CoursesPage({ onSelectCourse }) {
  return (
    <div className="courses-page-wrap" style={{ paddingTop: '110px', minHeight: 'calc(100vh / var(--page-zoom, 1))', background: '#faf5ee' }}>
      <div className="hm-container">
        <div className="th-section-header" style={{ marginBottom: '12px' }}>
          <p className="th-eyebrow">OUR SACRED COURSES &amp; TRAINING</p>
          <h1 className="th-heading-gradient">SACRED DISCIPLINES</h1>
          <OrnamentalFlourish />
        </div>
      </div>

      {/* Full courses grid */}
      <CoursesGrid onSelectCourse={onSelectCourse} showAll={true} />
    </div>
  );
}
