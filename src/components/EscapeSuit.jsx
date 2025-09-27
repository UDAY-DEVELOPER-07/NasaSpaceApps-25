"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";

function EscapeSuitModel() {
  const { scene } = useGLTF("/models/escapeSuit.glb"); // path inside /public
  return (
    <Center>
      <primitive object={scene} scale={1.5} />
    </Center>
  );
}

export default function EscapeSuitViewer() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <EscapeSuitModel />
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
