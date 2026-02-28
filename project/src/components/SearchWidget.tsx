import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Calendar, Users, Clock, MapPin, Search, Plus, X } from 'lucide-react';
import PhoneInput from './PhoneInput';
import { getOriginCities, getDestinationCities, createHelicopterInquiry } from '../lib/api';

interface Leg {
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  paxCount: number;
}

export default function SearchWidget() {
  const navigate = useNavigate();
  const [originCities, setOriginCities] = useState<string[]>([]);
  const [destinationCities, setDestinationCities] = useState<string[]>([]);
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
    countryCode: '+91',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchOriginCities();
  }, []);

  useEffect(() => {
    if (legs[0]?.origin) {
      fetchDestinationCities(legs[0].origin);
    } else {
      setDestinationCities([]);
    }
  }, [legs[0]?.origin]);

  // Auto-populate return leg when switching to round trip
  useEffect(() => {
    if (tripType === 'round_trip' && legs.length === 1 && legs[0].origin && legs[0].destination) {
      // Add return leg if not already present
      if (!legs[1] || !legs[1].departureDate) {
        setLegs([legs[0], {
          origin: legs[0].destination,
          destination: legs[0].origin,
          departureDate: '',
          departureTime: '',
          paxCount: legs[0].paxCount,
        }]);
      }
    } else if (tripType === 'one_way' && legs.length > 1) {
      // Remove extra legs when switching to one-way
      setLegs([legs[0]]);
    }
  }, [tripType]);

  const fetchOriginCities = async () => {
    try {
      const response = await getOriginCities();
      setOriginCities(response.cities || []);
    } catch (error) {
      console.error('Error fetching origin cities:', error);
    }
  };

  const fetchDestinationCities = async (origin: string) => {
    try {
      const response = await getDestinationCities(origin);
      setDestinationCities(response.cities || []);
    } catch (error) {
      console.error('Error fetching destination cities:', error);
    }
  };

  const handleLegChange = (index: number, field: keyof Leg, value: string | number) => {
    const newLegs = [...legs];
    newLegs[index] = { ...newLegs[index], [field]: value };
    if (field === 'origin') {
      newLegs[index].destination = ''; // Clear destination when origin changes
    }
    // For round trip, update return leg origin when outbound destination changes
    if (tripType === 'round_trip' && index === 0 && field === 'destination' && newLegs[1]) {
      newLegs[1].origin = value as string;
    }
    // For round trip, update outbound destination when return leg origin changes
    if (tripType === 'round_trip' && index === 1 && field === 'origin' && newLegs[0]) {
      newLegs[0].destination = value as string;
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
    
    if (aircraftType === 'helicopter') {
      return; // Helicopter form will handle submission
    }

    // Validate first leg
    if (!legs[0].origin || !legs[0].destination || !legs[0].departureDate || !legs[0].departureTime) {
      alert('Please fill in all required fields for the first leg.');
      return;
    }

    // Validate round trip return leg
    if (tripType === 'round_trip' && legs.length > 1) {
      if (!legs[1].departureDate || !legs[1].departureTime) {
        alert('Please fill in return trip date and time.');
        return;
      }
    }

    // Validate multi-trip legs
    if (tripType === 'multi_trip') {
      for (let i = 0; i < legs.length; i++) {
        if (!legs[i].origin || !legs[i].destination || !legs[i].departureDate || !legs[i].departureTime) {
          alert(`Please fill in all required fields for leg ${i + 1}.`);
          return;
        }
        // Validate dates are sequential
        if (i > 0) {
          const prevDate = new Date(legs[i - 1].departureDate);
          const currDate = new Date(legs[i].departureDate);
          if (currDate < prevDate) {
            alert(`Leg ${i + 1} date must be after leg ${i} date.`);
            return;
          }
        }
      }
    }

    // Convert trip type format
    const tripTypeFormatted = tripType === 'one_way' ? 'one-way' :
                              tripType === 'round_trip' ? 'round-trip' :
                              'multi-trip';
    
    // Prepare legs for search
    const searchLegs = [];
    
    if (tripTypeFormatted === 'round-trip') {
      searchLegs.push({
        origin: legs[0].origin,
        destination: legs[0].destination,
        departureDate: legs[0].departureDate,
        departureTime: legs[0].departureTime,
        paxCount: legs[0].paxCount,
      });
      // Add return leg
      if (legs.length > 1 && legs[1].departureDate) {
        searchLegs.push({
          origin: legs[0].destination,
          destination: legs[0].origin,
          departureDate: legs[1].departureDate,
          departureTime: legs[1].departureTime,
          paxCount: legs[0].paxCount,
        });
      }
    } else {
      searchLegs.push(...legs.map(leg => ({
        origin: leg.origin,
        destination: leg.destination,
        departureDate: leg.departureDate,
        departureTime: leg.departureTime,
        paxCount: leg.paxCount,
      })));
    }
    
    navigate('/search-results', {
      state: {
        tripType: tripTypeFormatted,
        legs: searchLegs,
        filters: {
          aircraftClass: aircraftType === 'helicopter' ? 'Helicopter' : undefined,
          minCapacity: legs[0].paxCount,
        },
      },
    });
  };

  const handleHelicopterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      await createHelicopterInquiry({
        ...helicopterForm,
        phone: `${helicopterForm.countryCode} ${helicopterForm.phone}`,
      });
      setSubmitSuccess(true);
      setHelicopterForm({
        fullName: '',
        email: '',
        phone: '',
        countryCode: '+91',
        message: '',
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      alert(error.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-lg shadow-2xl p-3 sm:p-4 w-full mx-auto border border-white/30" style={{
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)'
    }}>
      {/* Aircraft Type Selection - Always Visible at Top */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setAircraftType('jet')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-luxury tracking-wide transition ${
            aircraftType === 'jet'
              ? 'bg-luxury-red text-white shadow-lg'
              : 'bg-white/30 text-white hover:bg-white/40 border border-white/30'
          }`}
        >
          <Plane className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span>JET</span>
        </button>
        <button
          type="button"
          onClick={() => setAircraftType('helicopter')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-luxury tracking-wide transition ${
            aircraftType === 'helicopter'
              ? 'bg-luxury-red text-white shadow-lg'
              : 'bg-white/30 text-white hover:bg-white/40 border border-white/30'
          }`}
        >
          <Plane className="h-3.5 w-3.5 sm:h-4 sm:w-4 rotate-45" />
          <span>HELICOPTER</span>
        </button>
      </div>

      {aircraftType === 'helicopter' ? (
        /* Helicopter Inquiry Form */
        <div>
          <div className="mb-3">
            <h3 className="text-white text-xs sm:text-sm font-luxury font-light mb-1 tracking-luxury">
              Helicopter Service Available Around the Clock
            </h3>
            <p className="text-white/90 text-[10px] sm:text-xs font-luxury tracking-wide">
              Skyriting helicopters have a proven track record of over 10,000 flying hours.
            </p>
          </div>

          {submitSuccess && (
            <div className="mb-3 p-2 bg-green-500/20 border border-green-500/50 rounded text-white text-[10px] sm:text-xs font-luxury tracking-wide">
              Inquiry submitted successfully!
            </div>
          )}

          <form onSubmit={handleHelicopterSubmit} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={helicopterForm.fullName}
                onChange={(e) => setHelicopterForm({ ...helicopterForm, fullName: e.target.value })}
                className="w-full px-2 py-1.5 border border-white/40 rounded focus:border-luxury-red focus:outline-none text-[10px] sm:text-xs font-luxury tracking-wide bg-white/30 backdrop-blur-sm placeholder:text-white/60 text-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={helicopterForm.email}
                onChange={(e) => setHelicopterForm({ ...helicopterForm, email: e.target.value })}
                className="w-full px-2 py-1.5 border border-white/40 rounded focus:border-luxury-red focus:outline-none text-[10px] sm:text-xs font-luxury tracking-wide bg-white/30 backdrop-blur-sm placeholder:text-white/60 text-white"
                required
              />
            </div>
            <div>
              <PhoneInput
                value={helicopterForm.phone}
                onChange={(value) => setHelicopterForm({ ...helicopterForm, phone: value })}
                countryCode={helicopterForm.countryCode}
                onCountryCodeChange={(code) => setHelicopterForm({ ...helicopterForm, countryCode: code })}
                placeholder="Phone"
                className="[&_button]:bg-white/30 [&_button]:border-white/40 [&_button]:text-white [&_button]:backdrop-blur-sm [&_button]:hover:bg-white/40 [&_input]:bg-white/30 [&_input]:border-white/40 [&_input]:text-white [&_input]:backdrop-blur-sm [&_input]:placeholder:text-white/60 [&_input]:text-[10px] sm:[&_input]:text-xs [&_button]:text-[10px] sm:[&_button]:text-xs [&_button]:py-1.5 [&_input]:py-1.5 [&_div]:max-h-48 [&_button]:text-xs"
              />
            </div>
            <textarea
              placeholder="Message"
              value={helicopterForm.message}
              onChange={(e) => setHelicopterForm({ ...helicopterForm, message: e.target.value })}
              rows={2}
              className="w-full px-2 py-1.5 border border-white/40 rounded focus:border-luxury-red focus:outline-none text-[10px] sm:text-xs font-luxury tracking-wide bg-white/30 backdrop-blur-sm placeholder:text-white/60 text-white resize-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-luxury-red text-white py-1.5 rounded hover:bg-luxury-red/90 transition font-luxury tracking-widest text-[10px] sm:text-xs uppercase flex items-center justify-center space-x-1 disabled:opacity-50"
            >
              <span>{submitting ? 'Submitting...' : 'Submit'}</span>
            </button>
          </form>
        </div>
      ) : (
        /* Private Jet Search Form */
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Trip Type Selection - Always Visible */}
          <div className="flex gap-2 mb-3">
            {['one_way', 'round_trip', 'multi_trip'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setTripType(type as any);
                  if (type === 'one_way' && legs.length > 1) {
                    setLegs([legs[0]]);
                  } else if (type === 'round_trip' && legs.length === 1 && legs[0].origin && legs[0].destination) {
                    // Auto-populate return leg
                    setLegs([legs[0], {
                      origin: legs[0].destination,
                      destination: legs[0].origin,
                      departureDate: '',
                      departureTime: '',
                      paxCount: legs[0].paxCount,
                    }]);
                  }
                }}
                className={`px-3 sm:px-4 py-1.5 rounded text-xs sm:text-sm font-luxury tracking-wide transition ${
                  tripType === type
                    ? 'bg-luxury-red/30 text-white border-2 border-luxury-red/50'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                {type === 'one_way' ? 'One-way' : type === 'round_trip' ? 'Round trip' : 'Multi trip'}
              </button>
            ))}
          </div>

          {/* Form Fields - White Background */}
          <div className="bg-white/95 rounded-lg p-3 sm:p-4 space-y-3">
            {/* Legs */}
            <div className="space-y-3">
              {legs.map((leg, index) => (
                <div key={index}>
                  {tripType === 'multi_trip' && index > 0 && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-luxury tracking-wide text-luxury-black/70">Leg {index + 1}</span>
                      {legs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLeg(index)}
                          className="p-1 text-luxury-red hover:bg-luxury-red/10 rounded transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                  
                  {tripType === 'round_trip' && index === 1 && (
                    <div className="mb-2">
                      <span className="text-xs font-luxury tracking-wide text-luxury-black/70">Return Trip</span>
                    </div>
                  )}

                  <div className="grid grid-cols-12 gap-2 items-end">
                    {/* Departure */}
                    <div className="col-span-3 relative">
                      <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-luxury-black/40" />
                      <select
                        value={leg.origin}
                        onChange={(e) => handleLegChange(index, 'origin', e.target.value)}
                        className="w-full pl-8 pr-2 py-2 border border-luxury-black/20 rounded focus:border-luxury-red focus:outline-none text-xs font-luxury tracking-wide bg-white text-luxury-black appearance-none"
                        required
                      >
                        <option value="" className="text-luxury-black">Departure</option>
                        {originCities.map((city) => (
                          <option key={city} value={city} className="text-luxury-black">{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Arrival */}
                    <div className="col-span-3 relative">
                      <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-luxury-black/40" />
                      <select
                        value={leg.destination}
                        onChange={(e) => handleLegChange(index, 'destination', e.target.value)}
                        disabled={!leg.origin || (tripType === 'round_trip' && index === 1)}
                        className="w-full pl-8 pr-2 py-2 border border-luxury-black/20 rounded focus:border-luxury-red focus:outline-none text-xs font-luxury tracking-wide bg-white text-luxury-black appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      >
                        <option value="" className="text-luxury-black">Arrival</option>
                        {destinationCities.map((city) => (
                          <option key={city} value={city} className="text-luxury-black">{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Date & Time Combined */}
                    <div className="col-span-3 relative">
                      <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-luxury-black/40" />
                      <input
                        type="date"
                        value={leg.departureDate}
                        onChange={(e) => handleLegChange(index, 'departureDate', e.target.value)}
                        min={index > 0 ? legs[index - 1].departureDate : new Date().toISOString().split('T')[0]}
                        className="w-full pl-8 pr-2 py-2 border border-luxury-black/20 rounded focus:border-luxury-red focus:outline-none text-xs font-luxury tracking-wide bg-white text-luxury-black"
                        required
                      />
                    </div>

                    <div className="col-span-2 relative">
                      <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-luxury-black/40" />
                      <input
                        type="time"
                        value={leg.departureTime}
                        onChange={(e) => handleLegChange(index, 'departureTime', e.target.value)}
                        className="w-full pl-8 pr-2 py-2 border border-luxury-black/20 rounded focus:border-luxury-red focus:outline-none text-xs font-luxury tracking-wide bg-white text-luxury-black"
                        required
                      />
                    </div>

                    {/* Passengers */}
                    <div className="col-span-1 relative">
                      <Users className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-luxury-black/40" />
                      <select
                        value={leg.paxCount}
                        onChange={(e) => handleLegChange(index, 'paxCount', parseInt(e.target.value))}
                        className="w-full pl-8 pr-2 py-2 border border-luxury-black/20 rounded focus:border-luxury-red focus:outline-none text-xs font-luxury tracking-wide bg-white text-luxury-black appearance-none"
                        required
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                          <option key={num} value={num} className="text-luxury-black">{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Trip Button for Multi Trip */}
            {tripType === 'multi_trip' && legs.length < 10 && (
              <button
                type="button"
                onClick={addLeg}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-luxury-white-off text-luxury-black rounded border border-luxury-black/20 hover:bg-luxury-white-cream transition font-luxury tracking-wide text-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add Trip</span>
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-luxury-red text-white py-2.5 rounded hover:bg-luxury-red/90 transition font-luxury tracking-widest text-xs uppercase shadow-lg flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
