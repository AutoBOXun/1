import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, X, Send, Sparkles, Bot, User as UserIcon, 
  Calendar, Clock, CheckCircle2, AlertCircle, Loader2, ArrowRight
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatBotProps {
  userId?: string;
  onBookAppointment?: (data: any) => void;
}

const AIChatBot: React.FC<AIChatBotProps> = ({ userId, onBookAppointment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Salut! Sunt AutoBOX Assistant. Cum te pot ajuta astăzi cu programarea mașinii tale în Ungheni?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setAppointmentData(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: errorData.content || "Limita de mesaje a fost atinsă. Vă rugăm să reveniți peste un minut." 
          }]);
          return;
        }
        throw new Error(errorData.error || "Eroare la comunicarea cu AI");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
      
      if (data.appointmentData) {
        setAppointmentData(data.appointmentData);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Ne pare rău, a intervenit o eroare tehnică. Vă rugăm să încercați din nou sau să ne contactați telefonic." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmAppointment = () => {
    if (onBookAppointment && appointmentData) {
      onBookAppointment(appointmentData.data);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Perfect! Am preluat datele pentru programare. Te rog să confirmi detaliile în fereastra de rezervare care tocmai s-a deschis." 
      }]);
      setAppointmentData(null);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#034EA2] text-white rounded-full shadow-2xl flex items-center justify-center z-50 group cursor-pointer"
        id="ai-bot-toggle"
      >
        <MessageSquare className="w-8 h-8 group-hover:hidden" />
        <Sparkles className="w-8 h-8 hidden group-hover:block animate-pulse" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[420px] max-w-[calc(100vw-48px)] h-[650px] max-h-[calc(100vh-120px)] bg-[#F2F2F7]/95 backdrop-blur-3xl rounded-2xl shadow-[0_32px_128px_-32px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-white/40 z-50"
          >
            {/* Header */}
            <div className="px-4 py-7 bg-white/40 backdrop-blur-md border-b border-black/[0.03] flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#034EA2] text-white rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-200">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1D1D1F] tracking-tight">AutoBOX Support</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                    <span className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Agent Virtual Inteligent</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex border border-black/5 items-center justify-center bg-white rounded-full hover:bg-[#F2F2F7] active:scale-90 transition-all cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5 text-[#1D1D1F]" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-4 max-w-[88%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {!m.role.includes("user") && (
                       <div className="w-10 h-10 rounded-[18px] bg-white shadow-sm flex-shrink-0 flex items-center justify-center border border-black/[0.03]">
                        <Bot className="w-5 h-5 text-[#034EA2]" />
                      </div>
                    )}
                    <div className={`p-5 rounded-2xl text-base font-bold leading-relaxed shadow-sm ${
                      m.role === "user" 
                        ? "bg-[#034EA2] text-white rounded-tr-[4px] shadow-blue-100" 
                        : "bg-white text-[#1D1D1F] rounded-tl-[4px] border border-black/[0.02]"
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-[18px] bg-white shadow-sm flex items-center justify-center border border-black/[0.03]">
                      <Bot className="w-5 h-5 text-[#034EA2]" />
                    </div>
                    <div className="bg-white/80 p-4 rounded-xl rounded-tl-[4px] border border-black/[0.02] shadow-sm flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 bg-[#034EA2] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#034EA2] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#034EA2] rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Appointment UI */}
              {appointmentData && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-white p-4 rounded-2xl shadow-2xl border border-blue-50 space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E8F0FE] text-[#034EA2] rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 fill-[#034EA2]" />
                    </div>
                    <h4 className="font-bold text-sm uppercase tracking-normal text-[#1D1D1F]">Rezumat Programare</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#F2F2F7] p-5 rounded-xl space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Data</p>
                      <p className="text-sm font-bold text-[#1D1D1F]">{appointmentData.data.date}</p>
                    </div>
                    <div className="bg-[#F2F2F7] p-5 rounded-xl space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Ora Slot</p>
                      <p className="text-sm font-bold text-[#1D1D1F]">{appointmentData.data.time}</p>
                    </div>
                  </div>

                  <div className="bg-[#F2F2F7] p-5 rounded-xl flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <p className="text-xs font-bold text-[#1D1D1F] leading-tight">
                      {appointmentData.data.notes || "Solicitare tehnică pregătită"}
                    </p>
                  </div>

                  <button 
                    onClick={handleConfirmAppointment}
                    className="w-full bg-[#034EA2] text-white py-5 rounded-full font-bold text-xs uppercase tracking-normal hover:shadow-xl hover:shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer"
                  >
                    Confirmă acum <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/40 backdrop-blur-md border-t border-black/[0.03]">
              <form onSubmit={handleSend} className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Scrie mesajul tău aici..."
                  disabled={isLoading}
                  className="w-full bg-white border border-black/[0.05] rounded-2xl py-5 pl-8 pr-16 text-base font-bold focus:ring-4 focus:ring-[#034EA2]/10 outline-none placeholder:text-[#86868B] transition-all disabled:opacity-50 shadow-sm"
                  id="chat-input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2.5 top-2.5 w-11 h-11 bg-[#034EA2] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-90 transition-all disabled:opacity-30 disabled:scale-100 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <div className="flex items-center justify-center gap-2 mt-6">
                <div className="w-1.5 h-1.5 bg-[#034EA2]/20 rounded-full"></div>
                <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-40">
                  AutoBOX Advanced AI v8.0
                </p>
                <div className="w-1.5 h-1.5 bg-[#034EA2]/20 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;
