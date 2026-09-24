import { Bot, UserRound } from "lucide-react";
import { motion } from "framer-motion";

export default function VoiceHistory({ history = [] }) {
  return (
    <section className="glass p-8">
      <div className="panel-header">
        <div>
          <p>COMMAND HISTORY</p>
          <h2>Conversation Timeline</h2>
        </div>
      </div>

      <div className="space-y-5 mt-6">
        {history.map((msg,index)=>(
          <motion.div
            key={index}
            initial={{opacity:0,x:20}}
            animate={{opacity:1,x:0}}
            className={`flex gap-4 ${
              msg.type==="assistant"
                ? "justify-start"
                : "justify-end"
            }`}
          >
            {msg.type==="assistant" && (
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Bot color="#A855F7"/>
              </div>
            )}

            <div
              className={`max-w-md rounded-3xl px-5 py-4 ${
                msg.type==="assistant"
                  ? "bg-violet-500/10 border border-violet-500/20"
                  : "bg-cyan-500/10 border border-cyan-500/20"
              }`}
            >
              <p className="text-white">{msg.text}</p>
            </div>

            {msg.type==="user" && (
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <UserRound color="#22D3EE"/>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}