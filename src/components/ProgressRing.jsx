// src/components/ProgressRing.jsx

import React from "react";

export const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  className = "",
  color = "hsl(var(--glow-cyan))", // Add a new prop with a default value
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="progress-ring">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--space-light))"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color} // Use the new prop here
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="progress-ring-circle"
          style={{
            filter: `drop-shadow(0 0 8px ${color} / 0.6))`, // Use the new prop here
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="progress-text">{progress}%</span>
      </div>
    </div>
  );
};