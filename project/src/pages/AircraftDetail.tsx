import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  MapPin, 
  UserCheck, 
  Luggage, 
  Gauge, 
  User, 
  Plane,
  ChevronRight,
  ArrowLeft,
  Image as ImageIcon,
  Clock,
  DollarSign
} from 'lucide-react';
import { getAircraftById } from '../lib/api';
import EnquiryForm from '../components/EnquiryForm';

export default function AircraftDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [aircraft, setAircraft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const locationState = location.state as any; // Search results data with pricing
  const searchData = locationState?.searchData || locationState;
  const pricing = locationState?.pricing;
  const legs = locationState?.legs || searchData?.legs;
  const tripType = locationState?.tripType || searchData?.tripType;

  useEffect(() => {
    if (id) {
      fetchAircraft();
    }
  }, [id]);

  const fetchAircraft = async () => {
    try {
      const data = await getAircraftById(id!);
      setAircraft(data);
    } catch (error) {
      console.error('Error fetching aircraft:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-luxury-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto"></div>
          <p className="mt-4 text-luxury-black/70 font-luxury tracking-wide">Loading aircraft details...</p>
        </div>
      </div>
    );
  }

  if (!aircraft) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-luxury-white">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-luxury-black/10">
          <h2 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">Aircraft not found</h2>
          <button 
            onClick={() => navigate('/fleet')} 
            className="text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide"
          >
            Return to Fleet
          </button>
        </div>
      </div>
    );
  }

  const specs = aircraft.specs || {};
  const interiorPhotos = aircraft.interiorPhotos || [];
  const rangeMapImage = aircraft.rangeMapImage || aircraft.image_url;

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-luxury-white">
      {/* Breadcrumb */}
      <section className="bg-luxury-white py-3 sm:py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <Link to="/fleet" className="hover:text-luxury-red transition">Fleet Listing</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-luxury-black truncate max-w-[200px] sm:max-w-none">{aircraft.name}</span>
          </nav>
        </div>
      </section>

      {/* Header Section */}
      <section className="bg-gradient-to-br from-luxury-black to-black text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Content */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light mb-2 sm:mb-4 tracking-luxury">
              Premium High Class Fleet
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 font-luxury tracking-wide mb-6 sm:mb-8">
              The new generation of private jets
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-luxury font-light tracking-luxury">
              {aircraft.name}
            </h2>
            <p className="text-lg sm:text-xl text-luxury-red mt-2 font-luxury tracking-wide uppercase">
              {aircraft.category || aircraft.type} Jet
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Description */}
          <div className="mb-8 sm:mb-12">
            <p className="text-base sm:text-lg text-luxury-black/70 leading-relaxed font-luxury tracking-wide max-w-4xl">
              {aircraft.description || `A ${aircraft.category || aircraft.type} aircraft ${aircraft.manufacturer ? `by ${aircraft.manufacturer}` : ''} with a seating capacity of ${specs.seats || aircraft.passenger_capacity || 'N/A'}. ${aircraft.name} is known for its exceptional performance and luxury amenities.`}
            </p>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-luxury-black/5 text-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury mb-1">Seats</p>
              <p className="text-lg sm:text-xl font-luxury font-light text-luxury-black">
                {specs.seats || aircraft.passenger_capacity || 'N/A'}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-luxury-black/5 text-center">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury mb-1">YOM</p>
              <p className="text-lg sm:text-xl font-luxury font-light text-luxury-black">
                {specs.yearOfManufacture || 'N/A'}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-luxury-black/5 text-center">
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury mb-1">Base</p>
              <p className="text-lg sm:text-xl font-luxury font-light text-luxury-black">
                {specs.base || 'N/A'}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-luxury-black/5 text-center">
              <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury mb-1">Pilots</p>
              <p className="text-lg sm:text-xl font-luxury font-light text-luxury-black">
                {specs.pilots || 2}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-luxury-black/5 text-center">
              <Luggage className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury mb-1">Baggage</p>
              <p className="text-lg sm:text-xl font-luxury font-light text-luxury-black">
                {specs.baggageCapacity || specs.baggage || 'N/A'}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-luxury-black/5 text-center">
              <Gauge className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury mb-1">Speed</p>
              <p className="text-lg sm:text-xl font-luxury font-light text-luxury-black">
                {specs.speed ? `${specs.speed} KTS` : aircraft.cruise_speed ? `${aircraft.cruise_speed} km/h` : 'N/A'}
              </p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-luxury-black/5 text-center">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-luxury-black/70 font-luxury mb-1">Flight Attendant</p>
              <p className="text-lg sm:text-xl font-luxury font-light text-luxury-black">
                {specs.flightAttendant ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          {/* Interior Photos Section */}
          {interiorPhotos.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl font-luxury font-light text-luxury-black mb-4 sm:mb-6 tracking-luxury">
                Interior Photos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {interiorPhotos.map((photo: string, index: number) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg border border-luxury-black/10"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={photo}
                      alt={`Interior ${index + 1}`}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Range Map Section */}
          {rangeMapImage && (
            <div className="mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl font-luxury font-light text-luxury-black mb-4 sm:mb-6 tracking-luxury">
                Range Map
              </h3>
              <div className="bg-white rounded-lg shadow-lg border border-luxury-black/10 overflow-hidden">
                <img
                  src={rangeMapImage}
                  alt="Range Map"
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Detailed Specifications Table */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-luxury font-light text-luxury-black mb-4 sm:mb-6 tracking-luxury">
              Specifications
            </h3>
            <div className="bg-white rounded-lg shadow-lg border border-luxury-black/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-luxury-black text-white">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-luxury tracking-wide text-sm sm:text-base">Specification</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-luxury tracking-wide text-sm sm:text-base">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-luxury-black/10">
                    <tr className="hover:bg-luxury-white-off transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Aircraft Type</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{aircraft.category || aircraft.type || 'N/A'}</td>
                    </tr>
                    <tr className="hover:bg-luxury-white-off transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Baggage Capacity</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{specs.baggageCapacity || specs.baggage || 'N/A'}</td>
                    </tr>
                    <tr className="hover:bg-luxury-white-off transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Cruise Speed</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">
                        {specs.speed ? `${specs.speed} KTS` : aircraft.cruise_speed ? `${aircraft.cruise_speed} km/h` : 'N/A'}
                      </td>
                    </tr>
                    <tr className="hover:bg-luxury-white-off transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Passenger</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{specs.seats || aircraft.passenger_capacity || 'N/A'}</td>
                    </tr>
                    <tr className="hover:bg-luxury-white-off transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Year of Manufacture</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{specs.yearOfManufacture || 'N/A'}</td>
                    </tr>
                    <tr className="hover:bg-luxury-white-off transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Home Base</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{specs.base || 'N/A'}</td>
                    </tr>
                    <tr className="hover:bg-luxury-white-off transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Pilots</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{specs.pilots || 2}</td>
                    </tr>
                    <tr className="hover:bg-luxury-white-off transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Cabin Crew</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{specs.flightAttendant ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr className="hover:bg-luxury-white-off transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Flying Range</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">
                        {specs.flyingRange || (aircraft.range_km ? `${aircraft.range_km} km` : 'N/A')}
                      </td>
                    </tr>
                    {specs.cabinHeight && (
                      <tr className="hover:bg-luxury-white-off transition">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Cabin Height</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{specs.cabinHeight}</td>
                      </tr>
                    )}
                    {specs.cabinWidth && (
                      <tr className="hover:bg-luxury-white-off transition">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Cabin Width</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{specs.cabinWidth}</td>
                      </tr>
                    )}
                    {specs.cabinLength && (
                      <tr className="hover:bg-luxury-white-off transition">
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Cabin Length</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{specs.cabinLength}</td>
                      </tr>
                    )}
                    <tr className="hover:bg-luxury-white-off transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury tracking-wide text-luxury-black/70">Lavatory</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 font-luxury font-light text-luxury-black">{specs.lavatory || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Flight Details & Cost Breakdown (from search) */}
          {legs && legs.length > 0 && pricing && (
            <div className="mb-8 sm:mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Flight Details */}
                <div className="bg-white rounded-lg shadow-lg border border-luxury-black/10 p-6">
                  <h3 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury flex items-center">
                    <Plane className="h-6 w-6 mr-2 text-luxury-red" />
                    Flight Details
                  </h3>
                  <div className="space-y-4">
                    {legs.map((leg: any, index: number) => (
                      <div key={index} className="border-l-2 border-luxury-red pl-4 pb-4 last:pb-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-4 w-4 text-luxury-red" />
                          <span className="font-luxury font-medium text-luxury-black tracking-wide">
                            {leg.origin} → {leg.destination}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-luxury-black/70 font-luxury tracking-wide">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(leg.departureDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{leg.departureTime || '00:00'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{leg.paxCount} Passengers</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white rounded-lg shadow-lg border border-luxury-black/10 p-6">
                  <h3 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury flex items-center">
                    <DollarSign className="h-6 w-6 mr-2 text-luxury-red" />
                    Cost Details
                  </h3>
                  <div className="space-y-3">
                    {pricing.flightCost && (
                      <div className="flex justify-between items-center py-2 border-b border-luxury-black/10">
                        <span className="text-sm font-luxury tracking-wide text-luxury-black/70">
                          Flight Cost {pricing.totalHours ? `(@ ₹${Math.round((pricing.flightCost / pricing.totalHours)).toLocaleString('en-IN')} per hour)` : ''}
                        </span>
                        <span className="font-luxury font-light text-luxury-black">
                          ₹ {pricing.flightCost?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                    )}
                    {pricing.airportHandling && (
                      <div className="flex justify-between items-center py-2 border-b border-luxury-black/10">
                        <span className="text-sm font-luxury tracking-wide text-luxury-black/70">Airport handling charges</span>
                        <span className="font-luxury font-light text-luxury-black">
                          ₹ {pricing.airportHandling?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                    )}
                    {pricing.subtotal && (
                      <div className="flex justify-between items-center py-2 border-b border-luxury-black/20">
                        <span className="font-luxury tracking-wide text-luxury-black">Sub total</span>
                        <span className="font-luxury font-light text-luxury-black">
                          ₹ {pricing.subtotal?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                    )}
                    {pricing.taxAmount && (
                      <div className="flex justify-between items-center py-2 border-b border-luxury-black/10">
                        <span className="text-sm font-luxury tracking-wide text-luxury-black/70">
                          GST ({pricing.taxRate || 18}%)
                        </span>
                        <span className="font-luxury font-light text-luxury-black">
                          ₹ {pricing.taxAmount?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-3 border-t-2 border-luxury-red mt-2">
                      <span className="text-lg font-luxury font-medium tracking-wide text-luxury-black">Estimated cost</span>
                      <span className="text-2xl font-luxury font-light text-luxury-red">
                        ₹ {pricing.totalCost?.toLocaleString('en-IN') || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enquiry Form (if from search) */}
          {pricing && (
            <div className="mb-8 sm:mb-12">
              <EnquiryForm
                aircraftId={aircraft._id || aircraft.id}
                aircraftName={aircraft.name}
                price={pricing.totalCost}
                currency={pricing.currency || 'INR'}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button
              onClick={() => navigate(legs && pricing ? '/search-results' : '/fleet')}
              className="flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-luxury-white-off text-luxury-black rounded-lg hover:bg-luxury-white-cream transition font-luxury tracking-wide border border-luxury-black/10"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>{legs && pricing ? 'Back to Search' : 'Back to Fleet'}</span>
            </button>
            <a
              href="mailto:info@skyriting.com?subject=Booking Request for ${aircraft.name}"
              className="flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-luxury-red text-white rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg"
            >
              <span>Book This Aircraft</span>
              <Plane className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
