import { useParams, Link } from 'react-router-dom';
import { Check, ArrowRight, ChevronRight, Send, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import PhoneInput from '../components/PhoneInput';
import { getServiceBySlug, getServices, createServiceInquiry } from '../lib/api';
import type { Service } from '../lib/types';

export default function ServicePage() {
  const { serviceType } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
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
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+91',
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
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {service.tagline && (
            <p className="text-sm sm:text-base text-luxury-red mb-2 font-luxury tracking-widest uppercase text-center">
              {service.tagline}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury text-center">
            {service.title}
          </h1>
          {service.subtitle && (
            <p className="text-xl sm:text-2xl text-white/80 mb-4 font-luxury tracking-wide text-center">
              {service.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Service Image */}
      {service.imageUrl && (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </section>
      )}

      {/* Service Description */}
      <section className="py-12 sm:py-16 lg:py-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
            <p className="text-base sm:text-lg md:text-xl text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
              {service.description}
            </p>
          </div>

          {/* Additional Images */}
          {service.images && service.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {service.images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`${service.title} ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Our Deliverables */}
            {service.deliverables && service.deliverables.length > 0 && (
              <div>
                <h2 className="text-3xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">
                  Our Deliverables
                </h2>
                <ul className="space-y-4">
                  {service.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="bg-luxury-red/10 rounded-full p-1 flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-luxury-red" />
                      </div>
                      <span className="text-lg text-luxury-black/70 font-luxury tracking-wide">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features (if no deliverables, show features) */}
            {(!service.deliverables || service.deliverables.length === 0) && service.features && service.features.length > 0 && (
              <div>
                <h2 className="text-3xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">
                  Our Services
                </h2>
                <ul className="space-y-4">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="bg-luxury-red/10 rounded-full p-1 flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-luxury-red" />
                      </div>
                      <span className="text-lg text-luxury-black/70 font-luxury tracking-wide">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div>
                <h2 className="text-3xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">
                  Key Benefits
                </h2>
                <div className="space-y-6">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-luxury-black/5 shadow-sm">
                      <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
                        {benefit.title}
                      </h3>
                      <p className="text-luxury-black/70 font-luxury tracking-wide">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-luxury font-light text-luxury-black mb-4 sm:mb-6 tracking-luxury">
              Get in Touch
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-luxury-black/70 mb-6 sm:mb-8 leading-relaxed font-luxury tracking-wide">
              Please complete the form below selecting the desired service, and we will respond within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="bg-luxury-red/10 border border-luxury-red/20 rounded-lg p-8 text-center">
              <Check className="h-16 w-16 text-luxury-red mx-auto mb-4" />
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
                Inquiry Submitted!
              </h3>
              <p className="text-luxury-black/70 mb-4 font-luxury tracking-wide">
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
            <div className="bg-luxury-white-off rounded-xl p-6 sm:p-8 border border-luxury-black/10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide bg-white"
                    placeholder="Your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide bg-white"
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
                </div>

                <div>
                  <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                    Select Services *
                  </label>
                  <select
                    value={formData.selectedService}
                    onChange={(e) => setFormData({ ...formData, selectedService: e.target.value })}
                    className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide bg-white"
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

                <div>
                  <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                    Your message here *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide resize-none bg-white"
                    placeholder="Tell us about your requirements..."
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

              <div className="mt-8 pt-8 border-t border-luxury-black/10">
                <p className="text-xs text-luxury-black/60 font-luxury tracking-wide text-center mb-4">
                  Beyond Luxury. Beyond Convenience. Beyond Expectations
                </p>
                <p className="text-sm text-luxury-black/70 font-luxury tracking-wide text-center mb-4">
                  Skyriting sets the benchmark in private aviation
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <a
                    href="tel:+911234567890"
                    className="flex items-center space-x-2 text-sm text-luxury-black/70 hover:text-luxury-red transition font-luxury tracking-wide"
                  >
                    <Phone className="h-4 w-4" />
                    <span>+91 123 456 7890</span>
                  </a>
                  <a
                    href="mailto:info@skyriting.com"
                    className="flex items-center space-x-2 text-sm text-luxury-black/70 hover:text-luxury-red transition font-luxury tracking-wide"
                  >
                    <Mail className="h-4 w-4" />
                    <span>info@skyriting.com</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
