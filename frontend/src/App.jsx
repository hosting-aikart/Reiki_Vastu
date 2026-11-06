import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutAndFeatures from './components/AboutAndFeatures';
import OurFeatures from './components/OurFeatures';
import BusinessNeeds from './components/BusinessNeeds';
import ReikiTherapy from './components/ReikiTherapy';
import VideoTestimonials from './components/VideoTestimonials';
import CoursesPage from './components/CoursesPage';
import CourseDetailPage from './components/CourseDetailPage';
import TempleHarmonyRedesign from './components/TempleHarmonyRedesign';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import Modals from './components/Modals';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/redesign')) return 'redesign';
    return 'home';
  });
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [previousView, setPreviousView] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setCurrentView('admin');
      } else if (path.startsWith('/redesign')) {
        setCurrentView('redesign');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onExitToSite={() => {
          window.history.pushState({}, '', '/');
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  const openModal = (modalType, data = null) => {
    setActiveModal(modalType);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const handleSelectCourse = (courseId) => {
    setPreviousView(currentView === 'course-detail' ? 'courses' : currentView);
    setSelectedCourseId(courseId);
    setCurrentView('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSeeAllCourses = () => {
    setCurrentView('courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    const target = window.location.pathname.startsWith('/redesign') ? 'redesign' : 'home';
    setCurrentView(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromCourseDetail = () => {
    if (previousView === 'redesign') {
      setCurrentView('redesign');
    } else if (previousView === 'home') {
      setCurrentView('home');
    } else {
      setCurrentView('courses');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchPreviewMode = (mode) => {
    const nextPath = mode === 'redesign' ? '/redesign' : '/';
    window.history.pushState({}, '', nextPath);
    setCurrentView(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRedesign = currentView === 'redesign';

  return (
    <div
      className={isRedesign ? 'th-theme-active' : ''}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: isRedesign ? '#faf5ee' : '#fdfbf7'
      }}
    >
      {/* Floating Pill Navbar */}
      <Navbar
        currentView={currentView === 'redesign' ? 'home' : currentView}
        setCurrentView={(view) => {
          if (view === 'home' && window.location.pathname.startsWith('/redesign')) {
            setCurrentView('redesign');
          } else {
            setCurrentView(view);
          }
        }}
        openModal={openModal}
      />

      {/* Main Content Pages */}
      <main style={{ flex: 1 }}>
        {currentView === 'course-detail' && selectedCourseId ? (
          /* ── Dedicated Single Course Detail Page ── */
          <CourseDetailPage
            courseId={selectedCourseId}
            onBack={handleBackFromCourseDetail}
            onEnroll={(title) => {
              openModal('meeting', { kind: 'course', courseId: selectedCourseId, title });
            }}
            onContact={(title) => {
              openModal('meeting', { kind: 'course', courseId: selectedCourseId, title });
            }}
          />
        ) : currentView === 'courses' ? (
          /* ── Dedicated Courses Page ── */
          <CoursesPage
            onSelectCourse={handleSelectCourse}
            onBack={handleBackToHome}
          />
        ) : currentView === 'redesign' ? (
          /* ── Option A: /redesign Preview Route (Cormorant Garamond + Karla Temple Harmony) ── */
          <TempleHarmonyRedesign
            onConsultClick={() => openModal('meeting')}
            onExploreCourses={handleSeeAllCourses}
            onSelectCourse={handleSelectCourse}
            onSeeAllCourses={handleSeeAllCourses}
            onBookSession={() => openModal('meeting', { serviceKey: 'reiki_healing_session' })}
            onAddStory={() => openModal('addStory')}
          />
        ) : (
          /* ── Original Home Page ── */
          <>
            {/* 1. Hero */}
            <Hero
              onSearch={() => {
                const el = document.getElementById('courses-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onConsultClick={() => openModal('meeting')}
              onExploreCourses={() => {
                setCurrentView('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 2. About Dr. Naresh + Courses Preview */}
            <AboutAndFeatures
              onConsultClick={() => openModal('meeting')}
              onSelectCourse={handleSelectCourse}
              onSeeAllCourses={handleSeeAllCourses}
            />

            {/* 3. OUR FEATURES */}
            <OurFeatures />

            {/* 4. Our Products (4 cards) */}
            <BusinessNeeds />

            {/* 5. Reiki Therapy Section */}
            <ReikiTherapy onBookSession={() => openModal('meeting', { serviceKey: 'reiki_healing_session' })} />

            {/* 6. Testimonials */}
            <VideoTestimonials onAddStory={() => openModal('addStory')} />
          </>
        )}
      </main>

      {/* Footer - hidden on course details page */}
      {currentView !== 'course-detail' && (
        <Footer
          setCurrentView={(view) => {
            if (view === 'home' && window.location.pathname.startsWith('/redesign')) {
              setCurrentView('redesign');
            } else {
              setCurrentView(view);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          openModal={openModal}
        />
      )}

      {/* Temporary Floating Design Comparison Pill (/ vs /redesign) */}
      {(currentView === 'home' || currentView === 'redesign') && (
        <div className="th-preview-switcher" role="region" aria-label="Design comparison preview switcher">
          <span className="th-preview-label">Preview:</span>
          <button
            type="button"
            onClick={() => switchPreviewMode('home')}
            className={`th-preview-pill ${!isRedesign ? 'th-preview-pill--active' : ''}`}
          >
            Original (/)
          </button>
          <button
            type="button"
            onClick={() => switchPreviewMode('redesign')}
            className={`th-preview-pill ${isRedesign ? 'th-preview-pill--active' : ''}`}
          >
            Temple Harmony (/redesign)
          </button>
        </div>
      )}

      {/* Floating Spiritual Councillor Widget */}
      <FloatingWidgets openModal={openModal} />

      {/* Universal Modals Manager */}
      <Modals
        activeModal={activeModal}
        modalData={modalData}
        closeModal={closeModal}
      />
    </div>
  );
}
