import Navigation from '../components/Navigation';

export default function NoobMode() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
      color: 'white',
      fontSize: '24px'
    }}>
      <Navigation />
      <div style={{ textAlign: 'center' }}>
        <h1>Noob Mode</h1>
        <p>Coming soon...</p>
        <a href="/" style={{ color: '#4CAF50', textDecoration: 'none' }}>
          ← Back to Exoplanet Map
        </a>
      </div>
    </div>
  );
}
