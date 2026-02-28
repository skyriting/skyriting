import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Calendar, Plane, CheckCircle } from 'lucide-react';
import { getQuote, acceptQuote } from '../lib/api';
import { getAuthToken } from '../lib/auth';

export default function Quote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuote();
    }
  }, [id]);

  const fetchQuote = async () => {
    try {
      const data = await getQuote(id!);
      setQuote(data.quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setAccepting(true);
    try {
      await acceptQuote(id!, token);
      navigate('/account');
    } catch (error: any) {
      alert(error.message || 'Failed to accept quote');
    } finally {
      setAccepting(false);
    }
  };

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Quote not found</h2>
          <button onClick={() => navigate('/')} className="text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide">
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-white to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-luxury-black/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-luxury font-light text-luxury-black tracking-luxury">Quote {quote.quoteNumber}</h1>
              <p className="text-luxury-black/70 mt-1 font-luxury tracking-wide">
                Valid until: {new Date(quote.validUntil).toLocaleDateString()}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-luxury tracking-wide ${
              quote.status === 'accepted' ? 'bg-luxury-red/20 text-luxury-red' :
              quote.status === 'expired' ? 'bg-luxury-red/10 text-luxury-red' :
              'bg-luxury-red/10 text-luxury-red'
            }`}>
              {quote.status}
            </div>
          </div>

          {quote.legs && quote.legs.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">Flight Details</h2>
              <div className="space-y-3">
                {quote.legs.map((leg: any, i: number) => (
                  <div key={i} className="bg-luxury-white-off p-4 rounded-lg border border-luxury-black/5">
                    <div className="flex items-center space-x-2 mb-2">
                      <Plane className="h-5 w-5 text-luxury-red" />
                      <span className="font-luxury font-light text-luxury-black tracking-luxury">Leg {i + 1}</span>
                    </div>
                    <p className="font-luxury tracking-wide text-luxury-black">{leg.origin} → {leg.destination}</p>
                    <p className="text-sm text-luxury-black/70 font-luxury tracking-wide">
                      {new Date(leg.departureDate).toLocaleDateString()} at {leg.departureTime}
                    </p>
                    <p className="text-sm text-luxury-black/70 font-luxury tracking-wide">
                      Distance: {leg.distance} km | Flight Time: {leg.flightHours} hours
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">Pricing Breakdown</h2>
            <div className="bg-luxury-white-off rounded-lg p-6 border border-luxury-black/5">
              <table className="w-full">
                <tbody className="space-y-2">
                  <tr className="flex justify-between py-2 border-b border-luxury-black/10">
                    <td className="font-luxury tracking-wide text-luxury-black/70">Base Flying Cost</td>
                    <td className="font-luxury font-light text-luxury-black">{formatCurrency(quote.pricing.baseFlyingCost, quote.pricing.currency)}</td>
                  </tr>
                  <tr className="flex justify-between py-2 border-b border-luxury-black/10">
                    <td className="font-luxury tracking-wide text-luxury-black/70">Fuel Surcharge</td>
                    <td className="font-luxury font-light text-luxury-black">{formatCurrency(quote.pricing.fuelSurcharge, quote.pricing.currency)}</td>
                  </tr>
                  <tr className="flex justify-between py-2 border-b border-luxury-black/10">
                    <td className="font-luxury tracking-wide text-luxury-black/70">Airport Fees</td>
                    <td className="font-luxury font-light text-luxury-black">{formatCurrency(quote.pricing.airportFees, quote.pricing.currency)}</td>
                  </tr>
                  <tr className="flex justify-between py-2 border-b border-luxury-black/10">
                    <td className="font-luxury tracking-wide text-luxury-black/70">Crew Expenses</td>
                    <td className="font-luxury font-light text-luxury-black">{formatCurrency(quote.pricing.crewExpenses, quote.pricing.currency)}</td>
                  </tr>
                  <tr className="flex justify-between py-2 border-b border-luxury-black/10">
                    <td className="font-luxury tracking-wide text-luxury-black/70">Subtotal</td>
                    <td className="font-luxury font-light text-luxury-black">{formatCurrency(quote.pricing.subtotal, quote.pricing.currency)}</td>
                  </tr>
                  {quote.pricing.marginAmount > 0 && (
                    <tr className="flex justify-between py-2 border-b border-luxury-black/10">
                      <td className="font-luxury tracking-wide text-luxury-black/70">Margin ({quote.pricing.marginPercentage}%)</td>
                      <td className="font-luxury font-light text-luxury-black">{formatCurrency(quote.pricing.marginAmount, quote.pricing.currency)}</td>
                    </tr>
                  )}
                  {quote.pricing.taxAmount > 0 && (
                    <tr className="flex justify-between py-2 border-b border-luxury-black/10">
                      <td className="font-luxury tracking-wide text-luxury-black/70">Tax ({quote.pricing.taxRate}%)</td>
                      <td className="font-luxury font-light text-luxury-black">{formatCurrency(quote.pricing.taxAmount, quote.pricing.currency)}</td>
                    </tr>
                  )}
                  <tr className="flex justify-between py-3 border-t-2 border-luxury-black/20 mt-2">
                    <td className="text-lg font-luxury font-light text-luxury-black">Total Cost</td>
                    <td className="text-2xl font-luxury font-light text-luxury-red">
                      {formatCurrency(quote.pricing.totalCost, quote.pricing.currency)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {quote.terms && (
            <div className="mb-6">
              <h2 className="text-xl font-luxury font-light text-luxury-black mb-3 tracking-luxury">Terms & Conditions</h2>
              <p className="text-luxury-black/70 font-luxury tracking-wide">{quote.terms}</p>
            </div>
          )}

          {quote.status === 'pending' || quote.status === 'sent' ? (
            <div className="flex space-x-4">
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="flex-1 bg-luxury-red text-white py-3 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase disabled:opacity-50"
              >
                {accepting ? 'Processing...' : 'Accept Quote'}
              </button>
              <button
                onClick={() => navigate('/account')}
                className="flex-1 bg-luxury-white-off text-luxury-black py-3 rounded-lg hover:bg-luxury-white-cream transition font-luxury tracking-wide"
              >
                View All Quotes
              </button>
            </div>
          ) : quote.status === 'accepted' ? (
            <div className="bg-luxury-red/10 border border-luxury-red/20 rounded-lg p-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-luxury-red" />
              <span className="text-luxury-red font-luxury tracking-wide">Quote accepted. Proceed to booking.</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
