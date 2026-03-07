import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, DollarSign, Send, ChevronRight, Mail } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import SuccessModal from '../components/SuccessModal';
import { createCareerApplication } from '../lib/api';

export default function Career() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    position: '',
    experience: '',
    resume: '',
    coverLetter: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createCareerApplication({
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`,
      });
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        countryCode: '+91',
        position: '',
        experience: '',
        resume: '',
        coverLetter: '',
      });
    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert(error.message || 'There was an error submitting your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openPositions = [
    {
      title: 'Aircraft Maintenance Engineer',
      location: 'Multiple Locations',
      type: 'Full-time',
      department: 'Maintenance',
    },
    {
      title: 'Flight Operations Manager',
      location: 'Headquarters',
      type: 'Full-time',
      department: 'Operations',
    },
    {
      title: 'Customer Service Representative',
      location: 'Remote / Office',
      type: 'Full-time',
      department: 'Customer Service',
    },
    {
      title: 'Aviation Consultant',
      location: 'Multiple Locations',
      type: 'Contract',
      department: 'Consulting',
    },
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)}
        title="Application Submitted!"
        message="Thank you for your interest in joining Skyriting. Our HR team will review your application and contact you soon."
      />
      {/* Breadcrumb */}
      <section className="bg-luxury-white py-3 sm:py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-luxury-black">Career</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            Careers at Skyriting
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            Join our team and help shape the future of private aviation
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 sm:py-20 lg:py-24 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light text-luxury-black mb-4 sm:mb-6 tracking-luxury">
              Why Work With Us
            </h2>
            <div className="w-24 h-0.5 bg-luxury-red mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5 text-center transition-all hover:shadow-xl group">
              <div className="bg-luxury-red/10 group-hover:bg-luxury-red/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Briefcase className="h-10 w-10 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">
                Growth Opportunities
              </h3>
              <p className="text-luxury-black/70 font-luxury tracking-wide">
                Advance your career with comprehensive training programs and clear paths for professional development.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5 text-center transition-all hover:shadow-xl group">
              <div className="bg-luxury-red/10 group-hover:bg-luxury-red/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <DollarSign className="h-10 w-10 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">
                Competitive Benefits
              </h3>
              <p className="text-luxury-black/70 font-luxury tracking-wide">
                Enjoy competitive salaries, health insurance, retirement plans, and travel benefits.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5 text-center transition-all hover:shadow-xl group">
              <div className="bg-luxury-red/10 group-hover:bg-luxury-red/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <Clock className="h-10 w-10 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">
                Work-Life Balance
              </h3>
              <p className="text-luxury-black/70 font-luxury tracking-wide">
                Flexible schedules and supportive work environment that values your well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 sm:py-20 lg:py-24 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury font-light text-luxury-black mb-4 sm:mb-6 tracking-luxury">
              Open Positions
            </h2>
            <div className="w-24 h-0.5 bg-luxury-red mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="bg-luxury-white-off p-6 rounded-xl border border-luxury-black/5 hover:shadow-lg transition-all duration-300 group"
              >
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury group-hover:text-luxury-red transition-colors">
                  {position.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-luxury-black/70 font-luxury tracking-wide mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{position.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{position.type}</span>
                  </div>
                </div>
                <p className="text-luxury-black/70 font-luxury tracking-wide mb-4">
                  Department: {position.department}
                </p>
                <a
                  href={`mailto:info@skyriting.com?subject=Application for ${encodeURIComponent(position.title)}`}
                  className="inline-flex items-center space-x-2 text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide transition underline decoration-luxury-red/30 underline-offset-4"
                >
                  <Mail className="h-4 w-4" />
                  <span>info@skyriting.com</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 sm:py-20 lg:py-24 bg-luxury-white-off/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-luxury-black/5">
            <h2 className="text-2xl sm:text-3xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">
              Join Our Team
            </h2>
            <p className="text-luxury-black/70 mb-8 font-luxury tracking-wide">
              Don't see a position that matches your skills? We're always looking for talented 
              individuals. Submit your application and we'll keep you in mind for future opportunities.
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
                    Position of Interest *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 border border-luxury-black/10 bg-luxury-white-off/30 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide transition-colors"
                    placeholder="e.g., Aircraft Maintenance Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                  Years of Experience *
                </label>
                <input
                  type="text"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 border border-luxury-black/10 bg-luxury-white-off/30 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide transition-colors"
                  placeholder="e.g., 5 years in aviation"
                />
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                  Resume/CV URL or Link
                </label>
                <input
                  type="url"
                  value={formData.resume}
                  onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                  className="w-full px-4 py-3 border border-luxury-black/10 bg-luxury-white-off/30 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide transition-colors"
                  placeholder="https://linkedin.com/in/yourprofile or Google Drive link"
                />
              </div>

              <div>
                <label className="block text-sm font-luxury font-medium text-luxury-black mb-2 tracking-wide uppercase text-xs">
                  Cover Letter
                </label>
                <textarea
                  rows={5}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  className="w-full px-4 py-3 border border-luxury-black/10 bg-luxury-white-off/30 rounded-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide resize-none transition-colors"
                  placeholder="Tell us why you'd like to join Skyriting..."
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
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Application</span>
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
