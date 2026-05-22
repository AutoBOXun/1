import React from "react";
import { User, Vehicle, UserRole } from "../types";
import { getRoleAvatar } from "../utils/avatarUtils";
import { Users, Car, Phone, Mail, ChevronRight, Search, ChevronLeft, ArrowRight, UserPlus, Heart, TrendingUp, History } from "lucide-react";
import { motion } from "motion/react";

interface ClientsManagementProps {
  users: User[];
  vehicles: Vehicle[];
  onBack: () => void;
}

export default function ClientsManagement({ users, vehicles, onBack }: ClientsManagementProps) {
  const clients = users.filter(u => u.role === UserRole.CLIENT);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const getClientVehicles = (clientId: string) => {
    return vehicles.filter(v => v.clientId === clientId);
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
               <Users className="w-3.5 h-3.5" />
               <span>Gestiune Relații Clienți (CRM)</span>
             </motion.div>
             <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight leading-none">
               Clienți.
             </h2>
             <p className="text-lg text-[#86868B] font-bold tracking-tight">Administrarea interacțiunilor și loializarea bazei de date active.</p>
          </div>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-6 top-6 w-4 h-4 text-[#86868B]" />
          <input 
            type="text"
            placeholder="Nume, Telefon sau Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#E9E9EB] pl-14 pr-6 py-5 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-[#034EA2]/5 transition-all text-[#1D1D1F]"
          />
        </div>
      </div>

      {/* CRM Insights Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Clienți", val: clients.length, icon: Users, color: "text-[#1D1D1F]" },
          { label: "Clienți Noi (Lună)", val: "+12", icon: UserPlus, color: "text-[#034EA2]" },
          { label: "Grad Fidelizare", val: "88%", icon: Heart, color: "text-rose-600" },
          { label: "Valoare Media Life", val: "€1.2k", icon: TrendingUp, color: "text-emerald-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-[#E9E9EB] shadow-sm space-y-4">
             <div className="flex justify-between items-start">
               <div className={`p-4 rounded-2xl bg-[#F2F2F7] ${stat.color}`}>
                 <stat.icon className="w-5 h-5" />
               </div>
               <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-40">CRM Data</span>
             </div>
             <div className="space-y-1">
               <p className="text-xl font-bold text-[#1D1D1F] tracking-tighter">{stat.val}</p>
               <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client, idx) => {
          const clientVehicles = getClientVehicles(client.id);
          return (
            <motion.div 
              key={client.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white rounded-2xl p-6 border border-[#E9E9EB] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="relative shrink-0">
                  <img 
                    src={client.avatarUrl || getRoleAvatar(client.role)} 
                    alt={client.name}
                    className="w-12 h-12 rounded-2xl object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 border-4 border-white rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#034EA2] transition-colors uppercase leading-none">{client.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#E8F0FE] text-[#034EA2] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-normal border border-blue-50">Account Partner</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-4 text-xs font-bold text-[#86868B]">
                     <div className="w-10 h-10 rounded-2xl bg-[#F2F2F7] flex items-center justify-center text-[#1D1D1F]">
                        <Phone className="w-4 h-4" />
                     </div>
                     {client.phone}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-[#86868B]">
                     <div className="w-10 h-10 rounded-2xl bg-[#F2F2F7] flex items-center justify-center text-[#1D1D1F]">
                        <Mail className="w-4 h-4" />
                     </div>
                     {client.email}
                  </div>
                </div>

                <div className="pt-8 border-t border-[#F2F2F7] space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Garaj Proprietăți</p>
                    <span className="text-xs font-bold text-[#1D1D1F] bg-[#F2F2F7] px-3 py-1 rounded-lg">{clientVehicles.length} UNIT</span>
                  </div>

                  <div className="space-y-3">
                    {clientVehicles.length > 0 ? (
                      clientVehicles.map(veh => (
                        <div key={veh.id} className="bg-[#F2F2F7]/50 p-4 rounded-xl border border-transparent hover:border-[#E8F0FE] hover:bg-white transition-all flex items-center justify-between group/veh">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-[#E9E9EB]">
                               <Car className="w-4 h-4 text-[#034EA2]" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-[#1D1D1F] uppercase tracking-tight">{veh.brand} {veh.model}</p>
                               <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">{veh.licensePlate}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#86868B] group-hover/veh:translate-x-1 transition-transform" />
                        </div>
                      ))
                    ) : (
                      <div className="p-6 bg-[#F2F2F7]/30 rounded-2xl border border-dashed border-[#E9E9EB] text-center">
                         <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-60 font-mono">Fără vehicule active</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                 <button className="flex-1 bg-[#1D1D1F] text-white font-bold text-xs py-6 rounded-xl uppercase tracking-normal hover:bg-[#034EA2] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                    <History className="w-4 h-4" /> Istoric Tranzacții
                 </button>
                 <button className="w-12 h-12 bg-[#F2F2F7] text-[#1D1D1F] rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-sm group/btn shrink-0">
                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="py-4 text-center space-y-6">
           <div className="w-12 h-12 bg-[#F2F2F7] rounded-2xl flex items-center justify-center mx-auto text-[#86868B] border border-[#E9E9EB]">
              <Users className="w-10 h-10" />
           </div>
           <p className="text-lg font-bold text-[#86868B] tracking-tight">Niciun client găsit în baza de date CRM.</p>
        </div>
      )}
    </div>
  );
}
