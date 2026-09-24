import { motion } from "framer-motion";
import {
  Mic,
  Volume2,
  Bot,
  CheckCircle2,
} from "lucide-react";

export default function VoiceStatusCard({ voice }) {
  const status = [
    {
      label: "Listening",
      value: voice.listening,
      icon: <Mic color="#22D3EE"/>,
    },
    {
      label: "Speaking",
      value: voice.speaking,
      icon: <Volume2 color="#22C55E"/>,
    },
    {
      label: "Processing",
      value: !voice.speaking && !voice.listening,
      icon: <Bot color="#A855F7"/>,
    },
  ];

  return (
    <section className="glass p-8">
      <div className="panel-header">
        <div>
          <p>VOICE ENGINE</p>
          <h2>System Status</h2>
        </div>
      </div>

      <div className="space-y-5 mt-6">
        {status.map((item)=>(
          <motion.div
            whileHover={{x:5}}
            key={item.label}
            className="glass-light rounded-2xl p-5 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>

            {item.value ? (
              <CheckCircle2 color="#22C55E"/>
            ) : (
              <div className="w-3 h-3 rounded-full bg-slate-600"/>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <p className="text-xs text-slate-400 uppercase">
          Recognition Confidence
        </p>

        <h2 className="text-4xl font-bold text-cyan-300 mt-3">
          {voice.confidence}%
        </h2>

        <div className="progress-track mt-4">
          <div
            className="progress-fill"
            style={{width:`${voice.confidence}%`}}
          />
        </div>
      </div>
    </section>
  );
}