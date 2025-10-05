import { useMemo, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Html } from '@react-three/drei';
import { Vector3 } from 'three';
import type { Exoplanet } from '../types/exoplanet';

// Utility function to convert astronomical coordinates to 3D position
function astronomicalToCartesian(ra: number, dec: number, distance: number): Vector3 {
  // Convert degrees to radians
  const raRad = (ra * Math.PI) / 180;
  const decRad = (dec * Math.PI) / 180;
  
  // Convert distance from parsecs to a reasonable scale (multiply by 0.1 for visualization)
  const scaledDistance = distance * 0.1;
  
  // Convert to Cartesian coordinates
  const x = scaledDistance * Math.cos(decRad) * Math.cos(raRad);
  const y = scaledDistance * Math.sin(decRad);
  const z = scaledDistance * Math.cos(decRad) * Math.sin(raRad);
  
  return new Vector3(x, y, z);
}

// Component for individual exoplanet
function ExoplanetPoint({ exoplanet, index }: { exoplanet: Exoplanet; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  
  const position = useMemo(() => {
    return astronomicalToCartesian(exoplanet.ra, exoplanet.dec, exoplanet.sy_dist);
  }, [exoplanet.ra, exoplanet.dec, exoplanet.sy_dist]);
  
  // Determine planet color based on temperature
  const getPlanetColor = (temp: number) => {
    if (temp < 200) return '#4A90E2'; // Blue for cold planets
    if (temp < 400) return '#7ED321'; // Green for temperate
    if (temp < 600) return '#F5A623'; // Orange for warm
    return '#D0021B'; // Red for hot planets
  };
  
  // Determine planet size based on radius
  const planetSize = Math.max(0.1, Math.min(1.0, (exoplanet.pl_rade || 1) * 0.1));
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setSelected(!selected)}
        scale={hovered ? 1.5 : 1}
      >
        <sphereGeometry args={[planetSize, 16, 16]} />
        <meshStandardMaterial 
          color={getPlanetColor(exoplanet.pl_eqt)} 
          emissive={getPlanetColor(exoplanet.pl_eqt)}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Planet label */}
      {(hovered || selected) && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            <div><strong>{exoplanet.pl_name}</strong></div>
            <div>Host: {exoplanet.hostname}</div>
            <div>Distance: {exoplanet.sy_dist.toFixed(1)} pc</div>
            <div>Radius: {exoplanet.pl_rade?.toFixed(2) || 'N/A'} R⊕</div>
            <div>Temp: {exoplanet.pl_eqt?.toFixed(0) || 'N/A'} K</div>
            <div>Year: {exoplanet.disc_year}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Component for host star
function HostStar({ exoplanet }: { exoplanet: Exoplanet }) {
  const position = useMemo(() => {
    return astronomicalToCartesian(exoplanet.ra, exoplanet.dec, exoplanet.sy_dist);
  }, [exoplanet.ra, exoplanet.dec, exoplanet.sy_dist]);
  
  // Determine star color based on temperature
  const getStarColor = (temp: number) => {
    if (temp < 3000) return '#FF6B35'; // Red
    if (temp < 5000) return '#FFD23F'; // Yellow
    if (temp < 6000) return '#FFFFFF'; // White
    if (temp < 10000) return '#87CEEB'; // Blue-white
    return '#4169E1'; // Blue
  };
  
  const starSize = Math.max(0.2, Math.min(2.0, (exoplanet.st_rad || 1) * 0.3));
  
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[starSize, 32, 32]} />
        <meshStandardMaterial 
          color={getStarColor(exoplanet.st_teff)}
          emissive={getStarColor(exoplanet.st_teff)}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

// Main visualization component
interface ExoplanetVisualizationProps {
  exoplanets: Exoplanet[];
  maxPlanets?: number;
}

export default function ExoplanetVisualization({ exoplanets, maxPlanets = 1000 }: ExoplanetVisualizationProps) {
  const [viewMode, setViewMode] = useState<'all' | 'planets' | 'stars'>('all');
  const [showLabels, setShowLabels] = useState(false);
  
  // Limit the number of planets for performance
  const limitedExoplanets = useMemo(() => {
    return exoplanets.slice(0, maxPlanets);
  }, [exoplanets, maxPlanets]);
  
  // Get unique host stars
  const hostStars = useMemo(() => {
    const starMap = new Map<string, Exoplanet>();
    limitedExoplanets.forEach(planet => {
      if (!starMap.has(planet.hostname)) {
        starMap.set(planet.hostname, planet);
      }
    });
    return Array.from(starMap.values());
  }, [limitedExoplanets]);
  
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '200px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Exoplanet Visualization</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>View Mode:</label>
          <select 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value as any)}
            style={{ width: '100%', padding: '5px', borderRadius: '4px' }}
          >
            <option value="all">All Objects</option>
            <option value="planets">Planets Only</option>
            <option value="stars">Stars Only</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <input 
              type="checkbox" 
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            Show Labels
          </label>
        </div>
        
        <div style={{ fontSize: '12px', color: '#ccc' }}>
          <div>Planets: {limitedExoplanets.length}</div>
          <div>Stars: {hostStars.length}</div>
          <div style={{ marginTop: '10px' }}>
            <div>• Click planets for details</div>
            <div>• Hover for quick info</div>
            <div>• Drag to rotate view</div>
            <div>• Scroll to zoom</div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <div><strong>Statistics</strong></div>
        <div>Total Systems: {hostStars.length}</div>
        <div>Total Planets: {limitedExoplanets.length}</div>
        <div>Avg Distance: {(limitedExoplanets.reduce((sum, p) => sum + p.sy_dist, 0) / limitedExoplanets.length).toFixed(1)} pc</div>
        <div>Discovery Years: {Math.min(...limitedExoplanets.map(p => p.disc_year))} - {Math.max(...limitedExoplanets.map(p => p.disc_year))}</div>
      </div>
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
        {/* Background stars */}
        <Stars 
          radius={300} 
          depth={60} 
          count={20000} 
          factor={7} 
          saturation={0} 
          fade 
          speed={1}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={0.5} />
        
        {/* Render objects based on view mode */}
        {viewMode === 'all' || viewMode === 'stars' ? (
          hostStars.map((star, index) => (
            <HostStar key={`star-${star.hostname}-${index}`} exoplanet={star} />
          ))
        ) : null}
        
        {viewMode === 'all' || viewMode === 'planets' ? (
          limitedExoplanets.map((planet, index) => (
            <ExoplanetPoint key={`planet-${planet.pl_name}-${index}`} exoplanet={planet} index={index} />
          ))
        ) : null}
        
        {/* Center reference point (Earth/Sun) */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.3} />
        </mesh>
        
        {showLabels && (
          <Text
            position={[0, -2, 0]}
            fontSize={1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Solar System
          </Text>
        )}
        
        {/* Camera controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={200}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
