import { Link } from 'react-router-dom';
import type { Sportsbook } from '../types/sportsbook';

interface HomeProps {
  sportsbooks: Sportsbook[];
}

export default function Home({ sportsbooks }: HomeProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-brown-800 mb-6">
          Welcome to ApexSportsbooks
        </h1>
        <p className="text-brown-600 mb-8">
          Your guide to the best sportsbooks worldwide
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sportsbooks.slice(0, 6).map((sportsbook) => (
            <Link
              key={sportsbook.Name}
              to={`/sportsbook/${sportsbook.Name}`}
              className="bg-parchment-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-brown-800 mb-2">
                {sportsbook.Name}
              </h2>
              <p className="text-brown-600">
                {sportsbook.Description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
