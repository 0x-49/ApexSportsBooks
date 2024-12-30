import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sportsbook } from 'types/sportsbook';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  sportsbooks: Sportsbook[];
}

const SearchBar: React.FC<SearchBarProps> = ({ sportsbooks }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSportsbooks, setFilteredSportsbooks] = useState<Sportsbook[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredSportsbooks([]);
      return;
    }

    const filtered = sportsbooks.filter(sportsbook =>
      sportsbook.Name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSportsbooks(filtered);
  }, [query, sportsbooks]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleSelectSportsbook = (sportsbook: Sportsbook) => {
    navigate(`/sportsbook/${sportsbook.UniqueID}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search sportsbooks..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {isOpen && filteredSportsbooks.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredSportsbooks.map((sportsbook) => (
            <button
              key={sportsbook.UniqueID}
              onClick={() => handleSelectSportsbook(sportsbook)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <div className="flex items-center">
                <img
                  src={sportsbook.LogoIcon}
                  alt={`${sportsbook.Name} logo`}
                  className="w-6 h-6 mr-3"
                />
                <span>{sportsbook.Name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
