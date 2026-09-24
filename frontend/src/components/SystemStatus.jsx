import {
  BatteryCharging,
  Cpu,
  MemoryStick,
  ShieldCheck,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

function StatusCard({ title, value, unit, icon, color }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
          {title}
        </p>

        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      </div>

      <h2 className="text-4xl font-bold text-white">
        {value}
        <span className="text-xl text-cyan-300 ml-1">{unit}</span>
      </h2>
    </div>
  );
}

function ProgressBar({ value, color }) {
  return (
    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}

export default function SystemStatus() {
  const { liveData, connected } = useEchoMap();

  const system = liveData?.system ?? {
    battery: 0,
    cpuTemp: 0,
    ramUsage: 0,
    confidence: 0,
  };

  const confidence = Math.round((system.confidence ?? 0) * 100);

  return (
    <div className="glass rounded-3xl p-6 space-y-6">
      {/* Header */}
      <div>
        <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
          SYSTEM HEALTH
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          Raspberry Pi Status
        </h2>
      </div>

      {/* Backend Connection */}
      <div
        className={`rounded-2xl border p-4 flex items-center justify-between ${
          connected
            ? "border-green-500/30 bg-green-500/10"
            : "border-red-500/30 bg-red-500/10"
        }`}
      >
        <div className="flex items-center gap-3">
          {connected ? (
            <Wifi className="text-green-400" size={22} />
          ) : (
            <WifiOff className="text-red-400" size={22} />
          )}

          <div>
            <p className="font-semibold text-white">Backend Connection</p>
            <p className="text-sm text-slate-400">
              {connected
                ? "FastAPI + Raspberry Pi Connected"
                : "Waiting for Backend"}
            </p>
          </div>
        </div>

        <span
          className={`font-semibold ${
            connected ? "text-green-400" : "text-red-400"
          }`}
        >
          {connected ? "ONLINE" : "OFFLINE"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatusCard
          title="Battery"
          value={system.battery}
          unit="%"
          color="bg-green-500/10"
          icon={<BatteryCharging className="text-green-400" size={20} />}
        />

        <StatusCard
          title="CPU Temperature"
          value={system.cpuTemp}
          unit="°C"
          color="bg-orange-500/10"
          icon={<Cpu className="text-orange-400" size={20} />}
        />

        <StatusCard
          title="RAM Usage"
          value={system.ramUsage}
          unit="%"
          color="bg-purple-500/10"
          icon={<MemoryStick className="text-purple-400" size={20} />}
        />

        <StatusCard
          title="SLAM Confidence"
          value={confidence}
          unit="%"
          color="bg-cyan-500/10"
          icon={<ShieldCheck className="text-cyan-400" size={20} />}
        />
      </div>

      {/* Live Progress Bars */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5 space-y-5">
        <div>
          <div className="flex justify-between text-sm text-slate-300 mb-2">
            <span>Battery Level</span>
            <span>{system.battery}%</span>
          </div>

          <ProgressBar value={system.battery} color="bg-green-400" />
        </div>

        <div>
          <div className="flex justify-between text-sm text-slate-300 mb-2">
            <span>CPU Temperature</span>
            <span>{system.cpuTemp}°C</span>
          </div>

          {/* Scale 80°C → 100% */}
          <ProgressBar
            value={(system.cpuTemp / 80) * 100}
            color="bg-orange-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm text-slate-300 mb-2">
            <span>RAM Usage</span>
            <span>{system.ramUsage}%</span>
          </div>

          <ProgressBar value={system.ramUsage} color="bg-purple-400" />
        </div>

        <div>
          <div className="flex justify-between text-sm text-slate-300 mb-2">
            <span>SLAM Confidence</span>
            <span>{confidence}%</span>
          </div>

          <ProgressBar value={confidence} color="bg-cyan-400" />
        </div>
      </div>
    </div>
  );
}