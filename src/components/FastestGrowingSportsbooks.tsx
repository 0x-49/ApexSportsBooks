import React, { useState } from 'react';
import { Sportsbook } from '../types/sportsbook';
import SportsbookCard from './SportsbookCard';
import { calculateGrowthRates, formatTraffic, GrowthRate } from '../utils/sportsBookAnalytics';

interface FastestGrowingSportsbooksProps {
  sportsbooks: Sportsbook[];
}

const FastestGrowingSportsbooks: React.FC<FastestGrowingSportsbooksProps> = ({ sportsbooks }) => {
  const [timeframe, setTimeframe] = useState<1 | 2>(1);
  const [visibleCount, setVisibleCount] = useState(9);

  const growthRates = calculateGrowthRates(sportsbooks, timeframe);
  const visibleSportsbooks = growthRates.slice(0, visibleCount);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Fastest Growing Sportsbooks
        </h2>
        
        {/* Timeframe Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1">
            <button
              className={`px-4 py-2 rounded-lg ${
                timeframe === 1
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setTimeframe(1)}
            >
              Last Month
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                timeframe === 2
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setTimeframe(2)}
            >
              Last 2 Months
            </button>
          </div>
        </div>

        {/* Growth Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleSportsbooks.map((item: GrowthRate, index) => (
            <div key={index} className="flex flex-col">
              <SportsbookCard
                name={item.sportsbook.Name}
                description={item.sportsbook.Description}
                logo={item.sportsbook.LogoIcon}
                rating={4.5}
                url={item.sportsbook.URL}
                descriptionsURL={item.sportsbook.descriptionsURL}
                estimatedMonthlyVisits={item.sportsbook.estimatedMonthlyVisits}
                topCountries={item.sportsbook.topCountries}
              />
              <div className="mt-4 bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Growth Rate:</span>
                  <span className={`font-bold ${
                    item.growthRate > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {item.growthRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Traffic Change:</span>
                  <span className="text-sm">
                    {formatTraffic(item.previousTraffic)} → {formatTraffic(item.currentTraffic)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < growthRates.length && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount(prev => prev + 9)}
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

export default FastestGrowingSportsbooks;
