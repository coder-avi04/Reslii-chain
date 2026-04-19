import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Shell } from "./components/layout/Shell";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import OptimalRoutes from "./pages/OptimalRoutes";
import Prediction from "./pages/Prediction";
import Alerts from "./pages/Alerts";
import Login from "./pages/Login";

import { useApp } from "./context/AppContext";

// Custom Auth Guard (Simulated for now)
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useApp();
  
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest animate-pulse">Syncing ResiliChain...</span>
      </div>
    );
  }
  
  return user ? <Shell>{children}</Shell> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/shipments" element={<AuthGuard><Shipments /></AuthGuard>} />
          <Route path="/routes" element={<AuthGuard><OptimalRoutes /></AuthGuard>} />
          <Route path="/prediction" element={<AuthGuard><Prediction /></AuthGuard>} />
          <Route path="/alerts" element={<AuthGuard><Alerts /></AuthGuard>} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
