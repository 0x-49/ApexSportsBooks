import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sportsbook } from '../types/sportsbook';
import { countryToCode } from '../utils/countryMapping';
import { getAllCountries, getCountrySpecificTraffic, formatTraffic } from '../utils/sportsBookAnalytics';

interface SearchBarProps {
  sportsbooks: Sportsbook[];
  onCountrySelect?: (country: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ sportsbooks, onCountrySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const countries = getAllCountries(sportsbooks);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSportsbooks = sportsbooks.filter(sportsbook =>
    sportsbook.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCountrySelect = (country: string) => {
    if (onCountrySelect) {
      onCountrySelect(country);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search countries or sportsbooks..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setIsOpen(false);
            }}
            className="absolute right-3 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && searchTerm && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {/* Countries Section */}
          {filteredCountries.length > 0 && (
            <div className="p-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                Countries
              </h3>
              {filteredCountries.map((country) => (
                <div
                  key={country}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleCountrySelect(country)}
                >
                  <img
                    src={`https://flagcdn.com/24x18/${countryToCode[country]?.toLowerCase()}.png`}
                    alt={country}
                    className="w-5 h-4 mr-2"
                  />
                  <span>{country}</span>
                </div>
              ))}
            </div>
          )}

          {/* Sportsbooks Section */}
          {filteredSportsbooks.length > 0 && (
            <div className="p-2 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                Sportsbooks
              </h3>
              {filteredSportsbooks.map((sportsbook) => (
                <Link
                  key={sportsbook.Name}
                  to={`/sportsbook/${encodeURIComponent(sportsbook.Name.toLowerCase())}`}
                  className="flex items-center px-3 py-2 hover:bg-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src={sportsbook.LogoIcon}
                    alt={sportsbook.Name}
                    className="w-6 h-6 mr-2 object-contain"
                  />
                  <div>
                    <div className="font-medium">{sportsbook.Name}</div>
                    <div className="text-sm text-gray-500">
                      {formatTraffic(Object.values(sportsbook.estimatedMonthlyVisits || {})[0] || 0)} monthly visits
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredCountries.length === 0 && filteredSportsbooks.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
