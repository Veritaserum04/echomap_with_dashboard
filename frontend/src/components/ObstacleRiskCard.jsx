import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

export default function ObstacleRiskCard() {
  const { liveData } = useEchoMap();

  const sensors = liveData?.sensors ?? {
    left: 50,
    center: 50,
    right: 50,
  };

  const closest = Math.min(sensors.left, sensors.center, sensors.right);

  let risk = "Safe";
  let color = "text-green-400";
  let bg = "bg-green-500/10";

  if (closest <= 40) {
    risk = "Obstacle Ahead";
    color = "text-red-400";
    bg = "bg-red-500/10";
  } else if (closest <= 70) {
    risk = "Proceed Carefully";
    color = "text-yellow-400";
    bg = "bg-yellow-500/10";
  }

  return (
    <div className={`glass p-6 rounded-3xl border ${bg}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-cyan-400 uppercase tracking-wider text-xs">
            OBSTACLE ANALYSIS
          </p>

          <h2 className="text-white text-2xl font-bold mt-2">
            Live Risk Detector
          </h2>
        </div>

        {closest <= 40 ? (
          <AlertTriangle className="text-red-400" size={30}/>
        ) : (
          <CheckCircle2 className="text-green-400" size={30}/>
        )}
      </div>

      <div className="mt-6">
        <p className="text-slate-400 text-sm">Closest detected object</p>

        <h1 className="text-5xl font-bold text-white mt-2">
          {closest}
          <span className="text-xl ml-1">cm</span>
        </h1>

        <p className={`${color} font-semibold mt-3`}>{risk}</p>
      </div>
    </div>
  );
}