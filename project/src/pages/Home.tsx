import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Users, Clock, Shield, ArrowRight, Star } from 'lucide-react';
import SearchWidget from '../components/SearchWidget';
import { getPackages } from '../lib/api';
import type { Package } from '../lib/types';

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackages();
        if (response.packages && response.packages.length > 0) {
          // Show only packages that should appear in navigation/home
          const homePackages = response.packages
            .filter((pkg: Package) => pkg.showInNavigation !== false && pkg.isActive)
            .sort((a: Package, b: Package) => (a.order || 0) - (b.order || 0))
            .slice(0, 4); // Show max 4 packages
          setPackages(homePackages);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image Background */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat pt-24 sm:pt-28"
        style={{
          backgroundImage: 'url(/images/her_o.png)' 
        }}
      >
        {/* Background Overlay - Lighter for better image visibility */}
        <div className="absolute inset-0 z-0">
          {/* Subtle dark overlay for text readability - much lighter */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
          {/* Subtle red accent overlay */}
          <div className="absolute inset-0 bg-luxury-red/3"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white drop-shadow-lg mb-2 font-luxury tracking-wide max-w-3xl mx-auto uppercase" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
              ELEVATE YOUR JOURNEY
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/95 drop-shadow-md font-luxury tracking-wide max-w-2xl mx-auto" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Premium Private Aviation Platform
            </p>
          </div>
          
          {/* Search Widget - Moved down */}
          <div className="mt-12 sm:mt-16 w-full">
            <SearchWidget />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Skyriting Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">
              Why Choose Skyriting
            </h2>
            <div className="w-20 h-0.5 bg-luxury-red mx-auto mb-3"></div>
            <p className="text-sm sm:text-base md:text-lg text-luxury-black/70 max-w-2xl mx-auto font-luxury tracking-wide">
              Unmatched service, safety, and luxury in every flight
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-6 sm:p-8 rounded-sm bg-luxury-white-off hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-luxury-black/5">
              <div className="bg-luxury-red/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Plane className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red" />
              </div>
              <h3 className="text-lg sm:text-xl font-luxury font-light text-luxury-black mb-2 tracking-wide">Premium Fleet</h3>
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury tracking-wide">
                Wide selection of modern aircraft from turboprops to large jets
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 rounded-sm bg-luxury-white-off hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-luxury-black/5">
              <div className="bg-luxury-red/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red" />
              </div>
              <h3 className="text-lg sm:text-xl font-luxury font-light text-luxury-black mb-2 tracking-wide">24/7 Availability</h3>
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury tracking-wide">
                Round-the-clock service with guaranteed quick turnaround times
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 rounded-sm bg-luxury-white-off hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-luxury-black/5">
              <div className="bg-luxury-red/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red" />
              </div>
              <h3 className="text-lg sm:text-xl font-luxury font-light text-luxury-black mb-2 tracking-wide">Safety First</h3>
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury tracking-wide">
                Certified pilots and rigorous maintenance standards
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 rounded-sm bg-luxury-white-off hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-luxury-black/5">
              <div className="bg-luxury-red/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red" />
              </div>
              <h3 className="text-lg sm:text-xl font-luxury font-light text-luxury-black mb-2 tracking-wide">Concierge Service</h3>
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury tracking-wide">
                Dedicated team to handle every detail of your journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-luxury-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light mb-3 tracking-luxury">
              Skyriting Packages
            </h2>
            <div className="w-20 h-0.5 bg-luxury-red mx-auto mb-3"></div>
            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto font-luxury tracking-wide">
              Taking you the extra mile
            </p>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {packages.map((pkg) => (
                <Link
                  key={pkg._id || pkg.id}
                  to={`/packages/${pkg.slug || pkg.id}`}
                  className="group relative overflow-hidden rounded-sm aspect-[3/4] bg-cover bg-center hover:scale-105 transition-transform duration-300 border border-white/10"
                  style={{
                    backgroundImage: pkg.imageUrl
                      ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${pkg.imageUrl})`
                      : 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7))'
                  }}
                >
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-luxury font-light mb-1.5 sm:mb-2 tracking-luxury">
                      {pkg.title}
                    </h3>
                    <p className="text-white/80 mb-3 sm:mb-4 font-luxury tracking-wide text-xs sm:text-sm">
                      {pkg.subtitle || pkg.tagline || pkg.description?.substring(0, 60) + '...'}
                    </p>
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform text-luxury-red" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Fallback packages if API fails */}
              <Link
                to="/packages/skyriting-yatra"
                className="group relative overflow-hidden rounded-sm aspect-[3/4] bg-cover bg-center hover:scale-105 transition-transform duration-300 border border-white/10"
                style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1548013146-72479768bada?w=600)' }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-luxury font-light mb-1.5 sm:mb-2 tracking-luxury">Skyriting Yatra</h3>
                  <p className="text-white/80 mb-3 sm:mb-4 font-luxury tracking-wide text-xs sm:text-sm">Sacred pilgrimages by air</p>
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform text-luxury-red" />
                </div>
              </Link>

              <Link
                to="/packages/skyriting-wed"
                className="group relative overflow-hidden rounded-sm aspect-[3/4] bg-cover bg-center hover:scale-105 transition-transform duration-300 border border-white/10"
                style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1519741497674-611481863552?w=600)' }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-luxury font-light mb-1.5 sm:mb-2 tracking-luxury">Skyriting Wed</h3>
                  <p className="text-white/80 mb-3 sm:mb-4 font-luxury tracking-wide text-xs sm:text-sm">Wedding luxury travel</p>
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform text-luxury-red" />
                </div>
              </Link>

              <Link
                to="/packages/skyriting-rescue"
                className="group relative overflow-hidden rounded-sm aspect-[3/4] bg-cover bg-center hover:scale-105 transition-transform duration-300 border border-white/10"
                style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1516841273335-e39b37888115?w=600)' }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-luxury font-light mb-1.5 sm:mb-2 tracking-luxury">Skyriting Rescue</h3>
                  <p className="text-white/80 mb-3 sm:mb-4 font-luxury tracking-wide text-xs sm:text-sm">Air ambulance services</p>
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform text-luxury-red" />
                </div>
              </Link>

              <Link
                to="/packages/skyriting-heli"
                className="group relative overflow-hidden rounded-sm aspect-[3/4] bg-cover bg-center hover:scale-105 transition-transform duration-300 border border-white/10"
                style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=600)' }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-luxury font-light mb-1.5 sm:mb-2 tracking-luxury">Skyriting Heli</h3>
                  <p className="text-white/80 mb-3 sm:mb-4 font-luxury tracking-wide text-xs sm:text-sm">Helicopter charters</p>
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform text-luxury-red" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Aircraft Types Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-luxury-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">
              Our Aircraft Fleet
            </h2>
            <div className="w-20 h-0.5 bg-luxury-red mx-auto mb-3"></div>
            <p className="text-sm sm:text-base md:text-lg text-luxury-black/70 max-w-2xl mx-auto font-luxury tracking-wide">
              Explore our diverse range of premium aircraft
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 sm:gap-6">
            {/* Helicopter */}
            <Link
              to="/fleet?type=Helicopter"
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-luxury-black/10 text-center relative"
            >
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=600&h=400&fit=crop&q=80"
                  alt="Helicopter"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <h3 className="text-sm sm:text-base font-luxury font-light text-white tracking-wide drop-shadow-lg">Helicopter</h3>
                </div>
              </div>
            </Link>

            {/* Airliner */}
            <Link
              to="/fleet?type=Airliner"
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-luxury-black/10 text-center relative"
            >
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&q=80"
                  alt="Airliner"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <h3 className="text-sm sm:text-base font-luxury font-light text-white tracking-wide drop-shadow-lg">Airliner</h3>
                </div>
              </div>
            </Link>

            {/* Large Jet */}
            <Link
              to="/fleet?type=Large"
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-luxury-black/10 text-center relative"
            >
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=400&fit=crop&q=80"
                  alt="Large Jet"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <h3 className="text-sm sm:text-base font-luxury font-light text-white tracking-wide drop-shadow-lg">Large Jet</h3>
                </div>
              </div>
            </Link>

            {/* Super Midsize Jet */}
            <Link
              to="/fleet?type=Super Mid"
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-luxury-black/10 text-center relative"
            >
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop&q=80"
                  alt="Super Midsize Jet"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <h3 className="text-sm sm:text-base font-luxury font-light text-white tracking-wide drop-shadow-lg">Super Midsize Jet</h3>
                </div>
              </div>
            </Link>

            {/* Midsize Jet */}
            <Link
              to="/fleet?type=Mid"
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-luxury-black/10 text-center relative"
            >
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&h=400&fit=crop&q=80"
                  alt="Midsize Jet"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <h3 className="text-sm sm:text-base font-luxury font-light text-white tracking-wide drop-shadow-lg">Midsize Jet</h3>
                </div>
              </div>
            </Link>

            {/* Light Jet */}
            <Link
              to="/fleet?type=Light"
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-luxury-black/10 text-center relative"
            >
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=600&h=400&fit=crop&q=80"
                  alt="Light Jet"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <h3 className="text-sm sm:text-base font-luxury font-light text-white tracking-wide drop-shadow-lg">Light Jet</h3>
                </div>
              </div>
            </Link>

            {/* Turboprop */}
            <Link
              to="/fleet?type=Turboprop"
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-luxury-black/10 text-center relative"
            >
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&q=80"
                  alt="Turboprop"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <h3 className="text-sm sm:text-base font-luxury font-light text-white tracking-wide drop-shadow-lg">Turboprop</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
