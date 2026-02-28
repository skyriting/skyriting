import { useEffect, useState } from 'react';
import { Check, Crown, Star, Zap, ArrowRight } from 'lucide-react';
import { getMemberships } from '../lib/api';
import type { Membership } from '../lib/types';

export default function MembershipPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const data = await getMemberships();
      const transformedMemberships = (data || [])
        .filter((m: any) => m.active !== false)
        .map((m: any) => ({
          ...m,
          id: m._id || m.id,
        }))
        .sort((a: any, b: any) => b.priority_level - a.priority_level);
      setMemberships(transformedMemberships);
    } catch (error) {
      console.error('Error fetching memberships:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTierIcon = (tierName: string) => {
    if (tierName.toLowerCase().includes('platinum')) return Crown;
    if (tierName.toLowerCase().includes('gold')) return Star;
    return Zap;
  };

  const getTierColor = (tierName: string) => {
    if (tierName.toLowerCase().includes('platinum')) return 'from-luxury-red to-luxury-red/80';
    if (tierName.toLowerCase().includes('gold')) return 'from-luxury-red/90 to-luxury-red/70';
    return 'from-luxury-black to-black';
  };

  const handleEnquiry = (membership: Membership) => {
    window.location.href = `mailto:info@skyriting.com?subject=Membership Inquiry: ${membership.tier_name}&body=Interested in ${membership.tier_name} membership tier`;
      },
    });
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">Skyriting Elite Membership</h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            Join Skyriting's elite community and enjoy guaranteed availability, discounted rates,
            and premium service on all your private aviation needs.
          </p>
        </div>
      </section>

      <section className="py-20 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md text-center border border-luxury-black/5">
              <div className="bg-luxury-red/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Pre-Purchased Hours</h3>
              <p className="text-luxury-black/70 font-luxury tracking-wide">
                Buy flight hour blocks at significantly discounted rates
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center border border-luxury-black/5">
              <div className="bg-luxury-red/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Guaranteed Availability</h3>
              <p className="text-luxury-black/70 font-luxury tracking-wide">
                24-48 hour guaranteed aircraft availability with priority booking
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center border border-luxury-black/5">
              <div className="bg-luxury-red/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6 text-luxury-red" />
              </div>
              <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Concierge Service</h3>
              <p className="text-luxury-black/70 font-luxury tracking-wide">
                Dedicated account manager and premium support services
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto"></div>
              <p className="mt-4 text-luxury-black/70 font-luxury">Loading membership tiers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {memberships.map((membership) => {
                const Icon = getTierIcon(membership.tier_name);
                const gradientColor = getTierColor(membership.tier_name);
                const isPlatinum = membership.tier_name.toLowerCase().includes('platinum');

                return (
                  <div
                    key={membership.id}
                    className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-luxury-black/5 ${
                      isPlatinum ? 'ring-4 ring-luxury-red transform scale-105' : ''
                    }`}
                  >
                    {isPlatinum && (
                      <div className="bg-luxury-red text-white text-center py-2 text-sm font-luxury tracking-widest uppercase">
                        MOST POPULAR
                      </div>
                    )}

                    <div className={`bg-gradient-to-r ${gradientColor} p-8 text-white`}>
                      <Icon className="h-12 w-12 mb-4" />
                      <h3 className="text-3xl font-luxury font-light mb-2 tracking-luxury">{membership.tier_name}</h3>
                      <p className="text-white/90 mb-6 font-luxury tracking-wide">{membership.block_hours} Flight Hours</p>
                      <div className="mb-2">
                        <span className="text-4xl font-luxury font-light">{formatPrice(membership.hourly_rate_discount)}</span>
                        <span className="text-white/90 font-luxury">/hour</span>
                      </div>
                      <p className="text-sm text-white/80 font-luxury tracking-wide">
                        + {formatPrice(membership.annual_fee)} annual fee
                      </p>
                    </div>

                    <div className="p-8">
                      <ul className="space-y-4 mb-8">
                        {membership.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <Check className="h-5 w-5 text-luxury-red flex-shrink-0 mt-0.5" />
                            <span className="text-luxury-black/70 font-luxury tracking-wide">{benefit}</span>
                          </li>
                        ))}
                        <li className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-luxury-red flex-shrink-0 mt-0.5" />
                          <span className="text-luxury-black/70 font-luxury tracking-wide">
                            {membership.guaranteed_availability_hours}-hour guaranteed availability
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-luxury-red flex-shrink-0 mt-0.5" />
                          <span className="text-luxury-black/70 font-luxury tracking-wide">
                            Priority level {membership.priority_level} booking
                          </span>
                        </li>
                      </ul>

                      <button
                        onClick={() => handleEnquiry(membership)}
                        className={`w-full py-4 rounded-lg font-luxury tracking-widest uppercase transition shadow-lg flex items-center justify-center space-x-2 ${
                          isPlatinum
                            ? 'bg-luxury-red text-white hover:bg-luxury-red/90'
                            : 'bg-luxury-black text-white hover:bg-luxury-black/90'
                        }`}
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-luxury-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-luxury font-light text-luxury-black mb-8 text-center tracking-luxury">How Membership Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-luxury-red/20 text-luxury-red w-8 h-8 rounded-full flex items-center justify-center font-luxury font-light flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Choose Your Tier</h3>
                <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                  Select a membership tier based on your expected annual flight hours.
                  Higher tiers offer better rates and guaranteed faster availability.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-luxury-red/20 text-luxury-red w-8 h-8 rounded-full flex items-center justify-center font-luxury font-light flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Pre-Purchase Hours</h3>
                <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                  Pay upfront for a block of flight hours at discounted rates. Your annual
                  management fee covers dedicated account support and priority service.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-luxury-red/20 text-luxury-red w-8 h-8 rounded-full flex items-center justify-center font-luxury font-light flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Book with Confidence</h3>
                <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                  Enjoy guaranteed aircraft availability within your tier's timeframe,
                  fixed hourly rates regardless of demand, and premium concierge service
                  for all your travel needs.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-luxury-red/20 text-luxury-red w-8 h-8 rounded-full flex items-center justify-center font-luxury font-light flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Track Your Hours</h3>
                <p className="text-luxury-black/70 leading-relaxed font-luxury tracking-wide">
                  Monitor your remaining flight hours through your member portal.
                  Unused hours typically roll over or can be shared with approved guests
                  depending on your tier benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">Ready to Join Skyriting?</h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed font-luxury tracking-wide">
            Contact our membership team to discuss which tier is right for you and
            start enjoying the benefits of guaranteed private aviation access with Skyriting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+911234567890"
              className="bg-white text-luxury-red px-8 py-4 rounded-lg hover:bg-luxury-white-off transition font-luxury tracking-widest uppercase shadow-lg"
            >
              Call +91 123 456 7890
            </a>
            <a
              href="mailto:info@skyriting.com?subject=Membership Information Request"
              className="bg-luxury-red text-white px-8 py-4 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg border-2 border-white inline-block"
            >
              Request Information
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
