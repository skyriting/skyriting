import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Users, Gauge, MapPin, Calendar, UserCheck, Luggage, Plane, ArrowRight, Search, ChevronRight } from 'lucide-react';
import { getAircraft } from '../lib/api';
import type { Aircraft } from '../lib/types';

export default function Fleet() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('type') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const categories = ['all', 'Turboprop', 'Light', 'Mid', 'Super Mid', 'Large', 'Airliner', 'Helicopter'];

  useEffect(() => {
    fetchAircraft();
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setSelectedCategory(typeParam);
    }
  }, [searchParams]);

  const fetchAircraft = async () => {
    try {
      setLoading(true);
      const data = await getAircraft();
      // Filter available aircraft and transform IDs
      const transformedAircraft = data
        .filter((a: any) => a.available !== false)
        .map((a: any) => ({
          ...a,
          id: a._id || a.id,
        }))
        .sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
      setAircraft(transformedAircraft);
    } catch (error) {
      console.error('Error fetching aircraft:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter aircraft by category and search query
  const filteredAircraft = aircraft.filter(a => {
    // Category filter
    const category = a.category || a.type || '';
    const categoryMatch = selectedCategory === 'all' || 
      category === selectedCategory || 
      (selectedCategory === 'Mid' && (category === 'MidSize' || category === 'Mid')) ||
      (selectedCategory === 'Super Mid' && (category === 'Super MidSize' || category === 'Super Mid')) ||
      (selectedCategory === 'Light' && (category === 'Light Jet' || category === 'Light'));

    // Search filter
    const searchMatch = !searchQuery || 
      (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.manufacturer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category || '').toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAircraft.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAircraft = filteredAircraft.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategory, searchQuery]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getSpecValue = (aircraft: any, specKey: string, fallbackKey?: string) => {
    const specs = aircraft.specs || {};
    return specs[specKey] || aircraft[fallbackKey] || 'N/A';
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Breadcrumb */}
      <section className="bg-luxury-white py-3 sm:py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-luxury-black">Fleet Listing</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            Skyriting Premium Fleet
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            From nimble turboprops to ultra long-range jets, Skyriting offers a diverse selection
            of meticulously maintained aircraft to meet every travel need.
          </p>
        </div>
      </section>

      {/* Search Bar and Filters */}
      <section className="py-6 sm:py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-luxury-black/40" />
              <input
                type="text"
                placeholder="Search aircraft by name, manufacturer, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  if (category === 'all') {
                    setSearchParams({});
                  } else {
                    setSearchParams({ type: category });
                  }
                }}
                className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg font-luxury tracking-wide transition text-xs sm:text-sm md:text-base ${
                  selectedCategory === category
                    ? 'bg-luxury-red text-white shadow-lg'
                    : 'bg-luxury-white-off text-luxury-black hover:bg-luxury-white-cream border border-luxury-black/20'
                }`}
              >
                {category === 'all' ? 'All Aircraft' : 
                 category === 'Mid' ? 'Midsize Jet' : 
                 category === 'Super Mid' ? 'Super Midsize Jet' : 
                 category === 'Light' ? 'Light Jet' : 
                 category === 'Large' ? 'Large Jet' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Aircraft Grid */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto"></div>
              <p className="mt-4 text-luxury-black/70 font-luxury tracking-wide">Loading fleet...</p>
            </div>
          ) : paginatedAircraft.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-luxury-black/70 font-luxury tracking-wide">No aircraft found matching your criteria.</p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSearchParams({});
                  }}
                  className="mt-4 text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                {paginatedAircraft.map((plane) => {
                  const specs = plane.specs || {};
                  return (
                    <div
                      key={plane.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-luxury-black/5"
                    >
                      {/* Aircraft Image */}
                      <div className="relative h-56 bg-luxury-black/10">
                        <img
                          src={plane.image_url || 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600'}
                          alt={plane.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-luxury-red text-white px-3 py-1 rounded-full text-xs sm:text-sm font-luxury tracking-wide">
                          {plane.category || plane.type || 'Aircraft'}
                        </div>
                      </div>

                      <div className="p-5 sm:p-6">
                        {/* Aircraft Name and Type */}
                        <h3 className="text-xl sm:text-2xl font-luxury font-light text-luxury-black mb-1 tracking-luxury">
                          {plane.name}
                        </h3>
                        <p className="text-sm sm:text-base text-luxury-red mb-3 font-luxury tracking-wide uppercase">
                          {plane.category || plane.type || 'Jet'}
                        </p>

                        {/* Description */}
                        {plane.description && (
                          <p className="text-sm text-luxury-black/70 mb-4 line-clamp-2 font-luxury tracking-wide leading-relaxed">
                            {plane.description}
                          </p>
                        )}

                        {/* Key Specifications Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 pb-4 border-b border-luxury-black/10">
                          <div className="text-center">
                            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-luxury-red mx-auto mb-1" />
                            <p className="text-xs text-luxury-black/70 font-luxury mb-0.5">Seats</p>
                            <p className="text-sm sm:text-base font-luxury font-light text-luxury-black">
                              {getSpecValue(plane, 'seats', 'passenger_capacity')}
                            </p>
                          </div>
                          <div className="text-center">
                            <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-luxury-red mx-auto mb-1" />
                            <p className="text-xs text-luxury-black/70 font-luxury mb-0.5">Speed</p>
                            <p className="text-sm sm:text-base font-luxury font-light text-luxury-black">
                              {specs.speed ? `${specs.speed} KTS` : plane.cruise_speed ? `${plane.cruise_speed} km/h` : 'N/A'}
                            </p>
                          </div>
                          <div className="text-center">
                            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-luxury-red mx-auto mb-1" />
                            <p className="text-xs text-luxury-black/70 font-luxury mb-0.5">Base</p>
                            <p className="text-sm sm:text-base font-luxury font-light text-luxury-black">
                              {getSpecValue(plane, 'base')}
                            </p>
                          </div>
                          <div className="text-center">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-luxury-red mx-auto mb-1" />
                            <p className="text-xs text-luxury-black/70 font-luxury mb-0.5">YOM</p>
                            <p className="text-sm sm:text-base font-luxury font-light text-luxury-black">
                              {getSpecValue(plane, 'yearOfManufacture')}
                            </p>
                          </div>
                          <div className="text-center">
                            <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-luxury-red mx-auto mb-1" />
                            <p className="text-xs text-luxury-black/70 font-luxury mb-0.5">Pilots</p>
                            <p className="text-sm sm:text-base font-luxury font-light text-luxury-black">
                              {getSpecValue(plane, 'pilots', '2')}
                            </p>
                          </div>
                          <div className="text-center">
                            <User className="h-4 w-4 sm:h-5 sm:w-5 text-luxury-red mx-auto mb-1" />
                            <p className="text-xs text-luxury-black/70 font-luxury mb-0.5">Flight Attendant</p>
                            <p className="text-sm sm:text-base font-luxury font-light text-luxury-black">
                              {specs.flightAttendant ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>

                        {/* Baggage */}
                        <div className="mb-4 pb-4 border-b border-luxury-black/10">
                          <div className="flex items-center justify-center space-x-2">
                            <Luggage className="h-4 w-4 text-luxury-red" />
                            <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury">
                              <span className="font-medium">Baggage:</span>{' '}
                              {getSpecValue(plane, 'baggageCapacity', 'baggage')}
                            </p>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Link
                          to={`/aircraft/${plane.id}`}
                          className="w-full flex items-center justify-center space-x-2 bg-luxury-red text-white px-4 py-3 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase text-xs sm:text-sm shadow-lg"
                        >
                          <span>View Details</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8 sm:mt-12">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-luxury-black/20 rounded-lg font-luxury tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-luxury-white-off transition"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg font-luxury tracking-wide text-sm transition ${
                              currentPage === page
                                ? 'bg-luxury-red text-white'
                                : 'border border-luxury-black/20 hover:bg-luxury-white-off'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-luxury-black/50">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-luxury-black/20 rounded-lg font-luxury tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-luxury-white-off transition"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Results Count */}
              <div className="text-center mt-6 text-sm text-luxury-black/70 font-luxury tracking-wide">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAircraft.length)} of {filteredAircraft.length} aircraft
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-luxury-white-off">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-luxury font-light text-luxury-black mb-4 sm:mb-6 tracking-luxury">
            Need Help Choosing?
          </h2>
          <p className="text-lg sm:text-xl text-luxury-black/70 mb-6 sm:mb-8 leading-relaxed font-luxury tracking-wide">
            Skyriting aviation experts are available 24/7 to help you select the perfect aircraft
            for your journey. We consider your route, passenger count, luggage requirements,
            and budget to recommend the ideal solution.
          </p>
          <a
            href="mailto:info@skyriting.com?subject=Expert Consultation Request"
            className="inline-flex items-center space-x-2 bg-luxury-red text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg text-sm sm:text-base"
          >
            <span>Get Expert Consultation</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
