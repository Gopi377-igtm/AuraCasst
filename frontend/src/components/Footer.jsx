import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>AuraCast React Engine &copy; 2026 • Live Weather by Open-Meteo</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hover:text-slate-200 transition-colors cursor-pointer">
          Privacy & Mood Metrics
        </span>
        <span className="hover:text-slate-200 transition-colors cursor-pointer">
          API Status
        </span>
        <span className="hover:text-slate-200 transition-colors cursor-pointer">
          Built with React 18 & Tailwind CSS
        </span>
      </div>
    </footer>
  );
}
