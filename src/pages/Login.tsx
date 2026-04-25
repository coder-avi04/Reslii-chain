import React, { useState } from "react";
import { Truck, Shield, Mail, Lock, ArrowRight, Github } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const { login, loginWithCredentials } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);
    try {
      await loginWithCredentials(email, password);
      navigate("/");
    } catch (error: any) {
      console.error("Form Login Error:", error);
      setErrorStatus(error.message || "Authentication failed. Check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    setErrorStatus(null);
    try {
      await login();
      navigate("/");
    } catch (error: any) {
      if (error?.code === "auth/popup-closed-by-user") {
        return;
      }
      console.error("Login failed:", error);
      setErrorStatus(error.message || "Social authentication failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/5 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-md relative">
        {errorStatus && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <Shield className="w-4 h-4 shrink-0" />
            <p>{errorStatus}</p>
          </div>
        )}
        
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

          <form className="space-y-8" onSubmit={handleFormLogin}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 group active:scale-[0.98]"
            >
              {isLogin ? 'Authenticate Session' : 'Register Organization'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="pt-2 text-center">
              <p className="text-[10px] text-slate-400 font-medium">
                Demo Access: <span className="text-blue-500">admin / admin</span>
              </p>
            </div>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative px-5 text-[10px] bg-white text-slate-300 font-black uppercase tracking-widest">Identity Provider</span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <button 
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-bold text-slate-600 shadow-sm col-span-2"
              >
                <div className="w-4 h-4 rounded-full border-2 border-red-500 border-t-blue-500 border-b-yellow-500 border-l-green-500" />
                Sign in with Enterprise Google
              </button>
            </div>
          </div>
        </div>

        {/* Global Access Troubleshooting */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-3 text-[10px] font-black text-blue-500 uppercase tracking-[0.25em]">
             Authentication Debug Registry
          </div>
          <div className="grid grid-cols-1 gap-4">
             <div className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white shadow-xl shadow-slate-200/50">
                <p className="text-slate-800 font-black mb-2 uppercase tracking-wider text-[10px]">Permission Errors?</p>
                <p className="text-slate-500 leading-relaxed font-serif text-[11px]">If your custom organization email is denied, the security perimeter restricts role elevation to whitelisted administrators. <span className="text-blue-600 font-bold">Use the demo key "admin" // "admin"</span> to bypass and access the root dashboard terminal.</p>
             </div>
             <div className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-white shadow-xl shadow-slate-200/50">
                <p className="text-slate-800 font-black mb-2 uppercase tracking-wider text-[10px]">Connectivity Issues?</p>
                <p className="text-slate-500 leading-relaxed font-serif text-[11px]">Global availability requires bidirectional WebSocket handshake. Ensure your firewall permits egress 443 to Firebase edge nodes. If "Syncing" hangs, try an Incognito session.</p>
             </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-10 opacity-40 grayscale">
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
