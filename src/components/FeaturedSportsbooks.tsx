import React from 'react';
import SportsbookCard from './SportsbookCard';
import { Sportsbook } from '../types/sportsbook';
import { Link } from 'react-router-dom';

interface FeaturedSportsbooksProps {
  sportsbooks: Sportsbook[];
}

const FeaturedSportsbooks: React.FC<FeaturedSportsbooksProps> = ({ sportsbooks }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Sportsbooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sportsbooks.slice(0, 6).map((sportsbook, index) => (
            <SportsbookCard
              key={index}
              name={sportsbook.Name}
              description={sportsbook.Description}
              logo={sportsbook.LogoIcon}
              rating={4.5}
              url={sportsbook.URL}
              descriptionsURL={sportsbook.descriptionsURL}
              estimatedMonthlyVisits={sportsbook.estimatedMonthlyVisits}
              topCountries={sportsbook.topCountries}
            />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/sportsbooks" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            View All Sportsbooks
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSportsbooks;
