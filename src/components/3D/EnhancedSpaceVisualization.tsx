import React, { useRef, useMemo, useCallback, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Stars, 
  OrbitControls, 
  PerspectiveCamera,
  useGLTF,
  Text,
  Html,
  Environment,
  Sky,
  Cloud,
  PerformanceMonitor,
  AdaptiveDpr,
  AdaptiveEvents
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  DepthOfField, 
  ChromaticAberration,
  Vignette,
  Noise
} from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import type { Exoplanet } from '../../types/exoplanet';
import styles from './SpaceVisualization.module.css';
import { 
  ScrollCameraController, 
  ScrollObjectAnimations,
  ParallaxElement,
  RevealOnScroll,
  StaggeredReveal,
  ScrollProgress,
  MagneticHover,
  FloatingAnimation
} from './ScrollAnimations';

// Enhanced star field with better performance
const EnhancedStarField: React.FC<{ 
  count?: number; 
  radius?: number; 
  speed?: number;
  depth?: number;
}> = ({ count = 5000, radius = 1000, speed = 0.1, depth = 100 }) => {
  const meshRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Create spherical distribution with better clustering
      const radiusVariation = radius + Math.random() * depth;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radiusVariation * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radiusVariation * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radiusVariation * Math.cos(phi);
      
      // Star colors with temperature variation
      const temperature = 3000 + Math.random() * 6000;
      const color = new THREE.Color().setHSL(
        Math.max(0, (temperature - 3000) / 6000 * 0.1),
        0.3 + Math.random() * 0.4,
        0.5 + Math.random() * 0.5
      );
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = 0.5 + Math.random() * 2;
    }
    
    return [positions, colors, sizes];
  }, [count, radius, depth]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = time * speed * 0.1;
      meshRef.current.rotation.y = time * speed * 0.05;
      
      // Enhanced parallax motion
      meshRef.current.position.x = camera.position.x * 0.01;
      meshRef.current.position.y = camera.position.y * 0.01;
      meshRef.current.position.z = camera.position.z * 0.005;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Enhanced planet with PBR materials and better animations
const EnhancedPlanet: React.FC<{
  position: [number, number, number];
  size?: number;
  color?: string;
  orbitRadius?: number;
  orbitSpeed?: number;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
  exoplanet?: Exoplanet;
  isSelected?: boolean;
}> = ({ 
  position, 
  size = 0.5, 
  color = '#4a90e2', 
  orbitRadius = 10, 
  orbitSpeed = 1,
  onHover,
  onClick,
  exoplanet,
  isSelected = false
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (orbitRef.current) {
      const time = state.clock.getElapsedTime();
      orbitRef.current.rotation.y = time * orbitSpeed;
    }
    
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 2;
      
      // Enhanced hover effects
      if (hovered || isSelected) {
        const scale = 1 + (hovered ? 0.3 : 0.2) + Math.sin(time * 5) * 0.1;
        meshRef.current.scale.setScalar(scale);
        meshRef.current.material.emissiveIntensity = hovered ? 0.3 : 0.1;
      } else {
        meshRef.current.scale.setScalar(1);
        meshRef.current.material.emissiveIntensity = 0;
      }
    }
    
    if (atmosphereRef.current) {
      const time = state.clock.getElapsedTime();
      atmosphereRef.current.rotation.y = time * 0.5;
      atmosphereRef.current.rotation.x = time * 0.3;
    }
  });

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    onHover?.(true);
  }, [onHover]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    onHover?.(false);
  }, [onHover]);

  return (
    <group ref={orbitRef} position={position}>
      <mesh
        ref={meshRef}
        position={[orbitRadius, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={onClick}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={0.9}
          emissive={color}
          emissiveIntensity={0}
        />
      </mesh>
      
      {/* Atmosphere */}
      <mesh ref={atmosphereRef} position={[orbitRadius, 0, 0]}>
        <sphereGeometry args={[size * 1.1, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Orbit trail with gradient */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.1, orbitRadius + 0.1, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Planet label with better styling */}
      {exoplanet && (
        <Html distanceFactor={10} position={[orbitRadius, size + 1, 0]}>
          <motion.div
            className={styles.planetLabel}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {exoplanet.pl_name}
          </motion.div>
        </Html>
      )}
    </group>
  );
};

// Enhanced star with better materials
const EnhancedStar: React.FC<{
  position: [number, number, number];
  size?: number;
  color?: string;
  temperature?: number;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
}> = ({ position, size = 1, color = '#ffffff', temperature = 6000, onHover, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.1;
      
      // Enhanced pulsing effect
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      meshRef.current.scale.setScalar(pulse);
      
      // Hover distortion effect
      if (hovered) {
        meshRef.current.scale.setScalar(pulse * 1.2);
        meshRef.current.material.opacity = 0.9;
      } else {
        meshRef.current.material.opacity = 0.7;
      }
    }
    
    if (glowRef.current) {
      const time = state.clock.getElapsedTime();
      const pulse = 1 + Math.sin(time * 1.5) * 0.2;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    onHover?.(true);
  }, [onHover]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    onHover?.(false);
  }, [onHover]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={onClick}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Enhanced glow effect */}
      <mesh ref={glowRef} scale={[size * 3, size * 3, size * 3]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// Main enhanced space scene
const EnhancedSpaceScene: React.FC<{
  exoplanets: Exoplanet[];
  selectedPlanet: Exoplanet | null;
  onPlanetSelect: (planet: Exoplanet | null) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
  hoveredPlanet: Exoplanet | null;
  setHoveredPlanet: (planet: Exoplanet | null) => void;
}> = ({ exoplanets, selectedPlanet, onPlanetSelect, scrollRef, hoveredPlanet, setHoveredPlanet }) => {
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | undefined>();
  const [cameraPosition, setCameraPosition] = useState<THREE.Vector3 | undefined>();

  const handlePlanetClick = useCallback((planet: Exoplanet) => {
    onPlanetSelect(planet);
    
    // Enhanced camera transition
    const distance = 15;
    const angle = Math.random() * Math.PI * 2;
    const height = Math.random() * 10 - 5;
    
    const newPosition = new THREE.Vector3(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    );
    
    setCameraPosition(newPosition);
    setCameraTarget(new THREE.Vector3(0, 0, 0));
  }, [onPlanetSelect]);

  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" />
      <pointLight position={[20, 20, 20]} intensity={0.3} color="#4a90e2" />
      <pointLight position={[-20, -20, -20]} intensity={0.3} color="#ff6b6b" />
      
      {/* Enhanced star field */}
      <EnhancedStarField count={8000} radius={500} speed={0.05} depth={200} />
      
      {/* Central star */}
      <EnhancedStar
        position={[0, 0, 0]}
        size={2}
        color="#ffd700"
        temperature={5778}
        onHover={(hovered) => setHoveredPlanet(hovered ? { pl_name: 'Sun' } as Exoplanet : null)}
      />
      
      {/* Enhanced exoplanets */}
      {exoplanets.slice(0, 10).map((planet, index) => {
        const angle = (index / 10) * Math.PI * 2;
        const radius = 8 + index * 2;
        
        return (
          <EnhancedPlanet
            key={planet.pl_name}
            position={[0, 0, 0]}
            size={0.3 + (planet.pl_rade || 1) * 0.1}
            color={planet.pl_eqt && planet.pl_eqt > 300 ? '#ff6b6b' : '#4a90e2'}
            orbitRadius={radius}
            orbitSpeed={0.5 + Math.random() * 0.5}
            onHover={(hovered) => setHoveredPlanet(hovered ? planet : null)}
            onClick={() => handlePlanetClick(planet)}
            exoplanet={planet}
            isSelected={selectedPlanet?.pl_name === planet.pl_name}
          />
        );
      })}
      
      {/* Scroll-based camera controller */}
      <ScrollCameraController scrollRef={scrollRef} />
      
      {/* Enhanced environment */}
      <Environment preset="night" />
    </>
  );
};

// Main enhanced component
const EnhancedSpaceVisualization: React.FC<{
  exoplanets: Exoplanet[];
  selectedPlanet: Exoplanet | null;
  onPlanetSelect: (planet: Exoplanet | null) => void;
}> = ({ exoplanets, selectedPlanet, onPlanetSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [performance, setPerformance] = useState<'high' | 'medium' | 'low'>('high');
  const [hoveredPlanet, setHoveredPlanet] = useState<Exoplanet | null>(null);

  return (
    <div ref={scrollRef} className={styles.container}>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <PerformanceMonitor
          onIncline={(api) => {
            setPerformance('high');
            api.setDpr(2);
          }}
          onDecline={(api) => {
            setPerformance('low');
            api.setDpr(1);
          }}
        />
        
        <AdaptiveDpr pixelRatio={[1, 2]} />
        <AdaptiveEvents />
        
        <Suspense fallback={null}>
          <EnhancedSpaceScene
            exoplanets={exoplanets}
            selectedPlanet={selectedPlanet}
            onPlanetSelect={onPlanetSelect}
            scrollRef={scrollRef}
            hoveredPlanet={hoveredPlanet}
            setHoveredPlanet={setHoveredPlanet}
          />
        </Suspense>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={100}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
        
        {/* Enhanced post-processing effects */}
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
          <DepthOfField
            focusDistance={0.1}
            focalLength={0.02}
            bokehScale={2}
          />
          <ChromaticAberration
            offset={[0.001, 0.001]}
          />
          <Vignette
            eskil={false}
            offset={0.1}
            darkness={0.5}
          />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
      
      {/* Enhanced UI Overlay */}
      <div className={styles.uiOverlay}>
        <AnimatePresence>
          {selectedPlanet && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className={styles.planetInfo}
            >
              <h3>{selectedPlanet.pl_name}</h3>
              <p>Host Star: {selectedPlanet.hostname}</p>
              {selectedPlanet.sy_dist && (
                <p>Distance: {selectedPlanet.sy_dist.toFixed(1)} parsecs</p>
              )}
              {selectedPlanet.pl_rade && (
                <p>Radius: {selectedPlanet.pl_rade.toFixed(2)} R⊕</p>
              )}
              {selectedPlanet.pl_eqt && (
                <p>Temperature: {selectedPlanet.pl_eqt.toFixed(0)} K</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {hoveredPlanet && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={styles.hoverInfo}
            >
              {hoveredPlanet.pl_name}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Scroll progress indicator */}
        <ScrollProgress scrollRef={scrollRef} className={styles.scrollProgress} />
        
        {/* Performance indicator */}
        <div className={styles.performanceInfo}>
          Performance: {performance}
        </div>
        
        {/* Controls hint */}
        <div className={styles.controlsHint}>
          <h4>🖱️ Controls</h4>
          <ul>
            <li>Drag to rotate</li>
            <li>Scroll to zoom</li>
            <li>Click planets for details</li>
            <li>Scroll for camera movement</li>
          </ul>
        </div>
      </div>
      
      {/* Light rays effect */}
      <div className={styles.lightRays} />
      
      {/* Cinematic bars */}
      <div className={styles.cinematicBars} />
    </div>
  );
};

export default EnhancedSpaceVisualization;
