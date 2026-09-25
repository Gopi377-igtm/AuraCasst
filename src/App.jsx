import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import MoodSimulator from './components/MoodSimulator';
import MainWeatherCard from './components/MainWeatherCard';
import AtmosphericMetrics from './components/AtmosphericMetrics';
import HourlyForecast from './components/HourlyForecast';
import MoodAnalysisCard from './components/MoodAnalysisCard';
import DailyForecast from './components/DailyForecast';
import FavoritesModal from './components/FavoritesModal';
import MoodJournalModal from './components/MoodJournalModal';
import Footer from './components/Footer';
import WeatherCanvas from './components/WeatherCanvas';
import { MOODS, evaluateMood } from './services/moodEngine';
import { WeatherAPI } from './services/weatherApi';
import { DatabaseAPI } from './services/databaseApi';
import { audioSynth } from './services/audioSynth';

export default function App() {
  const [location, setLocation] = useState({
    name: 'San Francisco',
    country: 'United States',
    latitude: 37.7749,
    longitude: -122.4194
  });
  const [weather, setWeather] = useState(null);
  const [mood, setMood] = useState(MOODS.RADIANT);
  const [unit, setUnit] = useState(() => localStorage.getItem('auracast_unit') || 'C');
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auracast_history') || '[]');
    } catch {
      return [];
    }
  });

  const [mongoStatus, setMongoStatus] = useState({ connected: false });
  const [favorites, setFavorites] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  // Sync active mood attribute to document.body for dynamic CSS theme variables
  useEffect(() => {
    if (mood?.id) {
      document.body.setAttribute('data-mood', mood.id);
    }
  }, [mood]);

  // Load initial MongoDB health & data
  useEffect(() => {
    const initDatabase = async () => {
      try {
        const health = await DatabaseAPI.getHealth();
        if (health.database) {
          setMongoStatus(health.database);
        }
        const favs = await DatabaseAPI.getFavorites();
        setFavorites(favs);
      } catch (err) {
        console.warn('MongoDB init error:', err);
      }
    };
    initDatabase();
  }, []);

  // Fetch weather for a given location
  const loadWeather = useCallback(async (loc) => {
    setIsLoadingWeather(true);
    try {
      const data = await WeatherAPI.getWeather(loc.latitude, loc.longitude);
      setWeather(data);

      const evaluated = evaluateMood({
        wmoCode: data.current.wmoCode,
        temperatureC: data.current.tempC,
        windSpeed: data.current.windSpeedKm,
        humidity: data.current.humidity,
        precipitation: data.current.precipitationMm,
        isDay: data.current.isDay
      });

      setMood(evaluated);

      if (audioSynth.isPlaying) {
        audioSynth.playMood(evaluated);
      }
    } catch (err) {
      console.error('Failed to load weather:', err);
      // Fallback mock weather
      const fallbackWeather = {
        current: {
          tempC: 22,
          feelsLikeC: 23,
          humidity: 55,
          wmoCode: 1,
          isDay: 1,
          windSpeedKm: 12,
          pressureHpa: 1014,
          cloudCover: 15,
          precipitationMm: 0
        },
        daily: [
          { date: new Date().toISOString(), maxTempC: 24, minTempC: 16, wmoCode: 1, uvIndex: 6, precipSum: 0 },
          { date: new Date(Date.now() + 86400000).toISOString(), maxTempC: 23, minTempC: 15, wmoCode: 2, uvIndex: 5, precipSum: 0 },
          { date: new Date(Date.now() + 172800000).toISOString(), maxTempC: 20, minTempC: 14, wmoCode: 61, uvIndex: 3, precipSum: 2 }
        ],
        hourly: [
          { time: new Date().toISOString(), tempC: 22, wmoCode: 1, humidity: 55, precipProb: 0 },
          { time: new Date(Date.now() + 3600000).toISOString(), tempC: 23, wmoCode: 1, humidity: 52, precipProb: 0 }
        ]
      };
      setWeather(fallbackWeather);
      setMood(MOODS.RADIANT);
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadWeather(location);
  }, [loadWeather]);

  // Handle location selection
  const handleSelectLocation = (loc) => {
    setLocation(loc);
    loadWeather(loc);

    // Save to recent searches
    const filtered = recentSearches.filter(
      (item) => item.name.toLowerCase() !== loc.name.toLowerCase()
    );
    const updated = [
      {
        name: loc.name,
        country: loc.country || '',
        latitude: loc.latitude,
        longitude: loc.longitude
      },
      ...filtered
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem('auracast_history', JSON.stringify(updated));
  };

  // Browser Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const locationMeta = await WeatherAPI.reverseGeocode(lat, lon);
        const loc = {
          name: locationMeta.name,
          country: locationMeta.country,
          latitude: lat,
          longitude: lon
        };
        handleSelectLocation(loc);
        setIsDetectingLocation(false);
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        setIsDetectingLocation(false);
        alert('Could not access your location. Please enter a city manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle unit (°C / °F)
  const handleToggleUnit = () => {
    const nextUnit = unit === 'C' ? 'F' : 'C';
    setUnit(nextUnit);
    localStorage.setItem('auracast_unit', nextUnit);
  };

  // Toggle ambient audio
  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      audioSynth.stop();
      setIsAudioPlaying(false);
    } else {
      audioSynth.playMood(mood);
      setIsAudioPlaying(true);
    }
  };

  // Mood simulator selection
  const handleSelectSimulatorMood = (selectedMood) => {
    setMood(selectedMood);
    if (isAudioPlaying) {
      audioSynth.playMood(selectedMood);
    }
  };

  // Check if current location is favorite
  const isCurrentFavorite = () => {
    if (!location) return false;
    const currentName = (location.name || '').toLowerCase();
    return favorites.some(
      (f) =>
        f.name.toLowerCase() === currentName ||
        (Math.abs(f.latitude - location.latitude) < 0.05 &&
          Math.abs(f.longitude - location.longitude) < 0.05)
    );
  };

  // Toggle current location favorite
  const handleToggleCurrentFavorite = async () => {
    const currentName = (location.name || '').toLowerCase();
    const existing = favorites.find(
      (f) =>
        f.name.toLowerCase() === currentName ||
        (Math.abs(f.latitude - location.latitude) < 0.05 &&
          Math.abs(f.longitude - location.longitude) < 0.05)
    );

    try {
      if (existing) {
        await DatabaseAPI.removeFavorite(existing._id);
        setFavorites((prev) => prev.filter((f) => f._id !== existing._id));
      } else {
        const newFav = await DatabaseAPI.addFavorite({
          name: location.name,
          country: location.country || '',
          latitude: location.latitude,
          longitude: location.longitude,
          moodTag: mood?.id || 'radiant'
        });
        if (newFav && newFav._id) {
          setFavorites((prev) => [newFav, ...prev]);
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Could not update favorite in MongoDB Atlas.');
    }
  };

  // Delete favorite
  const handleDeleteFavorite = async (id) => {
    try {
      await DatabaseAPI.removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error('Error deleting favorite:', err);
    }
  };

  // Open & load mood journal reflections
  const handleOpenJournal = async () => {
    try {
      const logs = await DatabaseAPI.getMoodLogs();
      setMoodLogs(logs);
    } catch (err) {
      console.warn('Failed to load mood logs:', err);
    }
    setIsJournalModalOpen(true);
  };

  // Save mood journal entry
  const handleSaveMoodLog = async (payload) => {
    const saved = await DatabaseAPI.addMoodLog(payload);
    if (saved && saved._id) {
      setMoodLogs((prev) => [saved, ...prev]);
    } else {
      const logs = await DatabaseAPI.getMoodLogs();
      setMoodLogs(logs);
    }
  };

  // Delete mood log
  const handleDeleteMoodLog = async (id) => {
    try {
      await DatabaseAPI.removeMoodLog(id);
      setMoodLogs((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error('Error deleting mood log:', err);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-900">
      {/* Ambient Glowing Aura Background Mesh Orbs */}
      <div className="aura-orb aura-orb-1" />
      <div className="aura-orb aura-orb-2" />
      <div className="aura-orb aura-orb-3" />

      {/* Dynamic Atmospheric Particle Canvas */}
      <WeatherCanvas particleType={mood?.particleType || 'sunbeams'} />

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex-grow flex flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Navigation & Controls Header */}
        <Header
          mongoStatus={mongoStatus}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          favoritesCount={favorites.length}
          onOpenFavorites={() => setIsFavoritesModalOpen(true)}
          onOpenJournal={handleOpenJournal}
        />

        {/* Search Bar & Auto-suggestions */}
        <SearchBar
          onSelectLocation={handleSelectLocation}
          onDetectLocation={handleDetectLocation}
          recentSearches={recentSearches}
          isDetectingLocation={isDetectingLocation}
        />

        {/* Mood Simulator Bar */}
        <MoodSimulator
          activeMood={mood}
          onSelectMood={handleSelectSimulatorMood}
        />

        {/* Weather & Mood Visualizer Main Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2 items-start">
          {/* Left Column: Real-time Weather & Atmospheric Metrics */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <MainWeatherCard
              location={location}
              weather={weather}
              unit={unit}
              isFavorite={isCurrentFavorite()}
              onToggleFavorite={handleToggleCurrentFavorite}
              isLoading={isLoadingWeather}
            />

            <AtmosphericMetrics
              current={weather?.current}
              daily={weather?.daily}
            />

            <HourlyForecast
              hourly={weather?.hourly}
              unit={unit}
            />
          </div>

          {/* Right Column: Mood Mapping Analysis & Extended Forecast */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <MoodAnalysisCard
              mood={mood}
              onOpenJournal={handleOpenJournal}
            />

            <DailyForecast
              daily={weather?.daily}
              unit={unit}
            />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* MongoDB Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favorites}
        onSelectFavorite={handleSelectLocation}
        onDeleteFavorite={handleDeleteFavorite}
      />

      {/* MongoDB Mood Journal Modal */}
      <MoodJournalModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        currentMood={mood}
        currentLocation={location}
        currentWeather={weather}
        moodLogs={moodLogs}
        onSaveLog={handleSaveMoodLog}
        onDeleteLog={handleDeleteMoodLog}
      />
    </div>
  );
}
