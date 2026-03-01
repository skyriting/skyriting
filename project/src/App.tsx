import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Fleet from './pages/Fleet';
import PackagePage from './pages/PackagePage';
import ServicePage from './pages/ServicePage';
import PricingCalculator from './pages/PricingCalculator';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import AircraftDetail from './pages/AircraftDetail';
import Quote from './pages/Quote';
import HelicopterBooking from './pages/HelicopterBooking';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminPricing from './pages/admin/AdminPricing';
import AdminRoutes from './pages/admin/AdminRoutes';
import AdminFleet from './pages/admin/AdminFleet';
import AdminPackages from './pages/admin/AdminPackages';
import AdminBookings from './pages/admin/AdminBookings';
import AdminArticles from './pages/admin/AdminArticles';
import AdminServices from './pages/admin/AdminServices';
import AdminMobility from './pages/admin/AdminMobility';
import AboutUs from './pages/AboutUs';
import Career from './pages/Career';
import ContactUs from './pages/ContactUs';
import Services from './pages/Services';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import MobilityThread from './pages/MobilityThread';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col pb-16 md:pb-0 overflow-x-hidden">
        <Navigation />
        <main className="flex-grow overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/pricing" element={<PricingCalculator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/aircraft/:id" element={<AircraftDetail />} />
            <Route path="/quote/:id" element={<Quote />} />
            <Route path="/helicopter" element={<HelicopterBooking />} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/login" element={<AdminLogin />} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/dashboard" element={<ProtectedRoute admin={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/inquiries" element={<ProtectedRoute admin={true}><AdminInquiries /></ProtectedRoute>} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/pricing" element={<ProtectedRoute admin={true}><AdminPricing /></ProtectedRoute>} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/routes" element={<ProtectedRoute admin={true}><AdminRoutes /></ProtectedRoute>} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/fleet" element={<ProtectedRoute admin={true}><AdminFleet /></ProtectedRoute>} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/packages" element={<ProtectedRoute admin={true}><AdminPackages /></ProtectedRoute>} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/bookings" element={<ProtectedRoute admin={true}><AdminBookings /></ProtectedRoute>} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/articles" element={<ProtectedRoute admin={true}><AdminArticles /></ProtectedRoute>} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/services" element={<ProtectedRoute admin={true}><AdminServices /></ProtectedRoute>} />
            <Route path="/3636847rgyuvfu3f/98184t763gvf/mobility" element={<ProtectedRoute admin={true}><AdminMobility /></ProtectedRoute>} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:slug" element={<PackageDetail />} />
            <Route path="/packages/:packageType" element={<PackagePage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceType" element={<ServicePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/career" element={<Career />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/mobility-thread" element={<MobilityThread />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
          </Routes>
        </main>
        <Footer />
        <MobileNav />
      </div>
    </Router>
  );
}

export default App;
