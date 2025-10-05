import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { astronomicalToCartesian } from '../utils/astronomicalUtils';

// Star and exoplanet data structure
interface StarData {
  id: string;
  name: string;
  rightAscension: number; // hours
  declination: number;    // degrees
  distance: number;       // parsecs
  magnitude: number;      // apparent magnitude
  color: string;          // star color
  exoplanets?: ExoplanetData[];
}

interface ExoplanetData {
  id: string;
  name: string;
  radius: number;         // Earth radii
  mass: number;           // Earth masses
  orbitalPeriod: number;  // days
  distance: number;       // AU
}

// Sample star and exoplanet data
const generateStarData = (): StarData[] => {
  const stars: StarData[] = [];
  
  // Generate stars in a spiral pattern around Andromeda
  for (let i = 0; i < 200; i++) {
    const angle = (i / 200) * Math.PI * 4; // Multiple spiral arms
    const radius = 0.3 + (i / 200) * 0.7; // Spiral outward
    const height = (Math.random() - 0.5) * 0.2; // Some vertical spread
    
    const x = Math.cos(angle) * radius;
    const y = height;
    const z = Math.sin(angle) * radius;
    
    // Convert back to astronomical coordinates
    const distance = Math.sqrt(x*x + y*y + z*z) * 1000; // Scale to parsecs
    const rightAscension = (Math.atan2(z, x) + Math.PI) * 12 / Math.PI; // Convert to hours
    const declination = Math.asin(y / distance) * 180 / Math.PI; // Convert to degrees
    
    const hasExoplanets = Math.random() > 0.7; // 30% chance of having exoplanets
    
    stars.push({
      id: `star_${i}`,
      name: `Star ${i + 1}`,
      rightAscension,
      declination,
      distance,
      magnitude: 5 + Math.random() * 10,
      color: hasExoplanets ? '#ffaa00' : '#ffffff',
      exoplanets: hasExoplanets ? [
        {
          id: `planet_${i}_1`,
          name: `Planet ${i + 1}-1`,
          radius: 0.5 + Math.random() * 2,
          mass: 0.1 + Math.random() * 10,
          orbitalPeriod: 1 + Math.random() * 1000,
          distance: 0.01 + Math.random() * 5
        }
      ] : undefined
    });
  }
  
  return stars;
};

// Star component
const Star: React.FC<{
  star: StarData;
  cameraDistance: number;
  isSelected: boolean;
  onSelect: (star: StarData) => void;
}> = ({ star, cameraDistance, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Calculate position from astronomical coordinates
  const position = useMemo(() => {
    const distance = star.distance / 1000; // Scale down for visualization
    const { x, y, z } = astronomicalToCartesian(
      star.rightAscension,
      star.declination,
      distance
    );
    
    return [x, y, z] as [number, number, number];
  }, [star]);
  
  // Scale based on camera distance and star properties
  const scale = useMemo(() => {
    const baseScale = 0.01;
    const distanceScale = Math.max(0.1, cameraDistance / 10);
    const magnitudeScale = Math.max(0.5, 10 - star.magnitude) / 10;
    
    return baseScale * distanceScale * magnitudeScale;
  }, [cameraDistance, star.magnitude]);
  
  // Color based on star type and exoplanet presence
  const color = useMemo(() => {
    if (isSelected) return '#ff0000';
    if (hovered) return '#ffff00';
    return star.color;
  }, [isSelected, hovered, star.color]);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.01;
      
      // Pulsing effect for stars with exoplanets
      if (star.exoplanets) {
        meshRef.current.scale.setScalar(
          scale * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
        );
      }
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={() => onSelect(star)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1, 8, 6]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.8}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

// Main galaxy component
interface AndromedaGalaxyProps {
  onCameraDistanceChange?: (distance: number) => void;
  onStarSelect?: (star: StarData | null) => void;
  onStarsCountChange?: (count: number) => void;
}

const AndromedaGalaxy: React.FC<AndromedaGalaxyProps> = ({
  onCameraDistanceChange,
  onStarSelect,
  onStarsCountChange
}) => {
  const { scene } = useGLTF('/andromeda.glb');
  const [cameraDistance, setCameraDistance] = useState(5);
  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [stars] = useState<StarData[]>(() => generateStarData());
  
  // Clone the galaxy model to avoid conflicts
  const galaxyModel = useMemo(() => {
    const cloned = scene.clone();
    cloned.scale.setScalar(0.5);
    cloned.position.set(0, 0, 0);
    return cloned;
  }, [scene]);
  
  // Update camera distance based on zoom
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      setCameraDistance(prev => {
        const newDistance = prev + event.deltaY * 0.01;
        const clampedDistance = Math.max(1, Math.min(20, newDistance));
        onCameraDistanceChange?.(clampedDistance);
        return clampedDistance;
      });
    };
    
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [onCameraDistanceChange]);

  // Notify parent components of changes
  useEffect(() => {
    onStarsCountChange?.(stars.length);
  }, [stars.length, onStarsCountChange]);

  const handleStarSelect = (star: StarData) => {
    setSelectedStar(star);
    onStarSelect?.(star);
  };
  
  return (
    <>
      {/* Galaxy Model */}
      <primitive object={galaxyModel} />
      
      {/* Stars and Exoplanets */}
      {stars.map((star) => (
        <Star
          key={star.id}
          star={star}
          cameraDistance={cameraDistance}
          isSelected={selectedStar?.id === star.id}
          onSelect={handleStarSelect}
        />
      ))}
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
    </>
  );
};

export default AndromedaGalaxy;
