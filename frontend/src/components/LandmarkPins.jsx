import { MapPin } from "lucide-react";

export default function LandmarkPins({ landmarks = [] }) {
  return (
    <>
      {landmarks.map((landmark) => (
        <div
          key={landmark.name}
          className="absolute pointer-events-none"
          style={{
            left: `${(landmark.x / 20) * 100}%`,
            top: `${100 - (landmark.y / 20) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative group">
            <MapPin size={18} className="text-yellow-300 drop-shadow-lg" />

            <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-950 border border-slate-700 px-3 py-1 text-xs text-white shadow-xl z-50">
              {landmark.name}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}