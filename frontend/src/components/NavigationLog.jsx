import {
  Footprints,
  ArrowUp,
  ArrowRight,
  ArrowLeft,
  Flag,
} from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

export default function NavigationLog() {
  const { liveData } = useEchoMap();

  const history = liveData?.navigation?.voiceHistory ?? [];
  const heading = liveData?.navigation?.heading ?? "NORTH";

  const getIcon = (message) => {
    const text = message.toLowerCase();

    if (text.includes("destination")) {
      return <Flag size={18} className="text-green-400" />;
    }

    if (text.includes("left")) {
      return <ArrowLeft size={18} className="text-yellow-400" />;
    }

    if (text.includes("right")) {
      return <ArrowRight size={18} className="text-yellow-400" />;
    }

    return <ArrowUp size={18} className="text-cyan-400" />;
  };

  return (
    <div className="glass rounded-3xl p-6 space-y-6">

      <div>
        <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
          NAVIGATION LOG
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          Turn-by-Turn Route History
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Instructions received from the Raspberry Pi navigation engine.
        </p>
      </div>

      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">

        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-500">
            No navigation events yet.
          </div>
        ) : (
          history
            .slice()
            .reverse()
            .map((message, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex items-start gap-4"
              >
                <div className="mt-1 p-2 rounded-full bg-cyan-500/10">
                  {getIcon(message)}
                </div>

                <div className="flex-1">
                  <p className="text-white">{message}</p>

                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Footprints size={14} />
                      EchoMap Route
                    </span>

                    <span>{heading}</span>
                  </div>
                </div>
              </div>
            ))
        )}

      </div>

    </div>
  );
}