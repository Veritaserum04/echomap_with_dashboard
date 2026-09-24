import { motion } from "framer-motion";
import { Radar } from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

export default function RadarScanner() {
  const { liveData } = useEchoMap();

  const sensors = liveData?.sensors ?? {
    left: 100,
    center: 80,
    right: 120,
  };

  const clamp = (value) => Math.min(Math.max(value, 10), 150);
  const distanceToRadius = (distance) => 130 - clamp(distance) * 0.7;

  const beams = [
    { angle: -45, distance: sensors.left, color: "#38BDF8" },
    { angle: 0, distance: sensors.center, color: "#22D3EE" },
    { angle: 45, distance: sensors.right, color: "#60A5FA" },
  ];

  return (
    <div className="glass rounded-3xl p-6">
      {/* Header */}
      <div className="mb-5">
        <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs">
          ULTRASONIC RADAR
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          Live Obstacle Detection
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          HC-SR04 Left • Center • Right
        </p>
      </div>

      {/* Radar */}
      <div className="flex justify-center">
        <div className="relative w-[320px] h-[320px] rounded-full bg-[#020617] border border-cyan-900 overflow-hidden">
          {/* Rotating Sweep */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "linear",
            }}
            className="absolute inset-0 origin-center"
          >
            <div className="absolute left-1/2 top-1/2 h-[150px] w-[2px] -translate-x-1/2 -translate-y-full bg-gradient-to-t from-cyan-400 via-cyan-300/70 to-transparent" />
          </motion.div>

          {/* Radar Rings */}
          {[60, 100, 140].map((size) => (
            <div
              key={size}
              className="absolute rounded-full border border-cyan-800/40"
              style={{
                width: size * 2,
                height: size * 2,
                left: `calc(50% - ${size}px)`,
                top: `calc(50% - ${size}px)`,
              }}
            />
          ))}

          {/* Cross Lines */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-900/40 -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-900/40 -translate-y-1/2" />

          {/* Sensor Beams */}
          {beams.map((beam) => {
            const r = distanceToRadius(beam.distance);
            const rad = (beam.angle * Math.PI) / 180;

            const x = 160 + Math.sin(rad) * r;
            const y = 160 - Math.cos(rad) * r;

            return (
              <motion.div
                key={beam.angle}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.4,
                }}
                className="absolute"
                style={{
                  left: x - 6,
                  top: y - 6,
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: beam.color,
                    boxShadow: `0 0 14px ${beam.color}`,
                  }}
                />
              </motion.div>
            );
          })}

          {/* Raspberry Pi Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-cyan-500/15 border border-cyan-400 flex items-center justify-center backdrop-blur">
              <Radar size={28} className="text-cyan-300" />
            </div>
          </div>

          {/* Direction Labels */}
          <span className="absolute top-3 left-1/2 -translate-x-1/2 text-cyan-300 text-xs">
            FRONT
          </span>

          <span className="absolute bottom-4 left-5 text-cyan-500 text-xs">
            LEFT
          </span>

          <span className="absolute bottom-4 right-5 text-cyan-500 text-xs">
            RIGHT
          </span>
        </div>
      </div>

      {/* Live Sensor Cards */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[
          ["LEFT", sensors.left, "text-sky-400"],
          ["CENTER", sensors.center, "text-cyan-400"],
          ["RIGHT", sensors.right, "text-blue-400"],
        ].map(([label, value, color]) => (
          <div
            key={label}
            className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 text-center"
          >
            <p className={`text-xs tracking-[0.2em] uppercase ${color}`}>
              {label}
            </p>

            <h3 className="text-3xl font-bold text-white mt-2">
              {value}
              <span className="text-base text-slate-400 ml-1">cm</span>
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}