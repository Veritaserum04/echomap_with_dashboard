import { Wifi, WifiOff } from "lucide-react";
import { useEchoMap } from "../context/EchoMapContext";

export default function ConnectionIndicator() {
  const { connected } = useEchoMap();

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
        connected
          ? "border-green-500/40 bg-green-500/10"
          : "border-red-500/40 bg-red-500/10"
      }`}
    >
      {connected ? (
        <Wifi className="text-green-400" size={18} />
      ) : (
        <WifiOff className="text-red-400" size={18} />
      )}

      <span
        className={`text-sm font-medium ${
          connected ? "text-green-300" : "text-red-300"
        }`}
      >
        {connected ? "Raspberry Pi Connected" : "Offline Preview"}
      </span>
    </div>
  );
}