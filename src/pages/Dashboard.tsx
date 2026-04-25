import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { geminiService } from "@/services/geminiService";
import { motion, AnimatePresence } from "motion/react";
import { FileText, X, Loader2 } from "lucide-react";

const DATA = [
  { name: "Mon", trips: 45, delayed: 2 },
  { name: "Tue", trips: 52, delayed: 4 },
  { name: "Wed", trips: 38, delayed: 1 },
  { name: "Thu", trips: 65, delayed: 8 },
  { name: "Fri", trips: 48, delayed: 3 },
  { name: "Sat", trips: 32, delayed: 0 },
  { name: "Sun", trips: 28, delayed: 1 },
];

export default function Dashboard() {
  const { shipments, alerts, inquiries } = useApp();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [report, setReport] = React.useState<string | null>(null);
  
  const activeShipments = shipments.filter(s => s.status !== "Delivered").length;
  const pendingInquiries = inquiries.filter(i => i.status !== "Resolved").length;
  const onTimeRate = "94.2%"; 
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const dashboardState = {
        metrics: {
          activeShipments,
          onTimeRate,
          activeDisruptions: alerts.filter(a => a.severity === "high").length,
          pendingSupport: pendingInquiries
        },
        recentTrends: DATA
      };

      const summary = await geminiService.generateExecutiveSummary(dashboardState);
      setReport(summary);
    } catch (error) {
      console.error("Report Generation Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const STATS = [
    { 
      label: "Active Shipments", 
      value: String(activeShipments), 
      change: "+12%", 
      trend: "up", 
      icon: Truck, 
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      label: "On-Time Delivery", 
      value: onTimeRate, 
      change: "+0.4%", 
      trend: "up", 
      icon: CheckCircle2, 
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      label: "Active Disruptions", 
      value: String(alerts.filter(a => a.severity === "high").length), 
      change: "Stable", 
      trend: "neutral", 
      icon: AlertTriangle, 
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    { 
      label: "Avg. Transit Time", 
      value: "2.4 Days", 
      change: "-12h", 
      trend: "down", 
      icon: Clock, 
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
  ];
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Logistics Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">Real-time supply chain monitoring and performance analytics.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-slate-200 rounded-md px-4 py-2 text-sm text-slate-600 outline-none focus:border-blue-500 transition-colors cursor-pointer shadow-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
          </select>
          <button 
            disabled={isGenerating}
            onClick={handleGenerateReport}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer shadow-md shadow-blue-600/10 active:scale-[0.98] flex items-center gap-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {isGenerating ? "Analyzing..." : "Generate Report"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {report && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col border border-slate-200"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Intelligence Report</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ResiliChain // Executive Briefing</p>
                  </div>
                </div>
                <button 
                  onClick={() => setReport(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 prose prose-slate max-w-none prose-sm prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-[11px] prose-headings:text-blue-600">
                <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-600">
                  {report}
                </div>
              </div>

              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Export PDF
                </button>
                <button 
                  onClick={() => setReport(null)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between group hover:border-slate-300 transition-all hover:shadow-md">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center justify-between border-b border-slate-50 pb-1">
                {stat.label}
                <stat.icon className={cn("w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity", stat.color)} />
              </div>
              <div className="text-3xl font-black text-slate-800 leading-none font-mono tracking-tighter">{stat.value}</div>
            </div>
            
            <div className={cn(
              "flex items-center gap-1 text-[10px] mt-4 font-black tracking-[0.1em] uppercase",
              stat.trend === "up" ? "text-emerald-600" : stat.trend === "down" ? "text-amber-600" : "text-slate-400"
            )}>
              {stat.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
              {stat.trend === "down" && <ArrowDownRight className="w-3 h-3" />}
              {stat.change} 
              <span className="text-slate-300 font-bold ml-1 italic lowercase">vs L7D</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl shadow-xl relative overflow-hidden flex flex-col min-h-[400px]">
          <div className="absolute top-6 left-6 z-10 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700/50 shadow-2xl">
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Live Route Monitor</div>
            <div className="text-sm font-bold text-white">Suez Canal Bypass (Alternate B)</div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-8">
             <div className="w-full h-full opacity-60 relative">
               <svg viewBox="0 0 800 400" className="w-full h-full">
                <path d="M100,200 Q200,100 400,200 T700,200" stroke="#2563eb" strokeWidth="2" fill="none" strokeDasharray="8 4" className="animate-[dash_20s_linear_infinite]" />
                <circle cx="100" cy="200" r="4" fill="#2563eb" />
                <circle cx="700" cy="200" r="4" fill="#10b981" />
                <circle cx="400" cy="200" r="6" fill="#f59e0b" className="animate-pulse shadow-amber-500 shadow-xl" />
              </svg>
             </div>
          </div>

          <div className="h-14 bg-slate-900/50 backdrop-blur-sm flex items-center justify-between px-8 border-t border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Lat: 29.9753° N</span>
            <span>Long: 32.5263° E</span>
            <span>ETA Update: 4h 12m</span>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 text-lg">AI Smart Insights</h3>
            <div className="text-[10px] px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold uppercase tracking-wider">Live Engine</div>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400 transition-all hover:translate-x-1">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wide">Port Congestion Prediction</div>
              <p className="text-[12px] text-amber-700 mt-2 leading-relaxed">High risk (82%) of delay at Port of Rotterdam due to vessel clustering.</p>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-400 transition-all hover:translate-x-1">
              <div className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Route Optimization Suggestion</div>
              <p className="text-[12px] text-indigo-700 mt-2 leading-relaxed">Dynamic rerouting via Terminal 4 saves 1.2 hrs and 14kg CO2 emissions.</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400 transition-all hover:translate-x-1">
              <div className="text-xs font-bold text-blue-800 uppercase tracking-wide">Predictive Maintenance</div>
              <p className="text-[12px] text-blue-700 mt-2 leading-relaxed">Truck #TX-2210 shows engine vibration anomaly. Scheduled check required in 48h.</p>
            </div>

            {pendingInquiries > 0 && (
              <div className="p-4 bg-red-50 rounded-xl border-l-4 border-red-400 transition-all hover:translate-x-1">
                <div className="text-xs font-bold text-red-800 uppercase tracking-wide">Customer Support Alert</div>
                <p className="text-[12px] text-red-700 mt-2 leading-relaxed">{pendingInquiries} inquiries are pending. AI Support Assistant has drafted solutions.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Global Logistic Trends</h2>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Volume</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Delays</span>
             </div>
          </div>
        </div>
        <div className="p-8 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }} 
              />
              <Tooltip 
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  fontSize: "12px",
                  padding: "12px"
                }}
              />
              <Bar dataKey="trips" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              <Bar dataKey="delayed" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
