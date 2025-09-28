// app/components/StatsPanel.jsx

export default function StatsPanel({ oxygen, co2, battery, heartRate, missionTime, score }) {
  const stat = (label, value, suffix = "") => (
    <div className="flex justify-between text-sm">
      <span className="opacity-80">{label}</span>
      <span className="font-semibold">{value}{suffix}</span>
    </div>
  );

  const ring = (label, value, color) => (
    <div className="flex flex-col items-center px-1 py-1 rounded-md bg-white/5">
      <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center" style={{ borderColor: color }}>
        <span className="text-base font-bold">{Math.round(value)}%</span>
      </div>
      <div className="mt-2 text-xs opacity-80 whitespace-nowrap">{label}</div>
    </div>
  );

  return (
    <div className="p-1 rounded-xl  text-white">
      <div className="flex items-center justify-between gap-2 mb-3">
        {ring("Oxygen", oxygen, "#22c55e")}
        {ring("Battery", battery, "#38bdf8")}
        {ring("CO₂", 100 - Math.max(0, 100 - co2), "#ef4444")}
      </div>
      <div className="space-y-1">
        {stat("Heart Rate", Math.round(heartRate), " bpm")}
        {stat("Mission Time", Math.floor(missionTime), " s")}
        {stat("Score", Math.round(score))}
      </div>
    </div>
  );
}
