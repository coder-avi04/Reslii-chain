import React from "react";
import { Map, Navigation, MapPin, Search, Plus, Filter, Info, ChevronRight, Route } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OptimalRoutes() {
  return (
    <div className="p-8 space-y-8 flex flex-col h-full">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Route Optimization</h1>
          <p className="text-gray-500 mt-1">Shortest path calculation and dynamic rerouting strategies.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-white/10 text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2">
            <Route className="w-4 h-4" />
            Optimize All
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0">
        <div className="lg:col-span-3 bg-[#151619] border border-white/10 rounded-xl relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
               style={{ 
                 backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', 
                 backgroundSize: '24px 24px' 
               }} 
          />
          
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Active Map View</span>
              <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                <button className="px-3 py-1 text-[10px] uppercase font-bold text-white bg-white/10 rounded-md">Satellite</button>
                <button className="px-3 py-1 text-[10px] uppercase font-bold text-gray-500 hover:text-gray-300">Terrain</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 <span className="text-[10px] font-mono text-gray-500 uppercase">Traffic: Low</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-500" />
                 <span className="text-[10px] font-mono text-gray-500 uppercase">Weather: Warning</span>
               </div>
            </div>
          </div>

          <div className="flex-1 relative bg-black/20 z-0">
            {/* Mock Map Representation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-2xl">
                {/* Simulated Nodes & Paths */}
                <div className="absolute top-[20%] left-[10%] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" /> {/* Singapore */}
                <div className="absolute top-[30%] right-[20%] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" /> {/* Europe */}
                <div className="absolute bottom-[20%] right-[40%] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                
                {/* SVG Path Simulation */}
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  <path 
                    d="M 60 150 Q 250 80 480 200" 
                    fill="none" 
                    stroke="rgba(249, 115, 22, 0.5)" 
                    strokeWidth="2" 
                    strokeDasharray="5,5" 
                  />
                  <path 
                    d="M 60 150 Q 250 300 480 200" 
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth="3" 
                  />
                  <circle cx="60" cy="150" r="4" fill="#f97316" />
                  <circle cx="480" cy="200" r="4" fill="#f97316" />
                </svg>

                <div className="absolute top-[20%] left-[25%] bg-[#1c1d21] border border-orange-500/30 p-2 rounded-lg text-xs shadow-2xl">
                  <div className="text-orange-500 font-bold mb-1 uppercase tracking-tighter text-[10px]">Optimal Path Suggested</div>
                  <div className="text-white">Diverting due to Storm Alpha</div>
                  <div className="text-gray-500 mt-1 text-[9px] font-mono tracking-widest">+2.5 hours transit</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-6 flex gap-3">
               <div className="bg-[#151619] p-3 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase font-mono tracking-widest">Active Calculations</div>
                      <div className="text-lg font-bold text-white">41,202 <span className="text-xs font-normal text-gray-600">paths/sec</span></div>
                    </div>
                  </div>
               </div>
            </div>
            
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <button className="w-10 h-10 bg-[#151619] border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-[#151619] border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <div className="w-5 h-[2px] bg-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#151619] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Route Queue</h2>
            <div className="space-y-3">
              {[
                { id: "TX-221", from: "AUS", to: "NYC", status: "optimized" },
                { id: "LA-772", from: "LAX", to: "HND", status: "calculating" },
                { id: "SC-942", from: "SIN", to: "ROT", status: "rerouting" },
                { id: "SH-553", from: "SHA", to: "LGB", status: "optimized" },
              ].map((route) => (
                <div key={route.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white font-mono">{route.id}</span>
                    <div className={cn(
                      "text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded",
                      route.status === "optimized" ? "bg-emerald-500/10 text-emerald-500" :
                      route.status === "calculating" ? "bg-blue-500/10 text-blue-500" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {route.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{route.from}</span>
                    <ChevronRight className="w-3 h-3 text-gray-700" />
                    <span>{route.to}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500/20 p-2 rounded-lg">
                <Info className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">System Insight</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Route optimization is currently prioritizing fuel efficiency over transit speed due to rising cost trends in North Atlantic corridors.
                </p>
                <button className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mt-3 hover:underline">
                  Review Logic Parameters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
