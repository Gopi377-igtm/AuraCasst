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
      {/* Gooey Search Orb Container */}
      <div ref={containerRef} className="search-orb-container">
        {/* Gooey Background Liquid Layer */}
        <div className="gooey-background-layer" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="blob-bridge" />
        </div>

        {/* Input Overlay Form */}
        <form
          onSubmit={handleSubmit}
          className="input-overlay"
        >
          <div className="search-icon-wrapper">
            <Search className="w-5 h-5 text-white/80" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && suggestions.length > 0 && setIsOpen(true)}
            placeholder="Search city, state, or coordinates (e.g. Tokyo, Paris, New York)..."
            className="modern-input"
          />

          {/* Detect Location Button */}
          <button
            type="button"
            onClick={onDetectLocation}
            title="Use current geolocation"
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all mr-2 shrink-0 flex items-center justify-center border border-white/10"
          >
            <Navigation
              className={`w-4 h-4 text-red-400 ${
                isDetectingLocation ? 'animate-spin' : ''
              }`}
            />
          </button>

          {/* Submit Search Button */}
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/30 transition-all shrink-0 active:scale-95"
          >
            Explore
          </button>

          {/* Bottom Focus Indicator Bar */}
          <div className="focus-indicator" />
        </form>

        {/* Autocomplete Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 glass-card rounded-2xl overflow-hidden z-50 border border-white/20 shadow-2xl divide-y divide-white/5 max-h-64 overflow-y-auto">
            {suggestions.map((loc) => (
              <div
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className="p-3 hover:bg-white/10 cursor-pointer flex items-center gap-2.5 text-sm transition-colors"
              >
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-white font-medium">{loc.name}</span>
                <span className="text-xs text-slate-400">
                  {loc.admin1 ? `${loc.admin1}, ` : ''}
                  {loc.country}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Hidden SVG Gooey Filter */}
        <svg className="gooey-svg-filter" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="enhanced-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation={12} result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
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
              <MapPin className="w-3 h-3 text-red-400" />
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
