import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import AndromedaGalaxy from './AndromedaGalaxy';

const AndromedaViewer: React.FC = () => {
  const [cameraDistance, setCameraDistance] = useState(5);
  const [selectedStar, setSelectedStar] = useState<any>(null);
  const [starsCount, setStarsCount] = useState(200);

  return (
    <div style={{ width: '100%', height: '600px', background: '#000', position: 'relative' }}>
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 60,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}
      >
        {/* Background stars */}
        <Stars 
          radius={300} 
          depth={60} 
          count={2000} 
          factor={7} 
          saturation={0} 
          fade 
        />
        
        {/* Galaxy and stars */}
        <AndromedaGalaxy 
          onCameraDistanceChange={setCameraDistance}
          onStarSelect={setSelectedStar}
          onStarsCountChange={setStarsCount}
        />
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1}
          maxDistance={50}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Camera controls info */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        color: 'white',
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <div>Zoom: {cameraDistance.toFixed(1)}</div>
        <div>Stars: {starsCount}</div>
        {selectedStar && (
          <div>
            <div>Selected: {selectedStar.name}</div>
            <div>Exoplanets: {selectedStar.exoplanets?.length || 0}</div>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        color: 'white',
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px'
      }}>
        <div>🖱️ Drag to rotate • Scroll to zoom • Click stars to select</div>
        <div>🌟 Yellow stars have exoplanets</div>
      </div>
    </div>
  );
};

export default AndromedaViewer;
