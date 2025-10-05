// src/components/SolarSystem.tsx
import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { fetchExoplanets } from "../api/exoplanets";
import Planet from "./Planet";
import type { Exoplanet } from "../types/exoplanet";

const SolarSystem: React.FC = () => {
  const [planets, setPlanets] = useState<Exoplanet[]>([]);

  useEffect(() => {
    fetchExoplanets().then(setPlanets);
  }, []);

  return (
    <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} />
      <Stars />
      {/* Центральная звезда */}
      <Planet radius={2} color="yellow" />
      {/* Планеты */}
      {planets.map((planet, i) => (
        <Planet
          key={planet.pl_name}
          radius={planet.pl_rade ? planet.pl_rade / 2 : 0.5}
          position={[i * 3 + 5, 0, 0]}
          color="orange"
        />
      ))}
      <OrbitControls />
    </Canvas>
  );
};

export default SolarSystem;
