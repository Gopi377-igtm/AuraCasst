import React from 'react';
import { Clock } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherDescription } from '../services/moodEngine';

export default function HourlyForecast({ hourly, unit = 'C' }) {
  const formatTemp = (tempC) => {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-xs uppercase font-bold tracking-wider text-slate-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Hourly Atmospheric Forecast
        </h3>
        <span className="text-[11px] text-slate-400">Next 12 Hours</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {hourly && hourly.length > 0 ? (
          hourly.map((item, idx) => {
            const itemDate = new Date(item.time);
            const hourFormatted = itemDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              hour12: true
            });
            const itemInfo = getWeatherDescription(item.wmoCode, 1);

            return (
              <div
                key={idx}
                className="flex-shrink-0 flex flex-col items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all w-24 text-center"
              >
                <span className="text-xs text-slate-300 font-medium">
                  {hourFormatted}
                </span>
                <div className="my-2">
                  <WeatherIcon
                    name={itemInfo.icon}
                    className="w-6 h-6 text-amber-300 mx-auto"
                  />
                </div>
                <span className="text-sm font-bold">{formatTemp(item.tempC)}</span>
                <span className="text-[10px] text-slate-400 mt-1">
                  {item.precipProb}% rain
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-slate-500 italic py-4">
            Hourly data unavailable
          </div>
        )}
      </div>
    </div>
  );
}
