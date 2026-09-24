import {
  MapPinned,
  Navigation,
  Footprints,
  Compass,
  Route,
} from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

function InfoCard({ icon, title, value, color }) {
  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 flex items-center gap-3">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>

      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          {title}
        </p>

        <h3 className="text-lg font-semibold text-white mt-1">{value}</h3>
      </div>
    </div>
  );
}

export default function NavigationSummary() {
  const { liveData } = useEchoMap();

  const nav = liveData?.navigation ?? {};

  return (
    <div className="glass rounded-3xl p-6 space-y-6">
      <div>
        <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
          NAVIGATION SUMMARY
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          Current Route Overview
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <InfoCard
          title="Destination"
          value={nav.destination || "Not Selected"}
          icon={<MapPinned className="text-green-400" size={22} />}
          color="bg-green-500/10"
        />

        <InfoCard
          title="Heading"
          value={nav.heading || "NORTH"}
          icon={<Compass className="text-cyan-400" size={22} />}
          color="bg-cyan-500/10"
        />

        <InfoCard
          title="Remaining Distance"
          value={`${nav.remainingDistance ?? 0} m`}
          icon={<Route className="text-yellow-400" size={22} />}
          color="bg-yellow-500/10"
        />

        <InfoCard
          title="Remaining Steps"
          value={nav.remainingSteps ?? 0}
          icon={<Footprints className="text-purple-400" size={22} />}
          color="bg-purple-500/10"
        />
      </div>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-slate-300">
          <span>Route Progress</span>
          <span>{nav.progress ?? 0}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${nav.progress ?? 0}%` }}
          />
        </div>
      </div>

      {/* Current Instruction */}
      <div className="rounded-2xl border border-cyan-900 bg-slate-900/60 p-5 flex items-center gap-4">
        <Navigation className="text-cyan-400" size={24} />

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Current Instruction
          </p>

          <h3 className="text-xl font-semibold text-white mt-1">
            {nav.instruction || "Waiting for navigation..."}
          </h3>
        </div>
      </div>
    </div>
  );
}