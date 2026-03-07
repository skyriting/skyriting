import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Calendar, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 font-medium">
          <Link to="/" className="hover:text-red-600 transition">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900">Curated Packages</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div className="inline-flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase mb-6">
          <Sparkles className="h-4 w-4" />
          <span>Exclusive Experiences</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight">
          Curated Journeys.
          <br className="hidden sm:block" />
          <span className="text-gray-400 font-normal"> Limitless luxury.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed">
          From spiritual pilgrimages to exotic getaways, discover our meticulously crafted aviation packages designed to transform your travel into an unforgettable experience.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-500 font-medium tracking-wide">Fetching active packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium tracking-tight text-gray-900 mb-2">No Packages Yet</h3>
            <p className="text-gray-500">We are currently curating new extraordinary experiences. Please check back shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Link
                key={pkg._id || pkg.id}
                to={`/packages/${pkg.slug || pkg.id}`}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-100">
                  {pkg.imageUrl ? (
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  {/* Overlay Gradient for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                  
                  {/* Floating Tag */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase">
                    Package
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-light text-gray-900 tracking-tight mb-2 group-hover:text-red-600 transition-colors">
                    {pkg.title}
                  </h3>
                  
                  {pkg.tagline && (
                    <p className="text-red-600 text-sm font-medium tracking-wide mb-4">
                      {pkg.tagline}
                    </p>
                  )}
                  
                  <p className="text-gray-500 leading-relaxed mb-6 flex-grow">
                    {pkg.description?.slice(0, 140)}
                    {(pkg.description?.length ?? 0) > 140 ? '...' : ''}
                  </p>

                  {pkg.packageIncludes && pkg.packageIncludes.length > 0 && (
                    <div className="mb-6 pt-6 border-t border-gray-100">
                      <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">Highlights</p>
                      <ul className="space-y-2">
                        {pkg.packageIncludes.slice(0, 3).map((item, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto flex items-center text-sm font-semibold tracking-wide text-gray-900 group-hover:text-red-600 transition-colors">
                    <span>Explore details</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12">
        <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-4">
          Need a Custom Package?
        </h2>
        <p className="text-gray-500 text-lg mb-8">
          Our specialists can craft a breathtaking bespoke itinerary anywhere in the world.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-black hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold tracking-wide"
        >
          <span>Get in touch with us</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
