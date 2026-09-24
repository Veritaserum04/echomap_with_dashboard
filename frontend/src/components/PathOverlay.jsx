export default function PathOverlay({ path = [] }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      {path.map(([x, y], index) => {
        if (index === path.length - 1) return null;

        const [nx, ny] = path[index + 1];

        return (
          <line
            key={index}
            x1={`${(x + 0.5) * 5}%`}
            y1={`${100 - (y + 0.5) * 5}%`}
            x2={`${(nx + 0.5) * 5}%`}
            y2={`${100 - (ny + 0.5) * 5}%`}
            stroke="#22d3ee"
            strokeWidth="3"
            strokeDasharray="4 4"
            opacity="0.9"
          />
        );
      })}
    </svg>
  );
}