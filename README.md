# ISS Tracker

A real-time International Space Station tracker that displays the ISS position on an interactive 3D globe with live telemetry data.

![ISS Tracker](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![Three.js](https://img.shields.io/badge/Three.js-3D-green)

## Features

- **Live ISS Tracking** - Real-time position updates every 2 seconds from the Where The ISS At API
- **3D Globe Visualization** - Interactive Earth with realistic textures, atmospheric effects, and auto-rotation
- **Custom ISS Model** - 3D representation of the ISS with solar panels and main module
- **Location Detection** - Shows which country or ocean the ISS is currently near/over
- **Telemetry HUD** - Displays latitude, longitude, altitude, velocity, visibility, and timestamp

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Three.js** - 3D graphics library
- **react-globe.gl** - Globe visualization component
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client for API requests

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Vic563/ISS-Tracker.git
   cd ISS-Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Project Structure

```
src/
├── App.jsx                 # Main application component
├── components/
│   ├── GlobeView.jsx       # 3D globe with ISS visualization
│   └── StatsPanel.jsx      # Telemetry HUD display
└── services/
    ├── ISSService.js       # ISS position API integration
    └── LocationService.js  # Reverse geocoding for location detection
```

## APIs Used

- **[Where The ISS At](https://wheretheiss.at/)** - Real-time ISS position data
- **[BigDataCloud](https://www.bigdatacloud.com/)** - Free reverse geocoding (no API key required)

## License

MIT
