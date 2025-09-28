// app/components/ParametersPanel.jsx

export default function ParametersPanel({
  drag, onDrag,
  buoyancyK, onBuoyancyK,
  thrust, onThrust,
  modelScale, onModelScale,
  lightIntensity, onLightIntensity,
  waterAmp, onWaterAmp,
  waterOpacity, onWaterOpacity,
  camDistance, onCamDistance,
}) {
  const Row = ({ label, children }) => (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-sm opacity-80">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
  const Num = ({ value }) => (
    <span className="text-sm tabular-nums w-10 text-right">{typeof value === 'number' ? value.toFixed(2) : value}</span>
  );
  const Slider = (props) => (
    <input type="range" className="w-40" {...props} />
  );

  return (
    <div className="p-4 rounded-xl text-white">
      <h3 className="text-xl font-semibold mb-2">Parameters</h3>
      <div className="space-y-1">
        <Row label="Drag">
          <Slider min={0.7} max={0.99} step={0.01} value={drag} onChange={(e) => onDrag(parseFloat(e.target.value))} />
          <Num value={drag} />
        </Row>
        <Row label="Buoyancy K">
          <Slider min={0.5} max={3.0} step={0.1} value={buoyancyK} onChange={(e) => onBuoyancyK(parseFloat(e.target.value))} />
          <Num value={buoyancyK} />
        </Row>
        <Row label="Thrust">
          <Slider min={0.5} max={6.0} step={0.1} value={thrust} onChange={(e) => onThrust(parseFloat(e.target.value))} />
          <Num value={thrust} />
        </Row>
        <Row label="Model Scale">
          <Slider min={0.5} max={1.5} step={0.05} value={modelScale} onChange={(e) => onModelScale(parseFloat(e.target.value))} />
          <Num value={modelScale} />
        </Row>
        <Row label="Light Intensity">
          <Slider min={0.2} max={2.0} step={0.1} value={lightIntensity} onChange={(e) => onLightIntensity(parseFloat(e.target.value))} />
          <Num value={lightIntensity} />
        </Row>
        <Row label="Water Amplitude">
          <Slider min={0.0} max={0.6} step={0.02} value={waterAmp} onChange={(e) => onWaterAmp(parseFloat(e.target.value))} />
          <Num value={waterAmp} />
        </Row>
        <Row label="Water Opacity">
          <Slider min={0.2} max={0.9} step={0.05} value={waterOpacity} onChange={(e) => onWaterOpacity(parseFloat(e.target.value))} />
          <Num value={waterOpacity} />
        </Row>
        <Row label="Camera Distance">
          <Slider min={8} max={75} step={1} value={camDistance} onChange={(e) => onCamDistance(parseInt(e.target.value, 10))} />
          <Num value={camDistance} />
        </Row>
      </div>
    </div>
  );
}
