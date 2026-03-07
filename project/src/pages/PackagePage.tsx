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
          <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">Package Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-500  tracking-wide"
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
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight">{packageData.title}</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed  tracking-wide">
            {packageData.description}
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">
                Comprehensive {packageData.package_name} Services
              </h2>
              <ul className="space-y-4">
                {packageData.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="bg-red-600/10 rounded-full p-1 flex-shrink-0 mt-1">
                      <Check className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="text-lg text-gray-500  tracking-wide">{feature}</span>
                  </li>
                ))}
              </ul>

              {packageData.starting_price && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-50">
                  <p className="text-sm text-gray-500 mb-2 ">Starting from</p>
                  <p className="text-4xl font-light text-red-600 mb-4">
                    {formatPrice(packageData.starting_price)}
                  </p>
                  <p className="text-sm text-gray-500  tracking-wide">
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
        <section className="py-20 bg-[#FAFAFA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-gray-900 mb-8 text-center tracking-tight">
              Popular Pilgrimage Destinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Varanasi', 'Tirupati', 'Amritsar', 'Shirdi', 'Kedarnath', 'Badrinath'].map((destination) => (
                <div key={destination} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
                  <h3 className="text-xl font-light text-gray-900 tracking-tight">{destination}</h3>
                  <p className="text-gray-500 mt-2  tracking-wide">
                    Direct charter service with VIP temple access and ground arrangements
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {packageType === 'wedding' && (
        <section className="py-20 bg-[#FAFAFA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-gray-900 mb-8 text-center tracking-tight">
              Wedding Aviation Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">Bride & Groom</h3>
                <p className="text-gray-500  tracking-wide">
                  Make a grand entrance with decorated aircraft for the couple
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">Guest Transport</h3>
                <p className="text-gray-500  tracking-wide">
                  Charter aircraft for wedding guests from multiple cities
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">Destination Weddings</h3>
                <p className="text-gray-500  tracking-wide">
                  Complete aviation solution for destination wedding events
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {packageType === 'ambulance' && (
        <section className="py-20 bg-[#FAFAFA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-gray-900 mb-8 text-center tracking-tight">
              24/7 Medical Evacuation
            </h2>
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-50">
              <p className="text-lg text-gray-500 mb-6 leading-relaxed  tracking-wide">
                Our air ambulance service provides critical care transportation with ICU-equipped
                aircraft and experienced medical professionals. We coordinate with hospitals for
                seamless bed-to-bed transfers and handle all insurance documentation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-red-600" />
                  <span className="text-gray-500  tracking-wide">Neonatal ICU capability</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-red-600" />
                  <span className="text-gray-500  tracking-wide">Cardiac care equipment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-red-600" />
                  <span className="text-gray-500  tracking-wide">Ventilator support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-5 w-5 text-red-600" />
                  <span className="text-gray-500  tracking-wide">Trained paramedics</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {packageType === 'helicopter' && (
        <section className="py-20 bg-[#FAFAFA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-gray-900 mb-8 text-center tracking-tight">
              Helicopter Service Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-50">
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">City Transfers</h3>
                <p className="text-gray-500  tracking-wide">
                  Beat traffic with quick helicopter transfers between cities and airports
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-50">
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">Corporate Events</h3>
                <p className="text-gray-500  tracking-wide">
                  Make an impression arriving at corporate events and business meetings
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-50">
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">Scenic Tours</h3>
                <p className="text-gray-500  tracking-wide">
                  Experience breathtaking aerial views of cities and landscapes
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-50">
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-tight">Site Inspections</h3>
                <p className="text-gray-500  tracking-wide">
                  Quick access to remote locations for project and property inspections
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">Get Started Today</h2>
          <p className="text-xl text-gray-500 mb-8 leading-relaxed  tracking-wide">
            Contact our specialized team to discuss your requirements and receive a
            customized quote for your {packageData.package_name} needs.
          </p>
          <button
            onClick={handleEnquiry}
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition  tracking-widest uppercase shadow-lg"
          >
            <span>Request a Quote</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
