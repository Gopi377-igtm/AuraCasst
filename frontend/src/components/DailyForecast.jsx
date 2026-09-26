import React, { useState } from 'react';
import { CalendarDays, Play, Pause, ListFilter, Sparkles } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { evaluateMood, getWeatherDescription } from '../services/moodEngine';

// 10-Color Spectral Palette from Uiverse Snippet
const COLOR_CARDS = [
  '142, 249, 252', // Cyan
  '142, 252, 204', // Mint
  '142, 252, 157', // Light green
  '215, 252, 142', // Lime
  '252, 252, 142', // Yellow
  '252, 208, 142', // Amber
  '252, 142, 142', // Coral red
  '252, 142, 239', // Pink
  '204, 142, 252', // Violet
  '142, 202, 252'  // Sky blue
];

export default function DailyForecast({ daily, unit = 'C' }) {
  const [viewMode, setViewMode] = useState('3d'); // '3d' orbit or 'list'
  const [isPaused, setIsPaused] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  const formatTemp = (tempC) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const dailyItems = daily && daily.length > 0 ? daily : [];

  // 10 Orbit Cards corresponding to the Uiverse cylinder ring
  const orbitCards = Array.from({ length: 10 }, (_, idx) => {
    const dayData = dailyItems.length > 0 ? dailyItems[idx % dailyItems.length] : null;
    return {
      index: idx,
      color: COLOR_CARDS[idx % COLOR_CARDS.length],
      dayData
    };
  });

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
      {/* Header with Title and Mode Switcher */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-red-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            5-Day Mood Outlook
          </h3>
        </div>

        {/* View mode toggle: 3D Orbit vs Classic List */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
          <button
            onClick={() => setViewMode('3d')}
            title="3D Rotating Cylinder Orbit View"
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === '3d'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>3D Orbit</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="Classic List View"
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3 h-3" />
            <span>List</span>
          </button>
        </div>
      </div>

      {viewMode === '3d' ? (
        /* 3D Rotating Cylinder Orbit Carousel */
        <div className="flex flex-col items-center">
          <div className="orbit-3d-wrapper">
            <div
              className={`orbit-3d-inner ${isPaused ? 'paused' : ''}`}
              style={{
                '--quantity': 10
              }}
            >
              {orbitCards.map(({ index, color, dayData }) => {
                if (!dayData) return null;
                const dayDate = new Date(dayData.date);
                const dayName =
                  index === 0
                    ? 'Today'
                    : dayDate.toLocaleDateString('en-US', { weekday: 'short' });
                const dateFormatted = dayDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
                const dayInfo = getWeatherDescription(dayData.wmoCode, 1);
                const dayMood = evaluateMood({
                  wmoCode: dayData.wmoCode,
                  temperatureC: dayData.maxTempC,
                  precipitation: dayData.precipSum,
                  windSpeed: 10
                });

                return (
                  <div
                    key={index}
                    className="orbit-3d-card group"
                    style={{
                      '--index': index,
                      '--color-card': color
                    }}
                    onClick={() => setActiveCardIndex(activeCardIndex === index ? null : index)}
                  >
                    {/* Glowing Radial Gradient Backdrop */}
                    <div className="orbit-3d-card-bg" />

                    {/* Card Foreground Content */}
                    <div className="orbit-3d-content">
                      {/* Top Header: Day & Date */}
                      <div className="w-full">
                        <p className="font-extrabold text-xs text-white uppercase tracking-wider drop-shadow-sm">
                          {dayName}
                        </p>
                        <p className="text-[10px] text-slate-300 font-medium">
                          {dateFormatted}
                        </p>
                      </div>

                      {/* Middle: Weather Icon & Condition */}
                      <div className="my-1 flex flex-col items-center">
                        <WeatherIcon
                          name={dayInfo.icon}
                          className="w-7 h-7 mx-auto drop-shadow-md text-white transition-transform group-hover:scale-110"
                        />
                        <span className="text-[10px] text-slate-200 font-semibold mt-1 truncate max-w-[90px] drop-shadow-sm">
                          {dayInfo.text}
                        </span>
                      </div>

                      {/* Mood Tag Pill */}
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/50 border border-white/20 text-white backdrop-blur-md">
                        {dayMood.emoji} {dayMood.name}
                      </span>

                      {/* Bottom Temperatures */}
                      <div className="pt-1 border-t border-white/10 w-full flex items-center justify-between text-xs">
                        <span className="font-extrabold text-white">
                          {formatTemp(dayData.maxTempC)}
                        </span>
                        <span className="text-[10px] text-slate-300 font-medium">
                          {formatTemp(dayData.minTempC)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orbit Controls & Hint Footer */}
          <div className="mt-2 w-full flex items-center justify-between text-[11px] text-slate-400 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              Hover to pause • 3D Atmospheric Orbit
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1 font-semibold"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Classic List View */
        <div className="flex flex-col gap-2.5">
          {daily && daily.length > 0 ? (
            daily.map((day, idx) => {
              const dayDate = new Date(day.date);
              const dayName =
                idx === 0
                  ? 'Today'
                  : dayDate.toLocaleDateString('en-US', { weekday: 'short' });
              const dateFormatted = dayDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });
              const dayInfo = getWeatherDescription(day.wmoCode, 1);
              const dayMood = evaluateMood({
                wmoCode: day.wmoCode,
                temperatureC: day.maxTempC,
                precipitation: day.precipSum,
                windSpeed: 10
              });

              return (
                <div
                  key={idx}
                  className="forecast-card flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="w-24">
                    <p className="font-bold text-sm text-white">{dayName}</p>
                    <p className="text-[11px] text-slate-400">{dateFormatted}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <WeatherIcon name={dayInfo.icon} className="w-6 h-6 text-red-400" />
                    <span className="text-xs text-slate-300 hidden sm:inline-block w-28 truncate">
                      {dayInfo.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs rounded-full bg-white/10 border border-white/10 font-medium text-slate-200">
                      {dayMood.emoji} {dayMood.name}
                    </span>
                  </div>

                  <div className="text-right w-24">
                    <span className="font-bold text-sm text-white">
                      {formatTemp(day.maxTempC)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5">
                      {formatTemp(day.minTempC)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-slate-500 italic py-4">
              Daily outlook unavailable
            </div>
          )}
        </div>
      )}
    </div>
  );
}
