"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Center, Bounds } from "@react-three/drei";
import { useState, useRef } from "react";

// Recursive function to collect all meshes
function getMeshes(object) {
  let meshes = [];
  object.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  return meshes;
}

function ClickableMesh({ mesh, name, setSelectedName }) {
  const [hovered, setHovered] = useState(false);

  // Clone once so we don't mutate the shared material
  const material = mesh.material.clone();

  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      scale={hovered ? [1.05, 1.05, 1.05] : [1, 1, 1]} // pop-out effect
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
        material.emissive = material.emissive ? material.emissive : { set: () => {} }; // guard
        if (material.emissive.set) material.emissive.set("yellow"); // glow
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
        if (material.emissive.set) material.emissive.set("black"); // reset glow
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedName(name);
      }}
    />
  );
}



function ISSModel({ setSelectedName }) {
  const { scene } = useGLTF("/models/iss.glb");
  const meshes = getMeshes(scene);

  const ref = useRef();
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001; // slow auto-rotate
  });

  return (
    <group ref={ref}>
      <Bounds fit clip damping={6}>
        <Center>
          {meshes.map((mesh) => (
            <ClickableMesh
              key={mesh.uuid}
              mesh={mesh}
              name={mesh.name}
              setSelectedName={setSelectedName}
            />
          ))}
        </Center>
      </Bounds>
    </group>
  );
}

export default function ISSViewerUI() {
  const [selectedName, setSelectedName] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh", gap: "1rem", padding: "1rem" }}>
      {/* Left panel: 3D Model */}
      <div style={{ flex: 1, border: "1px solid white" }}>
        <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <ISSModel setSelectedName={setSelectedName} />
          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>

      {/* Right panel: Info */}
      <div style={{ width: "300px", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Dynamic info */}
        <div style={{ flex: 1, border: "1px solid white", padding: "0.5rem" }}>
          <h3>Part Info</h3>
          {selectedName ? (
            <p>Selected part: {selectedName}</p>
          ) : (
            <p>Click on a part to see info</p>
          )}
        </div>

        {/* Static info */}
        <div style={{ flex: 1, border: "1px solid white", padding: "0.5rem" }}>
          <h3>Model Info</h3>
          <p>Name: International Space Station</p>
          <p>Parts: Multiple meshes</p>
          <p>Material: MeshStandardMaterial (various)</p>
          <p>Other info: Example data...</p>
        </div>
      </div>
    </div>
  );
}
