import { motion } from "framer-motion";
import {
  BatteryCharging,
  Route,
  ScanSearch,
  MapPinned,
  ShieldCheck,
  Cpu,
  ArrowUpRight,
  Wifi,
} from "lucide-react";

import HeroBanner from "../components/HeroBanner";
import BatteryWidget from "../components/BatteryWidget";
import ConfidenceMeter from "../components/ConfidenceMeter";
import ConnectionIndicator from "../components/ConnectionIndicator";
import ActiveTimeline from "../components/ActiveTimeline";
import ModeCards from "../components/ModeCards";
import NotificationCenter from "../components/NotificationCenter";
import StatusCards from "../components/StatusCards";
import { useEchoMap } from "../context/EchoMapContext";

export default function Overview() {
  // Live data from FastAPI + WebSocket
  const { connected, liveData } = useEchoMap();
  console.log("Overview Live Data:", liveData);
  const system = liveData?.system ?? {};
  const analytics = liveData?.analytics ?? {};
  const navigation = liveData?.navigation ?? {};
  const sensors = liveData?.sensors ?? {};

  return (
    <div className="page-container space-y-8">
      {/* ================= HERO ================= */}
      <HeroBanner
        title="Raspberry Pi Navigation Console"
        subtitle="Indoor Navigation System"
        description="Real-time indoor navigation dashboard powered by Raspberry Pi, ultrasonic sensors, SQLite landmarks, mapping mode, and voice navigation."
        status={connected ? "Live" : "Offline"}
      />
      <StatusCards />
      {/* ================= CONNECTION ================= */}
      <ConnectionIndicator connected={connected} />

      {/* ================= TOP CARDS ================= */}
      <section className="grid lg:grid-cols-4 md:grid-cols-2 gap-5">
        <BatteryWidget battery={system.battery ?? 96} />

        <ConfidenceMeter confidence={system.confidence ?? 0.91} />

        <StatusCard
          title="CPU Temperature"
          value={`${system.cpuTemp ?? 42}°C`}
          icon={<Cpu color="#22D3EE" size={24} />}
        />

        <StatusCard
          title="RAM Usage"
          value={`${system.ramUsage ?? 34}%`}
          icon={<ShieldCheck color="#10B981" size={24} />}
        />
      </section>

      {/* ================= SENSOR STATUS ================= */}
      <section className="glass p-6">
        <div className="panel-header">
          <div>
            <p>LIVE ULTRASONIC SENSORS</p>
            <h2>Obstacle Detection</h2>
          </div>

          <ScanSearch color="#22D3EE" />
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-6">
          <SensorCard title="Left Sensor" value={sensors.left ?? 0} />
          <SensorCard title="Center Sensor" value={sensors.center ?? 0} />
          <SensorCard title="Right Sensor" value={sensors.right ?? 0} />
        </div>
      </section>

      {/* ================= NAVIGATION SUMMARY ================= */}
      <section className="glass p-6">
        <div className="panel-header">
          <div>
            <p>LIVE NAVIGATION STATUS</p>
            <h2>Current Navigation Instruction</h2>
          </div>

          <Route color="#22D3EE" />
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-cyan-500 bg-cyan-500/10 p-6">
            <p className="text-xs uppercase text-cyan-300">
              Current Instruction
            </p>

            <h2 className="text-3xl font-bold text-white mt-3">
              {navigation.instruction ?? "Waiting for destination..."}
            </h2>

            <p className="text-slate-400 mt-3">
              Heading:{" "}
              <span className="text-cyan-300 font-semibold">
                {navigation.heading ?? "NORTH"}
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <LiveStat
              label="Destination"
              value={navigation.destination ?? "None"}
              icon={<MapPinned color="#A855F7" size={20} />}
            />

            <LiveStat
              label="Remaining Distance"
              value={`${navigation.remainingDistance ?? 0} m`}
              icon={<ArrowUpRight color="#22D3EE" size={20} />}
            />

            <LiveStat
              label="Remaining Steps"
              value={navigation.remainingSteps ?? 0}
              icon={<Route color="#F59E0B" size={20} />}
            />

            <LiveStat
              label="Route Progress"
              value={`${navigation.progress ?? 0}%`}
              icon={<Wifi color="#22C55E" size={20} />}
            />
          </div>
        </div>
      </section>

      {/* ================= ANALYTICS ================= */}
      <section className="glass p-6">
        <div className="panel-header">
          <div>
            <p>ANALYTICS OVERVIEW</p>
            <h2>Navigation Performance</h2>
          </div>

          <BatteryCharging color="#22D3EE" />
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-5 mt-6">
          <MetricCard
            title="Sessions"
            value={analytics.navigationSessions ?? 0}
          />

          <MetricCard
            title="Successful Routes"
            value={analytics.successfulSessions ?? 0}
          />

          <MetricCard
            title="Landmarks Saved"
            value={analytics.totalLandmarks ?? 0}
          />

          <MetricCard
            title="Steps Explored"
            value={analytics.totalSteps ?? 0}
          />
        </div>
      </section>

      {/* ================= EXISTING COMPONENTS ================= */}
      <ModeCards />
      <ActiveTimeline />
      <NotificationCenter />
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatusCard({ title, value, icon }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-light rounded-3xl p-5">
      <div className="flex justify-between items-center">
        <p className="text-xs uppercase text-slate-400">{title}</p>
        {icon}
      </div>

      <h3 className="text-3xl text-cyan-300 font-bold mt-4">{value}</h3>
    </motion.div>
  );
}

function SensorCard({ title, value }) {
  const status =
    value <= 25 ? "Obstacle Nearby" : value <= 60 ? "Caution" : "Clear";

  const color =
    value <= 25
      ? "text-red-400"
      : value <= 60
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <motion.div whileHover={{ y: -4 }} className="glass-light rounded-3xl p-5">
      <p className="text-xs uppercase text-slate-400">{title}</p>

      <h3 className="text-3xl font-bold text-cyan-300 mt-3">{value} cm</h3>

      <p className={`mt-2 text-sm font-medium ${color}`}>{status}</p>
    </motion.div>
  );
}

function LiveStat({ label, value, icon }) {
  return (
    <div className="flex justify-between items-center rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
      <div className="flex items-center gap-3">
        {icon}
        <p className="text-slate-300">{label}</p>
      </div>

      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

function MetricCard({ title, value }) {
  return (
    <div className="glass-light rounded-2xl p-5">
      <p className="text-xs uppercase text-slate-400">{title}</p>

      <h3 className="text-3xl text-cyan-300 font-bold mt-3">{value}</h3>
    </div>
  );
}