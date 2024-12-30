import React from 'react';
import { Link } from 'react-router-dom';
import type { SportsbookCardProps, TopCountry } from '../types/sportsbook';

interface SportsbookCardProps {
  name: string;
  description: string;
  logo: string;
  url: string;
  estimatedMonthlyVisits: {
    [key: string]: number;
  };
  topCountries: TopCountry[];
  showCountryTraffic: boolean;
  country: string;
}

const SportsbookCard: React.FC<SportsbookCardProps> = ({
  name,
  description,
  logo,
  url,
  estimatedMonthlyVisits,
  topCountries,
  showCountryTraffic,
  country
}) => {
  const getLatestTraffic = (): number => {
    if (!estimatedMonthlyVisits) return 0;
    return Object.values(estimatedMonthlyVisits)[0] || 0;
  };

  const getCountryTraffic = (countryName: string): number => {
    if (!estimatedMonthlyVisits || !countryName) return 0;
    return estimatedMonthlyVisits[countryName.toLowerCase()] || 0;
  };

  const formatTraffic = (traffic: number): string => {
    if (traffic >= 1000000) {
      return `${(traffic / 1000000).toFixed(1)}M`;
    }
    if (traffic >= 1000) {
      return `${(traffic / 1000).toFixed(1)}K`;
    }
    return traffic.toString();
  };

  const displayTraffic = showCountryTraffic && country
    ? getCountryTraffic(country)
    : getLatestTraffic();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-12 h-12 object-contain mr-4"
          />
          <h2 className="text-xl font-bold">{name}</h2>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Monthly Traffic</span>
            <span className="font-semibold text-blue-600">
              {formatTraffic(displayTraffic)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Top Markets</span>
            <div className="flex space-x-1">
              {topCountries.slice(0, 3).map((country, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  {country.countryName}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <Link
            to={`/review/${name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Read Review
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition-colors"
          >
            Visit Site
          </a>
        </div>
      </div>
    </div>
  );
};

export default SportsbookCard;
