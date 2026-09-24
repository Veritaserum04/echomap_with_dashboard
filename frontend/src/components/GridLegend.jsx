export default function GridLegend() {
  const legend = [
    ["bg-cyan-400", "Current Position"],
    ["bg-green-400", "Destination"],
    ["bg-red-500", "Obstacle"],
    ["bg-violet-700", "Visited Cell"],
    ["bg-cyan-700", "Planned A* Path"],
    ["bg-yellow-300", "Saved Landmark"],
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-lg">
      <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs mb-5">
        MAP LEGEND
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        {legend.map(([color, label]) => (
          <div key={label} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded ${color}`} />
            <span className="text-slate-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}