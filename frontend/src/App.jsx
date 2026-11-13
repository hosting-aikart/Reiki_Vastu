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
import CheckoutPage from './components/CheckoutPage';
import PaymentStatusPage from './components/PaymentStatusPage';
import EventsPage from './components/events/EventsPage';
import EventPopup from './components/events/EventPopup';

// Payment pages have real URLs so a refresh lands on the same page.
// /checkout/<productId>?quantity=2  -> delivery details + payment for one product
// /payments/<token>                 -> status of one payment
function paymentRouteFromPath(pathname, search = '') {
  const status = pathname.match(/^\/payments\/([^/]+)\/?$/);
  if (status) {
    return { view: 'payment-status', checkoutProductId: null, checkoutQuantity: 1, statusToken: decodeURIComponent(status[1]) };
  }
  const checkout = pathname.match(/^\/checkout\/([^/]+)\/?$/);
  if (!checkout) return null;
  const quantity = Number.parseInt(new URLSearchParams(search).get('quantity'), 10);
  return {
    view: 'checkout',
    checkoutProductId: decodeURIComponent(checkout[1]),
    checkoutQuantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    statusToken: null
  };
}

const PAYMENT_VIEWS = ['checkout', 'payment-status'];

// Content pages that have their own shareable URL.
const VIEW_PATHS = { events: '/events' };
const viewFromPath = (pathname) =>
  Object.keys(VIEW_PATHS).find((view) => pathname.replace(/\/+$/, '') === VIEW_PATHS[view]) || null;
const currentPaymentRoute = () => paymentRouteFromPath(window.location.pathname, window.location.search);

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    return currentPaymentRoute()?.view || viewFromPath(path) || 'home';
  });
  const [checkout, setCheckout] = useState(() => {
    const route = currentPaymentRoute();
    return { productId: route?.checkoutProductId || null, quantity: route?.checkoutQuantity || 1 };
  });
  const [statusToken, setStatusToken] = useState(() => currentPaymentRoute()?.statusToken || null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [previousView, setPreviousView] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  // The event announcement opens with the site, except on pages where it would
  // get in the way: the events page itself and the checkout / payment pages.
  const [showEventPopup] = useState(() => !['events', ...PAYMENT_VIEWS].includes(currentView));
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const paymentRoute = currentPaymentRoute();
      if (path.startsWith('/admin')) {
        setCurrentView('admin');
      } else if (paymentRoute) {
        setCheckout({ productId: paymentRoute.checkoutProductId, quantity: paymentRoute.checkoutQuantity });
        setStatusToken(paymentRoute.statusToken);
        setCurrentView(paymentRoute.view);
      } else {
        setCurrentView(viewFromPath(path) || 'home');
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

  const navigateToCheckout = (productId, quantity = 1) => {
    window.history.pushState({}, '', `/checkout/${encodeURIComponent(productId)}?quantity=${quantity}`);
    setCheckout({ productId, quantity });
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // From the checkout or status page back to the product pages (which have no URL of their own)
  const leavePaymentPage = (view, productId = null) => {
    window.history.pushState({}, '', '/');
    if (productId) setSelectedProductId(productId);
    setCurrentView(view);
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
    const path = window.location.pathname;
    if (VIEW_PATHS[view]) {
      if (viewFromPath(path) !== view) window.history.pushState({}, '', VIEW_PATHS[view]);
    } else if (
      (paymentRouteFromPath(path) && !PAYMENT_VIEWS.includes(view)) ||
      viewFromPath(path)
    ) {
      window.history.pushState({}, '', '/');
    }
    setCurrentView(view);
  };

  return (
    <div
      className="th-theme-active th-golden-harmony th-bolder-preview"
      style={{
        minHeight: 'calc(100vh / var(--page-zoom, 1))',
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
        {currentView === 'checkout' && checkout.productId ? (
          /* ── Checkout: delivery details + Razorpay payment ── */
          <CheckoutPage
            key={`${checkout.productId}:${checkout.quantity}`}
            productId={checkout.productId}
            initialQuantity={checkout.quantity}
            onBack={() => leavePaymentPage('product-detail', checkout.productId)}
            onPaymentSubmitted={navigateToPaymentStatus}
          />
        ) : currentView === 'payment-status' && statusToken ? (
          /* ── Payment status (refresh-safe) ── */
          <PaymentStatusPage
            key={statusToken}
            statusToken={statusToken}
            onBackToProducts={() => leavePaymentPage('products')}
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
            onOrderProduct={(item) => navigateToCheckout(item.id, item.quantity)}
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
        ) : currentView === 'events' ? (
          /* ── Upcoming Events Page ── */
          <EventsPage />
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

      {/* The footer is shown on the home page only. */}
      {currentView === 'home' && (
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

      {/* Upcoming event announcement, shown when the site opens */}
      {showEventPopup && (
        <EventPopup
          onViewDetails={() => {
            changeView('events');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Universal Modals Manager */}
      <Modals
        activeModal={activeModal}
        modalData={modalData}
        closeModal={closeModal}
      />
    </div>
  );
}
