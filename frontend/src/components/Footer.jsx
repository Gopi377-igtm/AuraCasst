import React from 'react';

export default function Footer({ onOpenWelcome }) {
  return (
    <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>AuraCast React Engine &copy; 2026 • Live Weather by Open-Meteo</span>
      </div>
      <div className="flex items-center gap-4">
        {onOpenWelcome && (
          <button
            onClick={onOpenWelcome}
            className="hover:text-amber-300 text-rose-300 font-semibold transition-colors cursor-pointer"
          >
            Welcome Screen
          </button>
        )}
        <span className="hover:text-slate-200 transition-colors cursor-pointer">
          Privacy & Mood Metrics
        </span>
        <span className="hover:text-slate-200 transition-colors cursor-pointer">
          API Status
        </span>
        <span className="hover:text-slate-200 transition-colors cursor-pointer">
          React 18 & Three.js 3D
        </span>
      </div>
    </footer>
  );
}
