import React from 'react';
import { Droplets, Wind, SunMedium, Gauge, Cloud, CloudRain } from 'lucide-react';

export default function AtmosphericMetrics({ current, daily }) {
  const uvIndex = daily && daily[0] ? daily[0].uvIndex : 4;

  const metrics = [
    {
      label: 'Humidity',
      value: `${Math.round(current?.humidity || 0)}%`,
      icon: Droplets,
      color: 'text-sky-400'
    },
    {
      label: 'Wind Speed',
      value: `${Math.round(current?.windSpeedKm || 0)} km/h`,
      icon: Wind,
      color: 'text-teal-400'
    },
    {
      label: 'UV Index',
      value: `${uvIndex} UV`,
      icon: SunMedium,
      color: 'text-amber-400'
    },
    {
      label: 'Pressure',
      value: `${Math.round(current?.pressureHpa || 0)} hPa`,
      icon: Gauge,
      color: 'text-indigo-400'
    },
    {
      label: 'Cloud Cover',
      value: `${current?.cloudCover || 0}%`,
      icon: Cloud,
      color: 'text-slate-300'
    },
    {
      label: 'Precipitation',
      value: `${(current?.precipitationMm || 0).toFixed(1)} mm`,
      icon: CloudRain,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-center gap-3"
          >
            <div className={`p-2.5 rounded-xl bg-white/5 ${m.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {m.label}
              </p>
              <p className="text-base font-bold text-white mt-0.5">{m.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
