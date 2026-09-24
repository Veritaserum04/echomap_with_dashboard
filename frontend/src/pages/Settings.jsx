import { useState } from "react";
import {
  Cpu,
  BatteryCharging,
  Database,
  ShieldCheck,
  MapPinned,
  Activity,
  Power,
  PowerOff,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

function InfoCard({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {title}
        </p>

        <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
      </div>

      <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
  );
}

export default function Settings() {
  const { liveData, connected } = useEchoMap();

  const system = liveData?.system ?? {
    battery: 0,
    cpuTemp: 0,
    ramUsage: 0,
    confidence: 0,
    level: 0,
  };

  const analytics = liveData?.analytics ?? {
    navigationSessions: 0,
    successfulSessions: 0,
    totalLandmarks: 0,
    totalSteps: 0,
    averageConfidence: 0,
  };

  // Power Management
  const [autoStart, setAutoStart] = useState(true);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const handleShutdown = () => {
    setIsShuttingDown(true);

    setTimeout(() => {
      setIsShuttingDown(false);
      alert("EchoMap services safely stopped. Shutdown simulated.");
    }, 2500);
  };

  return (
    <div className="page-container flex flex-col gap-8">
      {/* ================= HERO ================= */}

      <section className="glass rounded-3xl p-8">
        <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs">
          SYSTEM SETTINGS
        </p>

        <h1 className="text-5xl font-bold gradient-title mt-3">
          Raspberry Pi Configuration
        </h1>

        <p className="text-slate-300 mt-4 max-w-4xl leading-7">
          Monitor device health, mapping services, navigation statistics, power
          management and backend connectivity from a single control panel.
        </p>

        <div className="flex items-center gap-3 mt-6">
          <div
            className={`w-3 h-3 rounded-full ${
              connected ? "bg-green-400" : "bg-red-500"
            }`}
          />

          <span className="text-slate-300">
            {connected
              ? "FastAPI Backend Connected"
              : "Backend Connection Offline"}
          </span>
        </div>
      </section>

      {/* ================= SYSTEM STATUS ================= */}

      <section className="glass rounded-3xl p-8 space-y-6">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            DEVICE HEALTH
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            Raspberry Pi Status
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          <InfoCard
            title="Battery"
            value={`${system.battery}%`}
            color="bg-green-500/10"
            icon={<BatteryCharging className="text-green-400" size={22} />}
          />

          <InfoCard
            title="CPU Temperature"
            value={`${system.cpuTemp}°C`}
            color="bg-orange-500/10"
            icon={<Cpu className="text-orange-400" size={22} />}
          />

          <InfoCard
            title="RAM Usage"
            value={`${system.ramUsage}%`}
            color="bg-purple-500/10"
            icon={<Activity className="text-purple-400" size={22} />}
          />

          <InfoCard
            title="SLAM Confidence"
            value={`${Math.round(system.confidence * 100)}%`}
            color="bg-cyan-500/10"
            icon={<ShieldCheck className="text-cyan-400" size={22} />}
          />
        </div>

        {/* Confidence Progress */}

        <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
          <div className="flex justify-between text-sm text-slate-300 mb-3">
            <span>Localization Confidence</span>
            <span>{Math.round(system.confidence * 100)}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-500"
              style={{
                width: `${Math.round(system.confidence * 100)}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* ================= MAPPING DATABASE ================= */}

      <section className="glass rounded-3xl p-8 space-y-6">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            MAPPING SERVICES
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            Database & Navigation Engine
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-cyan-400" size={24} />

              <h3 className="text-xl font-semibold text-white">
                SQLite Database
              </h3>
            </div>

            <p className="text-slate-400 mb-4">
              Stores landmarks, mapped coordinates, navigation metadata and
              occupancy grid information.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-2 text-green-400 text-sm">
              <CheckCircle2 size={16} />
              Connected
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <MapPinned className="text-green-400" size={24} />

              <h3 className="text-xl font-semibold text-white">
                Navigation Engine
              </h3>
            </div>

            <p className="text-slate-400 mb-4">
              Uses A* path planning with occupancy-grid mapping and ultrasonic
              obstacle avoidance.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-2 text-green-400 text-sm">
              <CheckCircle2 size={16} />
              Active
            </div>
          </div>
        </div>
      </section>

      {/* ================= POWER MANAGEMENT ================= */}

      <section className="glass rounded-3xl p-8 space-y-8">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            POWER MANAGEMENT
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            Startup & Shutdown Controls
          </h2>
        </div>

        {/* Auto Start */}

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/10">
              <Power className="text-green-400" size={28} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Auto Start EchoMap
              </h3>

              <p className="text-slate-400 text-sm mt-1">
                Automatically start EchoMap services when Raspberry Pi boots.
              </p>
            </div>
          </div>

          <button
            onClick={() => setAutoStart(!autoStart)}
            className={`px-5 py-2 rounded-xl font-semibold transition ${
              autoStart
                ? "bg-green-500/20 border border-green-500 text-green-400"
                : "bg-slate-800 border border-slate-700 text-slate-300"
            }`}
          >
            {autoStart ? "Enabled" : "Disabled"}
          </button>
        </div>

        {/* Shutdown */}

        <div className="rounded-2xl bg-slate-900/60 border border-red-500/20 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-500/10">
              <PowerOff className="text-red-400" size={28} />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white">
                Safe Shutdown
              </h3>

              <p className="text-slate-400 text-sm mt-1">
                Gracefully stop navigation, mapping, voice recognition and
                database services before shutting down.
              </p>
            </div>
          </div>

          <button
            onClick={handleShutdown}
            disabled={isShuttingDown}
            className="px-5 py-2 rounded-xl bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30 disabled:opacity-60"
          >
            {isShuttingDown ? "Shutting Down..." : "Shutdown Pi"}
          </button>
        </div>

        {/* Power Cards */}

        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="text-cyan-400" size={22} />

              <h3 className="font-semibold text-white">Service Protection</h3>
            </div>

            <p className="text-slate-400 text-sm leading-6">
              Safe shutdown prevents interruption of mapping, navigation, and
              SQLite operations while saving the latest device state.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Clock3 className="text-yellow-400" size={22} />

              <h3 className="font-semibold text-white">Boot Mode</h3>
            </div>

            <p className="text-slate-400 text-sm mb-3">
              Current startup configuration for EchoMap.
            </p>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${
                autoStart
                  ? "bg-green-500/10 text-green-400"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              <CheckCircle2 size={16} />
              {autoStart
                ? "Automatic Startup Enabled"
                : "Manual Startup Mode"}
            </span>
          </div>
        </div>

        {/* Info */}

        <div className="rounded-2xl bg-cyan-500/5 border border-cyan-900 p-5">
          <h3 className="text-cyan-300 font-semibold mb-3">
            Power Management Information
          </h3>

          <ul className="space-y-2 text-slate-300 text-sm leading-6">
            <li>
              • Auto Start launches backend services, ultrasonic sensors,
              navigation engine and speech recognition after boot.
            </li>

            <li>
              • Safe Shutdown closes running services and preserves the latest
              mapping and landmark information.
            </li>
          </ul>
        </div>
      </section>

      {/* ================= ANALYTICS ================= */}

      <section className="glass rounded-3xl p-8 space-y-6">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            NAVIGATION ANALYTICS
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            Usage Statistics
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          <InfoCard
            title="Sessions"
            value={analytics.navigationSessions}
            color="bg-cyan-500/10"
            icon={<Activity className="text-cyan-400" size={22} />}
          />

          <InfoCard
            title="Successful Sessions"
            value={analytics.successfulSessions}
            color="bg-green-500/10"
            icon={<CheckCircle2 className="text-green-400" size={22} />}
          />

          <InfoCard
            title="Saved Landmarks"
            value={analytics.totalLandmarks}
            color="bg-yellow-500/10"
            icon={<MapPinned className="text-yellow-400" size={22} />}
          />

          <InfoCard
            title="Total Steps"
            value={analytics.totalSteps}
            color="bg-purple-500/10"
            icon={<Activity className="text-purple-400" size={22} />}
          />
        </div>

        <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
          <div className="flex justify-between text-sm text-slate-300 mb-3">
            <span>Average Navigation Confidence</span>
            <span>{Math.round(analytics.averageConfidence * 100)}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-500"
              style={{
                width: `${Math.round(
                  analytics.averageConfidence * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}