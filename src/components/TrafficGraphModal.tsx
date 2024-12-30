import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions
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

interface TrafficGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryName: string;
  trafficHistory: {
    [key: string]: number;
  };
  FlagComponent: React.ComponentType;
}

const TrafficGraphModal: React.FC<TrafficGraphModalProps> = ({
  isOpen,
  onClose,
  countryName,
  trafficHistory,
  FlagComponent
}) => {
  if (!isOpen) return null;

  const months = Object.keys(trafficHistory);
  const traffic = Object.values(trafficHistory);

  // Calculate growth metrics
  const currentTraffic = traffic[traffic.length - 1];
  const previousTraffic = traffic[traffic.length - 2];
  const growthRate = ((currentTraffic - previousTraffic) / previousTraffic) * 100;

  // Calculate peak traffic
  const peakTraffic = Math.max(...traffic);
  const peakMonth = months[traffic.indexOf(peakTraffic)];

  // Calculate average traffic
  const averageTraffic = traffic.reduce((a, b) => a + b, 0) / traffic.length;

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Traffic',
        data: traffic,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: `Traffic History for ${countryName}`,
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.parsed.y !== null) {
              return `Traffic: ${new Intl.NumberFormat().format(context.parsed.y)} visits`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (typeof value === 'number') {
              return new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(value);
            }
            return '';
          }
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-6">
              <FlagComponent />
            </div>
            <h2 className="text-2xl font-bold">{countryName} Traffic Analysis</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600">Current Monthly Traffic</div>
            <div className="text-xl font-bold">
              {new Intl.NumberFormat().format(currentTraffic)}
            </div>
            <div className={`text-sm ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthRate >= 0 ? '↑' : '↓'} {Math.abs(growthRate).toFixed(1)}% from last month
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600">Peak Traffic</div>
            <div className="text-xl font-bold">
              {new Intl.NumberFormat().format(peakTraffic)}
            </div>
            <div className="text-sm text-green-600">{peakMonth}</div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600">Average Monthly Traffic</div>
            <div className="text-xl font-bold">
              {new Intl.NumberFormat().format(Math.round(averageTraffic))}
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>

        <div className="mt-6 text-sm text-gray-500">
          * Traffic data is estimated based on various sources and may not reflect exact numbers
        </div>
      </div>
    </div>
  );
};

export default TrafficGraphModal;
