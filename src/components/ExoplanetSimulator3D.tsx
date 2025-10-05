import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface ExoplanetSimulator3DProps {
  starRadius: number;
  planetRadius: number;
  orbitalRadius: number;
  orbitalPeriod: number;
  orbitalInclination: number;
  animationSpeed: number;
  viewAzimuth: number;
  viewElevation: number;
  limbDarkening: number;
  starTemperature: string;
  isPlaying: boolean;
  activeView: string;
}

interface LightCurveData {
  time: number;
  lightLevel: number;
  cycle: number;
}

// Enhanced star with realistic shaders and limb darkening
function RealisticStar({ 
  radius, 
  temperature, 
  limbDarkening 
}: { 
  radius: number; 
  temperature: string;
  limbDarkening: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const getStarColor = (temp: string): THREE.Color => {
    switch (temp) {
      case 'F-type': return new THREE.Color(0xCAE1FF); // Blue-white (6000-7500K)
      case 'G-type': return new THREE.Color(0xFFE484); // Yellow-white like Sun (5200-6000K)
      case 'K-type': return new THREE.Color(0xFF9955); // Orange (3700-5200K)
      case 'M-type': return new THREE.Color(0xFF6644); // Red-orange (2400-3700K)
      default: return new THREE.Color(0xFFE484);
    }
  };

  const starColor = getStarColor(temperature);
  
  // Custom shader for limb darkening effect
  const starMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        starColor: { value: starColor },
        limbDarkening: { value: limbDarkening },
        glowIntensity: { value: 1.5 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 starColor;
        uniform float limbDarkening;
        uniform float glowIntensity;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          // Calculate limb darkening
          float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
          intensity = max(intensity, 0.0);
          
          // Apply limb darkening formula
          float darkening = 1.0 - limbDarkening * (1.0 - intensity);
          darkening = max(darkening, 0.3);
          
          // Add core brightness
          float coreBrightness = pow(intensity, 0.5);
          vec3 finalColor = starColor * (darkening + coreBrightness * glowIntensity);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.FrontSide,
    });
  }, [starColor, limbDarkening]);

  return (
    <group>
      {/* Main star body with limb darkening */}
      <mesh ref={meshRef} material={starMaterial}>
        <sphereGeometry args={[radius, 64, 64]} />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[radius * 1.1, 32, 32]} />
        <meshBasicMaterial 
          color={starColor}
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.3, 32, 32]} />
        <meshBasicMaterial 
          color={starColor}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Point light for illumination */}
      <pointLight 
        color={starColor}
        intensity={2}
        distance={radius * 10}
      />
    </group>
  );
}

// Realistic exoplanet with atmosphere and proper shading
function RealisticPlanet({ 
  radius,
  position 
}: { 
  radius: number;
  position: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Rotate planet for dynamic effect
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position}>
      {/* Planet surface */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial 
          color={0x3a5f7d}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Atmospheric glow */}
      <mesh>
        <sphereGeometry args={[radius * 1.15, 32, 32]} />
        <meshBasicMaterial 
          color={0x4a9eff}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Orbital path visualization
function OrbitalPath({ radius, inclination }: { radius: number; inclination: number }) {
  const points = [];
  const segments = 128;
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = 0;
    const z = Math.sin(angle) * radius;
    points.push(new THREE.Vector3(x, y, z));
  }
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line rotation-x={((90 - inclination) * Math.PI) / 180}>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" color={0x444444} transparent opacity={0.5} />
    </line>
  );
}

// Camera controller component
function CameraController({ viewAzimuth, viewElevation }: { viewAzimuth: number; viewElevation: number }) {
  useFrame(({ camera }) => {
    // Convert azimuth and elevation to camera position
    const distance = 50; // Zoomed out 200% (was 25)
    const azimuthRad = (viewAzimuth * Math.PI) / 180;
    const elevationRad = (viewElevation * Math.PI) / 180;
    
    // Spherical to Cartesian conversion
    const x = distance * Math.cos(elevationRad) * Math.cos(azimuthRad);
    const y = distance * Math.sin(elevationRad);
    const z = distance * Math.cos(elevationRad) * Math.sin(azimuthRad);
    
    // Smoothly move camera
    camera.position.lerp(new THREE.Vector3(x, y, z), 0.1);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Main 3D scene
function TransitScene({
  starRadius,
  planetRadius,
  orbitalRadius,
  orbitalPeriod,
  orbitalInclination,
  animationSpeed,
  starTemperature,
  limbDarkening,
  isPlaying,
  viewAzimuth,
  viewElevation,
  onPlanetPosition,
  onTransitStatus
}: ExoplanetSimulator3DProps & {
  onPlanetPosition: (pos: [number, number, number]) => void;
  onTransitStatus: (isTransiting: boolean) => void;
}) {
  const [angle, setAngle] = useState(0);
  const timeRef = useRef(0);
  
  useFrame((state, delta) => {
    if (!isPlaying) return;
    
    timeRef.current += delta * animationSpeed;
    const newAngle = (timeRef.current / orbitalPeriod) * Math.PI * 2;
    setAngle(newAngle);
    
    // Calculate planet position in 3D space with proper orbital inclination
    // Start with circular orbit in X-Z plane, then rotate by inclination around X-axis
    const inclinationRad = ((90 - orbitalInclination) * Math.PI) / 180;
    const scaledRadius = orbitalRadius / 10; // Scale down for 3D view
    
    // Base circular orbit
    const x = Math.cos(newAngle) * scaledRadius;
    const zBase = Math.sin(newAngle) * scaledRadius;
    
    // Apply inclination rotation around X-axis
    const y = zBase * Math.sin(inclinationRad);
    const z = zBase * Math.cos(inclinationRad);
    
    onPlanetPosition([x, y, z]);
    
    // Check if planet is transiting (between observer and star)
    // Transit occurs when z > 0 (planet in front) and planet is aligned with star
    const scaledStarRadius = starRadius / 10;
    const scaledPlanetRadius = planetRadius / 10;
    const isTransiting = z > 0 && 
                        Math.abs(x) < scaledStarRadius && 
                        Math.abs(y) < scaledStarRadius;
    
    onTransitStatus(isTransiting);
  });
  
  const planetPosition: [number, number, number] = useMemo(() => {
    const inclinationRad = ((90 - orbitalInclination) * Math.PI) / 180;
    const scaledRadius = orbitalRadius / 10;
    
    // Base circular orbit in X-Z plane
    const x = Math.cos(angle) * scaledRadius;
    const zBase = Math.sin(angle) * scaledRadius;
    
    // Apply inclination rotation around X-axis
    const y = zBase * Math.sin(inclinationRad);
    const z = zBase * Math.cos(inclinationRad);
    
    return [x, y, z];
  }, [angle, orbitalRadius, orbitalInclination]);
  
  return (
    <>
      {/* Starfield background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0}
        fade 
        speed={0.5}
      />
      
      <RealisticStar 
        radius={starRadius / 10}
        temperature={starTemperature}
        limbDarkening={limbDarkening}
      />
      
      <RealisticPlanet 
        radius={planetRadius / 10}
        position={planetPosition}
      />
      
      <OrbitalPath 
        radius={orbitalRadius / 10}
        inclination={orbitalInclination}
      />
      
      <ambientLight intensity={0.1} />
      <CameraController viewAzimuth={viewAzimuth} viewElevation={viewElevation} />
      <OrbitControls enablePan={false} enableRotate={true} />
    </>
  );
}

// Light curve chart component - clean line only
const LightCurveChart: React.FC<{
  data: LightCurveData[];
  currentCycle: number;
  maxCycles: number;
}> = ({ data, currentCycle, maxCycles }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (data.length === 0) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 10; // Minimal padding, no axes
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    
    // Draw light curve - only the line, no axes or grid
    if (data.length > 1) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      
      ctx.beginPath();
      
      data.forEach((point, i) => {
        const normalizedCycle = (point.cycle - 1) / maxCycles;
        const timeInCycle = (point.time % 1) || 0;
        const x = padding + ((normalizedCycle + timeInCycle / maxCycles) * graphWidth);
        
        // Make dips 300% deeper (multiply deviation from 1.0 by 4)
        const depthMultiplier = 4;
        const deviation = 1.0 - point.lightLevel;
        const enhancedLightLevel = 1.0 - (deviation * depthMultiplier);
        
        const y = padding + ((1 - enhancedLightLevel) * graphHeight);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow
      
      // Draw current position indicator
      if (data.length > 0) {
        const lastPoint = data[data.length - 1];
        const normalizedCycle = (lastPoint.cycle - 1) / maxCycles;
        const timeInCycle = (lastPoint.time % 1) || 0;
        const x = padding + ((normalizedCycle + timeInCycle / maxCycles) * graphWidth);
        
        const depthMultiplier = 4;
        const deviation = 1.0 - lastPoint.lightLevel;
        const enhancedLightLevel = 1.0 - (deviation * depthMultiplier);
        const y = padding + ((1 - enhancedLightLevel) * graphHeight);
        
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
  }, [data, currentCycle, maxCycles]);
  
  return (
    <div style={{ 
      position: 'absolute', 
      top: 20, 
      left: '50%',
      transform: 'translateX(-50%)',
      width: 500, 
      padding: '12px 15px'
    }}>
      <div style={{ 
        color: '#ffffff', 
        fontSize: '12px', 
        marginBottom: '8px', 
        textAlign: 'center',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        textShadow: '0 0 10px rgba(255,255,255,0.5)'
      }}>
        Light Curve - Cycle {Math.min(currentCycle, maxCycles)}/{maxCycles}
      </div>
      <canvas
        ref={canvasRef}
        width={470}
        height={80}
        style={{ width: '100%', height: '80px' }}
      />
    </div>
  );
};

// Main component
export default function ExoplanetSimulator3D(props: ExoplanetSimulator3DProps) {
  const [lightCurveData, setLightCurveData] = useState<LightCurveData[]>([]);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isTransiting, setIsTransiting] = useState(false);
  const [planetPosition, setPlanetPosition] = useState<[number, number, number]>([0, 0, 0]);
  const maxCycles = 4;
  const timeRef = useRef(0);
  const lastRecordedTimeRef = useRef(0);
  
  // Reset on restart
  useEffect(() => {
    if (!props.isPlaying) {
      return;
    }
    
    // If starting fresh, reset everything
    if (lightCurveData.length === 0) {
      timeRef.current = 0;
      lastRecordedTimeRef.current = 0;
      setCurrentCycle(1);
    }
  }, [props.isPlaying]);
  
  // Record light curve data
  useEffect(() => {
    if (!props.isPlaying) return;
    
    const interval = setInterval(() => {
      timeRef.current += 0.05 * props.animationSpeed;
      
      // Calculate which cycle we're in
      const cycle = Math.floor(timeRef.current / props.orbitalPeriod) + 1;
      
      // If we've completed maxCycles, restart
      if (cycle > maxCycles) {
        setLightCurveData([]);
        setCurrentCycle(1);
        timeRef.current = 0;
        lastRecordedTimeRef.current = 0;
        return;
      }
      
      // Update current cycle
      if (cycle !== currentCycle) {
        setCurrentCycle(cycle);
      }
      
      // Calculate normalized time within the entire simulation (0 to maxCycles)
      const normalizedTime = timeRef.current / props.orbitalPeriod;
      
      // Calculate light level based on transit status
      let lightLevel = 1.0;
      if (isTransiting) {
        const transitDepth = Math.pow(props.planetRadius / props.starRadius, 2);
        lightLevel = Math.max(0.7, 1 - transitDepth);
      }
      
      // Only record data points at reasonable intervals
      if (timeRef.current - lastRecordedTimeRef.current >= 0.05) {
        setLightCurveData(prev => [...prev, {
          time: normalizedTime,
          lightLevel,
          cycle
        }]);
        lastRecordedTimeRef.current = timeRef.current;
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [props.isPlaying, props.orbitalPeriod, props.animationSpeed, props.starRadius, props.planetRadius, isTransiting, currentCycle, maxCycles]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 10, 50], fov: 50 }}
        style={{ background: '#000' }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Stars background */}
        <pointLight position={[100, 100, 100]} intensity={0.1} />
        
        <TransitScene 
          {...props}
          viewAzimuth={props.viewAzimuth}
          viewElevation={props.viewElevation}
          onPlanetPosition={setPlanetPosition}
          onTransitStatus={setIsTransiting}
        />
      </Canvas>
      
      <LightCurveChart 
        data={lightCurveData}
        currentCycle={currentCycle}
        maxCycles={maxCycles}
      />
      
      {/* Transit indicator */}
      {isTransiting && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: '#00ff88',
          fontSize: '14px',
          background: 'rgba(0,0,0,0.9)',
          padding: '10px 15px',
          borderRadius: '8px',
          border: '2px solid #00ff88',
          fontWeight: '700',
          boxShadow: '0 0 20px rgba(0,255,136,0.5)'
        }}>
          🔭 TRANSIT DETECTED
        </div>
      )}
    </div>
  );
}