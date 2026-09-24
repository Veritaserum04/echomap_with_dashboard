import RadarScanner from "../components/RadarScanner";
import SensorPanel from "../components/SensorPanel";
import ConfidenceMeter from "../components/ConfidenceMeter";
import ObstacleRiskCard from "../components/ObstacleRiskCard";
import { useEchoMap } from "../context/EchoMapContext";
import BatteryWidget from "../components/BatteryWidget";
import NotificationCenter from "../components/NotificationCenter";
import SystemStatus from "../components/SystemStatus";
import VoiceConsolePanel from "../components/VoiceConsolePanel";
export default function Discovery() {
  const { connected } = useEchoMap();

  return (
    <div className="page-container space-y-8">

      <section className="hero-banner">
        <p className="text-cyan-400 uppercase tracking-[0.2em] text-sm">
          DISCOVERY MODE
        </p>

        <h1 className="text-5xl font-bold gradient-title mt-3">
          Ultrasonic Environment Detection
        </h1>

        <p className="text-slate-300 mt-4 max-w-3xl">
          Visualizes left, center and right ultrasonic sensors in real time
          while scanning nearby obstacles.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              connected ? "bg-green-400" : "bg-red-500"
            }`}
          />

          <span className="text-slate-300">
            {connected ? "Live Sensor Stream" : "Offline Preview"}
          </span>
        </div>
      </section>

      
      
      <SensorPanel />
      <RadarScanner />
      <ConfidenceMeter />
      <BatteryWidget />
      <NotificationCenter />
      <SystemStatus />
      <ObstacleRiskCard />
      <VoiceConsolePanel />

    </div>
  );
}