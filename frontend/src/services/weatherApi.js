/**
 * AuraCast: Weather & Geocoding API Service (React Service)
 */

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export const WeatherAPI = {
  /**
   * Search for cities by query string
   */
  async searchCities(cityName) {
    if (!cityName || cityName.trim().length < 2) return [];

    try {
      const url = `${GEOCODING_URL}?name=${encodeURIComponent(cityName.trim())}&count=6&language=en&format=json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Geocoding request failed');
      const data = await response.json();

      if (!data.results || data.results.length === 0) return [];

      return data.results.map((item) => ({
        id: item.id,
        name: item.name,
        country: item.country || '',
        admin1: item.admin1 || '',
        latitude: item.latitude,
        longitude: item.longitude,
        timezone: item.timezone || 'auto',
        displayName: `${item.name}${item.admin1 ? ', ' + item.admin1 : ''}, ${item.country || ''}`
      }));
    } catch (error) {
      console.warn('Geocoding API error:', error);
      return [];
    }
  },

  /**
   * Reverse geocode coordinates to City Name
   */
  async reverseGeocode(lat, lon) {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`;
      const response = await fetch(url, {
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Reverse geocode failed');
      const data = await response.json();

      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county ||
        'Your Location';
      const country = data.address.country || '';
      return {
        name: city,
        country: country,
        displayName: `${city}, ${country}`,
        latitude: lat,
        longitude: lon
      };
    } catch (err) {
      return {
        name: 'Detected Location',
        country: '',
        displayName: 'Your Location',
        latitude: lat,
        longitude: lon
      };
    }
  },

  /**
   * Fetch full weather forecast by coordinates
   */
  async getWeather(lat, lon) {
    try {
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'precipitation',
          'rain',
          'showers',
          'snowfall',
          'weather_code',
          'cloud_cover',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m'
        ].join(','),
        hourly: [
          'temperature_2m',
          'weather_code',
          'relative_humidity_2m',
          'precipitation_probability'
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'sunrise',
          'sunset',
          'uv_index_max',
          'precipitation_sum'
        ].join(','),
        timezone: 'auto',
        forecast_days: 7
      });

      const response = await fetch(`${FORECAST_URL}?${params.toString()}`);
      if (!response.ok) throw new Error('Weather forecast fetch failed');
      const data = await response.json();

      return this.formatWeatherData(data);
    } catch (error) {
      console.error('Weather API error:', error);
      throw error;
    }
  },

  /**
   * Normalize and organize Open-Meteo response
   */
  formatWeatherData(raw) {
    const current = raw.current;
    const daily = raw.daily;
    const hourly = raw.hourly;

    // Process daily forecast
    const dailyForecast = [];
    if (daily && daily.time) {
      for (let i = 0; i < Math.min(daily.time.length, 6); i++) {
        dailyForecast.push({
          date: daily.time[i],
          maxTempC: daily.temperature_2m_max[i],
          minTempC: daily.temperature_2m_min[i],
          wmoCode: daily.weather_code[i],
          uvIndex: daily.uv_index_max ? daily.uv_index_max[i] : 4,
          precipSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
          sunrise: daily.sunrise ? daily.sunrise[i] : '',
          sunset: daily.sunset ? daily.sunset[i] : ''
        });
      }
    }

    // Process hourly forecast (next 12 hours from current index)
    const hourlyForecast = [];
    if (hourly && hourly.time) {
      const now = new Date();
      let startIndex = hourly.time.findIndex((t) => new Date(t) >= now);
      if (startIndex === -1) startIndex = 0;

      for (let i = startIndex; i < Math.min(startIndex + 12, hourly.time.length); i++) {
        hourlyForecast.push({
          time: hourly.time[i],
          tempC: hourly.temperature_2m[i],
          wmoCode: hourly.weather_code[i],
          humidity: hourly.relative_humidity_2m[i],
          precipProb: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0
        });
      }
    }

    return {
      current: {
        tempC: current.temperature_2m,
        feelsLikeC: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        wmoCode: current.weather_code,
        isDay: current.is_day,
        windSpeedKm: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        pressureHpa: current.surface_pressure,
        cloudCover: current.cloud_cover,
        precipitationMm: current.precipitation + (current.rain || 0) + (current.showers || 0)
      },
      daily: dailyForecast,
      hourly: hourlyForecast,
      timezone: raw.timezone,
      elevation: raw.elevation
    };
  }
};
