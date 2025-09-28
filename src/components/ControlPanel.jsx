// app/components/ControlPanel.jsx

export default function ControlPanel({ onWeightChange, onFlotationChange }) {
  const buttonStyle = "w-40 text-lg font-bold py-2 px-3 rounded-lg transition-transform transform hover:scale-105";

  return (
    <div className="flex flex-col space-y-4 p-6 bg-black/50 rounded-xl border border-white/10">
      {/* Weight Controls */}
      <div className="text-center">
        <h3 className="text-2xl mb-2">Weight</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => onWeightChange(10)} className={`${buttonStyle} bg-red-600 hover:bg-red-700`}>
            +10
          </button>
          <button onClick={() => onWeightChange(5)} className={`${buttonStyle} bg-red-500 hover:bg-red-600`}>
            +5
          </button>
          <button onClick={() => onWeightChange(-5)} className={`${buttonStyle} bg-red-800 hover:bg-red-900`}>
            -5
          </button>
          <button onClick={() => onWeightChange(-10)} className={`${buttonStyle} bg-red-900 hover:bg-red-950`}>
            -10
          </button>
        </div>
      </div>
      {/* Flotation Controls */}
      <div className="text-center mt-2">
        <h3 className="text-2xl mb-2">Flotation</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          <button onClick={() => onFlotationChange(10)} className={`${buttonStyle} bg-cyan-500 hover:bg-cyan-600`}>
            +10
          </button>
          <button onClick={() => onFlotationChange(5)} className={`${buttonStyle} bg-cyan-400 hover:bg-cyan-500`}>
            +5
          </button>
          <button onClick={() => onFlotationChange(-5)} className={`${buttonStyle} bg-cyan-700 hover:bg-cyan-800`}>
            -5
          </button>
          <button onClick={() => onFlotationChange(-10)} className={`${buttonStyle} bg-cyan-800 hover:bg-cyan-900`}>
            -10
          </button>
        </div>
      </div>
    </div>
  );
}
