import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { login, resendVerification } from '../lib/api';
import { setAuthToken } from '../lib/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [verificationMessage] = useState<string | null>(
    location.state?.verificationMessage || null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailNotVerified(false);
    setLoading(true);

    try {
      const response = await login(formData);
      const userRole = response.user?.role || 'user';

      // For regular users, enforce email verification
      if (userRole !== 'admin' && !response.user?.emailVerified) {
        setEmailNotVerified(true);
        setError('Please verify your email before logging in.');
        return;
      }

      setAuthToken(response.token);
      localStorage.setItem('skyriting_user_role', userRole);

      if (userRole === 'admin') {
        navigate('/3636847rgyuvfu3f/98184t763gvf/dashboard');
      } else {
        const from = location.state?.from || '/account';
        navigate(from);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError('Please enter your email address above first.');
      return;
    }
    setResending(true);
    setResendSuccess(false);
    try {
      await resendVerification(formData.email);
      setResendSuccess(true);
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-800/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/2 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group">
            <div className="flex items-center justify-center mb-4">
              <img src="/images/her_o.png" alt="Skyriting" className="h-12 object-contain filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-widest uppercase mb-2">
            Welcome Back
          </h1>
          <p className="text-white/50 text-sm tracking-wide">Sign in to your Skyriting account</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Registration success message */}
          {verificationMessage && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-300 text-sm font-medium mb-1">Check Your Email</p>
                <p className="text-amber-300/70 text-xs">{verificationMessage}</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-300 text-sm">{error}</p>
                {emailNotVerified && (
                  <div className="mt-3 space-y-2">
                    {resendSuccess ? (
                      <div className="flex items-center gap-2 text-green-400 text-xs">
                        <CheckCircle className="h-4 w-4" />
                        <span>Verification email sent! Check your inbox.</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleResendVerification}
                        disabled={resending || cooldown > 0}
                        className="flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 underline transition disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3 w-3 ${resending ? 'animate-spin' : ''}`} />
                        {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? 'Sending...' : 'Resend verification email'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/60 tracking-widest uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-white/60 tracking-widest uppercase">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-red-400 hover:text-red-300 transition">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium tracking-widest uppercase text-sm rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-white/40 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-400 hover:text-red-300 transition font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-white/30 hover:text-white/60 text-xs tracking-widest uppercase transition">
            ← Back to Skyriting
          </Link>
        </div>
      </div>
    </div>
  );
}
