/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, Vehicle, ServiceJob, InventoryItem, JobStatus, JobCardPart, JobCardLabor, UserRole, Invoice } from "../types";
import { 
  User as UserIcon, Car, Wrench, Shield, AlertTriangle, Plus, Trash2, 
  Search, CheckCircle2, DollarSign, Clock, Layers, ArrowRight, CornerDownRight, Settings, Activity, ClipboardCheck, Camera, FileText, ChevronLeft, Phone, Mail
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ServiceJobDetailsProps {
  activeJob: ServiceJob;
  users: User[];
  vehicles: Vehicle[];
  inventoryItems: InventoryItem[];
  invoices: Invoice[];
  onUpdateJobStatus: (jobId: string, newStatus: JobStatus) => void;
  onAddJobCardPart: (jobId: string, part: JobCardPart) => void;
  onAddJobCardLabor: (jobId: string, labor: JobCardLabor) => void;
  onGenerateInvoice?: (jobId: string) => void;
  onNotify: (message: string, type: "success" | "info") => void;
  onBack?: () => void;
}

export default function ServiceJobDetails({
  activeJob,
  users,
  vehicles,
  inventoryItems,
  invoices,
  onUpdateJobStatus,
  onAddJobCardPart,
  onAddJobCardLabor,
  onGenerateInvoice,
  onNotify,
  onBack
}: ServiceJobDetailsProps) {
  
  // Search & Form States for Part utilization
  const [partSearch, setPartSearch] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [partQty, setPartQty] = useState(1);

  // Form States for Labor
  const [laborDescription, setLaborDescription] = useState("");
  const [laborHours, setLaborHours] = useState(1);
  const [laborRate, setLaborRate] = useState(150); 
  const [laborMechanicId, setLaborMechanicId] = useState("");

  // Check if invoiced
  const isAlreadyInvoiced = invoices.some(i => i.jobId === activeJob.id);
  const associatedInvoice = invoices.find(i => i.jobId === activeJob.id);

  // Get matching client and vehicle
  const clientUser = users.find(u => u.id === activeJob.clientId);
  const vehicle = vehicles.find(v => v.id === activeJob.vehicleId);
  const mechanics = users.filter(u => u.role === UserRole.MECHANIC);

  // Calculations
  const totalPartsPrice = activeJob.parts.reduce((sum, p) => sum + (p.sellPrice * p.quantity), 0);
  const totalLaborPrice = activeJob.labor.reduce((sum, l) => sum + (l.hourlyRate * l.hoursSpent), 0);
  const grandTotalCost = totalPartsPrice + totalLaborPrice;

  // Search filter for parts
  const filteredParts = inventoryItems.filter(p => {
    const searchString = `${p.name} ${p.oemCode} ${p.brand}`.toLowerCase();
    return searchString.includes(partSearch.toLowerCase());
  });

  const handleStatusUpdate = (status: JobStatus) => {
    onUpdateJobStatus(activeJob.id, status);
    onNotify(`Flux tehnic mutat la: ${status}`, "success");
  };

  const handleAddPartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartId) return;
    const item = inventoryItems.find(i => i.id === selectedPartId);
    if (!item) return;

    onAddJobCardPart(activeJob.id, {
      id: `jp-${Date.now()}`,
      partId: item.id,
      name: item.name,
      oemCode: item.oemCode,
      quantity: partQty,
      sellPrice: item.sellPrice
    });
    
    setSelectedPartId("");
    setPartQty(1);
    onNotify("Material decontat cu succes!", "success");
  };

  const handleAddLaborSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!laborDescription || !laborMechanicId) return;

    onAddJobCardLabor(activeJob.id, {
      id: `jl-${Date.now()}`,
      mechanicId: laborMechanicId,
      description: laborDescription,
      hoursSpent: Number(laborHours),
      hourlyRate: Number(laborRate),
      commissionRate: 30
    });

    setLaborDescription("");
    setLaborHours(1);
    onNotify("Operațiune manuală înregistrată!", "success");
  };

  const statusFlow = [
    { key: JobStatus.IN_RECEPTION, label: "Recepție" },
    { key: JobStatus.IN_PROGRESS, label: "Diagnoză / Lucru" },
    { key: JobStatus.AWAITING_PARTS, label: "Logistică" },
    { key: JobStatus.FINISHED, label: "Finalizat" },
    { key: JobStatus.READY_FOR_DELIVERY, label: "Livrabil" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Top Navigation & Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-4 bg-white border border-[#E9E9EB] rounded-2xl hover:bg-[#F2F2F7] transition-all">
              <ChevronLeft className="w-5 h-5 text-[#1D1D1F]" />
            </button>
          )}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">Panou Comandă Fișă</h2>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-[#034EA2] px-3 py-1 bg-[#E8F0FE] rounded-lg tracking-widest font-mono">#{activeJob.id.toUpperCase()}</span>
              <span className="w-1 h-1 bg-[#86868B]/30 rounded-full"></span>
              <p className="text-sm font-bold text-[#86868B] uppercase tracking-normal">Status: {activeJob.status}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-[#E9E9EB] text-[#1D1D1F] rounded-2xl text-xs font-bold uppercase transition-all hover:bg-[#F2F2F7]">
            <Camera className="w-4 h-4" /> Foto Constatare
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-[#E9E9EB] text-[#1D1D1F] rounded-2xl text-xs font-bold uppercase transition-all hover:bg-[#F2F2F7]">
            <Settings className="w-4 h-4" /> Setări Lucrare
          </button>
        </div>
      </div>

      {/* Main Vehicle Visualization Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white border border-[#E9E9EB] rounded-[32px] p-8 shadow-sm overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[#034EA2] rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                  <Car className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{vehicle?.brand} {vehicle?.model}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm font-bold text-[#86868B] uppercase tracking-widest leading-none">{vehicle?.licensePlate}</span>
                    <span className="w-1 h-1 bg-[#86868B]/30 rounded-full"></span>
                    <span className="text-sm font-bold text-[#86868B] uppercase tracking-normal">An: {vehicle?.year || '---'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-[#F2F2F7] rounded-3xl space-y-1">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest"> Serie Șasiu (VIN)</p>
                  <p className="text-xs font-bold font-mono text-[#1D1D1F]">{vehicle?.vin || "NEIDENTIFICAT"}</p>
                </div>
                <div className="p-5 bg-[#F2F2F7] rounded-3xl space-y-1">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Kilometraj</p>
                  <p className="text-lg font-bold text-[#1D1D1F] tracking-tighter">{vehicle?.mileage?.toLocaleString() || '0'} <span className="text-xs font-normal opacity-40 uppercase">km</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
               <div className="space-y-1 pl-4 border-l-2 border-[#E9E9EB]">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Titular Fișă</p>
                  <p className="text-xl font-bold text-[#1D1D1F] tracking-tight">{clientUser?.name}</p>
                  <p className="text-xs font-bold text-[#034EA2] tracking-normal mt-1">{clientUser?.phone}</p>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Echipa Tehnică</p>
                  <div className="flex -space-x-3">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-white overflow-hidden shadow-md">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=mecanic${i}`} alt="mech" className="w-full h-full object-cover" />
                       </div>
                     ))}
                     <div className="w-10 h-10 rounded-full bg-[#F2F2F7] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#86868B] shadow-sm">
                        +2
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1D1D1F] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[#034EA2]/20 rounded-full blur-[40px] -mr-16 -mt-16"></div>
           
           <div className="space-y-2">
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Deviz Estimativ</p>
              <h4 className="text-4xl font-bold tracking-tighter">{grandTotalCost.toLocaleString()} <span className="text-sm font-normal opacity-30 uppercase">mdl</span></h4>
           </div>

           <div className="space-y-4 pt-12">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-normal">
                 <span className="text-[#86868B]">Piese</span>
                 <span>{totalPartsPrice.toLocaleString()} MDL</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-normal">
                 <span className="text-[#86868B]">Manoperă</span>
                 <span>{totalLaborPrice.toLocaleString()} MDL</span>
              </div>
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-normal text-emerald-400">
                 <span>Marjă Profit</span>
                 <span>~ 35%</span>
              </div>
           </div>
        </div>
      </div>

      {/* Progress Timeline - Reshaped */}
      <div className="bg-white border border-[#E9E9EB] rounded-[32px] p-8 shadow-sm">
         <div className="flex justify-between items-center mb-8">
            <h4 className="text-sm font-bold text-[#1D1D1F] uppercase tracking-widest">Flux integrat intervenție tehnică</h4>
            <div className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest bg-[#F2F2F7] px-4 py-2 rounded-full">Progres: 3 / 5</div>
         </div>
         
         <div className="grid grid-cols-5 gap-2 relative">
            {statusFlow.map((step, i) => {
              const currentIdx = statusFlow.findIndex(s => s.key === activeJob.status);
              const isPast = i < currentIdx;
              const isCurrent = i === currentIdx;
              
              return (
                <button 
                  key={step.key}
                  onClick={() => handleStatusUpdate(step.key)}
                  className="group flex flex-col gap-4 focus:outline-none"
                >
                   <div className={`h-2 rounded-full transition-all duration-700 ${
                     isPast ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" :
                     isCurrent ? "bg-[#034EA2] shadow-[0_0_20px_rgba(3,78,162,0.4)] animate-pulse" :
                     "bg-[#F2F2F7]"
                   }`} />
                   <div className="px-2">
                      <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                        isCurrent ? "text-[#034EA2]" : isPast ? "text-emerald-600" : "text-[#86868B] opacity-60"
                      }`}>{step.label}</p>
                   </div>
                </button>
              );
            })}
         </div>
      </div>

      {/* Operation Control Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left: Labor center */}
        <div className="bg-white border border-[#E9E9EB] rounded-[32px] p-8 flex flex-col h-[600px]">
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-blue-50 text-[#034EA2] rounded-2xl">
                    <Wrench className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight leading-none">Intervenții Manuale</h3>
                    <p className="text-[10px] font-bold text-[#86868B] uppercase mt-1 tracking-widest">Unități timp (Ore)</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Subtotal</p>
                 <p className="text-lg font-bold text-[#1D1D1F] tracking-tighter">{totalLaborPrice.toLocaleString()} MDL</p>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {activeJob.labor.length > 0 ? (
                activeJob.labor.map((l) => (
                  <div key={l.id} className="p-6 bg-[#F2F2F7]/50 rounded-[24px] border border-transparent hover:bg-white hover:border-[#E9E9EB] hover:shadow-xl transition-all group flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#1D1D1F] uppercase text-xs tracking-wide group-hover:text-[#034EA2] transition-colors">{l.description}</h4>
                      <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-normal mt-2">Mecanic: {users.find(u => u.id === l.mechanicId)?.name} • {l.hoursSpent} ore</p>
                    </div>
                    <p className="text-base font-bold text-[#1D1D1F] tracking-tight">{(l.hoursSpent * l.hourlyRate).toLocaleString()} MDL</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40 space-y-4">
                   <Clock className="w-12 h-12" />
                   <p className="text-xs font-bold uppercase tracking-widest">Niciun pontaj tehnic</p>
                </div>
              )}
           </div>

           <form onSubmit={handleAddLaborSubmit} className="mt-8 pt-8 border-t border-[#F2F2F7] space-y-4">
              <input 
                required 
                value={laborDescription} 
                onChange={(e) => setLaborDescription(e.target.value)}
                placeholder="Descrie operațiunea tehnică..."
                className="w-full bg-[#F2F2F7] border-none p-5 rounded-2xl font-bold text-sm text-[#1D1D1F] outline-none placeholder-[#86868B]/50"
              />
              <div className="grid grid-cols-2 gap-4">
                 <select required value={laborMechanicId} onChange={(e) => setLaborMechanicId(e.target.value)} className="w-full bg-[#F2F2F7] border-none p-5 rounded-2xl font-bold text-xs uppercase tracking-normal outline-none appearance-none">
                    <option value="">Alege Mecanic</option>
                    {mechanics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                 </select>
                 <div className="flex gap-2">
                    <input type="number" step={0.5} required value={laborHours} onChange={(e) => setLaborHours(Number(e.target.value))} className="w-24 bg-[#F2F2F7] border-none p-5 rounded-2xl font-bold text-center text-[#1D1D1F] outline-none" />
                    <button type="submit" className="flex-1 bg-[#034EA2] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#1D1D1F] transition-all">Înregistrează</button>
                 </div>
              </div>
           </form>
        </div>

        {/* Right: Logistics center */}
        <div className="bg-white border border-[#E9E9EB] rounded-[32px] p-8 flex flex-col h-[600px]">
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Layers className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight leading-none">Management Logistică</h3>
                    <p className="text-[10px] font-bold text-[#86868B] uppercase mt-1 tracking-widest">Piese și Materiale</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Subtotal</p>
                 <p className="text-lg font-bold text-[#1D1D1F] tracking-tighter">{totalPartsPrice.toLocaleString()} MDL</p>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {activeJob.parts.length > 0 ? (
                activeJob.parts.map((p) => (
                  <div key={p.id} className="p-6 bg-[#F2F2F7]/50 rounded-[24px] border border-transparent hover:bg-white hover:border-[#E9E9EB] hover:shadow-xl transition-all group flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#1D1D1F] uppercase text-xs tracking-wide group-hover:text-[#034EA2] transition-colors">{p.name}</h4>
                      <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-tight mt-2 font-mono">COD: {p.oemCode} • {p.quantity} Unități</p>
                    </div>
                    <p className="text-base font-bold text-[#1D1D1F] tracking-tight">{(p.quantity * p.sellPrice).toLocaleString()} MDL</p>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-40 space-y-4">
                   <Layers className="w-12 h-12" />
                   <p className="text-xs font-bold uppercase tracking-widest">Niciun material alocat</p>
                </div>
              )}
           </div>

           <form onSubmit={handleAddPartSubmit} className="mt-8 pt-8 border-t border-[#F2F2F7] space-y-4">
              <div className="relative">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                 <input 
                   value={partSearch}
                   onChange={(e) => setPartSearch(e.target.value)}
                   placeholder="Caută în depozit..."
                   className="w-full bg-[#F2F2F7] border-none pl-12 pr-6 py-5 rounded-2xl font-bold text-sm text-[#1D1D1F] outline-none"
                 />
              </div>
              <div className="grid grid-cols-1 gap-4">
                 <select required value={selectedPartId} onChange={(e) => setSelectedPartId(e.target.value)} className="w-full bg-[#F2F2F7] border-none p-5 rounded-2xl font-bold text-xs uppercase tracking-normal outline-none appearance-none">
                    <option value="">Selectează Articol</option>
                    {(partSearch ? filteredParts : inventoryItems).slice(0, 10).map(i => (
                      <option key={i.id} value={i.id}>{i.name.toUpperCase()} ({i.currentStock} BUC)</option>
                    ))}
                 </select>
                 <div className="flex gap-2">
                    <input type="number" min={1} required value={partQty} onChange={(e) => setPartQty(Number(e.target.value))} className="w-24 bg-[#F2F2F7] border-none p-5 rounded-2xl font-bold text-center text-[#1D1D1F] outline-none" />
                    <button type="submit" className="flex-1 bg-[#1D1D1F] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#034EA2] transition-all">Scoatere din Stoc</button>
                 </div>
              </div>
           </form>
        </div>
      </div>

      {/* Final Accounting & Invoice - Floating Block style */}
      <div className="p-8 bg-blue-600 rounded-[40px] text-white shadow-2xl shadow-blue-200">
         <div className="flex flex-col xl:flex-row justify-between items-center gap-8">
            <div className="space-y-2">
               <h3 className="text-3xl font-bold tracking-tight">Finalizare și Facturare.</h3>
               <p className="text-sm font-bold text-blue-100 uppercase tracking-widest">Generare automată documente fiscale și garanție</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6">
               <div className="text-center md:text-right px-8 border-r border-white/10 hidden md:block">
                  <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Total General</p>
                  <p className="text-3xl font-bold tracking-tighter">{grandTotalCost.toLocaleString()} MDL</p>
               </div>
               
               {onGenerateInvoice && (
                  <button
                    disabled={isAlreadyInvoiced}
                    onClick={() => {
                      onGenerateInvoice(activeJob.id);
                      onNotify(`Factura ${activeJob.id.toUpperCase()} emisă cu succes!`, "success");
                    }}
                    className={`px-12 py-5 rounded-3xl font-bold text-xs uppercase tracking-widest transition-all shadow-2xl flex items-center gap-3 ${
                      isAlreadyInvoiced 
                        ? "bg-emerald-500 text-white cursor-not-allowed" 
                        : "bg-white text-blue-600 hover:bg-blue-50 active:scale-95"
                    }`}
                  >
                    {isAlreadyInvoiced ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Factură Emisă ({associatedInvoice?.invoiceNumber})
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Generează Factură Fiscală
                      </>
                    )}
                  </button>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
