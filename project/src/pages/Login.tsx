import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { login } from '../lib/api';
import { setAuthToken } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    location.state?.verificationMessage || null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(formData);
      
      // Check if email is verified
      if (!response.user?.emailVerified) {
        setVerificationMessage('Please verify your email address to access your account. Check your inbox for the verification link.');
        setError('Email not verified');
        return;
      }
      
      setAuthToken(response.token);
      navigate('/account');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-white to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-luxury font-light text-luxury-black tracking-luxury">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-luxury-black/70 font-luxury tracking-wide">
            Or{' '}
            <Link to="/register" className="font-medium text-luxury-red hover:text-luxury-red/80">
              create a new account
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-luxury-black/70 font-luxury tracking-wide">
            <Link to="/forgot-password" className="font-medium text-luxury-red hover:text-luxury-red/80">
              Forgot your password?
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {verificationMessage && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium mb-1">Email Verification Required</p>
                <p className="text-sm">{verificationMessage}</p>
                <Link
                  to="/verify-email"
                  className="text-sm text-luxury-red hover:text-luxury-red/80 underline mt-1 inline-block"
                >
                  Resend verification email
                </Link>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
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
              <label htmlFor="password" className="block text-sm font-luxury font-medium text-luxury-black tracking-wide">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-luxury-black/40" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-luxury-black/20 rounded-lg placeholder-luxury-black/40 focus:outline-none focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                  placeholder="Enter your password"
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
                'Signing in...'
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign in
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
