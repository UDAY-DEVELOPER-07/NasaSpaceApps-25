// app/components/TrimControl.jsx

export default function TrimControl({ trim, onTrimChange }) {
  return (
    <div className="p-4 bg-black/50 rounded-xl border border-white/10">
      <h3 className="text-center text-2xl mb-3">Buoyancy Trim</h3>
      <div className="flex items-center gap-3">
        <span className="text-sm opacity-80">Sink</span>
        <input
          type="range"
          min={-50}
          max={50}
          step={1}
          value={trim}
          onChange={(e) => onTrimChange(parseInt(e.target.value, 10))}
          className="w-full"
        />
        <span className="text-sm opacity-80">Float</span>
      </div>
      <div className="text-center mt-2 text-sm opacity-90">{trim > 0 ? `+${trim}` : trim} trim</div>
    </div>
  );
}
