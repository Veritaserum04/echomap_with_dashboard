import { Navigation } from "lucide-react";
import { motion } from "framer-motion";

const rotationMap = {
  NORTH: 0,
  EAST: 90,
  SOUTH: 180,
  WEST: 270,
};

export default function LiveCompass({ heading = "NORTH" }) {
  const rotation = rotationMap[heading] ?? 0;

  return (
    <section className="glass p-8">
      <div className="panel-header">
        <div>
          <p>LIVE COMPASS</p>
          <h2>Current Heading</h2>
        </div>

        <Navigation size={24} color="#22D3EE" />
      </div>

      <div className="flex justify-center mt-6">
        <div className="relative w-72 h-72 rounded-full border border-cyan-500/30 bg-slate-900 flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.15)]">
          {/* Outer Glow */}
          <div className="absolute inset-3 rounded-full border border-cyan-500/20" />

          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 0.8 }}
            className="absolute w-2 h-28 bg-gradient-to-t from-cyan-400 to-white rounded-full origin-bottom bottom-1/2"
          />

          <div className="absolute w-5 h-5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40" />

          <span className="absolute top-4 text-cyan-300 font-bold">N</span>
          <span className="absolute right-4 text-slate-400 font-bold">E</span>
          <span className="absolute bottom-4 text-slate-400 font-bold">S</span>
          <span className="absolute left-4 text-slate-400 font-bold">W</span>
        </div>
      </div>

      <h2 className="text-center text-3xl font-bold mt-8 text-cyan-300">
        {heading}
      </h2>

      <p className="text-center text-slate-400 mt-2">
        Real-time orientation from EchoMap navigation engine.
      </p>
    </section>
  );
}