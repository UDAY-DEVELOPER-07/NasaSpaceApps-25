"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Bounds } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";

// Complete part info data dynamically generated for all meshes
const partInfoData = {
  _root: {
    title: "International Space Station (ISS)",
    description:
      "The International Space Station is a modular space station in low Earth orbit, a multinational collaborative project serving as a research lab.",
  },
};

// All mesh names from your model (shortened here for brevity, add the full list in your code)
const meshNames = [
  "Cylinder022_54", "Cylinder022_55", "Cylinder022_56", "Cylinder022_57", "Cylinder022_25",
  "Cylinder022_26", "Cylinder022_27", "Sphere002", "Sphere002_1", "Sphere002_2",
  "Sphere002_3", "sm_ext_sm000_56", "sm_ext_sm000_57", "sm_ext_sm000_58", "sm_ext_sm000_59",
  "sm_ext_sm000_60", "Sphere002_4", "Sphere002_5", "Sphere002_6", "Sphere002_7",
  "Sphere002_8", "Sphere002_9", "Sphere002_10", "Sphere002_11", "sm_ext_sm000_2",
  "sm_ext_sm000_3", "sm_ext_sm000_4", "sm_ext_sm000_5", "sm_ext_sm000_6", "sm_ext_sm000_7",
  "sm_ext_sm000_8", "sm_ext_sm000_9", "sm_ext_sm000_10", "sm_ext_sm000_11", "sm_ext_sm000_12",
  "sm_ext_sm000_13", "sm_ext_sm000_14", "sm_ext_sm000_15", "sm_ext_sm000_16", "sm_ext_sm000_17",
  "sm_ext_sm000_18", "sm_ext_sm000_19", "sm_ext_sm000_20", "sm_ext_sm000_21", "sm_ext_sm000_22",
  "sm_ext_sm000_23", "sm_ext_sm000_24", "sm_ext_sm000_25", "sm_ext_sm000_26", "sm_ext_sm000_27",
  "sm_ext_sm000_28", "sm_ext_sm000_29", "sm_ext_sm000_30", "sm_ext_sm000_31", "sm_ext_sm000_32",
  "sm_ext_sm000_33", "sm_ext_sm000_34", "sm_ext_sm000_35", "sm_ext_sm000_36", "sm_ext_sm000_37",
  "sm_ext_sm000_38", "sm_ext_sm000_39", "sm_ext_sm000_40", "sm_ext_sm000_41", "sm_ext_sm000_42",
  "sm_ext_sm000_43", "sm_ext_sm000_44", "sm_ext_sm000_45", "sm_ext_sm000_46", "sm_ext_sm000_47",
  "sm_ext_sm000_48", "sm_ext_sm000_49", "sm_ext_sm000_50", "sm_ext_sm000_51", "sm_ext_sm000_52",
  "sm_ext_sm000_53", "sm_ext_sm000_54", "sm_ext_sm000_55", "panel_bracket_p", "panel_bracket_s",
  "Sphere002_12", "Sphere002_13", "Sphere002_14", "Sphere002_15", "z1_ext_01001_2",
  "z1_ext_01001_3", "z1_ext_01001_4", "z1_ext_01001_5", "z1_ext_01001_6", "Cylinder022_58",
  "Cylinder022_59", "Cylinder022_60", "Cylinder022_61", "Cylinder022_62", "Cylinder022_63",
  "z1_ext_01001", "z1_ext_01001_1", "s0_ani000", "s0_ani000_1", "s0_ani000_2",
  "s0_ani000_3", "s0_ani000_4", "mss_mbs001", "mss_mbs001_1", "mss_mbs001_2",
  "mss_mbs001_3", "11_Canadarm2", "11_Canadarm2_02", "11_Canadarm2_03", "11_Canadarm2_04",
  "11_Canadarm2_05", "11_Canadarm2_06", "11_Canadarm2_07", "11_Canadarm2_08", "Cylinder022_28",
  "Cylinder022_29", "29_DEXTRE001", "29_DEXTRE002", "29_DEXTRE003", "29_DEXTRE004",
  "29_DEXTRE005", "29_DEXTRE006", "29_DEXTRE007", "29_DEXTRE008", "29_DEXTRE009",
  "29_DEXTRE010", "29_DEXTRE011", "29_DEXTRE012", "29_DEXTRE013", "29_DEXTRE014",
  "29_DEXTRE015", "s0_ani000_5", "s0_ani000_6", "s0_ani000_7", "s0_ani000_8", "s0_ani000_9",
  "s0_ani000_10", "s0_ani000_11", "s0_ani000_12", "s0_ani000_13", "s0_ani000_14",
  "s0_ani000_15", "s0_ani000_16", "p6_ani000_24", "p6_ani000_25", "p6_ani000_26",
  "p6_ani000_27", "p6_ani000_28", "Cube008_38", "Cube008_39", "Cube008_40", "Cube008_41",
  "p6_ani000", "p6_ani000_1", "p6_ani000_2", "p6_ani000_3", "p6_ani000_4", "p6_ani000_5",
  "p6_ani000_29", "p6_ani000_30", "p6_ani000_31", "p6_ani000_32", "p6_ani000_6", "p6_ani000_7",
  "p6_ani000_8", "p6_ani000_9", "p6_ani000_10", "p6_ani000_11", "ESP3000", "ESP3000_1",
  "ESP3000_2", "ESP3000_3", "ESP3000_4", "esp2_lo000", "esp2_lo000_1", "esp2_lo000_2",
  "esp2_lo000_3", "esp2_lo000_4", "esp2_lo000_5", "esp2_lo000_6", "AMS2000", "AMS2000_1",
  "AMS2000_2", "Cylinder022_30", "Cylinder022_31", "Cylinder022_32", "s0_ani000_17",
  "s0_ani000_18", "s0_ani000_19", "s0_ani000_20", "s0_ani000_21", "s0_ani000_22",
  "s0_ani000_23", "s0_ani000_24", "s0_ani000_25", "s0_ani000_26", "s0_ani000_27",
  "s0_ani000_28", "p6_ani000_33", "p6_ani000_34", "p6_ani000_35", "p6_ani000_36",
  "p6_ani000_37", "Cube008_42", "Cube008_43", "Cube008_44", "Cube008_45", "p6_ani000_38",
  "p6_ani000_39", "p6_ani000_40", "p6_ani000_41", "p6_ani000_12", "p6_ani000_13",
  "p6_ani000_14", "p6_ani000_15", "p6_ani000_16", "p6_ani000_17", "p6_ani000_18",
  "p6_ani000_19", "p6_ani000_20", "p6_ani000_21", "p6_ani000_22", "p6_ani000_23",
  "esp2_lo000_7", "esp2_lo000_8", "esp2_lo000_9", "esp2_lo000_10", "esp2_lo000_11",
  "esp2_lo000_12", "esp2_lo000_13", "esp2_lo000_14", "Cylinder022_64", "Cylinder022_65",
  "Cylinder022_66", "Cylinder022_67", "Cylinder022_33", "Cylinder022_34", "Cylinder022_35",
  "Cylinder022_68", "Cylinder022_69", "Cylinder022_70", "Cylinder022_71", "Cylinder022_72",
  "Cylinder022_73", "Cube008_18", "Cube008_19", "Cube008_20", "Cube008_21", "RapidScat_dish",
  "Cylinder022_36", "Cylinder022_37", "Cylinder022_38", "Cylinder022_39", "Cylinder022_40",
  "Cylinder022_41", "Cylinder022_42", "Cylinder022_43", "Cylinder022_44", "Cylinder022_45",
  "Cylinder022_46", "Cylinder022_47", "31_Robotic_Arm", "31_Robotic_Arm001", "31_Robotic_Arm002",
  "31_Robotic_Arm003", "31_Robotic_Arm004", "31_Robotic_Arm005", "Cube008_46", "Cube008_47",
  "Cube008_48", "Cube008_49", "Cube008_50", "Cube008_51", "Destiny_Window_Cover",
  "Cylinder022_74", "Cylinder022_75", "Cylinder022_76", "Cylinder022_77", "Cylinder022_78",
  "Cylinder022_79", "Cylinder022_80", "esp2_lo000_15", "esp2_lo000_16", "esp2_lo000_17",
  "esp2_lo000_18", "Cylinder022_81", "Cylinder022_82", "Cylinder022_83", "Cylinder022_84",
  "Cylinder022_48", "Cylinder022_49", "Cylinder022_50", "Cylinder022_51", "Cylinder022_52",
  "Cylinder022_53", "38_Cupola001", "38_Cupola002", "38_Cupola003", "38_Cupola004",
  "38_Cupola005", "38_Cupola006", "38_Cupola007", "ISS", "Cylinder022_85", "Cylinder022_86",
  "Cylinder022_87", "Cylinder022_88", "Cylinder022_89", "Cube008_22", "Cube008_23",
  "hinge_02_p", "Cube008_24", "Cube008_25", "hinge_04_p", "hinge_01_p", "Cube008_26",
  "Cube008_27", "hinge_03_p", "Cube008_28", "Cube008_29", "Cube008_30", "Cube008_31",
  "hinge_02_s", "Cube008_32", "Cube008_33", "hinge_04_s", "hinge_03_s", "Cube008_34",
  "Cube008_35", "Cube008_36", "Cube008_37", "hinge_01_s", "Cube008_53", "Cube008_54",
  "Cube008_55", "Cube008_56", "Cylinder022_90", "Cylinder022_91", "Cylinder022_92",
  "Cylinder022_93", "Cylinder022_94", "Cylinder022_95", "Cylinder022_96"
];


// Random description generator for testing
function randomDesc(name) {
  return `This part ${name} is essential for the structure and operations of the ISS. It plays a crucial role in station stability and functionality.`;
}

// Populate partInfoData with random part info for testing
meshNames.forEach((name) => {
  partInfoData[name] = {
    title: `Part: ${name}`,
    description: randomDesc(name),
  };
});

function getMeshes(object) {
  let meshes = [];
  object.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  return meshes;
}

function ClickableMesh({ mesh, name, setSelectedName }) {
  const [hovered, setHovered] = useState(false);

  // Clone material to avoid shared mutation
  const material = mesh.material.clone();

  return (
    <mesh
      geometry={mesh.geometry}
      material={material}
      scale={hovered ? [1.05, 1.05, 1.05] : [1, 1, 1]} // pop-out effect on hover
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
        if (material.emissive?.set) material.emissive.set("yellow");
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
        if (material.emissive?.set) material.emissive.set("black");
      }}
      onClick={(e) => {
        e.stopPropagation();
        console.log("Clicked mesh name:", name);
        setSelectedName(name);
      }}
    />
  );
}

function ISSModel({ setSelectedName }) {
  const { scene } = useGLTF("/models/iss.glb");
  const meshes = getMeshes(scene);

  const ref = useRef();

  useEffect(() => {
    console.log("Available meshes:", meshes.map((m) => m.name));
  }, [meshes]);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.001; // slow rotation
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

  // Smart fallback if part info missing
  const info = selectedName
    ? partInfoData[selectedName] || {
        title: selectedName,
        description: "No description available for this part.",
      }
    : { title: partInfoData._root.title, description: partInfoData._root.description };

  return (
    <div style={{ display: "flex", height: "100vh", gap: "1rem", padding: "1rem" }}>
      {/* Left panel - 3D model */}
      <div style={{ flex: 1, border: "1px solid white" }}>
        <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <ISSModel setSelectedName={setSelectedName} />
          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>

      {/* Right panel - Info */}
      <div
        style={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            flex: 1,
            border: "1px solid white",
            padding: "0.5rem",
            overflowY: "auto",
            wordBreak: "break-word",
          }}
        >
          <h3>{info.title}</h3>
          <p>{info.description}</p>
        </div>

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
