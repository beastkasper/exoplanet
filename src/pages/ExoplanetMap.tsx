import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF, Html } from '@react-three/drei';
import { fetchExoplanets } from '../api/exoplanets';
import ExoplanetModal from '../components/modals/ExoplanetModal';
import type { Exoplanet } from '../types/exoplanet';

// Sun's position in galactic coordinates (8.3 kpc from galactic center)
const SUN_POSITION: [number, number, number] = [8.3, 0, 0]; // 8.3 kpc from center

// Individual Exoplanet component with hover and click functionality
const ExoplanetPoint: React.FC<{ 
  planet: Exoplanet; 
  position: [number, number, number]; 
  scale: number;
  onPlanetClick: (planet: Exoplanet) => void;
  isSelected: boolean;
  isAnimating: boolean;
}> = ({ planet, position, scale, onPlanetClick, isSelected, isAnimating }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Color based on planet properties and selection state
  const getPlanetColor = useCallback(() => {
    if (isSelected) return '#FF00FF'; // Magenta for selected planet
    if (planet.sy_dist && planet.sy_dist < 50) return '#4CAF50'; // Green for nearby
    if (planet.pl_rade && planet.pl_rade > 2) return '#FF5722'; // Red for large
    if (planet.pl_rade && planet.pl_rade < 0.5) return '#2196F3'; // Blue for small
    return '#FFC107'; // Yellow for others
  }, [planet.sy_dist, planet.pl_rade, isSelected]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setClicked(true);
    onPlanetClick(planet);
    setTimeout(() => setClicked(false), 2000);
  }, [planet, onPlanetClick]);

  // Calculate dynamic scale based on selection and animation
  const dynamicScale = useMemo(() => {
    let baseScale = scale;
    if (isSelected) baseScale *= 3; // Make selected planet much larger
    if (hovered) baseScale *= 1.5;
    if (clicked) baseScale *= 2;
    if (isAnimating && isSelected) baseScale *= 1.5; // Pulse effect during animation
    return baseScale;
  }, [scale, isSelected, hovered, clicked, isAnimating]);

  return (
    <group position={position}>
      <mesh
        scale={dynamicScale}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial 
          color={getPlanetColor()}
          transparent
          opacity={hovered || isSelected ? 1 : 0.8}
        />
      </mesh>
      
      {/* Glow effect for selected planet */}
      {isSelected && (
        <mesh scale={dynamicScale * 1.5}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial 
            color={getPlanetColor()}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Tooltip on hover */}
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            pointerEvents: 'none'
          }}>
            <div><strong>{planet.pl_name}</strong></div>
            <div>Distance: {planet.sy_dist?.toFixed(1)} pc</div>
            {planet.pl_rade && <div>Radius: {planet.pl_rade.toFixed(2)} R⊕</div>}
            {planet.pl_orbper && <div>Period: {planet.pl_orbper.toFixed(1)} days</div>}
          </div>
        </Html>
      )}
    </group>
  );
};

// Galaxy component with exoplanets
const GalaxyWithExoplanets: React.FC<{ 
  exoplanets: Exoplanet[];
  maxPlanets: number;
  onPlanetClick: (planet: Exoplanet) => void;
  selectedPlanet: Exoplanet | null;
  isAnimating: boolean;
}> = ({ exoplanets, maxPlanets, onPlanetClick, selectedPlanet, isAnimating }) => {
  const { scene } = useGLTF('/andromeda.glb');
  const [cameraDistance, setCameraDistance] = React.useState(50);
  
  // Clone the galaxy model and position it so Sun is at center
  const galaxyModel = React.useMemo(() => {
    const cloned = scene.clone();
    cloned.scale.setScalar(0.3);
    // Position galaxy so Sun (8.3 kpc from center) is at origin
    cloned.position.set(-SUN_POSITION[0] * 0.1, -SUN_POSITION[1] * 0.1, -SUN_POSITION[2] * 0.1);
    return cloned;
  }, [scene]);
  
  // Convert astronomical coordinates to 3D position
  const astronomicalToCartesian = useCallback((ra: number, dec: number, distance: number): [number, number, number] => {
    const raRad = (ra * 15 * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;
    
    const x = distance * Math.cos(decRad) * Math.cos(raRad);
    const y = distance * Math.cos(decRad) * Math.sin(raRad);
    const z = distance * Math.sin(decRad);
    
    return [x, y, z];
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
      
      {/* Sun indicator at center */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Sun glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Background stars */}
      <Stars 
        radius={1000} 
        depth={100} 
        count={3000} 
        factor={4} 
        saturation={0} 
        fade 
      />
      
      {/* Exoplanets */}
      {useMemo(() => {
        const visiblePlanets = exoplanets.slice(0, Math.min(maxPlanets, 500));
        
        return visiblePlanets.map((planet, index) => {
          const position = astronomicalToCartesian(
            planet.ra || 0,
            planet.dec || 0,
            (planet.sy_dist || 1) / 100 // Scale down for visualization
          );
          
          // Scale based on camera distance - objects get smaller and spread out when zooming in
          const baseScale = 0.005; // Very small base scale
          const distanceScale = Math.max(0.1, cameraDistance / 50); // Scale based on camera distance
          const planetScale = Math.max(0.001, (planet.pl_rade || 1) / 100); // Very small planet scale
          const finalScale = baseScale * distanceScale * planetScale;
          
          return (
            <ExoplanetPoint
              key={`${planet.pl_name || index}`}
              planet={planet}
              position={position}
              scale={finalScale}
              onPlanetClick={onPlanetClick}
              isSelected={selectedPlanet?.pl_name === planet.pl_name}
              isAnimating={isAnimating}
            />
          );
        });
      }, [exoplanets, maxPlanets, cameraDistance, astronomicalToCartesian, onPlanetClick, selectedPlanet, isAnimating])}
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
    </>
  );
};

export default function ExoplanetMap() {
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxPlanets, setMaxPlanets] = useState(500);
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlanetClick = useCallback((planet: Exoplanet) => {
    setSelectedPlanet(planet);
    setIsModalOpen(true);
    console.log('Selected planet:', planet);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
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
    
    // Calculate planet position in 3D space
    const raRad = (planet.ra * 15 * Math.PI) / 180;
    const decRad = (planet.dec * Math.PI) / 180;
    const distance = (planet.sy_dist || 1) / 100; // Scale down for visualization
    
    const planetPosition: [number, number, number] = [
      distance * Math.cos(decRad) * Math.cos(raRad),
      distance * Math.cos(decRad) * Math.sin(raRad),
      distance * Math.sin(decRad)
    ];
    
    // Set camera target to planet position
    setCameraTarget(planetPosition);
    
    // Reset animation after 3 seconds
    setTimeout(() => {
      setIsAnimating(false);
      setCameraTarget(null);
    }, 3000);
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
          minDistance={10}
          maxDistance={1000}
          autoRotate={false}
          target={cameraTarget || [0, 0, 0]} // Orbit around selected planet or Sun
          enableDamping={true}
          dampingFactor={0.05}
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
            min="50"
            max="500"
            step="50"
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
        <div><strong>🌌 Galaxy from Sun's Perspective</strong></div>
        <div>NASA Exoplanet Archive</div>
        <div>Total Available: {exoplanets.length}</div>
        <div>Displaying: {Math.min(maxPlanets, exoplanets.length)}</div>
        <div style={{ marginTop: '10px', color: '#888' }}>
          🟢 Nearby • 🔴 Large • 🔵 Small • 🟡 Others
        </div>
        <div style={{ marginTop: '5px', color: '#FFD700', fontSize: '10px' }}>
          ☀️ View centered on Sun
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
        <div style={{ color: '#FFD700', marginTop: '5px' }}>
          ☀️ Sun is at center
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

      {/* Exoplanet Modal */}
      <ExoplanetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        exoplanet={selectedPlanet}
      />
    </div>
  );
}
