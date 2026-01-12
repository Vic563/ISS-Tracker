import React, { useState, useEffect } from 'react';
import GlobeView from './components/GlobeView';
import StatsPanel from './components/StatsPanel';
import { getISSPosition } from './services/ISSService';
import './index.css';

function App() {
  const [issData, setIssData] = useState(null);

  useEffect(() => {
    const fetchISS = async () => {
      const data = await getISSPosition();
      if (data) {
        setIssData(data);
      }
    };

    fetchISS();
    const interval = setInterval(fetchISS, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <GlobeView issData={issData} />
      </div>

      {/* Header */}
      <div className="absolute z-10 top-10 left-10 pointer-events-none">
        <h1 className="text-4xl font-bold tracking-widest uppercase text-translucent">ISS Tracker</h1>
        <p className="text-sm text-gray-400">Live Satellite Tracking</p>
      </div>

      {/* Stats HUD */}
      <div className="absolute z-10 bottom-10 left-4 right-4 md:left-auto md:right-10 flex justify-center md:block">
        <StatsPanel data={issData} />
      </div>
    </div>
  );
}

export default App;
