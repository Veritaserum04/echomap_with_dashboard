import { MapPinned } from "lucide-react";
import { motion } from "framer-motion";

export default function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3"
    >
      {/* Icon */}
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 shadow-lg shadow-purple-900/40">
        <MapPinned size={22} className="text-white" />
      </div>

      {/* Text */}
      <div>
        <h1 className="gradient-purple text-lg font-bold tracking-wide">
          EchoMap
        </h1>

        <p className="text-[11px] uppercase tracking-[0.25em] text-purple-300/70">
          Indoor Navigation Dashboard
        </p>
      </div>
    </motion.div>
  );
}