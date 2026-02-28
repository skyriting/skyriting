import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plane, Users, Gauge, Filter, X, SlidersHorizontal } from 'lucide-react';
import { searchFlights, type SearchResult } from '../lib/api';
import type { SearchRequest } from '../lib/api';
import EnquiryForm from '../components/EnquiryForm';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    aircraftClass: 'all',
    minCapacity: 1,
    amenities: [] as string[],
    minPrice: 0,
    maxPrice: 1000000,
    sortBy: 'price' as 'price' | 'capacity' | 'speed',
  });

  const searchData = location.state as SearchRequest;

  useEffect(() => {
    if (!searchData) {
      navigate('/');
      return;
    }
    performSearch();
  }, [filters]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchFlights({
        ...searchData,
        filters: {
          ...filters,
          amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        },
      });
      setResults(response.results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const handleAircraftClick = (aircraftId: string, result: SearchResult) => {
    navigate(`/aircraft/${aircraftId}`, { 
      state: { 
        searchData, 
        filters,
        pricing: result.pricing,
        legs: searchData.legs,
        tripType: searchData.tripType,
        aircraft: result.aircraft
      } 
    });
  };

  const amenityOptions = ['WiFi', 'Entertainment', 'Catering', 'Lavatory', 'Flight Attendant'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-luxury-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Search Results</h1>
            <p className="text-luxury-black/70 font-luxury tracking-wide">
              {results.length} aircraft found
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-luxury-black/20 rounded-lg hover:bg-luxury-white-off font-luxury tracking-wide"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-luxury font-light text-luxury-black flex items-center tracking-luxury">
                    <Filter className="h-5 w-5 mr-2 text-luxury-red" />
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Aircraft Class */}
                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                      Aircraft Class
                    </label>
                    <select
                      value={filters.aircraftClass}
                      onChange={(e) => setFilters({ ...filters, aircraftClass: e.target.value })}
                      className="w-full border border-luxury-black/20 rounded-lg px-3 py-2 font-luxury tracking-wide focus:border-luxury-red focus:outline-none"
                    >
                      <option value="all">All Classes</option>
                      <option value="Light">Light</option>
                      <option value="Mid">Mid</option>
                      <option value="Super Mid">Super Mid</option>
                      <option value="Large">Large</option>
                      <option value="Airliner">Airliner</option>
                      <option value="Helicopter">Helicopter</option>
                    </select>
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                      Minimum Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={filters.minCapacity}
                      onChange={(e) => setFilters({ ...filters, minCapacity: parseInt(e.target.value) || 1 })}
                      className="w-full border border-luxury-black/20 rounded-lg px-3 py-2 font-luxury tracking-wide focus:border-luxury-red focus:outline-none"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                      Price Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) || 0 })}
                        className="w-full border border-luxury-black/20 rounded-lg px-3 py-2 font-luxury tracking-wide focus:border-luxury-red focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ''}
                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) || 1000000 })}
                        className="w-full border border-luxury-black/20 rounded-lg px-3 py-2 font-luxury tracking-wide focus:border-luxury-red focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                      Amenities
                    </label>
                    <div className="space-y-2">
                      {amenityOptions.map((amenity) => (
                        <label key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({ ...filters, amenities: [...filters.amenities, amenity] });
                              } else {
                                setFilters({ ...filters, amenities: filters.amenities.filter(a => a !== amenity) });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                      className="w-full border border-luxury-black/20 rounded-lg px-3 py-2 font-luxury tracking-wide focus:border-luxury-red focus:outline-none"
                    >
                      <option value="price">Price (Low to High)</option>
                      <option value="capacity">Capacity</option>
                      <option value="speed">Speed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto"></div>
                <p className="mt-4 text-luxury-black/70 font-luxury tracking-wide">Searching for flights...</p>
              </div>
            ) : error ? (
              <div className="bg-luxury-red/10 border border-luxury-red/20 rounded-lg p-6 text-center">
                <p className="text-luxury-red font-luxury tracking-wide">{error}</p>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center border border-luxury-black/10">
                <Plane className="h-16 w-16 text-luxury-black/20 mx-auto mb-4" />
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">No aircraft found</h3>
                <p className="text-luxury-black/70 font-luxury tracking-wide">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Aircraft Image */}
                      <div className="md:w-48 flex-shrink-0">
                        {result.aircraft.image_url ? (
                          <img
                            src={result.aircraft.image_url}
                            alt={result.aircraft.name}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-32 bg-luxury-black/5 rounded-lg flex items-center justify-center">
                            <Plane className="h-12 w-12 text-luxury-black/20" />
                          </div>
                        )}
                      </div>

                      {/* Aircraft Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
                          {result.aircraft.name}
                        </h3>
                        <p className="text-luxury-black/70 mb-4 font-luxury tracking-wide">{result.aircraft.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-luxury-red" />
                            <div>
                              <p className="text-sm text-luxury-black/70 font-luxury">Capacity</p>
                              <p className="font-luxury font-light text-luxury-black">{result.aircraft.passenger_capacity}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Gauge className="h-5 w-5 text-luxury-red" />
                            <div>
                              <p className="text-sm text-luxury-black/70 font-luxury">Speed</p>
                              <p className="font-luxury font-light text-luxury-black">{result.aircraft.cruise_speed} km/h</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Plane className="h-5 w-5 text-luxury-red" />
                            <div>
                              <p className="text-sm text-luxury-black/70 font-luxury">Range</p>
                              <p className="font-luxury font-light text-luxury-black">{result.aircraft.range_km} km</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-luxury-black/70 font-luxury">Category</p>
                            <p className="font-luxury font-light text-luxury-black">{result.aircraft.category}</p>
                          </div>
                        </div>

                        {result.aircraft.amenities && result.aircraft.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {result.aircraft.amenities.slice(0, 4).map((amenity, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-luxury-red/10 text-luxury-red text-xs rounded font-luxury tracking-wide"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="md:w-48 flex-shrink-0 text-right">
                        <p className="text-sm text-luxury-black/70 mb-1 font-luxury">Total Cost</p>
                        <p className="text-2xl font-luxury font-light text-luxury-red mb-4">
                          {formatCurrency(result.pricing.totalCost, result.currency)}
                        </p>
                        <div className="mb-3">
                          <EnquiryForm
                            aircraftId={result.aircraft._id || result.aircraft.id}
                            aircraftName={result.aircraft.name}
                            price={result.pricing.totalCost}
                            currency={result.currency}
                          />
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAircraftClick(result.aircraft._id, result);
                          }}
                          className="w-full bg-luxury-red text-white py-2 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
