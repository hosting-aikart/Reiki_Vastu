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
import ProductsPage from './components/ProductsPage';
import CheckoutPage from './components/CheckoutPage';
import PaymentStatusPage from './components/PaymentStatusPage';

// Payment pages have real URLs so a refresh during checkout lands back on the same page.
// /products            -> products list
// /products/<id>       -> checkout for one product
// /payments/<token>    -> status of one payment
function productRouteFromPath(pathname) {
  const status = pathname.match(/^\/payments\/([^/]+)\/?$/);
  if (status) {
    return { view: 'payment-status', productId: null, statusToken: decodeURIComponent(status[1]) };
  }
  const match = pathname.match(/^\/products(?:\/([^/]+))?\/?$/);
  if (!match) return null;
  return match[1]
    ? { view: 'product-checkout', productId: decodeURIComponent(match[1]), statusToken: null }
    : { view: 'products', productId: null, statusToken: null };
}

const PRODUCT_VIEWS = ['products', 'product-checkout', 'payment-status'];

function initialView() {
  if (window.location.pathname.startsWith('/admin')) return 'admin';
  return productRouteFromPath(window.location.pathname)?.view || 'home';
}

export default function App() {
  const [currentView, setCurrentView] = useState(initialView);
  const [selectedProductId, setSelectedProductId] = useState(
    () => productRouteFromPath(window.location.pathname)?.productId || null
  );
  const [selectedStatusToken, setSelectedStatusToken] = useState(
    () => productRouteFromPath(window.location.pathname)?.statusToken || null
  );
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [previousView, setPreviousView] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      const productRoute = productRouteFromPath(window.location.pathname);
      if (window.location.pathname.startsWith('/admin')) {
        setCurrentView('admin');
      } else if (productRoute) {
        setSelectedProductId(productRoute.productId);
        setSelectedStatusToken(productRoute.statusToken);
        setCurrentView(productRoute.view);
      } else if (currentView === 'admin' || PRODUCT_VIEWS.includes(currentView)) {
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

  const navigateToProducts = (productId = null) => {
    window.history.pushState({}, '', productId ? `/products/${encodeURIComponent(productId)}` : '/products');
    setSelectedProductId(productId);
    setCurrentView(productId ? 'product-checkout' : 'products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPaymentStatus = (statusToken) => {
    window.history.pushState({}, '', `/payments/${encodeURIComponent(statusToken)}`);
    setSelectedStatusToken(statusToken);
    setCurrentView('payment-status');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navbar and Footer switch views without changing the URL. Leaving a product page
  // that way must also leave its URL, or a refresh would reopen the product page.
  const changeView = (view) => {
    if (productRouteFromPath(window.location.pathname) && !PRODUCT_VIEWS.includes(view)) {
      window.history.pushState({}, '', '/');
    }
    setCurrentView(view);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#fdfbf7' }}>
      {/* Floating Pill Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          changeView(view);
        }}
        openModal={openModal}
      />

      {/* Main Content Pages */}
      <main style={{ flex: 1 }}>
        {currentView === 'products' ? (
          /* ── Razorpay Test Mode: placeholder products ── */
          <ProductsPage
            onSelectProduct={(productId) => navigateToProducts(productId)}
            onBack={() => changeView('home')}
          />
        ) : currentView === 'product-checkout' && selectedProductId ? (
          /* ── Razorpay Test Mode: checkout for one product ── */
          <CheckoutPage
            key={selectedProductId}
            productId={selectedProductId}
            onBackToProducts={() => navigateToProducts()}
            onPaymentSubmitted={navigateToPaymentStatus}
          />
        ) : currentView === 'payment-status' && selectedStatusToken ? (
          /* ── Razorpay Test Mode: payment status (refresh-safe) ── */
          <PaymentStatusPage
            key={selectedStatusToken}
            statusToken={selectedStatusToken}
            onBackToProducts={() => navigateToProducts()}
          />
        ) : currentView === 'course-detail' && selectedCourseId ? (
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
            <BusinessNeeds onOpenTestCheckout={() => navigateToProducts()} />

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
            changeView(view);
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
