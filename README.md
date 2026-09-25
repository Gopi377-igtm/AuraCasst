# AuraCast: Interactive Weather and Mood Visualizer

AuraCast is a full-stack web application built with **React 18**, **Vite**, **Express**, and **MongoDB Atlas** that bridges real-time meteorological data with emotional visual design. Rather than just displaying numeric data and static weather icons, AuraCast translates live atmospheric conditions into an expressive "mood palette" and dynamic ambient visualizer.

---

## 🌟 Features

- **React 18 & Vite Architecture**: Fast, modular frontend component design with Hot Module Replacement (HMR) and production bundling.
- **Live Weather Integration**: Real-time global weather data powered by Open-Meteo (zero API keys required, works right out of the box) with city search, auto-complete, and browser geolocation.
- **Mood Mapping Engine**: Translates weather parameters (temperature, precipitation, WMO condition codes, humidity, and wind) into 6 distinct mood states:
  - ☀️ **Radiant**: Clear, sunny, warm — Golden solar halo, energetic vibe
  - 🌤️ **Serene**: Partly cloudy, mild breeze — Azure pastel shimmer, mindful calm
  - 🌧️ **Cozy**: Rain, drizzle, showers — Indigo petrichor pulse, comforting acoustic mood
  - 🌫️ **Gloomy**: Overcast, mist, fog — Misty slate drift, quiet introspection
  - ⛈️ **Stormy**: Thunderstorms, squalls — Electric violet spark, intense adrenaline
  - ❄️ **Tranquil**: Snow, ice, freezing — Icy diamond glow, pure still solitude
- **Atmospheric Canvas Visualizer**: HTML5 Canvas engine dynamically renders animated raindrops, drifting snowflakes, sunbeams, misty haze, and floating aura orbs.
- **Tailwind CSS & Glassmorphism**: Built with modern Tailwind CSS utility classes, backdrop filters, glowing aura gradients, and responsive layouts across mobile, tablet, and desktop screens.
- **Mood Simulator Bar**: Allows instant preview and interactive testing of all 6 mood themes with a single click.
- **Synthesized Ambient Soundscapes**: Built-in Web Audio API synthesizer generates soothing real-time white noise / rain / ambient harmonic drones without requiring external audio files.
- **MongoDB Atlas Integration**: Cloud persistence for saved favorite locations and weather-mood journal reflections. Includes real-time connection status indicators, duplicate prevention, and REST API endpoints.
- **Forecast & History**: 12-hour hourly forecast, 5-day extended mood forecast, temperature unit switcher (°C / °F), and cloud persistence.

---

## 📂 Project Structure

```
AuraCast/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Brand header, Atlas indicator, synth toggle, unit switch, modals
│   │   ├── SearchBar.jsx           # Debounced search, autocomplete, geolocation & recent chips
│   │   ├── MoodSimulator.jsx       # 6 interactive mood preset buttons
│   │   ├── MainWeatherCard.jsx     # Current weather, temperature, condition icon & favorite star
│   │   ├── AtmosphericMetrics.jsx  # 6 atmospheric metrics (Humidity, Wind, UV, Pressure, Clouds, Rain)
│   │   ├── HourlyForecast.jsx      # 12-hour horizontal forecast cards
│   │   ├── MoodAnalysisCard.jsx    # Vibe analysis, activities, soundscape, copyable hex palette tokens
│   │   ├── DailyForecast.jsx       # 5-day mood outlook with badges and temperature ranges
│   │   ├── WeatherCanvas.jsx       # HTML5 Canvas atmospheric particle engine (rain, snow, rays, mist)
│   │   ├── WeatherIcon.jsx         # Dynamic Lucide icon mapper
│   │   ├── FavoritesModal.jsx      # MongoDB-backed favorite locations modal (select/delete)
│   │   ├── MoodJournalModal.jsx    # MongoDB-backed mood reflection diary & log history
│   │   └── Footer.jsx              # Footer component
│   ├── services/
│   │   ├── weatherApi.js           # Open-Meteo search, reverse geocode, forecast formatting
│   │   ├── databaseApi.js          # MongoDB REST API connector (health, favorites, mood logs)
│   │   ├── audioSynth.js           # Web Audio API ambient soundscape synthesizer
│   │   └── moodEngine.js           # Meteorological to emotional mood mapping logic
│   ├── styles/
│   │   ├── style.css               # Glassmorphism, floating aura mesh orbs, scrollbar
│   │   └── themes.css              # 6 dynamic mood gradient palettes & CSS custom properties
│   ├── App.jsx                     # Top-level state coordinator & theme manager
│   └── main.jsx                    # React 18 root mount
├── models/
│   ├── Favorite.js                 # Mongoose model for saved favorite cities
│   └── MoodLog.js                  # Mongoose model for mood reflections & diary
├── index.html                      # Main HTML scaffold mounting React via Vite
├── vite.config.js                  # Vite configuration with React plugin & /api proxy
├── server.js                       # Express server serving built React bundle & REST API
├── db.js                           # MongoDB connection manager with DNS resolution fallback
├── vercel.json                     # Vercel serverless deployment configuration
├── .env.example                    # Template for environment configuration
└── package.json                    # Project configuration and build scripts
```

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and provide your MongoDB Atlas credentials:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.vozygid.mongodb.net/auracast?retryWrites=true&w=majority
```

### 2. Install Dependencies & Build
```powershell
# Install dependencies
npm install

# Build production React frontend
npm run build
```

### 3. Run the Application

#### Production Mode (Express + React)
```powershell
npm start
```
Visit **http://localhost:3000** in your browser.

#### Development Mode (Vite HMR)
```powershell
# Terminal 1: Start Express backend
npm run server

# Terminal 2: Start Vite React dev server
npm run dev
```
Visit **http://localhost:5173** for instant Hot Module Replacement.
