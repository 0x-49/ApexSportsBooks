import React, { useState, useMemo } from 'react';
import { Sportsbook } from '../types/sportsbook';
import SportsbookCard from './SportsbookCard';

interface AllSportsbooksProps {
  sportsbooks: Sportsbook[];
}

const AllSportsbooks: React.FC<AllSportsbooksProps> = ({ sportsbooks }) => {
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'traffic' | 'name'>('name');

  // Get unique countries from all sportsbooks
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    sportsbooks.forEach(sportsbook => {
      sportsbook.topCountries?.forEach(country => {
        countries.add(country.countryName);
      });
    });
    return Array.from(countries).sort();
  }, [sportsbooks]);

  // Get latest monthly visits for a sportsbook
  const getLatestMonthlyVisits = (sportsbook: Sportsbook) => {
    if (!sportsbook.estimatedMonthlyVisits) return 0;
    const dates = Object.keys(sportsbook.estimatedMonthlyVisits).sort().reverse();
    return dates.length > 0 ? sportsbook.estimatedMonthlyVisits[dates[0]] : 0;
  };

  // Filter and sort sportsbooks
  const filteredSportsbooks = useMemo(() => {
    let filtered = [...sportsbooks];

    // Filter by selected countries
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(sportsbook =>
        sportsbook.topCountries?.some(country =>
          selectedCountries.includes(country.countryName)
        )
      );
    }

    // Sort by selected criteria
    filtered.sort((a, b) => {
      if (sortBy === 'traffic') {
        return getLatestMonthlyVisits(b) - getLatestMonthlyVisits(a);
      }
      return a.Name.localeCompare(b.Name);
    });

    return filtered;
  }, [sportsbooks, selectedCountries, sortBy]);

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">All Sportsbooks</h2>
          
          {/* Filters and Sort Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Countries
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCountries.map(country => (
                  <button
                    key={country}
                    onClick={() => handleCountryToggle(country)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedCountries.includes(country)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'traffic' | 'name')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="traffic">Monthly Traffic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sportsbooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSportsbooks.slice(0, visibleCount).map((sportsbook, index) => (
            <SportsbookCard
              key={index}
              name={sportsbook.Name}
              description={sportsbook.Description}
              logo={sportsbook.LogoIcon}
              rating={4.5}
              url={sportsbook.URL}
              descriptionsURL={sportsbook.descriptionsURL}
              estimatedMonthlyVisits={sportsbook.estimatedMonthlyVisits}
              topCountries={sportsbook.topCountries}
            />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredSportsbooks.length && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Load More Sportsbooks
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllSportsbooks;
