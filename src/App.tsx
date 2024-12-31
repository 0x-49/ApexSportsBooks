import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import FastestGrowing from './components/FastestGrowing';
import AllSportsbooks from './components/AllSportsbooks';
import CountrySportsbooks from './components/CountrySportsbooks';
import SportsbookPage from './components/SportsbookPage';
import Footer from './components/Footer';
import rawSportsbooks from './data/sportsbooks.json';
import { transformSportsbook } from './utils/transformSportsbook';
import type { Sportsbook } from './types/sportsbook';
import 'flag-icons/css/flag-icons.min.css';

const sportsbooks: Sportsbook[] = rawSportsbooks.map(transformSportsbook);

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col bg-parchment-50">
        <Navbar sportsbooks={sportsbooks} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home sportsbooks={sportsbooks} />} />
            <Route path="/growing" element={<FastestGrowing sportsbooks={sportsbooks} />} />
            <Route path="/sportsbooks" element={<AllSportsbooks sportsbooks={sportsbooks} />} />
            <Route path="/top-sportsbooks-in-:country" element={<CountrySportsbooks sportsbooks={sportsbooks} />} />
            <Route path="/sportsbook/:sportsbook" element={<SportsbookPage sportsbooks={sportsbooks} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
