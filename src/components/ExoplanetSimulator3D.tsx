import React, { useRef, useState, useEffect, useMemo } from 'react';

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

const LightCurveGraph: React.FC<{
  data: LightCurveData[];
  currentCycle: number;
  maxCycles: number;
  orbitalPeriod: number;
}> = ({ data, currentCycle, maxCycles, orbitalPeriod }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (data.length === 0) return;
    
    // Set up canvas
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;
    
    // Remove all axes, grid lines, and separators for clean look
    
    // Draw smooth light curve with curves
    if (data.length > 1) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Create smooth curve using quadratic curves
      ctx.beginPath();
      
      for (let i = 0; i < data.length; i++) {
        const point = data[i];
        const normalizedTime = point.time % orbitalPeriod;
        const cycleOffset = (point.cycle - 1) * (graphWidth / maxCycles);
        const x = padding + (normalizedTime / orbitalPeriod) * (graphWidth / maxCycles) + cycleOffset;
        const y = height - padding - (point.lightLevel * graphHeight);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevPoint = data[i - 1];
          const prevNormalizedTime = prevPoint.time % orbitalPeriod;
          const prevCycleOffset = (prevPoint.cycle - 1) * (graphWidth / maxCycles);
          const prevX = padding + (prevNormalizedTime / orbitalPeriod) * (graphWidth / maxCycles) + prevCycleOffset;
          const prevY = height - padding - (prevPoint.lightLevel * graphHeight);
          
          // Use quadratic curve for smooth transitions
          const cpX = (prevX + x) / 2;
          const cpY = (prevY + y) / 2;
          ctx.quadraticCurveTo(cpX, cpY, x, y);
        }
      }
      
      ctx.stroke();
    }
    
    // Remove all labels for clean look
    
  }, [data, currentCycle, maxCycles, orbitalPeriod]);
  
  return (
    <div style={{ 
      position: 'absolute', 
      top: 20, 
      left: '50%',
      transform: 'translateX(-50%)',
      width: 400, 
      height: 120, 
      background: 'transparent',
      padding: '10px'
    }}>
      <div style={{ color: '#fff', fontSize: '14px', marginBottom: '10px', textAlign: 'center' }}>
        Relative Brightness - Cycle {Math.min(currentCycle, maxCycles)}/{maxCycles}
      </div>
      <canvas
        ref={canvasRef}
        width={380}
        height={80}
        style={{ width: '100%', height: '80px' }}
      />
    </div>
  );
};

const FlatSimulation: React.FC<{
  starRadius: number;
  planetRadius: number;
  orbitalRadius: number;
  starTemperature: string;
  isPlaying: boolean;
  planetAngle: number;
}> = ({ 
  starRadius, 
  planetRadius, 
  orbitalRadius, 
  starTemperature, 
  isPlaying,
  planetAngle 
}) => {
  const getStarColor = (temp: string) => {
    switch (temp) {
      case 'F-type': return '#ffffff';
      case 'G-type': return '#ffff00';
      case 'K-type': return '#ff8800';
      case 'M-type': return '#ff0000';
      default: return '#ffff00';
    }
  };

  const starColor = getStarColor(starTemperature);
  
  // Calculate planet position - make it pass through the star
  const planetX = Math.cos(planetAngle) * orbitalRadius;
  const planetY = Math.sin(planetAngle) * orbitalRadius * 0.3; // Reduce Y to make it pass through star
  
  // Check if planet is transiting (in front of star) - only when planet is on the right side (positive X)
  const isTransiting = planetX > 0 && Math.abs(planetX) < starRadius && Math.abs(planetY) < starRadius;

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Star - flat circle with gradient */}
      <div style={{
        position: 'absolute',
        width: starRadius * 2,
        height: starRadius * 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${starColor} 0%, ${starColor} 40%, rgba(255,255,255,0.3) 70%, transparent 100%)`,
        boxShadow: isTransiting ? `0 0 ${starRadius * 0.7}px ${starColor}` : `0 0 ${starRadius}px ${starColor}`,
        zIndex: 1,
        opacity: isTransiting ? 0.8 : 1,
        transition: 'all 0.3s ease'
      }} />
      
      
      {/* Orbital path */}
      <div style={{
        position: 'absolute',
        width: orbitalRadius * 2,
        height: orbitalRadius * 2,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.2)',
        zIndex: 0
      }} />
      
      {/* Planet */}
      <div style={{
        position: 'absolute',
        left: `calc(50% + ${planetX}px - ${planetRadius}px)`,
        top: `calc(50% + ${planetY}px - ${planetRadius}px)`,
        width: planetRadius * 2,
        height: planetRadius * 2,
        borderRadius: '50%',
        background: isTransiting ? '#000' : '#333',
        border: isTransiting ? '2px solid #444' : '1px solid #666',
        zIndex: isTransiting ? 3 : 2,
        transition: isPlaying ? 'none' : 'all 0.1s ease',
        boxShadow: isTransiting ? '0 0 20px rgba(0,0,0,0.8)' : '0 0 10px rgba(0,0,0,0.3)'
      }} />
      
      {/* Eclipse shadow effect on star */}
      {isTransiting && (
        <div style={{
          position: 'absolute',
          left: `calc(50% + ${planetX}px - ${planetRadius}px)`,
          top: `calc(50% + ${planetY}px - ${planetRadius}px)`,
          width: planetRadius * 2,
          height: planetRadius * 2,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />
      )}
      
      {/* Eclipse indicator */}
      {isTransiting && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: '#fff',
          fontSize: '14px',
          background: 'rgba(0,0,0,0.8)',
          padding: '8px 12px',
          borderRadius: '8px',
          zIndex: 10,
          border: '1px solid rgba(255,255,255,0.2)',
          fontWeight: '600'
        }}>
          🌑 ECLIPSE DETECTED
        </div>
      )}
    </div>
  );
};

export default function ExoplanetSimulator3D(props: ExoplanetSimulator3DProps) {
  const [lightCurveData, setLightCurveData] = useState<LightCurveData[]>([]);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [planetAngle, setPlanetAngle] = useState(0);
  const maxCycles = 4;
  
  // Calculate light level based on planet position
  const calculateLightLevel = useMemo(() => {
    return (angle: number) => {
      const planetX = Math.cos(angle) * props.orbitalRadius;
      const planetY = Math.sin(angle) * props.orbitalRadius * 0.3; // Match the Y calculation
      
      // Calculate if planet is transiting (in front of star) - only when planet is on the right side (positive X)
      const isTransiting = planetX > 0 && Math.abs(planetX) < props.starRadius && Math.abs(planetY) < props.starRadius;
      
      if (isTransiting) {
        // Calculate transit depth based on planet size relative to star
        const transitDepth = (props.planetRadius / props.starRadius) ** 2;
        return Math.max(0.1, 1 - transitDepth);
      }
      
      return 1.0; // Normal light level
    };
  }, [props.orbitalRadius, props.starRadius, props.planetRadius]);
  
  // Update planet position and light curve data
  useEffect(() => {
    if (!props.isPlaying) return;
    
    let simulationTime = 0;
    const interval = setInterval(() => {
      simulationTime += 0.1;
      
      // Update planet angle
      const newAngle = (simulationTime / props.orbitalPeriod) * Math.PI * 2 * props.animationSpeed;
      setPlanetAngle(newAngle);
      
      // Calculate light level
      const lightLevel = calculateLightLevel(newAngle);
      
      setLightCurveData(prevData => {
        const newData = [...prevData, {
          time: simulationTime,
          lightLevel,
          cycle: currentCycle
        }];
        
        // Check if we've completed a cycle
        if (simulationTime >= props.orbitalPeriod * currentCycle) {
          if (currentCycle >= maxCycles) {
            // Keep all data but reset cycle counter
            setCurrentCycle(1);
            simulationTime = 0;
            setPlanetAngle(0);
            return newData; // Keep all previous data
          } else {
            setCurrentCycle(prev => prev + 1);
          }
        }
        
        return newData;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [props.isPlaying, props.orbitalPeriod, currentCycle, maxCycles, calculateLightLevel, props.animationSpeed]);
  
  // Only reset data when explicitly reset (not on pause)
  // Removed automatic reset on pause to preserve data

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <FlatSimulation
        starRadius={props.starRadius}
        planetRadius={props.planetRadius}
        orbitalRadius={props.orbitalRadius}
        starTemperature={props.starTemperature}
        isPlaying={props.isPlaying}
        planetAngle={planetAngle}
      />
      
      <LightCurveGraph 
        data={lightCurveData}
        currentCycle={currentCycle}
        maxCycles={maxCycles}
        orbitalPeriod={props.orbitalPeriod}
      />
    </div>
  );
}