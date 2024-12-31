import React from 'react';
import { useParams } from 'react-router-dom';
import { Sportsbook } from '../types/sportsbook';
import SportsbookCard from './SportsbookCard';
import SEO from './SEO';
import { generateCountryMetadata } from '../utils/seo';

interface CountrySportsbooksProps {
  sportsbooks: Sportsbook[];
}

const CountrySportsbooks: React.FC<CountrySportsbooksProps> = ({ sportsbooks }) => {
  const { country } = useParams<{ country: string }>();
  // Convert URL format (e.g., "bolivia") to proper case ("Bolivia")
  const formattedCountry = country 
    ? country
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : '';

  // Filter sportsbooks case-insensitively
  const filteredSportsbooks = sportsbooks.filter(sportsbook => 
    sportsbook.topCountries.some(tc => 
      tc.countryName.toLowerCase() === formattedCountry.toLowerCase()
    )
  );

  // Add error handling for no results
  if (filteredSportsbooks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">No Sportsbooks Found</h1>
        <p>No sportsbooks were found for {formattedCountry}.</p>
      </div>
    );
  }

  const baseUrl = window.location.origin;
  const metadata = generateCountryMetadata(formattedCountry, filteredSportsbooks.length, baseUrl);
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top Sportsbooks in ${formattedCountry}`,
    description: metadata.description,
    numberOfItems: filteredSportsbooks.length,
    itemListElement: filteredSportsbooks.map((sportsbook, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SportsActivityLocation',
        name: sportsbook.Name,
        description: sportsbook.Description,
        url: sportsbook.URL
      }
    }))
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO metadata={metadata} structuredData={structuredData} />
      
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Top Sportsbooks in {formattedCountry}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSportsbooks.map((sportsbook) => (
          <SportsbookCard
            key={sportsbook.Name}
            name={sportsbook.Name}
            description={sportsbook.Description}
            logo={sportsbook.LogoIcon}
            url={sportsbook.URL}
            rating={4.5}
            estimatedMonthlyVisits={sportsbook.estimatedMonthlyVisits}
            topCountries={sportsbook.topCountries}
            showCountryTraffic={true}
            country={formattedCountry}
          />
        ))}
      </div>
      
      {filteredSportsbooks.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No sportsbooks found for {formattedCountry}
        </p>
      )}
    </div>
  );
};

export default CountrySportsbooks;
