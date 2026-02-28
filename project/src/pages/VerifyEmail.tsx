import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { verifyEmail, resendVerification } from '../lib/api';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying');
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (token) {
      verifyEmailToken();
    } else {
      setStatus('error');
      setError('Invalid verification token');
    }
  }, [token]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const verifyEmailToken = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      await verifyEmail(token);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Failed to verify email. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    // Get email from URL params or prompt user
    const email = new URLSearchParams(window.location.search).get('email');
    
    if (!email) {
      setError('Email address is required to resend verification');
      return;
    }

    setResending(true);
    setError(null);

    try {
      const response = await resendVerification(email);
      setCooldown(60); // 60 second cooldown
      alert('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      if (err.message?.includes('remainingSeconds')) {
        const match = err.message.match(/(\d+)/);
        if (match) {
          setCooldown(parseInt(match[1]));
        }
      }
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-luxury-white to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto mb-4"></div>
          <h2 className="text-2xl font-luxury font-light text-luxury-black tracking-luxury">
            Verifying Email...
          </h2>
          <p className="text-luxury-black/70 font-luxury tracking-wide">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-luxury-white to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-luxury-black/10 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
              Email Verified Successfully!
            </h2>
            <p className="text-luxury-black/70 mb-6 font-luxury tracking-wide">
              Your email address has been verified. You can now access all features of your Skyriting account.
            </p>
            <Link
              to="/account"
              className="inline-block px-6 py-2 bg-luxury-red text-white rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase text-sm"
            >
              Go to Account
            </Link>
            <div className="mt-4">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-sm text-luxury-black/70 hover:text-luxury-red font-luxury tracking-wide"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-white to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-luxury-black/10 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">
            Verification Failed
          </h2>
          {error && (
            <p className="text-red-600 mb-4 font-luxury tracking-wide">
              {error}
            </p>
          )}
          <p className="text-luxury-black/70 mb-6 font-luxury tracking-wide">
            The verification link may have expired or is invalid. You can request a new verification email.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="w-full flex items-center justify-center space-x-2 px-6 py-2 bg-luxury-red text-white rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Resend in {cooldown}s</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </button>

            <div className="space-y-2">
              <Link
                to="/login"
                className="block text-sm text-luxury-black/70 hover:text-luxury-red font-luxury tracking-wide"
              >
                Back to Login
              </Link>
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-sm text-luxury-black/70 hover:text-luxury-red font-luxury tracking-wide"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
