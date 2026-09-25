import React, { useState, useEffect, useRef } from 'react';
import { Search, Navigation, MapPin } from 'lucide-react';
import { WeatherAPI } from '../services/weatherApi';

export default function SearchBar({
  onSelectLocation,
  onDetectLocation,
  recentSearches = [],
  isDetectingLocation = false
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await WeatherAPI.searchCities(query);
      setSuggestions(results);
      setIsOpen(results.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    } else {
      const results = await WeatherAPI.searchCities(query);
      if (results.length > 0) {
        handleSelect(results[0]);
      } else {
        alert('Location not found. Please try another city.');
      }
    }
  };

  const handleSelect = (loc) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      {/* Search Input Box */}
      <div ref={containerRef} className="relative">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center glass-card rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-amber-400/50 transition-all shadow-xl"
        >
          <div className="pl-3.5 pr-2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && suggestions.length > 0 && setIsOpen(true)}
            placeholder="Search city, state, or coordinates (e.g. Tokyo, Paris, New York)..."
            className="w-full bg-transparent border-none text-sm md:text-base text-white placeholder:text-slate-400 focus:outline-none py-2 px-1"
          />

          {/* Detect Location Button */}
          <button
            type="button"
            onClick={onDetectLocation}
            title="Use current geolocation"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all mr-1.5"
          >
            <Navigation
              className={`w-4 h-4 text-sky-400 ${
                isDetectingLocation ? 'animate-spin' : ''
              }`}
            />
          </button>

          {/* Submit Search Button */}
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 transition-all"
          >
            Explore
          </button>
        </form>

        {/* Autocomplete Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl overflow-hidden z-40 border border-white/20 shadow-2xl divide-y divide-white/5 max-h-64 overflow-y-auto">
            {suggestions.map((loc) => (
              <div
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className="p-3 hover:bg-white/10 cursor-pointer flex items-center gap-2.5 text-sm transition-colors"
              >
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-white font-medium">{loc.name}</span>
                <span className="text-xs text-slate-400">
                  {loc.admin1 ? `${loc.admin1}, ` : ''}
                  {loc.country}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Searches Chips */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
          <MapPin className="w-3 h-3 text-slate-400" /> Recent:
        </span>
        {recentSearches && recentSearches.length > 0 ? (
          recentSearches.map((item, idx) => (
            <button
              key={`${item.name}-${idx}`}
              onClick={() => onSelectLocation(item)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 text-slate-200 transition-all flex items-center gap-1.5"
            >
              <MapPin className="w-3 h-3 text-sky-400" />
              <span>{item.name}</span>
            </button>
          ))
        ) : (
          <span className="text-xs text-slate-500 italic">No recent searches yet.</span>
        )}
      </div>
    </div>
  );
}
