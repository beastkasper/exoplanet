import React, { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const EarthMesh: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);

  // Загружаем текстуры
  const [colorMap, bumpMap, specMap] = useLoader(THREE.TextureLoader, [
    '/1.jpg',
    '/2.jpg',
    '/3.jpg',
  ]);

  // Анимация вращения
  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.001;
    if (cloudRef.current) cloudRef.current.rotation.y += 0.0015;
  });

  return (
    <>
      {/* Земля */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          specularMap={specMap}
          specular={new THREE.Color('grey')}
        />
      </mesh>

      {/* Облака */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

const Earth: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      {/* Фоновые звезды */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      {/* Свет */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1} />

      {/* Контролы */}
      <OrbitControls enableZoom={true} />

      {/* Земля */}
      <EarthMesh />
    </Canvas>
  );
};

export default Earth;
