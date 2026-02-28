import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, Plane, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import { createEnquiry } from '../lib/api';
import CitySelector from '../components/CitySelector';

export default function Book() {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    aircraftType: 'jet',
    tripType: 'one_way',
    departureCity: '',
    arrivalCity: '',
    departureDate: '',
    returnDate: '',
    passengerCount: 1,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    countryCode: '+91',
    message: '',
  });

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({ ...prev, ...location.state }));
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const enquiryData = {
        enquiry_type: (location.state as any)?.enquiryType || 'charter',
        aircraft_type: formData.aircraftType,
        trip_type: formData.tripType,
        departure_city: formData.departureCity,
        arrival_city: formData.arrivalCity,
        departure_date: new Date(formData.departureDate).toISOString(),
        return_date: formData.returnDate ? new Date(formData.returnDate).toISOString() : null,
        passenger_count: formData.passengerCount,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: `${formData.countryCode} ${formData.customerPhone}`,
        message: formData.message || null,
        status: 'new',
      };

      await createEnquiry(enquiryData);

      setSubmitted(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('There was an error submitting your enquiry. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-luxury-white flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-luxury-black/5">
            <div className="bg-luxury-red/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-luxury-red" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">Skyriting Enquiry Received</h2>
            <p className="text-sm sm:text-base text-luxury-black/70 mb-6 leading-relaxed font-luxury tracking-wide">
              Thank you for choosing Skyriting. Our aviation experts will review
              your request and contact you within 2-4 hours with a detailed quote.
            </p>
            <p className="text-xs sm:text-sm text-luxury-black/50 font-luxury tracking-wide">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-luxury-white">
      <section className="py-8 sm:py-12 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light mb-3 sm:mb-4 tracking-luxury">Book Your Skyriting Flight</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 font-luxury tracking-wide">
            Complete the form below and our team will provide you with a customized quote
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-luxury-black/5">
            <div className="mb-8">
              <h2 className="text-2xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">Flight Details</h2>

              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, aircraftType: 'jet' })}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-luxury tracking-wide transition ${
                    formData.aircraftType === 'jet'
                      ? 'bg-luxury-red text-white shadow-lg'
                      : 'bg-luxury-white-off text-luxury-black/70 hover:bg-luxury-white-off/80 border border-luxury-black/10'
                  }`}
                >
                  <Plane className="h-5 w-5" />
                  <span>Private Jet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, aircraftType: 'helicopter' })}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-luxury tracking-wide transition ${
                    formData.aircraftType === 'helicopter'
                      ? 'bg-luxury-red text-white shadow-lg'
                      : 'bg-luxury-white-off text-luxury-black/70 hover:bg-luxury-white-off/80 border border-luxury-black/10'
                  }`}
                >
                  <Plane className="h-5 w-5 rotate-45" />
                  <span>Helicopter</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {['one_way', 'round_trip', 'multi_trip'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, tripType: type })}
                    className={`px-4 py-2 rounded-lg text-sm font-luxury tracking-wide transition ${
                      formData.tripType === type
                        ? 'bg-luxury-red/10 text-luxury-red border-2 border-luxury-red'
                        : 'bg-luxury-white-off text-luxury-black/70 border-2 border-transparent hover:border-luxury-black/20'
                    }`}
                  >
                    {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <CitySelector
                  label="Departure City"
                  value={formData.departureCity}
                  onChange={(city) => setFormData({ ...formData, departureCity: city })}
                  placeholder="Select departure city"
                  required
                />
                <CitySelector
                  label="Arrival City"
                  value={formData.arrivalCity}
                  onChange={(city) => setFormData({ ...formData, arrivalCity: city })}
                  placeholder="Select arrival city"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <label className="block text-sm font-luxury font-medium text-luxury-black/70 mb-2 tracking-wide">
                    Departure Date
                  </label>
                  <Calendar className="absolute left-3 top-11 h-5 w-5 text-luxury-black/40" />
                  <input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                    required
                  />
                </div>
                {formData.tripType === 'round_trip' && (
                  <div className="relative">
                    <label className="block text-sm font-luxury font-medium text-luxury-black/70 mb-2 tracking-wide">
                      Return Date
                    </label>
                    <Calendar className="absolute left-3 top-11 h-5 w-5 text-luxury-black/40" />
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-2 border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                      required
                    />
                  </div>
                )}
                <div className="relative">
                  <label className="block text-sm font-luxury font-medium text-luxury-black/70 mb-2 tracking-wide">
                    Passengers
                  </label>
                  <Users className="absolute left-3 top-11 h-5 w-5 text-luxury-black/40" />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.passengerCount}
                    onChange={(e) => setFormData({ ...formData, passengerCount: parseInt(e.target.value) })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-luxury-black/10 pt-8 mb-8">
              <h2 className="text-2xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">Contact Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <label className="block text-sm font-luxury font-medium text-luxury-black/70 mb-2 tracking-wide">
                    Full Name
                  </label>
                  <User className="absolute left-3 top-11 h-5 w-5 text-luxury-black/40" />
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-luxury font-medium text-luxury-black/70 mb-2 tracking-wide">
                    Phone Number
                  </label>
                  <PhoneInput
                    value={formData.customerPhone}
                    onChange={(value) => setFormData({ ...formData, customerPhone: value })}
                    countryCode={formData.countryCode}
                    onCountryCodeChange={(code) => setFormData({ ...formData, countryCode: code })}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div className="relative mb-4">
                <label className="block text-sm font-luxury font-medium text-luxury-black/70 mb-2 tracking-wide">
                  Email Address
                </label>
                <Mail className="absolute left-3 top-11 h-5 w-5 text-luxury-black/40" />
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-luxury font-medium text-luxury-black/70 mb-2 tracking-wide">
                  Additional Requirements (Optional)
                </label>
                <MessageSquare className="absolute left-3 top-11 h-5 w-5 text-luxury-black/40" />
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border-2 border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none resize-none font-luxury tracking-wide"
                  placeholder="Special catering, luggage details, ground transportation needs, etc."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-red text-white py-4 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Enquiry'}
            </button>

            <p className="text-sm text-luxury-black/70 text-center mt-4 font-luxury tracking-wide">
              Our team will contact you within 2-4 hours with a detailed quote
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
