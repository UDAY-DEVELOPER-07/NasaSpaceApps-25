"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function VideoSphere({ videoUrl }) {
  const meshRef = useRef();
  const videoRef = useRef(null);
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.loop = false;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    // Only create texture after metadata loads
    video.addEventListener("loadeddata", () => {
      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.wrapS = THREE.ClampToEdgeWrapping;
      videoTexture.wrapT = THREE.ClampToEdgeWrapping;
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBFormat;
      setTexture(videoTexture);
    });

    // Must be started by user interaction
    const startVideo = () => {
      video.play().catch((err) => console.warn("Autoplay blocked:", err));
      window.removeEventListener("click", startVideo);
    };
    window.addEventListener("click", startVideo);

    videoRef.current = video;
  }, [videoUrl]);

  // Keep texture updated each frame
  useFrame(() => {
    if (texture) {
      texture.needsUpdate = true;
    }
  });

  // Scroll scrubbing
  useEffect(() => {
    const handleWheel = (e) => {
      const video = videoRef.current;
      if (video && video.duration) {
        const delta = e.deltaY > 0 ? 0.5 : -0.5;
        let newTime = Math.max(0, Math.min(video.currentTime + delta, video.duration));
        video.currentTime = newTime;
        video.pause();
      }
      e.preventDefault();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[500, 60, 40]} />
      {texture && <meshBasicMaterial map={texture} side={THREE.BackSide} />}
    </mesh>
  );
}

export default function AetherDashboard() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <VideoSphere videoUrl="https://drive.google.com/uc?export=download&id=1SedbAoiOa3HeqjU856paJ0Uf10zWG0jV" />
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "8px 12px",
          borderRadius: "6px",
        }}
      >
        👉 Click anywhere to start video
      </div>
    </div>
  );
}
