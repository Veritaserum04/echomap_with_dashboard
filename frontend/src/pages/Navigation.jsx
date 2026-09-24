import NavigationCompass from "../components/NavigationCompass";
import InstructionCard from "../components/InstructionCard";
import NavigationProgress from "../components/NavigationProgress";
import VoiceTimeline from "../components/VoiceTimeline";
import { useEchoMap } from "../context/EchoMapContext";
import VoiceConsolePanel from "../components/VoiceConsolePanel";
import NavigationLog from "../components/NavigationLog";
import NavigationSummary from "../components/NavigationSummary";
export default function Navigation() {
  const { connected } = useEchoMap();

  return (
    <div className="page-container space-y-8">

      <section className="hero-banner">
        <p className="text-cyan-400 uppercase tracking-[0.2em] text-sm">
          NAVIGATION MODE
        </p>

        <h1 className="text-5xl font-bold gradient-title mt-3">
          Indoor Route Guidance
        </h1>

        <p className="text-slate-300 mt-4 max-w-3xl">
          EchoMap provides live turn-by-turn indoor navigation using the
          occupancy grid and ultrasonic sensors.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              connected ? "bg-green-400" : "bg-red-500"
            }`}
          />

          <span className="text-slate-300">
            {connected ? "Live Navigation Active" : "Offline Preview"}
          </span>
        </div>
      </section>

      <div className="grid xl:grid-cols-[360px_1fr] gap-6">
        <NavigationCompass />
        <InstructionCard />
      </div>
      <NavigationSummary />
      <NavigationProgress />
      <VoiceConsolePanel />
      <VoiceTimeline />
      <NavigationLog />

    </div>
  );
}