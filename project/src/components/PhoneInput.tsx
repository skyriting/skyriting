import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  id?: string;
}

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+212', country: 'Morocco', flag: '🇲🇦' },
];

export default function PhoneInput({
  value,
  onChange,
  countryCode = '+91',
  onCountryCodeChange,
  placeholder = 'Phone number',
  required = false,
  className = '',
  id,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState(countryCode);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountry = countryCodes.find(c => c.code === selectedCode) || countryCodes[2]; // Default to India

  const handleCodeSelect = (code: string) => {
    setSelectedCode(code);
    if (onCountryCodeChange) {
      onCountryCodeChange(code);
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Country Code Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 px-3 py-3 border border-luxury-black/20 rounded-l-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide bg-white hover:bg-luxury-white-off transition"
          >
            <span className="text-base">{selectedCountry.flag}</span>
            <span className="text-sm text-luxury-black/70">{selectedCountry.code}</span>
            <ChevronDown className={`h-4 w-4 text-luxury-black/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-64 bg-white rounded-lg shadow-2xl border border-luxury-black/10 max-h-64 overflow-y-auto">
              <div className="p-2">
                {countryCodes.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCodeSelect(country.code)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-luxury-red hover:text-white transition text-left ${
                      selectedCode === country.code ? 'bg-luxury-red/10 text-luxury-red' : 'text-luxury-black'
                    }`}
                  >
                    <span className="text-base">{country.flag}</span>
                    <span className="text-sm font-luxury tracking-wide flex-1">{country.code}</span>
                    <span className="text-xs text-luxury-black/60 font-luxury">{country.country}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          id={id}
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="flex-1 px-4 py-3 border border-luxury-black/20 border-l-0 rounded-r-lg focus:border-luxury-red focus:outline-none font-luxury tracking-wide"
        />
      </div>
    </div>
  );
}
