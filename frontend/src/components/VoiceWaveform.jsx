import { motion } from "framer-motion";
import { Mic } from "lucide-react";

export default function VoiceWaveform({ listening = true }) {
  const bars = Array.from({ length: 36 });

  return (
    <section className="glass p-8 flex flex-col justify-between">
      <div className="panel-header">
        <div>
          <p>VOICE INPUT</p>
          <h2>Live Audio Waveform</h2>
        </div>

        <Mic color="#22D3EE"/>
      </div>

      <div className="flex justify-center py-6">
        <motion.div
          animate={{
            scale: listening ? [1, 1.12, 1] : 1,
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.35)]"
        >
          <Mic color="white" size={34}/>
        </motion.div>
      </div>

      <div className="flex items-end justify-center gap-[3px] h-28 mt-4">
        {bars.map((_,i)=>(
          <motion.div
            key={i}
            animate={{
              height: listening
                ? [12, Math.random()*70+15, 18]
                : 12,
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              delay: i*0.05,
            }}
            className="w-[5px] rounded-full bg-gradient-to-t from-cyan-400 to-violet-500"
          />
        ))}
      </div>

      <p className="text-center text-slate-400 mt-6">
        {listening
          ? "Listening for navigation commands..."
          : "Microphone Idle"}
      </p>
    </section>
  );
}