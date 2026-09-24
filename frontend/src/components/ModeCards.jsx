import { motion } from "framer-motion";
import {
  Navigation,
  Map,
  Mic,
  CheckCircle2,
} from "lucide-react";

export default function ModeCards({
  mapping = {},
  navigation = {},
  voice = {},
}) {
  const modes = [
    {
      title: "Navigation Mode",
      description:
        navigation.instruction ?? "Waiting for navigation command...",
      active: true,
      icon: <Navigation size={24} className="text-cyan-400" />,
      color: "cyan",
    },
    {
      title: "Mapping Mode",
      description: `Mapped Area: ${
        mapping.mapped_percentage ?? 61
      }%`,
      active: true,
      icon: <Map size={24} className="text-violet-400" />,
      color: "violet",
    },
    {
      title: "Voice Recognition",
      description: voice.listening
        ? "Listening for commands..."
        : "Microphone idle",
      active: voice.listening ?? true,
      icon: <Mic size={24} className="text-green-400" />,
      color: "green",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {modes.map((mode) => (
        <motion.div
          key={mode.title}
          whileHover={{ scale: 1.03 }}
          className="rounded-3xl bg-slate-900/70 border border-slate-800 p-5 backdrop-blur-lg"
        >
          <div className="flex justify-between items-center mb-4">
            {mode.icon}

            <CheckCircle2
              size={20}
              className={
                mode.active
                  ? "text-green-400"
                  : "text-slate-500"
              }
            />
          </div>

          <h3 className="text-white text-lg font-semibold">
            {mode.title}
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            {mode.description}
          </p>

          <div className="mt-5">
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                mode.active
                  ? "bg-green-500/20 text-green-300"
                  : "bg-slate-700 text-slate-400"
              }`}
            >
              {mode.active ? "ACTIVE" : "IDLE"}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}