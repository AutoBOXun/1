import React, { useState } from "react";
import { ServiceType } from "../types";
import { 
  ArrowLeft, Search, Clock, DollarSign, ShieldCheck, 
  Zap, Wrench, Settings, Car, Activity, Palette, Wind, ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface ServicesCatalogProps {
  services: ServiceType[];
  onBack: () => void;
}

export default function ServicesCatalog({ services, onBack }: ServicesCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = Array.from(new Set(services.map(s => s.category)));

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Mecanică": return <Wrench className="w-5 h-5" />;
      case "Electrică": return <Zap className="w-5 h-5" />;
      case "Diagnoză": return <Search className="w-5 h-5" />;
      case "Revizie": return <Settings className="w-5 h-5" />;
      case "Climatizare": return <Wind className="w-5 h-5" />;
      case "Frâne": return <Activity className="w-5 h-5" />;
      case "Direcție": return <Car className="w-5 h-5" />;
      case "Vopsitorie": return <Palette className="w-5 h-5" />;
      default: return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-24 font-sans">
      {/* Premium Header */}
      <div className="bg-white border-b border-[#E9E9EB] sticky top-0 z-50 shadow-sm backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="p-4 bg-[#F2F2F7] rounded-2xl text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E9E9EB] transition-all cursor-pointer group"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="h-10 w-[1px] bg-[#E9E9EB]"></div>
            <div>
              <h1 className="text-lg font-bold text-[#1D1D1F] tracking-tighter uppercase sm:block hidden">CATALOG SERVICII</h1>
              <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal -mt-1 opacity-60 sm:block hidden">Transparență Totală • AutoBOX</p>
            </div>
          </div>
          
          <div className="relative w-64 md:w-96">
            <Search className="w-4 h-4 absolute left-5 top-5 text-[#86868B]" />
            <input 
              type="text"
              placeholder="Caută în catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F2F2F7] border border-transparent focus:border-[#034EA2]/20 py-4 pl-12 pr-6 rounded-2xl text-xs font-bold tracking-tight focus:ring-4 focus:ring-[#034EA2]/5 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 space-y-6">
        {/* Intro - Hero style */}
        <div className="space-y-4 text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-[#E8F0FE] text-[#034EA2] rounded-full text-xs font-semibold uppercase tracking-normal border border-blue-100"
          >
            <span>INGINERIE DEFINITĂ DE PRECIZIE</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-[-0.05em] leading-[0.9]">
            Performanță <br/>
            <span className="text-[#034EA2]">Certificată.</span>
          </h2>
          <p className="text-[#86868B] text-lg md:text-xl font-bold leading-relaxed max-w-2xl mx-auto tracking-tight">
            Explorați catalogul nostru complet de operațiuni tehnice. Prețuri transparente și execuție la standarde europene.
          </p>
        </div>

        {/* Grouped Services */}
        {categories.map(cat => {
          const catServices = filteredServices.filter(s => s.category === cat);
          if (catServices.length === 0) return null;

          return (
            <motion.section 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              key={cat} 
              className="space-y-5"
            >
              <div className="flex items-center gap-6 border-b border-[#E9E9EB] pb-8">
                <div className="w-12 h-12 bg-[#034EA2] text-white rounded-xl flex items-center justify-center shadow-xl shadow-blue-100">
                  {getCategoryIcon(cat)}
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-[#1D1D1F] tracking-tight">{cat}</h3>
                  <p className="text-xs uppercase tracking-normal font-bold text-[#86868B] opacity-60">{catServices.length} Operațiuni active</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catServices.map((service, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    key={service.id}
                    className="bg-white rounded-2xl p-6 border border-[#E9E9EB] hover:border-[#034EA2]/30 transition-all hover:shadow-2xl hover:-translate-y-2 group cursor-default"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="bg-[#F2F2F7] text-[#034EA2] text-xs font-semibold uppercase tracking-normal px-4 py-2 rounded-full border border-blue-50/50">
                          ID: {service.id.toUpperCase()}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xl font-bold text-[#1D1D1F] leading-[1.1] tracking-tight group-hover:text-[#034EA2] transition-colors">
                          {service.name}
                        </h4>
                        <p className="text-sm text-[#86868B] font-bold leading-relaxed line-clamp-3 opacity-80">
                          {service.description}
                        </p>
                      </div>

                      <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                               <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-50">Timp Estimat</p>
                               <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-[#1D1D1F]" />
                                  <span className="text-sm font-bold text-[#1D1D1F]">{service.estimatedDuration} min.</span>
                               </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-50">Preț Standard</p>
                                <p className="text-xl font-bold text-[#034EA2] tracking-tighter leading-none">{service.estimatedPrice} <span className="text-sm">MDL</span></p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-[#F2F2F7] flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-normal leading-none">
                                {service.warrantyMonths || 12} Luni Garanție
                              </span>
                           </div>
                           <button className="w-12 h-12 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center hover:bg-[#034EA2] transition-colors shadow-lg active:scale-95 group/btn">
                              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}

        {filteredServices.length === 0 && (
          <div className="py-5 text-center space-y-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto border border-[#E9E9EB]">
              <Search className="w-6 h-6 text-[#86868B]" />
            </div>
            <p className="text-[#86868B] font-bold">Nu am găsit servicii care să corespundă căutării.</p>
          </div>
        )}
      </div>
    </div>
  );
}
