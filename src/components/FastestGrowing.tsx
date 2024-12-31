import { Link } from 'react-router-dom';
import type { Sportsbook } from '../types/sportsbook';

interface FastestGrowingProps {
  sportsbooks: Sportsbook[];
}

export default function FastestGrowing({ sportsbooks }: FastestGrowingProps) {
  // Sort sportsbooks by growth rate (descending)
  const fastestGrowing = [...sportsbooks].sort((a, b) => 
    (b.GrowthRate || 0) - (a.GrowthRate || 0)
  ).slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brown-800 mb-8">
        Fastest Growing Sportsbooks
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fastestGrowing.map((sportsbook) => (
          <Link
            key={sportsbook.Name}
            to={`/sportsbook/${sportsbook.Name}`}
            className="bg-parchment-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-brown-800 mb-2">
              {sportsbook.Name}
            </h2>
            <p className="text-brown-600 mb-2">
              Growth Rate: {sportsbook.GrowthRate}%
            </p>
            <p className="text-brown-600">
              {sportsbook.Description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
