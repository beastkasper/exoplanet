import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF, Html } from '@react-three/drei';
import { fetchExoplanets } from '../api/exoplanets';
import type { Exoplanet } from '../types/exoplanet';
import { equatorialToGalactic, galacticToCartesian, getSunGalacticPosition } from '../utils/astronomicalUtils';
import * as THREE from 'three';

// Get Sun's position using proper galactic coordinate system
const sunPosition = getSunGalacticPosition();
const SUN_POSITION: [number, number, number] = [sunPosition.x, sunPosition.y, sunPosition.z];

console.log('Sun position in galactic coordinates:', SUN_POSITION);

// Enhanced 3D Planet component with detailed model
const Planet3D: React.FC<{
  planet: Exoplanet;
  position: [number, number, number];
  isSelected: boolean;
  onPlanetClick: (planet: Exoplanet) => void;
}> = ({ planet, position, isSelected, onPlanetClick }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Determine planet properties
  const getPlanetColor = useCallback(() => {
    if (isSelected) return '#FF00FF'; // Bright magenta for selected
    if (planet.pl_eqt && planet.pl_eqt > 500) return '#FF6347'; // Orange for hot planets
    if (planet.pl_eqt && planet.pl_eqt < 200) return '#87CEEB'; // Light blue for cold planets
    if (planet.pl_rade && planet.pl_rade > 2) return '#FF4500'; // Red for large planets
    if (planet.pl_rade && planet.pl_rade < 0.5) return '#00BFFF'; // Blue for small planets
    return '#FFFF00'; // Yellow for others
  }, [planet.pl_eqt, planet.pl_rade, isSelected]);

  const getPlanetSize = useCallback(() => {
    const baseSize = 0.5;
    const sizeMultiplier = Math.max(0.3, Math.min(2.0, (planet.pl_rade || 1) * 0.5));
    return baseSize * sizeMultiplier;
  }, [planet.pl_rade]);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (isSelected) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.2 : 1.0);
      }
    }
  });

  return (
    <group position={position}>
      {/* Main planet sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onPlanetClick(planet);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[getPlanetSize(), 32, 32]} />
        <meshStandardMaterial 
          color={getPlanetColor()}
          emissive={getPlanetColor()}
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Atmospheric layer for larger planets */}
      {(planet.pl_rade && planet.pl_rade > 1.5) && (
        <mesh scale={1.1}>
          <sphereGeometry args={[getPlanetSize(), 16, 16]} />
          <meshBasicMaterial 
            color={getPlanetColor()}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Glow effect for selected planet */}
      {isSelected && (
        <mesh scale={1.5}>
          <sphereGeometry args={[getPlanetSize(), 16, 16]} />
          <meshBasicMaterial 
            color={getPlanetColor()}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
      
      {/* Planet label */}
      {(hovered || isSelected) && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none'
          }}>
            <div><strong>{planet.pl_name}</strong></div>
            <div>Host: {planet.hostname}</div>
            <div>Distance: {planet.sy_dist?.toFixed(1)} pc</div>
            {planet.pl_rade && <div>Radius: {planet.pl_rade.toFixed(2)} R⊕</div>}
            {planet.pl_eqt && <div>Temp: {planet.pl_eqt.toFixed(0)} K</div>}
          </div>
        </Html>
      )}
    </group>
  );
};

// Animated Sun component with pulsing corona effects
const AnimatedSun: React.FC = () => {
  const coronaRef1 = React.useRef<THREE.Mesh>(null);
  const coronaRef2 = React.useRef<THREE.Mesh>(null);
  const coronaRef3 = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate corona layers with different frequencies - More visible
    if (coronaRef1.current) {
      const scale1 = 1.2 + Math.sin(time * 2) * 0.1;
      const opacity1 = 0.6 + Math.sin(time * 1.5) * 0.2;
      coronaRef1.current.scale.setScalar(scale1);
      (coronaRef1.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0.4, opacity1);
    }
    
    if (coronaRef2.current) {
      const scale2 = 1.4 + Math.sin(time * 1.5) * 0.15;
      const opacity2 = 0.4 + Math.sin(time * 1.2) * 0.2;
      coronaRef2.current.scale.setScalar(scale2);
      (coronaRef2.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0.2, opacity2);
    }
    
    if (coronaRef3.current) {
      const scale3 = 1.6 + Math.sin(time * 1) * 0.2;
      const opacity3 = 0.3 + Math.sin(time * 0.8) * 0.15;
      coronaRef3.current.scale.setScalar(scale3);
      (coronaRef3.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0.15, opacity3);
    }
  });

  return (
    <group position={SUN_POSITION}>
      {/* Core Sun - Much larger and more visible */}
      <mesh>
        <sphereGeometry args={[1.0, 32, 32]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent
          opacity={1.0}
        />
      </mesh>
      
      {/* Animated Corona layer 1 - More visible */}
      <mesh ref={coronaRef1}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color="#FFA500" 
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Animated Corona layer 2 - More visible */}
      <mesh ref={coronaRef2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color="#FF6347" 
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Animated Corona layer 3 - More visible */}
      <mesh ref={coronaRef3}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color="#FF1493" 
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

// Note: Legacy ExoplanetPoint removed after Planet3D introduction

// Galaxy component with exoplanets
const GalaxyWithExoplanets: React.FC<{ 
  exoplanets: Exoplanet[];
  maxPlanets: number;
  onPlanetClick: (planet: Exoplanet) => void;
  selectedPlanet: Exoplanet | null;
  isAnimating: boolean;
}> = ({ exoplanets, maxPlanets, onPlanetClick, selectedPlanet }) => {
  // Load galaxy model from public folder
  const { scene } = useGLTF('/andromeda.glb');
  const [cameraDistance, setCameraDistance] = React.useState(50);
  
  // Clone the galaxy model and position it correctly
  const galaxyModel = React.useMemo(() => {
    const cloned = scene.clone();
    cloned.scale.setScalar(0.4); // Slightly larger for better visibility
    
    // Position galaxy so the galactic center is at origin
    // The galaxy model should have its center at (0,0,0)
    // Sun will be positioned at its actual location relative to galactic center
    cloned.position.set(0, 0, 0);
    
    // Add subtle rotation to the galaxy for dynamic effect
    cloned.rotation.y = Math.PI * 0.1; // Slight tilt for better perspective
    
    console.log('Galaxy model positioned at origin, Sun at:', SUN_POSITION);
    
    return cloned;
  }, [scene]);
  
  // Convert astronomical coordinates to 3D position using unified galactic coordinate system
  const astronomicalToCartesian = useCallback((ra: number, dec: number, distance: number): [number, number, number] => {
    // Convert equatorial coordinates to galactic coordinates
    const galacticCoords = equatorialToGalactic(ra, dec);
    
    // Convert galactic coordinates to Cartesian coordinates
    // This gives us the position relative to the galactic center
    const galacticPos = galacticToCartesian(
      galacticCoords.l, 
      galacticCoords.b, 
      distance / 1000 // Convert parsecs to kpc
    );
    
    // Return position relative to galactic center (not Sun)
    // This ensures all objects are in the same coordinate system
    return [galacticPos.x, galacticPos.y, galacticPos.z];
  }, []);
  
  // Update camera distance based on zoom
  React.useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      setCameraDistance(prev => {
        const newDistance = prev + event.deltaY * 0.1;
        return Math.max(10, Math.min(200, newDistance));
      });
    };
    
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);
  
  return (
    <>
      {/* Galaxy Model */}
      <primitive object={galaxyModel} />
      
      {/* Animated Sun at center */}
      <AnimatedSun />
      
      {/* Fallback Sun - Always visible at correct galactic position */}
      <mesh position={SUN_POSITION}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent
          opacity={1}
        />
      </mesh>
      
      {/* Enhanced background stars - scaled for galactic coordinate system */}
      <Stars 
        radius={5000} 
        depth={500} 
        count={8000} 
        factor={8} 
        saturation={0} 
        fade 
        speed={0.3}
      />
      
      {/* Exoplanets */}
      {useMemo(() => {
        const visiblePlanets = exoplanets.slice(0, Math.min(maxPlanets, 10));
        
        return visiblePlanets.map((planet, index) => {
          const position = astronomicalToCartesian(
            planet.ra || 0,
            planet.dec || 0,
            (planet.sy_dist || 1) / 100 // Scale down for visualization
          );
          
          // Enhanced scaling for better visibility in unified coordinate system
          // (values computed implicitly within Planet3D via size)
          
          return (
            <Planet3D
              key={`${planet.pl_name || index}`}
              planet={planet}
              position={position}
              isSelected={selectedPlanet?.pl_name === planet.pl_name}
              onPlanetClick={onPlanetClick}
            />
          );
        });
      }, [exoplanets, maxPlanets, cameraDistance, astronomicalToCartesian, onPlanetClick, selectedPlanet])}
      
      {/* Enhanced lighting for galaxy visibility */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={3.0} color="#FFD700" />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <directionalLight position={[0, 0, 10]} intensity={0.3} />
    </>
  );
};

export default function ExoplanetMap() {
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxPlanets, setMaxPlanets] = useState(10);
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);

  const handlePlanetClick = useCallback((planet: Exoplanet) => {
    setSelectedPlanet(planet);
    console.log('Selected planet:', planet);
  }, []);

  const retryLoading = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setError(null);
  }, []);

  // Function to animate camera to planet position
  const animateToPlanet = useCallback((planet: Exoplanet) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSelectedPlanet(planet);
    
    // Use the unified galactic coordinate system to calculate planet position
    const galacticCoords = equatorialToGalactic(planet.ra || 0, planet.dec || 0);
    const galacticPos = galacticToCartesian(
      galacticCoords.l, 
      galacticCoords.b, 
      (planet.sy_dist || 1) / 1000 // Convert parsecs to kpc
    );
    
    // Position relative to galactic center (same system as Sun)
    const planetPosition: [number, number, number] = [
      galacticPos.x,
      galacticPos.y,
      galacticPos.z
    ];
    
    console.log('Flying to planet:', planet.pl_name, 'at position:', planetPosition);
    
    // Set camera target to planet position
    setCameraTarget(planetPosition);
    
    // Reset animation after 5 seconds to allow user to explore
    setTimeout(() => {
      setIsAnimating(false);
      // Keep camera target set so user stays focused on planet
    }, 5000);
  }, [isAnimating]);

  useEffect(() => {
    const loadExoplanets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const data = await fetchExoplanets() as Exoplanet[];
        clearTimeout(timeoutId);
        
        console.log('Loaded exoplanets:', data.length);
        
        // Filter out planets with missing coordinate data
        const validPlanets = data.filter((planet: Exoplanet) => 
          planet.ra != null && 
          planet.dec != null && 
          planet.sy_dist != null &&
          planet.sy_dist > 0 &&
          planet.pl_name // Ensure planet has a name
        );
        
        console.log('Valid planets with coordinates:', validPlanets.length);
        
        if (validPlanets.length === 0) {
          throw new Error('No valid exoplanets found with coordinate data');
        }
        
        setExoplanets(validPlanets);
        
      } catch (err) {
        console.error('Error loading exoplanets:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load exoplanet data';
        
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timeout - please check your connection and try again');
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    loadExoplanets();
  }, [retryCount]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
        color: 'white',
        fontSize: '18px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid #333',
            borderTop: '3px solid #fff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div>Loading exoplanet data from NASA...</div>
          <div style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>
            Fetching {maxPlanets} exoplanets with coordinate data
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
        color: 'white',
        fontSize: '18px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          <div>Error loading exoplanet data</div>
          <div style={{ fontSize: '14px', color: '#ff6b6b', marginTop: '10px' }}>
            {error}
          </div>
          <button 
            onClick={retryLoading}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Retry ({retryCount > 0 ? `Attempt ${retryCount + 1}` : 'Try Again'})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Planet Selection Dropdown */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        minWidth: '300px'
      }}>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
          🪐 Select Planet to Navigate
        </div>
        <select
          value={selectedPlanet?.pl_name || ''}
          onChange={(e) => {
            const planetName = e.target.value;
            if (planetName) {
              const planet = exoplanets.find(p => p.pl_name === planetName);
              if (planet) {
                animateToPlanet(planet);
              }
            }
          }}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            fontSize: '12px'
          }}
          disabled={isAnimating}
        >
          <option value="">Choose a planet...</option>
          {exoplanets.slice(0, 100).map((planet) => (
            <option key={planet.pl_name} value={planet.pl_name}>
              {planet.pl_name} ({planet.hostname}) - {planet.sy_dist?.toFixed(1)}pc
            </option>
          ))}
        </select>
        {isAnimating && (
          <div style={{ 
            marginTop: '8px', 
            fontSize: '12px', 
            color: '#FFD700',
            textAlign: 'center'
          }}>
            🚀 Flying to {selectedPlanet?.pl_name}...
          </div>
        )}
        
        {/* Return to Sun button */}
        <button
          onClick={() => {
            setSelectedPlanet(null);
            setCameraTarget(null);
            setIsAnimating(false);
          }}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '8px',
            background: 'rgba(255, 215, 0, 0.2)',
            color: '#FFD700',
            border: '1px solid rgba(255, 215, 0, 0.5)',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
          disabled={isAnimating}
        >
          ☀️ Return to Sun
        </button>
      </div>
      
      {/* 3D Galaxy Visualization */}
      <Canvas
        camera={{ 
          position: [0, 0, 50], // Camera positioned to look at Sun (origin)
          fov: 60,
          near: 0.1,
          far: 10000
        }}
        style={{ background: 'radial-gradient(circle, #0a0a0a 0%, #000000 100%)' }}
      >
        <GalaxyWithExoplanets 
          exoplanets={exoplanets} 
          maxPlanets={maxPlanets} 
          onPlanetClick={handlePlanetClick}
          selectedPlanet={selectedPlanet}
          isAnimating={isAnimating}
        />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={2000}
          autoRotate={!isAnimating && !selectedPlanet}
          autoRotateSpeed={0.2}
          target={cameraTarget || [0, 0, 0]} // Orbit around selected planet or Sun
          enableDamping={true}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 6}
          zoomSpeed={0.8}
          rotateSpeed={0.5}
          panSpeed={0.8}
        />
      </Canvas>
      
      {/* Performance controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Max Planets:</label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={maxPlanets}
            onChange={(e) => setMaxPlanets(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ textAlign: 'center', marginTop: '5px' }}>{maxPlanets}</div>
        </div>
        <div style={{ color: '#888' }}>
          Lower for better performance
        </div>
      </div>

      {/* Data info */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div><strong>🌌 Milky Way Galaxy View</strong></div>
        <div>NASA Exoplanet Archive</div>
        <div>Total Available: {exoplanets.length}</div>
        <div>Displaying: {Math.min(maxPlanets, exoplanets.length)}</div>
        <div style={{ marginTop: '10px', color: '#888' }}>
          🟢 Nearby • 🔴 Large • 🔵 Small • 🟡 Others
        </div>
        <div style={{ marginTop: '5px', color: '#FFD700', fontSize: '10px' }}>
          ☀️ Sun at: ({SUN_POSITION[0].toFixed(1)}, {SUN_POSITION[1].toFixed(1)}, {SUN_POSITION[2].toFixed(1)}) kpc
        </div>
        <div style={{ color: '#FFD700', fontSize: '9px' }}>
          l=90°, b=0°, 8.3 kpc from center
        </div>
      </div>
      
      {/* Instructions */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '20px',
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div><strong>🖱️ Controls</strong></div>
        <div>• Drag to rotate around target</div>
        <div>• Scroll to zoom in/out</div>
        <div>• Right-click to pan</div>
        <div>• Click planets for info</div>
        <div>• Use dropdown to fly to planets</div>
        <div>• Click planet to focus camera</div>
        {selectedPlanet && (
          <div style={{ color: '#FF00FF', marginTop: '5px', fontSize: '11px' }}>
            🎯 Focused on {selectedPlanet.pl_name}
          </div>
        )}
        <div style={{ color: '#FFD700', marginTop: '5px' }}>
          ☀️ Unified galactic coordinate system
        </div>
      </div>

      {/* Selected Planet Info */}
      {selectedPlanet && (
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          zIndex: 100,
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          fontSize: '14px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '300px',
          minWidth: '250px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div><strong>🪐 {selectedPlanet.pl_name}</strong></div>
            <button 
              onClick={() => setSelectedPlanet(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0',
                width: '20px',
                height: '20px'
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <div><strong>Host Star:</strong> {selectedPlanet.hostname}</div>
            {selectedPlanet.sy_dist && <div><strong>Distance:</strong> {selectedPlanet.sy_dist.toFixed(1)} parsecs</div>}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            {selectedPlanet.pl_rade && <div><strong>Planet Radius:</strong> {selectedPlanet.pl_rade.toFixed(2)} R⊕</div>}
            {selectedPlanet.pl_masse && <div><strong>Planet Mass:</strong> {selectedPlanet.pl_masse.toFixed(2)} M⊕</div>}
            {selectedPlanet.pl_orbper && <div><strong>Orbital Period:</strong> {selectedPlanet.pl_orbper.toFixed(1)} days</div>}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            {selectedPlanet.pl_eqt && <div><strong>Equilibrium Temp:</strong> {selectedPlanet.pl_eqt.toFixed(0)} K</div>}
            {selectedPlanet.st_teff && <div><strong>Star Temp:</strong> {selectedPlanet.st_teff.toFixed(0)} K</div>}
            {selectedPlanet.st_rad && <div><strong>Star Radius:</strong> {selectedPlanet.st_rad.toFixed(2)} R☉</div>}
          </div>
          
          {selectedPlanet.disc_year && (
            <div style={{ color: '#888', fontSize: '12px' }}>
              Discovered: {selectedPlanet.disc_year}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
