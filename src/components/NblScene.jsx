"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF, Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Helpers
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const vec3 = (x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);

function WaterSurface() {
  const meshRef = useRef();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#0e7490") },
      uColorB: { value: new THREE.Color("#020617") },
      uOpacity: { value: 0.6 },
    }),
    []
  );

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={meshRef} rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
      <planeGeometry args={[200, 200, 256, 256]} />
      <shaderMaterial
        transparent
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float freq = 0.6;
            float amp = 0.2;
            pos.z += (sin((pos.x + uTime*2.0) * freq) + cos((pos.y + uTime*1.6) * freq)) * amp;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            float g = smoothstep(0.0, 1.0, vUv.y);
            vec3 col = mix(uColorA, uColorB, g);
            gl_FragColor = vec4(col, uOpacity);
          }
        `}
      />
    </mesh>
  );
}

function AstronautModel(props) {
  const { scene } = useGLTF("/models/Astronaut.glb");
  return <primitive object={scene} {...props} />;
}

function SceneCore({ trim, currentTaskIndex = 0, onNeutral, onReachHatch, onRailsComplete, onCollectTool, onReachAirlock, onDepthChange }) {
  const group = useRef();
  const camTarget = useRef(new THREE.Vector3());
  const { camera } = useThree();

  // Movement state
  const pos = useRef(vec3(0, 0.5, 0));
  const vel = useRef(vec3());
  const yaw = useRef(0);
  const pitch = useRef(-0.15);
  const camDist = useRef(18);

  // Input state
  const keys = useRef({});
  const mouseDownRef = useRef(false); 

  // Prompts and debug
  const [prompt, setPrompt] = useState("");
  const markerRef = useRef();

  // World bounds
  const poolBounds = { x: 20, y: 18, z: 20 };
  const radius = 0.6;

  // Objectives
  const hatchRef = useRef();
  const toolRef = useRef();
  const railRefs = [useRef(), useRef(), useRef()];
  const railsVisited = useRef(new Set());
  const hatchDone = useRef(false);
  const railsDone = useRef(false);
  const airlockDone = useRef(false);

  // Place objectives nearer and reachable
  const railPoints = [vec3(2, 0.5, 0), vec3(4, 0.5, 2), vec3(6, 0.5, 0)];
  const airlockZone = { center: vec3(-6, -8, -6), size: 2.5 };
  const [objectiveText, setObjectiveText] = useState("");

  // Inputs
  useEffect(() => {
    const onKeyDown = (e) => {
      keys.current[e.code] = true;
      if (e.code === "KeyE") {
        const p = pos.current;
        if (toolRef.current && toolRef.current.visible && p.distanceTo(toolRef.current.position) < 2.5) {
          toolRef.current.visible = false;
          onCollectTool && onCollectTool();
        }
        if (!hatchDone.current && hatchRef.current && p.distanceTo(hatchRef.current.position) < 2.5) {
          hatchDone.current = true;
          onReachHatch && onReachHatch();
        }
      }
    };
    const onKeyUp = (e) => { keys.current[e.code] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onReachHatch, onCollectTool]);

  // Mouse look (only while holding LMB) + scroll zoom
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!mouseDownRef.current) return;
      const sensitivity = 0.0025;
      yaw.current -= e.movementX * sensitivity;
      pitch.current = clamp(pitch.current - e.movementY * sensitivity, -Math.PI/2 + 0.1, Math.PI/2 - 0.1);
    };
    const onMouseDown = (e) => {
      if (e.button === 0) mouseDownRef.current = true;
    };
    const onMouseUp = (e) => {
      if (e.button === 0) mouseDownRef.current = false;
    };
    const onWheel = (e) => {
      camDist.current = clamp(camDist.current + e.deltaY * 0.01, 8, 75);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  const resolveCollisions = (next) => {
    // Only clamp to pool boundary for clarity
    next.x = clamp(next.x, -poolBounds.x + radius, poolBounds.x - radius);
    next.y = clamp(next.y, -poolBounds.y + radius, poolBounds.y - radius);
    next.z = clamp(next.z, -poolBounds.z + radius, poolBounds.z - radius);
    return next;
  };

  const neutralRef = useRef(false);
  const neutralTimer = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(0.05, delta);

    // Direction vectors from yaw/pitch
    const forward = new THREE.Vector3(
      Math.sin(yaw.current) * Math.cos(pitch.current),
      Math.sin(pitch.current),
      Math.cos(yaw.current) * Math.cos(pitch.current)
    ).normalize();
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0,1,0)).normalize();
    const up = new THREE.Vector3(0,1,0);

    // Controls to acceleration
    const thrust = 3.0;
    const acc = vec3();
    if (keys.current["KeyW"]) acc.add(forward.clone().multiplyScalar(thrust));
    if (keys.current["KeyS"]) acc.add(forward.clone().multiplyScalar(-thrust));
    if (keys.current["KeyA"]) acc.add(right.clone().multiplyScalar(-thrust));
    if (keys.current["KeyD"]) acc.add(right.clone().multiplyScalar(thrust));
    if (keys.current["Space"]) acc.add(up.clone().multiplyScalar(thrust * 0.8));
    if (keys.current["ShiftLeft"]) acc.add(up.clone().multiplyScalar(-thrust * 0.8));

    // Vertical trim: +5 sink fast, -5 rise fast, 0 hold
    const k = 1.5; // tuned for smooth water-like motion
    acc.add(up.clone().multiplyScalar(-trim * k));

    // Integrate with drag
    vel.current.add(acc.multiplyScalar(dt));
    vel.current.multiplyScalar(0.92);
    vel.current.clampLength(0, 6);

    const next = pos.current.clone().add(vel.current.clone().multiplyScalar(dt));
    resolveCollisions(next);
    pos.current.copy(next);

    // Update astronaut transform
    if (group.current) {
      group.current.position.copy(pos.current);
      if (vel.current.lengthSq() > 0.0001) {
        const dir = vel.current.clone().setY(0).normalize();
        if (dir.lengthSq() > 0.0001) group.current.rotation.y = Math.atan2(dir.x, dir.z);
      }
    }
    if (markerRef.current) markerRef.current.position.copy(pos.current);

    // Camera fixed relative to water (world), a little above the surface
    const pivot = new THREE.Vector3(0, 3, 0); // water is at y=0, pivot slightly above
    const desiredCamPos = pivot.clone().add(new THREE.Vector3(
      Math.sin(yaw.current) * camDist.current,
      Math.sin(pitch.current) * camDist.current,
      Math.cos(yaw.current) * camDist.current
    ));
    camera.position.lerp(desiredCamPos, 1 - Math.pow(0.92, dt / (1/60)));
    camera.lookAt(pivot);

    // Depth to UI
    let depthNorm = THREE.MathUtils.mapLinear(pos.current.y, -poolBounds.y, poolBounds.y, 0, 100);
    depthNorm = THREE.MathUtils.clamp(depthNorm, 0, 100);
    if (onDepthChange) onDepthChange(depthNorm);

    // Neutral detection: mid-depth band and trim near 0 for 3s
    const inMid = depthNorm >= 45 && depthNorm <= 55;
    const trimNear = Math.abs(trim) <= 2;
    if (inMid && trimNear) {
      neutralTimer.current += dt;
      if (!neutralRef.current && neutralTimer.current >= 3) {
        neutralRef.current = true;
        onNeutral && onNeutral();
      }
    } else {
      neutralTimer.current = 0;
    }

    // Interaction prompts
    let newPrompt = "";
    if (!hatchDone.current && hatchRef.current && pos.current.distanceTo(hatchRef.current.position) < 2.5) newPrompt = "Press E to cycle the hatch";
    if (toolRef.current && toolRef.current.visible && pos.current.distanceTo(toolRef.current.position) < 2.5) newPrompt = "Press E to collect tool";
    if (newPrompt !== prompt) setPrompt(newPrompt);

    // Rails checkpoints
    railPoints.forEach((p, i) => {
      if (!railsVisited.current.has(i) && pos.current.distanceTo(p) < 1.0) railsVisited.current.add(i);
    });
    if (!railsDone.current && railsVisited.current.size === railPoints.length) {
      railsDone.current = true;
      onRailsComplete && onRailsComplete();
    }

    // Objective helper text
    let target = null;
    if (currentTaskIndex === 0) {
      setObjectiveText("Hold trim near 0 and stay around mid-depth (45-55) for 3 seconds.");
    } else if (currentTaskIndex === 1) {
      // next unvisited rail
      const idx = [0,1,2].find(i => !railsVisited.current.has(i));
      if (idx !== undefined && idx !== null) target = railPoints[idx];
      setObjectiveText("Touch the glowing rail checkpoints (move close until they turn green).");
    } else if (currentTaskIndex === 2) {
      if (toolRef.current) target = toolRef.current.position;
      setObjectiveText("Move to the glowing tool and press E to collect.");
    } else if (currentTaskIndex === 3) {
      if (hatchRef.current) target = hatchRef.current.position;
      setObjectiveText("Move to the glowing hatch and press E to cycle.");
    } else if (currentTaskIndex === 4) {
      target = airlockZone.center;
      setObjectiveText("Enter the glowing airlock zone at the bottom corner.");
    }

    // Airlock zone
    if (!airlockDone.current) {
      const d = pos.current.clone().sub(airlockZone.center);
      if (Math.abs(d.x) < airlockZone.size && Math.abs(d.y) < 1.0 && Math.abs(d.z) < airlockZone.size) {
        airlockDone.current = true;
        onReachAirlock && onReachAirlock();
      }
    }
  });

  return (
    <>
      {/* Modules */}
      <group>
        <mesh position={[3, 0.0, -3]} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 4]} />
          <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.7} />
        </mesh>
        <mesh position={[-5, -1.0, 4]} castShadow receiveShadow>
          <boxGeometry args={[3, 1.5, 3]} />
          <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.7} />
        </mesh>
        <mesh position={[7, 1.2, 6]} castShadow receiveShadow>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#111827" metalness={0.2} roughness={0.7} />
        </mesh>
      </group>

      {/* Hatch */}
      <mesh ref={hatchRef} position={[6, 0.5, 0]}>
        <boxGeometry args={[1.2, 1.8, 0.2]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={currentTaskIndex===3 ? 4 : 1.5} transparent opacity={0.85} />
      </mesh>

      {/* Rails */}
      <group>
        {railPoints.map((p, i) => (
          <mesh key={i} ref={railRefs[i]} position={p}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color={railsVisited.current.has(i) ? "#22c55e" : (currentTaskIndex===1 ? "#60a5fa" : "#64748b")} emissive={railsVisited.current.has(i) ? "#22c55e" : (currentTaskIndex===1 ? "#60a5fa" : "#000000")} emissiveIntensity={currentTaskIndex===1 ? 2 : 1} />
          </mesh>
        ))}
      </group>

      {/* Tool */}
      <mesh ref={toolRef} position={[2, 2, -4]} castShadow>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={currentTaskIndex===2 ? 2.5 : 1.2} />
      </mesh>

      {/* Airlock visual */}
      <mesh position={airlockZone.center}>
        <boxGeometry args={[airlockZone.size*2, 1.0, airlockZone.size*2]} />
        <meshStandardMaterial color="#22c55e" opacity={0.25} transparent emissive="#22c55e" emissiveIntensity={currentTaskIndex===4 ? 2 : 0.5} />
      </mesh>

      {/* Astronaut */}
      <group ref={group} position={[0, 0.5, 0]} scale={0.7}>
        <pointLight position={[0, 1.2, 1.4]} intensity={1.6} distance={12} decay={2} color="#9bdaf5" />
        <AstronautModel />
      </group>

      {/* Debug marker */}
      <mesh ref={markerRef} position={[0,0.5,0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#ff00ff" />
      </mesh>

      {/* Visuals */}
      <WaterSurface />

      {/* Lights */}
      <hemisphereLight args={["#88c0ff", "#0b1930", 0.7]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-12, 10, -8]} intensity={0.6} />

      <Environment preset="city" />

      {/* HUD */}
      {/* {!mouseDownRef.current && (
        <Html>
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: 8, fontSize: 12 }}>
            Hold Left Mouse to look • Scroll to zoom
          </div>
        </Html>
      )} */}
      {prompt && (
        <Html>
          <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.55)', padding: '10px 14px', borderRadius: 10, fontSize: 14 }}>
            {prompt}
          </div>
        </Html>
      )}
      {/* {objectiveText && (
        <Html>
          <div style={{ position: 'absolute', top: 12, left: 12, right: 12, maxWidth: '50%', background: 'rgba(0,0,0,0.45)', padding: '10px 14px', borderRadius: 10, fontSize: 13 }}>
            Next: {objectiveText}
          </div>
        </Html>
      )} */}
    </>
  );
}

export default function NblScene({ trim, currentTaskIndex=0, onNeutral, onReachHatch, onRailsComplete, onCollectTool, onReachAirlock, onDepthChange }) {
  return (
    <Canvas
      camera={{ position: [18, 12, 18], fov: 55 }}
      shadows
      gl={{
        antialias: true,
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.25,
      }}
    >
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 10, 120]} />
      <SceneCore
        trim={trim}
        currentTaskIndex={currentTaskIndex}
        onNeutral={onNeutral}
        onReachHatch={onReachHatch}
        onRailsComplete={onRailsComplete}
        onCollectTool={onCollectTool}
        onReachAirlock={onReachAirlock}
        onDepthChange={onDepthChange}
      />
    </Canvas>
  );
}

useGLTF.preload("/models/Astronaut.glb");
