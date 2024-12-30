import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from '@heroicons/react/solid';

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface CountryFilterProps {
  countries: Country[];
  selectedCountries: string[];
  onCountrySelect: (country: string) => void;
}

export const CountryFilter: React.FC<CountryFilterProps> = ({
  countries,
  selectedCountries,
  onCountrySelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);

  useEffect(() => {
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  return (
    <div className="relative bg-white rounded-lg shadow-md">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium text-gray-900">Filter by Country</h3>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredCountries.map((country) => (
              <div
                key={country.code}
                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
                  selectedCountries.includes(country.code) ? 'bg-blue-50' : ''
                }`}
                onClick={() => onCountrySelect(country.code)}
              >
                <img
                  src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                  alt={`${country.name} flag`}
                  className="w-5 h-4 mr-3"
                />
                <span className="flex-grow">{country.name}</span>
                {selectedCountries.includes(country.code) && (
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryFilter;
