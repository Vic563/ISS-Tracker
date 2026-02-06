# ISS Tracker

Real-time International Space Station tracker built with React, TypeScript, and Leaflet.

## Features

- Live ISS position on a dark-themed world map
- Ground track trail showing the ISS path
- Telemetry panel: latitude, longitude, altitude, velocity, visibility
- Crew roster showing astronauts currently aboard the ISS
- Auto-updates every 5 seconds

## Tech Stack

- **React 19** + TypeScript
- **Vite** for build tooling
- **react-leaflet** / Leaflet for mapping
- **CartoDB Dark** tile layer
- **Where The ISS At API** for position data
- **Open Notify API** for crew data

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
npm run preview
```
