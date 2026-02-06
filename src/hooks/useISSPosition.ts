import { useState, useEffect, useRef } from 'react'

interface ISSPosition {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  visibility: string
  timestamp: number
}

interface UseISSPositionReturn extends ISSPosition {
  loading: boolean
  error: string | null
}

const API_URL = 'https://api.wheretheiss.at/v1/satellites/25544'
const POLL_INTERVAL = 5000

export function useISSPosition(): UseISSPositionReturn {
  const [position, setPosition] = useState<ISSPosition>({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    velocity: 0,
    visibility: 'unknown',
    timestamp: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPosition() {
      try {
        const res = await fetch(API_URL, { signal: controller.signal })
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const data = await res.json()
        setPosition({
          latitude: data.latitude,
          longitude: data.longitude,
          altitude: data.altitude,
          velocity: data.velocity,
          visibility: data.visibility,
          timestamp: data.timestamp,
        })
        setError(null)
        setLoading(false)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to fetch ISS position')
        setLoading(false)
      }
    }

    fetchPosition()
    intervalRef.current = window.setInterval(fetchPosition, POLL_INTERVAL)

    return () => {
      controller.abort()
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [])

  return { ...position, loading, error }
}
