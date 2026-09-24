import { Bell, Cpu, Wifi } from "lucide-react";
import useEchoMapSocket from "../hooks/useEchoMapSocket";

export default function Topbar() {
  const { connected } = useEchoMapSocket();

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h1>EchoMap Dashboard</h1>
        <p>Raspberry Pi Indoor Navigation System</p>
      </div>

      <div className="topbar-actions">
        <div className="status-chip">
          <Wifi size={15} color={connected ? "#22C55E" : "#EF4444"} />
          <span>{connected ? "Backend Connected" : "Backend Offline"}</span>
        </div>

        <div className="status-chip">
          <Cpu size={15} color="#22D3EE" />
          <span>Raspberry Pi 3</span>
        </div>

        <button className="secondary-btn">
          <Bell size={18} />
        </button>

        <div className="avatar-circle">A</div>
      </div>
    </header>
  );
}