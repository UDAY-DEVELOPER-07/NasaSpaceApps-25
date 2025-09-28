"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds, Center } from "@react-three/drei";
import { useState, useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

// --- Space Suit Parts Data ---
const PART_INFO = {
  helmet: { title: "Helmet Assembly", description: "Provides pressure integrity, oxygen supply, and communication. Features multiple visors for solar protection." },
  torso: { title: "Hard Upper Torso (HUT)", description: "The rigid core of the suit, protecting the astronaut and housing life support connections." },
  gloves: { title: "Gloves and Mitts", description: "Crucial for dexterity and tool handling in extreme environments." },
  boots: { title: "Thermal Micrometeoroid Garment (TMG)", description: "Protective layers against temperature extremes and orbital debris." },
  _root: { title: "Space Suit Z2 Overview", description: "Prototype space exploration suit with advanced mobility and segmented components." }
};

// --- Helper: Collect meshes ---
function getMeshes(object) {
  const meshes = [];
  object.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  return meshes;
}

// --- Hoverable Mesh ---
function HoverableMesh({ mesh, name, setHoveredName }) {
  const [hovered, setHovered] = useState(false);

  const material = useMemo(() => {
    if (mesh.material) {
      const mat = mesh.material.clone();
      if (mat.emissive) {
        mat.emissive.set("black");
        mat.emissiveIntensity = 0;
      }
      return mat;
    }
    return null;
  }, [mesh.uuid, mesh.material]);

  if (!material) return null;

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredName(name);
    document.body.style.cursor = "pointer";
    if (material.emissive) {
      material.emissive.set("#00FFFF");
      material.emissiveIntensity = 0.6;
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    setHoveredName(null);
    document.body.style.cursor = "default";
    if (material.emissive) {
      material.emissive.set("black");
      material.emissiveIntensity = 0;
    }
  };

  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      scale={hovered ? 1.02 : 1}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}

// --- Space Suit Model ---
// --- Space Suit Model (REVISED) ---
function SpaceSuitModel({ setHoveredName }) {
  const { scene } = useGLTF("/spaceSuitZ2.glb");
  const groupRef = useRef();

  // The turntable animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.002;
    }
  });

  // We no longer need the complex useEffect for positioning and scaling.
  // We also don't need the getMeshes helper or the meshes state.

  return (
    // 1. This group is the main container. We apply our animation to it.
    <group ref={groupRef}>
      <Bounds fit clip damping={6}>
        {/* 2. Center will automatically position the model correctly */}
        <Center>
          {/* 3. THIS IS THE FIX: We apply the "stand up" rotation directly to the scene object itself. */}
          {/* This rotates it -90 degrees on X to stand it up. */}
          <primitive object={scene} rotation={[-Math.PI / 2, 0, 0]} >
            {/* By making HoverableMesh a child of the primitive, we can still have interactivity */}
            {/* This is a more advanced pattern, let's first check if the orientation is fixed. */}
            {/* For now, we will render the scene directly. If this works, we can re-add hover. */}
          </primitive>
        </Center>
      </Bounds>
    </group>
  );
}

// --- Main UI ---
export default function SpaceSuitUI() {
  const [hoveredName, setHoveredName] = useState(null);
  const info = PART_INFO[hoveredName] || PART_INFO._root;

  // Theme
  const DARK_BG = "#0b0e13";
  const PANEL_BG = "#1a1d24";
  const ACCENT_COLOR = "#3fa9f5";
  const TEXT_COLOR = "#e0e0e0";

  const panelStyle = {
    backgroundColor: PANEL_BG,
    borderRadius: "12px",
    padding: "1.5rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
    color: TEXT_COLOR,
    fontFamily: "Inter, sans-serif",
  };

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
      {/* Left: 3D model */}
      <div style={{ flex: 1, ...panelStyle, padding: 0 }}>
        <Canvas camera={{ position: [0, 3, 8], fov: 45 }} style={{ borderRadius: "12px" }}>
          <ambientLight intensity={0.5} color="#ffffff" />
          <directionalLight position={[15, 15, 10]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />

          <SpaceSuitModel setHoveredName={setHoveredName} />
          <OrbitControls enableZoom />
        </Canvas>
      </div>

      {/* Right: Info */}
      <div style={{ width: "350px", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Part Info */}
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
            {hoveredName ? "COMPONENT DETAIL" : "SUIT OVERVIEW"}
          </h2>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{info.title}</h3>
          <p style={{ lineHeight: 1.6 }}>{info.description}</p>
          {hoveredName && (
            <p style={{ marginTop: "1rem", color: ACCENT_COLOR }}>
              <b>Hovered Mesh:</b> {hoveredName}
            </p>
          )}
        </div>

        {/* Metadata */}
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
            <span style={{ color: ACCENT_COLOR, fontWeight: "bold" }}>Model:</span> Space Suit Z2 Prototype
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <span style={{ color: ACCENT_COLOR, fontWeight: "bold" }}>Status:</span> Operational (Simulated)
          </p>
          <p>
            <span style={{ color: ACCENT_COLOR, fontWeight: "bold" }}>Interactivity:</span> Hover for Details
          </p>
        </div>
      </div>
    </div>
  );
}
