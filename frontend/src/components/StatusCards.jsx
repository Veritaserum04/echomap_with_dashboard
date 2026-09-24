import {
  BatteryCharging,
  Cpu,
  MemoryStick,
  ShieldCheck,
} from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

function Card({ title, value, unit, icon, color }) {
  return (
    <div className="glass rounded-2xl px-4 py-4 border border-cyan-900/30">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
          {title}
        </p>

        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      </div>

      <div className="flex items-end gap-1">
        <h2 className="text-2xl font-bold text-white leading-none">
          {value}
        </h2>

        <span className="text-sm text-cyan-300 mb-0.5">{unit}</span>
      </div>
    </div>
  );
}

export default function StatusCards() {
  const { liveData } = useEchoMap();

  const system = liveData?.system ?? {
    battery: 0,
    cpuTemp: 0,
    ramUsage: 0,
    confidence: 0,
  };

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <Card
        title="Battery"
        value={system.battery}
        unit="%"
        color="bg-green-500/10"
        icon={<BatteryCharging className="text-green-400" size={18} />}
      />

      <Card
        title="CPU Temp"
        value={system.cpuTemp}
        unit="°C"
        color="bg-orange-500/10"
        icon={<Cpu className="text-orange-400" size={18} />}
      />

      <Card
        title="RAM Usage"
        value={system.ramUsage}
        unit="%"
        color="bg-purple-500/10"
        icon={<MemoryStick className="text-purple-400" size={18} />}
      />

      <Card
        title="Confidence"
        value={Math.round(system.confidence * 100)}
        unit="%"
        color="bg-cyan-500/10"
        icon={<ShieldCheck className="text-cyan-400" size={18} />}
      />
    </div>
  );
}