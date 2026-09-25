/**
 * AuraCast: UI Rendering & Ambient Canvas Particle Engine
 */

const UI = {
  canvas: null,
  ctx: null,
  particles: [],
  animationFrameId: null,
  currentParticleType: 'sunbeams',

  /**
   * Initialize canvas and responsive resize listeners
   */
  initCanvas() {
    this.canvas = document.getElementById('weather-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.startParticleAnimation();
  },

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initParticles(this.currentParticleType);
  },

  /**
   * Initialize particle pool based on active mood theme
   */
  initParticles(type) {
    this.currentParticleType = type;
    this.particles = [];
    if (!this.canvas) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    switch (type) {
      case 'rain': {
        const count = Math.min(120, Math.floor(width / 12));
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 20 + 15,
            speed: Math.random() * 8 + 12,
            opacity: Math.random() * 0.4 + 0.3,
            color: '#a5b4fc'
          });
        }
        break;
      }
      case 'snow': {
        const count = Math.min(90, Math.floor(width / 15));
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1.5 + 0.8,
            sway: Math.random() * 2 - 1,
            swaySpeed: Math.random() * 0.02 + 0.01,
            swayOffset: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.6 + 0.3
          });
        }
        break;
      }
      case 'sunbeams': {
        const count = 18;
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 80 + 30,
            targetRadius: Math.random() * 90 + 40,
            growSpeed: (Math.random() * 0.02 + 0.005),
            phase: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.15 + 0.05
          });
        }
        break;
      }
      case 'mist': {
        const count = 16;
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 160 + 80,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.2,
            opacity: Math.random() * 0.08 + 0.03
          });
        }
        break;
      }
      case 'storm': {
        const count = Math.min(150, Math.floor(width / 10));
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 28 + 18,
            speed: Math.random() * 14 + 18,
            opacity: Math.random() * 0.5 + 0.35,
            slant: Math.random() * 4 + 3,
            color: '#c084fc'
          });
        }
        break;
      }
      case 'floating_orbs':
      default: {
        const count = 25;
        for (let i = 0; i < count; i++) {
          this.particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 24 + 8,
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: (Math.random() - 0.5) * 0.6,
            opacity: Math.random() * 0.25 + 0.1,
            color: ['#38bdf8', '#2dd4bf', '#818cf8'][Math.floor(Math.random() * 3)]
          });
        }
        break;
      }
    }
  },

  /**
   * Start main requestAnimationFrame loop for atmospheric canvas
   */
  startParticleAnimation() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    const render = () => {
      if (!this.ctx || !this.canvas) return;
      const width = this.canvas.width;
      const height = this.canvas.height;
      this.ctx.clearRect(0, 0, width, height);

      // Render based on active particle archetype
      if (this.currentParticleType === 'rain') {
        this.ctx.strokeStyle = '#93c5fd';
        this.ctx.lineWidth = 1.5;
        this.particles.forEach(p => {
          this.ctx.globalAlpha = p.opacity;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p.x - 2, p.y + p.length);
          this.ctx.stroke();

          p.y += p.speed;
          p.x -= 1;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * width;
          }
        });
      } else if (this.currentParticleType === 'storm') {
        this.ctx.strokeStyle = '#c084fc';
        this.ctx.lineWidth = 2;
        this.particles.forEach(p => {
          this.ctx.globalAlpha = p.opacity;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p.x - p.slant, p.y + p.length);
          this.ctx.stroke();

          p.y += p.speed;
          p.x -= p.slant;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * (width + 200);
          }
        });

        // Occasional thunder ambient flash
        if (Math.random() < 0.006) {
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          this.ctx.fillRect(0, 0, width, height);
        }
      } else if (this.currentParticleType === 'snow') {
        this.particles.forEach(p => {
          this.ctx.globalAlpha = p.opacity;
          this.ctx.fillStyle = '#ffffff';
          this.ctx.beginPath();
          this.ctx.arc(p.x + Math.sin(p.swayOffset) * 15, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fill();

          p.y += p.speed;
          p.swayOffset += p.swaySpeed;
          if (p.y > height + 5) {
            p.y = -5;
            p.x = Math.random() * width;
          }
        });
      } else if (this.currentParticleType === 'mist') {
        this.particles.forEach(p => {
          const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          gradient.addColorStop(0, `rgba(203, 213, 225, ${p.opacity})`);
          gradient.addColorStop(1, 'rgba(203, 213, 225, 0)');
          this.ctx.fillStyle = gradient;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < -p.radius) p.x = width + p.radius;
          if (p.x > width + p.radius) p.x = -p.radius;
        });
      } else if (this.currentParticleType === 'sunbeams') {
        this.particles.forEach(p => {
          p.phase += p.growSpeed;
          const currentRadius = p.radius + Math.sin(p.phase) * 20;
          const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
          gradient.addColorStop(0, `rgba(251, 191, 36, ${p.opacity})`);
          gradient.addColorStop(1, 'rgba(251, 146, 60, 0)');
          this.ctx.fillStyle = gradient;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
          this.ctx.fill();
        });
      } else {
        // floating_orbs
        this.particles.forEach(p => {
          this.ctx.globalAlpha = p.opacity;
          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          this.ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0 || p.x > width) p.speedX *= -1;
          if (p.y < 0 || p.y > height) p.speedY *= -1;
        });
      }

      this.ctx.globalAlpha = 1.0;
      this.animationFrameId = requestAnimationFrame(render);
    };

    this.animationFrameId = requestAnimationFrame(render);
  },

  /**
   * Apply mood theme to document & canvas
   */
  applyMoodTheme(mood) {
    document.body.setAttribute('data-mood', mood.id);
    this.initParticles(mood.particleType);

    // Update active state on simulator buttons
    document.querySelectorAll('.mood-pill-btn').forEach(btn => {
      if (btn.dataset.moodId === mood.id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  },

  /**
   * Format temperature based on unit
   */
  formatTemp(tempC, unit = 'C') {
    if (tempC === undefined || tempC === null) return '--';
    if (unit === 'F') {
      return Math.round((tempC * 9/5) + 32) + '°F';
    }
    return Math.round(tempC) + '°C';
  },

  /**
   * Render the complete weather & mood visualizer state
   */
  render(weatherData, locationData, mood, unit = 'C') {
    const { current, daily, hourly } = weatherData;
    const weatherInfo = MoodEngine.getWeatherDescription(current.wmoCode, current.isDay);

    // 1. Location & Time
    const locationEl = document.getElementById('location-name');
    if (locationEl) locationEl.textContent = locationData.name || 'Current Location';
    
    const countryEl = document.getElementById('location-country');
    if (countryEl) countryEl.textContent = locationData.country ? `• ${locationData.country}` : '';

    const dateEl = document.getElementById('current-date');
    if (dateEl) {
      const now = new Date();
      dateEl.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // 2. Weather Display
    const tempEl = document.getElementById('current-temp');
    if (tempEl) tempEl.textContent = this.formatTemp(current.tempC, unit);

    const feelsLikeEl = document.getElementById('feels-like-temp');
    if (feelsLikeEl) feelsLikeEl.textContent = `Feels like ${this.formatTemp(current.feelsLikeC, unit)}`;

    const conditionEl = document.getElementById('weather-condition-text');
    if (conditionEl) conditionEl.textContent = weatherInfo.text;

    // 3. Mood Card Details
    const moodBadge = document.getElementById('mood-badge');
    if (moodBadge) {
      moodBadge.innerHTML = `<span class="text-xl">${mood.emoji}</span> <span class="font-bold tracking-wide">${mood.name} Aura</span>`;
    }

    const moodVibeEl = document.getElementById('mood-vibe');
    if (moodVibeEl) moodVibeEl.textContent = mood.vibe;

    const moodDescEl = document.getElementById('mood-description');
    if (moodDescEl) moodDescEl.textContent = mood.description;

    const moodActivityEl = document.getElementById('mood-activity');
    if (moodActivityEl) moodActivityEl.textContent = mood.activity;

    const soundTrackEl = document.getElementById('soundtrack-name');
    if (soundTrackEl) soundTrackEl.textContent = mood.soundtrack;

    const musicGenreEl = document.getElementById('music-genre-name');
    if (musicGenreEl) musicGenreEl.textContent = mood.musicSuggestion;

    // 4. Color Palette Display
    const paletteContainer = document.getElementById('mood-palette-container');
    if (paletteContainer && mood.palette) {
      paletteContainer.innerHTML = mood.palette.map(color => `
        <div class="flex flex-col items-center gap-1.5 group cursor-pointer" onclick="navigator.clipboard.writeText('${color}')" title="Click to copy ${color}">
          <div class="w-8 h-8 md:w-9 md:h-9 rounded-full shadow-lg border border-white/20 transition-transform group-hover:scale-110" style="background-color: ${color}"></div>
          <span class="text-[10px] uppercase font-mono text-slate-300 opacity-75 group-hover:opacity-100">${color}</span>
        </div>
      `).join('');
    }

    // 5. Atmospheric Metrics
    const humidityEl = document.getElementById('metric-humidity');
    if (humidityEl) humidityEl.textContent = `${Math.round(current.humidity)}%`;

    const windEl = document.getElementById('metric-wind');
    if (windEl) windEl.textContent = `${Math.round(current.windSpeedKm)} km/h`;

    const uvIndexEl = document.getElementById('metric-uv');
    const todayUv = daily && daily[0] ? daily[0].uvIndex : 4;
    if (uvIndexEl) uvIndexEl.textContent = `${todayUv} UV`;

    const pressureEl = document.getElementById('metric-pressure');
    if (pressureEl) pressureEl.textContent = `${Math.round(current.pressureHpa)} hPa`;

    const cloudEl = document.getElementById('metric-cloud');
    if (cloudEl) cloudEl.textContent = `${current.cloudCover}%`;

    const precipEl = document.getElementById('metric-precip');
    if (precipEl) precipEl.textContent = `${(current.precipitationMm || 0).toFixed(1)} mm`;

    // 6. Hourly Forecast
    const hourlyContainer = document.getElementById('hourly-forecast-container');
    if (hourlyContainer && hourly) {
      hourlyContainer.innerHTML = hourly.map(item => {
        const itemDate = new Date(item.time);
        const hourFormatted = itemDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        const itemInfo = MoodEngine.getWeatherDescription(item.wmoCode, 1);

        return `
          <div class="flex-shrink-0 flex flex-col items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all w-24 text-center">
            <span class="text-xs text-slate-300 font-medium">${hourFormatted}</span>
            <div class="my-2 text-2xl">
              <i data-lucide="${itemInfo.icon}" class="w-6 h-6 text-amber-300 mx-auto"></i>
            </div>
            <span class="text-sm font-bold">${this.formatTemp(item.tempC, unit)}</span>
            <span class="text-[10px] text-slate-400 mt-1">${item.precipProb}% rain</span>
          </div>
        `;
      }).join('');
    }

    // 7. 5-Day Forecast
    const dailyContainer = document.getElementById('daily-forecast-container');
    if (dailyContainer && daily) {
      dailyContainer.innerHTML = daily.map((day, idx) => {
        const dayDate = new Date(day.date);
        const dayName = idx === 0 ? 'Today' : dayDate.toLocaleDateString('en-US', { weekday: 'short' });
        const dateFormatted = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayInfo = MoodEngine.getWeatherDescription(day.wmoCode, 1);
        const dayMood = MoodEngine.evaluateMood({
          wmoCode: day.wmoCode,
          temperatureC: day.maxTempC,
          precipitation: day.precipSum,
          windSpeed: 10
        });

        return `
          <div class="forecast-card flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
            <div class="w-24">
              <p class="font-bold text-sm text-white">${dayName}</p>
              <p class="text-[11px] text-slate-400">${dateFormatted}</p>
            </div>
            
            <div class="flex items-center gap-3">
              <i data-lucide="${dayInfo.icon}" class="w-6 h-6 text-sky-300"></i>
              <span class="text-xs text-slate-300 hidden sm:inline-block w-28 truncate">${dayInfo.text}</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 text-xs rounded-full bg-white/10 border border-white/10 font-medium text-slate-200">
                ${dayMood.emoji} ${dayMood.name}
              </span>
            </div>

            <div class="text-right w-24">
              <span class="font-bold text-sm text-white">${this.formatTemp(day.maxTempC, unit)}</span>
              <span class="text-xs text-slate-400 ml-1.5">${this.formatTemp(day.minTempC, unit)}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    // Refresh lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  /**
   * Render Recent Search Location Chips
   */
  renderRecentSearches(historyList, onSelect) {
    const container = document.getElementById('recent-searches-container');
    if (!container) return;

    if (!historyList || historyList.length === 0) {
      container.innerHTML = '<span class="text-xs text-slate-400 italic">No recent searches yet.</span>';
      return;
    }

    container.innerHTML = historyList.map(item => `
      <button class="recent-city-chip text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 text-slate-200 transition-all flex items-center gap-1.5" data-name="${item.name}" data-lat="${item.latitude}" data-lon="${item.longitude}">
        <i data-lucide="map-pin" class="w-3 h-3 text-sky-400"></i>
        <span>${item.name}</span>
      </button>
    `).join('');

    // Attach click handlers
    container.querySelectorAll('.recent-city-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = historyList.find(h => h.name === btn.dataset.name);
        if (item && onSelect) onSelect(item);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }
};

