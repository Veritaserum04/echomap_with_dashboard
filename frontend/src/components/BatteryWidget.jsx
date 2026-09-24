import { BatteryCharging, BatteryFull, BatteryMedium, BatteryWarning } from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

export default function BatteryWidget() {
  const { liveData } = useEchoMap();

  const battery = liveData?.system?.battery ?? 0;

  const getBatteryIcon = () => {
    if (battery >= 80) return <BatteryFull size={28} className="text-green-400" />;
    if (battery >= 40) return <BatteryMedium size={28} className="text-yellow-400" />;
    return <BatteryWarning size={28} className="text-red-400" />;
  };

  const getBatteryColor = () => {
    if (battery >= 80) return "bg-green-400";
    if (battery >= 40) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="glass rounded-3xl p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            POWER STATUS
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            Raspberry Pi Battery
          </h2>
        </div>

        <BatteryCharging size={30} className="text-cyan-400" />
      </div>

      {/* Percentage */}
      <div className="flex items-center gap-4">
        {getBatteryIcon()}

        <div>
          <h1 className="text-5xl font-bold text-white">{battery}%</h1>
          <p className="text-slate-400 text-sm mt-1">Current Battery Level</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Battery Charge</span>
          <span>{battery}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBatteryColor()}`}
            style={{ width: `${battery}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Battery Health</span>

          <span
            className={`font-semibold ${
              battery >= 80
                ? "text-green-400"
                : battery >= 40
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {battery >= 80
              ? "Excellent"
              : battery >= 40
              ? "Moderate"
              : "Low Battery"}
          </span>
        </div>
      </div>
    </div>
  );
}