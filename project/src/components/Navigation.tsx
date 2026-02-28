import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';
import logo from '../images/10Asset 3.svg';
import { getServices, getPackages } from '../lib/api';
import { isAuthenticated } from '../lib/auth';
import type { Service, Package } from '../lib/types';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
    const interval = setInterval(() => {
      setIsLoggedIn(isAuthenticated());
    }, 1000);
    return () => clearInterval(interval);
  }, [location]);

  // Fetch services and packages for navigation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, packagesResponse] = await Promise.all([
          getServices().catch(() => ({ services: [] })),
          getPackages().catch(() => ({ packages: [] })),
        ]);
        
        if (servicesResponse.services) {
          const navServices = servicesResponse.services
            .filter((s: Service) => s.showInNavigation !== false && s.isActive)
            .sort((a: Service, b: Service) => (a.order || 0) - (b.order || 0));
          setServices(navServices);
        }
        
        if (packagesResponse.packages) {
          const navPackages = packagesResponse.packages
            .filter((p: Package) => p.showInNavigation !== false && p.isActive)
            .sort((a: Package, b: Package) => (a.order || 0) - (b.order || 0));
          setPackages(navPackages);
        }
      } catch (error) {
        console.error('Error fetching navigation data:', error);
      }
    };
    fetchData();
  }, []);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHomePage && !isScrolled
        ? 'bg-transparent backdrop-blur-none'
        : 'bg-white/95 backdrop-blur-md shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logo} 
              alt="Skyriting Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span className={`text-lg sm:text-xl font-luxury font-light tracking-luxury transition-colors ${
                isHomePage && !isScrolled ? 'text-white' : 'text-luxury-black'
              }`}>
                Skyriting
              </span>
              <span className={`text-[9px] sm:text-[10px] font-luxury tracking-widest transition-colors ${
                isHomePage && !isScrolled ? 'text-white/80' : 'text-luxury-red'
              }`}>
                ELEVATE YOUR JOURNEY
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {/* Services */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 font-luxury tracking-wide transition-colors ${
                  isHomePage && !isScrolled
                    ? 'text-white hover:text-luxury-red'
                    : 'text-luxury-black hover:text-luxury-red'
                }`}
                onMouseEnter={() => setActiveDropdown('services')}
              >
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {activeDropdown === 'services' && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl py-1 border border-luxury-red/10 z-50"
                  onMouseEnter={() => setActiveDropdown('services')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link to="/services" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide border-b border-luxury-black/10">
                    All Services
                  </Link>
                  {services.length > 0 ? (
                    services.map((service: Service) => (
                      <Link
                        key={service._id || service.id}
                        to={`/services/${service.slug || service.id}`}
                        className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide"
                      >
                        {service.title}
                      </Link>
                    ))
                  ) : (
                    // Fallback services
                    <>
                      <Link to="/services/charter" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                        Charter Services
                      </Link>
                      <Link to="/services/aircraft-management" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                        Aircraft Management
                      </Link>
                      <Link to="/services/sourcing" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                        Sourcing & Sales
                      </Link>
                      <Link to="/services/advanced-air-mobility" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                        Advanced Air Mobility
                      </Link>
                      <Link to="/services/mro" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                        MRO Services
                      </Link>
                      <Link to="/services/consultancy" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                        Aviation Consultancy
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Packages */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 font-luxury tracking-wide transition-colors text-sm ${
                  isHomePage && !isScrolled
                    ? 'text-white hover:text-luxury-red'
                    : 'text-luxury-black hover:text-luxury-red'
                }`}
                onMouseEnter={() => setActiveDropdown('packages')}
              >
                <span>Packages</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {activeDropdown === 'packages' && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl py-1 border border-luxury-red/10 z-50"
                  onMouseEnter={() => setActiveDropdown('packages')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link to="/packages" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide border-b border-luxury-black/10">
                    All Packages
                  </Link>
                  {packages.length > 0 ? (
                    packages.map((pkg: Package) => (
                      <Link
                        key={pkg._id || pkg.id}
                        to={`/packages/${pkg.slug || pkg.id}`}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide"
                      >
                        {pkg.title}
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link to="/packages/skyriting-yatra" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                        Skyriting Yatra
                      </Link>
                      <Link to="/packages/skyriting-wed" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                        Skyriting Wed
                      </Link>
                      <Link to="/packages/skyriting-heli" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                        Skyriting Heli
                      </Link>
                      <Link to="/packages/skyriting-rescue" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                        Skyriting Rescue
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Fleet */}
            <Link 
              to="/fleet" 
              className={`font-luxury tracking-wide transition-colors whitespace-nowrap ${
                isHomePage && !isScrolled
                  ? 'text-white hover:text-luxury-red'
                  : 'text-luxury-black hover:text-luxury-red'
              }`}
            >
              Fleet
            </Link>

            {/* About */}
            <div className="relative group">
              <button
                className={`flex items-center space-x-1 font-luxury tracking-wide transition-colors text-sm ${
                  isHomePage && !isScrolled
                    ? 'text-white hover:text-luxury-red'
                    : 'text-luxury-black hover:text-luxury-red'
                }`}
                onMouseEnter={() => setActiveDropdown('about')}
              >
                <span>About</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {activeDropdown === 'about' && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl py-1 border border-luxury-red/10 z-50"
                  onMouseEnter={() => setActiveDropdown('about')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link to="/about" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                    About Us
                  </Link>
                  <Link to="/career" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                    Career
                  </Link>
                  <Link to="/contact" className="block px-3 py-2 text-xs text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide">
                    Contact Us
                  </Link>
                </div>
              )}
            </div>

            {/* Mobility */}
            <Link 
              to="/mobility-thread" 
              className={`font-luxury tracking-wide transition-colors whitespace-nowrap text-sm ${
                isHomePage && !isScrolled
                  ? 'text-white hover:text-luxury-red'
                  : 'text-luxury-black hover:text-luxury-red'
              }`}
            >
              Mobility
            </Link>

            {/* News */}
            <Link 
              to="/articles" 
              className={`font-luxury tracking-wide transition-colors whitespace-nowrap text-sm ${
                isHomePage && !isScrolled
                  ? 'text-white hover:text-luxury-red'
                  : 'text-luxury-black hover:text-luxury-red'
              }`}
            >
              News
            </Link>

            {/* Phone - Hidden on smaller screens */}
            <a 
              href="tel:+911234567890" 
              className={`hidden 2xl:flex items-center space-x-2 font-luxury tracking-wide transition-colors whitespace-nowrap ${
                isHomePage && !isScrolled
                  ? 'text-white hover:text-luxury-red'
                  : 'text-luxury-red hover:text-luxury-red-dark'
              }`}
            >
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm xl:text-base">+91 123 456 7890</span>
            </a>

            {/* Login/Account Button */}
            {isLoggedIn ? (
              <Link
                to="/account"
                className="bg-luxury-red text-white px-4 xl:px-6 py-2 xl:py-2.5 rounded-sm hover:bg-luxury-red-dark transition font-luxury tracking-wide shadow-lg text-xs xl:text-sm uppercase whitespace-nowrap"
              >
                Account
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-luxury-red text-white px-4 xl:px-6 py-2 xl:py-2.5 rounded-sm hover:bg-luxury-red-dark transition font-luxury tracking-wide shadow-lg text-xs xl:text-sm uppercase whitespace-nowrap"
              >
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden transition-colors ${
              isHomePage && !isScrolled ? 'text-white' : 'text-luxury-black'
            }`}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden pb-6 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="space-y-2 px-4">
              {/* Services */}
              <div>
                <button
                  onClick={() => toggleDropdown('mobile-services')}
                  className="w-full flex items-center justify-between px-4 py-3 text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide"
                >
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {activeDropdown === 'mobile-services' && (
                  <div className="bg-luxury-white-off py-2">
                    <Link 
                      to="/services" 
                      onClick={() => setIsOpen(false)}
                      className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide border-b border-luxury-black/10"
                    >
                      All Services
                    </Link>
                    {services.length > 0 ? (
                      services.map((service: Service) => (
                        <Link
                          key={service._id || service.id}
                          to={`/services/${service.slug || service.id}`}
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          {service.title}
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link 
                          to="/services/charter" 
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          Charter Services
                        </Link>
                        <Link 
                          to="/services/aircraft-management" 
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          Aircraft Management
                        </Link>
                        <Link 
                          to="/services/sourcing" 
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          Sourcing & Sales
                        </Link>
                        <Link 
                          to="/services/advanced-air-mobility" 
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          Advanced Air Mobility
                        </Link>
                        <Link 
                          to="/services/mro" 
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          MRO Services
                        </Link>
                        <Link 
                          to="/services/consultancy" 
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          Aviation Consultancy
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Packages */}
              <div>
                <button
                  onClick={() => toggleDropdown('mobile-packages')}
                  className="w-full flex items-center justify-between px-4 py-3 text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide"
                >
                  <span>Packages</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {activeDropdown === 'mobile-packages' && (
                  <div className="bg-luxury-white-off py-2">
                    <Link 
                      to="/packages" 
                      onClick={() => setIsOpen(false)}
                      className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide border-b border-luxury-black/10"
                    >
                      All Packages
                    </Link>
                    {packages.length > 0 ? (
                      packages.map((pkg: Package) => (
                        <Link
                          key={pkg._id || pkg.id}
                          to={`/packages/${pkg.slug || pkg.id}`}
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          {pkg.title}
                        </Link>
                      ))
                    ) : (
                      <>
                        <Link 
                          to="/packages/skyriting-yatra" 
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          Skyriting Yatra
                        </Link>
                        <Link 
                          to="/packages/skyriting-wed" 
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          Skyriting Wed
                        </Link>
                        <Link 
                          to="/packages/skyriting-heli" 
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          Skyriting Heli
                        </Link>
                        <Link 
                          to="/packages/skyriting-rescue" 
                          onClick={() => setIsOpen(false)}
                          className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                        >
                          Skyriting Rescue
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Fleet */}
              <Link 
                to="/fleet" 
                onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                className="block px-4 py-3 text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide"
              >
                Fleet
              </Link>

              <div>
                <button
                  onClick={() => toggleDropdown('mobile-about')}
                  className="w-full flex items-center justify-between px-4 py-3 text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide"
                >
                  <span>About</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {activeDropdown === 'mobile-about' && (
                  <div className="bg-luxury-white-off py-2">
                    <Link 
                      to="/about" 
                      onClick={() => setIsOpen(false)}
                      className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                    >
                      About Us
                    </Link>
                    <Link 
                      to="/career" 
                      onClick={() => setIsOpen(false)}
                      className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                    >
                      Career
                    </Link>
                    <Link 
                      to="/contact" 
                      onClick={() => setIsOpen(false)}
                      className="block px-8 py-2 text-luxury-black hover:text-luxury-red font-luxury tracking-wide"
                    >
                      Contact Us
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                to="/fleet" 
                onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                className="block px-4 py-3 text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide"
              >
                Fleet
              </Link>
              <Link 
                to="/mobility-thread" 
                onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                className="block px-4 py-3 text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide"
              >
                Mobility Thread
              </Link>
              <Link 
                to="/articles" 
                onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                className="block px-4 py-3 text-luxury-black hover:bg-luxury-red hover:text-white transition font-luxury tracking-wide"
              >
                News & Media
              </Link>
              {isLoggedIn ? (
                <Link 
                  to="/account" 
                  onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                  className="block px-4 py-3 bg-luxury-red text-white text-center rounded-sm mx-4 mt-2 font-luxury tracking-wide uppercase"
                >
                  Account
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => { setIsOpen(false); setActiveDropdown(null); }}
                  className="block px-4 py-3 bg-luxury-red text-white text-center rounded-sm mx-4 mt-2 font-luxury tracking-wide uppercase"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
