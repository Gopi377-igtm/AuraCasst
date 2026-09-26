import React from 'react';
import { Sliders, Sun, CloudSun, CloudRain, Waves, CloudLightning, Snowflake } from 'lucide-react';
import { MOODS } from '../services/moodEngine';

const MOOD_ICONS = {
  radiant: Sun,
  serene: CloudSun,
  cozy: CloudRain,
  gloomy: Waves,
  stormy: CloudLightning,
  tranquil: Snowflake
};

const MOOD_META = {
  radiant: {
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.5)',
    border: 'rgba(239, 68, 68, 0.35)',
    glowSoft: 'rgba(239, 68, 68, 0.15)',
    tag: 'Energized'
  },
  serene: {
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.5)',
    border: 'rgba(244, 63, 94, 0.35)',
    glowSoft: 'rgba(244, 63, 94, 0.15)',
    tag: 'Mindful'
  },
  cozy: {
    color: '#dc2626',
    glow: 'rgba(220, 38, 38, 0.5)',
    border: 'rgba(220, 38, 38, 0.35)',
    glowSoft: 'rgba(220, 38, 38, 0.15)',
    tag: 'Comfort'
  },
  gloomy: {
    color: '#e11d48',
    glow: 'rgba(225, 29, 72, 0.5)',
    border: 'rgba(225, 29, 72, 0.35)',
    glowSoft: 'rgba(225, 29, 72, 0.15)',
    tag: 'Reflective'
  },
  stormy: {
    color: '#b91c1c',
    glow: 'rgba(185, 28, 28, 0.5)',
    border: 'rgba(185, 28, 28, 0.35)',
    glowSoft: 'rgba(185, 28, 28, 0.15)',
    tag: 'Charged'
  },
  tranquil: {
    color: '#f87171',
    glow: 'rgba(248, 113, 113, 0.5)',
    border: 'rgba(248, 113, 113, 0.35)',
    glowSoft: 'rgba(248, 113, 113, 0.15)',
    tag: 'Stillness'
  }
};

export default function MoodSimulator({ activeMood, onSelectMood }) {
  const moodList = Object.values(MOODS);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between gap-2 mb-3 px-1 text-slate-400">
        <span className="text-[11px] uppercase font-bold tracking-wider flex items-center gap-1.5 font-mono text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          Atmospheric Mood Simulator (Instant Preview)
        </span>
        <span className="text-[10.5px] text-slate-500 font-mono tracking-wider uppercase">
          6 Mood Archetypes
        </span>
      </div>

      {/* Centered Expanding Accordion Capsule Dock */}
      <div className="w-full flex justify-center overflow-x-auto pb-1">
        <nav
          className="sable-mood-dock"
          aria-label="Atmospheric Mood Simulator"
          role="tablist"
        >
          {/* Logo / Brand Symbol button */}
          <div
            className="sable-dock-logo"
            title="Atmospheric Mood Engine"
            aria-hidden="true"
          >
            <Sliders className="w-3.5 h-3.5" />
          </div>

          {/* Mood Items with Expanding Accordion Animation */}
          {moodList.map((mood) => {
            const Icon = MOOD_ICONS[mood.id] || Sun;
            const meta = MOOD_META[mood.id] || MOOD_META.radiant;
            const isActive = activeMood && activeMood.id === mood.id;

            return (
              <button
                key={mood.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-pressed={isActive}
                onClick={() => onSelectMood(mood)}
                className={`sable-dock-item sable-dock-item--${mood.id} ${isActive ? 'active' : ''}`}
                style={{
                  '--mood-theme-color': meta.color,
                  '--mood-glow-color': meta.glow,
                  '--mood-border-color': meta.border,
                  '--mood-glow-soft': meta.glowSoft,
                }}
                title={`${mood.name} — ${mood.vibe}`}
              >
                <span className="sable-dock-icon" aria-hidden="true">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="sable-dock-label">{mood.name}</span>
                <span className="sable-dock-vibe">• {meta.tag}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

