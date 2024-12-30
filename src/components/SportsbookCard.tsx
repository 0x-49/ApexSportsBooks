import React from 'react';
import { Link } from 'react-router-dom';
import type { SportsbookCardProps } from '../types/sportsbook';
import CountryFlag from './CountryFlag';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

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
    const values = Object.values(estimatedMonthlyVisits);
    return values[values.length - 1] || 0;
  };

  const getTrafficTrend = () => {
    if (!estimatedMonthlyVisits) return { monthlyChange: 0, twoMonthChange: 0 };
    const values = Object.values(estimatedMonthlyVisits);
    const current = values[values.length - 1] || 0;
    const lastMonth = values[values.length - 2] || 0;
    const twoMonthsAgo = values[values.length - 3] || 0;

    return {
      monthlyChange: lastMonth ? ((current - lastMonth) / lastMonth) * 100 : 0,
      twoMonthChange: twoMonthsAgo ? ((current - twoMonthsAgo) / twoMonthsAgo) * 100 : 0
    };
  };

  const getCountryTraffic = (countryName: string): number => {
    if (!estimatedMonthlyVisits || !countryName) return 0;
    return estimatedMonthlyVisits[countryName.toLowerCase()] || 0;
  };

  const formatTraffic = (traffic: number): string => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(traffic);
  };

  const displayTraffic = showCountryTraffic && country
    ? getCountryTraffic(country)
    : getLatestTraffic();

  const { monthlyChange, twoMonthChange } = getTrafficTrend();

  // Mini chart data
  const chartData = {
    labels: Object.keys(estimatedMonthlyVisits || {}).slice(-6),
    datasets: [
      {
        data: Object.values(estimatedMonthlyVisits || {}).slice(-6),
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <img
            src={logo}
            alt={`${name} logo`}
            className="w-16 h-16 object-contain mr-4"
          />
          <div>
            <h2 className="text-xl font-bold mb-1">{name}</h2>
            <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600">Monthly Traffic</div>
            <div className="text-2xl font-bold">{formatTraffic(displayTraffic)}</div>
            <div className="flex items-center mt-1 space-x-2">
              <span className={`text-sm font-medium ${monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {monthlyChange >= 0 ? '↑' : '↓'} {Math.abs(monthlyChange).toFixed(1)}%
              </span>
              <span className="text-gray-400">vs last month</span>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">2M Change</div>
            <div className={`text-2xl font-bold ${twoMonthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {twoMonthChange >= 0 ? '+' : ''}{twoMonthChange.toFixed(1)}%
            </div>
            <div className="h-6 mt-1">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">Top Markets</div>
          <div className="flex flex-wrap gap-2">
            {topCountries.slice(0, 3).map((country, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg"
              >
                <CountryFlag countryCode={country.countryCode} className="w-5 h-4" />
                <span className="text-sm font-medium">{country.countryName}</span>
                <span className="text-sm text-gray-500">
                  {(country.visitsShare * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <Link
            to={`/sportsbook/${name.toLowerCase().replace(/\s+/g, '-')}`}
            className="flex-1 text-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            View Details
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center border-2 border-blue-600 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Visit Site
          </a>
        </div>
      </div>
    </div>
  );
};

export default SportsbookCard;
