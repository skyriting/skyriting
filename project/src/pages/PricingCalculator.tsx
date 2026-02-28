import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Plane, Users, Calendar, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import { getAircraft, getRouteDistance } from '../lib/api';
import type { Aircraft, City } from '../lib/types';
import CitySelector from '../components/CitySelector';

export default function PricingCalculator() {
  const navigate = useNavigate();
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [departureCityData, setDepartureCityData] = useState<City | null>(null);
  const [arrivalCityData, setArrivalCityData] = useState<City | null>(null);

  const [formData, setFormData] = useState({
    departureCity: '',
    arrivalCity: '',
    passengers: 1,
    distance: 0,
    selectedCategory: 'all',
  });

  const [estimates, setEstimates] = useState<{
    aircraft: Aircraft;
    flightHours: number;
    baseCost: number;
    landingFees: number;
    groundHandling: number;
    gst: number;
    totalCost: number;
  }[]>([]);

  useEffect(() => {
    fetchAircraft();
  }, []);

  useEffect(() => {
    if (departureCityData && arrivalCityData) {
      fetchRouteDistance();
    }
  }, [departureCityData, arrivalCityData]);

  const fetchRouteDistance = async () => {
    if (!departureCityData || !arrivalCityData) return;

    try {
      const depId = departureCityData._id || departureCityData.id;
      const arrId = arrivalCityData._id || arrivalCityData.id;
      if (depId && arrId) {
        const data = await getRouteDistance(depId, arrId);
        if (data && data.distance_km) {
          setFormData(prev => ({ ...prev, distance: data.distance_km }));
        }
      }
    } catch (error) {
      console.error('Error fetching route distance:', error);
    }
  };

  const fetchAircraft = async () => {
    try {
      const data = await getAircraft();
      const transformedAircraft = data
        .filter((a: any) => a.available !== false)
        .map((a: any) => ({
          ...a,
          id: a._id || a.id,
        }))
        .sort((a: any, b: any) => a.hourly_rate - b.hourly_rate);
      setAircraft(transformedAircraft);
    } catch (error) {
      console.error('Error fetching aircraft:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (formData.distance === 0) {
      alert('Please enter flight distance');
      return;
    }

    const filtered = formData.selectedCategory === 'all'
      ? aircraft
      : aircraft.filter(a => a.category === formData.selectedCategory);

    const calculations = filtered
      .filter(a => a.passenger_capacity >= formData.passengers)
      .map(a => {
        const flightHours = formData.distance / a.cruise_speed;
        const baseCost = a.hourly_rate * flightHours;
        const landingFees = 25000;
        const groundHandling = 15000;
        const subtotal = baseCost + landingFees + groundHandling;
        const gst = subtotal * 0.18;
        const totalCost = subtotal + gst;

        return {
          aircraft: a,
          flightHours: Math.round(flightHours * 100) / 100,
          baseCost,
          landingFees,
          groundHandling,
          gst,
          totalCost,
        };
      })
      .sort((a, b) => a.totalCost - b.totalCost);

    setEstimates(calculations);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const categories = ['all', 'Turboprop', 'Light', 'MidSize', 'Super MidSize', 'Large', 'Airliner', 'Helicopter'];

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-luxury tracking-wide text-sm sm:text-base">Instant Quote</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">Skyriting Pricing Calculator</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            Get instant pricing estimates for your private aviation needs.
            Compare aircraft options and find the perfect solution for your journey.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-luxury-white-off rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 border border-luxury-black/5">
            <h2 className="text-2xl sm:text-3xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">Flight Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <CitySelector
                label="Departure City"
                value={formData.departureCity}
                onChange={(city, cityData) => {
                  setFormData({ ...formData, departureCity: city });
                  if (cityData) setDepartureCityData(cityData as City);
                }}
                placeholder="Select departure city"
              />
              <CitySelector
                label="Arrival City"
                value={formData.arrivalCity}
                onChange={(city, cityData) => {
                  setFormData({ ...formData, arrivalCity: city });
                  if (cityData) setArrivalCityData(cityData as City);
                }}
                placeholder="Select arrival city"
              />
            </div>

            {formData.distance > 0 && (
              <div className="mb-4 flex items-center space-x-2 bg-luxury-red/10 border border-luxury-red/20 rounded-lg px-4 py-2">
                <Zap className="h-4 w-4 text-luxury-red" />
                <p className="text-sm text-luxury-red font-luxury tracking-wide">
                  Distance auto-calculated: <span className="font-luxury font-light">{formData.distance} km</span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  <TrendingUp className="inline h-4 w-4 mr-1" />
                  Flight Distance (km)
                </label>
                <input
                  type="number"
                  value={formData.distance || ''}
                  onChange={(e) => setFormData({ ...formData, distance: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                  placeholder="Auto-fills from route or enter manually"
                />
                <p className="text-xs text-luxury-black/50 mt-1 font-luxury">Or enter manually if route not found</p>
              </div>
              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  <Users className="inline h-4 w-4 mr-1" />
                  Passengers
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                />
              </div>
              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  <Plane className="inline h-4 w-4 mr-1" />
                  Aircraft Category
                </label>
                <select
                  value={formData.selectedCategory}
                  onChange={(e) => setFormData({ ...formData, selectedCategory: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Aircraft' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={calculatePrice}
              className="w-full bg-luxury-red text-white py-4 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase text-lg shadow-lg flex items-center justify-center space-x-2"
            >
              <Calculator className="h-5 w-5" />
              <span>Calculate Pricing</span>
            </button>
          </div>

          {estimates.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">
                Pricing Estimates ({estimates.length} Options Available)
              </h2>

              {estimates.map((est, index) => (
                <div key={est.aircraft.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-luxury-black/10 hover:border-luxury-red transition">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {index === 0 && (
                            <span className="bg-luxury-red/20 text-luxury-red px-3 py-1 rounded-full text-xs font-luxury tracking-wide">
                              BEST VALUE
                            </span>
                          )}
                          <span className="bg-luxury-red/20 text-luxury-red px-3 py-1 rounded-full text-xs font-luxury tracking-wide">
                            {est.aircraft.category}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-luxury font-light text-luxury-black mb-1 tracking-luxury">
                          {est.aircraft.name}
                        </h3>
                        <p className="text-luxury-black/70 mb-3 font-luxury tracking-wide">{est.aircraft.manufacturer}</p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-luxury-black/70 font-luxury">Flight Time</p>
                            <p className="font-luxury font-light text-luxury-black">{est.flightHours}h</p>
                          </div>
                          <div>
                            <p className="text-luxury-black/70 font-luxury">Seats</p>
                            <p className="font-luxury font-light text-luxury-black">{est.aircraft.passenger_capacity}</p>
                          </div>
                          <div>
                            <p className="text-luxury-black/70 font-luxury">Hourly Rate</p>
                            <p className="font-luxury font-light text-luxury-black">{formatPrice(est.aircraft.hourly_rate)}</p>
                          </div>
                          <div>
                            <p className="text-luxury-black/70 font-luxury">Speed</p>
                            <p className="font-luxury font-light text-luxury-black">{est.aircraft.cruise_speed} km/h</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-center lg:text-right">
                        <p className="text-sm text-luxury-black/70 mb-1 font-luxury">Estimated Total</p>
                        <p className="text-3xl sm:text-4xl font-luxury font-light text-luxury-red mb-2">
                          {formatPrice(est.totalCost)}
                        </p>
                        <a
                          href={`mailto:info@skyriting.com?subject=Booking Request for ${est.aircraft.name}&body=Departure: ${formData.departureCity}%0D%0AArrival: ${formData.arrivalCity}%0D%0AAircraft: ${est.aircraft.name}%0D%0AEstimated Cost: ${formatPrice(est.totalCost)}`}
                          className="bg-luxury-red text-white px-6 py-2 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase inline-flex items-center space-x-2"
                        >
                          <span>Book Now</span>
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-luxury-black/70 font-luxury">Base Cost</p>
                        <p className="font-luxury font-light text-luxury-black">{formatPrice(est.baseCost)}</p>
                      </div>
                      <div>
                        <p className="text-luxury-black/70 font-luxury">Landing Fees</p>
                        <p className="font-luxury font-light text-luxury-black">{formatPrice(est.landingFees)}</p>
                      </div>
                      <div>
                        <p className="text-luxury-black/70 font-luxury">Ground Handling</p>
                        <p className="font-luxury font-light text-luxury-black">{formatPrice(est.groundHandling)}</p>
                      </div>
                      <div>
                        <p className="text-luxury-black/70 font-luxury">GST (18%)</p>
                        <p className="font-luxury font-light text-luxury-black">{formatPrice(est.gst)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {estimates.length === 0 && !loading && formData.distance > 0 && (
            <div className="text-center py-12 bg-luxury-white-off rounded-xl border border-luxury-black/5">
              <p className="text-xl text-luxury-black/70 font-luxury">No aircraft available for the selected criteria</p>
              <p className="text-luxury-black/50 mt-2 font-luxury tracking-wide">Try adjusting your passenger count or aircraft category</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-luxury-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-luxury font-light text-luxury-black mb-6 text-center tracking-luxury">
            Pricing Includes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              'Aircraft charter for specified duration',
              'Experienced flight crew',
              'Landing and parking fees',
              'Ground handling services',
              'Fuel and aircraft positioning',
              'Standard catering and beverages',
              'Basic in-flight entertainment',
              'All applicable taxes (GST)'
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg border border-luxury-black/5">
                <div className="bg-luxury-red/10 rounded-full p-1 mt-0.5">
                  <ArrowRight className="h-4 w-4 text-luxury-red" />
                </div>
                <span className="text-luxury-black/70 font-luxury tracking-wide">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-luxury-red/5 border-2 border-luxury-red/20 rounded-xl p-6">
            <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">Additional Services Available</h3>
            <ul className="space-y-2 text-luxury-black/70 font-luxury tracking-wide">
              <li>• Premium catering and special dietary requirements</li>
              <li>• Ground transportation (luxury cars, helicopters)</li>
              <li>• Hotel and accommodation arrangements</li>
              <li>• Special permits and international clearances</li>
              <li>• Customized branding and decorations</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
