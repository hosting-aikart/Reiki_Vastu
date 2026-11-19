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
import PolicyPage from './components/PolicyPage';
import { policySlugFromPath } from './data/policies';
import { useCatalog } from './catalog/CatalogContext';

// ─────────────────────────────────────────────────────────────
// Every page has its own address, and every page change goes through the
// browser's history, so the Back / Forward buttons move between the site's
// pages (instead of leaving the site) and a refresh stays on the same page.
//
//   /                          home
//   /courses, /courses/<id>    all courses, one course
//   /products, /products/<id>  all products, one product
//   /events                    upcoming and past events
//   /checkout/<id>?quantity=2  delivery / registration details + payment
//   /payments/<token>          status of one payment
//   /privacy-policy, ...       legal pages
//   /admin                     admin panel
// ─────────────────────────────────────────────────────────────

const PAYMENT_VIEWS = ['checkout', 'payment-status'];

function routeFromLocation(pathname = window.location.pathname, search = window.location.search) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const segment = (re) => {
    const m = path.match(re);
    return m ? decodeURIComponent(m[1]) : null;
  };
  if (path.startsWith('/admin')) return { view: 'admin' };
  const policySlug = policySlugFromPath(pathname);
  if (policySlug) return { view: 'policy', policySlug };
  const statusToken = segment(/^\/payments\/([^/]+)$/);
  if (statusToken) return { view: 'payment-status', statusToken };
  const checkoutId = segment(/^\/checkout\/([^/]+)$/);
  if (checkoutId) {
    const quantity = Number.parseInt(new URLSearchParams(search).get('quantity'), 10);
    return { view: 'checkout', productId: checkoutId, quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1 };
  }
  const courseId = segment(/^\/courses\/([^/]+)$/);
  if (courseId) return { view: 'course-detail', courseId };
  const productId = segment(/^\/products\/([^/]+)$/);
  if (productId) return { view: 'product-detail', productId };
  if (path === '/courses') return { view: 'courses' };
  if (path === '/products') return { view: 'products' };
  if (path === '/events') return { view: 'events' };
  return { view: 'home' };
}

// Addresses of the pages the navbar and footer link to by name
const VIEW_PATHS = { home: '/', courses: '/courses', products: '/products', events: '/events', admin: '/admin' };

// The browser restores scroll positions itself only for real page loads; this
// site restores them on Back / Forward (see the popstate handler below).
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

export default function App() {
  const { findItem, refresh: refreshCatalog } = useCatalog();
  const [route, setRoute] = useState(() => routeFromLocation());
  const currentView = route.view;
  const [activeModal, setActiveModal] = useState(null);
  // The event announcement opens with the site, except on pages where it would
  // get in the way: the events page itself and the checkout / payment pages.
  const [showEventPopup] = useState(() => !['events', 'policy', 'admin', ...PAYMENT_VIEWS].includes(currentView));
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    // Number each history entry, so "Back" buttons on the pages know whether
    // there is a previous page of this site to go back to
    if (window.history.state?.idx === undefined) {
      window.history.replaceState({ ...(window.history.state || {}), idx: 0 }, '');
    }
    const handlePopState = (event) => {
      setRoute(routeFromLocation());
      const y = event.state?.scrollY ?? 0;
      // Wait for the page to render before restoring where the visitor was
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /** Opens a page: a new history entry, so Back returns to the current page. */
  const navigate = (path, { replace = false } = {}) => {
    const current = window.history.state || {};
    const here = `${window.location.pathname}${window.location.search}`;
    if (!replace && path === here) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Remember the scroll position of the page being left, for Back
    window.history.replaceState({ ...current, scrollY: window.scrollY }, '');
    const idx = (current.idx ?? 0) + (replace ? 0 : 1);
    window.history[replace ? 'replaceState' : 'pushState']({ idx, scrollY: 0 }, '', path);
    setRoute(routeFromLocation());
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  /** "Back" buttons on pages: the previous page of this site, or `fallback` if the visitor arrived here directly. */
  const goBack = (fallback) => {
    if ((window.history.state?.idx ?? 0) > 0) window.history.back();
    else navigate(fallback, { replace: true });
  };

  if (currentView === 'admin') {
    return (
      <AdminDashboard
        onExitToSite={() => {
          refreshCatalog(); // show the changes just made in the admin panel
          navigate('/');
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

  const handleSelectCourse = (courseId) => navigate(`/courses/${encodeURIComponent(courseId)}`);
  const handleSeeAllCourses = () => navigate('/courses');
  const handleSelectProduct = (productId) => navigate(`/products/${encodeURIComponent(productId)}`);
  const handleSeeAllProducts = () => navigate('/products');
  const navigateToCheckout = (productId, quantity = 1) =>
    navigate(`/checkout/${encodeURIComponent(productId)}?quantity=${quantity}`);
  const navigateToPaymentStatus = (token) => navigate(`/payments/${encodeURIComponent(token)}`);
  const navigateToPolicy = (slug) => navigate(`/${slug}`);

  // The navbar and footer open pages by name ('home', 'courses', ...)
  const changeView = (view) => navigate(VIEW_PATHS[view] || '/');

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
        {currentView === 'policy' && route.policySlug ? (
          /* ── Legal pages: privacy, terms, refund, shipping, contact ── */
          <PolicyPage
            key={route.policySlug}
            slug={route.policySlug}
            onNavigate={navigateToPolicy}
            onBack={() => goBack('/')}
          />
        ) : currentView === 'checkout' && route.productId ? (
          /* ── Checkout: delivery / registration details + Razorpay payment ── */
          <CheckoutPage
            key={`${route.productId}:${route.quantity}`}
            productId={route.productId}
            initialQuantity={route.quantity}
            onBack={() => goBack(findItem(route.productId)?.isEvent ? '/events' : `/products/${encodeURIComponent(route.productId)}`)}
            onPaymentSubmitted={navigateToPaymentStatus}
          />
        ) : currentView === 'payment-status' && route.statusToken ? (
          /* ── Payment status (refresh-safe) ── */
          <PaymentStatusPage
            key={route.statusToken}
            statusToken={route.statusToken}
            onBackToProducts={() => navigate('/products')}
            onBackToEvents={() => navigate('/events')}
            onRetryPayment={(productId) => navigateToCheckout(productId, 1)}
          />
        ) : currentView === 'course-detail' && route.courseId ? (
          /* ── Dedicated Single Course Detail Page ── */
          <CourseDetailPage
            courseId={route.courseId}
            onBack={() => goBack('/courses')}
            onEnroll={(title) => {
              openModal('enroll', { courseId: route.courseId, title });
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
            onBack={() => goBack('/')}
          />
        ) : currentView === 'product-detail' && route.productId ? (
          /* ── Dedicated Single Product Detail Page (E-Commerce) ── */
          <ProductDetailPage
            productId={route.productId}
            onBack={() => goBack('/products')}
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
          <EventsPage onRegister={(event) => navigateToCheckout(event.id, 1)} />
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

      {/* The footer is shown on the home page and the legal pages (not on Events). */}
      {(currentView === 'home' || currentView === 'policy') && (
        <Footer
          setCurrentView={changeView}
          openModal={openModal}
          onOpenPolicy={navigateToPolicy}
        />
      )}

      {/* Floating Spiritual Councillor Widget */}
      <FloatingWidgets openModal={openModal} />

      {/* Upcoming event announcement, shown when the site opens */}
      {showEventPopup && (
        <EventPopup
          onRegister={(event) => navigateToCheckout(event.id, 1)}
          onViewDetails={() => navigate('/events')}
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
