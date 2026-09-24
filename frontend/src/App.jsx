import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Sensors from "./pages/Sensors";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./auth/ProtectedRoute";

import Overview from "./pages/Overview";
import Discovery from "./pages/Discovery";
import Mapping from "./pages/Mapping";
import Navigation from "./pages/Navigation";
import Landmarks from "./pages/Landmarks";
import VoiceConsole from "./pages/VoiceConsole";
import Analytics from "./pages/Analytics";
import SystemStatus from "./pages/SystemStatus";

export default function App() {
  return (
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="discovery" element={<Discovery />} />
          <Route path="mapping" element={<Mapping />} />
          <Route path="navigation" element={<Navigation />} />
          <Route path="landmarks" element={<Landmarks />} />
          <Route path="voice" element={<VoiceConsole />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="system" element={<SystemStatus />} />
          <Route path="/sensors" element={<Sensors />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
  );
}