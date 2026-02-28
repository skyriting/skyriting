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
            <Route path="/3636847rgyuvfu3f/98184t763gvf/dashboard" element={<AdminDashboard />} />
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
