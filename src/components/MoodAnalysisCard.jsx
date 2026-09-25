import React, { useState } from 'react';
import {
  Sparkles,
  Compass,
  Music,
  Disc,
  Palette,
  Feather,
  Check
} from 'lucide-react';

export default function MoodAnalysisCard({ mood, onOpenJournal }) {
  const [copiedColor, setCopiedColor] = useState(null);

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  if (!mood) return null;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden">
      {/* Mood Header Badge & Vibe */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-white/10 text-xl flex items-center justify-center">
            {mood.emoji}
          </span>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              {mood.name} Aura
            </h3>
            <p className="text-xs text-amber-300 font-medium">{mood.vibe}</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-300">
          Emotional Vibe
        </span>
      </div>

      {/* Psychological & Emotional Description */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
        {mood.description}
      </p>

      {/* Recommended Activity */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-4 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5 shrink-0">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Suggested Activity
          </span>
          <p className="text-xs font-medium text-slate-200 mt-0.5">
            {mood.activity}
          </p>
        </div>
      </div>

      {/* Soundscape & Genre Recommendation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <Music className="w-3 h-3 text-sky-400" /> Soundscape
          </p>
          <p className="text-xs font-bold text-white mt-1 truncate">
            {mood.soundtrack}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <Disc className="w-3 h-3 text-purple-400" /> Recommended Genre
          </p>
          <p className="text-xs font-bold text-white mt-1 truncate">
            {mood.musicSuggestion}
          </p>
        </div>
      </div>

      {/* Mood Color Palette Tokens (Click to copy) */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" /> Active Aura Palette (Click to Copy)
        </p>
        <div className="flex items-center gap-3">
          {mood.palette?.map((color, idx) => {
            const isCopied = copiedColor === color;
            return (
              <div
                key={idx}
                onClick={() => copyColor(color)}
                title={`Click to copy ${color}`}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full shadow-lg border border-white/20 transition-transform group-hover:scale-110 flex items-center justify-center relative"
                  style={{ backgroundColor: color }}
                >
                  {isCopied && <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />}
                </div>
                <span className="text-[10px] uppercase font-mono text-slate-300 opacity-75 group-hover:opacity-100">
                  {isCopied ? 'Copied' : color}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Mood to MongoDB Journal Button */}
      <button
        onClick={onOpenJournal}
        className="w-full mt-5 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-md transition-all shadow-sm"
      >
        <Feather className="w-4 h-4 text-purple-400" />
        Log Mood in Journal (MongoDB)
      </button>
    </div>
  );
}
