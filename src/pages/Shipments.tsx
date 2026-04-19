import React, { useState } from "react";
import { Search, Plus, Filter, MoreHorizontal, Truck, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

export default function Shipments() {
  const { shipments } = useApp();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredShipments = shipments.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            Shipment Global Registry
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">Track and manage active logistics operations globally.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95">
          <Plus className="w-4 h-4" />
          Create Shipment
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter specific ID, Origin, or Destination..." 
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Logistics ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Origin / Route</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Destination</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Schedule</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Priority</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShipments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-blue-50 transition-colors">
                        <Truck className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-blue-600 tracking-tight">{item.id}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{item.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm text-slate-600 font-medium">{item.origin}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-700 text-sm">{item.destination}</td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      item.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      item.status === "In Transit" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      item.status === "Delayed" ? "bg-red-50 text-red-700 border border-red-100" :
                      "bg-amber-50 text-amber-700 border border-amber-100"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        item.status === "Delivered" ? "bg-emerald-500" :
                        item.status === "In Transit" ? "bg-blue-500" :
                        item.status === "Delayed" ? "bg-red-500" :
                        "bg-amber-500"
                      )} />
                      {item.status}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2 text-sm text-slate-700 font-bold font-mono">
                        {item.eta}
                      </div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest flex items-center gap-1">
                         <Calendar className="w-2.5 h-2.5" />
                         Estimated Arrival
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded",
                      item.priority === "Critical" ? "text-red-600 border border-red-100 bg-red-50" :
                      item.priority === "High" ? "text-orange-600 border border-orange-100 bg-orange-50" :
                      item.priority === "Medium" ? "text-blue-600 border border-blue-100 bg-blue-50" :
                      "text-slate-500 bg-slate-100"
                    )}>
                      {item.priority}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 font-bold hover:bg-slate-100 rounded-lg transition-all">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Showing {filteredShipments.length} of {shipments.length} Total Registered Shipments</span>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-[11px] font-bold text-slate-400 uppercase tracking-widest disabled:opacity-50 hover:bg-slate-50 transition-all shadow-sm">Previous</button>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-lg text-[11px] font-bold text-slate-700 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
}
