import { Outlet } from "react-router-dom";
import {
  Menu,
  Wifi,
  WifiOff,
  Bell,
  LogOut,
  UserCircle2,
  BatteryCharging,
  Cpu,
} from "lucide-react";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import useEchoMapSocket from "../hooks/useEchoMapSocket";
import { useEchoMap } from "../context/EchoMapContext";
import { useAuth } from "../auth/AuthContext";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // WebSocket connection status
  const { connected } = useEchoMapSocket();

  // Live dashboard data
  const { liveData } = useEchoMap();

  const system = liveData?.system ?? {
    battery: 0,
    cpuTemp: 0,
  };

  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* ================= Sidebar ================= */}
      <Sidebar open={sidebarOpen} />

      {/* ================= Main Content ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ================= Topbar ================= */}
        <header className="sticky top-0 z-40 h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-6 flex justify-between items-center">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-700"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                EchoMap Dashboard
              </p>

              <h1 className="font-bold text-lg text-cyan-300">
                Raspberry Pi Navigation Console
              </h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Raspberry Pi Connection */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                connected
                  ? "bg-green-500/15 text-green-400 border border-green-500/30"
                  : "bg-red-500/15 text-red-400 border border-red-500/30"
              }`}
            >
              {connected ? <Wifi size={18} /> : <WifiOff size={18} />}
              {connected ? "Raspberry Pi Online" : "Offline"}
            </div>

            {/* Battery */}
            <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-900 border border-slate-700 px-3 py-2">
              <BatteryCharging size={18} className="text-green-400" />

              <span className="text-sm font-medium text-white">
                {system.battery}%
              </span>
            </div>

            {/* CPU Temperature */}
            <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-900 border border-slate-700 px-3 py-2">
              <Cpu size={18} className="text-orange-400" />

              <span className="text-sm font-medium text-white">
                {system.cpuTemp}°C
              </span>
            </div>

            {/* Notifications */}
            <button className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 transition">
              <Bell size={20} />
            </button>

            {/* User */}
            <div className="flex items-center gap-3 rounded-full bg-slate-900 border border-slate-700 px-3 py-2">
              <UserCircle2 size={34} className="text-cyan-400" />

              <div className="hidden md:block leading-tight">
                <p className="font-semibold">
                  {user?.name || "EchoMap User"}
                </p>

                <p className="text-xs text-slate-400">
                  {user?.email || "offline@echomap.ai"}
                </p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition"
            >
              <LogOut size={20} className="text-red-400" />
            </button>
          </div>
        </header>

        {/* ================= Dashboard Pages ================= */}
        <main className="flex-1 overflow-y-auto bg-[#030817]">
          <div className="max-w-[1700px] mx-auto w-full px-8 py-8 pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}