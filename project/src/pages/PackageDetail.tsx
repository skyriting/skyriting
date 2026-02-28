import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Users, Clock, MapPin, CheckCircle, Send, Phone, Mail } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import { getPackageBySlug, createPackageInquiry } from '../lib/api';
import type { Package } from '../lib/types';

export default function PackageDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    selectedPackage: '',
    selectedPackageType: '', // New field for package type
    selectedDate: '',
    message: '',
  });

  useEffect(() => {
    const fetchPackage = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await getPackageBySlug(slug);
        if (response.package) {
          setPackageData(response.package);
        }
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageData) return;

    setFormLoading(true);
    try {
      await createPackageInquiry({
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
        packageName: packageData.title,
        packageSlug: packageData.slug,
        selectedPackageType: formData.selectedPackageType,
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+91',
        selectedPackage: '',
        selectedPackageType: '',
        selectedDate: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('There was an error submitting your inquiry. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto mb-4"></div>
          <p className="text-luxury-black/70 font-luxury tracking-wide">Loading package...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">Package Not Found</h2>
          <Link to="/packages" className="text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide">
            View All Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Breadcrumb */}
      <section className="bg-luxury-white py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/packages" className="hover:text-luxury-red transition">Our Packages</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-luxury-black">{packageData.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light mb-4 tracking-luxury">
            {packageData.title}
          </h1>
          {packageData.subtitle && (
            <p className="text-xl sm:text-2xl text-white/80 mb-4 font-luxury tracking-wide">
              {packageData.subtitle}
            </p>
          )}
          <p className="text-base sm:text-lg text-white/70 max-w-3xl leading-relaxed font-luxury tracking-wide">
            {packageData.description}
          </p>
        </div>
      </section>

      {/* Package Image */}
      {packageData.imageUrl && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <img
              src={packageData.imageUrl}
              alt={packageData.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </section>
      )}

      {/* Package Details */}
      <section className="py-12 sm:py-16 lg:py-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Duration Options */}
              {packageData.durationOptions && packageData.durationOptions.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/10">
                  <h2 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">
                    Packages:
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {packageData.durationOptions.map((option, index) => {
                      const price = option.price || option.pricePerSeat;
                      const currency = option.currency || packageData.currency || 'INR';
                      const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
                      const daysNights = option.days && option.nights 
                        ? `${option.days} Days / ${option.nights} Nights`
                        : option.duration || '';
                      return (
                        <div key={index} className="text-center p-4 bg-luxury-white-off rounded-lg border border-luxury-black/5 hover:border-luxury-red transition">
                          <p className="text-lg font-luxury font-light text-luxury-black mb-1 tracking-luxury">
                            {option.name}
                          </p>
                          {daysNights && (
                            <p className="text-sm text-luxury-black/70 font-luxury tracking-wide mb-2">
                              {daysNights}
                            </p>
                          )}
                          {price && (
                            <p className="text-base font-luxury font-medium text-luxury-red tracking-luxury">
                              {currencySymbol} {new Intl.NumberFormat('en-IN').format(price)}/seat
                            </p>
                          )}
                          {option.description && (
                            <p className="text-xs text-luxury-black/60 font-luxury tracking-wide mt-2">
                              {option.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tour Highlights */}
              {packageData.tourHighlights && packageData.tourHighlights.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/10">
                  <h2 className="text-2xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">
                    Tour Highlights
                  </h2>
                  <div className="space-y-4">
                    {packageData.tourHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-luxury-red mt-1 flex-shrink-0" />
                        <p className="text-luxury-black/70 font-luxury tracking-wide">
                          {highlight.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itinerary */}
              {packageData.itinerary && packageData.itinerary.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/10">
                  <h2 className="text-2xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">
                    Itinerary
                  </h2>
                  <div className="space-y-6">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="border-l-2 border-luxury-red pl-6 pb-6 last:pb-0">
                        <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">
                          {day.title}
                        </h3>
                        <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide mb-3">
                          {day.description}
                        </p>
                        {day.accommodation && (
                          <div className="mb-2">
                            <span className="text-sm font-luxury font-medium text-luxury-black tracking-wide">Accommodation: </span>
                            <span className="text-sm text-luxury-black/70 font-luxury tracking-wide">{day.accommodation}</span>
                          </div>
                        )}
                        {day.meals && (
                          <div className="mb-2">
                            <span className="text-sm font-luxury font-medium text-luxury-black tracking-wide">Meals: </span>
                            <span className="text-sm text-luxury-black/70 font-luxury tracking-wide">{day.meals}</span>
                          </div>
                        )}
                        {day.activities && day.activities.length > 0 && (
                          <ul className="mt-3 space-y-2">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="text-sm text-luxury-black/70 font-luxury tracking-wide flex items-center">
                                <span className="w-1.5 h-1.5 bg-luxury-red rounded-full mr-2"></span>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Package Includes */}
              {packageData.packageIncludes && packageData.packageIncludes.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/10">
                  <h2 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">
                    Package Includes
                  </h2>
                  <ul className="space-y-2">
                    {packageData.packageIncludes.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2 text-luxury-black/70 font-luxury tracking-wide">
                        <CheckCircle className="h-5 w-5 text-luxury-red" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Booking Form Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-luxury-black/10 sticky top-4">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-luxury-red mx-auto mb-4" />
                    <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
                      Inquiry Submitted!
                    </h3>
                    <p className="text-luxury-black/70 mb-4 font-luxury tracking-wide text-sm">
                      Our team will contact you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide text-sm"
                    >
                      Submit Another
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">
                      Book This Tour
                    </h2>
                    {formData.selectedPackage && (() => {
                      const selectedOption = packageData.durationOptions?.find(
                        opt => opt.name === formData.selectedPackage
                      );
                      if (selectedOption && (selectedOption.price || selectedOption.pricePerSeat)) {
                        const price = selectedOption.price || selectedOption.pricePerSeat;
                        const currency = selectedOption.currency || packageData.currency || 'INR';
                        const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
                        return (
                          <p className="text-luxury-red text-xl font-luxury font-light mb-6 tracking-luxury">
                            @ {currencySymbol} {new Intl.NumberFormat('en-IN').format(price)}/- Seat
                          </p>
                        );
                      }
                      return null;
                    })()}
                    {!formData.selectedPackage && packageData.priceNote && (
                      <p className="text-luxury-red text-lg font-luxury font-light mb-6 tracking-luxury">
                        {packageData.priceNote}
                      </p>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                          Phone *
                        </label>
                        <PhoneInput
                          value={formData.phone}
                          onChange={(value) => setFormData({ ...formData, phone: value })}
                          countryCode={formData.countryCode}
                          onCountryCodeChange={(code) => setFormData({ ...formData, countryCode: code })}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                      {/* Package Type Dropdown */}
                      {packageData.packageTypes && packageData.packageTypes.length > 0 && (
                        <div>
                          <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                            Select Package Type *
                          </label>
                          <select
                            value={formData.selectedPackageType}
                            onChange={(e) => setFormData({ ...formData, selectedPackageType: e.target.value })}
                            className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                            required
                          >
                            <option value="">Select Package Type</option>
                            {packageData.packageTypes.map((type, index) => (
                              <option key={index} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      {packageData.durationOptions && packageData.durationOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                            Select Package *
                          </label>
                          <select
                            value={formData.selectedPackage}
                            onChange={(e) => {
                              setFormData({ ...formData, selectedPackage: e.target.value, selectedDate: '' });
                            }}
                            className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                            required
                          >
                            <option value="">Select Package</option>
                            {packageData.durationOptions.map((option, index) => {
                              const price = option.price || option.pricePerSeat;
                              const currency = option.currency || packageData.currency || 'INR';
                              const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
                              const daysNights = option.days && option.nights 
                                ? `${option.days} Days / ${option.nights} Nights`
                                : option.duration || '';
                              return (
                                <option key={index} value={option.name}>
                                  {option.name} {daysNights ? `(${daysNights})` : ''} {price ? `- ${currencySymbol} ${new Intl.NumberFormat('en-IN').format(price)}/seat` : ''}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                          Select Date *
                        </label>
                        {formData.selectedPackage ? (() => {
                          const selectedOption = packageData.durationOptions?.find(
                            opt => opt.name === formData.selectedPackage
                          );
                          const availableDates = selectedOption?.availableDates || [];
                          
                          if (availableDates.length > 0) {
                            return (
                              <select
                                value={formData.selectedDate}
                                onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                                className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                                required
                              >
                                <option value="">Select Date</option>
                                {availableDates.map((date, index) => (
                                  <option key={index} value={date}>
                                    {new Date(date).toLocaleDateString('en-IN', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </option>
                                ))}
                              </select>
                            );
                          }
                          return (
                            <input
                              type="date"
                              value={formData.selectedDate}
                              onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                              className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          );
                        })() : (
                          <input
                            type="date"
                            value={formData.selectedDate}
                            onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                            className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                            min={new Date().toISOString().split('T')[0]}
                            disabled
                            placeholder="Select package first"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                          Message (Optional)
                        </label>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide resize-none"
                          placeholder="Any special requirements..."
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="w-full bg-luxury-red text-white py-4 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {formLoading ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>Submit Inquiry</span>
                          </>
                        )}
                      </button>
                    </form>
                    <div className="mt-6 pt-6 border-t border-luxury-black/10">
                      <p className="text-xs text-luxury-black/60 font-luxury tracking-wide text-center mb-3">
                        Or contact us directly:
                      </p>
                      <div className="flex flex-col space-y-2">
                        <a
                          href="tel:+911234567890"
                          className="flex items-center justify-center space-x-2 text-sm text-luxury-black/70 hover:text-luxury-red transition font-luxury tracking-wide"
                        >
                          <Phone className="h-4 w-4" />
                          <span>+91 123 456 7890</span>
                        </a>
                        <a
                          href="mailto:info@skyriting.com"
                          className="flex items-center justify-center space-x-2 text-sm text-luxury-black/70 hover:text-luxury-red transition font-luxury tracking-wide"
                        >
                          <Mail className="h-4 w-4" />
                          <span>info@skyriting.com</span>
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
