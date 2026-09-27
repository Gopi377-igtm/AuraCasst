/**
 * AuraCast: Weather & Geocoding API Service (React Service)
 */

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export const WeatherAPI = {
  /**
   * Search for cities by query string or coordinate pair
   */
  async searchCities(cityName) {
    if (!cityName || cityName.trim().length < 2) return [];

    const trimmed = cityName.trim();

    // Check if query is coordinates (e.g. "16.5074, 80.6466")
    const coordMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        const meta = await this.reverseGeocode(lat, lon);
        return [
          {
            id: `coords-${lat}-${lon}`,
            name: meta.name,
            country: meta.country || '',
            admin1: meta.admin1 || '',
            latitude: lat,
            longitude: lon,
            timezone: 'auto',
            displayName: meta.displayName || `${meta.name}, ${meta.country}`
          }
        ];
      }
    }

    try {
      const url = `${GEOCODING_URL}?name=${encodeURIComponent(trimmed)}&count=6&language=en&format=json`;
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
   * Reverse geocode coordinates to City Name using BigDataCloud with OpenStreetMap Nominatim fallback
   */
  async reverseGeocode(lat, lon) {
    // 1. Try BigDataCloud Client Reverse Geocode (free, high-speed, client CORS allowed)
    try {
      const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const response = await fetch(bdcUrl);
      if (response.ok) {
        const data = await response.json();
        const city =
          data.city ||
          data.locality ||
          data.principalSubdivision ||
          'Your Location';
        const country = data.countryName || '';
        const admin1 = data.principalSubdivision || '';
        return {
          name: city,
          country: country,
          admin1: admin1,
          displayName: `${city}${admin1 && admin1 !== city ? ', ' + admin1 : ''}${country ? ', ' + country : ''}`,
          latitude: lat,
          longitude: lon
        };
      }
    } catch (err) {
      console.warn('BigDataCloud reverse geocode error, attempting Nominatim:', err);
    }

    // 2. Fallback to OpenStreetMap Nominatim
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`;
      const response = await fetch(url, {
        headers: { Accept: 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.suburb ||
          address.county ||
          address.state ||
          'Your Location';
        const country = address.country || '';
        const admin1 = address.state || address.state_district || '';
        return {
          name: city,
          country: country,
          admin1: admin1,
          displayName: `${city}${country ? ', ' + country : ''}`,
          latitude: lat,
          longitude: lon
        };
      }
    } catch (err) {
      console.warn('Nominatim reverse geocode error:', err);
    }

    // 3. Fallback if both fail
    return {
      name: 'Current Location',
      country: '',
      admin1: '',
      displayName: 'Your Location',
      latitude: lat,
      longitude: lon
    };
  },

  /**
   * Fast IP-based Geolocation (requires zero browser permissions, instantaneous)
   */
  async getIPLocation() {
    // Strategy 1: ipwho.is (reliable, highly accurate, CORS-friendly)
    try {
      const res = await fetch('https://ipwho.is/', { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data.success !== false && data.latitude && data.longitude) {
          const city = data.city || data.region || 'Current Location';
          const country = data.country || '';
          const admin1 = data.region || '';
          return {
            name: city,
            country: country,
            admin1: admin1,
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            displayName: `${city}${country ? ', ' + country : ''}`,
            source: 'ip'
          };
        }
      }
    } catch (err) {
      console.warn('ipwho.is error, trying fallback:', err);
    }

    // Strategy 2: freeipapi.com
    try {
      const res = await fetch('https://freeipapi.com/api/json', { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          const city = data.cityName || data.regionName || 'Current Location';
          const country = data.countryName || '';
          const admin1 = data.regionName || '';
          return {
            name: city,
            country: country,
            admin1: admin1,
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            displayName: `${city}${country ? ', ' + country : ''}`,
            source: 'ip'
          };
        }
      }
    } catch (err) {
      console.warn('freeipapi.com error:', err);
    }

    return null;
  },

  /**
   * Browser Geolocation API promise wrapper
   */
  getBrowserPosition(options = { timeout: 8000, enableHighAccuracy: true }) {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return Promise.reject(new Error('Geolocation is not supported by your browser.'));
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (err) => reject(err),
        options
      );
    });
  },

  /**
   * Dual-strategy location detection:
   * Instantly fetches IP location to render real climate without waiting,
   * while simultaneously requesting high-accuracy browser GPS for pinpoint neighborhood precision.
   */
  async detectAccurateLocation(onFastLocationFound) {
    let resolved = false;

    // Fast IP lookup
    const ipPromise = this.getIPLocation()
      .then((ipLoc) => {
        if (ipLoc && !resolved && typeof onFastLocationFound === 'function') {
          onFastLocationFound(ipLoc);
        }
        return ipLoc;
      })
      .catch(() => null);

    // Browser Geolocation lookup
    const gpsPromise = (async () => {
      try {
        const coords = await this.getBrowserPosition();
        resolved = true;
        const meta = await this.reverseGeocode(coords.latitude, coords.longitude);
        return {
          name: meta.name || 'Current Location',
          country: meta.country || '',
          admin1: meta.admin1 || '',
          latitude: coords.latitude,
          longitude: coords.longitude,
          displayName: meta.displayName,
          source: 'gps'
        };
      } catch (err) {
        return null;
      }
    })();

    // Wait for GPS and IP promises
    const [gpsLoc, ipLoc] = await Promise.all([gpsPromise, ipPromise]);

    if (gpsLoc) return gpsLoc;
    if (ipLoc) return ipLoc;

    return null;
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
