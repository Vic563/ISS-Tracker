import { useAstronauts } from '../hooks/useAstronauts'

interface InfoPanelProps {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  visibility: string
  timestamp: number
}

export function InfoPanel({
  latitude,
  longitude,
  altitude,
  velocity,
  visibility,
  timestamp,
}: InfoPanelProps) {
  const { astronauts, count, loading: astroLoading } = useAstronauts()

  const lastUpdate = timestamp
    ? new Date(timestamp * 1000).toLocaleTimeString()
    : '--'

  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>ISS Tracker</h2>

      <div style={sectionStyle}>
        <DataRow label="Latitude" value={`${latitude.toFixed(4)}\u00B0`} />
        <DataRow label="Longitude" value={`${longitude.toFixed(4)}\u00B0`} />
        <DataRow label="Altitude" value={`${altitude.toFixed(1)} km`} />
        <DataRow label="Velocity" value={`${velocity.toFixed(1)} km/h`} />
        <DataRow label="Visibility" value={visibility} />
        <DataRow label="Last Update" value={lastUpdate} />
      </div>

      <div style={{ ...sectionStyle, marginTop: 16 }}>
        <h3 style={subTitleStyle}>
          Crew on ISS {!astroLoading && `(${count})`}
        </h3>
        {astroLoading ? (
          <p style={mutedStyle}>Loading crew data...</p>
        ) : astronauts.length === 0 ? (
          <p style={mutedStyle}>No crew data available</p>
        ) : (
          <ul style={listStyle}>
            {astronauts.map((a) => (
              <li key={a.name} style={listItemStyle}>
                {a.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={rowStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  )
}

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 1000,
  background: 'rgba(10, 10, 20, 0.88)',
  backdropFilter: 'blur(12px)',
  borderRadius: 12,
  padding: '20px 24px',
  minWidth: 260,
  maxWidth: 300,
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  color: '#e0e0e0',
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
}

const titleStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: 16,
  fontSize: '1.1rem',
  fontWeight: 600,
  letterSpacing: '0.04em',
  color: '#00c8ff',
}

const subTitleStyle: React.CSSProperties = {
  margin: 0,
  marginBottom: 8,
  fontSize: '0.85rem',
  fontWeight: 600,
  color: '#aaa',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.85rem',
}

const labelStyle: React.CSSProperties = {
  color: '#888',
}

const valueStyle: React.CSSProperties = {
  fontFamily: "'SF Mono', 'Fira Code', monospace",
  fontWeight: 500,
  color: '#e8e8e8',
}

const mutedStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '0.8rem',
  margin: 0,
}

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const listItemStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  color: '#ccc',
  paddingLeft: 8,
  borderLeft: '2px solid #00c8ff33',
}
