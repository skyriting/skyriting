import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, MapPin, Send, Phone, Mail, Sparkles, ShieldCheck, Globe, Star, ChevronDown, ChevronRight } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import { getPackageBySlug, createPackageInquiry } from '../lib/api';
import type { Package } from '../lib/types';
import SuccessModal from '../components/SuccessModal';

export default function PackageDetail() {
  const { slug } = useParams();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    selectedPackage: '',
    selectedPackageType: '',
    selectedDate: '',
    message: '',
  });

  // Helper to fix package names as requested
  const getDisplayTitle = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('pilgrimage') || t.includes('yatra')) return 'Skyriting Yatra';
    if (t.includes('helicopter') || t.includes('heli')) return 'Skyriting Heli';
    if (t.includes('wedding')) return 'Skyriting Wed';
    if (t.includes('ambulance') || t.includes('rescue')) return 'Skyriting Rescue';
    return title;
  };

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
          if (response.package.durationOptions?.length > 0) {
            setFormData(prev => ({ ...prev, selectedPackage: response.package.durationOptions[0].name }));
          }
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
        packageName: getDisplayTitle(packageData.title),
        packageSlug: packageData.slug,
        selectedPackageType: formData.selectedPackageType,
      });
      setShowSuccessModal(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+1',
        selectedPackage: packageData.durationOptions?.[0]?.name || '',
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
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium tracking-wide">Prepairing your exclusive journey...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center max-w-md px-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Package Not Found</h2>
            <p className="text-gray-500 mb-8 tracking-wide">The package you are looking for might have been moved or is no longer available.</p>
            <Link to="/packages" className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition font-medium tracking-wide shadow-lg shadow-red-600/20">
              Explore All Packages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayTitle = getDisplayTitle(packageData.title);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-[#FAFAFA]">
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="Inquiry Received"
        message={`Thank you for your interest in ${displayTitle}. Our luxury travel consultants will review your request and contact you within 24 hours to craft your perfect journey.`}
      />

      {/* Breadcrumb - Subtle and Professional */}
      <section className="py-4 bg-white/50 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs font-medium tracking-widest uppercase text-gray-400">
            <Link to="/" className="hover:text-red-600 transition">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/packages" className="hover:text-red-600 transition">Packages</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">{displayTitle}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section - Immersive Design */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-luxury-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 shadow-lg shadow-red-600/30 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Experience</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6 tracking-tight leading-tight">
              {displayTitle}
            </h1>
            {packageData.subtitle && (
              <p className="text-xl sm:text-2xl text-red-100/80 mb-6 font-light tracking-wide italic">
                {packageData.subtitle}
              </p>
            )}
            <p className="text-lg text-white/70 leading-relaxed font-light tracking-wide">
              {packageData.description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Details & Experience */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Featured Image with Premium Styling */}
              {packageData.imageUrl && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white aspect-[16/9]">
                    <img
                      src={packageData.imageUrl}
                      alt={displayTitle}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              )}

              {/* Unique Value Propositions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                  <ShieldCheck className="h-8 w-8 text-red-600 mb-3" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-widest uppercase mb-1">Safety First</h3>
                  <p className="text-xs text-gray-500 tracking-wide">Certified aircraft & pilots</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                  <Globe className="h-8 w-8 text-red-600 mb-3" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-widest uppercase mb-1">Pan India</h3>
                  <p className="text-xs text-gray-500 tracking-wide">Comprehensive coverage</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                  <Star className="h-8 w-8 text-red-600 mb-3" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-widest uppercase mb-1">VIP Service</h3>
                  <p className="text-xs text-gray-500 tracking-wide">End-to-end management</p>
                </div>
              </div>

              {/* Package Options/Variants */}
              {packageData.durationOptions && packageData.durationOptions.length > 0 && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                    <h2 className="text-2xl font-light text-gray-900 tracking-tight">Available Packages</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {packageData.durationOptions.map((option, index) => {
                      const price = option.price || option.pricePerSeat;
                      const currency = option.currency || packageData.currency || 'INR';
                      const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
                      const daysNights = option.days && option.nights 
                        ? `${option.days}D / ${option.nights}N`
                        : option.duration || '';
                      
                      return (
                        <div key={index} className="group p-6 rounded-2xl border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-wider">{option.name}</h3>
                              {daysNights && <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">{daysNights}</span>}
                            </div>
                            {price && (
                              <div className="text-right">
                                <span className="text-sm text-gray-400 font-medium block">Starting from</span>
                                <span className="text-xl font-light text-red-600 tracking-tight">{currencySymbol} {new Intl.NumberFormat('en-IN').format(price)}/seat</span>
                              </div>
                            )}
                          </div>
                          {option.description && (
                            <p className="text-sm text-gray-500 leading-relaxed font-light mt-2 border-t border-gray-100 pt-3">
                              {option.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Itinerary Section */}
              {packageData.itinerary && packageData.itinerary.length > 0 && (
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-3 mb-10">
                    <div className="w-1.5 h-8 bg-red-600 rounded-full"></div>
                    <h2 className="text-2xl font-light text-gray-900 tracking-tight">The Journey Itinerary</h2>
                  </div>
                  <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-gray-100">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="relative pl-12 group">
                        {/* Timeline Bullet */}
                        <div className="absolute left-0 top-0 w-8 h-8 bg-white border-2 border-red-600 rounded-full flex items-center justify-center z-10 group-hover:scale-110 transition-transform shadow-md">
                          <span className="text-xs font-bold text-red-600">{day.day}</span>
                        </div>
                        
                        <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-gray-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                          <h3 className="text-xl font-light text-gray-900 mb-4 tracking-tight group-hover:text-red-600 transition-colors">
                            {day.title}
                          </h3>
                          <p className="text-gray-500 leading-relaxed font-light tracking-wide mb-6">
                            {day.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {day.accommodation && (
                              <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-100">
                                <MapPin className="h-4 w-4 text-red-600" />
                                <div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Stay At</span>
                                  <span className="text-sm text-gray-700 font-medium">{day.accommodation}</span>
                                </div>
                              </div>
                            )}
                            {day.meals && (
                              <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border border-gray-100">
                                <Clock className="h-4 w-4 text-red-600" />
                                <div>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Inclusions</span>
                                  <span className="text-sm text-gray-700 font-medium">{day.meals}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlights/What's Included */}
              {packageData.packageIncludes && packageData.packageIncludes.length > 0 && (
                <div className="bg-luxury-black p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                   {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl font-light text-white mb-8 tracking-tight flex items-center space-x-3">
                      <span>Package Inclusions</span>
                      <ShieldCheck className="h-5 w-5 text-red-500" />
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      {packageData.packageIncludes.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 text-white/70 group">
                          <div className="w-1.5 h-1.5 bg-red-600 rounded-full group-hover:scale-150 transition-transform"></div>
                          <span className="text-sm font-light tracking-wide">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Inquiry Form Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 z-20">
                <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden transform transition-all duration-500">
                  {/* Form Header */}
                  <div className="p-8 bg-luxury-black text-white">
                    <h2 className="text-3xl font-light mb-2 tracking-tight">Reserve Experience</h2>
                    <p className="text-sm text-white/60 tracking-wide font-light">Customizable itineraries and private charters</p>
                    
                    {/* Price Badge in Head */}
                    {formData.selectedPackage ? (() => {
                      const selectedOption = packageData.durationOptions?.find(
                        opt => opt.name === formData.selectedPackage
                      );
                      if (selectedOption && (selectedOption.price || selectedOption.pricePerSeat)) {
                        const price = selectedOption.price || selectedOption.pricePerSeat;
                        const currency = selectedOption.currency || packageData.currency || 'INR';
                        const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency;
                        return (
                          <div className="mt-4 inline-block bg-red-600 px-4 py-2 rounded-xl text-white">
                            <span className="text-xs uppercase tracking-widest font-bold block opacity-60">Selected Price</span>
                            <span className="text-xl tracking-tight">{currencySymbol} {new Intl.NumberFormat('en-IN').format(price as number)}/- <span className="text-xs opacity-70">per person</span></span>
                          </div>
                        );
                      }
                      return null;
                    })() : packageData.priceNote && (
                      <div className="mt-4 text-red-400 font-medium tracking-wide">
                        {packageData.priceNote}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
                    <div className="space-y-4">
                      <div className="group">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1 transition-colors group-focus-within:text-red-600">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all outline-none text-sm font-medium"
                          placeholder="Your Name"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1 transition-colors group-focus-within:text-red-600">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all outline-none text-sm font-medium"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="group">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1 transition-colors group-focus-within:text-red-600">
                          Primary Contact
                        </label>
                        <PhoneInput
                          value={formData.phone}
                          onChange={(value) => setFormData({ ...formData, phone: value })}
                          countryCode={formData.countryCode}
                          onCountryCodeChange={(code) => setFormData({ ...formData, countryCode: code })}
                          placeholder="Phone number"
                          required
                        />
                      </div>

                      {/* Package Type Dropdown - Conditional */}
                      {packageData.packageTypes && packageData.packageTypes.length > 0 && (
                        <div className="group">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1 transition-colors group-focus-within:text-red-600">
                            Occasion / Type
                          </label>
                          <div className="relative">
                            <select
                              value={formData.selectedPackageType}
                              onChange={(e) => setFormData({ ...formData, selectedPackageType: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all outline-none text-sm font-medium appearance-none"
                              required
                            >
                              <option value="">Choose an option</option>
                              {packageData.packageTypes.map((type, index) => (
                                <option key={index} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      {/* Package Variant Selector */}
                      {packageData.durationOptions && packageData.durationOptions.length > 0 && (
                        <div className="group">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1 transition-colors group-focus-within:text-red-600">
                            Preferred Package
                          </label>
                          <div className="relative">
                            <select
                              value={formData.selectedPackage}
                              onChange={(e) => {
                                setFormData({ ...formData, selectedPackage: e.target.value, selectedDate: '' });
                              }}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all outline-none text-sm font-medium appearance-none"
                              required
                            >
                              <option value="">Select a variant</option>
                              {packageData.durationOptions.map((option, index) => (
                                <option key={index} value={option.name}>
                                  {option.name} {option.duration ? `(${option.duration})` : ''}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      <div className="group">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1 transition-colors group-focus-within:text-red-600">
                          Proposed Date
                        </label>
                        <div className="relative">
                          {formData.selectedPackage ? (() => {
                            const selectedOption = packageData.durationOptions?.find(
                              opt => opt.name === formData.selectedPackage
                            );
                            const availableDates = selectedOption?.availableDates || [];
                            
                            if (availableDates.length > 0) {
                              return (
                                <>
                                  <select
                                    value={formData.selectedDate}
                                    onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all outline-none text-sm font-medium appearance-none"
                                    required
                                  >
                                    <option value="">Choose Available Date</option>
                                    {availableDates.map((date, index) => (
                                      <option key={index} value={date}>
                                        {new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </>
                              );
                            }
                            return (
                              <input
                                type="date"
                                value={formData.selectedDate}
                                onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all outline-none text-sm font-medium"
                                min={new Date().toISOString().split('T')[0]}
                                required
                              />
                            );
                          })() : (
                            <input
                              type="date"
                              disabled
                              className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 outline-none text-sm font-medium cursor-not-allowed"
                              placeholder="Select package first"
                            />
                          )}
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 pl-1 transition-colors group-focus-within:text-red-600">
                          Bespoke Requests
                        </label>
                        <textarea
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all outline-none text-sm font-medium resize-none"
                          placeholder="Special requirements (catering, flowers, etc.)"
                        ></textarea>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full relative group/btn h-14 bg-red-600 rounded-2xl overflow-hidden shadow-xl shadow-red-600/20 disabled:opacity-50 transition-all active:scale-95"
                    >
                      <div className="absolute inset-0 bg-red-700 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                      <span className="relative z-10 text-white font-bold tracking-widest uppercase text-xs flex items-center justify-center space-x-2">
                        {formLoading ? (
                          <span>Processing...</span>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Request Booking</span>
                          </>
                        )}
                      </span>
                    </button>
                    
                    {/* Trust Indicators */}
                    <div className="pt-2">
                       <div className="flex items-center justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition duration-500">
                         <div className="flex items-center space-x-1">
                           <ShieldCheck className="h-3 w-3" />
                           <span className="text-[10px] font-bold tracking-tighter">SECURE</span>
                         </div>
                         <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                         <div className="flex items-center space-x-1">
                           <Clock className="h-3 w-3" />
                           <span className="text-[10px] font-bold tracking-tighter">24/7 SUPPORT</span>
                         </div>
                       </div>
                    </div>
                  </form>
                </div>
                
                {/* Secondary Actions */}
                <div className="mt-6 flex flex-col space-y-3 px-4">
                  <a
                    href="tel:+911234567890"
                    className="flex items-center justify-center space-x-3 py-3 border border-gray-200 rounded-2xl text-gray-600 hover:border-red-600 hover:text-red-600 bg-white transition-all text-xs font-bold tracking-widest uppercase"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Concierge</span>
                  </a>
                  <a
                    href="mailto:experience@skyriting.com"
                    className="flex items-center justify-center space-x-3 py-3 border border-gray-200 rounded-2xl text-gray-600 hover:border-red-600 hover:text-red-600 bg-white transition-all text-xs font-bold tracking-widest uppercase"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email Experience Team</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Section - Optional Footer */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-tight">Experience More</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-12 font-light">
              Beyond {displayTitle}, explore our range of other exclusive aviation packages and specialized services tailored to your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/packages" className="w-full sm:w-auto px-8 py-4 border border-gray-900 text-gray-900 rounded-2xl hover:bg-gray-900 hover:text-white transition font-bold tracking-widest uppercase text-xs">
                Browse All Packages
              </Link>
              <Link to="/services" className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition font-bold tracking-widest uppercase text-xs shadow-lg shadow-red-600/20">
                View Specialized Services
              </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
