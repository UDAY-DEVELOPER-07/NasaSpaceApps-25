"use client"
import React, { useState, useEffect } from "react";

export default function AetherDashboard() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleWheel = (e) => {
      setScale((prev) => {
        const newScale = prev + e.deltaY * 0.0015;
        return Math.max(1, Math.min(newScale, 5));
      });
      e.preventDefault();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden", position: "relative" }}>
      <iframe
        title="YouTube 360 Video"
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/53yrefq77xE?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1"
        frameBorder="0"
        allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      ></iframe>

      {/* <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          transition: "transform 0.1s linear",
        }}
      >
        <img
          src="/assets/img4.png"
          alt="Cupola View"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </div> */}
    </div>
  );
}
