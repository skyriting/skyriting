import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, ChevronRight } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import { createContactInquiry } from '../lib/api';

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
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
      const response = await createContactInquiry({
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
      });
      setSubmitted(true);
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

  if (submitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-luxury-white">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-luxury-black/5">
            <div className="bg-luxury-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-luxury-red" />
            </div>
            <h2 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">
              Message Sent Successfully
            </h2>
            <p className="text-luxury-black/70 mb-6 leading-relaxed font-luxury tracking-wide">
              Thank you for contacting Skyriting. Our team will get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-luxury-red text-white px-6 py-3 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-wide"
            >
              Send Another Message
            </button>
          </div>
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
            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5 text-center">
              <div className="bg-luxury-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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

            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5 text-center">
              <div className="bg-luxury-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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

            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5 text-center">
              <div className="bg-luxury-red/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-luxury-white-off rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-luxury-black/5">
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
                  <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                    Full Name *
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
                    Email Address *
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
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
                  <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
                  Message *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide resize-none"
                  placeholder="Tell us about your requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-luxury-red text-white py-4 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending...</span>
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
