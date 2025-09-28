// app/components/NblGame.jsx
"use client"; // This MUST be the very first line

import { useState, useEffect, useRef } from "react";
import BuoyancyMeter from "./BuoyancyMeter";
import StatsPanel from "./StatsPanel";
import NblScene from "./NblScene";
import ThrustControl from "./ThrustControl";
import ParametersPanel from "./ParametersPanel";

// Define the "green zone" for neutral buoyancy
const NEUTRAL_LOWER_BOUND = 48;
const NEUTRAL_UPPER_BOUND = 52;
const SINK_FLOAT_SPEED = 0.2; 

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export default function NblGame() {
  // --- STATE MANAGEMENT ---
  // Discrete vertical trim control: -5 (rise fast), -2 (rise), 0 (hold), +2 (sink), +5 (sink fast)
  const [trim, setTrim] = useState(0);
  const [buoyancy, setBuoyancy] = useState(50); // computed from trim for neutral task checks
  const [depthMeter, setDepthMeter] = useState(50); // 0..100 depth indicator, driven by physics

  // Suit stats
  const [oxygen, setOxygen] = useState(100);
  const [co2, setCo2] = useState(0);
  const [battery, setBattery] = useState(100);
  const [heartRate, setHeartRate] = useState(80);

  // Mission
  const [missionTime, setMissionTime] = useState(0); // seconds
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("playing"); // 'playing' | 'won' | 'failed'

// Parameters (user-tunable)
  const [drag, setDrag] = useState(0.92);
  const [buoyancyK, setBuoyancyK] = useState(1.5);
  const [thrust, setThrust] = useState(3.0);
  const [modelScale, setModelScale] = useState(0.7);
  const [lightIntensity, setLightIntensity] = useState(1.2);
  const [waterAmp, setWaterAmp] = useState(0.2);
  const [waterOpacity, setWaterOpacity] = useState(0.6);
  const [camDistance, setCamDistance] = useState(24);

  // Refs for timers
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const inGreenSinceRef = useRef(null);

  // --- GAME LOGIC ---
  useEffect(() => {
    // Map trim {-5,-2,0,2,5} to meter 0..100 with 50 neutral
    const meter = 50 - (trim / 5) * 50;
    setBuoyancy(clamp(meter, 0, 100));
  }, [trim]);

  // Main simulation loop (60fps-ish)
  useEffect(() => {
    if (gameState !== "playing") return;

    const step = (timestamp) => {
      if (!lastTsRef.current) lastTsRef.current = timestamp;
      const dtMs = timestamp - lastTsRef.current;
      const dt = dtMs / 1000; // seconds
      lastTsRef.current = timestamp;

      // Mission time
      setMissionTime((t) => t + dt);

      // --- PHYSICS SIMULATION ---
      const verticalForce = (50 - buoyancy) * SINK_FLOAT_SPEED;
      setDepthMeter((d) => clamp(d + verticalForce * dt, 0, 100));
      // --- END OF PHYSICS ---

      // Resources drain
      setOxygen((o2) => clamp(o2 - 0.03 * dt, 0, 100));
      setCo2((c) => clamp(c + 0.015 * dt, 0, 100));
      setHeartRate((hr) => clamp(hr + (Math.random() - 0.5) * 0.2, 60, 140));
      const buoyancyOffset = Math.abs(buoyancy - 50) / 50;
      setBattery((b) => clamp(b - buoyancyOffset * 0.01 * dt, 0, 100));

      // Check fail conditions
      if (oxygen <= 0 || battery <= 0 || missionTime > 1800) {
        setGameState("failed");
        cancelAnimationFrame(rafRef.current);
        return;
      }

      // Task 1: Neutral buoyancy dwell
      setTasks((prev) => {
        const next = [...prev];
        const inGreen = buoyancy >= NEUTRAL_LOWER_BOUND && buoyancy <= NEUTRAL_UPPER_BOUND;
        if (inGreen) {
          if (!inGreenSinceRef.current) inGreenSinceRef.current = timestamp;
          const elapsed = (timestamp - inGreenSinceRef.current) / 1000;
          if (elapsed >= 5 && !next[0].done) {
            next[0] = { ...next[0], done: true };
            setScore((s) => s + 100);
          }
        } else {
          inGreenSinceRef.current = null;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [gameState, buoyancy, oxygen, battery, missionTime]);


  // --- RENDER ---
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white">
      <div className="relative z-10 grid grid-cols-12 gap-4 h-screen p-4">
        {/* Left sidebar */}
        <div className="col-span-2 flex flex-col gap-4">
          <BuoyancyMeter buoyancy={depthMeter} />
          <StatsPanel oxygen={oxygen} co2={co2} battery={battery} heartRate={heartRate} missionTime={missionTime} score={score} />
        </div>

        {/* Center 3D scene */}
        <div className="col-span-8 rounded-xl overflow-hidden border border-white/10 bg-black/30">
          <div className="p-3 flex items-center justify-between border-b border-white/10">
            <h1 className="text-2xl font-semibold">Neutral Buoyancy Lab</h1>
            <div className="text-sm opacity-80">
              {gameState === "playing" ? "Maintain neutral buoyancy and complete EVA tasks." : gameState === "won" ? "Mission Complete" : "Mission Failed"}
            </div>
          </div>
          <div className="h-[calc(100%-3rem)] cursor-default">
            <NblScene
              depth={depthMeter}
              trim={trim}
              drag={drag}
              buoyancyK={buoyancyK}
              thrust={thrust}
              modelScale={modelScale}
              lightIntensity={lightIntensity}
              waterAmp={waterAmp}
              waterOpacity={waterOpacity}
              camDistance={camDistance}
              onDepthChange={setDepthMeter}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="col-span-2 flex flex-col gap-4">
          <ThrustControl value={trim} onSelect={setTrim} options={[-5, -2, 0, 2, 5]} />
          <ParametersPanel
            drag={drag} onDrag={setDrag}
            buoyancyK={buoyancyK} onBuoyancyK={setBuoyancyK}
            thrust={thrust} onThrust={setThrust}
            modelScale={modelScale} onModelScale={setModelScale}
            lightIntensity={lightIntensity} onLightIntensity={setLightIntensity}
            waterAmp={waterAmp} onWaterAmp={setWaterAmp}
            waterOpacity={waterOpacity} onWaterOpacity={setWaterOpacity}
            camDistance={camDistance} onCamDistance={setCamDistance}
          />
        </div>
      </div>
    </div>
  );
}