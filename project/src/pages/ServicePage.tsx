import { useParams, Link } from 'react-router-dom';
import { Check, ArrowRight, ChevronRight, Send, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import PhoneInput from '../components/PhoneInput';
import SuccessModal from '../components/SuccessModal';
import { getServiceBySlug, getServices, createServiceInquiry } from '../lib/api';
import type { Service } from '../lib/types';

export default function ServicePage() {
  const { serviceType } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    selectedService: '',
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!serviceType) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [serviceResponse, servicesResponse] = await Promise.all([
          getServiceBySlug(serviceType),
          getServices(),
        ]);
        
        if (serviceResponse.service) {
          setService(serviceResponse.service);
          // Set default selected service
          setFormData(prev => ({ ...prev, selectedService: serviceResponse.service.title }));
        }
        
        if (servicesResponse.services) {
          setAllServices(servicesResponse.services);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setFormLoading(true);
    try {
      await createServiceInquiry({
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
        serviceName: formData.selectedService || service.title,
        serviceSlug: service.slug,
        subject: `Inquiry about ${formData.selectedService || service.title}`,
      });
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+1',
        selectedService: service.title,
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
          <p className="text-luxury-black/70 font-luxury tracking-wide">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">Service Not Found</h2>
          <Link to="/services" className="text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide">
            View All Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)}
        title="Inquiry Received!"
        message="Thank you for your interest in our services. Our aviation experts will review your request and contact you within 24 hours."
      />
      {/* Breadcrumb */}
      <section className="bg-luxury-white py-3 sm:py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <Link to="/services" className="hover:text-luxury-red transition">Our Services</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-luxury-black truncate max-w-[200px] sm:max-w-none">{service.title}</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-luxury-red/40 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {service.tagline && (
            <p className="text-sm sm:text-base text-luxury-red mb-2 font-luxury tracking-[0.3em] uppercase text-center font-semibold">
              {service.tagline}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury text-center leading-tight">
            {service.title}
          </h1>
          {service.subtitle && (
            <p className="text-xl sm:text-2xl text-white/80 mb-4 font-luxury tracking-wide text-center max-w-3xl mx-auto">
              {service.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Service Image */}
      {service.imageUrl && (
        <section className="py-8 bg-white -mt-8 sm:-mt-12 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-auto object-cover max-h-[600px]"
              />
            </div>
          </div>
        </section>
      )}

      {/* Service Description */}
      <section className="py-16 sm:py-20 lg:py-24 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-luxury font-light text-luxury-black mb-8 tracking-luxury border-l-4 border-luxury-red pl-6">
              Overview
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-luxury-black/80 leading-relaxed font-luxury tracking-wide">
              {service.description}
            </p>
          </div>

          {/* Additional Images */}
          {service.images && service.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {service.images.map((imageUrl, index) => (
                <div key={index} className="rounded-xl overflow-hidden shadow-xl transition-transform hover:scale-[1.02] duration-500">
                  <img
                    src={imageUrl}
                    alt={`${service.title} ${index + 1}`}
                    className="w-full h-72 object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Our Deliverables */}
            {(service.deliverables && service.deliverables.length > 0) || (service.features && service.features.length > 0) ? (
              <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-luxury-black/5">
                <h2 className="text-3xl font-luxury font-light text-luxury-black mb-8 tracking-luxury">
                  {service.deliverables && service.deliverables.length > 0 ? 'Our Deliverables' : 'Our Services'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {(service.deliverables || service.features).map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 group">
                      <div className="bg-luxury-red/10 rounded-full p-1 flex-shrink-0 mt-1 group-hover:bg-luxury-red group-hover:text-white transition-colors duration-300">
                        <Check className="h-4 w-4 text-luxury-red group-hover:text-white" />
                      </div>
                      <span className="text-base text-luxury-black/70 font-luxury tracking-wide transition-colors group-hover:text-luxury-black">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Key Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-luxury font-light text-luxury-black mb-8 tracking-luxury">
                  Key Benefits
                </h2>
                <div className="space-y-4">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-luxury-black/10 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury group-hover:text-luxury-red transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-luxury-black/70 font-luxury tracking-wide leading-relaxed">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 sm:py-24 bg-gradient-to-b from-white to-luxury-white-off">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2rem] shadow-2xl p-8 sm:p-12 lg:p-16 border border-luxury-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-red/5 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
            
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">
                Request a Consultation
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-luxury-black/70 max-w-2xl mx-auto leading-relaxed font-luxury tracking-wide">
                Experience excellence in aviation. Share your requirements and our experts will provide a bespoke solution.
              </p>
            </div>

            <div className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 border border-luxury-black/10 rounded-xl focus:border-luxury-red focus:outline-none font-luxury tracking-wide bg-luxury-white-off/30 transition-all focus:bg-white"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 border border-luxury-black/10 rounded-xl focus:border-luxury-red focus:outline-none font-luxury tracking-wide bg-luxury-white-off/30 transition-all focus:bg-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                      Phone Number *
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

                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                      Interested Service *
                    </label>
                    <select
                      value={formData.selectedService}
                      onChange={(e) => setFormData({ ...formData, selectedService: e.target.value })}
                      className="w-full px-5 py-4 border border-luxury-black/10 rounded-xl focus:border-luxury-red focus:outline-none font-luxury tracking-wide bg-luxury-white-off/30 transition-all focus:bg-white appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select a service</option>
                      {allServices.map((srv) => (
                        <option key={srv._id || srv.id} value={srv.title}>
                          {srv.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                    Your Requirements *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 border border-luxury-black/10 rounded-xl focus:border-luxury-red focus:outline-none font-luxury tracking-wide resize-none bg-luxury-white-off/30 transition-all focus:bg-white"
                    placeholder="Tell us more about what you're looking for..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-luxury-red text-white py-5 rounded-2xl hover:bg-luxury-red/90 transition-all duration-300 font-luxury tracking-[0.2em] uppercase shadow-xl hover:shadow-red-600/30 flex items-center justify-center space-x-3 disabled:opacity-50 active:scale-[0.98] group"
                >
                  {formLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      <span className="font-semibold">Request Consultation</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-12 pt-8 border-t border-luxury-black/5">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12">
                  <a
                    href="tel:+911234567890"
                    className="flex items-center space-x-3 text-luxury-black/60 hover:text-luxury-red transition-all group"
                  >
                    <div className="bg-luxury-black/5 p-2 rounded-full group-hover:bg-luxury-red group-hover:text-white transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span className="font-luxury tracking-wide">+91 123 456 7890</span>
                  </a>
                  <a
                    href="mailto:info@skyriting.com"
                    className="flex items-center space-x-3 text-luxury-black/60 hover:text-luxury-red transition-all group"
                  >
                    <div className="bg-luxury-black/5 p-2 rounded-full group-hover:bg-luxury-red group-hover:text-white transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="font-luxury tracking-wide">info@skyriting.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
