import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../lib/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, formData.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-luxury-white to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-luxury-black/10 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
              Password Reset Successful
            </h2>
            <p className="text-luxury-black/70 mb-4 font-luxury tracking-wide">
              Your password has been reset successfully. You will be redirected to the login page shortly.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go to Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-white to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-luxury font-light text-luxury-black tracking-luxury">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-luxury-black/70 font-luxury tracking-wide">
            Enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center space-x-2">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-luxury font-medium text-luxury-black tracking-wide">
                New Password
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
                  placeholder="Enter new password (min 6 characters)"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-luxury font-medium text-luxury-black tracking-wide">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-luxury-black/40" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-luxury-black/20 rounded-lg placeholder-luxury-black/40 focus:outline-none focus:ring-luxury-red focus:border-luxury-red font-luxury tracking-wide"
                  placeholder="Confirm new password"
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !token}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-luxury tracking-widest uppercase rounded-lg text-white bg-luxury-red hover:bg-luxury-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-luxury-red disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
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
      </div>
    </div>
  );
}
