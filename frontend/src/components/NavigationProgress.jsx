import { useEchoMap } from "../context/EchoMapContext";

export default function NavigationProgress() {
  const { liveData } = useEchoMap();

  const nav = liveData?.navigation ?? {};

  return (
    <div className="glass p-6 rounded-3xl space-y-6">

      <div>
        <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
          ROUTE PROGRESS
        </p>

        <h2 className="text-white text-2xl font-bold mt-2">
          Live Navigation Status
        </h2>
      </div>

      <div className="space-y-4">
        <Progress label="Progress" value={nav.progress ?? 0}/>
        <Metric label="Remaining Distance" value={`${nav.remainingDistance ?? 0} m`}/>
        <Metric label="Remaining Steps" value={nav.remainingSteps ?? 0}/>
        <Metric label="Destination" value={nav.destination ?? "None"}/>
      </div>

    </div>
  );
}

function Progress({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-slate-300 mb-2">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-800 pb-2">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}