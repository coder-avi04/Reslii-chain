import React from "react";
import { Sidebar } from "./Sidebar";
import { Bell, Search, User, Shield } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { profile } = useApp();

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans resilience-grid">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">
              Operational Intelligence Center
            </h1>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse glow-blue" />
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Live Link</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-slate-100/50 rounded-lg border border-slate-200">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight leading-none">Security Protocol</span>
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">Level 4 Certified</span>
               </div>
               <Shield className="w-4 h-4 text-slate-400" />
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded text-green-700 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              SYSTEM NOMINAL
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
