// src/components/Planet.tsx
import React from "react";

interface PlanetProps  {
  radius: number;
  color?: string;
}

const Planet: React.FC<PlanetProps> = ({ radius, color = "orange", ...props }) => {
  return (
    <mesh {...props}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Planet;
