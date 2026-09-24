import { motion } from "framer-motion";
import {
  Map,
  Route,
  Navigation,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

const GRID_SIZE = 20;

function Legend({ color, icon, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 rounded ${color}`} />
      <div className="flex items-center gap-2 text-slate-300 text-sm">
        {icon}
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function OccupancyGrid() {
  const { liveData } = useEchoMap();

  const mapping = liveData?.mapping ?? {};

  const currentLocation = mapping.currentLocation ?? { x: 10, y: 10 };

  const destination = mapping.destination ?? {
    name: "Computer Lab",
    x: 18,
    y: 15,
  };

  const visited = mapping.visited ?? [];
  const obstacles = mapping.obstacles ?? [];
  const path = mapping.path ?? [];

  const mappedPercentage = mapping.mapped_percentage ?? 0;
  const exploredCells = mapping.exploredCells ?? 0;

  const visitedSet = new Set(visited.map((c) => `${c.x}-${c.y}`));
  const obstacleSet = new Set(obstacles.map((c) => `${c.x}-${c.y}`));
  const pathSet = new Set(path.map((c) => `${c.x}-${c.y}`));

  return (
    <div className="glass rounded-3xl p-6 space-y-6">
      {/* ---------------- Header ---------------- */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.25em] text-xs">
            SLAM OCCUPANCY GRID
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            Indoor Environment Map
          </h2>

          <p className="text-slate-400 text-sm mt-1">
            Live map generated from Raspberry Pi ultrasonic SLAM.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
          <Map size={28} className="text-cyan-400" />
        </div>
      </div>

      {/* ---------------- Stats ---------------- */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-slate-900/70 p-4 border border-slate-800">
          <p className="text-xs text-slate-500 uppercase">Mapped Area</p>

          <h3 className="text-2xl font-bold text-cyan-300 mt-2">
            {mappedPercentage}%
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-900/70 p-4 border border-slate-800">
          <p className="text-xs text-slate-500 uppercase">Explored Cells</p>

          <h3 className="text-2xl font-bold text-white mt-2">
            {exploredCells}
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-900/70 p-4 border border-slate-800">
          <p className="text-xs text-slate-500 uppercase">Current Position</p>

          <h3 className="text-xl font-bold text-blue-300 mt-2">
            ({currentLocation.x}, {currentLocation.y})
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-900/70 p-4 border border-slate-800">
          <p className="text-xs text-slate-500 uppercase">Destination</p>

          <h3 className="text-lg font-bold text-green-300 mt-2 truncate">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* ---------------- 20x20 Grid ---------------- */}

      <div className="rounded-3xl bg-[#08131f] border border-cyan-900/50 p-4 overflow-auto">
        <div
          className="grid gap-[3px] mx-auto"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 22px)`,
            width: "fit-content",
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const key = `${x}-${y}`;

            const isCurrent =
              currentLocation.x === x && currentLocation.y === y;

            const isDestination =
              destination.x === x && destination.y === y;

            const isVisited = visitedSet.has(key);
            const isObstacle = obstacleSet.has(key);
            const isPath = pathSet.has(key);

            let classes = "bg-slate-950 border border-slate-900";

            if (isVisited)
              classes = "bg-cyan-900 border border-cyan-800";

            if (isPath)
              classes =
                "bg-yellow-300 border border-yellow-200 shadow-[0_0_6px_rgba(253,224,71,0.5)]";

            if (isObstacle)
              classes =
                "bg-red-500 border border-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]";

            if (isDestination)
              classes =
                "bg-green-400 border border-green-300 shadow-[0_0_10px_rgba(74,222,128,0.9)]";

            return (
              <motion.div
                key={key}
                layout
                initial={false}
                animate={{
                  opacity: isPath ? [0.6, 1, 0.6] : 1,
                }}
                transition={{
                  opacity: {
                    repeat: isPath ? Infinity : 0,
                    duration: 1.5,
                  },
                  layout: {
                    duration: 0.35,
                  },
                }}
                className={`relative w-[22px] h-[22px] rounded-md ${classes}`}
              >
                {/* Current Location */}

                {isCurrent && (
                  <motion.div
                    layoutId="current-location"
                    initial={false}
                    animate={{
                      scale: [1, 1.35, 1],
                    }}
                    transition={{
                      layout: {
                        duration: 0.45,
                        ease: "easeInOut",
                      },
                      scale: {
                        repeat: Infinity,
                        duration: 1.2,
                      },
                    }}
                    className="absolute inset-0 flex items-center justify-center z-20"
                  >
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_14px_#3B82F6]" />

                      <motion.div
                        animate={{
                          scale: [1, 2.2],
                          opacity: [0.5, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.4,
                        }}
                        className="absolute inset-0 rounded-full border border-blue-400"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ---------------- Coordinate Summary ---------------- */}

      <div className="rounded-2xl border border-cyan-900 bg-slate-900/50 p-5">
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Current Location
            </p>

            <h3 className="text-xl font-semibold text-cyan-300 mt-2">
              ({currentLocation.x}, {currentLocation.y})
            </h3>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Destination
            </p>

            <h3 className="text-xl font-semibold text-green-300 mt-2">
              {destination.name}
            </h3>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Route Nodes Remaining
            </p>

            <h3 className="text-xl font-semibold text-yellow-300 mt-2">
              {path.length}
            </h3>
          </div>
        </div>
      </div>

      {/* ---------------- Route Stats ---------------- */}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Navigation className="text-blue-400" />

            <h3 className="text-lg font-semibold text-white">
              Live Coordinates
            </h3>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>X Coordinate</span>

              <span className="text-blue-300 font-semibold">
                {currentLocation.x}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Y Coordinate</span>

              <span className="text-blue-300 font-semibold">
                {currentLocation.y}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Destination</span>

              <span className="text-green-300 font-semibold">
                {destination.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Destination Coordinates</span>

              <span className="text-green-300 font-semibold">
                ({destination.x}, {destination.y})
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Route className="text-yellow-400" />

            <h3 className="text-lg font-semibold text-white">
              Path Statistics
            </h3>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Route Nodes</span>

              <span className="text-yellow-300 font-semibold">
                {path.length}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Visited Cells</span>

              <span className="text-cyan-300 font-semibold">
                {visited.length}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Detected Obstacles</span>

              <span className="text-red-300 font-semibold">
                {obstacles.length}
              </span>
            </div>

            <div className="flex justify-between">
              <span>SLAM Coverage</span>

              <span className="text-cyan-300 font-semibold">
                {mappedPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Legend ---------------- */}

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <h3 className="text-white font-semibold mb-4">
          Occupancy Grid Legend
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Legend
            color="bg-blue-500"
            icon={<Navigation size={16} />}
            label="Current Position"
          />

          <Legend
            color="bg-green-400"
            icon={<CheckCircle size={16} />}
            label="Destination"
          />

          <Legend
            color="bg-yellow-300"
            icon={<Route size={16} />}
            label="A* Planned Path"
          />

          <Legend
            color="bg-red-500"
            icon={<AlertTriangle size={16} />}
            label="Obstacle"
          />

          <Legend
            color="bg-cyan-800"
            icon={<Map size={16} />}
            label="Visited Cells"
          />
        </div>
      </div>
    </div>
  );
}