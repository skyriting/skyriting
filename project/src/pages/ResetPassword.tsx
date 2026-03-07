import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle, XCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { resetPassword } from '../lib/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      setError('Invalid or missing reset token');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, formData.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-widest uppercase mb-2">
            New Password
          </h1>
          <p className="text-white/50 text-sm tracking-wide">
            Create a secure new password for your account
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {success ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-light text-white tracking-wide mb-3">Password Updated!</h2>
              <p className="text-white/60 text-sm mb-8">Your password has been reset successfully. Redirecting to login...</p>
              <div className="h-1 bg-white/5 rounded-full mb-4">
                <div className="h-1 bg-green-500 rounded-full animate-pulse w-3/5"></div>
              </div>
              <Link to="/login" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition">
                <ArrowLeft className="h-4 w-4" />
                Go to Login
              </Link>
            </div>
          ) : (
            <>
              {!token && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 text-sm">Invalid or missing reset token. Please request a new password reset.</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-white/60 tracking-widest uppercase mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition text-sm"
                      placeholder="Min 6 characters"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-2 flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            formData.password.length >= (i + 1) * 2.5
                              ? formData.password.length >= 10 ? 'bg-green-500' : formData.password.length >= 6 ? 'bg-amber-500' : 'bg-red-500'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/60 tracking-widest uppercase mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-11 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-white/20 focus:outline-none transition text-sm ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-500/50'
                          : 'border-white/10 focus:border-red-500/50'
                      }`}
                      placeholder="Repeat new password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition">
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium tracking-widest uppercase text-sm rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
