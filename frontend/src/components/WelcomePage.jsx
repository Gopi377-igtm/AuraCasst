import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Sun,
  CloudRain,
  Zap,
  Snowflake,
  Wind,
  Compass,
  Volume2,
  Utensils,
  MapPin,
  Calendar,
  Activity,
  Layers,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { audioSynth } from '../services/audioSynth';

export default function WelcomePage({
  onEnter,
  weather,
  location,
  mood,
  unit = 'C',
  isDetectingLocation = false,
  onDetectLocation,
  onSelectLocation
}) {
  const [selectedClimate, setSelectedClimate] = useState('radiant');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  // Weather data extraction
  const currentTemp = weather?.current?.tempC;
  const formattedTemp =
    currentTemp !== undefined && currentTemp !== null
      ? unit === 'F'
        ? `${Math.round((currentTemp * 9) / 5 + 32)}°F`
        : `${Math.round(currentTemp)}°C`
      : isDetectingLocation
      ? 'Locating...'
      : '--';

  const wmoCode = weather?.current?.wmoCode ?? 1;
  const cityName =
    location?.name && location.name !== 'Detecting Location...'
      ? location.name
      : isDetectingLocation
      ? 'Detecting Location...'
      : 'Your Location';
  const countryName = location?.country || '';

  // Interactive sample climates for the welcome screen
  const climateShowcase = {
    radiant: {
      name: 'Radiant Sun & Clear Skies',
      emoji: '☀️',
      icon: Sun,
      color: '#f59e0b',
      gradient: 'from-amber-500/20 via-rose-500/10 to-transparent',
      vibe: 'Warm dopamine elevation & crisp outdoor clarity',
      quote: 'Sunlight cascades through the atmosphere, infusing the body with warmth and natural vitality.',
      temp: '27°C',
      humidity: '42%',
      wind: '8 km/h'
    },
    rainy: {
      name: 'Monsoon & Rhythmic Rain',
      emoji: '🌧️',
      icon: CloudRain,
      color: '#0ea5e9',
      gradient: 'from-sky-500/20 via-blue-500/10 to-transparent',
      vibe: 'Petrichor scent, acoustic raindrops & steaming tea',
      quote: 'Raindrops kiss the earth, playing a soothing rhythmic cadence that invites introspection and hot savory cravings.',
      temp: '21°C',
      humidity: '88%',
      wind: '18 km/h'
    },
    stormy: {
      name: 'Electric Thunderstorm',
      emoji: '⚡',
      icon: Zap,
      color: '#a855f7',
      gradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
      vibe: 'Atmospheric charge, kinetic power & cozy indoor shelter',
      quote: 'Lightning arcs across shadowed clouds, igniting the air with raw electrical energy and sensory depth.',
      temp: '19°C',
      humidity: '94%',
      wind: '34 km/h'
    },
    frost: {
      name: 'Crisp Frost & Serene Winter',
      emoji: '❄️',
      icon: Snowflake,
      color: '#38bdf8',
      gradient: 'from-cyan-500/20 via-slate-500/10 to-transparent',
      vibe: 'Crystalline purity, quiet stillness & warm hearths',
      quote: 'A calm, crystalline breeze sweeps the landscape into tranquil focus, perfect for warm broths and thoughtful moments.',
      temp: '9°C',
      humidity: '58%',
      wind: '12 km/h'
    }
  };

  const activeShowcase = climateShowcase[selectedClimate];

  // Handle entering the website with transition
  const handleEnterClick = () => {
    setIsEntering(true);
    // Play subtle harmonic tone if available
    try {
      if (!audioSynth.isPlaying) {
        audioSynth.start();
        audioSynth.playMood(mood);
      }
    } catch (e) {
      // Audio autoplay may be restricted, continue gracefully
    }

    setTimeout(() => {
      onEnter();
    }, 450);
  };

  // Toggle ambient audio on welcome page
  const handleToggleSound = () => {
    if (!audioSynth.isPlaying) {
      audioSynth.start();
      audioSynth.playMood(mood);
      setIsPlayingAudio(true);
    } else {
      audioSynth.stop();
      setIsPlayingAudio(false);
    }
  };

  return (
    <div
      className={`min-h-screen relative z-20 flex flex-col justify-between transition-all duration-500 ${
        isEntering ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Animated Weather Ambiance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glow orbs matching the selected climate */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[130px] opacity-25 transition-all duration-1000"
          style={{ backgroundColor: activeShowcase.color }}
        />
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full blur-[100px] opacity-20 bg-rose-600/30" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[100px] opacity-20 bg-amber-500/30" />
      </div>

      {/* Top Navbar Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/30 ring-1 ring-white/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-white">
                AuraCast
              </h1>
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded-full bg-white/10 border border-white/10 text-rose-300">
                Next-Gen
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Interactive Atmospheric & Mood Intelligence
            </p>
          </div>
        </div>

        {/* Live Location & Quick Jump Button */}
        <div className="flex items-center gap-3">
          {/* Current Live Weather Indicator */}
          <button
            type="button"
            onClick={onDetectLocation}
            title={isDetectingLocation ? 'Detecting current location...' : 'Current Location (Click to refresh)'}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-xs text-slate-300 shadow-sm cursor-pointer transition-all active:scale-95"
          >
            <MapPin className={`w-3.5 h-3.5 text-rose-400 shrink-0 ${isDetectingLocation ? 'animate-bounce text-amber-400' : ''}`} />
            <span className="font-semibold text-white truncate max-w-[130px]">
              {cityName}
            </span>
            <span className="text-amber-400 font-mono font-bold">{formattedTemp}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isDetectingLocation ? 'bg-amber-400 animate-spin' : 'bg-emerald-400 animate-pulse'
              } ml-0.5`}
              title={isDetectingLocation ? 'Locating...' : 'Live Synced'}
            />
          </button>

          {/* Quick Sound preview */}
          <button
            onClick={handleToggleSound}
            title={isPlayingAudio ? 'Mute ambient sound' : 'Preview atmospheric ambient synthesizer'}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
          </button>

          {/* Enter Website Header Button */}
          <button
            onClick={handleEnterClick}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <span>Enter Website</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Hero & Welcome Section */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center text-center">
        {/* Welcome Pill Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-lg animate-bounce-gentle">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs uppercase font-extrabold tracking-wider bg-gradient-to-r from-amber-300 via-rose-300 to-white bg-clip-text text-transparent">
            Welcome to AuraCast • Weather Visualizer
          </span>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        </div>

        {/* Hero Title */}
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-display tracking-tight leading-[1.1] max-w-4xl mb-6">
          Feel the Atmosphere.{' '}
          <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-red-500 bg-clip-text text-transparent">
            Experience the Sky.
          </span>
        </h2>

        {/* Welcome Narrative Body */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl leading-relaxed mb-10 font-normal">
          AuraCast transforms conventional weather forecasts into an immersive sensory journey.
          Synchronizing <span className="text-white font-semibold">real-time atmospheric conditions</span> with{' '}
          <span className="text-amber-300 font-semibold">generative ambient audio</span>,{' '}
          <span className="text-rose-300 font-semibold">3D orbital planetary forecasts</span>, and{' '}
          <span className="text-orange-400 font-semibold">climate-matched regional food cravings</span> with live delivery.
        </p>

        {/* Primary Call to Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto">
          <button
            onClick={handleEnterClick}
            id="enter-website-btn"
            className="w-full sm:w-auto relative group px-8 py-4 sm:px-10 sm:py-4.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:via-rose-500 hover:to-amber-400 text-white font-extrabold text-base sm:text-lg shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden border border-white/20"
          >
            {/* Shimmer overlay animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            <Sparkles className="w-5 h-5 text-amber-200 animate-spin-slow" />
            <span>Enter AuraCast Website</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform" />
          </button>

          <a
            href="#features-preview"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Highlights</span>
            <Compass className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Interactive Climate Simulator Showcase */}
        <div className="w-full max-w-4xl p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl mb-14 text-left relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Compass className="w-3.5 h-3.5 text-rose-400" />
                <span>Interactive Weather Experience Preview</span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                Toggle through atmospheric conditions to preview how AuraCast adapts sight, sound, and cravings.
              </p>
            </div>

            {/* Climate Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {Object.entries(climateShowcase).map(([key, item]) => {
                const isSelected = selectedClimate === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedClimate(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white/20 text-white border border-white/30 shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Climate Display Card */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{activeShowcase.emoji}</span>
                <div>
                  <h4 className="text-xl font-bold text-white font-display">
                    {activeShowcase.name}
                  </h4>
                  <p className="text-xs text-amber-300 font-medium">
                    {activeShowcase.vibe}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{activeShowcase.quote}"
              </p>
            </div>

            {/* Weather Metrics Micro-Badge */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-around gap-2 text-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Temp</p>
                <p className="text-base font-bold text-white font-mono mt-0.5">{activeShowcase.temp}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Humidity</p>
                <p className="text-base font-bold text-sky-400 font-mono mt-0.5">{activeShowcase.humidity}</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Wind</p>
                <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">{activeShowcase.wind}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars / Feature Showcase Grid */}
        <section id="features-preview" className="w-full text-left space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-rose-400" />
              <span>What Awaits You Inside AuraCast</span>
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Built with React 18, Three.js, Open-Meteo & Web Audio
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1: 3D Orbital Forecast */}
            <div className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-rose-500/40 transition-all duration-300 flex flex-col justify-between space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display group-hover:text-rose-400 transition-colors">
                  3D Orbital Forecast
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Rotate through a 7-day planetary forecast cylinder with 0° straight vertical alignment, day/night lighting, and temperature trends.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                <span>Interactive 3D Carousel</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Feature 2: Audio Synthesis */}
            <div className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                  Generative Audio Synth
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Procedural Web Audio API soundscapes that harmonize live acoustic melodies with wind speed, cloud density, and rain intensity.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                <span>Real-Time Synthesizer</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Feature 3: Food Pairings & Swiggy */}
            <div className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-orange-500/40 transition-all duration-300 flex flex-col justify-between space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500/20 to-rose-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display group-hover:text-orange-400 transition-colors">
                  Climate Food Pairings
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Location-aware culinary recommendations matching your city's local culture to current weather with direct Swiggy doorstep links.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-orange-400 flex items-center gap-1">
                <span>Swiggy Live Delivery</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* Feature 4: Atmospheric Mood Analysis */}
            <div className="p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-rose-500/40 transition-all duration-300 flex flex-col justify-between space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500/20 to-pink-500/20 border border-red-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display group-hover:text-rose-400 transition-colors">
                  Mood & Journaling
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Correlate your emotional rhythm with barometric pressure, sunlight, and humidity, securely saved to MongoDB Atlas cloud.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-rose-300 flex items-center gap-1">
                <span>MongoDB Atlas Sync</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </section>

        {/* Bottom Enter Call to Action Card */}
        <div className="w-full mt-12 p-8 rounded-3xl bg-gradient-to-r from-red-950/40 via-rose-950/30 to-slate-950 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-left backdrop-blur-xl shadow-2xl">
          <div className="space-y-1">
            <h4 className="text-xl sm:text-2xl font-bold text-white font-display">
              Ready to explore your atmosphere?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              {isDetectingLocation && !weather ? (
                <span>Detecting your local atmosphere in real-time...</span>
              ) : (
                <span>
                  Live weather for <span className="text-amber-400 font-semibold">{cityName}</span>
                  {countryName ? `, ${countryName}` : ''} is ready and synchronized.
                </span>
              )}
            </p>
          </div>

          <button
            onClick={handleEnterClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:via-rose-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer credits on welcome page */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-white/10 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 AuraCast. Atmospheric Weather & Sensory Intelligence.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open-Meteo Verified</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Web Audio Engine</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
