import { Volume2, Footprints, Route } from "lucide-react";

export default function NavigationPanel({
  navigation = {
    instruction: "Walk Forward 3 Steps",
    remainingDistance: 6.5,
    remainingSteps: 3,
    heading: "NORTH",
  },
}) {
  return (
    <section className="glass p-8">
      <div className="panel-header">
        <div>
          <p>VOICE GUIDANCE</p>
          <h2>Current Navigation Instruction</h2>
        </div>

        <Volume2 size={24} color="#22D3EE" />
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-cyan-500/15 to-violet-500/15 border border-cyan-500/20 p-8">
        <p className="text-slate-400 uppercase tracking-widest text-xs">
          SPEAK NOW
        </p>

        <h1 className="text-4xl font-bold text-white mt-4">
          {navigation.instruction}
        </h1>

        <p className="text-slate-300 mt-3">
          EchoMap will provide offline voice guidance using Vosk + eSpeak.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-8">
        <Stat
          icon={<Footprints color="#22D3EE" />}
          label="Steps Remaining"
          value={navigation.remainingSteps}
        />

        <Stat
          icon={<Route color="#22C55E" />}
          label="Distance Remaining"
          value={`${navigation.remainingDistance} m`}
        />

        <Stat
          icon={<Volume2 color="#A855F7" />}
          label="Heading"
          value={navigation.heading}
        />
      </div>
    </section>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="glass-light rounded-3xl p-5">
      {icon}

      <p className="text-xs uppercase text-slate-400 mt-4">{label}</p>

      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}