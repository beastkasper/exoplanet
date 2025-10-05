import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
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
  Cloud
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  DepthOfField, 
  ChromaticAberration,
  Vignette,
  Noise
} from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import type { Exoplanet } from '../../types/exoplanet';
import styles from './SpaceVisualization.module.css';

// Star field component with parallax motion
const StarField: React.FC<{ 
  count?: number; 
  radius?: number; 
  speed?: number;
  depth?: number;
}> = ({ count = 5000, radius = 1000, speed = 0.1, depth = 100 }) => {
  const meshRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create spherical distribution
      const radiusVariation = radius + Math.random() * depth;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radiusVariation * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radiusVariation * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radiusVariation * Math.cos(phi);
      
      // Star colors (white to blue-white)
      const colorIntensity = 0.5 + Math.random() * 0.5;
      colors[i * 3] = colorIntensity;
      colors[i * 3 + 1] = colorIntensity;
      colors[i * 3 + 2] = colorIntensity + Math.random() * 0.3;
    }
    
    return [positions, colors];
  }, [count, radius, depth]);

  useFrame((state) => {
    if (meshRef.current) {
      // Parallax motion based on camera movement
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = time * speed * 0.1;
      meshRef.current.rotation.y = time * speed * 0.05;
      
      // Subtle position offset based on camera
      meshRef.current.position.x = camera.position.x * 0.01;
      meshRef.current.position.y = camera.position.y * 0.01;
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

// Floating particle dust
const ParticleDust: React.FC<{ count?: number }> = ({ count = 1000 }) => {
  const meshRef = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      
      // Dust colors (brownish)
      colors[i * 3] = 0.3 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.2 + Math.random() * 0.1;
      colors[i * 3 + 2] = 0.1 + Math.random() * 0.1;
    }
    
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.02;
      meshRef.current.rotation.x = time * 0.01;
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
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Enhanced star component with PBR materials
const Star: React.FC<{
  position: [number, number, number];
  size?: number;
  color?: string;
  temperature?: number;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
}> = ({ position, size = 1, color = '#ffffff', temperature = 6000, onHover, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 0.1;
      
      // Pulsing effect
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
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh scale={[size * 2, size * 2, size * 2]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// Planet component with orbit animation
const Planet: React.FC<{
  position: [number, number, number];
  size?: number;
  color?: string;
  orbitRadius?: number;
  orbitSpeed?: number;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
  exoplanet?: Exoplanet;
}> = ({ 
  position, 
  size = 0.5, 
  color = '#4a90e2', 
  orbitRadius = 10, 
  orbitSpeed = 1,
  onHover,
  onClick,
  exoplanet
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (orbitRef.current) {
      const time = state.clock.getElapsedTime();
      orbitRef.current.rotation.y = time * orbitSpeed;
    }
    
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = time * 2;
      
      // Hover distortion effect
      if (hovered) {
        meshRef.current.scale.setScalar(1.3);
        meshRef.current.material.emissiveIntensity = 0.2;
      } else {
        meshRef.current.scale.setScalar(1);
        meshRef.current.material.emissiveIntensity = 0;
      }
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
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Orbit trail */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.1, orbitRadius + 0.1, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Planet label */}
      {exoplanet && (
        <Html distanceFactor={10} position={[orbitRadius, size + 1, 0]}>
          <div className={styles.planetLabel}>
            {exoplanet.pl_name}
          </div>
        </Html>
      )}
    </group>
  );
};

// Camera controller for smooth transitions
const CameraController: React.FC<{
  target?: THREE.Vector3;
  position?: THREE.Vector3;
  duration?: number;
}> = ({ target, position, duration = 2000 }) => {
  const { camera } = useThree();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (target || position) {
      setIsTransitioning(true);
      
      const startPosition = camera.position.clone();
      const startTarget = new THREE.Vector3();
      camera.getWorldDirection(startTarget);
      startTarget.add(camera.position);
      
      const endPosition = position || camera.position;
      const endTarget = target || startTarget;
      
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        camera.position.lerpVectors(startPosition, endPosition, easeProgress);
        
        if (progress >= 1) {
          setIsTransitioning(false);
        } else {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [target, position, duration, camera]);

  return null;
};

// Main space scene component
const SpaceScene: React.FC<{
  exoplanets: Exoplanet[];
  selectedPlanet: Exoplanet | null;
  onPlanetSelect: (planet: Exoplanet | null) => void;
}> = ({ exoplanets, selectedPlanet, onPlanetSelect }) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<Exoplanet | null>(null);
  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | undefined>();
  const [cameraPosition, setCameraPosition] = useState<THREE.Vector3 | undefined>();

  const handlePlanetClick = useCallback((planet: Exoplanet) => {
    onPlanetSelect(planet);
    
    // Calculate camera position for planet view
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
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#ffffff" />
      
      {/* Star field */}
      <StarField count={8000} radius={500} speed={0.05} depth={200} />
      
      {/* Particle dust */}
      <ParticleDust count={2000} />
      
      {/* Central star */}
      <Star
        position={[0, 0, 0]}
        size={2}
        color="#ffd700"
        temperature={5778}
        onHover={(hovered) => setHoveredPlanet(hovered ? { pl_name: 'Sun' } as Exoplanet : null)}
      />
      
      {/* Exoplanets */}
      {exoplanets.slice(0, 10).map((planet, index) => {
        const angle = (index / 10) * Math.PI * 2;
        const radius = 8 + index * 2;
        const planetPosition: [number, number, number] = [
          Math.cos(angle) * radius,
          Math.sin(angle) * 0.5,
          Math.sin(angle) * radius
        ];
        
        return (
          <Planet
            key={planet.pl_name}
            position={[0, 0, 0]}
            size={0.3 + (planet.pl_rade || 1) * 0.1}
            color={planet.pl_eqt && planet.pl_eqt > 300 ? '#ff6b6b' : '#4a90e2'}
            orbitRadius={radius}
            orbitSpeed={0.5 + Math.random() * 0.5}
            onHover={(hovered) => setHoveredPlanet(hovered ? planet : null)}
            onClick={() => handlePlanetClick(planet)}
            exoplanet={planet}
          />
        );
      })}
      
      {/* Camera controller */}
      <CameraController target={cameraTarget} position={cameraPosition} />
      
      {/* Environment */}
      <Environment preset="night" />
    </>
  );
};

// Main component
const SpaceVisualization: React.FC<{
  exoplanets: Exoplanet[];
  selectedPlanet: Exoplanet | null;
  onPlanetSelect: (planet: Exoplanet | null) => void;
}> = ({ exoplanets, selectedPlanet, onPlanetSelect }) => {
  return (
    <div className={styles.container}>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <SpaceScene
          exoplanets={exoplanets}
          selectedPlanet={selectedPlanet}
          onPlanetSelect={onPlanetSelect}
        />
        
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
        
        {/* Post-processing effects */}
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
      
      {/* UI Overlay */}
      <div className={styles.uiOverlay}>
        {selectedPlanet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
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
          </motion.div>
        )}
        
        {hoveredPlanet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={styles.hoverInfo}
          >
            {hoveredPlanet.pl_name}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SpaceVisualization;
