// src/components/ExoplanetScene.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

export default function ExoplanetScene() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
      {/* Звёзды на фоне */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      {/* Солнце */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial emissive="orange" />
      </mesh>

      {/* Экзопланета */}
      <mesh position={[5, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} />

      <OrbitControls />
    </Canvas>
  );
}
