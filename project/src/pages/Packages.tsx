import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Calendar, Users, Clock, MapPin } from 'lucide-react';
import { getPackages } from '../lib/api';
import type { Package } from '../lib/types';

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await getPackages();
        if (response.packages && response.packages.length > 0) {
          setPackages(response.packages);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Breadcrumb */}
      <section className="bg-luxury-white py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-luxury-black">Our Packages</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            Skyriting Packages
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            Taking you the extra mile
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 sm:py-20 lg:py-24 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto mb-4"></div>
              <p className="text-luxury-black/70 font-luxury tracking-wide">Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-luxury-black/70 font-luxury tracking-wide">No packages available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {packages.map((pkg) => (
                <Link
                  key={pkg._id || pkg.id}
                  to={`/packages/${pkg.slug || pkg.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-luxury-black/10 group"
                >
                  <div className="relative h-64 bg-luxury-black/5">
                    {pkg.imageUrl ? (
                      <img
                        src={pkg.imageUrl}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-luxury-black/10 to-luxury-red/10">
                        <Calendar className="h-16 w-16 text-luxury-black/20" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-luxury-red text-white px-3 py-1 rounded-full text-sm font-luxury tracking-wide">
                      Package
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
                      {pkg.title}
                    </h3>
                    {pkg.tagline && (
                      <p className="text-luxury-red text-sm mb-3 font-luxury tracking-wide">
                        {pkg.tagline}
                      </p>
                    )}
                    <p className="text-luxury-black/70 mb-4 leading-relaxed font-luxury tracking-wide text-sm">
                      {pkg.description}
                    </p>
                    {pkg.packageIncludes && pkg.packageIncludes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">Package Includes:</p>
                        <ul className="space-y-1">
                          {pkg.packageIncludes.slice(0, 3).map((item, index) => (
                            <li key={index} className="text-xs text-luxury-black/70 font-luxury tracking-wide flex items-center">
                              <span className="w-1.5 h-1.5 bg-luxury-red rounded-full mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center text-luxury-red group-hover:text-luxury-red/80 transition font-luxury tracking-wide">
                      <span className="text-sm">View More</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            Need Help Choosing a Package?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed font-luxury tracking-wide">
            Our travel experts are ready to help you find the perfect package for your journey.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 bg-luxury-red text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg text-sm sm:text-base"
          >
            <span>Contact Us</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
