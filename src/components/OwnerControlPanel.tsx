import { Shield, Database, Users, ArrowRight, ChevronLeft, LayoutDashboard, Activity, Terminal, Zap, Globe, Lock } from "lucide-react";
import { motion } from "motion/react";

interface OwnerControlPanelProps {
  setActiveView: (view: "landing" | "client" | "admin" | "schema" | "control-panel") => void;
  onNotify: (message: string, type: "success" | "info") => void;
  onBack: () => void;
}

export default function OwnerControlPanel({ setActiveView, onNotify, onBack }: OwnerControlPanelProps) {
  const menuItems = [
    {
      title: "Consolă Clienți",
      description: "Interfața publică de rezervări, profilurile utilizatorilor și experiența digitală a clientului.",
      icon: Users,
      tag: "FRONT-END ARCHITECTURE",
      action: () => setActiveView("client"),
      accent: "text-blue-500",
      bg: "bg-blue-500/5",
      border: "border-blue-500/10"
    },
    {
      title: "Administrare ERP",
      description: "Centru operațional complet: Personal, Fluxuri Service și Managementul Inventarului.",
      icon: LayoutDashboard,
      tag: "BUSINESS ENGINE",
      action: () => setActiveView("admin"),
      accent: "text-emerald-500",
      bg: "bg-emerald-500/5",
      border: "border-emerald-500/10"
    },
    {
      title: "Arhitectură Date",
      description: "Managementul structurilor de date, validarea schemelor și integritatea sistemului de stocare.",
      icon: Database,
      tag: "CORE SYSTEM INFRA",
      action: () => setActiveView("schema"),
      accent: "text-[#1D1D1F]",
      bg: "bg-[#1D1D1F]/5",
      border: "border-[#1D1D1F]/10"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans">
      {/* 1. PREMIUM NAVIGATION BAR */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-3xl border-b border-[#E9E9EB]">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="group w-10 h-10 bg-[#F2F2F7] hover:bg-[#1D1D1F] rounded-2xl flex items-center justify-center transition-all duration-500"
            >
              <ChevronLeft className="w-6 h-6 text-[#86868B] group-hover:text-white group-hover:-translate-x-1 transition-all" />
            </button>
            <div className="h-10 w-[1px] bg-[#E9E9EB]"></div>
            <div className="space-y-0.5">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1D1D1F] rounded-lg flex items-center justify-center shadow-lg">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-[#1D1D1F] tracking-tighter uppercase font-sans">Sistem Control.</h1>
               </div>
               <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal translate-x-11">AutoBOX Evolution v8.0</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 bg-[#F2F2F7] px-6 py-3 rounded-full border border-[#E9E9EB]">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
              <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-normal">Server Status: Optimal</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 py-6 space-y-32">
        {/* 2. HERO SECTION */}
        <header className="relative py-5 text-center space-y-6">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-4 px-4 py-3 bg-white rounded-full text-xs font-bold text-[#1D1D1F] uppercase tracking-normal shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-white/50"
           >
             <Terminal className="w-4 h-4 text-[#034EA2]" />
             Acces Securizat Administrator
           </motion.div>

           <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight leading-none"
              >
                Comandă <br/> Centrală<span className="text-[#034EA2]">.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-2xl md:text-2xl text-[#86868B] font-bold tracking-tight max-w-5xl mx-auto leading-tight"
              >
                Infrastructură digitală integrată pentru operarea <br className="hidden md:block" /> platformei de management auto la scară globală.
              </motion.p>
           </div>
        </header>

        {/* 3. MENU ARCHITECTURE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
              onClick={item.action}
              className="group relative flex flex-col items-start p-4 rounded-3xl bg-white border border-[#E9E9EB] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.04)] hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-4 transition-all duration-700 space-y-4 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.02),transparent_60%)] group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className={`p-4 rounded-2xl ${item.bg} ${item.border} ${item.accent} group-hover:scale-110 transition-all duration-700`}>
                <item.icon className="w-12 h-12" strokeWidth={2.5} />
              </div>
              
              <div className="space-y-6 relative z-10 w-full">
                <div className="space-y-2">
                   <p className={`text-xs font-semibold uppercase tracking-normal ${item.accent} opacity-60`}>{item.tag}</p>
                   <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tighter">{item.title}</h3>
                </div>
                <p className="text-lg text-[#86868B] font-bold leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-10 w-full border-t border-[#F2F2F7] flex items-center justify-between group-hover:text-[#034EA2] transition-all duration-500">
                <span className="text-xs font-semibold uppercase tracking-normal">Inițiază Modul</span>
                <div className="w-12 h-12 rounded-full bg-[#F2F2F7] group-hover:bg-[#034EA2] group-hover:text-white flex items-center justify-center transition-all duration-500">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* 4. SYSTEM TELEMETRY (Owner Dashboard Stats) */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="bg-[#1D1D1F] rounded-3xl p-10 text-white relative overflow-hidden border border-white/5"
        >
          <div className="absolute top-0 right-0 w-[800px] h-full bg-[radial-gradient(circle_at_top_right,rgba(3,78,162,0.15),transparent_70%)] pointer-events-none"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-400">
                <Zap className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase tracking-normal">Latency</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-4xl lg:text-5xl font-bold tracking-tighter italic font-sans">0.4ms</h4>
                <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Global response</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-emerald-400">
                <Globe className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase tracking-normal">Database</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-4xl lg:text-5xl font-bold tracking-tighter font-sans uppercase">Sync</h4>
                <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Integritate 100%</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-amber-400">
                <Lock className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase tracking-normal">Security</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-4xl lg:text-5xl font-bold tracking-tighter font-sans uppercase">AES</h4>
                <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Encrypted flow</p>
              </div>
            </div>

            <div className="flex items-center justify-end">
               <button className="px-5 py-6 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-xs font-semibold uppercase tracking-normal transition-all active:scale-95 group">
                  <span className="group-hover:text-blue-400 transition-colors">Server Logs</span>
               </button>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="max-w-[1600px] mx-auto px-4 pb-32">
        <div className="py-4 border-t border-[#E9E9EB] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h5 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-normal">AutoBOX Evolution Engine</h5>
            <p className="text-sm font-bold text-[#86868B]">Architecture designed for high-performance automotive business.</p>
          </div>
          <div className="flex gap-4">
            <span className="w-3 h-3 rounded-full bg-[#1D1D1F]"></span>
            <span className="w-3 h-3 rounded-full bg-[#034EA2]"></span>
            <span className="w-3 h-3 rounded-full bg-[#86868B]"></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
