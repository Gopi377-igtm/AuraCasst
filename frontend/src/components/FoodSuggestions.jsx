import React, { useState, useMemo } from 'react';
import {
  Utensils,
  ExternalLink,
  Sparkles,
  Flame,
  Clock,
  Star,
  Search,
  Coffee,
  ShoppingBag,
  ArrowRight,
  MapPin,
  RotateCcw,
  Check,
  Leaf,
  Compass,
  Navigation
} from 'lucide-react';
import {
  CLIMATE_TYPES,
  CLIMATE_METADATA,
  POPULAR_CULINARY_HUBS,
  detectClimateCategory,
  detectLocationRegion,
  getRegionalClimateSuggestions,
  getSwiggySearchUrl,
  MEAL_TIMES,
  MEAL_TIME_METADATA,
  detectCurrentMealTime
} from '../services/foodSuggestionEngine';

export default function FoodSuggestions({
  weather,
  mood,
  location,
  unit = 'C',
  onSelectLocation
}) {
  // Current natural climate detected by the engine from real-time meteorological variables
  const autoClimateKey = useMemo(
    () => detectClimateCategory(weather, mood),
    [weather, mood]
  );

  // Active selected climate (defaults to auto-detected weather)
  const [selectedClimateKey, setSelectedClimateKey] = useState(null);
  const activeClimateKey = selectedClimateKey || autoClimateKey;

  // Current natural meal time detected by the engine from local/timezone hour
  const autoMealTimeKey = useMemo(
    () => detectCurrentMealTime(weather?.timezone),
    [weather?.timezone]
  );

  // Active selected meal time (defaults to auto-detected meal time)
  const [selectedMealTimeKey, setSelectedMealTimeKey] = useState(null);
  const activeMealTimeKey = selectedMealTimeKey || autoMealTimeKey;

  // Curated regional & climate-aware suggestions derived dynamically from location, climate, and meal time
  const suggestionData = useMemo(() => {
    return getRegionalClimateSuggestions(
      location,
      weather,
      mood,
      selectedClimateKey,
      selectedMealTimeKey
    );
  }, [location, weather, mood, selectedClimateKey, selectedMealTimeKey]);

  // Detected regional key for matching active quick pill
  const activeRegionKey = useMemo(() => {
    return detectLocationRegion(location);
  }, [location]);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Current temperature formatted
  const currentTemp = weather?.current?.tempC;
  const formattedTemp =
    currentTemp !== undefined && currentTemp !== null
      ? unit === 'F'
        ? `${Math.round((currentTemp * 9) / 5 + 32)}°F`
        : `${Math.round(currentTemp)}°C`
      : null;

  // Filter items by category and veg/non-veg
  const filteredItems = useMemo(() => {
    let items = suggestionData.items || [];
    if (vegOnly) {
      items = items.filter((item) => item.isVeg);
    }
    if (selectedCategory !== 'All') {
      items = items.filter((item) =>
        item.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    return items;
  }, [suggestionData.items, vegOnly, selectedCategory]);

  // Handle custom search redirection to Swiggy
  const handleCustomSearchSubmit = (e) => {
    e.preventDefault();
    if (!customSearchQuery.trim()) return;
    const url = getSwiggySearchUrl(customSearchQuery.trim(), location?.name);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Copy dish name to clipboard
  const handleCopyDish = (item, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.name);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Quick switch location when clicking a popular culinary hub
  const handleHubClick = (hub) => {
    if (onSelectLocation) {
      onSelectLocation({
        name: hub.name,
        country: hub.country,
        admin1: hub.admin1,
        latitude: hub.latitude,
        longitude: hub.longitude
      });
    }
  };

  // Available category filters
  const categories = ['All', 'Comfort Food', 'Street Food', 'Snacks & Tea', 'Hearty Meals', 'Beverages', 'Sweet Treats'];

  return (
    <section
      id="food-suggestions"
      aria-label="Climate & Regional Food Suggestions"
      className="mt-8 mb-6 relative z-10 w-full"
    >
      <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Dynamic Glow orb behind the section matching the climate accent */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-[90px] pointer-events-none opacity-20 transition-all duration-700"
          style={{ backgroundColor: suggestionData.accentColor || '#f59e0b' }}
        />

        {/* Section Top Header: Title, Regional Badge, Climate Badge, Swiggy Redirect Tag */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center flex-wrap gap-2.5">
              <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white">
                <Utensils className="w-5 h-5" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
                Climate & Regional Food Pairings
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FC8019] animate-pulse" />
                Swiggy Live Delivery
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time atmospheric culinary recommendations tailored to{' '}
              <span className="text-amber-300 font-semibold">{suggestionData.regionName}</span>
              's local food culture & climate. Click any dish to order directly on{' '}
              <span className="text-orange-400 font-bold">Swiggy</span>!
            </p>
          </div>

          {/* Regional Identity, Meal Time & Detected Climate Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Active Region Pill */}
            <div
              title={`Culinary Region: ${suggestionData.regionTitle}`}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 backdrop-blur-md flex items-center gap-2.5 shadow-sm"
            >
              <span className="text-2xl">{suggestionData.regionEmoji}</span>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Regional Specialty
                </p>
                <p className="text-xs font-bold text-white truncate max-w-[150px]">
                  {suggestionData.regionName}
                </p>
              </div>
            </div>

            {/* Current Meal Time Pill */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-200 backdrop-blur-md flex items-center gap-2.5 shadow-sm">
              <span className="text-2xl">{suggestionData.mealTimeEmoji}</span>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {selectedMealTimeKey ? 'Selected Meal' : 'Current Dining Hour'}
                </p>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  {suggestionData.mealTimeShortLabel}
                  <span className="text-indigo-300/80 font-normal text-[11px] hidden sm:inline">
                    ({suggestionData.mealTimeRange.split('–')[0].trim()})
                  </span>
                </p>
              </div>
            </div>

            {/* Current Detected Climate Pill */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2.5">
              <span className="text-2xl">{suggestionData.climateEmoji}</span>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {selectedClimateKey ? 'Previewing Climate' : 'Detected Climate'}
                </p>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  {suggestionData.climateLabel}
                  {formattedTemp && (
                    <span className="text-amber-400 font-mono text-[11px] font-semibold">
                      ({formattedTemp})
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Regional Hub Switcher Bar */}
        <div className="pt-5 pb-3">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Quick Culinary Hub Switcher (Adapts Location & Food Instantly)
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Click any city to switch location
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {POPULAR_CULINARY_HUBS.map((hub) => {
              const isCurrent = activeRegionKey === hub.region;
              return (
                <button
                  key={hub.name}
                  onClick={() => handleHubClick(hub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/25 ring-2 ring-amber-400/40'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 hover:border-amber-400/30'
                  }`}
                >
                  <span>{hub.emoji}</span>
                  <span>{hub.label}</span>
                  {isCurrent && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meal Time & Dining Hours Selector Tabs */}
        <div className="pt-2 pb-3">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              Time-Of-Day Dining Schedule (Accurate to Breakfast, Lunch, Snacks & Dinner)
            </span>
            {selectedMealTimeKey && (
              <button
                onClick={() => setSelectedMealTimeKey(null)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Current Time ({MEAL_TIME_METADATA[autoMealTimeKey]?.shortLabel})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {/* Auto Live Time Button */}
            <button
              onClick={() => setSelectedMealTimeKey(null)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                !selectedMealTimeKey
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Current Time ({MEAL_TIME_METADATA[autoMealTimeKey]?.emoji} {MEAL_TIME_METADATA[autoMealTimeKey]?.shortLabel})</span>
            </button>

            {/* Individual Meal Time Tabs */}
            {Object.values(MEAL_TIME_METADATA).map((m) => {
              const isActive = activeMealTimeKey === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setSelectedMealTimeKey(m.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-500/30 text-white border border-indigo-400/50 shadow-lg font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                    ({m.timeRange})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Climate Condition Simulator & Selector Tabs */}
        <div className="pt-2 pb-4">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Pairings By Weather Condition
            </span>
            {selectedClimateKey && (
              <button
                onClick={() => setSelectedClimateKey(null)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Current Weather
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {/* Auto Live Button */}
            <button
              onClick={() => setSelectedClimateKey(null)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                !selectedClimateKey
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Current Weather ({CLIMATE_METADATA[autoClimateKey]?.emoji})</span>
            </button>

            {/* Individual Climate Tabs */}
            {Object.values(CLIMATE_METADATA).map((c) => {
              const isActive = activeClimateKey === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setSelectedClimateKey(c.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Climate & Regional Insight Banner */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                {suggestionData.mealTimeEmoji} {suggestionData.mealTimeLabel} ({suggestionData.mealTimeRange})
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                {suggestionData.climateEmoji} {suggestionData.climateLabel}
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <span>{suggestionData.headline}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {suggestionData.pairingQuote}
            </p>
          </div>
          <div className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">{suggestionData.atmosphereTip}</span>
            <span className="sm:hidden">Atmospheric Craving</span>
          </div>
        </div>

        {/* Filter Bar & Quick Custom Swiggy Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-white/20 text-white font-bold border border-white/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Veg Only Toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`ml-1 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                vegOnly
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Leaf className={`w-3.5 h-3.5 ${vegOnly ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Veg Only</span>
            </button>
          </div>

          {/* Direct Custom Dish Search on Swiggy */}
          <form
            onSubmit={handleCustomSearchSubmit}
            className="flex items-center gap-2 w-full lg:w-auto"
          >
            <div className="relative flex-grow lg:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customSearchQuery}
                onChange={(e) => setCustomSearchQuery(e.target.value)}
                placeholder="Search any dish on Swiggy..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!customSearchQuery.trim()}
              className="px-3.5 py-2 rounded-xl bg-[#FC8019] hover:bg-[#e47214] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-orange-500/25 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Search Swiggy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Food Items Showcase Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-white/10">
            <Utensils className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-300 text-sm font-semibold">No food items matched your filter.</p>
            <p className="text-slate-500 text-xs mt-1">Try switching categories or unchecking 'Veg Only'.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const swiggyUrl =
                item.swiggyUrl ||
                getSwiggySearchUrl(item.searchQuery || item.name, location?.name);

              return (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-orange-500/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1"
                >
                  {/* Food Image Container with Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900/60">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Dark gradient overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Veg / Non-Veg Indicator Dot */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        title={item.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}
                        className="w-5 h-5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center p-0.5 shadow-md"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'
                          }`}
                        />
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md border border-white/15 text-slate-200">
                        {item.category}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-bold shadow-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                    </div>

                    {/* Weather & Meal Pairing Tag on Bottom of Image */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        {item.mealBadge && (
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-950/85 backdrop-blur-md border border-indigo-400/30 text-indigo-200 text-[10px] font-bold whitespace-nowrap">
                            {item.mealBadge}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-amber-300 text-[11px] font-semibold truncate max-w-[150px]">
                          {item.tag}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/10 shrink-0">
                        {item.calories}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-base font-bold text-white font-display group-hover:text-orange-400 transition-colors leading-snug">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-xs text-amber-300 font-medium italic">
                        "{item.vibe}"
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Metadata & Quick Delivery Info */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.prepTime}</span>
                      </div>
                      <span className="font-semibold text-slate-300">{item.priceEstimate}</span>
                    </div>

                    {/* Swiggy Direct Redirect Button */}
                    <div className="pt-1 flex items-center gap-2">
                      <a
                        href={swiggyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-grow py-2.5 px-4 rounded-xl bg-[#FC8019] hover:bg-[#ff8f33] active:bg-[#e47214] text-white font-bold text-xs shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 group/btn"
                        title={`Order ${item.name} on Swiggy`}
                      >
                        <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                        <span>Order on Swiggy</span>
                        <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80 group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>

                      {/* Copy dish name button */}
                      <button
                        onClick={(e) => handleCopyDish(item, e)}
                        title="Copy dish name to clipboard"
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all shrink-0"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] font-mono font-bold">COPY</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Swiggy Doorstep Delivery Promo Banner */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-rose-500/10 border border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FC8019] flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0 font-extrabold text-lg">
              S
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Instant Doorstep Delivery via Swiggy
              </p>
              <p className="text-xs text-slate-300">
                Craving what you see? Swiggy connects you to the top cloud kitchens and authentic restaurants in {suggestionData.regionName}.
              </p>
            </div>
          </div>

          <a
            href="https://www.swiggy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm hover:scale-[1.02]"
          >
            <span>Visit Swiggy.com</span>
            <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
