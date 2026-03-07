import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Users, Clock, Shield, ArrowRight, Star, ChevronRight, Check, Globe, Award } from 'lucide-react';
import SearchWidget from '../components/SearchWidget';
import { getPackages } from '../lib/api';
import type { Package } from '../lib/types';

const FEATURES = [
  {
    icon: Plane,
    title: 'Premium Fleet',
    desc: 'Wide selection of modern aircraft from turboprops to ultra-long-range jets',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    desc: 'Round-the-clock service with guaranteed quick turnaround times',
  },
  {
    icon: Shield,
    title: 'Safety First',
    desc: 'DGCA certified pilots and rigorous maintenance standards',
  },
  {
    icon: Users,
    title: 'Concierge Service',
    desc: 'Dedicated team to handle every detail of your journey',
  },
  {
    icon: Award,
    title: 'Premium Experience',
    desc: 'Luxury amenities, gourmet catering and curated in-flight service',
  },
  {
    icon: Globe,
    title: 'Global Network',
    desc: 'Access to over 50 destinations across India and beyond',
  },
];

const AIRCRAFT_TYPES = [
  { type: 'Helicopter', img: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=600&h=400&fit=crop&q=80', link: '/helicopter' },
  { type: 'Airliner', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&q=80', link: '/fleet?type=Airliner' },
  { type: 'Large Jet', img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&h=400&fit=crop&q=80', link: '/fleet?type=Large' },
  { type: 'Super Mid', img: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&h=400&fit=crop&q=80', link: '/fleet?type=Super Mid' },
  { type: 'Midsize', img: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&h=400&fit=crop&q=80', link: '/fleet?type=Mid' },
  { type: 'Light Jet', img: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=600&h=400&fit=crop&q=80', link: '/fleet?type=Light' },
  { type: 'Turboprop', img: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=400&fit=crop&q=80', link: '/fleet?type=Turboprop' },
];

export default function Home() {
  const [packages, setPackages] = useState<Package[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackages();
        if (response.packages?.length > 0) {
          setPackages(
            response.packages
              .filter((pkg: Package) => pkg.showInNavigation !== false && pkg.isActive)
              .sort((a: Package, b: Package) => (a.order || 0) - (b.order || 0))
              .slice(0, 4)
          );
        }
      } catch {}
    };
    fetchPackages();
  }, []);

  const FALLBACK_PACKAGES = [
    { id: 'yatra', slug: 'skyriting-yatra', title: 'Skyriting Yatra', tagline: 'Sacred pilgrimages by air', img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
    { id: 'wed', slug: 'skyriting-wed', title: 'Skyriting Wed', tagline: 'Wedding luxury travel', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600' },
    { id: 'rescue', slug: 'skyriting-rescue', title: 'Skyriting Rescue', tagline: 'Air ambulance services', img: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?w=600' },
    { id: 'heli', slug: 'skyriting-heli', title: 'Skyriting Heli', tagline: 'Helicopter charters', img: 'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=600' },
  ];

  return (
    <div className="min-h-screen">
      {/* ── HERO SECTION ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat pt-20"
        style={{ backgroundImage: 'url(/images/her_o.png)' }}
      >
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60 z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-0" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
          {/* Tag line */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white/90 text-xs tracking-widest uppercase font-medium">India's Premium Private Aviation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight mb-4 leading-tight animate-fade-in text-center">
            Your Ultimate Private <br className="hidden sm:block" /> Aviation Partner
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-white/70 max-w-xl mb-6 font-light tracking-wide animate-fade-in-delayed text-center">
            Experience bespoke luxury travel with our curated fleet of private jets and helicopters.
          </p>
          {/* Search Widget */}
          <div className="w-full max-w-4xl mt-8">
            <SearchWidget />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── WHY SKYRITING ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-red-600 text-xs tracking-widest uppercase font-semibold mb-2">Why Choose Us</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-3">
              The Skyriting Difference
            </h2>
            <div className="w-16 h-0.5 bg-red-600 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              Unmatched service, safety, and luxury in every flight
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-2xl hover:border-red-100 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <Icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-gray-900 font-semibold text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="py-16 sm:py-24 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-red-500 text-xs tracking-widest uppercase font-semibold mb-2">Our Services</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
                Skyriting Packages
              </h2>
              <div className="w-16 h-0.5 bg-red-600 mt-4" />
            </div>
            <Link
              to="/packages"
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition group"
            >
              View all packages
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(packages.length > 0 ? packages : FALLBACK_PACKAGES).map((pkg: any) => (
              <Link
                key={pkg._id || pkg.id}
                to={`/packages/${pkg.slug || pkg.id}`}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-gray-900 hover:scale-[1.02] transition-transform duration-300"
              >
                <img
                  src={pkg.imageUrl || pkg.img || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600'}
                  alt={pkg.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <h3 className="text-lg sm:text-xl font-light mb-1 tracking-wide">{pkg.title}</h3>
                  <p className="text-white/60 text-xs mb-3">{pkg.subtitle || pkg.tagline || ''}</p>
                  <div className="flex items-center gap-2 text-red-400 text-xs font-medium group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AIRCRAFT FLEET ── */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-red-600 text-xs tracking-widest uppercase font-semibold mb-2">Our Fleet</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
                Aircraft Categories
              </h2>
              <div className="w-16 h-0.5 bg-red-600 mt-4" />
            </div>
            <Link
              to="/fleet"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition group"
            >
              Browse full fleet
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            {AIRCRAFT_TYPES.map(({ type, img, link }) => (
              <Link
                key={type}
                to={link}
                className="group relative overflow-hidden rounded-xl aspect-square bg-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={img}
                  alt={type}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-white text-xs font-medium text-center leading-tight drop-shadow-lg">{type}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES OVERVIEW ── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-red-600 text-xs tracking-widest uppercase font-semibold mb-3">Full-Service Aviation</p>
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6">
                Every aspect of your journey, handled
              </h2>
              <div className="space-y-4">
                {[
                  'Private Jet Charters – One-way, Round trip, Multi-city',
                  'Helicopter Rentals – Sightseeing, Corporate, Emergency',
                  'Corporate Solutions – Business travel at scale',
                  'Special Occasions – Weddings, Events, VIP transfers',
                  'Air Ambulance – Medical evacuations 24/7',
                  'Luxury Packages – Curated experiences',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-red-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-red-600/20"
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600 font-medium text-sm rounded-xl transition"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop&q=80"
                  alt="Private Jet Interior"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">Uncompromised Safety</p>
                    <p className="text-gray-500 text-xs">DGCA Certified Operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4 tracking-tight">
            Ready to Fly?
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Search available jets, get instant pricing, and book your private charter in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/fleet"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 hover:bg-gray-50 font-semibold text-sm rounded-xl transition shadow-xl"
            >
              <Plane className="h-4 w-4" />
              Browse Fleet
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm rounded-xl transition"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
