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
    return landmarks.filter((landmark) =>
      landmark.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, landmarks]);

  return (
    <div className="page-container space-y-8">

      {/* ================= HERO ================= */}
      <section className="hero-banner">
        <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs">
          LANDMARK MANAGEMENT
        </p>

        <h1 className="gradient-title text-5xl font-bold mt-3">
          Saved Indoor Locations
        </h1>

        <p className="text-slate-300 max-w-4xl mt-4 leading-7">
          EchoMap stores classrooms, laboratories, reception areas, canteens,
          and other indoor landmarks inside the Raspberry Pi SQLite database for
          destination-based indoor navigation.
        </p>

        <div className="flex items-center gap-3 mt-6">
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

      {/* ================= DATABASE SECTION ================= */}
      <section className="glass rounded-3xl p-8 space-y-8">

        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            LANDMARK DATABASE
          </p>

          <h2 className="text-4xl font-bold mt-2 text-white">
            Indoor Landmarks
          </h2>

          <p className="text-slate-400 mt-2">
            Saved locations synchronized directly from the EchoMap Raspberry Pi.
          </p>
        </div>

       {/* SEARCH BAR */}
{/* SEARCH BAR */}
<div className="relative w-full">
  <Search
    size={20}
    className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400"
  />
  <input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder="         Search landmark..."
  style={{ textIndent: "18px" }}   // ← moves placeholder and typed text right
  className="w-full h-14 rounded-2xl border border-cyan-700 bg-slate-950/70 pl-14 pr-5 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
/>
</div>
        {/* SUMMARY STATS */}
        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-cyan-900 bg-slate-950/50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              TOTAL LANDMARKS
            </p>

            <h3 className="text-4xl font-bold text-cyan-300 mt-3">
              {landmarks.length}
            </h3>
          </div>

          <div className="rounded-2xl border border-cyan-900 bg-slate-950/50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              CURRENT DESTINATION
            </p>

            <h3 className="text-2xl font-bold text-white mt-3 truncate">
              {destination}
            </h3>
          </div>

          <div className="rounded-2xl border border-cyan-900 bg-slate-950/50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              DATABASE STATUS
            </p>

            <div className="flex items-center gap-3 mt-3">
              <Database className="text-cyan-400" size={22} />
              <span className="text-2xl font-bold text-green-400">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* LANDMARK CARDS */}
        <div className="grid gap-6 lg:grid-cols-2">

          {filteredLandmarks.map((landmark) => (
            <div
              key={landmark.name}
              className="
                rounded-3xl
                border border-cyan-900
                bg-slate-950/60
                p-6
                transition-all
                duration-300
                hover:border-cyan-400
                hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]
              "
            >
              {/* Top */}
              <div className="flex items-start justify-between">

                <div>
                  <h3 className="text-3xl font-bold text-white">
                    {landmark.name}
                  </h3>

                  <p className="text-slate-400 mt-1">
                    Indoor Landmark
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500 flex items-center justify-center">
                  <MapPin className="text-cyan-300" size={22} />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4 mt-6">

                <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    X Coordinate
                  </p>

                  <h4 className="text-4xl font-bold text-cyan-300 mt-2">
                    {landmark.x}
                  </h4>
                </div>

                <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Y Coordinate
                  </p>

                  <h4 className="text-4xl font-bold text-cyan-300 mt-2">
                    {landmark.y}
                  </h4>
                </div>
              </div>

              {/* Bottom */}
              <div className="flex items-center justify-between mt-6">

                <div className="flex items-center gap-2 text-green-400 font-medium">
                  <CheckCircle2 size={18} />
                  Ready for Navigation
                </div>

                <button className="flex items-center gap-2 rounded-xl border border-cyan-500 px-4 py-2 text-cyan-300 hover:bg-cyan-500/10 transition">
                  <Navigation size={16} />
                  Navigate
                </button>

              </div>
            </div>
          ))}

        </div>

        {/* Empty State */}
        {filteredLandmarks.length === 0 && (
          <div className="rounded-3xl border border-dashed border-cyan-700 py-16 text-center">

            <Search size={36} className="mx-auto text-cyan-500 mb-3" />

            <h3 className="text-white text-2xl font-semibold">
              No landmarks found
            </h3>

            <p className="text-slate-400 mt-2">
              Try searching for another landmark.
            </p>

          </div>
        )}

      </section>

      {/* ================= NOTE SECTION ================= */}
      <section className="glass rounded-3xl p-8 space-y-6">

        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            LANDMARK-BASED NAVIGATION
          </p>

          <h2 className="text-3xl font-bold text-white mt-3">
            Raspberry Pi SQLite Landmark Engine
          </h2>
        </div>

        <p className="text-slate-300 leading-8">
          During Mapping Mode, EchoMap stores landmark names together with their
          occupancy-grid coordinates inside <b>echomap.db</b>. During Navigation
          Mode, selecting one of these landmarks automatically triggers A* path
          planning and generates the shortest indoor route while avoiding mapped
          ultrasonic obstacles.
        </p>

        <div className="grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-cyan-900 bg-slate-950/60 p-5">
            <p className="text-cyan-400 text-xs uppercase tracking-[0.18em]">
              DATABASE
            </p>

            <h3 className="text-xl font-bold text-white mt-2">
              echomap.db
            </h3>

            <p className="text-slate-400 mt-3 leading-7">
              Stores landmark names, X/Y coordinates, and destination metadata
              directly on the Raspberry Pi.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-900 bg-slate-950/60 p-5">
            <p className="text-cyan-400 text-xs uppercase tracking-[0.18em]">
              NAVIGATION ENGINE
            </p>

            <h3 className="text-xl font-bold text-white mt-2">
              A* Path Planning
            </h3>

            <p className="text-slate-400 mt-3 leading-7">
              Computes the shortest path through the SLAM occupancy grid while
              avoiding real-time ultrasonic obstacles.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}