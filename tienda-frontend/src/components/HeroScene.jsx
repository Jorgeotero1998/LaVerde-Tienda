import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";

const FloatingOrb = ({ position, color, speed, distort, scale }) => {
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.15}
          distort={distort}
          speed={1.5}
          transparent
          opacity={0.88}
        />
      </mesh>
    </Float>
  );
};

const HeroScene = () => (
  <Canvas
    className="hero-scene__canvas"
    camera={{ position: [0, 0, 6], fov: 45 }}
    dpr={[1, 1.5]}
    gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
  >
    <ambientLight intensity={0.45} />
    <directionalLight position={[4, 6, 4]} intensity={0.9} color="#86efac" />
    <FloatingOrb
      position={[-2.2, 0.4, 0]}
      color="#2d6a4f"
      speed={0.25}
      distort={0.28}
      scale={0.95}
    />
    <FloatingOrb
      position={[2.4, -0.2, -0.5]}
      color="#d4a853"
      speed={-0.18}
      distort={0.22}
      scale={0.72}
    />
    <FloatingOrb
      position={[0.6, 1.1, -1]}
      color="#a8b5a0"
      speed={0.15}
      distort={0.18}
      scale={0.55}
    />
    <FloatingOrb
      position={[-1, -1, 0.2]}
      color="#40916c"
      speed={0.12}
      distort={0.15}
      scale={0.42}
    />
  </Canvas>
);

export default HeroScene;
