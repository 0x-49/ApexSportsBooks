import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllSportsbooks from './components/AllSportsbooks';
import FeaturedSportsbooks from './components/FeaturedSportsbooks';
import SportsbookPage from './components/SportsbookPage';
import CountrySportsbooks from './components/CountrySportsbooks';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import rawSportsbooks from './data/sportsbooks.json';
import { transformSportsbook } from './utils/transformSportsbook';
import type { Sportsbook } from './types/sportsbook';

const sportsbooks: Sportsbook[] = rawSportsbooks.map(transformSportsbook);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar sportsbooks={sportsbooks} />
        <div className="container mx-auto px-4 py-4">
          <SearchBar sportsbooks={sportsbooks} />
        </div>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<FeaturedSportsbooks sportsbooks={sportsbooks} />} />
            <Route path="/sportsbooks" element={<AllSportsbooks sportsbooks={sportsbooks} />} />
            <Route path="/growing" element={<AllSportsbooks sportsbooks={sportsbooks} sortBy="growth" />} />
            
            {/* SEO-friendly country routes */}
            <Route 
              path="/top-sportsbooks-in-:country" 
              element={<CountrySportsbooks sportsbooks={sportsbooks} />} 
            />
            
            {/* Legacy country routes with redirect */}
            <Route 
              path="/country/:country" 
              element={
                <LegacyCountryRedirect />
              } 
            />
            
            {/* Sportsbook review routes */}
            <Route path="/review/:name" element={<SportsbookPage sportsbooks={sportsbooks} />} />
            
            {/* Legacy sportsbook routes with redirect */}
            <Route 
              path="/sportsbook/:name" 
              element={
                <LegacySportsbookRedirect />
              } 
            />
            
            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Helper components for redirects
function LegacyCountryRedirect() {
  const location = useLocation();
  const country = location.pathname.split('/').pop() || '';
  return (
    <Navigate 
      to={`/top-sportsbooks-in-${country.toLowerCase().replace(/\s+/g, '-')}`}
      replace 
    />
  );
}

function LegacySportsbookRedirect() {
  const location = useLocation();
  const name = location.pathname.split('/').pop() || '';
  return (
    <Navigate 
      to={`/review/${name.toLowerCase().replace(/\s+/g, '-')}`}
      replace 
    />
  );
}

export default App;
