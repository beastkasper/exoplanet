import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import styles from './NASAEyesExoplanets.module.css';

// Exoplanet data structure based on NASA's database
interface Exoplanet {
  id: string;
  name: string;
  hostStar: string;
  discoveryYear: number;
  discoveryMethod: string;
  orbitalPeriod: number; // days
  orbitalDistance: number; // AU
  planetRadius: number; // Earth radii
  planetMass: number; // Earth masses
  equilibriumTemperature: number; // Kelvin
  stellarDistance: number; // parsecs
  rightAscension: number; // hours
  declination: number; // degrees
  stellarType: string;
  stellarRadius: number; // Solar radii
  stellarMass: number; // Solar masses
  stellarTemperature: number; // Kelvin
  habitable: boolean;
  confirmed: boolean;
}

// Sample exoplanet data (subset of NASA's database)
const exoplanetData: Exoplanet[] = [
  {
    id: 'kepler-452b',
    name: 'Kepler-452b',
    hostStar: 'Kepler-452',
    discoveryYear: 2015,
    discoveryMethod: 'Transit',
    orbitalPeriod: 384.8,
    orbitalDistance: 1.046,
    planetRadius: 1.63,
    planetMass: 5.0,
    equilibriumTemperature: 265,
    stellarDistance: 1400,
    rightAscension: 19.44,
    declination: 44.27,
    stellarType: 'G2V',
    stellarRadius: 1.11,
    stellarMass: 1.04,
    stellarTemperature: 5757,
    habitable: true,
    confirmed: true
  },
  {
    id: 'trappist-1b',
    name: 'TRAPPIST-1b',
    hostStar: 'TRAPPIST-1',
    discoveryYear: 2016,
    discoveryMethod: 'Transit',
    orbitalPeriod: 1.51,
    orbitalDistance: 0.011,
    planetRadius: 1.12,
    planetMass: 1.02,
    equilibriumTemperature: 400,
    stellarDistance: 12.4,
    rightAscension: 23.06,
    declination: -5.04,
    stellarType: 'M8V',
    stellarRadius: 0.12,
    stellarMass: 0.09,
    stellarTemperature: 2550,
    habitable: false,
    confirmed: true
  },
  {
    id: 'trappist-1c',
    name: 'TRAPPIST-1c',
    hostStar: 'TRAPPIST-1',
    discoveryYear: 2016,
    discoveryMethod: 'Transit',
    orbitalPeriod: 2.42,
    orbitalDistance: 0.016,
    planetRadius: 1.10,
    planetMass: 1.16,
    equilibriumTemperature: 342,
    stellarDistance: 12.4,
    rightAscension: 23.06,
    declination: -5.04,
    stellarType: 'M8V',
    stellarRadius: 0.12,
    stellarMass: 0.09,
    stellarTemperature: 2550,
    habitable: false,
    confirmed: true
  },
  {
    id: 'trappist-1d',
    name: 'TRAPPIST-1d',
    hostStar: 'TRAPPIST-1',
    discoveryYear: 2016,
    discoveryMethod: 'Transit',
    orbitalPeriod: 4.05,
    orbitalDistance: 0.022,
    planetRadius: 0.78,
    planetMass: 0.30,
    equilibriumTemperature: 288,
    stellarDistance: 12.4,
    rightAscension: 23.06,
    declination: -5.04,
    stellarType: 'M8V',
    stellarRadius: 0.12,
    stellarMass: 0.09,
    stellarTemperature: 2550,
    habitable: true,
    confirmed: true
  },
  {
    id: 'proxima-centauri-b',
    name: 'Proxima Centauri b',
    hostStar: 'Proxima Centauri',
    discoveryYear: 2016,
    discoveryMethod: 'Radial Velocity',
    orbitalPeriod: 11.2,
    orbitalDistance: 0.0485,
    planetRadius: 1.3,
    planetMass: 1.27,
    equilibriumTemperature: 234,
    stellarDistance: 1.3,
    rightAscension: 14.29,
    declination: -62.68,
    stellarType: 'M5.5V',
    stellarRadius: 0.15,
    stellarMass: 0.12,
    stellarTemperature: 3042,
    habitable: true,
    confirmed: true
  }
];

// Convert astronomical coordinates to 3D position
function astronomicalToCartesian(
  rightAscension: number,
  declination: number,
  distance: number
): [number, number, number] {
  const raRad = (rightAscension * 15 * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  
  const x = distance * Math.cos(decRad) * Math.cos(raRad);
  const y = distance * Math.cos(decRad) * Math.sin(raRad);
  const z = distance * Math.sin(decRad);
  
  return [x, y, z];
}

// Planet component
const Planet: React.FC<{
  planet: Exoplanet;
  isSelected: boolean;
  onSelect: (planet: Exoplanet) => void;
}> = ({ planet, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const position = astronomicalToCartesian(
    planet.rightAscension,
    planet.declination,
    planet.stellarDistance / 100 // Scale down for visualization
  );
  
  // Scale based on planet radius
  const scale = Math.max(0.1, planet.planetRadius / 10);
  
  // Color based on habitability and temperature
  const getPlanetColor = () => {
    if (planet.habitable) return '#4CAF50'; // Green for habitable
    if (planet.equilibriumTemperature > 400) return '#FF5722'; // Red for hot
    if (planet.equilibriumTemperature < 200) return '#2196F3'; // Blue for cold
    return '#FFC107'; // Yellow for moderate
  };
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      
      // Pulsing effect for selected planet
      if (isSelected) {
        meshRef.current.scale.setScalar(
          scale * (1 + Math.sin(state.clock.elapsedTime * 3) * 0.2)
        );
      }
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={() => onSelect(planet)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhongMaterial 
        color={getPlanetColor()}
        emissive={getPlanetColor()}
        emissiveIntensity={0.1}
        transparent
        opacity={0.8}
      />
      
      {/* Planet label */}
      <Html distanceFactor={10}>
        <div className={`${styles.planetLabel} ${isSelected ? styles.selected : ''}`}>
          {planet.name}
        </div>
      </Html>
    </mesh>
  );
};

// Main 3D scene component
const ExoplanetScene: React.FC<{
  selectedPlanet: Exoplanet | null;
  onPlanetSelect: (planet: Exoplanet) => void;
}> = ({ selectedPlanet, onPlanetSelect }) => {
  return (
    <>
      {/* Background stars */}
      <Stars 
        radius={1000} 
        depth={100} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
      />
      
      {/* Exoplanets */}
      {exoplanetData.map((planet) => (
        <Planet
          key={planet.id}
          planet={planet}
          isSelected={selectedPlanet?.id === planet.id}
          onSelect={onPlanetSelect}
        />
      ))}
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
    </>
  );
};

// Main component
const NASAEyesExoplanets: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [viewMode, setViewMode] = useState<'3D' | 'List'>('3D');
  const [filterMethod, setFilterMethod] = useState<string>('All');
  const [filterHabitable, setFilterHabitable] = useState<boolean>(false);
  
  const filteredPlanets = exoplanetData.filter(planet => {
    if (filterMethod !== 'All' && planet.discoveryMethod !== filterMethod) return false;
    if (filterHabitable && !planet.habitable) return false;
    return true;
  });
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span className={styles.nasaLogo}>NASA</span>
            <span className={styles.eyesLogo}>Eyes on Exoplanets</span>
          </h1>
          <p className={styles.subtitle}>
            Real-time, 3D visualization of confirmed exoplanets
          </p>
        </div>
      </header>
      
      {/* Main content */}
      <div className={styles.mainContent}>
        {/* 3D Visualization */}
        <div className={styles.visualizationContainer}>
          <Canvas
            camera={{ 
              position: [0, 0, 50], 
              fov: 60,
              near: 0.1,
              far: 10000
            }}
            style={{ background: 'radial-gradient(circle, #0a0a0a 0%, #000000 100%)' }}
          >
            <ExoplanetScene 
              selectedPlanet={selectedPlanet}
              onPlanetSelect={setSelectedPlanet}
            />
            
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={10}
              maxDistance={1000}
              autoRotate={false}
            />
          </Canvas>
        </div>
        
        {/* Control Panel */}
        <div className={styles.controlPanel}>
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label>View Mode:</label>
              <div className={styles.buttonGroup}>
                <button 
                  className={`${styles.button} ${viewMode === '3D' ? styles.active : ''}`}
                  onClick={() => setViewMode('3D')}
                >
                  3D View
                </button>
                <button 
                  className={`${styles.button} ${viewMode === 'List' ? styles.active : ''}`}
                  onClick={() => setViewMode('List')}
                >
                  List View
                </button>
              </div>
            </div>
            
            <div className={styles.controlGroup}>
              <label>Discovery Method:</label>
              <select 
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className={styles.select}
              >
                <option value="All">All Methods</option>
                <option value="Transit">Transit</option>
                <option value="Radial Velocity">Radial Velocity</option>
                <option value="Direct Imaging">Direct Imaging</option>
                <option value="Microlensing">Microlensing</option>
              </select>
            </div>
            
            <div className={styles.controlGroup}>
              <label>
                <input 
                  type="checkbox"
                  checked={filterHabitable}
                  onChange={(e) => setFilterHabitable(e.target.checked)}
                />
                Habitable Zone Only
              </label>
            </div>
          </div>
          
          {/* Planet Information */}
          {selectedPlanet && (
            <div className={styles.planetInfo}>
              <h3>{selectedPlanet.name}</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Host Star:</span>
                  <span>{selectedPlanet.hostStar}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Discovery Year:</span>
                  <span>{selectedPlanet.discoveryYear}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Method:</span>
                  <span>{selectedPlanet.discoveryMethod}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Orbital Period:</span>
                  <span>{selectedPlanet.orbitalPeriod} days</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Distance:</span>
                  <span>{selectedPlanet.orbitalDistance} AU</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Radius:</span>
                  <span>{selectedPlanet.planetRadius} Earth radii</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Mass:</span>
                  <span>{selectedPlanet.planetMass} Earth masses</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Temperature:</span>
                  <span>{selectedPlanet.equilibriumTemperature} K</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Stellar Distance:</span>
                  <span>{selectedPlanet.stellarDistance} pc</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Habitable:</span>
                  <span className={selectedPlanet.habitable ? styles.habitable : styles.notHabitable}>
                    {selectedPlanet.habitable ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Statistics */}
      <div className={styles.statistics}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{exoplanetData.length}</span>
          <span className={styles.statLabel}>Confirmed Exoplanets</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>
            {exoplanetData.filter(p => p.habitable).length}
          </span>
          <span className={styles.statLabel}>Potentially Habitable</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>
            {new Set(exoplanetData.map(p => p.discoveryMethod)).size}
          </span>
          <span className={styles.statLabel}>Discovery Methods</span>
        </div>
      </div>
    </div>
  );
};

export default NASAEyesExoplanets;
