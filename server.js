require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, mongoose } = require('./db');
const Favorite = require('./models/Favorite');
const MoodLog = require('./models/MoodLog');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend assets
app.use(express.static(path.join(__dirname)));

// Health check endpoint with database status
app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    status: 'healthy',
    app: 'AuraCast',
    version: '1.0.0',
    uptime: Math.floor(process.uptime()),
    database: {
      status: dbStatusMap[dbReady] || 'unknown',
      connected: dbReady === 1,
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },
    timestamp: new Date().toISOString(),
  });
});

// Database status & metrics
app.get('/api/db/status', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let counts = { favorites: 0, moodLogs: 0 };

    if (isConnected) {
      counts.favorites = await Favorite.countDocuments();
      counts.moodLogs = await MoodLog.countDocuments();
    }

    res.json({
      connected: isConnected,
      host: mongoose.connection.host || 'none',
      database: mongoose.connection.name || 'none',
      collections: counts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- FAVORITES API (MongoDB) ---

// Get all saved favorite locations
app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await Favorite.find().sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add a location to favorites
app.post('/api/favorites', async (req, res) => {
  const { name, country, latitude, longitude, admin1, moodTag } = req.body;

  if (!name || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Name, latitude, and longitude are required' });
  }

  try {
    // Check if already favorited (within tiny coordinate threshold or matching name)
    const existing = await Favorite.findOne({
      $or: [
        { latitude, longitude },
        { name: new RegExp(`^${name.trim()}$`, 'i'), country: country || '' }
      ]
    });

    if (existing) {
      return res.status(409).json({ message: 'Location already in favorites', favorite: existing });
    }

    const favorite = new Favorite({
      name: name.trim(),
      country: (country || '').trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      admin1: (admin1 || '').trim(),
      moodTag: moodTag || 'radiant'
    });

    const saved = await favorite.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error saving favorite:', error);
    res.status(500).json({ error: 'Failed to save favorite' });
  }
});

// Delete a location from favorites
app.delete('/api/favorites/:id', async (req, res) => {
  try {
    const deleted = await Favorite.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.json({ message: 'Favorite deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
});

// --- MOOD JOURNAL LOGS API (MongoDB) ---

// Get recent mood logs
app.get('/api/mood-logs', async (req, res) => {
  try {
    const logs = await MoodLog.find().sort({ createdAt: -1 }).limit(30);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    res.status(500).json({ error: 'Failed to fetch mood logs' });
  }
});

// Create a mood log entry
app.post('/api/mood-logs', async (req, res) => {
  const { moodId, moodName, cityName, country, temperatureC, weatherDescription, note } = req.body;

  if (!moodId || !moodName || !cityName) {
    return res.status(400).json({ error: 'moodId, moodName, and cityName are required' });
  }

  try {
    const log = new MoodLog({
      moodId,
      moodName,
      cityName,
      country: country || '',
      temperatureC: temperatureC !== undefined ? Number(temperatureC) : null,
      weatherDescription: weatherDescription || '',
      note: note || '',
    });

    const saved = await log.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error saving mood log:', error);
    res.status(500).json({ error: 'Failed to save mood log' });
  }
});

// Delete a mood log entry
app.delete('/api/mood-logs/:id', async (req, res) => {
  try {
    const deleted = await MoodLog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Mood log not found' });
    }
    res.json({ message: 'Mood log deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting mood log:', error);
    res.status(500).json({ error: 'Failed to delete mood log' });
  }
});

// Weather API proxy endpoint
app.get('/api/weather', async (req, res) => {
  const { latitude, longitude } = req.query;
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'latitude and longitude are required query parameters' });
  }

  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
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
      forecast_days: '7'
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Weather Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data from provider' });
  }
});

// Geocoding API proxy endpoint
app.get('/api/geocode', async (req, res) => {
  const { name } = req.query;
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'City name must be at least 2 characters' });
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name.trim())}&count=6&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding returned status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Geocoding Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch geocoding data' });
  }
});

// Fallback to index.html for any SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ AuraCast server running at http://localhost:${PORT}`);
  console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
});
