import React from "react";
import { Bell, AlertTriangle, AlertCircle, Info, Trash2, Filter, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

export default function Alerts() {
  const { alerts } = useApp();
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            Service Intelligence 
            <Bell className="w-6 h-6 text-blue-600" />
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Real-time critical incidents and system suggestions.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-400 p-2.5 rounded-lg hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Filter className="w-4 h-4" />
            Filter Alerts
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-slate-800">
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-50 pb-3">Operational Categories</h2>
            <div className="space-y-2">
              {[
                { name: "Global Feed", count: 24, active: true },
                { name: "Critical Risks", count: 8, active: false },
                { name: "Weather Intelligence", count: 3, active: false },
                { name: "AI Suggestions", count: 12, active: false },
              ].map((cat) => (
                <button 
                  key={cat.name} 
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all",
                    cat.active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  )}
                >
                  <span>{cat.name}</span>
                  <span className={cn(
                    "font-mono px-2 py-0.5 rounded-full text-[9px]",
                    cat.active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                  )}>{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className="bg-white border border-slate-200 rounded-2xl p-6 flex gap-6 group hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                alert.severity === "high" ? "bg-red-50 text-red-600" : 
                alert.severity === "medium" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
              )}>
                {alert.severity === "high" ? <AlertTriangle className="w-7 h-7" /> : 
                 alert.severity === "medium" ? <AlertCircle className="w-7 h-7" /> : <Info className="w-7 h-7" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full",
                    alert.severity === "high" ? "bg-red-600 text-white" : 
                    alert.severity === "medium" ? "bg-amber-500 text-white" : "bg-blue-600 text-white"
                  )}>
                    {alert.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </span>
                </div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                  {alert.msg}
                </p>
                
                <div className="mt-5 flex gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:underline decoration-2 underline-offset-4">Initiate Response</button>
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-800 transition-colors">Archive</button>
                </div>
              </div>

              {alert.severity === "high" && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.03] rotate-45 translate-x-16 -translate-y-16 pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
