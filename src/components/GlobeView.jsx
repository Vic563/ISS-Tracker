import React, { useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

const GlobeView = ({ issData }) => {
    const globeEl = useRef();

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
        }
    }, []);

    const objectsData = issData ? [issData] : [];

    return (
        <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            animateIn={true}
            atmosphereColor="lightskyblue"
            atmosphereAltitude={0.15}

            objectsData={objectsData}
            objectLat="lat"
            objectLng="lng"
            objectAltitude={(d) => (d.alt || 400) / 6371}
            objectThreeObject={() => {
                // Create a group to hold the ISS parts
                const group = new THREE.Group();

                // Main Module (Cylinder)
                const bodyGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
                const bodyMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
                const body = new THREE.Mesh(bodyGeo, bodyMat);
                body.rotation.z = Math.PI / 2;
                group.add(body);

                // Solar Panels (Box)
                const panelGeo = new THREE.BoxGeometry(1.5, 0.1, 8);
                const panelMat = new THREE.MeshLambertMaterial({ color: 0x3366cc, emissive: 0x112244 });

                const leftPanel = new THREE.Mesh(panelGeo, panelMat);
                leftPanel.position.set(0, 0, 0);
                group.add(leftPanel);

                // Cross bar structure
                const crossBarGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 8);
                const crossBar = new THREE.Mesh(crossBarGeo, bodyMat);
                crossBar.rotation.x = Math.PI / 2;
                group.add(crossBar);

                // Scale up for visibility
                group.scale.set(1.5, 1.5, 1.5);

                return group;
            }}
            objectLabel={() => "ISS (International Space Station)"}
        />
    );
};

export default GlobeView;
