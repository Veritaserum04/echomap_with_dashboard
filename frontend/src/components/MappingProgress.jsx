import { useEchoMap } from "../context/EchoMapContext";

export default function NavigationProgress() {
  const { liveData } = useEchoMap();

  const nav = liveData?.navigation || {};

  return (
    <section className="glass p-6 rounded-3xl">
      <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
        ROUTE PROGRESS
      </p>

      <h2 className="text-3xl font-bold text-white mt-2">
        Live Navigation Status
      </h2>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-slate-300 mb-2">
          <span>Progress</span>
          <span>{nav.progress ?? 0}%</span>
        </div>

        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-500 rounded-full"
            style={{ width: `${nav.progress ?? 0}%` }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-6 divide-y divide-slate-800 text-white">
        <div className="flex justify-between py-3">
          <span className="text-slate-400">Remaining Distance</span>
          <span>{nav.remainingDistance ?? 0} m</span>
        </div>

        <div className="flex justify-between py-3">
          <span className="text-slate-400">Remaining Steps</span>
          <span>{nav.remainingSteps ?? 0}</span>
        </div>

        <div className="flex justify-between py-3">
          <span className="text-slate-400">Destination</span>
          <span>{nav.destination || "None"}</span>
        </div>
      </div>
    </section>
  );
}