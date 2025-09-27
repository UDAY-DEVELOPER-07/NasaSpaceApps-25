"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Center, Bounds } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";

function HoverableMesh({ mesh, name, setHoveredName }) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      geometry={mesh.geometry}
      material={mesh.material}
      onPointerOver={() => {
        setHovered(true);
        setHoveredName(name);
      }}
      onPointerOut={() => {
        setHovered(false);
        setHoveredName(null);
      }}
    >
      {/* {hovered && (
        <Html position={[0, 1, 0]} center>
          <div className="bg-white p-1 rounded shadow text-xs">{name}</div>
        </Html>
      )} */}
    </mesh>
  );
}

function SpaceSuitModel({ setHoveredName }) {
  const { scene } = useGLTF("/models/spaceSuitZ2.glb");

  // collect meshes
  const [meshes, setMeshes] = useState([]);
  useEffect(() => {
    const foundMeshes = [];
    scene.traverse((child) => {
      if (child.isMesh) foundMeshes.push(child);
    });
    setMeshes(foundMeshes);
  }, [scene]);

  const ref = useRef();

  useFrame(() => {
    if (ref.current) ref.current.rotation.z += 0.003; // auto-rotate whole suit
  });

  return (
    <group ref={ref}>
      <Center>
        {meshes.map((mesh) => (
          <HoverableMesh
            key={mesh.name}
            mesh={mesh}
            name={mesh.name}
            setHoveredName={setHoveredName}
          />
        ))}
      </Center>
    </group>
  );
}

export default function SpaceSuitUI() {
  const [hoveredName, setHoveredName] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh", gap: "1rem", padding: "1rem" }}>
      {/* Left panel: 3D Model */}
      <div style={{ flex: 1, border: "1px solid white" }}>
        <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          {/* Bounds auto-fits the model */}
          <Bounds fit clip damping={6}>
            <SpaceSuitModel setHoveredName={setHoveredName} />
          </Bounds>

          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>

      {/* Right panel: Info */}
      <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Dynamic info */}
        <div style={{ flex: 1, border: "1px solid white", padding: "0.5rem" }}>
          <h3>Part Info</h3>
          {hoveredName ? (
            <p>Currently hovering: {hoveredName}</p>
          ) : (
            <p>Hover over a part to see info</p>
          )}
        </div>

        {/* Static info */}
        <div style={{ flex: 1, border: "1px solid white", padding: "0.5rem" }}>
          <h3>Model Info</h3>
          <p>Name: Space Suit Z2</p>
          <p>Parts: {hoveredName ? "1+ meshes detected" : "Detecting..."}</p>
          <p>Material: MeshStandardMaterial</p>
          <p>Other info: Prototype exploration suit</p>
        </div>
      </div>
    </div>
  );
}
