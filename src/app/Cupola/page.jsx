"use client";

import React, { useEffect, useRef } from "react";

export default function AetherDashboard() {
  const playerRef = useRef(null);

  useEffect(() => {
    // Prevent loading API multiple times
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    // Wait until API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) return; // already initialized

      playerRef.current = new window.YT.Player("yt-player", {
        videoId: "53yrefq77xE", // 360° video ID
        playerVars: {
          autoplay: 1,
          mute: 1, // ✅ required for autoplay
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            event.target.mute();
            event.target.playVideo();
          },
        },
      });
    };

    const handleWheel = (e) => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        const change = e.deltaY > 0 ? 0.5 : -0.5; // scroll = scrub
        const newTime = Math.max(currentTime + change, 0);

        playerRef.current.seekTo(newTime, true);

        // ✅ Instead of play→pause, just pause so the frame updates
        playerRef.current.pauseVideo();
      }
      e.preventDefault();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <div
        id="yt-player"
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "auto", // allow dragging for 360° video
        }}
      ></div>
    </div>
  );
}
