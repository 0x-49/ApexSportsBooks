import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import TopMarketsChart from 'components/TopMarketsChart';
import TrafficGraphModal from 'components/TrafficGraphModal';
import MarkdownContent from 'components/MarkdownContent';
import { Sportsbook } from 'types/sportsbook';
import { getSportsbookData } from 'lib/sportsbooks';

const Page: React.FC = () => {
  const { sportsbook: sportsbookId } = useParams<{ sportsbook?: string }>();
  const [sportsbook, setSportsbook] = useState<Sportsbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrafficModal, setShowTrafficModal] = useState(false);

  useEffect(() => {
    const fetchSportsbook = async () => {
      try {
        if (!sportsbookId) {
          throw new Error('Sportsbook ID is required');
        }
        const data = await getSportsbookData(sportsbookId);
        setSportsbook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSportsbook();
  }, [sportsbookId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !sportsbook) {
    return <div>Error: {error || 'Sportsbook not found'}</div>;
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>{sportsbook.Name} - Detailed Review and Analysis</title>
        <meta
          name="description"
          content={`Comprehensive review of ${sportsbook.Name}. ${sportsbook.Description?.substring(0, 150)}...`}
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={sportsbook.LogoIcon}
                alt={`${sportsbook.Name} logo`}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{sportsbook.Name}</h1>
                <a
                  href={sportsbook.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Visit Website
                </a>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Founded</h3>
                <p className="mt-1 text-lg font-semibold">{sportsbook.founded || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-4">About {sportsbook.Name}</h2>
            <div className="prose max-w-none">
              {sportsbook.Description}
            </div>
          </div>

          {/* Traffic Stats Section */}
          <div className="p-6 sm:p-8 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6">Traffic Statistics</h2>
            <TopMarketsChart
              totalTraffic={sportsbook.estimatedMonthlyVisitsSep2024}
              topCountries={sportsbook.topCountries}
            />
            <button
              onClick={() => setShowTrafficModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              View Detailed Traffic Data
            </button>
          </div>

          {/* Top Countries Section */}
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Top Markets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sportsbook.topCountries
                .sort((a, b) => b.visitsShare - a.visitsShare)
                .slice(0, 5)
                .map((country) => (
                  <div
                    key={country.countryCode}
                    className="bg-white p-4 rounded-lg shadow border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">{country.countryName}</span>
                      <span className="text-sm text-gray-500">
                        {country.visitsShare.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(country.visitsShare, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Detailed Review</h2>
            <MarkdownContent url={`/api/content/${sportsbook.UniqueID}`} />
          </div>
        </div>
      </div>

      {/* Traffic Modal */}
      <TrafficGraphModal
        isOpen={showTrafficModal}
        onClose={() => setShowTrafficModal(false)}
        countryName={sportsbook.Name}
        trafficHistory={sportsbook.trafficHistory}
        FlagComponent={() => <img src={sportsbook.Flag} alt={`${sportsbook.Name} flag`} />}
      />
    </HelmetProvider>
  );
};

export default Page;
