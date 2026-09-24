import { motion } from "framer-motion";
import {
  Cpu,
  BatteryCharging,
  Database,
  Wifi,
  Mic,
  Volume2,
  Radar,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from "lucide-react";

import { useEchoMap } from "../context/EchoMapContext";

export default function SystemStatus() {
  // ================= Live Backend =================
  const socket = useEchoMap();

  const connected = socket?.connected ?? false;
  const liveData = socket?.liveData ?? {};

  // ================= System Data =================
  const system = liveData?.system ?? {
    battery: 94,
    cpuTemp: 43,
    ramUsage: 37,
    confidence: 0.87,
    level: 4,
  };

  const sensors = liveData?.sensors ?? {
    left: 42,
    center: 28,
    right: 51,
  };

  const modules = [
    {
      name: "WebSocket Connection",
      status: connected,
      icon: Wifi,
      description: "Live dashboard connection with Raspberry Pi backend.",
    },
    {
      name: "SQLite Database",
      status: connected,
      icon: Database,
      description: "Stores landmarks and navigation sessions.",
    },
    {
      name: "Voice Recognition",
      status: connected,
      icon: Mic,
      description: "Offline Vosk speech recognition module.",
    },
    {
      name: "Text-to-Speech Engine",
      status: connected,
      icon: Volume2,
      description: "pyttsx3 navigation voice guidance.",
    },
    {
      name: "Ultrasonic Sensor Engine",
      status: connected,
      icon: Radar,
      description: "HC-SR04 Left, Center and Right sensors.",
    },
    {
      name: "Navigation Engine",
      status: connected,
      icon: Navigation,
      description: "A* path planning and obstacle avoidance.",
    },
  ];

  const diagnostics = [
    {
      label: "Left Sensor Distance",
      value: `${sensors.left} cm`,
      status: sensors.left > 25,
    },
    {
      label: "Center Sensor Distance",
      value: `${sensors.center} cm`,
      status: sensors.center > 25,
    },
    {
      label: "Right Sensor Distance",
      value: `${sensors.right} cm`,
      status: sensors.right > 25,
    },
    {
      label: "CPU Temperature",
      value: `${system.cpuTemp} °C`,
      status: system.cpuTemp < 70,
    },
    {
      label: "RAM Usage",
      value: `${system.ramUsage}%`,
      status: system.ramUsage < 85,
    },
    {
      label: "Battery Level",
      value: `${system.battery}%`,
      status: system.battery > 20,
    },
  ];

  return (
    <div className="page-container space-y-8">

      {/* ================= HERO ================= */}

      <section className="hero-banner">
        <p className="text-cyan-400 uppercase tracking-[0.2em] text-sm">
          RASPBERRY PI SYSTEM HEALTH
        </p>

        <h1 className="text-5xl font-extrabold mt-3 gradient-title">
          EchoMap System Status
        </h1>

        <p className="text-slate-300 mt-4 max-w-3xl">
          Monitor Raspberry Pi hardware, ultrasonic sensors, battery, database,
          voice engine, and navigation modules in real time.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <Wifi
            size={18}
            className={connected ? "text-green-400" : "text-red-400"}
          />

          <span className="text-slate-300">
            {connected
              ? "Live Raspberry Pi Connected"
              : "Offline Dashboard Preview"}
          </span>
        </div>
      </section>

      {/* ================= SUMMARY CARDS ================= */}

      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

        <MetricCard
          icon={<BatteryCharging color="#22C55E" />}
          title="Battery"
          value={`${system.battery}%`}
          color="green"
        />

        <MetricCard
          icon={<Cpu color="#22D3EE" />}
          title="CPU Temperature"
          value={`${system.cpuTemp}°C`}
          color="cyan"
        />

        <MetricCard
          icon={<Activity color="#F59E0B" />}
          title="RAM Usage"
          value={`${system.ramUsage}%`}
          color="yellow"
        />

        <MetricCard
          icon={<Radar color="#A855F7" />}
          title="Confidence Level"
          value={`Level ${system.level}`}
          color="violet"
        />

      </section>

      {/* ================= MODULE STATUS ================= */}

      <section className="glass p-8">

        <div className="panel-header">
          <div>
            <p>ECHOMAP MODULE STATUS</p>
            <h2>Backend Services</h2>
          </div>

          <CheckCircle2 color="#22D3EE" />
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          {modules.map((module) => (
            <motion.div
              key={module.name}
              whileHover={{ y: -4 }}
              className="module-card glass-light rounded-3xl p-5"
            >
              <div className="flex justify-between items-center">

                <module.icon
                  size={28}
                  className="text-cyan-400"
                />

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    module.status
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {module.status ? "ONLINE" : "OFFLINE"}
                </span>

              </div>

              <h3 className="text-lg font-semibold text-white mt-5">
                {module.name}
              </h3>

              <p className="text-slate-400 mt-2 text-sm">
                {module.description}
              </p>
            </motion.div>
          ))}

        </div>

      </section>

      {/* ================= SENSOR HEALTH ================= */}

      <section className="glass p-8">

        <div className="panel-header">
          <div>
            <p>ULTRASONIC SENSOR STATUS</p>
            <h2>HC-SR04 Sensor Health</h2>
          </div>

          <Radar color="#22D3EE" />
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-6">

          <SensorStatusCard title="Left Sensor" distance={sensors.left} />

          <SensorStatusCard title="Center Sensor" distance={sensors.center} />

          <SensorStatusCard title="Right Sensor" distance={sensors.right} />

        </div>

      </section>

      {/* ================= DIAGNOSTICS ================= */}

      <section className="glass p-8">

        <div className="panel-header">
          <div>
            <p>LIVE SYSTEM DIAGNOSTICS</p>
            <h2>Hardware Health Check</h2>
          </div>

          <Activity color="#22D3EE" />
        </div>

        <div className="space-y-4 mt-6">

          {diagnostics.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              className="diagnostic-row flex justify-between items-center rounded-2xl border border-slate-800 bg-slate-900/60 px-5 py-4"
            >
              <div>
                <p className="text-white font-medium">{item.label}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-cyan-300 font-semibold">
                  {item.value}
                </span>

                {item.status ? (
                  <CheckCircle2 className="text-green-400" size={18} />
                ) : (
                  <AlertTriangle className="text-red-400" size={18} />
                )}
              </div>
            </motion.div>
          ))}

        </div>

      </section>

      {/* ================= SYSTEM NOTES ================= */}

      <section className="glass p-8">

        <div className="panel-header">
          <div>
            <p>RASPBERRY PI INFORMATION</p>
            <h2>EchoMap Runtime Modules</h2>
          </div>

          <Cpu color="#22D3EE" />
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-6">

          <InfoCard
            title="Controller"
            value="Raspberry Pi 3 Model B controls navigation, sensors, voice recognition, and occupancy mapping."
          />

          <InfoCard
            title="Sensor Interface"
            value="Three HC-SR04 ultrasonic sensors provide left, center, and right obstacle distances."
          />

          <InfoCard
            title="Navigation Engine"
            value="A* algorithm computes the shortest path and replans whenever a blocked path is detected."
          />

          <InfoCard
            title="Database Engine"
            value="SQLite stores landmarks, mapping information, and navigation session history."
          />

          <InfoCard
            title="Voice Recognition"
            value="Offline Vosk speech recognition processes landmark names and navigation commands."
          />

          <InfoCard
            title="Voice Output"
            value="pyttsx3 converts navigation instructions into spoken audio guidance."
          />

        </div>

      </section>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function MetricCard({ icon, title, value, color }) {
  const colors = {
    green: "text-green-400",
    cyan: "text-cyan-400",
    yellow: "text-yellow-400",
    violet: "text-violet-400",
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="glass-light rounded-3xl p-5">
      {icon}

      <p className="text-xs uppercase text-slate-400 mt-4">
        {title}
      </p>

      <h3 className={`text-3xl mt-3 font-bold ${colors[color]}`}>
        {value}
      </h3>
    </motion.div>
  );
}

function SensorStatusCard({ title, distance }) {
  const status =
    distance <= 25
      ? "Obstacle Nearby"
      : distance <= 60
      ? "Caution"
      : "Clear Path";

  const color =
    distance <= 25
      ? "text-red-400"
      : distance <= 60
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <motion.div whileHover={{ y: -4 }} className="glass-light rounded-3xl p-5">
      <Radar className="text-cyan-400" />

      <p className="text-xs uppercase text-slate-400 mt-4">{title}</p>

      <h3 className="text-3xl font-bold text-cyan-300 mt-2">
        {distance} cm
      </h3>

      <p className={`mt-3 text-sm font-medium ${color}`}>
        {status}
      </p>
    </motion.div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="glass-light rounded-2xl p-5">
      <p className="text-xs uppercase text-slate-400">
        {title}
      </p>

      <p className="text-white mt-3 leading-relaxed">
        {value}
      </p>
    </div>
  );
}