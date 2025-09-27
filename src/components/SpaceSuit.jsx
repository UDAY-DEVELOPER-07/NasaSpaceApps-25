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

// --- Helper: Collect meshes from GLTF ---
function getMeshes(object) {
  const meshes = [];
  object.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  return meshes;
}

// --- Hoverable Mesh Component ---
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
      material.emissiveIntensity = 0.5;
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

// --- Space Suit Model Component ---
function SpaceSuitModel({ setHoveredName }) {
  const { scene } = useGLTF("/spaceSuitZ2.glb");
  const [meshes, setMeshes] = useState([]);
  const ref = useRef();

  useEffect(() => {
    const allMeshes = getMeshes(scene);
    setMeshes(allMeshes);

    // Center the model
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    // Fit scale
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxAxis = Math.max(size.x, size.y, size.z);
    scene.scale.multiplyScalar(2 / maxAxis);

    // Correct initial rotation so front faces camera
    scene.rotation.set(0, Math.PI, 0); // Rotate 180° around Y
  }, [scene]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002; // slow, correct-direction rotation
    }
  });

  return (
    <group ref={ref}>
      <Bounds fit clip damping={6}>
        <Center>
          {meshes.map((mesh) => {
            const lname = mesh.name.toLowerCase();
            let partName = "_root";
            if (lname.includes("helmet")) partName = "helmet";
            else if (lname.includes("torso")) partName = "torso";
            else if (lname.includes("glove")) partName = "gloves";
            else if (lname.includes("boot")) partName = "boots";

            return (
              <HoverableMesh
                key={mesh.uuid}
                mesh={mesh}
                name={partName}
                setHoveredName={setHoveredName}
              />
            );
          })}
        </Center>
      </Bounds>
    </group>
  );
}


// --- Main UI Component ---
export default function SpaceSuitUI() {
  const [hoveredName, setHoveredName] = useState(null);

  const info = PART_INFO[hoveredName] || PART_INFO._root;

  const DARK_BG = "#0B0B0F";
  const PANEL_BG = "#1C1C23";
  const ACCENT_COLOR = "#00CCFF";
  const TEXT_COLOR = "#E0E0FF";

  const panelStyle = {
    backgroundColor: PANEL_BG,
    border: `1px solid ${ACCENT_COLOR}30`,
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: `0 4px 12px rgba(0,0,0,0.4), 0 0 10px ${ACCENT_COLOR}15`,
    color: TEXT_COLOR,
    fontFamily: 'Inter, sans-serif'
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: DARK_BG, gap: "2rem", padding: "2rem" }}>
      {/* Left: 3D Model */}
      <div style={{ flex: 1, ...panelStyle, padding: 0 }}>
        <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
          <ambientLight intensity={0.5} color={TEXT_COLOR} />
          <directionalLight position={[10,10,10]} intensity={1.5} color={TEXT_COLOR} />
          <pointLight position={[-5,5,5]} intensity={0.5} color={ACCENT_COLOR} />

          <SpaceSuitModel setHoveredName={setHoveredName} />
          <OrbitControls enableZoom />
        </Canvas>
      </div>

      {/* Right: Info Panels */}
      <div style={{ width: "350px", display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Part Info */}
        <div style={{ flex: 2, ...panelStyle, overflowY: "auto" }}>
          <h2 style={{ color: ACCENT_COLOR, borderBottom: `2px solid ${ACCENT_COLOR}`, paddingBottom: "0.5rem", marginBottom: "1rem", fontSize: "1.5rem" }}>
            {hoveredName ? "COMPONENT DATASTREAM" : "SUIT DIAGNOSTICS"}
          </h2>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{info.title}</h3>
          <p style={{ lineHeight: 1.6 }}>{info.description}</p>
          {hoveredName && <p style={{ marginTop: "1rem", color: ACCENT_COLOR }}>**Hovered Mesh Name:** {hoveredName}</p>}
        </div>

        {/* Suit Metadata */}
        <div style={{ flex: 1, ...panelStyle }}>
          <h2 style={{ color: ACCENT_COLOR, borderBottom: `2px solid ${ACCENT_COLOR}`, paddingBottom: "0.5rem", marginBottom: "1rem", fontSize: "1.5rem" }}>
            SYSTEM METRICS
          </h2>
          <p><span style={{ color: ACCENT_COLOR, fontWeight: "bold" }}>Model:</span> Space Suit Z2 Prototype</p>
          <p><span style={{ color: ACCENT_COLOR, fontWeight: "bold" }}>Status:</span> Operational (Simulated)</p>
          <p><span style={{ color: ACCENT_COLOR, fontWeight: "bold" }}>Interaction:</span> Hover for Detail View</p>
        </div>
      </div>
    </div>
  );
}
