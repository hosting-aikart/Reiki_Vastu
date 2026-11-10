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
import TestProductsPage from './components/TestProductsPage';
import CheckoutPage from './components/CheckoutPage';
import PaymentStatusPage from './components/PaymentStatusPage';

// Razorpay Test Mode pages. They have real URLs so a refresh lands on the same page,
// and live under /test-checkout so they never clash with the real product pages.
// /test-checkout          -> placeholder products
// /test-checkout/<id>     -> checkout for one placeholder product
// /payments/<token>       -> status of one payment
function paymentRouteFromPath(pathname) {
  const status = pathname.match(/^\/payments\/([^/]+)\/?$/);
  if (status) {
    return { view: 'payment-status', testProductId: null, statusToken: decodeURIComponent(status[1]) };
  }
  const checkout = pathname.match(/^\/test-checkout(?:\/([^/]+))?\/?$/);
  if (!checkout) return null;
  return checkout[1]
    ? { view: 'test-checkout', testProductId: decodeURIComponent(checkout[1]), statusToken: null }
    : { view: 'test-products', testProductId: null, statusToken: null };
}

const PAYMENT_VIEWS = ['test-products', 'test-checkout', 'payment-status'];

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    return paymentRouteFromPath(path)?.view || 'home';
  });
  const [testProductId, setTestProductId] = useState(
    () => paymentRouteFromPath(window.location.pathname)?.testProductId || null
  );
  const [statusToken, setStatusToken] = useState(
    () => paymentRouteFromPath(window.location.pathname)?.statusToken || null
  );
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [previousView, setPreviousView] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const paymentRoute = paymentRouteFromPath(path);
      if (path.startsWith('/admin')) {
        setCurrentView('admin');
      } else if (paymentRoute) {
        setTestProductId(paymentRoute.testProductId);
        setStatusToken(paymentRoute.statusToken);
        setCurrentView(paymentRoute.view);
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

  const navigateToTestCheckout = (productId = null) => {
    window.history.pushState({}, '', productId ? `/test-checkout/${encodeURIComponent(productId)}` : '/test-checkout');
    setTestProductId(productId);
    setCurrentView(productId ? 'test-checkout' : 'test-products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPaymentStatus = (token) => {
    window.history.pushState({}, '', `/payments/${encodeURIComponent(token)}`);
    setStatusToken(token);
    setCurrentView('payment-status');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navbar and Footer switch views without changing the URL. Leaving a payment
  // page that way must also leave its URL, or a refresh would reopen it.
  const changeView = (view) => {
    if (paymentRouteFromPath(window.location.pathname) && !PAYMENT_VIEWS.includes(view)) {
      window.history.pushState({}, '', '/');
    }
    setCurrentView(view);
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
        setCurrentView={changeView}
        openModal={openModal}
      />

      {/* Main Content Pages */}
      <main style={{ flex: 1 }}>
        {currentView === 'test-products' ? (
          /* ── Razorpay Test Mode: placeholder products ── */
          <TestProductsPage
            onSelectProduct={(productId) => navigateToTestCheckout(productId)}
            onBack={() => changeView('home')}
          />
        ) : currentView === 'test-checkout' && testProductId ? (
          /* ── Razorpay Test Mode: checkout for one placeholder product ── */
          <CheckoutPage
            key={testProductId}
            productId={testProductId}
            onBackToProducts={() => navigateToTestCheckout()}
            onPaymentSubmitted={navigateToPaymentStatus}
          />
        ) : currentView === 'payment-status' && statusToken ? (
          /* ── Razorpay Test Mode: payment status (refresh-safe) ── */
          <PaymentStatusPage
            key={statusToken}
            statusToken={statusToken}
            onBackToProducts={() => navigateToTestCheckout()}
          />
        ) : currentView === 'course-detail' && selectedCourseId ? (
          /* ── Dedicated Single Course Detail Page ── */
          <CourseDetailPage
            courseId={selectedCourseId}
            onBack={handleBackFromCourseDetail}
            onEnroll={(title) => {
              openModal('enroll', { courseId: selectedCourseId, title });
            }}
            onConsult={(title) => {
              openModal('meeting', {
                courseTitle: title,
                note: `I would like to book a consultation regarding ${title}.`
              });
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
