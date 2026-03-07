import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronRight } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import SuccessModal from '../components/SuccessModal';
import { createContactInquiry } from '../lib/api';

export default function ContactUs() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createContactInquiry({
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
      });
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+91',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting inquiry:', error);
      alert(error.message || 'There was an error submitting your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)}
        title="Message Sent!"
        message="Our team will get back to you within 24 hours. Thank you for choosing Skyriting."
      />
      {/* Breadcrumb */}
      <section className="bg-luxury-white py-3 sm:py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-luxury-black">Contact Us</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            Get in touch with our team. We're here to help with all your private aviation needs.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 sm:py-20 lg:py-24 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5 text-center transition-all hover:shadow-xl group">
              <div className="bg-luxury-red/10 group-hover:bg-luxury-red/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Phone className="h-8 w-8 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
                Phone
              </h3>
              <a
                href="tel:+911234567890"
                className="text-luxury-black/70 hover:text-luxury-red transition font-luxury tracking-wide"
              >
                +91 123 456 7890
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5 text-center transition-all hover:shadow-xl group">
              <div className="bg-luxury-red/10 group-hover:bg-luxury-red/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Mail className="h-8 w-8 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
                Email
              </h3>
              <a
                href="mailto:info@skyriting.com"
                className="text-luxury-black/70 hover:text-luxury-red transition font-luxury tracking-wide"
              >
                info@skyriting.com
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5 text-center transition-all hover:shadow-xl group">
              <div className="bg-luxury-red/10 group-hover:bg-luxury-red/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <MapPin className="h-8 w-8 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
                Location
              </h3>
              <p className="text-luxury-black/70 font-luxury tracking-wide">
                Bangalore, India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 sm:py-20 lg:py-24 bg-luxury-white-off/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-luxury-black/5">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="h-6 w-6 text-luxury-red" />
              <h2 className="text-2xl sm:text-3xl font-luxury font-light text-luxury-black tracking-luxury">
                Send Us a Message
              </h2>
            </div>
            <p className="text-luxury-black/70 mb-8 font-luxury tracking-wide">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

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
                    className="w-full px-4 py-3 border border-luxury-black/10 bg-luxury-white-off/30 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide transition-colors"
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
                    className="w-full px-4 py-3 border border-luxury-black/10 bg-luxury-white-off/30 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                    Phone Number
                  </label>
                  <PhoneInput
                    value={formData.phone}
                    onChange={(value) => setFormData({ ...formData, phone: value })}
                    countryCode={formData.countryCode}
                    onCountryCodeChange={(code) => setFormData({ ...formData, countryCode: code })}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-luxury-black/10 bg-luxury-white-off/30 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                  Message *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-luxury-black/10 bg-luxury-white-off/30 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide resize-none transition-colors"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-luxury-red text-white py-4 rounded-xl hover:bg-luxury-red/90 transition-all font-luxury tracking-widest uppercase shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 hover:shadow-red-600/20 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
