import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users, Clock, MapPin, Search, Plus, X, ChevronDown, Send } from 'lucide-react';
import PhoneInput from './PhoneInput';
import SuccessModal from './SuccessModal';
import { getOriginCities, getDestinationCities, createHelicopterInquiry } from '../lib/api';

interface Leg {
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  paxCount: number;
}

interface CityDropdownProps {
  value: string;
  onChange: (city: string) => void;
  cities: string[];
  placeholder: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

function CityDropdown({ value, onChange, cities, placeholder, disabled = false, icon }: CityDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = cities.filter(city =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(!open); setSearch(''); } }}
        className={`w-full flex items-center gap-2 px-3 py-3 bg-white border rounded-xl text-left transition-all duration-300 text-sm font-medium ${
          disabled
            ? 'border-gray-100 bg-gray-50/50 cursor-not-allowed opacity-40'
            : 'border-gray-200 hover:border-red-600 hover:shadow-md hover:shadow-red-600/5 focus:border-red-600 cursor-pointer shadow-sm'
        } ${open ? 'border-red-600 ring-4 ring-red-600/5' : ''}`}
      >
        {icon && <span className={`${disabled ? 'text-gray-300' : 'text-gray-400'} flex-shrink-0 transition-colors ${open ? 'text-red-600' : ''}`}>{icon}</span>}
        <span className={`flex-1 truncate text-xs sm:text-sm tracking-wide ${value ? 'text-gray-900 font-semibold' : 'text-gray-400 font-light'}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-gray-400 flex-shrink-0 transition-all duration-300 ${open ? 'rotate-180 text-red-600 scale-110' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300" style={{ minWidth: '240px' }}>
          <div className="p-3 border-b border-gray-50 bg-gray-50/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Where to?"
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-100 rounded-xl focus:outline-none focus:border-red-600 bg-white transition-all font-medium tracking-wide"
                onClick={e => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-200">
            {filtered.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-xs text-gray-400 font-light italic">No destinations found...</p>
              </div>
            ) : (
              filtered.map(city => (
                <button
                  key={city}
                  type="button"
                  onClick={() => { onChange(city); setOpen(false); setSearch(''); }}
                  className={`w-full text-left px-5 py-3 text-xs transition-colors flex items-center justify-between group ${
                    value === city ? 'bg-red-50 text-red-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${value === city ? 'bg-red-100' : 'bg-gray-100 group-hover:bg-red-100'}`}>
                      <MapPin className={`h-3 w-3 ${value === city ? 'text-red-700' : 'text-gray-400 group-hover:text-red-600'}`} />
                    </div>
                    <span className="tracking-wide uppercase font-semibold">{city}</span>
                  </div>
                  {value === city && <div className="w-1.5 h-1.5 rounded-full bg-red-600" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchWidget() {
  const navigate = useNavigate();
  const [originCities, setOriginCities] = useState<string[]>([]);
  const [destinationCitiesMap, setDestinationCitiesMap] = useState<{ [origin: string]: string[] }>({});
  const [aircraftType, setAircraftType] = useState<'jet' | 'helicopter'>('jet');
  const [tripType, setTripType] = useState<'one_way' | 'round_trip' | 'multi_trip'>('one_way');
  const [legs, setLegs] = useState<Leg[]>([{
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    paxCount: 1,
  }]);
  const [helicopterForm, setHelicopterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+1',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchOriginCities();
  }, []);

  const fetchOriginCities = async () => {
    try {
      const response = await getOriginCities();
      setOriginCities(response.cities || []);
    } catch {}
  };

  const getDestinationCitiesForOrigin = async (origin: string): Promise<string[]> => {
    if (destinationCitiesMap[origin]) return destinationCitiesMap[origin];
    try {
      const response = await getDestinationCities(origin);
      const cities = response.cities || [];
      setDestinationCitiesMap(prev => ({ ...prev, [origin]: cities }));
      return cities;
    } catch {
      return [];
    }
  };

  const [destinationCities, setDestinationCities] = useState<string[]>([]);

  useEffect(() => {
    if (legs[0]?.origin) {
      getDestinationCitiesForOrigin(legs[0].origin).then(setDestinationCities);
    } else {
      setDestinationCities([]);
    }
  }, [legs[0]?.origin]);

  useEffect(() => {
    if (tripType === 'round_trip' && legs.length === 1 && legs[0].origin && legs[0].destination) {
      setLegs([legs[0], {
        origin: legs[0].destination,
        destination: legs[0].origin,
        departureDate: '',
        departureTime: '',
        paxCount: legs[0].paxCount,
      }]);
    } else if (tripType === 'one_way' && legs.length > 1) {
      setLegs([legs[0]]);
    }
  }, [tripType]);

  const handleLegChange = (index: number, field: keyof Leg, value: string | number) => {
    const newLegs = [...legs];
    newLegs[index] = { ...newLegs[index], [field]: value };
    if (field === 'origin') newLegs[index].destination = '';
    if (tripType === 'round_trip' && index === 0 && field === 'destination' && newLegs[1]) {
      newLegs[1].origin = value as string;
    }
    setLegs(newLegs);
  };

  const addLeg = () => {
    if (legs.length < 10) {
      const lastLeg = legs[legs.length - 1];
      setLegs([...legs, {
        origin: lastLeg.destination || '',
        destination: '',
        departureDate: '',
        departureTime: '',
        paxCount: lastLeg.paxCount,
      }]);
    }
  };

  const removeLeg = (index: number) => {
    if (legs.length > 1 && index > 0) {
      setLegs(legs.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!legs[0].origin || !legs[0].destination || !legs[0].departureDate || !legs[0].departureTime) {
      setErrorMsg('Please fill in all required fields (departure city, arrival city, date, and time).');
      return;
    }

    const tripTypeFormatted = tripType === 'one_way' ? 'one-way' : tripType === 'round_trip' ? 'round-trip' : 'multi-trip';
    const searchLegs = tripTypeFormatted === 'round-trip' ? [
      { origin: legs[0].origin, destination: legs[0].destination, departureDate: legs[0].departureDate, departureTime: legs[0].departureTime, paxCount: legs[0].paxCount },
      ...(legs[1]?.departureDate ? [{ origin: legs[0].destination, destination: legs[0].origin, departureDate: legs[1].departureDate, departureTime: legs[1].departureTime, paxCount: legs[0].paxCount }] : []),
    ] : legs.map(leg => ({ origin: leg.origin, destination: leg.destination, departureDate: leg.departureDate, departureTime: leg.departureTime, paxCount: leg.paxCount }));

    navigate('/search-results', { state: { tripType: tripTypeFormatted, legs: searchLegs, filters: { minCapacity: legs[0].paxCount } } });
  };

  const handleHelicopterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createHelicopterInquiry({ ...helicopterForm, phone: `${helicopterForm.countryCode} ${helicopterForm.phone}` });
      setShowSuccessModal(true);
      setHelicopterForm({ fullName: '', email: '', phone: '', countryCode: '+91', message: '' });
    } catch (error: any) {
      alert(error.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full mx-auto">
      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="Request Received!"
        message="Thank you for your interest. Our team will contact you shortly to confirm your charter details."
      />
      {/* Aircraft Type Selector */}
      <div className="flex flex-col sm:flex-row mb-3 gap-2">
        {(['jet', 'helicopter'] as const).map(type => (
          <button
            key={type}
            type="button"
            onClick={() => setAircraftType(type)}
            className={`flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
              aircraftType === type
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-white/15 text-white/80 hover:bg-white/25 hover:text-white'
            } rounded-xl`}
          >
            <Plane className={`h-3.5 w-3.5 ${type === 'helicopter' ? 'rotate-45' : ''}`} />
            {type === 'jet' ? 'Private Jet' : 'Helicopter'}
          </button>
        ))}
      </div>

      {aircraftType === 'helicopter' ? (
        // Helicopter Form
        <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl border border-white/20">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-gray-900 text-lg font-light tracking-tight mb-1">Helicopter Charter</h3>
              <p className="text-gray-400 text-xs font-medium tracking-widest uppercase">Elite Aerial Mobility</p>
            </div>
            <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Priority Response
            </div>
          </div>

          <form onSubmit={handleHelicopterSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={helicopterForm.fullName}
                  onChange={e => setHelicopterForm({ ...helicopterForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-red-400 focus:outline-none text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={helicopterForm.email}
                  onChange={e => setHelicopterForm({ ...helicopterForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-red-400 focus:outline-none text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
              <PhoneInput
                value={helicopterForm.phone}
                onChange={value => setHelicopterForm({ ...helicopterForm, phone: value })}
                countryCode={helicopterForm.countryCode}
                onCountryCodeChange={code => setHelicopterForm({ ...helicopterForm, countryCode: code })}
                placeholder="Phone number"
                className="[&_button]:py-2 [&_input]:py-2 [&_button]:text-xs [&_input]:text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Message / Requirements</label>
              <textarea
                placeholder="Describe your helicopter requirements..."
                value={helicopterForm.message}
                onChange={e => setHelicopterForm({ ...helicopterForm, message: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:border-red-400 focus:outline-none text-gray-800 placeholder-gray-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {submitting ? 'Submitting...' : 'Send Inquiry'}
            </button>
          </form>
        </div>
      ) : (
        // Jet Search Form
        <div className="bg-white/95 backdrop-blur rounded-2xl p-4 sm:p-5 shadow-2xl">
          {/* Trip Type Selector */}
          <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
            {[
              { key: 'one_way', label: 'One Way' },
              { key: 'round_trip', label: 'Round Trip' },
              { key: 'multi_trip', label: 'Multi City' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTripType(key as any);
                  if (key === 'one_way') setLegs([legs[0]]);
                  else if (key === 'round_trip' && legs.length === 1 && legs[0].origin && legs[0].destination) {
                    setLegs([legs[0], { origin: legs[0].destination, destination: legs[0].origin, departureDate: '', departureTime: '', paxCount: legs[0].paxCount }]);
                  }
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${
                  tripType === key
                    ? 'bg-white text-red-600 shadow-sm font-bold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {legs.map((leg, index) => (
              <div key={index}>
                {/* Leg label for multi-trip */}
                {(tripType === 'multi_trip' && index > 0) && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Leg {index + 1}</span>
                    <button type="button" onClick={() => removeLeg(index)} className="p-1 text-red-500 hover:bg-red-50 rounded transition">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                {tripType === 'round_trip' && index === 1 && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Return Flight</span>
                  </div>
                )}

                {/* Route Row */}
                <div className="grid grid-cols-12 gap-2">
                  {/* From */}
                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                    <CityDropdown
                      value={leg.origin}
                      onChange={city => handleLegChange(index, 'origin', city)}
                      cities={originCities}
                      placeholder="Departure city"
                      icon={<MapPin className="h-3.5 w-3.5" />}
                    />
                  </div>

                  {/* To */}
                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                    <CityDropdown
                      value={leg.destination}
                      onChange={city => handleLegChange(index, 'destination', city)}
                      cities={index === 0 ? originCities : originCities}
                      placeholder="Arrival city"
                      disabled={index === 0 ? !leg.origin : (tripType === 'round_trip' && index === 1)}
                      icon={<MapPin className="h-3.5 w-3.5" />}
                    />
                  </div>

                  {/* Date */}
                  <div className="col-span-12 sm:col-span-4 md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input
                        type="date"
                        value={leg.departureDate}
                        onChange={e => handleLegChange(index, 'departureDate', e.target.value)}
                        min={index > 0 ? legs[index - 1]?.departureDate || today : today}
                        className="w-full pl-10 pr-2 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none text-gray-800 bg-white cursor-pointer"
                        required
                      />
                    </div>
                  </div>

                  {/* Time + Pax */}
                  <div className="col-span-6 sm:col-span-4 md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <input
                        type="time"
                        value={leg.departureTime}
                        onChange={e => handleLegChange(index, 'departureTime', e.target.value)}
                        className="w-full pl-10 pr-2 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none text-gray-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-4 md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Pax</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                      <select
                        value={leg.paxCount}
                        onChange={e => handleLegChange(index, 'paxCount', parseInt(e.target.value))}
                        className="w-full pl-10 pr-6 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-red-400 focus:outline-none text-gray-800 bg-white appearance-none cursor-pointer"
                      >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Leg Button */}
            {tripType === 'multi_trip' && legs.length < 10 && (
              <button
                type="button"
                onClick={addLeg}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-600 rounded-xl transition text-xs font-medium"
              >
                <Plus className="h-4 w-4" />
                Add Another Leg
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold tracking-widest uppercase text-sm rounded-xl transition-all duration-200 shadow-lg shadow-red-600/30"
            >
              <Search className="h-4 w-4" />
              Search Available Jets
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
