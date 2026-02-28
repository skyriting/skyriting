import { useState } from 'react';
import { Send, X } from 'lucide-react';
import PhoneInput from './PhoneInput';
import { createServiceInquiry } from '../lib/api';

interface ServiceContactFormProps {
  serviceName: string;
  onCancel?: () => void;
}

export default function ServiceContactForm({ serviceName, onCancel }: ServiceContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    company: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createServiceInquiry({
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
        serviceName,
        subject: `Inquiry about ${serviceName}`,
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+91',
        company: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('There was an error submitting your inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-luxury-red/10 border border-luxury-red/20 rounded-lg p-6 text-center">
        <p className="text-luxury-red font-luxury tracking-wide mb-4">
          Thank you for your interest in {serviceName}!
        </p>
        <p className="text-luxury-black/70 font-luxury tracking-wide text-sm mb-4">
          Our team will contact you shortly with more information.
        </p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide text-sm"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-luxury-white-off rounded-xl p-6 sm:p-8 border border-luxury-black/10">
      {onCancel && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onCancel}
            className="text-luxury-black/50 hover:text-luxury-black transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
              Email Address *
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Company (Optional)
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide bg-white"
              placeholder="Your company name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide">
            Message *
          </label>
          <textarea
            rows={4}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide resize-none bg-white"
            placeholder={`Tell us about your interest in ${serviceName}...`}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-luxury-red text-white py-3 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Submitting...</span>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Submit Inquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
