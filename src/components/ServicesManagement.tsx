import React from "react";
import { ServiceType } from "../types";
import { Wrench, Clock, CreditCard, ChevronRight, Search, Plus, Filter, ArrowLeft, Layers, ArrowRight, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

interface ServicesManagementProps {
  serviceTypes: ServiceType[];
  onBack: () => void;
}

export default function ServicesManagement({ serviceTypes, onBack }: ServicesManagementProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredServices = serviceTypes.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 bg-white border border-[#E9E9EB] rounded-2xl text-[#86868B] hover:text-[#1D1D1F] transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tighter flex items-center gap-4">
              <div className="w-10 h-10 bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl flex items-center justify-center shadow-sm">
                <Layers className="w-5 h-5 text-[#034EA2]" />
              </div>
              Catalog Operațiuni
            </h2>
            <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal">
              Sincronizare tarife și timpi tehnologici workshop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#86868B]" />
            <input 
              type="text"
              placeholder="Filtrare rapidă operațiuni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F2F2F7] border border-[#E9E9EB] pl-10 pr-4 py-3 rounded-2xl text-xs font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-[#034EA2]/10 transition-all text-[#1D1D1F]"
            />
          </div>
          <button className="bg-[#034EA2] text-white p-3 rounded-2xl shadow-xl shadow-sm hover:bg-[#1D1D1F] transition-all cursor-pointer group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E9E9EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F2F2F7]">
                <th className="px-6 py-4 text-left text-xs uppercase font-semibold text-[#86868B] tracking-normal border-b border-[#F2F2F7]">Operațiune / Descriere tehnică</th>
                <th className="px-6 py-4 text-left text-xs uppercase font-semibold text-[#86868B] tracking-normal border-b border-[#F2F2F7]">Sistem Autovehicul</th>
                <th className="px-6 py-4 text-left text-xs uppercase font-semibold text-[#86868B] tracking-normal border-b border-[#F2F2F7]">Normativ (min)</th>
                <th className="px-6 py-4 text-right text-xs uppercase font-semibold text-[#86868B] tracking-normal border-b border-[#F2F2F7]">Tarif Bază</th>
                <th className="px-6 py-4 text-center text-xs uppercase font-semibold text-[#86868B] tracking-normal border-b border-[#F2F2F7]">Opțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredServices.map((service, idx) => (
                <motion.tr 
                  key={service.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-[#F2F2F7] transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-[#F2F2F7] rounded-xl flex items-center justify-center text-[#86868B] group-hover:bg-[#E8F0FE] group-hover:text-[#034EA2] transition-colors border border-[#E9E9EB]">
                          <Wrench className="w-5 h-5" />
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#034EA2] transition-colors leading-tight">{service.name}</p>
                          <p className="text-xs text-[#86868B] font-bold tracking-tight line-clamp-1">{service.description}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-[#E8F0FE] text-[#034EA2] px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-normal border border-indigo-100/50">
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[#86868B]">
                      <Clock className="w-3.5 h-3.5 opacity-50" />
                      <span className="text-xs font-bold font-mono tracking-tighter">{service.estimatedDuration} <span className="opacity-40">MIN</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 text-[#1D1D1F] font-bold">
                      <span className="text-sm tracking-tight font-mono">{service.estimatedPrice.toLocaleString()}</span>
                      <span className="text-xs text-[#86868B] uppercase">mdl</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2.5 bg-[#F2F2F7] text-[#86868B] rounded-xl hover:bg-[#1D1D1F] hover:text-white transition-all cursor-pointer border border-[#E9E9EB]">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredServices.length === 0 && (
          <div className="py-5 text-center space-y-3">
             <div className="w-12 h-12 bg-[#F2F2F7] rounded-full flex items-center justify-center mx-auto border border-dashed border-[#E9E9EB]">
                <Search className="w-6 h-6 text-[#86868B]" />
             </div>
             <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal italic">Nicio operațiune găsită conform criteriilor</p>
          </div>
        )}
      </div>
    </div>
  );
}
