export default function ProMode() {
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
      <div style={{ textAlign: 'center' }}>
        <h1>Pro Mode</h1>
        <p>Advanced features coming soon...</p>
        <a href="/fragment" style={{ color: '#4CAF50', textDecoration: 'none' }}>
          ← Back to Main Menu
        </a>
      </div>
    </div>
  );
}
