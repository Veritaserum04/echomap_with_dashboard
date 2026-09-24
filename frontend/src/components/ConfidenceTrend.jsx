import { motion } from "framer-motion";

export default function ConfidenceTrend(){

  const values=[55,62,71,75,79,84,88,91];

  const points=values
    .map((v,i)=>`${i*55},${180-v*1.4}`)
    .join(" ");

  return(
    <section className="glass p-8">

      <div className="panel-header">
        <div>
          <p>CONFIDENCE TREND</p>
          <h2>Recent Navigation Sessions</h2>
        </div>
      </div>

      <svg viewBox="0 0 400 180" className="w-full mt-6">

        {[0,1,2,3].map((i)=>(
          <line
            key={i}
            x1="0"
            y1={40+i*35}
            x2="400"
            y2={40+i*35}
            stroke="#1E293B"
          />
        ))}

        <motion.polyline
          fill="none"
          stroke="#22D3EE"
          strokeWidth="4"
          points={points}
          initial={{pathLength:0}}
          animate={{pathLength:1}}
          transition={{duration:1.5}}
        />

        {values.map((v,i)=>(
          <circle
            key={i}
            cx={i*55}
            cy={180-v*1.4}
            r="5"
            fill="#22D3EE"
          />
        ))}

      </svg>

      <div className="flex justify-between mt-4 text-xs text-slate-500">
        <span>Session 1</span>
        <span>Session 8</span>
      </div>

    </section>
  )
}