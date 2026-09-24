import { motion } from "framer-motion";
import { useEchoMap } from "../context/EchoMapContext";

const GRID_SIZE = 21;

export default function OccupancyGridLive() {
  const { connected, liveData } = useEchoMap();

  const mapping = liveData?.mapping ?? {};

  const current = mapping.currentLocation ?? { x: 10, y: 10 };
  const destination = mapping.destination ?? { x: 18, y: 15 };

  const visited = mapping.visited ?? [];
  const obstacles = mapping.obstacles ?? [];
  const path = mapping.path ?? [];
  const landmarks = liveData?.landmarks ?? [];

  const isVisited = (x, y) =>
    visited.some((cell) => cell.x === x && cell.y === y);

  const isObstacle = (x, y) =>
    obstacles.some((cell) => cell.x === x && cell.y === y);

  const isPath = (x, y) =>
    path.some((cell) => cell.x === x && cell.y === y);

  const landmarkAt = (x, y) =>
    landmarks.find((l) => l.x === x && l.y === y);

  return (
    <div className="glass p-6 rounded-3xl space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
            LIVE OCCUPANCY GRID
          </p>
          <h2 className="text-white text-2xl font-bold mt-2">
            Indoor SLAM Map
          </h2>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            connected
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {connected ? "LIVE" : "OFFLINE"}
        </span>
      </div>

      <div className="grid grid-cols-21 gap-[2px] bg-slate-950 p-3 rounded-2xl">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);

          let bg = "bg-slate-800";

          if (isVisited(x, y)) bg = "bg-cyan-700";
          if (isPath(x, y)) bg = "bg-yellow-400";
          if (isObstacle(x, y)) bg = "bg-red-500";
          if (destination.x === x && destination.y === y) bg = "bg-green-500";
          if (current.x === x && current.y === y) bg = "bg-blue-500";

          const landmark = landmarkAt(x, y);

          return (
            <motion.div
              key={`${x}-${y}`}
              layout
              transition={{ duration: 0.2 }}
              className={`w-4 h-4 rounded-sm relative ${bg}`}
            >
              {landmark && (
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-400" />
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <Legend color="bg-blue-500" text="Current Position" />
        <Legend color="bg-green-500" text="Destination" />
        <Legend color="bg-yellow-400" text="A* Path" />
        <Legend color="bg-red-500" text="Obstacle" />
        <Legend color="bg-cyan-700" text="Visited Cell" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <InfoCard
          label="Mapped Area"
          value={`${mapping.mapped_percentage ?? 0}%`}
        />

        <InfoCard
          label="Explored Cells"
          value={mapping.exploredCells ?? 0}
        />

        <InfoCard
          label="Landmarks"
          value={landmarks.length}
        />
      </div>
    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-sm ${color}`} />
      <span className="text-slate-300">{text}</span>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
      <p className="text-slate-400 text-xs uppercase">{label}</p>
      <h3 className="text-white text-xl font-bold mt-2">{value}</h3>
    </div>
  );
}