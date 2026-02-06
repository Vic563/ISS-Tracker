import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix Leaflet default marker icon issue in bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const issIcon = L.divIcon({
  html: `<div style="font-size: 32px; line-height: 1; filter: drop-shadow(0 0 6px rgba(0, 200, 255, 0.8));">🛰️</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: '',
})

const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'

const MAX_TRAIL_POINTS = 200

interface MapProps {
  latitude: number
  longitude: number
}

function MapFollower({ latitude, longitude }: MapProps) {
  const map = useMap()

  useEffect(() => {
    if (latitude !== 0 || longitude !== 0) {
      map.setView([latitude, longitude], map.getZoom(), { animate: true })
    }
  }, [map, latitude, longitude])

  return null
}

export function Map({ latitude, longitude }: MapProps) {
  const trailRef = useRef<[number, number][]>([])

  // Add position to trail, handling the antimeridian wrap
  if (latitude !== 0 || longitude !== 0) {
    const trail = trailRef.current
    const last = trail[trail.length - 1]
    // Only add if the position has actually changed
    if (!last || last[0] !== latitude || last[1] !== longitude) {
      // If the longitude jump is > 180 degrees, the ISS crossed the antimeridian.
      // Insert a break by clearing the trail to avoid a line wrapping across the map.
      if (last && Math.abs(longitude - last[1]) > 180) {
        trailRef.current = []
      }
      trailRef.current.push([latitude, longitude])
      if (trailRef.current.length > MAX_TRAIL_POINTS) {
        trailRef.current = trailRef.current.slice(-MAX_TRAIL_POINTS)
      }
    }
  }

  return (
    <MapContainer
      center={[latitude || 0, longitude || 0]}
      zoom={4}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      worldCopyJump={true}
    >
      <TileLayer url={DARK_TILES} attribution={TILE_ATTRIBUTION} />
      {(latitude !== 0 || longitude !== 0) && (
        <>
          <Marker position={[latitude, longitude]} icon={issIcon} />
          {trailRef.current.length > 1 && (
            <Polyline
              positions={trailRef.current}
              pathOptions={{
                color: '#00c8ff',
                weight: 2,
                opacity: 0.6,
                dashArray: '6 4',
              }}
            />
          )}
        </>
      )}
      <MapFollower latitude={latitude} longitude={longitude} />
    </MapContainer>
  )
}
