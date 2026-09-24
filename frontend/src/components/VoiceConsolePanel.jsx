import { Volume2, Mic } from "lucide-react";

export default function VoiceConsolePanel({
  instruction,
  connected,
}) {
  return (
    <div className="glass-card rounded-3xl p-6">

      <div className="flex justify-between items-center mb-5">

        <div className="flex gap-3 items-center">
          <Volume2 className="text-cyan-400" size={28}/>
          <h2 className="text-2xl font-semibold text-white">
            Current Voice Output
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Mic
            className={
              connected
                ? "text-green-400 animate-pulse"
                : "text-slate-500"
            }
          />

          <span className="text-slate-300 text-sm">
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>

      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-cyan-500/30 p-6">

        <p className="text-slate-400 uppercase tracking-widest text-xs mb-2">
          SPEAKING NOW
        </p>

        <h1 className="text-4xl text-cyan-300 font-bold">
          {instruction}
        </h1>

      </div>

    </div>
  );
}