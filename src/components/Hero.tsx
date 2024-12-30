import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-gray-900 text-white py-32 mt-16">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">Find Your Perfect Sportsbook</h1>
          <p className="text-xl mb-8">Compare top-rated sportsbooks, read expert reviews, and make informed betting decisions.</p>
          <div className="flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Compare Sportsbooks
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Read Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
