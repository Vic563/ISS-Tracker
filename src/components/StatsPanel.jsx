import React from 'react';

const StatsPanel = ({ data }) => {
    if (!data) return null;

    // Determine location display text
    const getLocationDisplay = () => {
        if (!data.location) return 'Loading...';
        if (data.location.country) {
            return data.location.region
                ? `${data.location.region}, ${data.location.country}`
                : data.location.country;
        }
        return data.location.ocean || data.location.displayName || 'Unknown';
    };

    const isOverOcean = data.location && !data.location.country && data.location.ocean;

    return (
        <div className="p-6 bg-black/60 backdrop-blur-md border border-white/20 rounded-lg text-white font-mono w-full md:w-80 shadow-2xl pointer-events-auto">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-500/50 pb-2 tracking-wider">TELEMETRY</h2>

            {/* Location Section */}
            <div className="mb-4 pb-3 border-b border-gray-500/30">
                <span className="text-gray-400 block text-xs uppercase tracking-widest mb-1">
                    {isOverOcean ? 'Over' : 'Near'}
                </span>
                <span className="text-lg font-medium text-cyan-400">
                    {getLocationDisplay()}
                </span>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-400 block text-xs uppercase tracking-widest mb-1">Latitude</span>
                        <span className="text-lg font-medium">{data.lat?.toFixed(4)}°</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block text-xs uppercase tracking-widest mb-1">Longitude</span>
                        <span className="text-lg font-medium">{data.lng?.toFixed(4)}°</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-400 block text-xs uppercase tracking-widest mb-1">Altitude</span>
                        <span className="text-lg font-medium">{data.alt?.toFixed(2)} <span className="text-sm text-gray-400">km</span></span>
                    </div>
                    <div>
                        <span className="text-gray-400 block text-xs uppercase tracking-widest mb-1">Velocity</span>
                        <span className="text-lg font-medium">{data.velocity?.toFixed(0)} <span className="text-sm text-gray-400">km/h</span></span>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-500/50 text-xs text-gray-400 flex justify-between uppercase tracking-wide">
                <span>Vis: <span className="text-white">{data.visibility}</span></span>
                <span>TS: <span className="text-white">{data.timestamp}</span></span>
            </div>
        </div>
    );
};

export default StatsPanel;
