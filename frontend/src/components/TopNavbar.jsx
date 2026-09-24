import { Bell, Cpu, Wifi } from "lucide-react";
import useEchoMapSocket from "../hooks/useEchoMapSocket";

export default function Topbar() {
  const { connected } = useEchoMapSocket();

  return (
    <div className="topbar">

      <div className="topbar-title">
        <h1>EchoMap Dashboard</h1>
        <p>Raspberry Pi Indoor Navigation System</p>
      </div>

      <div className="topbar-actions">

        <div className="status-chip">
          <Wifi size={15}/>
          {connected ? "Connected" : "Offline"}
        </div>

        <div className="status-chip">
          <Cpu size={15}/>
          Raspberry Pi 3
        </div>

        <Bell size={20} color="#CBD5E1"/>

        <div className="avatar-circle">
          A
        </div>

      </div>

    </div>
  );
}