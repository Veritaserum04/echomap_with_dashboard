import { Radar, ArrowLeft, ArrowUp, ArrowRight } from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

function SensorCard({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          {title}
        </p>

        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>

      <h2 className="text-4xl font-bold text-white">{value}</h2>

      <p className="text-cyan-300 text-sm mt-2">Centimeters</p>

      <div className="mt-4 h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
          style={{
            width: `${Math.min((value / 150) * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

export default function SensorPanel() {
  const { liveData } = useEchoMap();

  const sensors = liveData?.sensors ?? {
    left: 0,
    center: 0,
    right: 0,
  };

  return (
    <div className="glass rounded-3xl p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            ULTRASONIC SENSORS
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            Live Distance Readings
          </h2>
        </div>

        <Radar size={28} className="text-cyan-400" />
      </div>

      <div className="grid md:grid-cols-3 gap-5">

        <SensorCard
          title="Left Sensor"
          value={sensors.left}
          icon={<ArrowLeft size={20} className="text-cyan-300" />}
          color="bg-cyan-500/10"
        />

        <SensorCard
          title="Center Sensor"
          value={sensors.center}
          icon={<ArrowUp size={20} className="text-green-300" />}
          color="bg-green-500/10"
        />

        <SensorCard
          title="Right Sensor"
          value={sensors.right}
          icon={<ArrowRight size={20} className="text-purple-300" />}
          color="bg-purple-500/10"
        />

      </div>

      <div className="rounded-2xl border border-cyan-900 bg-slate-900/50 p-5">
        <p className="text-cyan-400 text-xs uppercase tracking-[0.2em] mb-4">
          Sensor Orientation
        </p>

        <div className="flex items-center justify-center gap-10 text-slate-300">
          <div className="flex flex-col items-center gap-2">
            <ArrowLeft className="text-cyan-400" size={30} />
            <span>LEFT</span>
            <span className="text-cyan-300 font-semibold">
              {sensors.left} cm
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ArrowUp className="text-green-400" size={34} />
            <span>CENTER</span>
            <span className="text-green-300 font-semibold">
              {sensors.center} cm
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="text-purple-400" size={30} />
            <span>RIGHT</span>
            <span className="text-purple-300 font-semibold">
              {sensors.right} cm
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}