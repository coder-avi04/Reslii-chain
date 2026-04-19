import React, { useState, useEffect } from "react";
import { 
  Shield, 
  MessageSquare, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Mail,
  Send,
  Loader2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { geminiService } from "@/services/geminiService";
import { updateDoc, doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Support() {
  const { inquiries, shipments } = useApp();
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [aiDraft, setAiDraft] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Seed mock data if empty
  useEffect(() => {
    if (inquiries.length === 0) {
      const seedData = async () => {
        const inquiriesRef = collection(db, "inquiries");
        await addDoc(inquiriesRef, {
          customerName: "Alice Zhang",
          email: "alice@techflow.com",
          subject: "Shipment Delay Query: SC-9421",
          message: "My shipment SC-9421 seems to be stuck in Singapore. Can you confirm the new ETA?",
          status: "Open",
          timestamp: new Date().toISOString(),
          shipmentId: "SC-9421"
        });
        await addDoc(inquiriesRef, {
          customerName: "Bob Miller",
          email: "bob@logisticsplus.com",
          subject: "Damaged Package Report",
          message: "Received package yesterday but the exterior was crushed. Need to file a claim.",
          status: "Pending",
          timestamp: new Date(Date.now() - 3600000).toISOString()
        });
      };
      seedData();
    }
  }, [inquiries.length]);

  const handleGenerateAiReply = async () => {
    if (!selectedInquiry) return;
    setIsGenerating(true);
    try {
      const shipment = shipments.find(s => s.id === selectedInquiry.shipmentId);
      const statusText = shipment ? `Status: ${shipment.status}, ETA: ${shipment.eta}` : "No specific shipment data found.";
      const reply = await geminiService.generateSupportReply(
        selectedInquiry.customerName,
        selectedInquiry.message,
        statusText
      );
      setAiDraft(reply);
    } catch (err) {
      console.error("AI Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !aiDraft) return;
    setIsSending(true);
    try {
      // Simulate sending email via API
      await fetch("/api/send-support-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedInquiry.email,
          subject: `RE: ${selectedInquiry.subject}`,
          body: aiDraft
        })
      });

      // Update inquiry status
      const inquiryRef = doc(db, "inquiries", selectedInquiry.id);
      await updateDoc(inquiryRef, { status: "Resolved" });
      
      setSelectedInquiry(null);
      setAiDraft("");
      alert("AI Reply sent successfully via ResiliChain Automated Mailer.");
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  const filtered = inquiries.filter(i => 
    i.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 h-full flex flex-col gap-8">
      <div className="flex items-end justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            Support Intelligence
            <Shield className="w-6 h-6 text-blue-600" />
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">Automated customer success and inquiry management.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            AI AUTO-REPLY ACTIVE
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inquiries List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search inquiries..." 
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filtered.map((inquiry) => (
              <button 
                key={inquiry.id}
                onClick={() => {
                  setSelectedInquiry(inquiry);
                  setAiDraft("");
                }}
                className={cn(
                  "w-full p-6 text-left hover:bg-slate-50 transition-all flex flex-col gap-3 group relative",
                  selectedInquiry?.id === inquiry.id && "bg-blue-50/50 border-l-4 border-blue-600"
                )}
              >
                <div className="flex justify-between items-start">
                   <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest uppercase mb-1">{inquiry.status}</div>
                   <div className="text-[10px] text-slate-400 font-mono">{new Date(inquiry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800 line-clamp-1">{inquiry.subject}</div>
                  <div className="text-xs text-slate-500 mt-1">{inquiry.customerName}</div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    inquiry.status === "Open" ? "bg-red-500" : inquiry.status === "Pending" ? "bg-amber-500" : "bg-emerald-500"
                  )} />
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{inquiry.email}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-2 flex flex-col gap-8 min-h-0">
          {selectedInquiry ? (
            <div className="flex-1 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400 text-lg">
                    {selectedInquiry.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{selectedInquiry.customerName}</h3>
                    <p className="text-xs text-slate-400 font-medium">{selectedInquiry.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Original Message</div>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 mb-3">{selectedInquiry.subject}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed italic font-serif italic">"{selectedInquiry.message}"</p>
                  </div>
                </div>

                {aiDraft && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        AI Generated Optimized Draft
                      </div>
                      <button 
                        onClick={() => setAiDraft("")}
                        className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest"
                      >
                        Discard
                      </button>
                    </div>
                    <textarea 
                      className="w-full bg-blue-50/30 border border-blue-100 rounded-2xl p-6 text-sm text-slate-700 leading-relaxed font-serif outline-none focus:ring-4 focus:ring-blue-500/5 min-h-[200px]"
                      value={aiDraft}
                      onChange={(e) => setAiDraft(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold italic">
                  <Clock className="w-3 h-3" />
                  Received {new Date(selectedInquiry.timestamp).toLocaleString()}
                </div>
                <div className="flex gap-4">
                  {!aiDraft ? (
                    <button 
                      onClick={handleGenerateAiReply}
                      disabled={isGenerating}
                      className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-900/10"
                    >
                      {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin text-blue-400" /> : <Sparkles className="w-4 h-4 text-blue-400" />}
                      Generate AI Intelligence Reply
                    </button>
                  ) : (
                    <button 
                      onClick={handleSendReply}
                      disabled={isSending}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-blue-600/20"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Automate Support Dispatch
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white border border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center p-12 text-center opacity-40">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No Inquiry Selected</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-xs">Select a customer inquiry from the left panel to begin AI-powered resolution.</p>
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-6 shrink-0">
             {[
               { label: "Avg Resolution Time", value: "14.2 min", icon: CheckCircle, color: "text-emerald-500" },
               { label: "AI Satisfaction Score", value: "4.9/5", icon: Sparkles, color: "text-blue-500" },
               { label: "Pending Tickets", value: inquiries.filter(i => i.status !== "Resolved").length, icon: AlertCircle, color: "text-amber-500" },
             ].map((m) => (
               <div key={m.label} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                 <div className="flex items-center gap-3 mb-3">
                   <m.icon className={cn("w-4 h-4", m.color)} />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
                 </div>
                 <div className="text-xl font-black text-slate-800">{m.value}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
