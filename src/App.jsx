import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarketplaceCarousel from './components/MarketplaceCarousel';
import BusinessNeeds from './components/BusinessNeeds';
import HowItWorks from './components/HowItWorks';
import SellerProcess from './components/SellerProcess';
import TechStack from './components/TechStack';
import Footer from './components/Footer';
import ExploreView from './components/ExploreView';
import BecomeSellerView from './components/BecomeSellerView';
import FloatingWidgets from './components/FloatingWidgets';
import Modals from './components/Modals';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'explore' | 'become-seller'
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleHeroSearch = (query) => {
    setSearchQuery(query);
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCardClick = (title) => {
    setSearchQuery(title);
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectIndustry = (industryName) => {
    setSearchQuery(industryName);
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f4f4' }}>
      {/* Floating Pill Glassmorphism Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          if (view !== 'explore') setSearchQuery('');
        }}
        openModal={openModal}
      />

      {/* Main Content Pages */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <>
            {/* 1. Hero with Video & Typing Search */}
            <Hero onSearch={handleHeroSearch} />

            {/* 2. The Marketplace 5-Card Carousel */}
            <MarketplaceCarousel onCardClick={handleCardClick} />

            {/* 3. By Business Need 3D Icon Marquee */}
            <BusinessNeeds onSelectIndustry={handleSelectIndustry} />

            {/* 4. How aiKart Works 4-Step Accordion */}
            <HowItWorks />

            {/* 5. The Process (Seller side) & CTA */}
            <SellerProcess
              onExploreClick={() => {
                setCurrentView('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBecomeSellerClick={() => {
                setCurrentView('become-seller');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 6. The Tech Stack Marquee */}
            <TechStack />
          </>
        )}

        {currentView === 'explore' && (
          <ExploreView
            initialSearch={searchQuery}
            onOpenSandbox={(agent) => openModal('sandbox', agent)}
          />
        )}

        {currentView === 'become-seller' && (
          <BecomeSellerView
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openModal={openModal}
      />

      {/* Floating 3D Robot Waving & Help Popover */}
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
