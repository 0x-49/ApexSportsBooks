import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import SportsbookCard from './SportsbookCard';
import SEO from './SEO';
import { generateSportsbookMetadata, generateStructuredData } from '../utils/seo';
import type { Sportsbook } from '../types/sportsbook';

interface CountrySportsbooksProps {
  sportsbooks: Sportsbook[];
}

const CountrySportsbooks: React.FC<CountrySportsbooksProps> = ({ sportsbooks }) => {
  const { country } = useParams<{ country: string }>();
  
  if (!country) return null;

  // Convert URL format back to proper country name
  const properCountryName = country
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('In ', '');

  // Filter sportsbooks by country
  const countrySportsbooks = sportsbooks.filter(sportsbook =>
    sportsbook.topCountries.some(tc => {
      const countryName = typeof tc === 'string' ? tc : tc.countryName;
      return countryName.toLowerCase() === properCountryName.toLowerCase();
    })
  );

  // Sort by traffic in the country
  const sortedSportsbooks = [...countrySportsbooks].sort((a, b) => {
    const getTraffic = (sb: Sportsbook) => {
      const countryData = sb.topCountries.find(tc => {
        const countryName = typeof tc === 'string' ? tc : tc.countryName;
        return countryName.toLowerCase() === properCountryName.toLowerCase();
      });
      
      if (typeof countryData === 'object' && 'visitsShare' in countryData) {
        return countryData.visitsShare;
      }
      return 0;
    };

    return getTraffic(b) - getTraffic(a);
  });

  // Generate SEO metadata
  const metadata = {
    title: `Top Sportsbooks in ${properCountryName} - Best Betting Sites`,
    description: `Find the best sports betting sites in ${properCountryName}. Compare sportsbooks, read reviews, and get the latest information on betting options and bonuses.`,
    canonicalUrl: `/top-sportsbooks-in-${country}`,
    ogType: 'website',
  };

  // Generate structured data
  const structuredData = generateStructuredData('ItemList', {
    name: `Top Sportsbooks in ${properCountryName}`,
    description: `Best sports betting sites in ${properCountryName}`,
    itemListElement: sortedSportsbooks.map((sportsbook, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: sportsbook.Name,
        description: sportsbook.Description,
        url: sportsbook.URL
      }
    }))
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO metadata={metadata} structuredData={structuredData} />
      
      <h1 className="text-3xl font-bold mb-8">
        Top Sportsbooks in {properCountryName}
      </h1>
      
      {sortedSportsbooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSportsbooks.map((sportsbook) => (
            <SportsbookCard
              key={sportsbook.Name}
              sportsbook={sportsbook}
              showCountryTraffic={true}
              country={properCountryName}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-600">
            No sportsbooks found for {properCountryName}
          </h2>
          <p className="mt-4 text-gray-500">
            Try selecting a different country or view our complete list of sportsbooks.
          </p>
        </div>
      )}
    </div>
  );
};

export default CountrySportsbooks;
