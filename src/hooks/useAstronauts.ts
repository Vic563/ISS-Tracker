import { useState, useEffect } from 'react'

export interface Astronaut {
  name: string
  craft: string
}

interface UseAstronautsReturn {
  astronauts: Astronaut[]
  count: number
  loading: boolean
  error: string | null
}

const API_URL = 'http://api.open-notify.org/astros.json'

export function useAstronauts(): UseAstronautsReturn {
  const [astronauts, setAstronauts] = useState<Astronaut[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchAstronauts() {
      try {
        const res = await fetch(API_URL, { signal: controller.signal })
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const data = await res.json()
        setAstronauts(data.people ?? [])
        setError(null)
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to fetch astronauts')
      } finally {
        setLoading(false)
      }
    }

    fetchAstronauts()

    return () => controller.abort()
  }, [])

  const issAstronauts = astronauts.filter((a) => a.craft === 'ISS')

  return {
    astronauts: issAstronauts,
    count: issAstronauts.length,
    loading,
    error,
  }
}
