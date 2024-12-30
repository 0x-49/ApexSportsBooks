import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { TopCountry } from '../types/sportsbook';
import CountryFlag from './CountryFlag';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TopMarketsChartProps {
  topCountries: TopCountry[];
  totalTraffic: number;
}

const TopMarketsChart: React.FC<TopMarketsChartProps> = ({ topCountries, totalTraffic }) => {
  // Sort countries by traffic share
  const sortedCountries = [...topCountries]
    .sort((a, b) => b.visitsShare - a.visitsShare)
    .slice(0, 5);

  const data = {
    labels: sortedCountries.map(country => country.countryName),
    datasets: [
      {
        data: sortedCountries.map(country => country.visitsShare * 100),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const countryData = sortedCountries[context.dataIndex];
            const trafficValue = totalTraffic * countryData.visitsShare;
            return [
              `${value.toFixed(1)}% of total traffic`,
              `${new Intl.NumberFormat().format(trafficValue)} monthly visits`
            ];
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Top 5 Markets Distribution</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative h-[300px]">
          <Pie data={data} options={options} />
        </div>
        <div className="space-y-4">
          {sortedCountries.map((country, index) => {
            const trafficValue = totalTraffic * country.visitsShare;

            return (
              <div key={country.countryName} className="flex items-center space-x-3">
                <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                <CountryFlag countryCode={country.countryCode} />
                <div className="flex-1">
                  <div className="font-medium">{country.countryName}</div>
                  <div className="text-sm text-gray-600">
                    {(country.visitsShare * 100).toFixed(1)}% • {' '}
                    {new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(trafficValue)} visits
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopMarketsChart;
