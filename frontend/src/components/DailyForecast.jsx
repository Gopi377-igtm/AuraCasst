import React from 'react';
import { CalendarDays } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { evaluateMood, getWeatherDescription } from '../services/moodEngine';

export default function DailyForecast({ daily, unit = 'C' }) {
  const formatTemp = (tempC) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  return (
    <div className="glass-card rounded-3xl p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-sky-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            5-Day Mood Outlook
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">Extended Forecast</span>
      </div>

      {/* Daily List Container */}
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
                  <WeatherIcon name={dayInfo.icon} className="w-6 h-6 text-sky-300" />
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
    </div>
  );
}
