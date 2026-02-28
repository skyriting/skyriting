import { Link } from 'react-router-dom';
import { Settings, Plane, ShoppingBag, Wrench, FileText, Zap, ArrowRight, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getServices } from '../lib/api';
import type { Service } from '../lib/types';

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  Plane,
  ShoppingBag,
  Wrench,
  FileText,
  Zap,
};

export default function Services() {
  const [services, setServices] = useState<(Service & { icon?: React.ComponentType<{ className?: string }> })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await getServices();
        if (response.services && response.services.length > 0) {
          // Map icon names to components
          const mappedServices = response.services.map((service: Service) => ({
            ...service,
            icon: iconMap[service.icon || 'Plane'] || Plane,
          }));
          setServices(mappedServices);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to empty array - will show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Breadcrumb */}
      <section className="bg-luxury-white py-4 border-b border-luxury-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-luxury tracking-wide text-luxury-black/70">
            <Link to="/" className="hover:text-luxury-red transition">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-luxury-black">Our Services</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            Our Services
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-luxury tracking-wide">
            Comprehensive Aviation Solutions Tailored to Your Needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20 lg:py-24 bg-luxury-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-red mx-auto mb-4"></div>
              <p className="text-luxury-black/70 font-luxury tracking-wide">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-luxury-black/70 font-luxury tracking-wide">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service._id || service.id}
                    to={`/services/${service.slug || service.id}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-luxury-black/10 group"
                  >
                    <div className="relative h-48 bg-luxury-black/5">
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className="h-16 w-16 text-luxury-black/20" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-luxury-red text-white px-3 py-1 rounded-full text-sm font-luxury tracking-wide">
                        {service.title.split(' ')[0]}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-luxury-red/10 p-2 rounded-lg">
                          <Icon className="h-6 w-6 text-luxury-red" />
                        </div>
                        <h3 className="text-xl font-luxury font-light text-luxury-black tracking-luxury">
                          {service.title}
                        </h3>
                      </div>
                      <p className="text-luxury-black/70 mb-4 leading-relaxed font-luxury tracking-wide text-sm">
                        {service.description}
                      </p>
                      <div className="flex items-center text-luxury-red group-hover:text-luxury-red/80 transition font-luxury tracking-wide">
                        <span className="text-sm">View More</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-luxury-black to-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-luxury font-light mb-4 sm:mb-6 tracking-luxury">
            Need Help Choosing a Service?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed font-luxury tracking-wide">
            Our aviation experts are ready to help you find the perfect solution for your needs.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 bg-luxury-red text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-luxury-red/90 transition font-luxury tracking-widest uppercase shadow-lg text-sm sm:text-base"
          >
            <span>Contact Us</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
