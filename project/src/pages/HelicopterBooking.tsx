import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users, MapPin, Mail, User } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import { createEnquiry } from '../lib/api';

export default function HelicopterBooking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    countryCode: '+91',
    departure_city: '',
    arrival_city: '',
    departure_date: '',
    departure_time: '',
    passenger_count: 1,
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createEnquiry({
        enquiry_type: 'helicopter',
        aircraft_type: 'helicopter',
        trip_type: 'one-way',
        ...formData,
        customer_phone: `${formData.countryCode} ${formData.customer_phone}`,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-luxury-red/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Plane className="h-10 w-10 text-luxury-red" />
          </div>
          <h2 className="text-2xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Request Submitted!</h2>
          <p className="text-luxury-black/70 mb-4 font-luxury tracking-wide">
            We've received your helicopter booking request. Our team will contact you shortly.
          </p>
          <p className="text-sm text-luxury-black/50 font-luxury tracking-wide">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-white to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Plane className="h-16 w-16 text-luxury-red mx-auto mb-4 rotate-45" />
            <h1 className="text-3xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Helicopter Booking</h1>
            <p className="text-luxury-black/70 font-luxury tracking-wide">
              Request a helicopter charter for your travel needs
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full border border-luxury-black/20 rounded-lg px-4 py-2 focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                />
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.customer_email}
                  onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                  className="w-full border border-luxury-black/20 rounded-lg px-4 py-2 focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                />
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  Phone
                </label>
                <PhoneInput
                  value={formData.customer_phone}
                  onChange={(value) => setFormData({ ...formData, customer_phone: value })}
                  countryCode={formData.countryCode}
                  onCountryCodeChange={(code) => setFormData({ ...formData, countryCode: code })}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  <Users className="inline h-4 w-4 mr-1" />
                  Passengers
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={formData.passenger_count}
                  onChange={(e) => setFormData({ ...formData, passenger_count: parseInt(e.target.value) })}
                  className="w-full border border-luxury-black/20 rounded-lg px-4 py-2 focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                />
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Departure Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.departure_city}
                  onChange={(e) => setFormData({ ...formData, departure_city: e.target.value })}
                  className="w-full border border-luxury-black/20 rounded-lg px-4 py-2 focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                  placeholder="City or Airport"
                />
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Arrival Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.arrival_city}
                  onChange={(e) => setFormData({ ...formData, arrival_city: e.target.value })}
                  className="w-full border border-luxury-black/20 rounded-lg px-4 py-2 focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                  placeholder="City or Airport"
                />
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Departure Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.departure_date}
                  onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                  className="w-full border border-luxury-black/20 rounded-lg px-4 py-2 focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                />
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Departure Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.departure_time}
                  onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
                  className="w-full border border-luxury-black/20 rounded-lg px-4 py-2 focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                Special Requirements or Notes
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Any special requirements, dietary preferences, or additional information..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-luxury-red text-white py-3 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
