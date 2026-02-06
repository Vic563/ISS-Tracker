import { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'

const issIcon = L.divIcon({
  html: `<div style="font-size: 36px; line-height: 1; filter: drop-shadow(0 0 8px rgba(255, 60, 60, 0.9)) drop-shadow(0 0 20px rgba(255, 100, 50, 0.5));">🛰️</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  className: '',
})

const ESRI_IMAGERY = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const ESRI_LABELS = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
const TILE_ATTRIBUTION = '&copy; Esri, Maxar, Earthstar Geographics'

const MAX_TRAIL_POINTS = 300
const INTERPOLATION_INTERVAL = 100 // ms between animation frames
const INTERPOLATION_STEPS = 50 // frames per API poll (5000ms / 100ms)

interface MapProps {
  latitude: number
  longitude: number
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// Interpolate longitude handling the antimeridian
function lerpLon(a: number, b: number, t: number) {
  let diff = b - a
  if (diff > 180) diff -= 360
  if (diff < -180) diff += 360
  let result = a + diff * t
  if (result > 180) result -= 360
  if (result < -180) result += 360
  return result
}

function AnimatedMarker({ latitude, longitude, following, onFollowingChange }: MapProps & { following: boolean; onFollowingChange: (f: boolean) => void }) {
  const map = useMap()
  const markerRef = useRef<L.Marker | null>(null)
  const prevPos = useRef<{ lat: number; lon: number }>({ lat: latitude, lon: longitude })
  const targetPos = useRef<{ lat: number; lon: number }>({ lat: latitude, lon: longitude })
  const stepRef = useRef(0)
  const intervalRef = useRef<number | null>(null)
  const trailRef = useRef<[number, number][]>([])
  const polylineRef = useRef<L.Polyline | null>(null)
  const followingRef = useRef(following)
  followingRef.current = following

  // Stop following when user drags the map
  useEffect(() => {
    const onDragStart = () => onFollowingChange(false)
    map.on('dragstart', onDragStart)
    return () => { map.off('dragstart', onDragStart) }
  }, [map, onFollowingChange])

  // Create marker + polyline on mount
  useEffect(() => {
    const marker = L.marker([latitude || 0, longitude || 0], { icon: issIcon }).addTo(map)
    markerRef.current = marker

    const polyline = L.polyline([], {
      color: '#ff4444',
      weight: 3,
      opacity: 0.8,
    }).addTo(map)
    polylineRef.current = polyline

    return () => {
      marker.remove()
      polyline.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  // When a new API position arrives, start interpolating toward it
  const startInterpolation = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
    }
    stepRef.current = 0

    intervalRef.current = window.setInterval(() => {
      stepRef.current++
      const t = Math.min(stepRef.current / INTERPOLATION_STEPS, 1)
      const eased = t * t * (3 - 2 * t) // smoothstep

      const lat = lerp(prevPos.current.lat, targetPos.current.lat, eased)
      const lon = lerpLon(prevPos.current.lon, targetPos.current.lon, eased)
      const pos: L.LatLngExpression = [lat, lon]

      // Always move the marker
      markerRef.current?.setLatLng(pos)

      // Only pan the map if following
      if (followingRef.current) {
        map.panTo(pos, { animate: false })
      }

      // Add to trail
      const trail = trailRef.current
      const last = trail[trail.length - 1]
      if (!last || Math.abs(lat - last[0]) > 0.01 || Math.abs(lon - last[1]) > 0.01) {
        if (last && Math.abs(lon - last[1]) > 180) {
          trailRef.current = []
        }
        trailRef.current.push([lat, lon])
        if (trailRef.current.length > MAX_TRAIL_POINTS) {
          trailRef.current = trailRef.current.slice(-MAX_TRAIL_POINTS)
        }
        polylineRef.current?.setLatLngs(trailRef.current)
      }

      if (t >= 1) {
        if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, INTERPOLATION_INTERVAL)
  }, [map])

  useEffect(() => {
    if (latitude === 0 && longitude === 0) return

    prevPos.current = {
      lat: markerRef.current?.getLatLng().lat ?? latitude,
      lon: markerRef.current?.getLatLng().lng ?? longitude,
    }
    targetPos.current = { lat: latitude, lon: longitude }
    startInterpolation()

    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
    }
  }, [latitude, longitude, startInterpolation])

  // When re-following, snap map to current ISS position
  useEffect(() => {
    if (following && markerRef.current) {
      map.panTo(markerRef.current.getLatLng(), { animate: true })
    }
  }, [following, map])

  return null
}

const followBtnStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  background: 'rgba(10, 10, 20, 0.9)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 68, 68, 0.4)',
  borderRadius: 8,
  padding: '10px 20px',
  color: '#ff6666',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  letterSpacing: '0.03em',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
}

export function Map({ latitude, longitude }: MapProps) {
  const [following, setFollowing] = useState(true)

  return (
    <MapContainer
      center={[latitude || 20, longitude || 0]}
      zoom={4}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
      worldCopyJump={true}
    >
      <TileLayer url={ESRI_IMAGERY} attribution={TILE_ATTRIBUTION} maxZoom={18} />
      <TileLayer url={ESRI_LABELS} maxZoom={18} />
      {(latitude !== 0 || longitude !== 0) && (
        <AnimatedMarker
          latitude={latitude}
          longitude={longitude}
          following={following}
          onFollowingChange={setFollowing}
        />
      )}
      {!following && (
        <div
          style={followBtnStyle}
          onClick={() => setFollowing(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') setFollowing(true) }}
        >
          Follow ISS
        </div>
      )}
    </MapContainer>
  )
}
