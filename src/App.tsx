import { useISSPosition } from './hooks/useISSPosition'
import { Map } from './components/Map'
import { InfoPanel } from './components/InfoPanel'

function App() {
  const iss = useISSPosition()

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {iss.loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#aaa',
          fontSize: '1.2rem',
        }}>
          Acquiring ISS position...
        </div>
      ) : iss.error ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#ff6b6b',
          fontSize: '1.2rem',
        }}>
          Error: {iss.error}
        </div>
      ) : (
        <>
          <Map latitude={iss.latitude} longitude={iss.longitude} />
          <InfoPanel
            latitude={iss.latitude}
            longitude={iss.longitude}
            altitude={iss.altitude}
            velocity={iss.velocity}
            visibility={iss.visibility}
            timestamp={iss.timestamp}
          />
        </>
      )}
    </div>
  )
}

export default App
