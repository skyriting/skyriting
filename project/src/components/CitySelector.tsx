import { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import { getCities } from '../lib/api';
import type { City } from '../lib/types';

interface CitySelectorProps {
  label: string;
  value: string;
  onChange: (city: string, cityData?: City) => void;
  placeholder?: string;
  required?: boolean;
}

export default function CitySelector({ label, value, onChange, placeholder, required }: CitySelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCities = async () => {
    try {
      const data = await getCities();
      // Transform backend data to match frontend expectations
      const transformedCities = data.map((city: any) => ({
        id: city._id || city.id,
        name: city.name || city.city_name,
        code: city.code || city.airport_code,
        airport_name: city.airport_name || city.name,
        state: city.state || city.state_name || '',
        popular: city.popular || false,
      }));
      setCities(transformedCities);
      setFilteredCities(transformedCities);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);

    if (term.trim() === '') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(term.toLowerCase()) ||
        city.code.toLowerCase().includes(term.toLowerCase()) ||
        city.state.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };

  const handleCitySelect = (city: City) => {
    setSearchTerm(city.name);
    onChange(city.name, city);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (searchTerm.trim() === '') {
      setFilteredCities(cities);
    }
  };

  const popularCities = filteredCities.filter(c => c.popular);
  const otherCities = filteredCities.filter(c => !c.popular);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-luxury font-medium text-white/90 mb-1.5">
        <MapPin className="inline h-3 w-3 mr-1" />
        {label}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder || 'Search city or airport...'}
          className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-white/40 rounded-lg focus:border-luxury-red focus:outline-none text-sm bg-white/30 backdrop-blur-sm placeholder:text-white/60 text-white"
          required={required}
          autoComplete="off"
        />
      </div>

      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-lg shadow-xl max-h-72 sm:max-h-80 overflow-y-auto touch-scroll scrollbar-hidden sm:scrollbar-auto">
          {popularCities.length > 0 && (
            <div>
              <div className="px-3 py-2 bg-white/30 backdrop-blur-sm border-b border-white/30 sticky top-0 z-10">
                <p className="text-xs font-semibold text-white uppercase tracking-wide font-luxury">
                  Popular Cities
                </p>
              </div>
              {popularCities.map(city => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-white/40 active:bg-white/50 transition border-b border-white/20 last:border-b-0 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm sm:text-base font-luxury">{city.name}</p>
                      <p className="text-xs sm:text-sm text-white/80 truncate font-luxury">{city.airport_name}</p>
                    </div>
                    <span className="text-xs font-mono bg-luxury-red/30 text-white px-2 py-1 rounded flex-shrink-0 backdrop-blur-sm border border-white/20">
                      {city.code}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {otherCities.length > 0 && (
            <div>
              {popularCities.length > 0 && (
                <div className="px-3 py-2 bg-white/30 backdrop-blur-sm border-b border-white/30 sticky top-0 z-10">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Other Cities
                  </p>
                </div>
              )}
              {otherCities.map(city => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-white/40 active:bg-white/50 transition border-b border-white/20 last:border-b-0 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm sm:text-base font-luxury">{city.name}</p>
                      <p className="text-xs sm:text-sm text-white/80 truncate font-luxury">{city.state}</p>
                    </div>
                    <span className="text-xs font-mono bg-white/20 text-white px-2 py-1 rounded flex-shrink-0 backdrop-blur-sm border border-white/20">
                      {city.code}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && filteredCities.length === 0 && searchTerm.trim() !== '' && (
        <div className="absolute z-50 w-full mt-2 bg-white/20 backdrop-blur-xl border border-white/40 rounded-lg shadow-2xl p-4 text-center" style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)'
        }}>
          <p className="text-white/90 font-luxury">No cities found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
