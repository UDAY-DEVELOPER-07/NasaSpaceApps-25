// app/components/ThrustControl.jsx

export default function ThrustControl({ value, onSelect, options = [-5, -2, 0, 2, 5] }) {
  const isActive = (v) => v === value;
  return (
    <div className="p-4 bg-black/50 rounded-xl border border-white/10 text-white">
      <h3 className="text-center text-2xl mb-3">Vertical Trim</h3>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-3 py-2 rounded-lg font-bold border border-white/10 ${
              isActive(opt) ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title={opt === 0 ? 'Hold' : opt > 0 ? `Sink ${opt}` : `Rise ${Math.abs(opt)}`}
          >
            {opt > 0 ? `+${opt}` : opt}
          </button>
        ))}
      </div>
      <p className="text-xs mt-2 opacity-70 text-center">
        -5/-2 = rise, 0 = hold, +2/+5 = sink
      </p>
    </div>
  );
}
