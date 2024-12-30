import React from 'react';
import * as flags from 'country-flag-icons/react/3x2';
import 'flag-icons/css/flag-icons.min.css';

interface CountryFlagProps {
  countryCode: string;
  className?: string;
  squared?: boolean;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode, className = '', squared = false }) => {
  // Normalize country code to uppercase
  const code = countryCode.toUpperCase();
  
  // Try to get the flag component from country-flag-icons
  const FlagComponent = (flags as any)[code];

  if (FlagComponent) {
    return (
      <div className={`w-8 h-6 ${className}`}>
        <FlagComponent />
      </div>
    );
  }

  // Fallback to flag-icons
  return (
    <span 
      className={`fi fi-${code.toLowerCase()} ${squared ? 'fis' : ''} ${className}`}
      style={{ fontSize: '24px' }}
    />
  );
};

export default CountryFlag;
