import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, ArrowLeft, RefreshCw, Loader } from 'lucide-react';
import { verifyEmail, resendVerification } from '../lib/api';

export default function VerifyEmail() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const emailFromParams = searchParams.get('email');
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [email, setEmail] = useState(emailFromParams || '');

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    } else {
      setStatus('error');
      setError('No verification token found in the link.');
    }
  }, [token]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const verifyEmailToken = async () => {
    if (!token) return;
    setStatus('verifying');
    try {
      await verifyEmail(token);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Verification failed. The link may be expired or invalid.');
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setResending(true);
    setResendSuccess(false);
    try {
      await resendVerification(email);
      setResendSuccess(true);
      setCooldown(60);
    } catch (err: any) {
      const msg = err.message || '';
      const match = msg.match(/(\d+) seconds/);
      if (match) setCooldown(parseInt(match[1]));
      setError(msg || 'Failed to resend. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src="/images/her_o.png" alt="Skyriting" className="h-12 object-contain filter brightness-0 invert opacity-90 mx-auto" />
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
          {/* Verifying */}
          {status === 'verifying' && (
            <>
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="h-10 w-10 text-white/60 animate-spin" />
              </div>
              <h2 className="text-2xl font-light text-white tracking-wide mb-3">Verifying Email</h2>
              <p className="text-white/60 text-sm">Please wait while we verify your email address...</p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-light text-white tracking-wide mb-3">Email Verified!</h2>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">
                Your email address has been successfully verified. You can now log in and access all Skyriting features.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium tracking-widest uppercase text-sm rounded-xl transition-all duration-200 shadow-lg"
              >
                Sign In Now
              </Link>
              <div className="mt-6">
                <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10 text-red-400" />
              </div>
              <h2 className="text-2xl font-light text-white tracking-wide mb-3">Verification Failed</h2>
              {error && (
                <p className="text-red-300/80 text-sm mb-6">{error}</p>
              )}
              <p className="text-white/60 text-sm mb-6">
                The verification link may have expired. Request a new one below.
              </p>

              {resendSuccess ? (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium text-sm">Email Sent!</span>
                  </div>
                  <p className="text-green-300/70 text-xs">Check your inbox for the new verification link.</p>
                  {cooldown > 0 && (
                    <p className="text-white/30 text-xs mt-2">Resend available in {cooldown}s</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-3 mb-6">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resending || cooldown > 0}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium tracking-widest uppercase text-sm rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
                    {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </form>
              )}

              <div className="space-y-3">
                <Link to="/login" className="block text-white/50 hover:text-white/80 text-sm transition">
                  Back to Login
                </Link>
                <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-sm transition">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
