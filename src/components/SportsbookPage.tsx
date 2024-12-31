import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from './SEO';
import { generateSportsbookMetadata } from '../utils/seo';
import type { Sportsbook } from '../types/sportsbook';
import CountryTrafficStats from './CountryTrafficStats';
import SportsbookDescription from './SportsbookDescription';
import TopMarketsChart from './TopMarketsChart';
import MarkdownContent from './MarkdownContent';

interface SportsbookPageProps {
  sportsbooks: Sportsbook[];
}

const SportsbookPage: React.FC<SportsbookPageProps> = ({ sportsbooks }) => {
  const { name: sportsbookParam } = useParams<{ name: string }>();
  
  // Convert URL format to proper case
  const formattedName = sportsbookParam
    ? sportsbookParam
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : '';

  // Find sportsbook case-insensitively
  const sportsbook = sportsbooks.find(
    s => s.Name.toLowerCase() === formattedName.toLowerCase()
  );

  if (!sportsbook) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Sportsbook Not Found</h1>
        <p>The sportsbook "{formattedName}" could not be found.</p>
      </div>
    );
  }

  const baseUrl = window.location.origin;
  const topCountryNames = sportsbook.topCountries.map(c => c.countryName);
  const monthlyVisits = Object.values(sportsbook.estimatedMonthlyVisits)[0] || 0;

  const metadata = generateSportsbookMetadata(
    sportsbook.Name,
    monthlyVisits,
    topCountryNames,
    baseUrl
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: sportsbook.Name,
    description: sportsbook.Description,
    url: sportsbook.URL,
    logo: sportsbook.LogoIcon,
    foundingDate: sportsbook.founded || undefined,
  };

  // Construct the article URL
  const articleUrl = sportsbook.UniqueID 
    ? `https://apex-sportsbooks-content.s3.us-east-1.amazonaws.com/articles/ApexSportsBooksDescription_${sportsbook.UniqueID}.md`
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SEO metadata={metadata} structuredData={structuredData} />

      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <img
              src={sportsbook.LogoIcon}
              alt={`${sportsbook.Name} logo`}
              className="w-16 h-16 object-contain mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold">{sportsbook.Name}</h1>
              <div className="mt-2">
                <SportsbookDescription description={sportsbook.Description} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">Monthly Traffic</div>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(monthlyVisits)}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <a
                href={sportsbook.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Visit Site
              </a>
            </div>
          </div>
        </div>

        {/* Markets Distribution */}
        <TopMarketsChart 
          topCountries={sportsbook.topCountries}
          totalTraffic={monthlyVisits}
        />

        {/* Detailed Article Content */}
        {articleUrl && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Detailed Review</h2>
            <MarkdownContent url={articleUrl} />
          </div>
        )}

        {/* Detailed Traffic Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Traffic Statistics by Country</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sportsbook.topCountries
              .sort((a, b) => b.visitsShare - a.visitsShare)
              .map((country, index) => (
                <CountryTrafficStats
                  key={country.countryName}
                  country={country}
                  rank={index + 1}
                  trafficHistory={sportsbook.estimatedMonthlyVisits}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsbookPage;
