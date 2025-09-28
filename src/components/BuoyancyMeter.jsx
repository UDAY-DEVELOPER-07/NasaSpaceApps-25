// app/components/BuoyancyMeter.jsx

export default function BuoyancyMeter({ buoyancy }) {
  // Clamp the value between 0 and 100 (0 = bottom, 100 = surface)
  const needlePosition = Math.max(0, Math.min(100, buoyancy));

  return (
    <div className="w-24 h-[400px] bg-black/50 rounded-xl p-3 flex flex-col items-center border border-white/10">
      <div className="text-center mb-2 text-xs opacity-80">Surface</div>
      <div className="relative flex-grow w-full bg-gray-800 rounded-full overflow-hidden">
        {/* Neutral band (around mid-depth) */}
        <div className="absolute left-0 right-0 h-[6%] bg-green-500/40" style={{ bottom: '47%' }}></div>
        
        {/* Needle */}
        <div 
          className="absolute w-full h-1 bg-yellow-400 transition-all duration-150 ease-out"
          style={{ bottom: `${needlePosition}%` }}
        >
          <div className="absolute right-full mr-2 text-yellow-400 -translate-y-1/2">--</div>
        </div>
      </div>
      <div className="text-center mt-2 text-xs opacity-80">Bottom</div>
    </div>
  );
}
