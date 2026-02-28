import { useState } from 'react';
import { Mail, User, MessageSquare, Send } from 'lucide-react';
import PhoneInput from './PhoneInput';
import { createEnquiry } from '../lib/api';

interface EnquiryFormProps {
  aircraftId?: string;
  aircraftName?: string;
  price?: number;
  currency?: string;
}

export default function EnquiryForm({ aircraftId, aircraftName, price, currency = 'USD' }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    countryCode: '+91',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const enquiryData = {
        enquiry_type: 'charter',
        aircraft_type: 'jet',
        trip_type: 'one-way',
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: `${formData.countryCode} ${formData.customer_phone}`,
        message: formData.message || `Interested in ${aircraftName || 'aircraft'}${price ? ` - Price: ${new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)}` : ''}`,
        status: 'new',
        ...(aircraftId && { aircraft_id: aircraftId }),
      };

      await createEnquiry(enquiryData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ customer_name: '', customer_email: '', customer_phone: '', countryCode: '+91', message: '' });
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-luxury-red/10 border border-luxury-red/20 rounded-lg p-6 text-center">
        <div className="bg-luxury-red/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Send className="h-8 w-8 text-luxury-red" />
        </div>
        <h3 className="text-lg font-luxury font-light text-luxury-black mb-2 tracking-luxury">Enquiry Sent!</h3>
        <p className="text-sm text-luxury-black/70 font-luxury tracking-wide">
          We've received your enquiry. Our team will contact you shortly to discuss your requirements.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-luxury-white-off rounded-lg p-6 border border-luxury-black/10">
      <h3 className="text-xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">Send Enquiry</h3>
      <p className="text-sm text-luxury-black/70 mb-4 font-luxury tracking-wide">
        Interested in this aircraft? Send us your details and we'll contact you to make a deal.
      </p>

      {error && (
        <div className="bg-luxury-red/10 border border-luxury-red/20 text-luxury-red px-4 py-3 rounded mb-4 font-luxury tracking-wide text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-luxury font-medium text-luxury-black mb-1.5 tracking-wide">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-black/40" />
            <input
              id="name"
              type="text"
              required
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
              placeholder="Enter your name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-luxury font-medium text-luxury-black mb-1.5 tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-black/40" />
            <input
              id="email"
              type="email"
              required
              value={formData.customer_email}
              onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-luxury font-medium text-luxury-black mb-1.5 tracking-wide">
            Phone Number
          </label>
          <PhoneInput
            id="phone"
            value={formData.customer_phone}
            onChange={(value) => setFormData({ ...formData, customer_phone: value })}
            countryCode={formData.countryCode}
            onCountryCodeChange={(code) => setFormData({ ...formData, countryCode: code })}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-luxury font-medium text-luxury-black mb-1.5 tracking-wide">
            Message (Optional)
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-luxury-black/40" />
            <textarea
              id="message"
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-luxury-black/20 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide resize-none"
              placeholder="Tell us about your requirements..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-luxury-red text-white py-2.5 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Send Enquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
