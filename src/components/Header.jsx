import React from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Star,
  BookHeart,
  Database
} from 'lucide-react';

export default function Header({
  mongoStatus,
  isAudioPlaying,
  onToggleAudio,
  unit,
  onToggleUnit,
  favoritesCount,
  onOpenFavorites,
  onOpenJournal
}) {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 border-b border-white/10">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-orange-500/30 ring-1 ring-white/30">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              AuraCast
            </h1>
            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-white/10 border border-white/10 text-amber-300">
              React 18
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Atmospheric Weather & Mood Visualizer
          </p>
        </div>
      </div>

      {/* Control Buttons & MongoDB Atlas Status */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* MongoDB Atlas Indicator */}
        <div
          title={
            mongoStatus.connected
              ? `MongoDB Atlas Connected: ${mongoStatus.host || 'Cluster0'} (${mongoStatus.name || 'auracast'})`
              : 'MongoDB Atlas is currently disconnected'
          }
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-medium cursor-default transition-all ${
            mongoStatus.connected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm shadow-emerald-500/10'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-sm shadow-rose-500/10'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              mongoStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <Database className="w-3.5 h-3.5" />
          <span>{mongoStatus.connected ? 'Atlas Online' : 'Atlas Offline'}</span>
        </div>

        {/* Ambient Soundscape Synthesizer */}
        <button
          onClick={onToggleAudio}
          title={isAudioPlaying ? 'Mute ambient soundscape' : 'Play synthesized mood soundscape'}
          className={`p-2.5 rounded-2xl glass-card text-slate-200 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold ${
            isAudioPlaying ? 'bg-amber-500/30 border-amber-400' : ''
          }`}
        >
          {isAudioPlaying ? (
            <Volume2 className="w-4 h-4 text-amber-400" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Soundscape</span>
        </button>

        {/* Unit Switcher (°C / °F) */}
        <button
          onClick={onToggleUnit}
          title="Toggle Temperature Unit (°C / °F)"
          className="px-3 py-2 rounded-2xl glass-card text-xs font-bold font-mono tracking-wider text-slate-200 hover:text-white transition-all flex items-center gap-1.5"
        >
          <span>°{unit}</span>
        </button>

        {/* Favorites Modal Trigger */}
        <button
          onClick={onOpenFavorites}
          title="Saved Favorite Locations (MongoDB Atlas)"
          className="relative p-2.5 rounded-2xl glass-card text-slate-200 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold group"
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400/20 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Favorites</span>
          {favoritesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Mood Journal Modal Trigger */}
        <button
          onClick={onOpenJournal}
          title="Weather & Mood Journal Reflections (MongoDB Atlas)"
          className="p-2.5 rounded-2xl glass-card bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-200 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
        >
          <BookHeart className="w-4 h-4 text-purple-400" />
          <span className="hidden sm:inline">Mood Journal</span>
        </button>
      </div>
    </header>
  );
}
