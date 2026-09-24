import { motion } from "framer-motion";
import { CheckCircle2, Navigation, MapPin, AlertTriangle } from "lucide-react";

export default function ActiveTimeline({ timeline = [] }) {
  // Demo timeline until backend sends data
  const events =
    timeline.length > 0
      ? timeline
      : [
          { type: "navigation", text: "Navigation started", time: "11:32 AM" },
          { type: "landmark", text: "Computer Lab landmark detected", time: "11:34 AM" },
          { type: "obstacle", text: "Obstacle detected ahead", time: "11:36 AM" },
          { type: "complete", text: "Destination reached", time: "11:38 AM" },
        ];

  const getIcon = (type) => {
    switch (type) {
      case "navigation":
        return <Navigation size={18} className="text-cyan-400" />;
      case "landmark":
        return <MapPin size={18} className="text-violet-400" />;
      case "obstacle":
        return <AlertTriangle size={18} className="text-orange-400" />;
      default:
        return <CheckCircle2 size={18} className="text-green-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 }}
          className="flex gap-4 items-start rounded-xl bg-slate-800/60 border border-slate-700 p-4"
        >
          <div className="mt-1">{getIcon(event.type)}</div>

          <div className="flex-1">
            <p className="text-white text-sm">{event.text}</p>
            <p className="text-slate-400 text-xs mt-1">{event.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}