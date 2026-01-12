import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';

const GlobeView = ({ issData, onCountryHover }) => {
    const globeEl = useRef();
    const [countries, setCountries] = useState({ features: [] });
    const [hoveredCountry, setHoveredCountry] = useState(null);

    // Load country polygons
    useEffect(() => {
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(data => setCountries(data));
    }, []);

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;

            // Point of view to better see the ISS
            globeEl.current.pointOfView({ altitude: 2.5 });
        }
    }, []);

    const issMarkerData = issData ? [issData] : [];

    const handlePolygonHover = (polygon) => {
        setHoveredCountry(polygon);
        if (onCountryHover) {
            onCountryHover(polygon ? polygon.properties.ADMIN : null);
        }
    };

    // Create ISS HTML element marker
    const createIssElement = useCallback(() => {
        const el = document.createElement('div');
        el.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transform: translate(-50%, -50%);
            ">
                <div style="
                    width: 50px;
                    height: 50px;
                    background: radial-gradient(circle, rgba(255,100,100,1) 0%, rgba(255,50,50,0.8) 40%, rgba(255,0,0,0) 70%);
                    border-radius: 50%;
                    animation: pulse 1.5s ease-in-out infinite;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div style="
                        font-size: 24px;
                        filter: drop-shadow(0 0 4px white);
                    ">🛰️</div>
                </div>
                <div style="
                    background: rgba(0,0,0,0.8);
                    color: cyan;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-family: monospace;
                    font-weight: bold;
                    margin-top: 4px;
                    white-space: nowrap;
                    border: 1px solid rgba(0,255,255,0.5);
                ">ISS</div>
            </div>
        `;
        return el;
    }, []);

    return (
        <>
            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.3); opacity: 0.7; }
                }
            `}</style>
            <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                animateIn={true}
                atmosphereColor="lightskyblue"
                atmosphereAltitude={0.15}

                // Country polygons for hover detection
                polygonsData={countries.features}
                polygonAltitude={0.001}
                polygonCapColor={(d) =>
                    hoveredCountry && d === hoveredCountry
                        ? 'rgba(0, 255, 255, 0.4)'
                        : 'rgba(0, 0, 0, 0)'
                }
                polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
                polygonStrokeColor={() => 'rgba(255, 255, 255, 0.1)'}
                onPolygonHover={handlePolygonHover}
                polygonLabel={(d) => `<div style="background: rgba(0,0,0,0.8); padding: 8px 12px; border-radius: 4px; color: white; font-family: monospace;">${d.properties.ADMIN}</div>`}

                // ISS HTML marker
                htmlElementsData={issMarkerData}
                htmlLat={(d) => d.lat}
                htmlLng={(d) => d.lng}
                htmlAltitude={(d) => (d.alt || 420) / 6371 / 2}
                htmlElement={createIssElement}
            />

            {/* Hovered country display */}
            {hoveredCountry && (
                <div className="absolute top-10 right-10 bg-black/70 backdrop-blur-md border border-cyan-500/50 rounded-lg px-4 py-2 text-white font-mono z-20">
                    <span className="text-cyan-400 text-sm uppercase tracking-wider">Hovering Over</span>
                    <div className="text-lg font-semibold">{hoveredCountry.properties.ADMIN}</div>
                </div>
            )}
        </>
    );
};

export default GlobeView;
