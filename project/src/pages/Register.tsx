import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import PhoneInput from '../components/PhoneInput';
import { register } from '../lib/api';
import { setAuthToken } from '../lib/auth';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    countryCode: '+91',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await register({
        ...formData,
        phone: formData.phone ? `${formData.countryCode} ${formData.phone}` : '',
      });
      setAuthToken(response.token);
      
      // Show verification message if provided
      if (response.message) {
        navigate('/account', { 
          state: { 
            verificationMessage: response.message || 'Please check your email to verify your account before logging in.',
            showVerificationAlert: true
          } 
        });
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-white to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-luxury font-light text-luxury-black tracking-luxury">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-luxury-black/70 font-luxury tracking-wide">
            Or{' '}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-luxury font-medium text-luxury-black tracking-wide">
                Full Name
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-luxury-black/20 rounded-lg placeholder-luxury-black/40 focus:outline-none focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-luxury font-medium text-luxury-black tracking-wide">
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-luxury-black/40" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-luxury-black/20 rounded-lg placeholder-luxury-black/40 focus:outline-none focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-luxury font-medium text-luxury-black tracking-wide">
                Phone (Optional)
              </label>
              <div className="mt-1">
                <PhoneInput
                  id="phone"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  countryCode={formData.countryCode}
                  onCountryCodeChange={(code) => setFormData({ ...formData, countryCode: code })}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-luxury font-medium text-luxury-black tracking-wide">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-luxury-black/40" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-luxury-black/20 rounded-lg placeholder-luxury-black/40 focus:outline-none focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                  placeholder="Create a password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-luxury tracking-widest uppercase rounded-lg text-white bg-luxury-red hover:bg-luxury-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-red disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
