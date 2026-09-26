/**
 * AuraCast: Mood Mapping Engine (React Service)
 * Translates meteorological parameters into rich emotional, psychological, and visual mood states.
 */

export const MOODS = {
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
    auraEffect: 'Crimson Rose Shimmer',
    palette: ['#ef4444', '#f87171', '#dc2626', '#b91c1c'],
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
    auraEffect: 'Ruby Petrichor Pulse',
    palette: ['#ef4444', '#f43f5e', '#e11d48', '#991b1b'],
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
    palette: ['#f87171', '#ef4444', '#991b1b', '#7f1d1d'],
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
    auraEffect: 'Electric Crimson Spark',
    palette: ['#f43f5e', '#fb7185', '#ef4444', '#7f1d1d'],
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
    auraEffect: 'Frost Crimson Glow',
    palette: ['#f87171', '#ef4444', '#fca5a5', '#dc2626'],
    particleType: 'snow',
    soundtrack: 'Subtle Hearth Fire & Whispering Wind',
    musicSuggestion: 'Warm Acoustic Folk / Ambient Strings'
  }
};

/**
 * Translates weather parameters into a specific mood profile.
 */
export function evaluateMood(params = {}) {
  const {
    wmoCode = 0,
    temperatureC = 22,
    windSpeed = 10,
    humidity = 50,
    precipitation = 0,
    isDay = 1
  } = params;

  // 1. Thunderstorms / Severe conditions
  if ([95, 96, 99].includes(wmoCode) || (windSpeed > 45 && precipitation > 5)) {
    return MOODS.STORMY;
  }

  // 2. Snow / Freezing conditions
  if ([71, 73, 75, 77, 85, 86].includes(wmoCode) || (temperatureC <= 0 && precipitation > 0)) {
    return MOODS.TRANQUIL;
  }

  // 3. Rain / Drizzle / Showers
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(wmoCode) || precipitation > 0.4) {
    return MOODS.COZY;
  }

  // 4. Fog / Overcast / Thick Cloud
  if ([3, 45, 48].includes(wmoCode) || (wmoCode === 2 && humidity > 85)) {
    return MOODS.GLOOMY;
  }

  // 5. Sunny / Clear Skies
  if ([0, 1].includes(wmoCode)) {
    if (temperatureC >= 18) {
      return MOODS.RADIANT;
    } else {
      return MOODS.SERENE;
    }
  }

  // 6. Partly Cloudy / Mild
  if ([2].includes(wmoCode)) {
    if (temperatureC >= 24) {
      return MOODS.RADIANT;
    }
    return MOODS.SERENE;
  }

  // Fallback based on temperature
  if (temperatureC < 8) return MOODS.TRANQUIL;
  if (temperatureC > 25) return MOODS.RADIANT;
  return MOODS.SERENE;
}

/**
 * Get WMO Code descriptive label and Lucide icon name
 */
export function getWeatherDescription(wmoCode, isDay = 1) {
  const codeMap = {
    0: { text: 'Clear Sky', icon: isDay ? 'Sun' : 'Moon' },
    1: { text: 'Mainly Clear', icon: isDay ? 'Sun' : 'Moon' },
    2: { text: 'Partly Cloudy', icon: isDay ? 'CloudSun' : 'CloudMoon' },
    3: { text: 'Overcast', icon: 'Cloud' },
    45: { text: 'Foggy', icon: 'CloudFog' },
    48: { text: 'Depositing Rime Fog', icon: 'CloudFog' },
    51: { text: 'Light Drizzle', icon: 'CloudDrizzle' },
    53: { text: 'Moderate Drizzle', icon: 'CloudDrizzle' },
    55: { text: 'Dense Drizzle', icon: 'CloudRain' },
    56: { text: 'Freezing Drizzle', icon: 'CloudSnow' },
    57: { text: 'Dense Freezing Drizzle', icon: 'CloudSnow' },
    61: { text: 'Slight Rain', icon: 'CloudRain' },
    63: { text: 'Moderate Rain', icon: 'CloudRain' },
    65: { text: 'Heavy Rain', icon: 'CloudRain' },
    66: { text: 'Light Freezing Rain', icon: 'CloudSnow' },
    67: { text: 'Heavy Freezing Rain', icon: 'CloudSnow' },
    71: { text: 'Slight Snow Fall', icon: 'Snowflake' },
    73: { text: 'Moderate Snow Fall', icon: 'Snowflake' },
    75: { text: 'Heavy Snow Fall', icon: 'Snowflake' },
    77: { text: 'Snow Grains', icon: 'Snowflake' },
    80: { text: 'Slight Rain Showers', icon: 'CloudRain' },
    81: { text: 'Moderate Rain Showers', icon: 'CloudRain' },
    82: { text: 'Violent Rain Showers', icon: 'CloudRain' },
    85: { text: 'Slight Snow Showers', icon: 'Snowflake' },
    86: { text: 'Heavy Snow Showers', icon: 'Snowflake' },
    95: { text: 'Thunderstorm', icon: 'CloudLightning' },
    96: { text: 'Thunderstorm with Slight Hail', icon: 'CloudLightning' },
    99: { text: 'Thunderstorm with Heavy Hail', icon: 'CloudLightning' },
  };

  return codeMap[wmoCode] || { text: 'Fair Weather', icon: 'Sun' };
}
