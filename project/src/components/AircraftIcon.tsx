import React from 'react';

interface AircraftIconProps {
  type: 'helicopter' | 'airliner' | 'large-jet' | 'super-midsize-jet' | 'midsize-jet' | 'light-jet' | 'turboprop';
  className?: string;
}

export default function AircraftIcon({ type, className = '' }: AircraftIconProps) {
  const baseClasses = `transition-all duration-500 ${className}`;
  
  const icons = {
    helicopter: (
      <svg
        viewBox="0 0 100 100"
        className={baseClasses}
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="heliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>
        {/* Main body */}
        <ellipse cx="50" cy="60" rx="25" ry="15" fill="url(#heliGrad)" />
        {/* Cockpit */}
        <ellipse cx="50" cy="55" rx="12" ry="8" fill="#1F2937" />
        {/* Main rotor */}
        <line x1="50" y1="40" x2="50" y2="20" stroke="#DC2626" strokeWidth="2" />
        <circle cx="50" cy="20" r="3" fill="#DC2626" />
        <line x1="30" y1="20" x2="70" y2="20" stroke="#DC2626" strokeWidth="1.5" opacity="0.7" />
        {/* Tail rotor */}
        <line x1="75" y1="60" x2="85" y2="60" stroke="#DC2626" strokeWidth="1.5" />
        <circle cx="85" cy="60" r="2" fill="#DC2626" />
        {/* Landing skids */}
        <line x1="35" y1="75" x2="40" y2="75" stroke="#1F2937" strokeWidth="2" />
        <line x1="60" y1="75" x2="65" y2="75" stroke="#1F2937" strokeWidth="2" />
      </svg>
    ),
    airliner: (
      <svg
        viewBox="0 0 100 100"
        className={baseClasses}
        style={{ animation: 'float 4s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="airlinerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>
        {/* Fuselage */}
        <ellipse cx="50" cy="50" rx="35" ry="12" fill="url(#airlinerGrad)" />
        {/* Cockpit */}
        <ellipse cx="20" cy="50" rx="8" ry="6" fill="#1F2937" />
        {/* Wings */}
        <ellipse cx="50" cy="50" rx="30" ry="8" fill="url(#airlinerGrad)" opacity="0.8" transform="rotate(90 50 50)" />
        {/* Tail */}
        <polygon points="85,50 75,40 75,60" fill="url(#airlinerGrad)" />
        {/* Windows */}
        <circle cx="35" cy="50" r="2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="45" cy="50" r="2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="55" cy="50" r="2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="65" cy="50" r="2" fill="#FFFFFF" opacity="0.8" />
      </svg>
    ),
    'large-jet': (
      <svg
        viewBox="0 0 100 100"
        className={baseClasses}
        style={{ animation: 'float 3.5s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="largeJetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>
        {/* Fuselage */}
        <ellipse cx="50" cy="50" rx="30" ry="10" fill="url(#largeJetGrad)" />
        {/* Nose */}
        <ellipse cx="20" cy="50" rx="6" ry="5" fill="#1F2937" />
        {/* Wings */}
        <ellipse cx="50" cy="50" rx="25" ry="6" fill="url(#largeJetGrad)" opacity="0.7" transform="rotate(90 50 50)" />
        {/* Tail */}
        <polygon points="80,50 72,42 72,58" fill="url(#largeJetGrad)" />
        {/* Engines */}
        <ellipse cx="40" cy="42" rx="4" ry="3" fill="#1F2937" />
        <ellipse cx="40" cy="58" rx="4" ry="3" fill="#1F2937" />
      </svg>
    ),
    'super-midsize-jet': (
      <svg
        viewBox="0 0 100 100"
        className={baseClasses}
        style={{ animation: 'float 3.8s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="superMidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>
        {/* Fuselage */}
        <ellipse cx="50" cy="50" rx="28" ry="9" fill="url(#superMidGrad)" />
        {/* Nose */}
        <ellipse cx="22" cy="50" rx="5" ry="4" fill="#1F2937" />
        {/* Wings */}
        <ellipse cx="50" cy="50" rx="22" ry="5" fill="url(#superMidGrad)" opacity="0.7" transform="rotate(90 50 50)" />
        {/* Tail */}
        <polygon points="78,50 71,43 71,57" fill="url(#superMidGrad)" />
      </svg>
    ),
    'midsize-jet': (
      <svg
        viewBox="0 0 100 100"
        className={baseClasses}
        style={{ animation: 'float 4.2s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="midJetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>
        {/* Fuselage */}
        <ellipse cx="50" cy="50" rx="25" ry="8" fill="url(#midJetGrad)" />
        {/* Nose */}
        <ellipse cx="25" cy="50" rx="4" ry="3.5" fill="#1F2937" />
        {/* Wings */}
        <ellipse cx="50" cy="50" rx="20" ry="4.5" fill="url(#midJetGrad)" opacity="0.7" transform="rotate(90 50 50)" />
        {/* Tail */}
        <polygon points="75,50 69,44 69,56" fill="url(#midJetGrad)" />
      </svg>
    ),
    'light-jet': (
      <svg
        viewBox="0 0 100 100"
        className={baseClasses}
        style={{ animation: 'float 4.5s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="lightJetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>
        {/* Fuselage */}
        <ellipse cx="50" cy="50" rx="22" ry="7" fill="url(#lightJetGrad)" />
        {/* Nose */}
        <ellipse cx="28" cy="50" rx="3.5" ry="3" fill="#1F2937" />
        {/* Wings */}
        <ellipse cx="50" cy="50" rx="18" ry="4" fill="url(#lightJetGrad)" opacity="0.7" transform="rotate(90 50 50)" />
        {/* Tail */}
        <polygon points="72,50 67,45 67,55" fill="url(#lightJetGrad)" />
      </svg>
    ),
    turboprop: (
      <svg
        viewBox="0 0 100 100"
        className={baseClasses}
        style={{ animation: 'float 4s ease-in-out infinite' }}
      >
        <defs>
          <linearGradient id="turbopropGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>
        {/* Fuselage */}
        <ellipse cx="50" cy="50" rx="20" ry="8" fill="url(#turbopropGrad)" />
        {/* Nose */}
        <ellipse cx="30" cy="50" rx="3" ry="2.5" fill="#1F2937" />
        {/* Propeller */}
        <circle cx="30" cy="50" r="8" fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.5" />
        <line x1="30" y1="42" x2="30" y2="58" stroke="#DC2626" strokeWidth="1.5" />
        <line x1="22" y1="50" x2="38" y2="50" stroke="#DC2626" strokeWidth="1.5" />
        {/* Wings */}
        <ellipse cx="50" cy="50" rx="16" ry="4" fill="url(#turbopropGrad)" opacity="0.7" transform="rotate(90 50 50)" />
        {/* Tail */}
        <polygon points="70,50 65,45 65,55" fill="url(#turbopropGrad)" />
      </svg>
    ),
  };

  return (
    <div className="aircraft-icon-wrapper">
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        .aircraft-icon-wrapper:hover svg {
          transform: translateY(-15px) scale(1.1) !important;
          filter: drop-shadow(0 10px 20px rgba(220, 38, 38, 0.3));
        }
      `}</style>
      {icons[type]}
    </div>
  );
}
