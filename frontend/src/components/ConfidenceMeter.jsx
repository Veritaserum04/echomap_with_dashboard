import { ShieldCheck } from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

export default function ConfidenceMeter() {
  const { liveData } = useEchoMap();

  const confidence = liveData?.system?.confidence ?? 0;
  const percent = Math.round(confidence * 100);

  return (
    <div className="glass rounded-3xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            SLAM CONFIDENCE
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            Localization Accuracy
          </h2>
        </div>

        <ShieldCheck size={28} className="text-cyan-400" />
      </div>

      <div className="flex justify-center">
        <div className="relative w-44 h-44">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#1E293B"
              strokeWidth="12"
              fill="none"
            />

            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#22D3EE"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${percent * 4.27} 427`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-cyan-300">{percent}%</h1>

            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Confidence
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">SLAM Confidence</span>
          <span className="text-cyan-300 font-semibold">{percent}%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}