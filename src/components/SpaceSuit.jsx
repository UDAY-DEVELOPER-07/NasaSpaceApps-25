"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";

// collect meshes recursively
function getMeshes(scene) {
  const meshes = [];
  scene.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  return meshes;
}

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
    />
  );
}

function SpaceSuitModel({ setHoveredName }) {
  const { scene } = useGLTF("/models/spaceSuitZ2.glb");
  const [meshes, setMeshes] = useState([]);

  useEffect(() => {
    setMeshes(getMeshes(scene));
  }, [scene]);

  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.z += 0.003; // smooth rotation around Y axis
    }
  });

  return (
    <group ref={ref}>
      {meshes.map((mesh) => (
        <HoverableMesh
          key={mesh.uuid}
          mesh={mesh}
          name={mesh.name}
          setHoveredName={setHoveredName}
        />
      ))}
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

          {/* Bounds auto-fits and centers the suit */}
          <Bounds fit clip damping={6}>
            <SpaceSuitModel setHoveredName={setHoveredName} />
          </Bounds>

          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>

      {/* Right panel: Info */}
      <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ flex: 1, border: "1px solid white", padding: "0.5rem" }}>
          <h3>Part Info</h3>
          {hoveredName ? (
            <p>Currently hovering: {hoveredName}</p>
          ) : (
            <p>Hover over a part to see info</p>
          )}
        </div>

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
