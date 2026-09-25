# AuraCast: Interactive Weather and Mood Visualizer

AuraCast is a front-end web application that bridges real-time meteorological data with emotional visual design. Rather than just displaying numeric data and static weather icons, AuraCast translates live atmospheric conditions into an expressive "mood palette" and dynamic ambient visualizer.

---

## 🌟 Features

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
- **Forecast & History**: 24-hour hourly forecast, 5-day extended mood forecast, temperature unit switcher (°C / °F), and cloud persistence.

---

## 📂 Project Structure

```
AuraCast/
├── index.html                # Main UI scaffold with Tailwind CSS & Lucide icons
├── server.js                 # Express server with weather proxy & MongoDB REST API
├── db.js                     # MongoDB connection manager with DNS resolution fallback
├── models/
│   ├── Favorite.js           # Mongoose model for saved favorite cities
│   └── MoodLog.js            # Mongoose model for mood reflections & diary
├── css/
│   ├── style.css             # Glassmorphism, animations, floating orbs, scrollbar
│   └── themes.css            # Dynamic mood gradient palettes & CSS custom variables
├── js/
│   ├── moodEngine.js         # Core weather-to-mood mapping logic & psychology data
│   ├── api.js                # Weather & MongoDB Database API connectors
│   ├── ui.js                 # DOM rendering & Canvas atmospheric particle engine
│   └── app.js                # State manager, unit switcher, search & Web Audio synth
├── .env                      # Environment credentials (git-ignored)
├── .env.example              # Template for environment configuration
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and provide your MongoDB Atlas credentials:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.vozygid.mongodb.net/auracast?retryWrites=true&w=majority
```

### 2. Install Dependencies & Start Server
```powershell
# Install dependencies
npm install

# Start development server with MongoDB Atlas connection
npm start
```

Visit **http://localhost:3000** in your browser.
- Verify the **MongoDB Atlas** status badge shows **Atlas Online** in the header.
- Save your favorite cities with one click on the ⭐ icon.
- Log your emotional reflections with the **Mood Journal** button.

