import { motion } from "framer-motion";
import {
  MapPinned,
  BatteryCharging,
  Wifi,
  ShieldCheck,
} from "lucide-react";

export default function HeroBanner({
  battery = 95,
  confidence = 0.5,
  connected = false,
}) {
  const confidencePercent = Math.round(confidence * 100);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950 to-violet-950 border border-slate-800 p-8"
    >
      {/* Background Glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-20 left-0 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
        <div>
          <p className="text-cyan-400 uppercase tracking-widest text-sm font-semibold">
            EchoMap Major Project
          </p>

          <h1 className="text-4xl font-bold text-white mt-2">
            Low-Cost Wearable Indoor Navigation System
          </h1>

          <p className="text-slate-300 mt-4 max-w-xl">
            Raspberry Pi 3 • Ultrasonic SLAM • Offline Vosk Speech Recognition •
            SQLite Landmark Database • React Dashboard
          </p>

          <div className="flex gap-3 mt-6 flex-wrap">
            <Badge connected={connected} />
            <Tag icon={<BatteryCharging size={14} />} text={`${battery}% Battery`} />
            <Tag icon={<ShieldCheck size={14} />} text={`${confidencePercent}% Confidence`} />
          </div>
        </div>

        {/* Live Status */}
        <div className="grid grid-cols-2 gap-4 min-w-[250px]">
          <StatusCard label="Battery" value={`${battery}%`} color="text-green-400" />
          <StatusCard label="Confidence" value={`${confidencePercent}%`} color="text-cyan-400" />
          <StatusCard label="Backend" value={connected ? "Online" : "Offline"} color={connected ? "text-green-400" : "text-red-400"} />
          <StatusCard label="Device" value="Raspberry Pi 3" color="text-violet-400" />
        </div>
      </div>
    </motion.section>
  );
}

/* Helpers */

function Badge({ connected }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
        connected
          ? "bg-green-500/20 text-green-300"
          : "bg-red-500/20 text-red-300"
      }`}
    >
      <Wifi size={16} />
      {connected ? "Backend Connected" : "Offline Preview"}
    </div>
  );
}

function Tag({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 px-4 py-2 text-sm text-slate-200">
      {icon}
      {text}
    </div>
  );
}

function StatusCard({ label, value, color }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-700 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <h3 className={`text-xl font-bold mt-2 ${color}`}>{value}</h3>
    </div>
  );
}