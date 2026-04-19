import React, { useState } from "react";
import { Brain, Sparkles, TrendingUp, AlertCircle, RefreshCw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { geminiService } from "@/services/geminiService";

export default function AIStats() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState([
    { 
      id: "SC-9421", 
      route: "Singapore → Rotterdam", 
      prediction: "4.5h Delay", 
      confidence: 94, 
      reason: "Severe weather patterns in Indian Ocean",
      severity: "medium" as const
    },
    { 
      id: "LA-7723", 
      route: "Los Angeles → Tokyo", 
      prediction: "12h Delay", 
      confidence: 88, 
      reason: "Labor dispute at Long Beach port escalation",
      severity: "high" as const
    },
    { 
      id: "TX-2210", 
      route: "Austin → New York", 
      prediction: "No Delay", 
      confidence: 99, 
      reason: "Route optimization suggests alternate highway paths",
      severity: "low" as const
    },
  ]);

  const handleSimulate = async () => {
    setIsAnalyzing(true);
    try {
      const newPredictions = await Promise.all(predictions.map(async (p) => {
        const result = await geminiService.predictDelay(p.route, p.reason);
        return {
          ...p,
          prediction: result.prediction,
          confidence: result.confidence,
          reason: result.reason,
          severity: result.confidence < 80 ? "high" as const : result.confidence < 95 ? "medium" as const : "low" as const
        };
      }));
      setPredictions(newPredictions);
    } catch (err) {
      console.error("Simulation failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stats = [
    { label: "Prediction Accuracy", value: "98.4%", icon: TrendingUp },
    { label: "Optimal Logic Confidence", value: "92%", icon: Brain },
    { label: "Latency", value: "240ms", icon: RefreshCw },
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            AI Delay Prediction
            <Sparkles className="w-6 h-6 text-blue-600" />
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">Predictive logistics intelligence powered by Gemini AI models.</p>
        </div>
        <button 
          onClick={handleSimulate}
          disabled={isAnalyzing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          Run Global Simulation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Active Risk Analysis</h2>
            <div className="space-y-4">
              {predictions.map((item) => (
                <div key={item.id} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 hover:border-blue-200 transition-all group hover:bg-blue-50/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm",
                        item.severity === "high" ? "bg-red-50 text-red-600" : 
                        item.severity === "medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-blue-600 group-hover:scale-105 transition-transform uppercase font-mono tracking-wider">{item.id}</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{item.route}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-xl font-black",
                        item.severity === "high" ? "text-red-500" : 
                        item.severity === "medium" ? "text-amber-500" : "text-emerald-500"
                      )}>{item.prediction}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{item.confidence}% Confidence</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200/50">
                    <p className="text-sm text-slate-600 italic font-serif leading-relaxed">"{item.reason}"</p>
                  </div>
                  <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 shadow-md">
                      Deploy Optimization Plan
                    </button>
                    <button className="px-4 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:text-slate-800 transition-colors">
                      Historical Data
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute -right-8 -top-8 text-blue-500 opacity-[0.08]">
              <Brain className="w-48 h-48" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 relative">Gemini AI Engine</h2>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-[0.2em] mb-8 relative">Resilience.v4-Engine</p>
            
            <div className="space-y-8 relative">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-slate-400">
                      <s.icon className="w-5 h-5 text-blue-500" />
                      <span className="text-xs font-bold uppercase tracking-widest">{s.label}</span>
                    </div>
                    <span className="text-sm font-black text-white font-mono">{s.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600" 
                      style={{ width: s.value.includes("%") ? s.value : "80%" }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-5 bg-white/5 border border-white/5 rounded-2xl relative backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Suggestion</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic font-serif">
                Currently detecting a 15% increase in volatility across trans-Pacific routes. Recommend shifting 8% of maritime cargo to air freight for priority customers.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xs font-black text-slate-800 mb-6 uppercase tracking-[0.2em] border-b border-slate-100 pb-3">Training Intelligence</h2>
            <div className="space-y-4">
              {[
                { label: "Sensor Feeds", val: "1.2M events/sec" },
                { label: "Historical Records", val: "45PB analyzed" },
                { label: "Weather Sources", val: "24 Global APIs" },
                { label: "Port Status", val: "152 Entry points" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.label}</span>
                  <span className="text-xs font-black text-slate-800 font-mono">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
