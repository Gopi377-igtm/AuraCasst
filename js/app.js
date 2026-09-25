/**
 * AuraCast: Main Application Controller
 * Handles user interactions, search, geolocation, audio ambient generator & state persistence.
 */

const App = {
  state: {
    location: {
      name: 'San Francisco',
      country: 'United States',
      latitude: 37.7749,
      longitude: -122.4194
    },
    weather: null,
    mood: null,
    unit: localStorage.getItem('auracast_unit') || 'C',
    isAudioPlaying: false,
    audioCtx: null,
    audioNodes: [],
    recentSearches: JSON.parse(localStorage.getItem('auracast_history') || '[]'),
    favorites: [],
    moodLogs: []
  },

  /**
   * Application Entry Point
   */
  async init() {
    UI.initCanvas();
    this.setupEventListeners();
    this.setupUnitToggle();
    this.setupMoodSimulator();
    this.setupAudioSynthesizer();
    this.renderRecentSearches();

    // Initialize MongoDB Atlas features & favorites
    await this.setupDatabaseFeatures();

    // Load initial weather
    await this.loadWeatherForLocation(this.state.location);
  },

  /**
   * Set up all UI event listeners
   */
  setupEventListeners() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('search-suggestions');
    const geoBtn = document.getElementById('geo-btn');

    // Form submit
    if (searchForm) {
      searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        const results = await WeatherAPI.searchCities(query);
        if (results.length > 0) {
          this.selectLocation(results[0]);
          if (suggestionsBox) suggestionsBox.classList.add('hidden');
          searchInput.blur();
        } else {
          alert('Location not found. Please try another city.');
        }
      });
    }

    // Live search suggestions with debounce
    let debounceTimer;
    if (searchInput && suggestionsBox) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
          suggestionsBox.classList.add('hidden');
          return;
        }

        debounceTimer = setTimeout(async () => {
          const results = await WeatherAPI.searchCities(query);
          if (results.length > 0) {
            suggestionsBox.innerHTML = results.map(loc => `
              <div class="suggestion-item p-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 flex items-center gap-2 text-sm transition-colors" data-id="${loc.id}">
                <i data-lucide="map-pin" class="w-4 h-4 text-sky-400"></i>
                <span class="text-white font-medium">${loc.name}</span>
                <span class="text-xs text-slate-400">${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country}</span>
              </div>
            `).join('');

            suggestionsBox.querySelectorAll('.suggestion-item').forEach((item, index) => {
              item.addEventListener('click', () => {
                this.selectLocation(results[index]);
                suggestionsBox.classList.add('hidden');
                searchInput.value = '';
              });
            });

            suggestionsBox.classList.remove('hidden');
            if (window.lucide) window.lucide.createIcons();
          } else {
            suggestionsBox.classList.add('hidden');
          }
        }, 300);
      });

      // Close suggestions on outside click
      document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target)) {
          suggestionsBox.classList.add('hidden');
        }
      });
    }

    // Geolocation button
    if (geoBtn) {
      geoBtn.addEventListener('click', () => this.detectCurrentLocation());
    }

    // Audio Ambient Toggle
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => this.toggleAmbientAudio());
    }
  },

  /**
   * Setup Unit Toggle (°C / °F)
   */
  setupUnitToggle() {
    const unitToggleBtn = document.getElementById('unit-toggle-btn');
    if (!unitToggleBtn) return;

    this.updateUnitButtonText();

    unitToggleBtn.addEventListener('click', () => {
      this.state.unit = this.state.unit === 'C' ? 'F' : 'C';
      localStorage.setItem('auracast_unit', this.state.unit);
      this.updateUnitButtonText();
      
      if (this.state.weather && this.state.mood) {
        UI.render(this.state.weather, this.state.location, this.state.mood, this.state.unit);
      }
    });
  },

  updateUnitButtonText() {
    const unitText = document.getElementById('unit-toggle-text');
    if (unitText) {
      unitText.textContent = `°${this.state.unit}`;
    }
  },

  /**
   * Setup Interactive Mood Simulator Preset Bar
   */
  setupMoodSimulator() {
    const moodPills = document.querySelectorAll('.mood-pill-btn');
    moodPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const moodId = pill.dataset.moodId;
        const targetMood = Object.values(MoodEngine.MOODS).find(m => m.id === moodId);
        if (!targetMood) return;

        this.state.mood = targetMood;
        UI.applyMoodTheme(targetMood);

        // If audio is playing, adapt ambient audio
        if (this.state.isAudioPlaying) {
          this.playMoodAtmosphereAudio(targetMood);
        }

        if (this.state.weather) {
          UI.render(this.state.weather, this.state.location, targetMood, this.state.unit);
        }
      });
    });
  },

  /**
   * Detect Geolocation via Browser
   */
  detectCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    const geoBtn = document.getElementById('geo-btn');
    if (geoBtn) geoBtn.classList.add('animate-spin');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const locationMeta = await WeatherAPI.reverseGeocode(lat, lon);
        
        await this.selectLocation({
          name: locationMeta.name,
          country: locationMeta.country,
          latitude: lat,
          longitude: lon
        });

        if (geoBtn) geoBtn.classList.remove('animate-spin');
      },
      (err) => {
        console.warn('Geolocation denied/failed:', err);
        if (geoBtn) geoBtn.classList.remove('animate-spin');
        alert('Could not access your location. Please enter a city manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  },

  /**
   * Select and load location
   */
  async selectLocation(loc) {
    this.state.location = loc;
    this.saveToRecentSearches(loc);
    this.renderRecentSearches();
    this.updateFavButtonState();
    await this.loadWeatherForLocation(loc);
  },

  /**
   * Fetch weather and compute mood
   */
  async loadWeatherForLocation(location) {
    this.setLoading(true);
    try {
      const weatherData = await WeatherAPI.getWeather(location.latitude, location.longitude);
      this.state.weather = weatherData;

      // Compute mood from live weather
      const mood = MoodEngine.evaluateMood({
        wmoCode: weatherData.current.wmoCode,
        temperatureC: weatherData.current.tempC,
        windSpeed: weatherData.current.windSpeedKm,
        humidity: weatherData.current.humidity,
        precipitation: weatherData.current.precipitationMm,
        isDay: weatherData.current.isDay
      });

      this.state.mood = mood;
      UI.applyMoodTheme(mood);
      UI.render(weatherData, location, mood, this.state.unit);
      this.updateFavButtonState();

      if (this.state.isAudioPlaying) {
        this.playMoodAtmosphereAudio(mood);
      }
    } catch (err) {
      console.error('Failed to load weather:', err);
      // Fallback with mock pleasant data so app never breaks
      this.loadMockFallback();
    } finally {
      this.setLoading(false);
    }
  },

  /**
   * Offline / Failure Mock Fallback
   */
  loadMockFallback() {
    const mockWeather = {
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
        { date: new Date(Date.now() + 172800000).toISOString(), maxTempC: 20, minTempC: 14, wmoCode: 61, uvIndex: 3, precipSum: 2 },
        { date: new Date(Date.now() + 259200000).toISOString(), maxTempC: 21, minTempC: 15, wmoCode: 3, uvIndex: 4, precipSum: 0 },
        { date: new Date(Date.now() + 345600000).toISOString(), maxTempC: 25, minTempC: 17, wmoCode: 0, uvIndex: 7, precipSum: 0 }
      ],
      hourly: [
        { time: new Date().toISOString(), tempC: 22, wmoCode: 1, humidity: 55, precipProb: 0 },
        { time: new Date(Date.now() + 3600000).toISOString(), tempC: 23, wmoCode: 1, humidity: 52, precipProb: 0 },
        { time: new Date(Date.now() + 7200000).toISOString(), tempC: 24, wmoCode: 1, humidity: 50, precipProb: 0 },
        { time: new Date(Date.now() + 10800000).toISOString(), tempC: 22, wmoCode: 2, humidity: 58, precipProb: 5 },
        { time: new Date(Date.now() + 14400000).toISOString(), tempC: 19, wmoCode: 2, humidity: 65, precipProb: 10 }
      ]
    };

    this.state.weather = mockWeather;
    const mood = MoodEngine.evaluateMood({
      wmoCode: mockWeather.current.wmoCode,
      temperatureC: mockWeather.current.tempC
    });
    this.state.mood = mood;
    UI.applyMoodTheme(mood);
    UI.render(mockWeather, this.state.location, mood, this.state.unit);
    this.updateFavButtonState();
  },

  /**
   * Save search to localStorage
   */
  saveToRecentSearches(loc) {
    if (!loc || !loc.name) return;
    const filtered = this.state.recentSearches.filter(
      item => item.name.toLowerCase() !== loc.name.toLowerCase()
    );
    filtered.unshift({
      name: loc.name,
      country: loc.country || '',
      latitude: loc.latitude,
      longitude: loc.longitude
    });

    this.state.recentSearches = filtered.slice(0, 5);
    localStorage.setItem('auracast_history', JSON.stringify(this.state.recentSearches));
  },

  renderRecentSearches() {
    UI.renderRecentSearches(this.state.recentSearches, (selectedLoc) => {
      this.selectLocation(selectedLoc);
    });
  },

  setLoading(isLoading) {
    const card = document.getElementById('main-weather-card');
    if (!card) return;
    if (isLoading) {
      card.classList.add('opacity-70', 'pointer-events-none');
    } else {
      card.classList.remove('opacity-70', 'pointer-events-none');
    }
  },

  /**
   * Web Audio API Synthesizer for Ambient Soundscapes
   * Generates organic atmospheric soundscapes without needing heavy audio files!
   */
  setupAudioSynthesizer() {
    // Audio Context is initialized on first user gesture
  },

  initAudioContext() {
    if (!this.state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.state.audioCtx = new AudioContext();
    }
    if (this.state.audioCtx.state === 'suspended') {
      this.state.audioCtx.resume();
    }
  },

  toggleAmbientAudio() {
    this.initAudioContext();
    const btn = document.getElementById('sound-toggle-btn');
    const icon = document.getElementById('sound-toggle-icon');

    if (this.state.isAudioPlaying) {
      this.stopAmbientAudio();
      this.state.isAudioPlaying = false;
      if (btn) btn.classList.remove('bg-amber-500/30', 'border-amber-400');
      if (icon) icon.setAttribute('data-lucide', 'volume-x');
    } else {
      this.state.isAudioPlaying = true;
      this.playMoodAtmosphereAudio(this.state.mood || MoodEngine.MOODS.RADIANT);
      if (btn) btn.classList.add('bg-amber-500/30', 'border-amber-400');
      if (icon) icon.setAttribute('data-lucide', 'volume-2');
    }

    if (window.lucide) window.lucide.createIcons();
  },

  stopAmbientAudio() {
    if (this.state.audioNodes) {
      this.state.audioNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {}
      });
      this.state.audioNodes = [];
    }
  },

  playMoodAtmosphereAudio(mood) {
    if (!this.state.audioCtx) return;
    this.stopAmbientAudio();

    const ctx = this.state.audioCtx;
    const now = ctx.currentTime;

    // Master volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.18, now + 1.5);
    masterGain.connect(ctx.destination);
    this.state.audioNodes.push(masterGain);

    // Dynamic synthesis based on mood
    if (mood.id === 'cozy' || mood.id === 'stormy') {
      // Rain Pink Noise generator
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = mood.id === 'stormy' ? 700 : 1200;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      this.state.audioNodes.push(whiteNoise);

      if (mood.id === 'stormy') {
        // Deep sub rumble
        const subOsc = ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(55, now);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.2, now);
        subOsc.connect(subGain);
        subGain.connect(masterGain);
        subOsc.start();
        this.state.audioNodes.push(subOsc);
      }
    } else {
      // Harmonic Ambient Drone (Chords: Root, 5th, Octave)
      const freqs = mood.id === 'radiant' ? [220, 277.18, 329.63, 440] : [174.61, 220, 261.63, 349.23];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.04 / freqs.length, now);

        // Soft LFO for breathing effect
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.1 + idx * 0.05, now);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.015, now);
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        lfo.start();
        this.state.audioNodes.push(osc, lfo);
      });
    }
  },

  /**
   * Setup MongoDB Atlas Integration Features
   */
  async setupDatabaseFeatures() {
    await this.checkMongoStatus();
    await this.loadFavorites();

    // Toggle favorite for current location
    const favCurrentBtn = document.getElementById('fav-current-btn');
    if (favCurrentBtn) {
      favCurrentBtn.addEventListener('click', () => this.toggleCurrentFavorite());
    }

    // Favorites modal toggles
    const favToggleBtn = document.getElementById('favorites-toggle-btn');
    const closeFavBtn = document.getElementById('close-favorites-modal');
    const favModal = document.getElementById('favorites-modal');
    if (favToggleBtn) {
      favToggleBtn.addEventListener('click', () => this.openFavoritesModal());
    }
    if (closeFavBtn) {
      closeFavBtn.addEventListener('click', () => this.closeFavoritesModal());
    }
    if (favModal) {
      favModal.addEventListener('click', (e) => {
        if (e.target === favModal) this.closeFavoritesModal();
      });
    }

    // Mood journal modal toggles
    const journalToggleBtn = document.getElementById('journal-toggle-btn');
    const logCurrentMoodBtn = document.getElementById('log-current-mood-btn');
    const closeJournalBtn = document.getElementById('close-journal-modal');
    const journalModal = document.getElementById('journal-modal');
    const journalForm = document.getElementById('mood-journal-form');

    if (journalToggleBtn) {
      journalToggleBtn.addEventListener('click', () => this.openJournalModal());
    }
    if (logCurrentMoodBtn) {
      logCurrentMoodBtn.addEventListener('click', () => this.openJournalModal());
    }
    if (closeJournalBtn) {
      closeJournalBtn.addEventListener('click', () => this.closeJournalModal());
    }
    if (journalModal) {
      journalModal.addEventListener('click', (e) => {
        if (e.target === journalModal) this.closeJournalModal();
      });
    }
    if (journalForm) {
      journalForm.addEventListener('submit', (e) => this.handleMoodJournalSubmit(e));
    }
  },

  /**
   * Check MongoDB Atlas connection status
   */
  async checkMongoStatus() {
    const health = await DatabaseAPI.getHealth();
    const statusText = document.getElementById('mongo-status-text');
    const statusDot = document.getElementById('mongo-status-dot');
    const statusPill = document.getElementById('mongo-status-pill');

    if (health.database && health.database.connected) {
      if (statusText) statusText.textContent = 'Atlas Online';
      if (statusDot) {
        statusDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
      }
      if (statusPill) {
        statusPill.title = `MongoDB Atlas Connected: ${health.database.host || 'Cluster0'} (${health.database.name || 'auracast'})`;
      }
    } else {
      if (statusText) statusText.textContent = 'Atlas Offline';
      if (statusDot) {
        statusDot.className = 'w-2 h-2 rounded-full bg-rose-500';
      }
      if (statusPill) {
        statusPill.className = statusPill.className.replace('emerald', 'rose');
      }
    }
  },

  /**
   * Load Favorites from MongoDB
   */
  async loadFavorites() {
    try {
      this.state.favorites = await DatabaseAPI.getFavorites();
      this.updateFavoritesCountBadge();
      this.updateFavButtonState();
    } catch (e) {
      console.warn('Failed to load favorites:', e);
    }
  },

  updateFavoritesCountBadge() {
    const badge = document.getElementById('favorites-badge-count');
    if (badge) {
      badge.textContent = this.state.favorites.length;
    }
  },

  isCurrentLocationFavorite() {
    if (!this.state.location) return false;
    const currentName = (this.state.location.name || '').toLowerCase();
    return this.state.favorites.find(f => 
      f.name.toLowerCase() === currentName || 
      (Math.abs(f.latitude - this.state.location.latitude) < 0.05 && 
       Math.abs(f.longitude - this.state.location.longitude) < 0.05)
    );
  },

  updateFavButtonState() {
    const favIcon = document.getElementById('fav-current-icon');
    const favBtn = document.getElementById('fav-current-btn');
    if (!favIcon || !favBtn) return;

    const fav = this.isCurrentLocationFavorite();
    if (fav) {
      favIcon.setAttribute('fill', 'currentColor');
      favIcon.classList.add('text-amber-400');
      favBtn.classList.add('border-amber-400/40', 'bg-amber-400/20');
      favBtn.title = 'Remove from MongoDB Favorites';
    } else {
      favIcon.removeAttribute('fill');
      favIcon.classList.remove('text-amber-400');
      favBtn.classList.remove('border-amber-400/40', 'bg-amber-400/20');
      favBtn.title = 'Save to MongoDB Favorites';
    }
    if (window.lucide) window.lucide.createIcons();
  },

  async toggleCurrentFavorite() {
    if (!this.state.location) return;
    const existing = this.isCurrentLocationFavorite();

    try {
      if (existing) {
        // Remove from MongoDB
        await DatabaseAPI.removeFavorite(existing._id);
        this.state.favorites = this.state.favorites.filter(f => f._id !== existing._id);
      } else {
        // Add to MongoDB
        const newFav = await DatabaseAPI.addFavorite({
          name: this.state.location.name,
          country: this.state.location.country || '',
          latitude: this.state.location.latitude,
          longitude: this.state.location.longitude,
          moodTag: this.state.mood ? this.state.mood.id : 'radiant'
        });
        if (newFav && newFav._id) {
          this.state.favorites.unshift(newFav);
        }
      }
      this.updateFavoritesCountBadge();
      this.updateFavButtonState();
      this.renderFavoritesList();
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Could not update favorite in MongoDB. Please check server connection.');
    }
  },

  openFavoritesModal() {
    const modal = document.getElementById('favorites-modal');
    if (!modal) return;
    this.renderFavoritesList();
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  },

  closeFavoritesModal() {
    const modal = document.getElementById('favorites-modal');
    if (modal) modal.classList.add('hidden');
  },

  renderFavoritesList() {
    const container = document.getElementById('favorites-list-container');
    if (!container) return;

    if (!this.state.favorites || this.state.favorites.length === 0) {
      container.innerHTML = `
        <div class="py-8 text-center text-slate-400 text-sm">
          <i data-lucide="star-off" class="w-8 h-8 mx-auto mb-2 opacity-40"></i>
          <p class="font-medium">No favorite locations saved yet.</p>
          <p class="text-xs text-slate-500 mt-1">Click the star icon next to any city to save it to MongoDB Atlas.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = this.state.favorites.map(fav => `
      <div class="flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 transition-colors group">
        <div class="flex items-center gap-3 cursor-pointer flex-grow select-location-btn" data-lat="${fav.latitude}" data-lon="${fav.longitude}" data-name="${fav.name}" data-country="${fav.country}">
          <div class="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-105 transition-transform">
            <i data-lucide="map-pin" class="w-4 h-4"></i>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">${fav.name}</h4>
            <p class="text-xs text-slate-400">${fav.country || 'Global'}</p>
          </div>
        </div>
        <button class="delete-fav-btn p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all" data-id="${fav._id}" title="Delete from MongoDB">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `).join('');

    // Attach listeners
    container.querySelectorAll('.select-location-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectLocation({
          name: btn.dataset.name,
          country: btn.dataset.country,
          latitude: parseFloat(btn.dataset.lat),
          longitude: parseFloat(btn.dataset.lon)
        });
        this.closeFavoritesModal();
      });
    });

    container.querySelectorAll('.delete-fav-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        try {
          await DatabaseAPI.removeFavorite(id);
          this.state.favorites = this.state.favorites.filter(f => f._id !== id);
          this.updateFavoritesCountBadge();
          this.updateFavButtonState();
          this.renderFavoritesList();
        } catch (err) {
          console.error('Failed to delete favorite:', err);
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  },

  openJournalModal() {
    const modal = document.getElementById('journal-modal');
    if (!modal) return;

    // Update current context in form
    const currentMoodTag = document.getElementById('journal-current-mood-tag');
    const currentCityTag = document.getElementById('journal-current-city-tag');
    if (currentMoodTag && this.state.mood) {
      currentMoodTag.textContent = `${this.state.mood.emoji || ''} ${this.state.mood.name}`;
    }
    if (currentCityTag && this.state.location) {
      currentCityTag.textContent = `${this.state.location.name}, ${this.state.location.country || ''}`;
    }

    this.loadMoodLogs();
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  },

  closeJournalModal() {
    const modal = document.getElementById('journal-modal');
    if (modal) modal.classList.add('hidden');
  },

  async loadMoodLogs() {
    try {
      this.state.moodLogs = await DatabaseAPI.getMoodLogs();
      this.renderMoodLogsList();
    } catch (e) {
      console.warn('Failed to load mood logs:', e);
    }
  },

  renderMoodLogsList() {
    const container = document.getElementById('journal-logs-container');
    if (!container) return;

    if (!this.state.moodLogs || this.state.moodLogs.length === 0) {
      container.innerHTML = `
        <div class="py-8 text-center text-slate-400 text-sm">
          <i data-lucide="feather" class="w-8 h-8 mx-auto mb-2 opacity-40"></i>
          <p class="font-medium">No mood reflections recorded yet.</p>
          <p class="text-xs text-slate-500 mt-1">Write how this weather makes you feel and save it to MongoDB Atlas.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    container.innerHTML = this.state.moodLogs.map(log => {
      const dateStr = new Date(log.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      return `
        <div class="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex items-start justify-between gap-3">
          <div class="flex-grow">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-semibold">
                ${log.moodName}
              </span>
              <span class="text-xs text-slate-400 flex items-center gap-1">
                <i data-lucide="map-pin" class="w-3 h-3 text-slate-500"></i> ${log.cityName}
              </span>
              ${log.temperatureC !== null && log.temperatureC !== undefined ? `
                <span class="text-xs text-slate-400 font-mono">${log.temperatureC}°C</span>
              ` : ''}
              <span class="text-[10px] text-slate-500 ml-auto">${dateStr}</span>
            </div>
            ${log.note ? `<p class="text-xs text-slate-200 mt-1.5 leading-relaxed bg-black/20 p-2 rounded-xl italic">“${log.note}”</p>` : ''}
          </div>
          <button class="delete-log-btn p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0" data-id="${log._id}" title="Delete log">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.delete-log-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        try {
          await DatabaseAPI.removeMoodLog(id);
          this.state.moodLogs = this.state.moodLogs.filter(l => l._id !== id);
          this.renderMoodLogsList();
        } catch (err) {
          console.error('Failed to delete mood log:', err);
        }
      });
    });

    if (window.lucide) window.lucide.createIcons();
  },

  async handleMoodJournalSubmit(e) {
    e.preventDefault();
    const noteInput = document.getElementById('journal-note-input');
    const note = noteInput ? noteInput.value.trim() : '';

    if (!this.state.mood || !this.state.location) {
      alert('Weather data is still loading.');
      return;
    }

    const payload = {
      moodId: this.state.mood.id,
      moodName: this.state.mood.name,
      cityName: this.state.location.name,
      country: this.state.location.country || '',
      temperatureC: this.state.weather && this.state.weather.current ? this.state.weather.current.tempC : null,
      weatherDescription: this.state.mood.name + ' Weather',
      note: note
    };

    const submitBtn = document.getElementById('save-journal-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i> Saving...`;
    }

    try {
      const saved = await DatabaseAPI.addMoodLog(payload);
      if (noteInput) noteInput.value = '';
      if (saved && saved._id) {
        this.state.moodLogs.unshift(saved);
      } else {
        await this.loadMoodLogs();
      }
      this.renderMoodLogsList();
    } catch (err) {
      console.error('Error saving mood log:', err);
      alert('Failed to save mood log to MongoDB.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="save" class="w-3.5 h-3.5"></i> Save Entry`;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

