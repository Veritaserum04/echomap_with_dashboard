import {
  AlertTriangle,
  CheckCircle2,
  BatteryWarning,
  Navigation,
} from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

export default function NotificationCenter() {
  const { liveData } = useEchoMap();

  const sensors = liveData?.sensors ?? {};
  const navigation = liveData?.navigation ?? {};
  const battery = liveData?.system?.battery ?? 0;

  const notifications = [];

  // Ultrasonic obstacle alerts
  if (sensors.left < 50)
    notifications.push({
      type: "warning",
      icon: <AlertTriangle size={18} className="text-yellow-400" />,
      title: "Obstacle Detected",
      message: `Obstacle ${sensors.left} cm on the LEFT.`,
    });

  if (sensors.center < 50)
    notifications.push({
      type: "danger",
      icon: <AlertTriangle size={18} className="text-red-400" />,
      title: "Obstacle Ahead",
      message: `Obstacle ${sensors.center} cm in FRONT.`,
    });

  if (sensors.right < 50)
    notifications.push({
      type: "warning",
      icon: <AlertTriangle size={18} className="text-purple-400" />,
      title: "Obstacle Detected",
      message: `Obstacle ${sensors.right} cm on the RIGHT.`,
    });

  // Navigation instruction
  if (navigation.instruction) {
    notifications.push({
      type: "info",
      icon: <Navigation size={18} className="text-cyan-400" />,
      title: "Navigation Update",
      message: navigation.instruction,
    });
  }

  // Battery alert
  if (battery < 25) {
    notifications.push({
      type: "danger",
      icon: <BatteryWarning size={18} className="text-red-400" />,
      title: "Low Battery",
      message: `Battery level is ${battery}%.`,
    });
  }

  // Destination reached
  if (navigation.progress === 100) {
    notifications.push({
      type: "success",
      icon: <CheckCircle2 size={18} className="text-green-400" />,
      title: "Destination Reached",
      message: navigation.destination,
    });
  }

  return (
    <div className="glass rounded-3xl p-6 space-y-5">
      <div>
        <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
          LIVE NOTIFICATIONS
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          Raspberry Pi Alerts
        </h2>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-500">
          No active notifications.
        </div>
      ) : (
        notifications.map((note, index) => (
          <div
            key={index}
            className={`rounded-2xl p-4 border ${
              note.type === "danger"
                ? "border-red-500/30 bg-red-500/10"
                : note.type === "warning"
                ? "border-yellow-500/30 bg-yellow-500/10"
                : note.type === "success"
                ? "border-green-500/30 bg-green-500/10"
                : "border-cyan-500/30 bg-cyan-500/10"
            }`}
          >
            <div className="flex items-start gap-3">
              {note.icon}

              <div>
                <h3 className="text-white font-semibold">{note.title}</h3>

                <p className="text-slate-300 text-sm mt-1">{note.message}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}