const path = require('path');
const fs = require('fs');

// Load .env from root or local
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB, mongoose } = require('./db');
const User = require('./models/User');
const Favorite = require('./models/Favorite');
const MoodLog = require('./models/MoodLog');
const { protect, optionalAuth, generateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve frontend production dist path
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
const localDistPath = path.join(__dirname, 'dist');
const distPath = fs.existsSync(frontendDistPath) ? frontendDistPath : localDistPath;

// Connect to MongoDB Atlas
connectDB();

// --- BULLETPROOF CORS CONFIGURATION ---
const allowedOrigins = [
  'https://aura-casst.vercel.app',
  'https://auracasst.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      // Check allowed list or Vercel / Render deployment subdomains
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com') ||
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }

      // Permissive fallback so production never breaks due to origin mismatches
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  })
);

// Explicit OPTIONS preflight handling for all routes
app.options('*', cors());

app.use(express.json());

// Serve static frontend assets
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  const frontendPath = path.join(__dirname, '..', 'frontend');
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
  } else {
    app.use(express.static(path.join(__dirname)));
  }
}

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
    cors: {
      allowedOrigins,
    },
    timestamp: new Date().toISOString(),
  });
});

// Database status & metrics
app.get('/api/db/status', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    let counts = { users: 0, favorites: 0, moodLogs: 0 };

    if (isConnected) {
      counts.users = await User.countDocuments();
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

// =========================================================================
// --- AUTHENTICATION API (JWT + BCRYPT) ---
// =========================================================================

// @route   POST /api/auth/register
// @desc    Register a new user & return JWT token
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: error.message || 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT token
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password' });
    }

    // Find user by email and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: error.message || 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile from JWT
app.get('/api/auth/me', protect, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// =========================================================================
// --- FAVORITES API (MongoDB + Optional Auth) ---
// =========================================================================

// Get all saved favorite locations (for current user, or global if guest)
app.get('/api/favorites', optionalAuth, async (req, res) => {
  try {
    let query = {};
    if (req.user) {
      // Return favorites saved by this user OR unassigned favorites
      query = { $or: [{ user: req.user._id }, { user: null }] };
    }

    const favorites = await Favorite.find(query).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add a location to favorites
app.post('/api/favorites', optionalAuth, async (req, res) => {
  const { name, country, latitude, longitude, admin1, moodTag } = req.body;

  if (!name || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: 'Name, latitude, and longitude are required' });
  }

  try {
    const userId = req.user ? req.user._id : null;

    // Check if already favorited by this user
    const existing = await Favorite.findOne({
      user: userId,
      $or: [
        { latitude, longitude },
        { name: new RegExp(`^${name.trim()}$`, 'i'), country: country || '' }
      ]
    });

    if (existing) {
      return res.status(409).json({ message: 'Location already in favorites', favorite: existing });
    }

    const favorite = new Favorite({
      user: userId,
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
app.delete('/api/favorites/:id', optionalAuth, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user) {
      query.$or = [{ user: req.user._id }, { user: null }];
    }

    const deleted = await Favorite.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ error: 'Favorite not found or unauthorized' });
    }
    res.json({ message: 'Favorite deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
});

// =========================================================================
// --- MOOD JOURNAL LOGS API (MongoDB + Optional Auth) ---
// =========================================================================

// Get recent mood logs
app.get('/api/mood-logs', optionalAuth, async (req, res) => {
  try {
    let query = {};
    if (req.user) {
      query = { $or: [{ user: req.user._id }, { user: null }] };
    }

    const logs = await MoodLog.find(query).sort({ createdAt: -1 }).limit(30);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching mood logs:', error);
    res.status(500).json({ error: 'Failed to fetch mood logs' });
  }
});

// Create a mood log entry
app.post('/api/mood-logs', optionalAuth, async (req, res) => {
  const { moodId, moodName, cityName, country, temperatureC, weatherDescription, note } = req.body;

  if (!moodId || !moodName || !cityName) {
    return res.status(400).json({ error: 'moodId, moodName, and cityName are required' });
  }

  try {
    const log = new MoodLog({
      user: req.user ? req.user._id : null,
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
app.delete('/api/mood-logs/:id', optionalAuth, async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user) {
      query.$or = [{ user: req.user._id }, { user: null }];
    }

    const deleted = await MoodLog.findOneAndDelete(query);
    if (!deleted) {
      return res.status(404).json({ error: 'Mood log not found or unauthorized' });
    }
    res.json({ message: 'Mood log deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('Error deleting mood log:', error);
    res.status(500).json({ error: 'Failed to delete mood log' });
  }
});

// =========================================================================
// --- WEATHER & GEOCODING PROXIES ---
// =========================================================================

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
  const distIndex = path.join(distPath, 'index.html');
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  const frontendIndex = path.join(__dirname, '..', 'frontend', 'index.html');
  if (fs.existsSync(frontendIndex)) {
    return res.sendFile(frontendIndex);
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✨ AuraCast server running at http://localhost:${PORT}`);
  console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
});
