import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Navigation,
  Database,
  CheckCircle2,
} from "lucide-react";

import { useEchoMap } from "../context/EchoMapContext";

export default function Landmarks() {
  const { liveData, connected } = useEchoMap();

  const [query, setQuery] = useState("");

  const landmarks = liveData?.landmarks ?? [];

  const destination =
    liveData?.navigation?.destination || "No Destination Selected";

  const filteredLandmarks = useMemo(() => {
    return landmarks.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, landmarks]);

  return (
    <div className="page-container space-y-8">
      {/* ================= HERO ================= */}
      <section className="hero-banner">
        <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs">
          LANDMARK MANAGEMENT
        </p>

        <h1 className="text-5xl font-bold gradient-title mt-3">
          Saved Indoor Locations
        </h1>

        <p className="text-slate-300 mt-4 max-w-4xl leading-8">
          EchoMap stores classrooms, laboratories, reception areas, canteens and
          other indoor landmarks inside the Raspberry Pi SQLite database for
          destination-based navigation.
        </p>

        <div className="flex items-center gap-3 mt-5">
          <div
            className={`w-3 h-3 rounded-full ${
              connected ? "bg-green-400" : "bg-red-500"
            }`}
          />
          <span className="text-slate-300">
            {connected
              ? "Live Landmark Database Connected"
              : "Offline Landmark Preview"}
          </span>
        </div>
      </section>

      {/* ================= DATABASE CARD ================= */}
      <section className="glass rounded-3xl p-7 space-y-7">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            LANDMARK DATABASE
          </p>

          <h2 className="text-4xl font-bold text-white mt-2">
            Indoor Landmarks
          </h2>

          <p className="text-slate-400 mt-2">
            Saved locations synchronized from EchoMap Raspberry Pi.
          </p>
        </div>

        {/* -------- SEARCH BAR (Full Width — No Overlap) -------- */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400"
          />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search landmark..."
            className="w-full rounded-2xl border border-cyan-700 bg-slate-950/70 py-4 pl-14 pr-5 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {/* -------- STATS -------- */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-900 bg-slate-950/50 p-5">
            <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
              Total Landmarks
            </p>

            <h3 className="text-4xl font-bold text-cyan-300 mt-2">
              {landmarks.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-cyan-900 bg-slate-950/50 p-5">
            <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
              Current Destination
            </p>

            <h3 className="text-3xl font-bold text-white mt-2 truncate">
              {destination}
            </h3>
          </div>

          <div className="rounded-2xl border border-cyan-900 bg-slate-950/50 p-5">
            <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
              Database Status
            </p>

            <div className="flex items-center gap-3 mt-3">
              <Database size={22} className="text-cyan-400" />

              <span className="text-2xl font-bold text-green-400">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* -------- LANDMARK CARDS -------- */}
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredLandmarks.map((landmark) => (
            <div
              key={landmark.name}
              className="rounded-3xl border border-cyan-900 bg-slate-950/60 p-6 hover:border-cyan-500 hover:shadow-[0_0_25px_rgba(34,211,238,0.12)] transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {landmark.name}
                  </h3>

                  <p className="text-slate-400 mt-1">Indoor Landmark</p>
                </div>

                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500 flex items-center justify-center">
                  <MapPin size={22} className="text-cyan-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    X Coordinate
                  </p>

                  <p className="text-4xl font-bold text-cyan-300 mt-2">
                    {landmark.x}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900/60 p-4 border border-slate-800">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Y Coordinate
                  </p>

                  <p className="text-4xl font-bold text-cyan-300 mt-2">
                    {landmark.y}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 size={18} />
                  Ready for Navigation
                </div>

                <button className="flex items-center gap-2 rounded-xl border border-cyan-600 px-4 py-2 text-cyan-300 hover:bg-cyan-500/10 transition">
                  <Navigation size={16} />
                  Navigate
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLandmarks.length === 0 && (
          <div className="rounded-3xl border border-dashed border-cyan-800 py-16 text-center">
            <Search className="mx-auto text-cyan-500 mb-4" size={42} />

            <h3 className="text-white text-2xl font-semibold">
              No landmarks found
            </h3>

            <p className="text-slate-400 mt-2">
              Try searching for a different landmark.
            </p>
          </div>
        )}
      </section>

      {/* ================= INFO PANEL ================= */}
      <section className="glass rounded-3xl p-7">
        <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
          NOTE
        </p>

        <h2 className="text-3xl font-bold text-white mt-3">
          Landmark-Based Indoor Navigation
        </h2>

        <p className="text-slate-300 mt-5 leading-8">
          During Mapping Mode, EchoMap records named landmarks together with
          their occupancy-grid coordinates inside <span className="text-cyan-300 font-semibold">echomap.db</span>.
          During Navigation Mode, selecting a landmark automatically generates an
          A* path from the current position to the stored destination.
        </p>

        <div className="grid md:grid-cols-2 gap-5 mt-7">
          <div className="rounded-2xl bg-slate-950/60 p-5 border border-cyan-900">
            <p className="text-cyan-400 text-xs uppercase tracking-[0.18em]">
              DATABASE
            </p>

            <p className="text-white text-xl font-semibold mt-2">echomap.db</p>

            <p className="text-slate-400 mt-2">
              SQLite stores landmark names, X/Y coordinates and navigation
              metadata on the Raspberry Pi.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/60 p-5 border border-cyan-900">
            <p className="text-cyan-400 text-xs uppercase tracking-[0.18em]">
              NAVIGATION ENGINE
            </p>

            <p className="text-white text-xl font-semibold mt-2">
              A* Path Planning
            </p>

            <p className="text-slate-400 mt-2">
              EchoMap computes the shortest indoor path using the SLAM occupancy
              grid while avoiding detected ultrasonic obstacles.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}