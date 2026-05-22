import React from "react";
import { InventoryItem, Supplier } from "../types";
import { Layers, Package, AlertTriangle, Truck, Tag, DollarSign, Search, Plus, ExternalLink, Filter, ChevronLeft, ArrowRight, Box, BarChart3, Activity } from "lucide-react";
import { motion } from "motion/react";

interface InventoryManagementProps {
  inventory: InventoryItem[];
  suppliers: Supplier[];
  onBack: () => void;
}

export default function InventoryManagement({ inventory, suppliers, onBack }: InventoryManagementProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterLowStock, setFilterLowStock] = React.useState(false);

  const filteredItems = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.oemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isLow = item.currentStock <= item.minStockLevel;
    
    return filterLowStock ? (matchesSearch && isLow) : matchesSearch;
  });

  const getSupplierName = (id: string) => {
    return suppliers.find(s => s.id === id)?.name || "Furnizor Extern";
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 px-2">
        <div className="flex items-start gap-4">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white border border-[#E9E9EB] rounded-2xl flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#F2F2F7] transition-all group shrink-0 active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="space-y-3">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F0FE] text-[#034EA2] rounded-full text-xs font-semibold uppercase tracking-normal border border-blue-50"
             >
               <Box className="w-3.5 h-3.5" />
               <span>Logistica Centralizată</span>
             </motion.div>
             <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight leading-none">
               Depozit.
             </h2>
             <p className="text-lg text-[#86868B] font-bold tracking-tight">Monitorizarea digitală a fluxului de piese și consumabile.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <button 
            onClick={() => setFilterLowStock(!filterLowStock)}
            className={`px-4 py-5 rounded-full flex items-center gap-3 text-xs font-semibold uppercase tracking-normal transition-all cursor-pointer shadow-2xl ${
              filterLowStock 
                ? "bg-rose-600 text-white shadow-rose-200" 
                : "bg-white border border-rose-100 text-rose-600 hover:bg-rose-50"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Epuizare Stoc
          </button>
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute left-6 top-6 w-4 h-4 text-[#86868B]" />
            <input 
              type="text"
              placeholder="Cod OEM, Brand sau Denumire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[#E9E9EB] pl-14 pr-6 py-5 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-[#034EA2]/5 transition-all text-[#1D1D1F]"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary Bento (Optional Context) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Piese Active", val: inventory.length, icon: Package, color: "text-[#1D1D1F]" },
          { label: "Stoc Critic", val: inventory.filter(i => i.currentStock <= i.minStockLevel).length, icon: AlertTriangle, color: "text-rose-600" },
          { label: "Valoare Inventar", val: "€24.8k", icon: BarChart3, color: "text-[#034EA2]" },
          { label: "Rotație Stoc", val: "14.2 zile", icon: Activity, color: "text-emerald-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-[#E9E9EB] shadow-sm space-y-4">
             <div className="flex justify-between items-start">
               <div className={`p-4 rounded-2xl bg-[#F2F2F7] ${stat.color}`}>
                 <stat.icon className="w-5 h-5" />
               </div>
               <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-40">Statistici</span>
             </div>
             <div className="space-y-1">
               <p className="text-xl font-bold text-[#1D1D1F] tracking-tighter">{stat.val}</p>
               <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => {
          const isLow = item.currentStock <= item.minStockLevel;
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white rounded-2xl p-6 border transition-all hover:shadow-2xl group relative overflow-hidden ${
                isLow ? "border-rose-100/50 shadow-2xl shadow-rose-50" : "border-[#E9E9EB] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)]"
              }`}
            >
              <div className="flex justify-between items-start mb-10">
                <div className={`w-20 h-24 rounded-2xl flex flex-col items-center justify-center border shadow-sm transition-all duration-500 group-hover:scale-105 ${
                  isLow ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-[#F2F2F7] border-[#E9E9EB] text-[#1D1D1F]"
                }`}>
                  <p className="text-xs font-semibold uppercase leading-none mb-2">{isLow ? "CRITIC" : "UNIT"}</p>
                  <p className="text-xl font-bold leading-none">{item.currentStock}</p>
                </div>
                <div className="text-right space-y-4">
                  <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-normal ${
                    isLow ? "bg-rose-600 text-white shadow-xl shadow-rose-200" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}>
                    {isLow ? "Reaprovizionare" : "Disponibil"}
                  </span>
                  <div className="pt-2">
                    <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-40">Cod Intern</p>
                    <p className="text-xs font-bold text-[#1D1D1F]">{item.id.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight leading-tight group-hover:text-[#034EA2] transition-colors">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-3">
                     <p className="text-sm font-bold text-[#86868B] uppercase tracking-normal">{item.brand}</p>
                     <span className="w-1.5 h-1.5 bg-[#86868B]/30 rounded-full"></span>
                     <p className="text-sm font-bold text-[#034EA2]">{item.oemCode}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#F2F2F7]">
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-50">Preț Vânzare</p>
                      <p className="text-xl font-bold text-[#1D1D1F]">{item.sellPrice.toLocaleString()}<span className="text-xs ml-1 opacity-40">MDL</span></p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-50">Furnizor</p>
                      <p className="text-sm font-bold text-[#1D1D1F] truncate">{getSupplierName(item.supplierId)}</p>
                   </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                 <button className="flex-1 bg-[#1D1D1F] text-white font-bold text-xs py-6 rounded-xl uppercase tracking-normal hover:bg-[#034EA2] transition-all shadow-xl active:scale-95">
                    Modifică Fișă
                 </button>
                 <button className="w-12 h-12 bg-[#F2F2F7] text-[#1D1D1F] rounded-xl flex items-center justify-center hover:bg-[#034EA2] hover:text-white transition-all shadow-sm group/btn shrink-0">
                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-4 text-center space-y-6">
           <div className="w-12 h-12 bg-[#F2F2F7] rounded-2xl flex items-center justify-center mx-auto text-[#86868B] border border-[#E9E9EB]">
              <Package className="w-10 h-10" />
           </div>
           <p className="text-lg font-bold text-[#86868B] tracking-tight">Căutare fără rezultate în inventarul curent.</p>
        </div>
      )}
    </div>
  );
}
