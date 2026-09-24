import {
  LayoutDashboard,
  Radar,
  Map,
  Navigation,
  MapPinned,
  Mic2,
  BarChart3,
  Activity,
  Route,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { name: "Overview", path: "/", icon: LayoutDashboard },
  { name: "Discovery", path: "/discovery", icon: Radar },
  { name: "Mapping", path: "/mapping", icon: Map },
  { name: "Navigation", path: "/navigation", icon: Navigation },
  { name: "Landmarks", path: "/landmarks", icon: MapPinned },
  { name: "Voice Console", path: "/voice", icon: Mic2 },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "System Status", path: "/system", icon: Activity },
  { name: "Sensors", path: "/sensors", icon: Radar },
];

export default function Sidebar({ open }) {
  return (
    <aside
      className={`${
        open ? "w-72" : "w-24"
      } transition-all duration-300 bg-slate-950 border-r border-slate-800 flex flex-col`}
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/20 p-3">
            <Route className="text-cyan-400" size={28} />
          </div>

          {open && (
            <div>
              <h2 className="font-bold text-xl text-white">EchoMap</h2>
              <p className="text-xs text-slate-400">
                Indoor Navigation System
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${
                isActive
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <item.icon size={22} />

            {open && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="m-4 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 p-5">
        {open ? (
          <>
            <p className="text-cyan-400 text-xs uppercase tracking-[0.2em]">
              EchoMap
            </p>

            <h3 className="font-bold mt-2 text-lg text-white">
              Smart Indoor Navigation
            </h3>

            <p className="text-sm text-slate-400 mt-2 leading-6">
              Real-time indoor navigation using Raspberry Pi, ultrasonic sensors,
              SLAM mapping, and voice guidance.
            </p>
          </>
        ) : (
          <Route className="text-cyan-400 mx-auto" size={28} />
        )}
      </div>
    </aside>
  );
}