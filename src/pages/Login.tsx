import React, { useState } from "react";
import { Truck, Shield, Mail, Lock, ArrowRight, Github } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await login();
      navigate("/");
    } catch (error: any) {
      if (error?.code === "auth/popup-closed-by-user") {
        console.warn("Sign-in popup was closed before completion.");
        return;
      }
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-md relative">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-6 group cursor-pointer hover:rotate-6 transition-transform">
            <Truck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tighter mb-2">ResiliChain</h1>
          <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase">Global Logistics Intelligence</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-2xl shadow-slate-200 relative ring-1 ring-slate-100">
          <div className="flex border-b border-slate-100 mb-10">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all relative ${isLogin ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sign In
              {isLogin && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all relative ${!isLogin ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Onboard
              {!isLogin && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
            </button>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="name@corporation.com" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
                  {isLogin && <button className="text-[10px] font-bold text-blue-600 hover:underline transition-all">Reset Access?</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 group active:scale-[0.98]">
              {isLogin ? 'Authenticate Session' : 'Register Organization'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-5 text-[10px] bg-white text-slate-300 font-black uppercase tracking-widest">Identity Sync</span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <button className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-xs font-bold text-slate-600 shadow-sm">
                <Github className="w-4 h-4" />
                GitHub
              </button>
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-xs font-bold text-slate-600 shadow-sm"
              >
                <div className="w-4 h-4 bg-blue-600 rounded-full" />
                Google
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-10 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-600" />
            <span className="text-[9px] font-black tracking-widest uppercase text-slate-600">Enterprise Standard</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <span className="text-[9px] font-black tracking-widest uppercase text-slate-600">v4.0.2-Stable</span>
        </div>
      </div>
    </div>
  );
}
