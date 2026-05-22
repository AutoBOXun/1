import React, { useState, useMemo } from "react";
import { ServiceJob, JobStatus, Vehicle, User } from "../types";
import { 
  Wrench, Calendar, Plus, Search, ChevronRight, Filter, Car, User as UserIcon, 
  Clock, ArrowRight, CheckCircle2, Activity, PlayCircle, Layers, Kanban, List, 
  AlertTriangle, Cog, MoreHorizontal, MousePointer2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ServiceJobsManagementProps {
  jobs: ServiceJob[];
  vehicles: Vehicle[];
  users: User[];
  onSelectJob: (job: ServiceJob) => void;
  onUpdateStatus: (jobId: string, status: JobStatus) => void;
  onCreateJob: () => void;
}

export default function ServiceJobsManagement({ 
  jobs, 
  vehicles, 
  users, 
  onSelectJob, 
  onUpdateStatus,
  onCreateJob 
}: ServiceJobsManagementProps) {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const vehicle = vehicles.find(v => v.id === job.vehicleId);
      const client = users.find(u => u.id === job.clientId);
      const searchString = `${vehicle?.brand} ${vehicle?.model} ${vehicle?.licensePlate} ${client?.name} ${job.id}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    }).sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
  }, [jobs, vehicles, users, searchTerm]);

  const columns = [
    { id: JobStatus.SCHEDULED, title: "În Recepție / Programate", icon: Calendar, color: "slate" },
    { id: JobStatus.IN_PROGRESS, title: "Diagnostic & Lucru", icon: Wrench, color: "blue" },
    { id: JobStatus.AWAITING_PARTS, title: "Logistică & Piese", icon: Layers, color: "amber" },
    { id: JobStatus.FINISHED, title: "Control Calitate / Finalizat", icon: CheckCircle2, color: "emerald" },
    { id: JobStatus.READY_FOR_DELIVERY, title: "Livrabil / Arhivă", icon: Activity, color: "indigo" }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F2F2F7]/50 rounded-[40px] border border-[#E9E9EB] overflow-hidden shadow-2xl">
      
      {/* Top Controller Bar */}
      <div className="p-8 bg-white border-b border-[#F2F2F7]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#1D1D1F] text-white rounded-[22px] flex items-center justify-center shadow-2xl shadow-black/20">
              <Cog className="w-8 h-8 animate-spin-slow" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-[#1D1D1F] tracking-tighter">Control Integrat Flux.</h2>
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Sistem Live Ungheni • {jobs.length} Fișe Active
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-4 w-full lg:w-auto">
             <div className="flex bg-[#F2F2F7] p-1.5 rounded-[22px] border border-[#E9E9EB]">
                <button 
                  onClick={() => setViewMode("kanban")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    viewMode === "kanban" ? "bg-white text-[#1D1D1F] shadow-xl" : "text-[#86868B] hover:text-[#1D1D1F]"
                  }`}
                >
                  <Kanban className="w-4 h-4" /> Kanban
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    viewMode === "list" ? "bg-white text-[#1D1D1F] shadow-xl" : "text-[#86868B] hover:text-[#1D1D1F]"
                  }`}
                >
                  <List className="w-4 h-4" /> Listă
                </button>
             </div>

             <div className="relative group flex-1 lg:min-w-[320px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B] group-focus-within:text-[#034EA2] transition-colors" />
                <input 
                  placeholder="Caută în universul tehnic..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#F2F2F7] border border-[#E9E9EB] pl-16 pr-8 py-4.5 rounded-[24px] text-xs font-bold text-[#1D1D1F] focus:bg-white focus:outline-none transition-all shadow-inner"
                />
             </div>

             <button 
               onClick={onCreateJob}
               className="w-14 h-14 bg-[#034EA2] text-white rounded-[22px] flex items-center justify-center hover:bg-[#1D1D1F] transition-all shadow-2xl shadow-blue-100 active:scale-90 shrink-0"
             >
               <Plus className="w-7 h-7" strokeWidth={3} />
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "kanban" ? (
            <motion.div 
              key="kanban"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="h-full flex overflow-x-auto p-8 gap-8 no-scrollbar md:pb-12"
            >
              {columns.map((col) => (
                <div key={col.id} className="min-w-[340px] flex flex-col h-full space-y-6">
                   <div className="flex justify-between items-center px-2">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 bg-white border border-[#E9E9EB] rounded-xl text-${col.color}-600 shadow-sm`}>
                            <col.icon className="w-4 h-4" />
                         </div>
                         <h3 className="text-xs font-black text-[#1D1D1F] uppercase tracking-normal">{col.title}</h3>
                      </div>
                      <span className="px-3 py-1 bg-[#1D1D1F] text-white rounded-full text-[10px] font-bold shadow-lg">
                        {filteredJobs.filter(j => j.status === col.id).length}
                      </span>
                   </div>

                   <div className="flex-1 bg-[#F2F2F7] rounded-[32px] p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar border border-white/40 shadow-inner">
                      {filteredJobs.filter(j => j.status === col.id).map((job, idx) => {
                        const vehicle = vehicles.find(v => v.id === job.vehicleId);
                        const client = users.find(u => u.id === job.clientId);
                        const partsCount = job.parts.length;
                        const laborCount = job.labor.length;
                        
                        return (
                          <motion.div
                            key={job.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            layout
                            className="bg-white p-6 rounded-[28px] border border-[#E9E9EB] shadow-sm hover:shadow-2xl hover:border-[#034EA2]/30 transition-all cursor-pointer group active:scale-[0.98]"
                            onClick={() => onSelectJob(job)}
                          >
                             <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <span className="text-[10px] font-black font-mono text-[#034EA2] bg-blue-50 px-2 py-1 rounded-lg">#{job.id.slice(-4).toUpperCase()}</span>
                                  <button onClick={(e) => { e.stopPropagation(); }} className="text-[#86868B] hover:text-[#1D1D1F] p-1">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="space-y-1">
                                   <h4 className="text-sm font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#034EA2] transition-colors">{vehicle?.brand} {vehicle?.model}</h4>
                                   <div className="flex items-center gap-2">
                                      <Car className="w-3 h-3 text-[#86868B]" />
                                      <span className="text-[10px] font-black text-[#86868B] uppercase tracking-normal">{vehicle?.licensePlate}</span>
                                   </div>
                                </div>

                                <div className="h-px bg-[#F2F2F7]"></div>

                                <div className="flex justify-between items-center">
                                   <div className="flex items-center gap-3">
                                      <img src={client?.avatarUrl} className="w-8 h-8 rounded-xl bg-[#F2F2F7] object-cover" alt="" />
                                      <div className="text-[10px] font-bold text-[#1D1D1F] truncate max-w-[120px] uppercase">{client?.name.split(' ')[0]}</div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <div className="flex flex-col items-end">
                                         <span className="text-[9px] font-bold text-[#86868B] uppercase">Complexitate</span>
                                         <div className="flex gap-0.5 mt-1">
                                            {[1,2,3].map(i => (
                                              <div key={i} className={`w-3 h-1 rounded-full ${i <= (laborCount > 5 ? 3 : laborCount > 2 ? 2 : 1) ? `bg-${col.color}-500` : "bg-[#F2F2F7]"}`} />
                                            ))}
                                         </div>
                                      </div>
                                   </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                   <div className="flex items-center gap-1 px-3 py-1.5 bg-[#F2F2F7] rounded-xl text-[9px] font-bold text-[#86868B] uppercase">
                                      <Layers className="w-3 h-3" /> {partsCount} materiale
                                   </div>
                                   <div className="flex items-center gap-1 px-3 py-1.5 bg-[#F2F2F7] rounded-xl text-[9px] font-bold text-[#86868B] uppercase">
                                      <Clock className="w-3 h-3" /> {laborCount} OP.
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                        );
                      })}

                      {filteredJobs.filter(j => j.status === col.id).length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-[#86868B]/30 rounded-[32px] p-8 text-center space-y-4">
                           <MousePointer2 className="w-10 h-10" />
                           <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Nicio lucrare în această etapă</p>
                        </div>
                      )}
                   </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-full overflow-y-auto p-8"
            >
               <div className="bg-white border border-[#E9E9EB] rounded-[32px] overflow-hidden">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-[#1D1D1F] text-white text-[11px] font-bold uppercase tracking-widest">
                           <th className="px-10 py-6">ID Fișă</th>
                           <th className="px-8 py-6">Vehicul / Client</th>
                           <th className="px-8 py-6">Etapă Tehnologică</th>
                           <th className="px-8 py-6">Dată Intrare</th>
                           <th className="px-8 py-6 text-right">Acțiuni</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#F2F2F7]">
                        {filteredJobs.map((job, idx) => {
                          const vehicle = vehicles.find(v => v.id === job.vehicleId);
                          const client = users.find(u => u.id === job.clientId);
                          const col = columns.find(c => c.id === job.status) || columns[0];
                          
                          return (
                            <tr key={job.id} onClick={() => onSelectJob(job)} className="group hover:bg-[#F2F2F7]/50 cursor-pointer transition-colors">
                               <td className="px-10 py-6">
                                  <span className="font-mono font-black text-[#034EA2] text-xs uppercase bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">#{job.id.toUpperCase()}</span>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-[#F2F2F7] rounded-xl flex items-center justify-center text-[#1D1D1F] shadow-sm">
                                        <Car className="w-5 h-5" />
                                     </div>
                                     <div>
                                        <h5 className="text-sm font-black text-[#1D1D1F] tracking-tight group-hover:text-[#034EA2] transition-colors">{vehicle?.brand} {vehicle?.model}</h5>
                                        <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-normal mt-1">{client?.name} • [{vehicle?.licensePlate}]</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-${col.color}-50 text-${col.color}-600 border border-${col.color}-100 text-[10px] font-bold uppercase tracking-normal`}>
                                     <col.icon className="w-3.5 h-3.5" />
                                     {col.title.split(' / ')[0]}
                                  </div>
                               </td>
                               <td className="px-8 py-6 text-[11px] font-bold text-[#86868B] uppercase tracking-normal">
                                  {job.entryDate}
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <button className="p-3 bg-[#F2F2F7] text-[#1D1D1F] rounded-xl hover:bg-[#1D1D1F] hover:text-white transition-all active:scale-95">
                                     <ArrowRight className="w-4 h-4" />
                                  </button>
                               </td>
                            </tr>
                          );
                        })}
                     </tbody>
                  </table>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
