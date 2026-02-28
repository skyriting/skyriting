import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { forgotPassword } from '../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-white to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-luxury font-light text-luxury-black tracking-luxury">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-luxury-black/70 font-luxury tracking-wide">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-luxury-black/10">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
                Check Your Email
              </h3>
              <p className="text-luxury-black/70 mb-4 font-luxury tracking-wide">
                If an account exists with {email}, we've sent a password reset link to your email address.
              </p>
              <p className="text-sm text-luxury-black/50 mb-6 font-luxury tracking-wide">
                The link will expire in 1 hour.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-luxury-black/20 rounded-lg placeholder-luxury-black/40 focus:outline-none focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-luxury tracking-widest uppercase rounded-lg text-white bg-luxury-red hover:bg-luxury-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-red disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-sm text-luxury-black/70 hover:text-luxury-red font-luxury tracking-wide"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
