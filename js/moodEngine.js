/**
 * AuraCast: Mood Mapping Engine
 * Translates meteorological parameters (WMO codes, temperature, wind, humidity, precipitation)
 * into rich emotional, psychological, and visual mood states.
 */

const MoodEngine = {
  // Available mood archetypes
  MOODS: {
    RADIANT: {
      id: 'radiant',
      name: 'Radiant',
      emoji: '☀️',
      vibe: 'Energized, Vibrant & Full of Life',
      description: 'Golden sunbeams awaken natural dopamine, sharpening focus and inviting spontaneous exploration.',
      activity: 'Go for an outdoor walk, soak in natural Vitamin D, or start a creative brainstorm.',
      auraEffect: 'Golden Solar Halo',
      palette: ['#fb923c', '#facc15', '#f87171', '#ea580c'],
      particleType: 'sunbeams',
      soundtrack: 'Summer Breeze & Chirping Birds',
      musicSuggestion: 'Upbeat Indie Pop / Acoustic Sunshine'
    },
    SERENE: {
      id: 'serene',
      name: 'Serene',
      emoji: '🌤️',
      vibe: 'Calm, Balanced & Mindful',
      description: 'Soft diffused daylight and gentle atmospheric pressure nurture deep clarity and inner peace.',
      activity: 'Ideal for deep work, mindful meditation, stretching, or sipping green tea.',
      auraEffect: 'Azure Pastel Shimmer',
      palette: ['#38bdf8', '#2dd4bf', '#818cf8', '#0284c7'],
      particleType: 'floating_orbs',
      soundtrack: 'Soft Wind Chimes & Gentle Breeze',
      musicSuggestion: 'Ambient Chillout / Neo-Classical Piano'
    },
    COZY: {
      id: 'cozy',
      name: 'Cozy',
      emoji: '🌧️',
      vibe: 'Introspective, Nostalgic & Comforting',
      description: 'Rhythmic petrichor and falling raindrops create a natural acoustic cocoon for deep comfort.',
      activity: 'Curl up with a good book, brew hot coffee, listen to acoustic tunes, or journal.',
      auraEffect: 'Indigo Petrichor Pulse',
      palette: ['#818cf8', '#38bdf8', '#c084fc', '#4f46e5'],
      particleType: 'rain',
      soundtrack: 'Gentle Rain on Window & Lo-Fi Beats',
      musicSuggestion: 'Lo-Fi Chill Beats / Cozy Acoustic Jazz'
    },
    GLOOMY: {
      id: 'gloomy',
      name: 'Gloomy',
      emoji: '🌫️',
      vibe: 'Quiet, Reflective & Contemplative',
      description: 'Muted skies and diffused monochromatic lighting evoke calm introspection and tranquil solitude.',
      activity: 'Dim ambient lights, organize thoughts, sketch, or enjoy a warm bowl of soup.',
      auraEffect: 'Misty Slate Drift',
      palette: ['#94a3b8', '#cbd5e1', '#64748b', '#475569'],
      particleType: 'mist',
      soundtrack: 'Ambient Drone & Soft Fog Whispers',
      musicSuggestion: 'Deep Drone / Ambient Electronic Soundscapes'
    },
    STORMY: {
      id: 'stormy',
      name: 'Stormy',
      emoji: '⛈️',
      vibe: 'Intense, Dramatic & Charged',
      description: 'High electrostatic energy and booming skies stir adrenaline, awakening bold focus.',
      activity: 'Stay safely sheltered, tackle ambitious creative challenges, or listen to cinematic audio.',
      auraEffect: 'Electric Violet Spark',
      palette: ['#c084fc', '#f472b6', '#60a5fa', '#7e22ce'],
      particleType: 'storm',
      soundtrack: 'Rolling Thunder & Distant Lightning',
      musicSuggestion: 'Cinematic Orchestral / Electronic Synthwave'
    },
    TRANQUIL: {
      id: 'tranquil',
      name: 'Tranquil',
      emoji: '❄️',
      vibe: 'Crisp, Pure & Still',
      description: 'Soft crystal precipitation muffles external noise, bestowing profound stillness.',
      activity: 'Wrap in a warm knit blanket, enjoy rich hot cocoa, or watch snow drift gently.',
      auraEffect: 'Icy Diamond Glow',
      palette: ['#7dd3fc', '#e0e7ff', '#a5f3fc', '#0284c7'],
      particleType: 'snow',
      soundtrack: 'Subtle Hearth Fire & Whispering Wind',
      musicSuggestion: 'Warm Acoustic Folk / Ambient Strings'
    }
  },

  /**
   * Translates weather parameters into a specific mood profile.
   * @param {Object} params - Weather metrics
   * @param {number} params.wmoCode - WMO Weather interpretation code
   * @param {number} params.temperatureC - Temperature in Celsius
   * @param {number} params.windSpeed - Wind speed in km/h
   * @param {number} params.humidity - Humidity percentage (0-100)
   * @param {number} params.precipitation - Precipitation amount (mm)
   * @param {boolean} params.isDay - Day (1) or Night (0)
   * @returns {Object} Full mood archetype object
   */
  evaluateMood(params) {
    const { wmoCode = 0, temperatureC = 22, windSpeed = 10, humidity = 50, precipitation = 0, isDay = 1 } = params;

    // 1. Thunderstorms / Severe conditions
    if ([95, 96, 99].includes(wmoCode) || (windSpeed > 45 && precipitation > 5)) {
      return this.MOODS.STORMY;
    }

    // 2. Snow / Freezing conditions
    if ([71, 73, 75, 77, 85, 86].includes(wmoCode) || (temperatureC <= 0 && precipitation > 0)) {
      return this.MOODS.TRANQUIL;
    }

    // 3. Rain / Drizzle / Showers
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(wmoCode) || precipitation > 0.4) {
      return this.MOODS.COZY;
    }

    // 4. Fog / Overcast / Thick Cloud
    if ([3, 45, 48].includes(wmoCode) || (wmoCode === 2 && humidity > 85)) {
      return this.MOODS.GLOOMY;
    }

    // 5. Sunny / Clear Skies
    if ([0, 1].includes(wmoCode)) {
      if (temperatureC >= 18) {
        return this.MOODS.RADIANT;
      } else {
        return this.MOODS.SERENE;
      }
    }

    // 6. Partly Cloudy / Mild
    if ([2].includes(wmoCode)) {
      if (temperatureC >= 24) {
        return this.MOODS.RADIANT;
      }
      return this.MOODS.SERENE;
    }

    // Fallback based on temperature
    if (temperatureC < 8) return this.MOODS.TRANQUIL;
    if (temperatureC > 25) return this.MOODS.RADIANT;
    return this.MOODS.SERENE;
  },

  /**
   * Get WMO Code descriptive label and icon
   */
  getWeatherDescription(wmoCode, isDay = 1) {
    const codeMap = {
      0: { text: 'Clear Sky', icon: isDay ? 'sun' : 'moon' },
      1: { text: 'Mainly Clear', icon: isDay ? 'sun' : 'moon' },
      2: { text: 'Partly Cloudy', icon: isDay ? 'cloud-sun' : 'cloud-moon' },
      3: { text: 'Overcast', icon: 'cloud' },
      45: { text: 'Foggy', icon: 'cloud-fog' },
      48: { text: 'Depositing Rime Fog', icon: 'cloud-fog' },
      51: { text: 'Light Drizzle', icon: 'cloud-drizzle' },
      53: { text: 'Moderate Drizzle', icon: 'cloud-drizzle' },
      55: { text: 'Dense Drizzle', icon: 'cloud-rain' },
      56: { text: 'Freezing Drizzle', icon: 'cloud-snow' },
      57: { text: 'Dense Freezing Drizzle', icon: 'cloud-snow' },
      61: { text: 'Slight Rain', icon: 'cloud-rain' },
      63: { text: 'Moderate Rain', icon: 'cloud-rain' },
      65: { text: 'Heavy Rain', icon: 'cloud-rain' },
      66: { text: 'Light Freezing Rain', icon: 'cloud-snow' },
      67: { text: 'Heavy Freezing Rain', icon: 'cloud-snow' },
      71: { text: 'Slight Snow Fall', icon: 'snowflake' },
      73: { text: 'Moderate Snow Fall', icon: 'snowflake' },
      75: { text: 'Heavy Snow Fall', icon: 'snowflake' },
      77: { text: 'Snow Grains', icon: 'snowflake' },
      80: { text: 'Slight Rain Showers', icon: 'cloud-rain' },
      81: { text: 'Moderate Rain Showers', icon: 'cloud-rain' },
      82: { text: 'Violent Rain Showers', icon: 'cloud-rain' },
      85: { text: 'Slight Snow Showers', icon: 'snowflake' },
      86: { text: 'Heavy Snow Showers', icon: 'snowflake' },
      95: { text: 'Thunderstorm', icon: 'cloud-lightning' },
      96: { text: 'Thunderstorm with Slight Hail', icon: 'cloud-lightning' },
      99: { text: 'Thunderstorm with Heavy Hail', icon: 'cloud-lightning' },
    };

    return codeMap[wmoCode] || { text: 'Fair Weather', icon: 'sun' };
  }
};

