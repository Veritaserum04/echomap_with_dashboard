export default function SuccessDonut({ success=11, total=12 }){

  const percentage=Math.round(success/total*100);

  const radius=70;
  const circumference=2*Math.PI*radius;
  const offset=circumference-(percentage/100)*circumference;

  return(
    <section className="glass p-8 flex flex-col items-center">

      <p className="text-cyan-400 text-xs uppercase">
        SUCCESS RATE
      </p>

      <h2 className="text-2xl font-bold mb-8">
        Navigation Success
      </h2>

      <div className="relative">

        <svg width="180" height="180">

          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#1E293B"
            strokeWidth="12"
            fill="none"
          />

          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#22C55E"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
          />

        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-green-400">
            {percentage}%
          </h2>

          <p className="text-slate-400 text-sm">
            Success
          </p>
        </div>

      </div>

      <div className="mt-8 space-y-3 w-full">
        <Row label="Successful Sessions" value={success}/>
        <Row label="Failed Sessions" value={total-success}/>
        <Row label="Total Sessions" value={total}/>
      </div>

    </section>
  )
}

function Row({label,value}){
  return(
    <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
      <span className="text-slate-400">{label}</span>
      <span>{value}</span>
    </div>
  )
}