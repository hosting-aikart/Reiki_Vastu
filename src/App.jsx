import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutAndFeatures from './components/AboutAndFeatures';
import OurFeatures from './components/OurFeatures';
import BusinessNeeds from './components/BusinessNeeds';
import VideoTestimonials from './components/VideoTestimonials';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import Modals from './components/Modals';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  const openModal = (modalType, data = null) => {
    setActiveModal(modalType);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  const handleSelectCourse = (courseTitle) => {
    openModal('meeting', { title: `${courseTitle} Course Inquiry & Registration` });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fdfbf7' }}>
      {/* Floating Pill Navbar with Empty Space for Logo */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
        }}
        openModal={openModal}
      />

      {/* Main Content Pages */}
      <main style={{ flex: 1 }}>
        {/* 1. Hero with BlueNeuron 2-Column layout & Main Video */}
        <Hero
          onSearch={() => {
            const el = document.getElementById('courses-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onConsultClick={() => openModal('meeting')}
        />

        {/* 2. Welcome by Dr. Naresh Chhabdiya & 15 Certified Courses Grid */}
        <AboutAndFeatures
          onConsultClick={() => openModal('meeting')}
          onSelectCourse={handleSelectCourse}
        />

        {/* 3. OUR FEATURES (replaces Authentic Healing section, matching Image 3) */}
        <OurFeatures />

        {/* 4. Our Products Section with Coming Soon Cards */}
        <BusinessNeeds />

        {/* 5. Discourses & Real Testimonials */}
        <VideoTestimonials />
      </main>

      {/* Footer with Amravati & Nagpur Centers Contact Info */}
      <Footer
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openModal={openModal}
      />

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
