"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html, Center, Bounds } from "@react-three/drei";
import { useState, useRef } from "react";

// --- Theme ---
const DARK_BG = "#0b0e13";
const TEXT_COLOR = "#e0e0e0";
const ACCENT_COLOR = "#3fa9f5";
const panelStyle = {
  backgroundColor: "#1a1d24",
  borderRadius: "12px",
  padding: "1rem",
  boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
  overflow: "hidden",
};

// --- Hoverable + Clickable Mesh ---
function InteractiveMesh({ mesh, name, hoveredName, setHoveredName, setSelectedName }) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      geometry={mesh.geometry}
      material={mesh.material.clone()} // clone so we can safely modify
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        setHoveredName(name);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        setHoveredName(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedName(name);
      }}
    >
      {/* Apply highlight effect */}
      <meshStandardMaterial
        attach="material"
        color={mesh.material.color}
        emissive={hovered ? ACCENT_COLOR : "#000000"}
        emissiveIntensity={hovered ? 0.6 : 0}
      />
      {/* {hovered && (
        <Html position={[0, 1, 0]} centers style={{cursor: "pointer"}}>
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "0.75rem",
              color: "#000",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
          >
            {name}
          </div>
        </Html>
      )} */}
    </mesh>
  );
}

// --- Astronaut Model ---
function AstronautModel({ hoveredName, setHoveredName, setSelectedName }) {
  const { scene } = useGLTF("/models/Astronaut.glb");
  const astronautGroup = scene.getObjectByName("astronaut1");
  const meshes = astronautGroup?.children.filter((c) => c.isMesh) || [];

  const ref = useRef();

  useFrame(() => {
    if (ref.current) ref.current.rotation.z += 0.005;
  });

  return (
    <group ref={ref}>
      <Center>
        {meshes.map((mesh) => (
          <InteractiveMesh
            key={mesh.name}
            mesh={mesh}
            name={mesh.name}
            hoveredName={hoveredName}
            setHoveredName={setHoveredName}
            setSelectedName={setSelectedName}
          />
        ))}
      </Center>
    </group>
  );
}

// --- Main UI ---
export default function AstronautViewerUI() {
  const [hoveredName, setHoveredName] = useState(null);
  const [selectedName, setSelectedName] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: DARK_BG,
        color: TEXT_COLOR,
        padding: "2rem",
        gap: "2rem",
      }}
    >
      {/* Left panel: 3D Model */}
      <div style={{ flex: 1, ...panelStyle, padding: 0 }}>
        <Canvas camera={{ position: [0, 3, 8], fov: 45 }} style={{ borderRadius: "12px" }}>
          <ambientLight intensity={0.5} color="#ffffff" />
          <directionalLight position={[15, 15, 10]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />

          <Bounds fit clip damping={6}>
            <AstronautModel
              hoveredName={hoveredName}
              setHoveredName={setHoveredName}
              setSelectedName={setSelectedName}
            />
          </Bounds>

          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>

      {/* Right panel: Info */}
      <div
        style={{
          width: "350px",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Dynamic Part Info */}
        <div style={{ flex: 2, ...panelStyle, overflowY: "auto" }}>
          <h2
            style={{
              color: ACCENT_COLOR,
              borderBottom: `2px solid ${ACCENT_COLOR}`,
              paddingBottom: "0.5rem",
              marginBottom: "1rem",
              fontSize: "1.5rem",
            }}
          >
            {selectedName ? "PART DETAIL" : "ASTRONAUT OVERVIEW"}
          </h2>
          {selectedName ? (
            <>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                {selectedName === "0" ? "Body" : "Head"}
              </h3>
              <p style={{ lineHeight: "1.6" }}>
                Detailed description about <strong>{selectedName}</strong>.  
                This explains the function and purpose of this part of the suit.
              </p>
              <p style={{ marginTop: "1rem", color: ACCENT_COLOR }}>
                <b>Selected Mesh ID:</b> {selectedName}
              </p>
            </>
          ) : (
            <p style={{ lineHeight: "1.6" }}>
              Click on a part of the astronaut suit to view detailed information here.
            </p>
          )}
        </div>

        {/* Static Model Info */}
        <div style={{ flex: 1, ...panelStyle }}>
          <h2
            style={{
              color: ACCENT_COLOR,
              borderBottom: `2px solid ${ACCENT_COLOR}`,
              paddingBottom: "0.5rem",
              marginBottom: "1rem",
              fontSize: "1.5rem",
            }}
          >
            MODEL STATS
          </h2>
          <p style={{ marginBottom: "0.5rem" }}>
            <span style={{ color: ACCENT_COLOR, fontWeight: "bold" }}>Name:</span> Astronaut Suit
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <span style={{ color: ACCENT_COLOR, fontWeight: "bold" }}>Parts:</span> 2 meshes (0, 0_1)
          </p>
          <p>
            <span style={{ color: ACCENT_COLOR, fontWeight: "bold" }}>Interactivity:</span> Click to
            View Details
          </p>
        </div>
      </div>
    </div>
  );
}
