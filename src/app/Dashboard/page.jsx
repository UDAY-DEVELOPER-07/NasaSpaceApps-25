"use client"
import React from "react";
import { SparklesCore } from "@/components/ui/background";
import AetherDashboard from "@/components/dashboard";

export default function Dashboard() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-black overflow-hidden">
      {/* Background */}
      <SparklesCore
        background="transparent"
        minSize={1}
        maxSize={1}
        speed={1}
        particleColor="#ffffff"
        particleDensity={50}
        className="absolute inset-0 h-full w-full"
      />
      <AetherDashboard/>
    </div>
  );
}
