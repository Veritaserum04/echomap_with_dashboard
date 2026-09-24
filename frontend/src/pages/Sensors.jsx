import SensorPanel from "../components/SensorPanel";
import { useEchoMap } from "../context/EchoMapContext";

export default function Sensors() {
  const { connected } = useEchoMap();

  return (
    <div className="page-container space-y-8">

      <section className="hero-banner">
        <p className="text-cyan-400 uppercase tracking-[0.2em] text-sm">
          SENSOR MODE
        </p>

        <h1 className="text-5xl font-bold gradient-title mt-3">
          Ultrasonic Obstacle Detection
        </h1>

        <p className="text-slate-300 mt-4 max-w-3xl">
          EchoMap continuously reads three HC-SR04 ultrasonic sensors mounted on
          the wearable device to detect nearby obstacles and assist indoor navigation.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              connected ? "bg-green-400" : "bg-red-500"
            }`}
          />

          <span className="text-slate-300">
            {connected ? "Live Raspberry Pi Sensor Feed" : "Development Preview"}
          </span>
        </div>
      </section>

      <SensorPanel />
    </div>
  );
}