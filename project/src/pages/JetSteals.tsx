import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, TrendingDown, Clock } from 'lucide-react';
import { getEmptyLegs } from '../lib/api';
import type { EmptyLeg } from '../lib/types';

export default function JetSteals() {
  const [emptyLegs, setEmptyLegs] = useState<EmptyLeg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmptyLegs();
  }, []);

  const fetchEmptyLegs = async () => {
    try {
      const data = await getEmptyLegs();
      const now = new Date().toISOString();
      const transformedLegs = (data || [])
        .filter((leg: any) => leg.available !== false && leg.departure_date >= now)
        .map((leg: any) => ({
          ...leg,
          id: leg._id || leg.id,
        }))
        .sort((a: any, b: any) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime());
      setEmptyLegs(transformedLegs);
    } catch (error) {
      console.error('Error fetching empty legs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleBookNow = (emptyLeg: EmptyLeg) => {
    window.location.href = `mailto:info@skyriting.com?subject=JetSteals Booking Request&body=Departure: ${emptyLeg.departure_city}%0D%0AArrival: ${emptyLeg.arrival_city}%0D%0ADate: ${emptyLeg.departure_date}%0D%0AAircraft: ${emptyLeg.aircraft_name}`;
        arrivalCity: emptyLeg.arrival_city,
        departureDate: emptyLeg.departure_date.split('T')[0],
        passengerCount: emptyLeg.passenger_capacity,
        enquiryType: 'empty_leg',
        emptyLegId: emptyLeg.id,
      },
    });
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
            <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-luxury tracking-wide text-sm sm:text-base">Save up to 75%</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">Skyriting JetSteals</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            Take advantage of Skyriting repositioning flights at unbeatable prices.
            These flights are already scheduled, offering you luxury private aviation
            at a fraction of the regular charter cost.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/5">
              <div className="bg-luxury-red/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <TrendingDown className="h-6 w-6 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Huge Savings</h3>
              <p className="text-luxury-black/70 font-luxury tracking-wide">
                Save 30-75% off regular charter rates on already scheduled flights
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/5">
              <div className="bg-luxury-red/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Limited Availability</h3>
              <p className="text-luxury-black/70 font-luxury tracking-wide">
                These exclusive deals are time-sensitive and fill up quickly
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/5">
              <div className="bg-luxury-red/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Same Luxury</h3>
              <p className="text-luxury-black/70 font-luxury tracking-wide">
                Enjoy the same premium service and comfort at discounted prices
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto"></div>
              <p className="mt-4 text-luxury-black/70 font-luxury tracking-wide">Loading available deals...</p>
            </div>
          ) : emptyLegs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {emptyLegs.map((emptyLeg) => (
                <div
                  key={emptyLeg.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-luxury-black/10"
                >
                  <div className="bg-gradient-to-r from-luxury-black to-black p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5" />
                        <span className="text-2xl font-luxury font-light tracking-luxury">{emptyLeg.departure_city}</span>
                      </div>
                      <div className="text-center px-4">
                        <div className="w-16 h-0.5 bg-white/50"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-luxury font-light tracking-luxury">{emptyLeg.arrival_city}</span>
                        <MapPin className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-white/80">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-luxury tracking-wide">{formatDate(emptyLeg.departure_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-luxury tracking-wide">{emptyLeg.departure_time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-luxury-black/70 font-luxury tracking-wide">
                        <Users className="h-5 w-5" />
                        <span>Up to {emptyLeg.passenger_capacity} passengers</span>
                      </div>
                      <div className="bg-luxury-red/20 text-luxury-red px-3 py-1 rounded-full text-sm font-luxury tracking-wide">
                        {emptyLeg.discount_percentage}% OFF
                      </div>
                    </div>

                    <div className="border-t border-luxury-black/10 pt-4 flex items-end justify-between">
                      <div>
                        <p className="text-sm text-luxury-black/50 line-through font-luxury">
                          {formatPrice(emptyLeg.standard_price)}
                        </p>
                        <p className="text-3xl font-luxury font-light text-luxury-red">
                          {formatPrice(emptyLeg.final_price)}
                        </p>
                        <p className="text-xs text-luxury-black/70 mt-1 font-luxury tracking-wide">
                          Save {formatPrice(emptyLeg.standard_price - emptyLeg.final_price)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBookNow(emptyLeg)}
                        className="bg-luxury-red text-white px-6 py-3 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-luxury-black/5">
              <TrendingDown className="h-16 w-16 text-luxury-black/20 mx-auto mb-4" />
              <h3 className="text-2xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">No Empty Legs Available</h3>
              <p className="text-luxury-black/70 mb-6 font-luxury tracking-wide">
                Check back soon for new deals, or contact us for regular charter options.
              </p>
              <button
                onClick={() => window.location.href = 'mailto:info@skyriting.com?subject=Explore Charter Options'}
                className="bg-luxury-red text-white px-8 py-3 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase"
              >
                Explore Charter Options
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-luxury font-light text-luxury-black mb-6 sm:mb-8 text-center tracking-luxury">How Skyriting JetSteals Work</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-luxury-red/20 text-luxury-red w-8 h-8 rounded-full flex items-center justify-center font-luxury font-light flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Repositioning Flights</h3>
                <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                  When an aircraft completes a charter and needs to return to base or reposition
                  for its next booking, it creates an empty leg opportunity.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-luxury-red/20 text-luxury-red w-8 h-8 rounded-full flex items-center justify-center font-luxury font-light flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Significant Discounts</h3>
                <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                  Since the flight is already scheduled, we offer these seats at 30-75% off
                  the regular charter price, making luxury aviation more accessible.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-luxury-red/20 text-luxury-red w-8 h-8 rounded-full flex items-center justify-center font-luxury font-light flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Book Quickly</h3>
                <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                  These deals are time-sensitive and based on aircraft availability.
                  Contact us immediately when you find a route that matches your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
