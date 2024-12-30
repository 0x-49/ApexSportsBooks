import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getCountrySpecificTraffic, formatTraffic } from '../utils/sportsBookAnalytics';
import { countryToCode } from '../utils/countryMapping';
import { generateSportsbookMetadata, generateStructuredData } from '../utils/seo';
import SEO from './SEO';
import type { Sportsbook } from '../types/sportsbook';

interface SportsbookPageProps {
  sportsbooks: Sportsbook[];
}

const SportsbookPage: React.FC<SportsbookPageProps> = ({ sportsbooks }) => {
  const { name } = useParams<{ name: string }>();
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('Global');

  if (!name) return null;

  const decodedName = decodeURIComponent(name);
  const sportsbook = sportsbooks.find(
    (s) => s.Name.toLowerCase() === decodedName.toLowerCase()
  );

  if (!sportsbook) {
    return <Navigate to="/" replace />;
  }

  const countrySpecificData = getCountrySpecificTraffic(sportsbooks, selectedCountry);
  const sportsbookData = countrySpecificData.find(
    (item) => item.sportsbook.Name === sportsbook.Name
  );

  // Get the latest traffic value
  const latestTraffic = typeof sportsbook.estimatedMonthlyVisits === 'object' 
    ? Object.values(sportsbook.estimatedMonthlyVisits)[0] || 0
    : sportsbook.estimatedMonthlyVisits || 0;

  // Generate SEO metadata
  const metadata = generateSportsbookMetadata(
    sportsbook.Name,
    sportsbookData?.countryTraffic || latestTraffic,
    Array.isArray(sportsbook.topCountries) 
      ? sportsbook.topCountries.map(country => typeof country === 'string' ? country : country.countryName)
      : []
  );

  const structuredData = generateStructuredData('Sportsbook', {
    name: sportsbook.Name,
    description: sportsbook.Description,
    url: sportsbook.URL,
    rating: 4.5,
    monthlyVisits: sportsbookData?.countryTraffic || latestTraffic
  });

  // Redirect to SEO-friendly URL if needed
  const seoUrl = `/review/${decodedName.toLowerCase().replace(/\s+/g, '-')}`;
  if (window.location.pathname.startsWith('/sportsbook/')) {
    return <Navigate to={seoUrl} replace />;
  }

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      try {
        if (sportsbook.descriptionsURL) {
          const response = await fetch(sportsbook.descriptionsURL);
          const content = await response.text();
          setMarkdownContent(content);
        }
      } catch (error) {
        console.error('Error fetching markdown content:', error);
        setMarkdownContent('# Review Coming Soon\nWe are currently working on a detailed review of this sportsbook.');
      }
    };

    fetchMarkdownContent();
  }, [sportsbook.descriptionsURL]);

  // Convert topCountries to array of strings if it's not already
  const countryList = Array.isArray(sportsbook.topCountries)
    ? sportsbook.topCountries.map(country => 
        typeof country === 'string' ? country : country.countryName
      )
    : [];

  return (
    <>
      <SEO metadata={metadata} structuredData={structuredData} />
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <img
                  src={sportsbook.LogoIcon}
                  alt={`${sportsbook.Name} logo`}
                  className="w-16 h-16 object-contain mr-4"
                />
                <h1 className="text-4xl font-bold">{sportsbook.Name} Review</h1>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Monthly Traffic</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatTraffic(sportsbookData?.countryTraffic || latestTraffic)}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Rating</div>
                <div className="text-xl font-semibold">4.5/5.0</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Top Markets</div>
                <div className="text-xl font-semibold">
                  {countryList.slice(0, 3).join(', ')}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Founded</div>
                <div className="text-xl font-semibold">2008</div>
              </div>
            </div>

            {/* Country Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Country:
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="Global">Global</option>
                {countryList.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg">{sportsbook.Description}</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <article className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default SportsbookPage;
