import { motion } from "framer-motion";
import {
  BarChart3,
  BatteryCharging,
  Route,
  MapPinned,
  TrendingUp,
  ShieldCheck,
  Wifi,
  Activity,
} from "lucide-react";

import { useEchoMap } from "../context/EchoMapContext";
import ConfidenceMeter from "../components/ConfidenceMeter";
import BatteryWidget from "../components/BatteryWidget";

export default function Analytics() {
  // ================= Live Backend =================
  const socket = useEchoMap();

  const connected = socket?.connected ?? false;
  const liveData = socket?.liveData ?? {};

  // ================= Analytics =================
  const analytics = liveData?.analytics ?? {
    navigationSessions: 14,
    successfulSessions: 12,
    totalLandmarks: 9,
    totalSteps: 248,
    averageConfidence: 0.87,
    mappedArea: 61,
  };

  const system = liveData?.system ?? {
    battery: 94,
    cpuTemp: 43,
    ramUsage: 37,
    confidence: 0.87,
    level: 4,
  };

  // ================= Session History =================
  const sessions = liveData?.sessions ?? [
    {
      destination: "Computer Lab",
      status: "Completed",
      distance: "38 m",
      confidence: "92%",
    },
    {
      destination: "Library",
      status: "Completed",
      distance: "26 m",
      confidence: "88%",
    },
    {
      destination: "Entrance",
      status: "Completed",
      distance: "18 m",
      confidence: "95%",
    },
    {
      destination: "Canteen",
      status: "Stopped",
      distance: "11 m",
      confidence: "73%",
    },
  ];

  const successRate = Math.round(
    (analytics.successfulSessions /
      analytics.navigationSessions) *
      100
  );

  return (
    <div className="page-container space-y-8">

      {/* ================= HERO ================= */}

      <section className="hero-banner">
        <p className="text-cyan-400 uppercase tracking-[0.2em] text-sm">
          SYSTEM ANALYTICS
        </p>

        <h1 className="text-5xl font-extrabold mt-3 gradient-title">
          EchoMap Navigation Analytics
        </h1>

        <p className="text-slate-300 mt-4 max-w-3xl">
          Live statistics collected from Raspberry Pi navigation sessions,
          ultrasonic mapping, battery monitoring, and confidence estimation.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <Wifi
            size={18}
            className={
              connected ? "text-green-400" : "text-red-400"
            }
          />

          <span className="text-slate-300">
            {connected
              ? "Analytics Streaming from Raspberry Pi"
              : "Offline Analytics Preview"}
          </span>
        </div>
      </section>

      {/* ================= SUMMARY CARDS ================= */}

      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

        <SummaryCard
          icon={<Route color="#22D3EE" />}
          title="Navigation Sessions"
          value={analytics.navigationSessions}
          color="cyan"
        />

        <SummaryCard
          icon={<ShieldCheck color="#22C55E" />}
          title="Successful Sessions"
          value={analytics.successfulSessions}
          color="green"
        />

        <SummaryCard
          icon={<MapPinned color="#A855F7" />}
          title="Saved Landmarks"
          value={analytics.totalLandmarks}
          color="violet"
        />

        <SummaryCard
          icon={<Activity color="#F59E0B" />}
          title="Total Walking Steps"
          value={analytics.totalSteps}
          color="yellow"
        />

      </section>

      {/* ================= CONFIDENCE + BATTERY ================= */}

      <section className="grid xl:grid-cols-[1fr_1fr] gap-6">

        <div className="glass p-8">
          <div className="panel-header">
            <div>
              <p>NAVIGATION CONFIDENCE</p>
              <h2>Confidence Estimation Model</h2>
            </div>

            <TrendingUp color="#22D3EE" />
          </div>

          <ConfidenceMeter
            confidence={system.confidence}
            level={system.level}
          />

          <div className="mt-6">
            <p className="text-slate-400 text-sm">
              Confidence is computed using EchoMap's navigation confidence model
              based on obstacle encounters, replanning events, and successful
              path execution.
            </p>
          </div>
        </div>

        <div className="glass p-8">
          <div className="panel-header">
            <div>
              <p>RASPBERRY PI SYSTEM HEALTH</p>
              <h2>Battery & Performance</h2>
            </div>

            <BatteryCharging color="#22C55E" />
          </div>

          <BatteryWidget battery={system.battery} />

          <div className="space-y-5 mt-6">

            <MetricRow
              label="CPU Temperature"
              value={`${system.cpuTemp}°C`}
            />

            <MetricRow
              label="RAM Usage"
              value={`${system.ramUsage}%`}
            />

            <MetricRow
              label="Battery Remaining"
              value={`${system.battery}%`}
            />

          </div>
        </div>

      </section>

      {/* ================= SUCCESS RATE ================= */}

      <section className="glass p-8">

        <div className="panel-header">
          <div>
            <p>SESSION PERFORMANCE</p>
            <h2>Navigation Success Rate</h2>
          </div>

          <BarChart3 color="#22D3EE" />
        </div>

        <div className="mt-6">

          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Successful Navigation Sessions</span>

            <span>{successRate}%</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${successRate}%` }}
            />
          </div>

          <p className="text-slate-400 text-sm mt-4">
            {analytics.successfulSessions} successful sessions out of{" "}
            {analytics.navigationSessions} recorded navigation sessions.
          </p>
        </div>
      </section>

      {/* ================= MAPPING ANALYTICS ================= */}

      <section className="glass p-8">

        <div className="panel-header">
          <div>
            <p>OCCUPANCY GRID ANALYTICS</p>
            <h2>Mapping Progress</h2>
          </div>

          <MapPinned color="#22D3EE" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">

          <AnalyticsMetric
            title="Mapped Area"
            value={`${analytics.mappedArea}%`}
          />

          <AnalyticsMetric
            title="Average Confidence"
            value={`${Math.round(
              analytics.averageConfidence * 100
            )}%`}
          />

          <AnalyticsMetric
            title="Detected Landmarks"
            value={analytics.totalLandmarks}
          />

          <AnalyticsMetric
            title="Walking Distance"
            value={`${analytics.totalSteps} Steps`}
          />

        </div>
      </section>

      {/* ================= SESSION HISTORY ================= */}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass p-8"
      >
        <div className="panel-header">
          <div>
            <p>NAVIGATION HISTORY</p>
            <h2>Recent Navigation Sessions</h2>
          </div>

          <Route color="#22D3EE" />
        </div>

        <div className="space-y-4 mt-6">

          {sessions.map((session, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="flex justify-between items-center flex-wrap gap-3">

                <div>
                  <p className="text-white font-semibold">
                    {session.destination}
                  </p>

                  <p className="text-slate-400 text-sm mt-1">
                    Distance Travelled: {session.distance}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-semibold ${
                      session.status === "Completed"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {session.status}
                  </span>

                  <p className="text-cyan-300 mt-1">
                    Confidence {session.confidence}
                  </p>
                </div>

              </div>
            </motion.div>
          ))}

        </div>
      </motion.section>

      {/* ================= ANALYTICS NOTES ================= */}

      <section className="glass p-8">

        <div className="panel-header">
          <div>
            <p>ANALYTICS ENGINE</p>
            <h2>How EchoMap Calculates Analytics</h2>
          </div>

          <TrendingUp color="#22D3EE" />
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          <InfoCard
            title="Navigation Sessions"
            value="Every completed navigation route is stored in SQLite for future analytics."
          />

          <InfoCard
            title="Confidence Model"
            value="Confidence decreases when dynamic obstacles trigger replanning and increases after successful route completion."
          />

          <InfoCard
            title="Occupancy Grid Coverage"
            value="Mapped area percentage is calculated from explored occupancy grid cells."
          />

          <InfoCard
            title="Battery Monitoring"
            value="Battery level and Raspberry Pi health are streamed live to the dashboard."
          />

        </div>

      </section>

    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function SummaryCard({ icon, title, value, color }) {
  const colors = {
    cyan: "text-cyan-400",
    green: "text-green-400",
    violet: "text-violet-400",
    yellow: "text-yellow-400",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-light rounded-3xl p-5"
    >
      {icon}

      <p className="text-xs uppercase text-slate-400 mt-4">{title}</p>

      <h3 className={`text-2xl font-bold mt-2 ${colors[color]}`}>
        {value}
      </h3>
    </motion.div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-800 pb-3">
      <span className="text-slate-400">{label}</span>

      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

function AnalyticsMetric({ title, value }) {
  return (
    <div className="glass-light rounded-2xl p-5">
      <p className="text-xs uppercase text-slate-400">{title}</p>

      <h3 className="text-3xl font-bold text-cyan-300 mt-3">
        {value}
      </h3>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="glass-light rounded-2xl p-5">
      <p className="text-xs uppercase text-slate-400">{title}</p>

      <p className="text-white mt-3 leading-relaxed">{value}</p>
    </div>
  );
}