import React from 'react';
import { Sliders } from 'lucide-react';
import { MOODS } from '../services/moodEngine';

export default function MoodSimulator({ activeMood, onSelectMood }) {
  const moodList = Object.values(MOODS);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between gap-2 mb-2.5 px-1">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          Atmospheric Mood Simulator (Instant Preview)
        </span>
        <span className="text-[11px] text-slate-500">6 Mood Archetypes</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {moodList.map((mood) => {
          const isActive = activeMood && activeMood.id === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood)}
              className={`mood-pill-btn flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl glass-card text-xs font-semibold text-slate-200 hover:text-white transition-all ${
                isActive ? 'active' : ''
              }`}
            >
              <span>{mood.emoji}</span>
              <span>{mood.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
