import React, { useState, useEffect } from 'react';
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
import { CountryFilter } from './components/CountryFilter';
import 'flag-icons/css/flag-icons.min.css';

const sportsbooks: Sportsbook[] = rawSportsbooks.map(transformSportsbook);

// Configure future flags for React Router v7
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [countries, setCountries] = useState<Array<{ name: string; code: string; flag: string }>>([]);
  const [filteredSportsbooks, setFilteredSportsbooks] = useState<Sportsbook[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch countries data
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountries((prev) =>
      prev.includes(countryCode)
        ? prev.filter((code) => code !== countryCode)
        : [...prev, countryCode]
    );
  };

  return (
    <Router {...routerConfig}>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="h-8 w-auto"
                    src="/logo.svg"
                    alt="Apex Sportsbooks"
                  />
                </div>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className={`lg:w-64 flex-shrink-0 ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
              <CountryFilter
                countries={countries}
                selectedCountries={selectedCountries}
                onCountrySelect={handleCountrySelect}
              />
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="container mx-auto px-4 py-4">
                <SearchBar sportsbooks={sportsbooks} />
              </div>
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<FeaturedSportsbooks sportsbooks={sportsbooks} />} />
                  <Route path="/sportsbooks" element={<AllSportsbooks sportsbooks={sportsbooks} />} />
                  <Route path="/growing" element={<AllSportsbooks sportsbooks={sportsbooks} />} />
                  
                  {/* SEO-friendly country routes */}
                  <Route 
                    path="/top-sportsbooks-in-:country" 
                    element={<CountrySportsbooks sportsbooks={sportsbooks} />} 
                  />
                  
                  {/* Legacy country routes with redirect */}
                  <Route 
                    path="/country/:country" 
                    element={<LegacyCountryRedirect />} 
                  />
                  
                  {/* Sportsbook review routes */}
                  <Route path="/sportsbook/:name" element={<SportsbookPage sportsbooks={sportsbooks} />} />
                  <Route path="/review/:name" element={<SportsbookPage sportsbooks={sportsbooks} />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

// Helper components for redirects
function LegacyCountryRedirect() {
  const location = useLocation();
  const country = location.pathname.split('/').pop();
  return <Navigate to={`/top-sportsbooks-in-${country}`} replace />;
}

export default App;
