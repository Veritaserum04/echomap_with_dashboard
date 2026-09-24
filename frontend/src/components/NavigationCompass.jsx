import { motion } from "framer-motion";
import { useEchoMap } from "../context/EchoMapContext";

export default function NavigationCompass() {
  const { liveData } = useEchoMap();

  const heading = liveData?.navigation?.heading || "NORTH";

  const rotation = {
    NORTH: 0,
    EAST: 90,
    SOUTH: 180,
    WEST: 270,
  }[heading] ?? 0;

  return (
    <div className="glass rounded-3xl p-6 flex flex-col items-center">

      <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs">
        LIVE COMPASS
      </p>

      <div className="relative mt-6 w-72 h-72 flex items-center justify-center">

        {/* Neon background glow */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 rounded-full bg-cyan-500/10 blur-3xl"
        />

        {/* Radar Rings */}
        {[0, 1, 2].map((ring) => (
          <motion.div
            key={ring}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              delay: ring * 0.5,
            }}
            className={`absolute rounded-full border border-cyan-600/40`}
            style={{
              width: `${288 - ring * 48}px`,
              height: `${288 - ring * 48}px`,
            }}
          />
        ))}

        {/* Cardinal markers */}
        <span className="absolute top-3 text-cyan-300 font-bold text-lg">N</span>
        <span className="absolute right-3 text-cyan-300 font-bold text-lg">E</span>
        <span className="absolute bottom-3 text-cyan-300 font-bold text-lg">S</span>
        <span className="absolute left-3 text-cyan-300 font-bold text-lg">W</span>

        {/* Tick marks */}
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-cyan-800"
            style={{
              width: i % 6 === 0 ? 3 : 2,
              height: i % 6 === 0 ? 14 : 8,
              transform: `rotate(${i * 15}deg) translateY(-132px)`,
              borderRadius: 4,
            }}
          />
        ))}

        {/* Compass Needle */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <div className="relative flex flex-col items-center h-52">

            {/* North Arrow */}
            <div
              className="w-0 h-0 border-l-[14px] border-r-[14px] border-b-[90px]
                         border-l-transparent border-r-transparent border-b-cyan-300
                         drop-shadow-[0_0_18px_#22d3ee]"
            />

            {/* Needle Body */}
            <div className="w-2 h-14 bg-gradient-to-b from-cyan-300 to-cyan-600 rounded-full -mt-1 shadow-[0_0_15px_#22d3ee]" />

            {/* South Needle */}
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[55px]
                         border-l-transparent border-r-transparent border-t-slate-600 mt-1 opacity-80" />

          </div>
        </motion.div>

        {/* Center Hub */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute w-8 h-8 rounded-full bg-cyan-300 border-4 border-slate-900 shadow-[0_0_25px_#22d3ee]"
        />

      </div>

      {/* Heading Badge */}
      <div className="mt-6 flex flex-col items-center gap-2">

        <span className="px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 tracking-widest text-xs">
          CURRENT ORIENTATION
        </span>

        <motion.h2
          key={heading}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white tracking-[0.2em]"
        >
          {heading}
        </motion.h2>

      </div>

    </div>
  );
}