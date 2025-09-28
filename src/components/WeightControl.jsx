// app/components/WeightControl.jsx

export default function WeightControl({ weight, onChange, min = -30, max = 30 }) {
  const Button = ({ delta, label, color }) => (
    <button
      onClick={() => onChange(delta)}
      className={`px-3 py-2 rounded-lg font-bold ${color} hover:brightness-110 disabled:opacity-40`}
      disabled={(weight + delta) < min || (weight + delta) > max}
      title={`Change weight by ${delta > 0 ? `+${delta}` : delta}`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-4 bg-black/50 rounded-xl border border-white/10 text-white">
      <h3 className="text-center text-2xl mb-3">Weight Adjust</h3>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button delta={+5} label="+5" color="bg-red-600" />
        <Button delta={+2} label="+2" color="bg-red-500" />
        <Button delta={-2} label="-2" color="bg-cyan-600" />
        <Button delta={-5} label="-5" color="bg-cyan-700" />
      </div>
      <div className="text-center mt-3 text-sm opacity-90">
        Current: {weight > 0 ? `+${weight}` : weight} (limit {min}..{max})
      </div>
      <p className="text-xs mt-2 opacity-70 text-center">Increase = heavier (sink). Decrease = lighter (float).</p>
    </div>
  );
}
