import { useRef } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";

const Star = () => {
  const ref = useRef<Mesh>(null!);

  useFrame(() => {
    ref.current.rotation.y += 0.001;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial color="yellow" />
    </mesh>
  );
};

export default Star;
