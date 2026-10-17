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
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import Modals from './components/Modals';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    return window.location.pathname.startsWith('/admin') ? 'admin' : 'home';
  });
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [previousView, setPreviousView] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin')) {
        setCurrentView('admin');
      } else if (currentView === 'admin') {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

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

  const handleSelectCourse = (courseId, courseTitle) => {
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
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromCourseDetail = () => {
    setCurrentView(previousView === 'home' ? 'home' : 'courses');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fdfbf7' }}>
      {/* Floating Pill Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
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
            onContact={() => {
              openModal('meeting', { kind: 'course', courseId: selectedCourseId, title });
            }}
          />
        ) : currentView === 'courses' ? (
          /* ── Dedicated Courses Page ── */
          <CoursesPage
            onSelectCourse={handleSelectCourse}
            onBack={handleBackToHome}
          />
        ) : (
          /* ── Home Page ── */
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

            {/* 2. About Dr. Naresh + 4 Courses Preview */}
            <AboutAndFeatures
              onConsultClick={() => openModal('meeting')}
              onSelectCourse={handleSelectCourse}
              onSeeAllCourses={handleSeeAllCourses}
            />

            {/* 3. OUR FEATURES (with staggered animation + banner) */}
            <OurFeatures />

            {/* 4. Our Products (4 cards) */}
            <BusinessNeeds />

            {/* 5. Reiki Therapy Section */}
            <ReikiTherapy onBookSession={() => openModal('meeting', { serviceKey: 'reiki_healing_session' })} />

            {/* 6. Video Discourses + Testimonials (expand inline) */}
            <VideoTestimonials onAddStory={() => openModal('addStory')} />
          </>
        )}
      </main>

      {/* Footer - hidden on course details page */}
      {currentView !== 'course-detail' && (
        <Footer
          setCurrentView={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          openModal={openModal}
        />
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
