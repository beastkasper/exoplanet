import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Exoplanet Map', icon: '🌌' },
    { path: '/space-viz', label: 'Space Viz', icon: '✨' },
    { path: '/nasa-eyes', label: 'NASA Eyes', icon: '👁️' },
    { path: '/educational', label: 'Educational', icon: '📚' },
    { path: '/fragment', label: 'Fragment', icon: '🔬' },
    { path: '/noob', label: 'Noob Mode', icon: '👶' },
    { path: '/pro', label: 'Pro Mode', icon: '🚀' },
  ];
  
  return (
    <nav style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '25px',
      padding: '8px',
      display: 'flex',
      gap: '4px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            color: location.pathname === item.path ? '#fff' : '#888',
            background: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            transition: 'all 0.2s ease',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <span style={{ fontSize: '16px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
