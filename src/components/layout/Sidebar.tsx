import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Truck, 
  Route, 
  Brain, 
  Bell, 
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

const NAVIGATION = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Shipments", href: "/shipments", icon: Truck },
  { name: "Optimal Routes", href: "/routes", icon: Route },
  { name: "AI Prediction", href: "/prediction", icon: Brain },
  { name: "Alerts", href: "/alerts", icon: Bell },
];

export function Sidebar() {
  const location = useLocation();
  const { profile, logout } = useApp();

  return (
    <div className="w-64 h-full bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Truck className="text-white w-5 h-5" />
        </div>
        <span className="text-white font-bold text-xl tracking-tight">ResiliChain</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2">
          Main Management
        </div>
        {NAVIGATION.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 font-medium" 
                  : "hover:bg-slate-800 transition-colors"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="text-sm font-medium">{item.name}</span>
              {isActive && <ChevronRight className="ml-auto w-4 h-4 text-blue-500" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white uppercase">
            {profile?.displayName?.charAt(0) || "JD"}
          </div>
          <div>
            <div className="text-sm font-semibold text-white truncate w-32">{profile?.displayName || "James Dalton"}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{profile?.role || "Manager"}</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-slate-400 hover:bg-slate-800 transition-all"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
