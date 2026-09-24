import { motion } from "framer-motion";
import { ScanSearch } from "lucide-react";

export default function SplashScreen() {
  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="splash-content">
        <div className="logo-circle">
          <ScanSearch size={48} color="#A855F7" />
        </div>

        <h1>EchoMap</h1>

        <p>Wearable Indoor Navigation Dashboard</p>

        <div className="loading-spinner" />

        <span>Initializing Dashboard...</span>
      </div>
    </motion.div>
  );
}