import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { getSpecializedPackage } from '../lib/api';
import type { SpecializedPackage } from '../lib/types';

export default function PackagePage() {
  const { packageType } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState<SpecializedPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackage();
  }, [packageType]);

  const fetchPackage = async () => {
    if (!packageType) {
      setLoading(false);
      return;
    }
    try {
      const data = await getSpecializedPackage(packageType);
      if (data) {
        setPackageData({
          ...data,
          id: data._id || data.id,
        });
      }
    } catch (error) {
      console.error('Error fetching package:', error);
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

  const handleEnquiry = () => {
    window.location.href = `mailto:info@skyriting.com?subject=Package Inquiry: ${packageData?.package_name}&body=Interested in ${packageData?.package_name} package`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-luxury font-light text-luxury-black mb-4 tracking-luxury">Package Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-luxury-red hover:text-luxury-red/80 font-luxury tracking-wide"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <section
        className="relative py-32 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${packageData.image_url})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-luxury font-light mb-6 tracking-luxury">{packageData.title}</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            {packageData.description}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-luxury font-light text-luxury-black mb-8 tracking-luxury">
                Comprehensive {packageData.package_name} Services
              </h2>
              <ul className="space-y-4">
                {packageData.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="bg-luxury-red/10 rounded-full p-1 flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-luxury-red" />
                    </div>
                    <span className="text-lg text-luxury-black/70 font-luxury tracking-wide">{feature}</span>
                  </li>
                ))}
              </ul>

              {packageData.starting_price && (
                <div className="mt-8 p-6 bg-luxury-white-off rounded-xl border border-luxury-black/5">
                  <p className="text-sm text-luxury-black/70 mb-2 font-luxury">Starting from</p>
                  <p className="text-4xl font-luxury font-light text-luxury-red mb-4">
                    {formatPrice(packageData.starting_price)}
                  </p>
                  <p className="text-sm text-luxury-black/70 font-luxury tracking-wide">
                    Final pricing depends on route, aircraft selection, and additional services
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={packageData.image_url || 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800'}
                alt={packageData.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {packageType === 'pilgrimage' && (
        <section className="py-20 bg-luxury-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-luxury font-light text-luxury-black mb-8 text-center tracking-luxury">
              Popular Pilgrimage Destinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Varanasi', 'Tirupati', 'Amritsar', 'Shirdi', 'Kedarnath', 'Badrinath'].map((destination) => (
                <div key={destination} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
                  <h3 className="text-xl font-luxury font-light text-luxury-black tracking-luxury">{destination}</h3>
                  <p className="text-luxury-black/70 mt-2 font-luxury tracking-wide">
                    Direct charter service with VIP temple access and ground arrangements
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {packageType === 'wedding' && (
        <section className="py-20 bg-luxury-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-luxury font-light text-luxury-black mb-8 text-center tracking-luxury">
              Wedding Aviation Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Bride & Groom</h3>
                <p className="text-luxury-black/70 font-luxury tracking-wide">
                  Make a grand entrance with decorated aircraft for the couple
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Guest Transport</h3>
                <p className="text-luxury-black/70 font-luxury tracking-wide">
                  Charter aircraft for wedding guests from multiple cities
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Destination Weddings</h3>
                <p className="text-luxury-black/70 font-luxury tracking-wide">
                  Complete aviation solution for destination wedding events
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {packageType === 'ambulance' && (
        <section className="py-20 bg-luxury-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-luxury font-light text-luxury-black mb-8 text-center tracking-luxury">
              24/7 Medical Evacuation
            </h2>
            <div className="bg-white p-8 rounded-xl shadow-md border border-luxury-black/5">
              <p className="text-lg text-luxury-black/70 mb-6 leading-relaxed font-luxury tracking-wide">
                Our air ambulance service provides critical care transportation with ICU-equipped
                aircraft and experienced medical professionals. We coordinate with hospitals for
                seamless bed-to-bed transfers and handle all insurance documentation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-luxury-red" />
                  <span className="text-luxury-black/70 font-luxury tracking-wide">Neonatal ICU capability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-luxury-red" />
                  <span className="text-luxury-black/70 font-luxury tracking-wide">Cardiac care equipment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-luxury-red" />
                  <span className="text-luxury-black/70 font-luxury tracking-wide">Ventilator support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-luxury-red" />
                  <span className="text-luxury-black/70 font-luxury tracking-wide">Trained paramedics</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {packageType === 'helicopter' && (
        <section className="py-20 bg-luxury-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-luxury font-light text-luxury-black mb-8 text-center tracking-luxury">
              Helicopter Service Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/5">
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">City Transfers</h3>
                <p className="text-luxury-black/70 font-luxury tracking-wide">
                  Beat traffic with quick helicopter transfers between cities and airports
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/5">
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Corporate Events</h3>
                <p className="text-luxury-black/70 font-luxury tracking-wide">
                  Make an impression arriving at corporate events and business meetings
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/5">
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Scenic Tours</h3>
                <p className="text-luxury-black/70 font-luxury tracking-wide">
                  Experience breathtaking aerial views of cities and landscapes
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-luxury-black/5">
                <h3 className="text-xl font-luxury font-light text-luxury-black mb-2 tracking-luxury">Site Inspections</h3>
                <p className="text-luxury-black/70 font-luxury tracking-wide">
                  Quick access to remote locations for project and property inspections
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-luxury font-light text-luxury-black mb-6 tracking-luxury">Get Started Today</h2>
          <p className="text-xl text-luxury-black/70 mb-8 leading-relaxed font-luxury tracking-wide">
            Contact our specialized team to discuss your requirements and receive a
            customized quote for your {packageData.package_name} needs.
          </p>
          <button
            onClick={handleEnquiry}
            className="inline-flex items-center space-x-2 bg-luxury-red text-white px-8 py-4 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg"
          >
            <span>Request a Quote</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
