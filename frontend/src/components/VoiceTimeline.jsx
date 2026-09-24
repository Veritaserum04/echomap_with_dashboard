import { Mic, Volume2 } from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

export default function VoiceTimeline() {
  const { liveData } = useEchoMap();

  const history = liveData?.navigation?.voiceHistory ?? [];

  return (
    <div className="glass rounded-3xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.2em] text-xs">
            VOICE ASSISTANT
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            Navigation Voice History
          </h2>
        </div>

        <Volume2 size={26} className="text-cyan-400" />
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-400">
            No voice instructions received yet.
          </div>
        ) : (
          history
            .slice()
            .reverse()
            .map((message, index) => (
              <div
                key={index}
                className="rounded-2xl border border-cyan-900 bg-slate-900/60 p-4 flex items-start gap-4"
              >
                <div className="mt-1 rounded-full bg-cyan-500/10 p-2">
                  <Mic size={18} className="text-cyan-300" />
                </div>

                <div className="flex-1">
                  <p className="text-white">{message}</p>

                  <p className="text-xs text-slate-500 mt-1">
                    Raspberry Pi Voice Assistant
                  </p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}