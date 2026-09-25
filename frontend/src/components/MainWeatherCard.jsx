import React from 'react';
import { MapPin, Star, Calendar } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherDescription } from '../services/moodEngine';

export default function MainWeatherCard({
  location,
  weather,
  unit = 'C',
  isFavorite = false,
  onToggleFavorite,
  isLoading = false
}) {
  const current = weather?.current;
  const weatherInfo = current
    ? getWeatherDescription(current.wmoCode, current.isDay)
    : { text: 'Loading weather...', icon: 'Sun' };

  const formatTemp = (tempC) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div
      className={`glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ${
        isLoading ? 'opacity-70 pointer-events-none' : ''
      }`}
    >
      {/* Top Details & Favorite Button */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {location?.name || 'Current Location'}
            </h2>
            {location?.country && (
              <span className="text-sm text-slate-300 font-medium">
                • {location.country}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{currentDateStr}</span>
          </div>
        </div>

        {/* Favorite Location Star Button */}
        <button
          onClick={onToggleFavorite}
          title={isFavorite ? 'Remove from MongoDB Favorites' : 'Save to MongoDB Favorites'}
          className={`p-2.5 rounded-2xl border transition-all ${
            isFavorite
              ? 'border-amber-400/40 bg-amber-400/20 text-amber-400'
              : 'border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/20'
          }`}
        >
          <Star
            className={`w-5 h-5 transition-transform hover:scale-110 ${
              isFavorite ? 'fill-amber-400 text-amber-400' : ''
            }`}
          />
        </button>
      </div>

      {/* Main Temperature & Weather Condition */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-4">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl sm:text-7xl font-extrabold tracking-tight font-display text-white">
              {formatTemp(current?.tempC)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm sm:text-base font-semibold text-slate-200">
              {weatherInfo.text}
            </span>
            <span className="text-xs text-slate-400">
              • Feels like {formatTemp(current?.feelsLikeC)}
            </span>
          </div>
        </div>

        {/* Weather Graphic Icon */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center p-4 shadow-xl weather-icon-floating">
          <WeatherIcon
            name={weatherInfo.icon}
            className="w-16 h-16 text-amber-300 drop-shadow-[0_10px_20px_rgba(251,191,36,0.3)]"
          />
        </div>
      </div>
    </div>
  );
}
