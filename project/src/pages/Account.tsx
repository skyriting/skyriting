import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Calendar, User, Mail, MapPin, Plane, Clock, CheckCircle, XCircle, FileText, RefreshCw, LogOut, Camera, AlertCircle, X } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import { getUserBookings, getUserQuotes, getUserProfile, updateUserProfile, resendVerification } from '../lib/api';
import { getAuthToken, removeAuthToken } from '../lib/auth';

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'quotes'>('bookings');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [rescheduleData, setRescheduleData] = useState({ newDate: '', newTime: '', reason: '' });
  const [verificationAlert, setVerificationAlert] = useState<string | null>(
    location.state?.verificationMessage || null
  );
  const [resendingVerification, setResendingVerification] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setResendingVerification(true);
    try {
      await resendVerification(user.email);
      setCooldown(60);
      setVerificationAlert('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      if (err.message?.includes('remainingSeconds')) {
        const match = err.message.match(/(\d+)/);
        if (match) {
          setCooldown(parseInt(match[1]));
        }
      }
      alert(err.message || 'Failed to resend verification email');
    } finally {
      setResendingVerification(false);
    }
  };

  const fetchUserData = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const [userResponse, bookingsResponse, quotesResponse] = await Promise.all([
        getUserProfile(),
        getUserBookings(),
        getUserQuotes().catch(() => ({ quotes: [] })),
      ]);

      setUser(userResponse.user);
      setBookings(bookingsResponse.bookings || []);
      setQuotes(quotesResponse.quotes || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        await updateUserProfile({ profilePhoto: base64 });
        fetchUserData();
      } catch (error: any) {
        alert(error.message || 'Failed to update profile photo');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (field: string, value: string) => {
    try {
      await updateUserProfile({ [field]: value });
      fetchUserData();
    } catch (error: any) {
      alert(error.message || 'Failed to update profile');
    }
  };

  const handleReschedule = async () => {
    if (!selectedBooking || !rescheduleData.newDate || !rescheduleData.reason) return;

    const token = getAuthToken();
    if (!token) return;

    try {
      await requestReschedule(selectedBooking._id, rescheduleData, token);
      setShowRescheduleModal(false);
      setRescheduleData({ newDate: '', newTime: '', reason: '' });
      fetchUserData();
    } catch (error: any) {
      alert(error.message || 'Failed to request reschedule');
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked':
        return 'bg-luxury-red/20 text-luxury-red';
      case 'quoted':
        return 'bg-luxury-red/20 text-luxury-red';
      case 'contacted':
        return 'bg-luxury-red/10 text-luxury-red';
      case 'cancelled':
        return 'bg-luxury-black/10 text-luxury-black/70';
      default:
        return 'bg-luxury-black/10 text-luxury-black';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'booked':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Email Verification Alert */}
      {verificationAlert && user && !user.emailVerified && (
        <div className="fixed top-20 left-0 right-0 z-40 bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-yellow-800 font-luxury tracking-wide">{verificationAlert}</p>
              <button
                onClick={handleResendVerification}
                disabled={resendingVerification || cooldown > 0}
                className="mt-2 text-sm text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendingVerification ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
              </button>
            </div>
            <button
              onClick={() => setVerificationAlert(null)}
              className="text-yellow-400 hover:text-yellow-600 ml-4"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    <div className="min-h-screen pt-16 sm:pt-20 bg-luxury-white">
      <section className="py-8 sm:py-12 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light mb-4 tracking-luxury">My Skyriting Account</h1>
          <p className="text-base sm:text-lg text-white/80 font-luxury tracking-wide">
            Manage your bookings, preferences, and aviation services
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    {user?.profilePhoto ? (
                      <img 
                        src={user.profilePhoto} 
                        alt={user.name} 
                        className="w-20 h-20 rounded-full object-cover border-2 border-luxury-red"
                      />
                    ) : (
                      <div className="bg-luxury-red/10 w-20 h-20 rounded-full flex items-center justify-center">
                        <User className="h-10 w-10 text-luxury-red" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-luxury-red text-white rounded-full p-2 cursor-pointer hover:bg-luxury-red/90 transition">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <h2 className="text-2xl font-luxury font-light text-luxury-black mb-1 tracking-luxury">{user?.name || 'User'}</h2>
                  <p className="text-luxury-black/70 font-luxury tracking-wide">{user?.email || ''}</p>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black/70 mb-2 tracking-wide">
                      Phone Number
                    </label>
                    {(() => {
                      const phoneValue = user?.phone || '';
                      const phoneMatch = phoneValue.match(/^(\+\d+)\s(.+)$/);
                      const countryCode = phoneMatch ? phoneMatch[1] : '+91';
                      const phoneNumber = phoneMatch ? phoneMatch[2] : phoneValue;
                      
                      return (
                        <PhoneInput
                          value={phoneNumber}
                          onChange={(value) => {
                            const fullPhone = `${countryCode} ${value}`;
                            handleProfileUpdate('phone', fullPhone);
                          }}
                          countryCode={countryCode}
                          onCountryCodeChange={(code) => {
                            const fullPhone = `${code} ${phoneNumber}`;
                            handleProfileUpdate('phone', fullPhone);
                          }}
                          placeholder="Enter your phone number"
                        />
                      );
                    })()}
                  </div>
                  <div className="flex items-center space-x-3 text-luxury-black/70 font-luxury tracking-wide">
                    <Mail className="h-5 w-5 text-luxury-black/40" />
                    <span className="text-sm break-all">{user?.email || ''}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-luxury-black/70 font-luxury tracking-wide flex-1">
                      <User className="h-5 w-5 text-luxury-black/40" />
                      <input
                        type="text"
                        value={user?.name || ''}
                        onChange={(e) => handleProfileUpdate('name', e.target.value)}
                        onBlur={(e) => e.target.value !== user?.name && handleProfileUpdate('name', e.target.value)}
                        className="flex-1 border-none bg-transparent focus:outline-none focus:ring-0 p-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-luxury font-light text-luxury-red">{bookings.length}</p>
                      <p className="text-sm text-luxury-black/70 font-luxury tracking-wide">Bookings</p>
                    </div>
                    <div>
                      <p className="text-2xl font-luxury font-light text-luxury-red">{quotes.length}</p>
                      <p className="text-sm text-luxury-black/70 font-luxury tracking-wide">Quotes</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-4 w-full flex items-center justify-center space-x-2 bg-luxury-red text-white py-2 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-wide"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border border-luxury-black/5">
                <h3 className="text-lg font-luxury font-light text-luxury-black mb-4 tracking-luxury">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-luxury-red text-white py-3 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-wide">
                    New Booking
                  </button>
                  <Link to="/packages" className="w-full bg-luxury-white-off text-luxury-black/70 py-3 rounded-lg hover:bg-luxury-white-cream transition font-luxury tracking-wide text-center block">
                    View Packages
                  </Link>
                  <button className="w-full bg-luxury-white-off text-luxury-black/70 py-3 rounded-lg hover:bg-luxury-white-cream transition font-luxury tracking-wide">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-luxury font-light text-luxury-black tracking-luxury">My Account</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className={`px-4 py-2 rounded-lg transition font-luxury tracking-wide ${
                        activeTab === 'bookings'
                          ? 'bg-luxury-red text-white'
                          : 'bg-luxury-white-off text-luxury-black hover:bg-luxury-white-cream'
                      }`}
                    >
                      Bookings
                    </button>
                    <button
                      onClick={() => setActiveTab('quotes')}
                      className={`px-4 py-2 rounded-lg transition font-luxury tracking-wide ${
                        activeTab === 'quotes'
                          ? 'bg-luxury-red text-white'
                          : 'bg-luxury-white-off text-luxury-black hover:bg-luxury-white-cream'
                      }`}
                    >
                      Quotes
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto"></div>
                    <p className="mt-4 text-luxury-black/70 font-luxury">Loading bookings...</p>
                  </div>
                ) : activeTab === 'bookings' && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id || booking.id} className="border-2 border-luxury-black/10 rounded-xl p-4 hover:border-luxury-red transition">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <Plane className="h-5 w-5 text-luxury-red" />
                            <div>
                              <h3 className="font-luxury font-light text-luxury-black text-lg tracking-luxury">
                                Booking {booking.bookingNumber}
                              </h3>
                              {booking.flightDetails?.legs && booking.flightDetails.legs.length > 0 && (
                                <p className="text-sm text-luxury-black/70 font-luxury tracking-wide">
                                  {booking.flightDetails.legs.map((leg: any, i: number) => (
                                    <span key={i}>
                                      {leg.origin} → {leg.destination}
                                      {i < booking.flightDetails.legs.length - 1 ? ', ' : ''}
                                    </span>
                                  ))}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-luxury tracking-wide ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-luxury-black/70 mb-3 font-luxury tracking-wide">
                          {booking.flightDetails?.legs?.[0] && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-luxury-black/40" />
                              <span>{new Date(booking.flightDetails.legs[0].departureDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-luxury-black/40" />
                            <span>{booking.flightDetails?.passengerCount || 1} Passenger{(booking.flightDetails?.passengerCount || 1) > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-luxury font-light text-luxury-black">Total:</span>
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: booking.currency || 'USD' }).format(booking.totalAmount || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-luxury font-light text-luxury-black">Payment:</span>
                            <span className="capitalize">{booking.paymentStatus}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <p className="text-xs text-luxury-black/50 font-luxury">
                            Created: {new Date(booking.createdAt || booking.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowRescheduleModal(true);
                              }}
                              className="flex items-center space-x-1 text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide text-sm"
                            >
                              <RefreshCw className="h-4 w-4" />
                              <span>Reschedule</span>
                            </button>
                            <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeTab === 'quotes' && quotes.length > 0 ? (
                  <div className="space-y-4">
                    {quotes.map((quote) => (
                      <div key={quote._id || quote.id} className="border-2 border-luxury-black/10 rounded-xl p-4 hover:border-luxury-red transition">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                          <div>
                            <h3 className="font-luxury font-light text-luxury-black text-lg tracking-luxury">
                              Quote {quote.quoteNumber}
                            </h3>
                            <p className="text-sm text-luxury-black/70 font-luxury tracking-wide">
                              Valid until: {new Date(quote.validUntil).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-luxury tracking-wide ${
                            quote.status === 'accepted' ? 'bg-luxury-red/20 text-luxury-red' :
                            quote.status === 'expired' ? 'bg-luxury-red/10 text-luxury-red' :
                            'bg-luxury-red/10 text-luxury-red'
                          }`}>
                            <span className="capitalize">{quote.status}</span>
                          </span>
                        </div>

                        <div className="mb-3">
                          <p className="text-2xl font-luxury font-light text-luxury-red">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: quote.pricing?.currency || 'USD' }).format(quote.pricing?.totalCost || 0)}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-luxury-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <p className="text-xs text-luxury-black/50 font-luxury">
                            Created: {new Date(quote.createdAt || quote.created_at).toLocaleDateString()}
                          </p>
                  <Link
                    to={`/quote/${quote._id || quote.id}`}
                    className="text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide text-sm"
                  >
                    View Quote →
                  </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Plane className="h-16 w-16 text-luxury-black/20 mx-auto mb-4" />
                    <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
                      {activeTab === 'bookings' ? 'No Bookings Yet' : 'No Quotes Yet'}
                    </h3>
                    <p className="text-luxury-black/70 mb-6 font-luxury tracking-wide">
                      {activeTab === 'bookings'
                        ? 'Start your private aviation journey with Skyriting'
                        : 'You don\'t have any quotes yet'}
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className="bg-luxury-red text-white px-8 py-3 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase"
                    >
                      {activeTab === 'bookings' ? 'Book Your First Flight' : 'Search Flights'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">Request Reschedule</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-luxury font-medium mb-1 text-luxury-black tracking-wide">New Date</label>
                <input
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                  className="w-full border border-luxury-black/20 rounded-lg px-3 py-2 font-luxury tracking-wide focus:border-luxury-red focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-luxury font-medium mb-1 text-luxury-black tracking-wide">New Time (Optional)</label>
                <input
                  type="time"
                  value={rescheduleData.newTime}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newTime: e.target.value })}
                  className="w-full border border-luxury-black/20 rounded-lg px-3 py-2 font-luxury tracking-wide focus:border-luxury-red focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-luxury font-medium mb-1 text-luxury-black tracking-wide">Reason</label>
                <textarea
                  value={rescheduleData.reason}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                  className="w-full border border-luxury-black/20 rounded-lg px-3 py-2 font-luxury tracking-wide focus:border-luxury-red focus:outline-none"
                  rows={3}
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setRescheduleData({ newDate: '', newTime: '', reason: '' });
                }}
                className="flex-1 bg-luxury-white-off text-luxury-black py-2 rounded-lg hover:bg-luxury-white-cream font-luxury tracking-wide"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="flex-1 bg-luxury-red text-white py-2 rounded-lg hover:bg-luxury-red/90 font-luxury tracking-widest uppercase"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
