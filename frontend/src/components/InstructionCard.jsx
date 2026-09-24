import { Route } from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

export default function InstructionCard() {
  const { liveData } = useEchoMap();

  const nav = liveData?.navigation ?? {};

  return (
    <div className="glass p-6 rounded-3xl">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase">
            CURRENT INSTRUCTION
          </p>

          <h2 className="text-white text-2xl font-bold mt-2">
            Navigation Guidance
          </h2>
        </div>

        <Route color="#22D3EE"/>
      </div>

      <div className="mt-8 rounded-2xl border border-cyan-700 bg-cyan-950/30 p-5">
        <h1 className="text-3xl font-bold text-cyan-300">
          {nav.instruction}
        </h1>

        <p className="text-slate-400 mt-3">
          Destination:{" "}
          <span className="text-white font-medium">
            {nav.destination}
          </span>
        </p>
      </div>
    </div>
  );
}