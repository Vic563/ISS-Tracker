import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

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

    const objectsData = issData ? [issData] : [];

    const handlePolygonHover = (polygon) => {
        setHoveredCountry(polygon);
        if (onCountryHover) {
            onCountryHover(polygon ? polygon.properties.ADMIN : null);
        }
    };

    return (
        <>
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

                // ISS marker
                objectsData={objectsData}
                objectLat="lat"
                objectLng="lng"
                objectAltitude={(d) => (d.alt || 420) / 6371}
                objectThreeObject={() => {
                    // Create a group to hold the ISS parts
                    const group = new THREE.Group();

                    // Main Module (Cylinder)
                    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.5, 16);
                    const bodyMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee, emissive: 0x333333 });
                    const body = new THREE.Mesh(bodyGeo, bodyMat);
                    body.rotation.z = Math.PI / 2;
                    group.add(body);

                    // Solar Panels (Box) - made more prominent
                    const panelGeo = new THREE.BoxGeometry(1, 0.05, 5);
                    const panelMat = new THREE.MeshLambertMaterial({
                        color: 0x4488ff,
                        emissive: 0x224488,
                        emissiveIntensity: 0.5
                    });

                    const leftPanel = new THREE.Mesh(panelGeo, panelMat);
                    leftPanel.position.set(0, 0, 0);
                    group.add(leftPanel);

                    // Cross bar structure
                    const crossBarGeo = new THREE.CylinderGeometry(0.08, 0.08, 5, 8);
                    const crossBar = new THREE.Mesh(crossBarGeo, bodyMat);
                    crossBar.rotation.x = Math.PI / 2;
                    group.add(crossBar);

                    // Add a glowing sphere marker for better visibility
                    const markerGeo = new THREE.SphereGeometry(0.8, 16, 16);
                    const markerMat = new THREE.MeshBasicMaterial({
                        color: 0xff3333,
                        transparent: true,
                        opacity: 0.6
                    });
                    const marker = new THREE.Mesh(markerGeo, markerMat);
                    marker.position.set(0, 1.5, 0);
                    group.add(marker);

                    // Scale up significantly for visibility on the globe
                    group.scale.set(0.15, 0.15, 0.15);

                    return group;
                }}
                objectLabel={() => `
                    <div style="background: rgba(0,0,0,0.9); padding: 10px 14px; border-radius: 6px; color: white; font-family: monospace; border: 1px solid cyan;">
                        <div style="color: cyan; font-weight: bold;">ISS</div>
                        <div style="font-size: 11px; color: #aaa;">International Space Station</div>
                    </div>
                `}
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
