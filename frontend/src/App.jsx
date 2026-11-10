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
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import TempleHarmonyRedesign from './components/TempleHarmonyRedesign';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import Modals from './components/Modals';
import AdminDashboard from './components/admin/AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    return 'home';
  });
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [previousView, setPreviousView] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setCurrentView('admin');
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
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromCourseDetail = () => {
    if (previousView === 'home') {
      setCurrentView('home');
    } else {
      setCurrentView('courses');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId) => {
    setPreviousView(currentView === 'product-detail' ? 'products' : currentView);
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSeeAllProducts = () => {
    setCurrentView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProductDetail = () => {
    if (previousView === 'home') {
      setCurrentView('home');
    } else {
      setCurrentView('products');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="th-theme-active th-golden-harmony th-bolder-preview"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#faf5ee'
      }}
    >
      {/* Floating Pill Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
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
              openModal('enroll', { courseId: selectedCourseId, title });
            }}
            onContact={(title) => {
              openModal('contact', { courseTitle: title });
            }}
          />
        ) : currentView === 'courses' ? (
          /* ── Dedicated Courses Page ── */
          <CoursesPage
            onSelectCourse={handleSelectCourse}
            onBack={handleBackToHome}
          />
        ) : currentView === 'product-detail' && selectedProductId ? (
          /* ── Dedicated Single Product Detail Page (E-Commerce) ── */
          <ProductDetailPage
            productId={selectedProductId}
            onBack={handleBackFromProductDetail}
            onSelectProduct={handleSelectProduct}
            onOrderProduct={(item) =>
              openModal('contact', {
                productTitle: `${item.title} (${item.price}${item.quantity > 1 ? ` × ${item.quantity}` : ''})`
              })
            }
            onConsultClick={(prod) =>
              openModal(
                'meeting',
                prod
                  ? {
                      productTitle: prod.title,
                      note: `I would like expert consultation advice regarding ${prod.title} (${prod.subtitle}).`
                    }
                  : null
              )
            }
          />
        ) : currentView === 'products' ? (
          /* ── Dedicated Products Page ── */
          <ProductsPage onSelectProduct={handleSelectProduct} />
        ) : (
          /* ── Golden Harmony Home Page ── */
          <TempleHarmonyRedesign
            onConsultClick={() => openModal('meeting')}
            onExploreCourses={handleSeeAllCourses}
            onSelectCourse={handleSelectCourse}
            onSeeAllCourses={handleSeeAllCourses}
            onSelectProduct={handleSelectProduct}
            onSeeAllProducts={handleSeeAllProducts}
            onBookSession={() => openModal('meeting', { serviceKey: 'reiki_healing_session' })}
            onProductInquiry={(product) => openModal('contact', { productTitle: product.title })}
            onContactClick={() => openModal('contact')}
            onAddStory={() => openModal('addStory')}
          />
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
