import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { TopCountry } from '../types/sportsbook';
import CountryFlag from './CountryFlag';
import TrafficGraphModal from './TrafficGraphModal';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CountryTrafficStatsProps {
  country: TopCountry;
  rank: number;
  trafficHistory: {
    [key: string]: number;
  };
}

const CountryTrafficStats: React.FC<CountryTrafficStatsProps> = ({
  country,
  rank,
  trafficHistory
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Calculate traffic change percentages
  const trafficValues = Object.values(trafficHistory);
  const currentMonthTraffic = trafficValues[trafficValues.length - 1];
  const lastMonthTraffic = trafficValues[trafficValues.length - 2];
  const twoMonthsAgoTraffic = trafficValues[trafficValues.length - 3];
  
  const monthOverMonthChange = lastMonthTraffic 
    ? ((currentMonthTraffic - lastMonthTraffic) / lastMonthTraffic) * 100 
    : 0;
    
  const twoMonthChange = twoMonthsAgoTraffic 
    ? ((currentMonthTraffic - twoMonthsAgoTraffic) / twoMonthsAgoTraffic) * 100 
    : 0;

  // Chart data for mini chart
  const chartData = {
    labels: Object.keys(trafficHistory).slice(-6), // Show last 6 months
    datasets: [
      {
        data: Object.values(trafficHistory).slice(-6),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
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
    <>
      <div 
        className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-gray-500">#{rank}</span>
          <CountryFlag countryCode={country.countryCode} />
          <span className="font-semibold">{country.countryName}</span>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Traffic Share</div>
            <div className="font-bold text-lg">
              {(country.visitsShare * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Monthly Visits</div>
            <div className="font-bold text-lg">
              {new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(currentMonthTraffic)}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">1M Change</div>
            <div className={`font-bold ${monthOverMonthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {monthOverMonthChange >= 0 ? '↑' : '↓'} {Math.abs(monthOverMonthChange).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">2M Change</div>
            <div className={`font-bold ${twoMonthChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {twoMonthChange >= 0 ? '↑' : '↓'} {Math.abs(twoMonthChange).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="mt-4 h-24">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <TrafficGraphModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        countryName={country.countryName}
        trafficHistory={trafficHistory}
        FlagComponent={() => <CountryFlag countryCode={country.countryCode} />}
      />
    </>
  );
};

export default CountryTrafficStats;
