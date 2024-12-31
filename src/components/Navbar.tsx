import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Sportsbook } from '../types/sportsbook';

interface NavbarProps {
  sportsbooks: Sportsbook[];
}

const Navbar: React.FC<NavbarProps> = ({ sportsbooks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Get unique countries from all sportsbooks
  const countries = Array.from(new Set(
    sportsbooks.flatMap(sb => 
      sb.topCountries.map(country => 
        typeof country === 'string' ? country : country.countryName
      )
    )
  )).sort();

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const country = event.target.value;
    if (country) {
      const seoUrl = `/top-sportsbooks-in-${country.toLowerCase().replace(/\s+/g, '-')}`;
      navigate(seoUrl);
    }
  };

  return (
    <nav className="bg-parchment-100 shadow-lg border-b border-brown-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-20">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center hover:opacity-90 transition-opacity">
              <img
                className="h-14 w-auto"
                src="https://apex-sportsbooks-content.s3.us-east-1.amazonaws.com/final_logo-removebg-preview.png"
                alt="ApexSportsbooks"
              />
              <span className="ml-3 text-2xl font-bold text-brown-800">
                ApexSportsbooks
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {/* Country Selector */}
            <div className="relative">
              <select
                onChange={handleCountryChange}
                className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue=""
              >
                <option value="" disabled>Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation Links */}
            <Link
              to="/growing"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Fastest Growing
            </Link>
            <Link
              to="/sportsbooks"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              All Sportsbooks
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {/* Country Selector for Mobile */}
          <div className="px-3 py-2">
            <select
              onChange={handleCountryChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              defaultValue=""
            >
              <option value="" disabled>Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/growing"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Fastest Growing
          </Link>
          <Link
            to="/sportsbooks"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            All Sportsbooks
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
