import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ModeToggle from './ModeToggle';

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
    <motion.nav 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
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
      }}
    >
      {/* Mode Toggle */}
      <ModeToggle />
      
      {/* Navigation Items */}
      {navItems.map((item, index) => (
        <motion.div
          key={item.path}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link
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
        </motion.div>
      ))}
    </motion.nav>
  );
}
