import React from "react";
import { Sidebar } from "./Sidebar";
import { Bell, Search, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const { profile } = useApp();

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <h1 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
            ResiliChain Dashboard
          </h1>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded text-green-700 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              SYSTEM STABLE
            </div>
            
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-md px-3 py-1.5 w-64">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Deep search..." 
                className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder:text-slate-400"
              />
            </div>

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
