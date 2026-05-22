import React, { useState, useEffect, useMemo, useCallback } from "react";
import { User, Vehicle, ServiceJob, UserRole, JobStatus } from "../types";
import { 
  Wrench, Users, Hammer, AlertTriangle, CheckCircle2, ArrowRight,
  Clock, Plus, Calendar, HelpCircle, Activity, ShieldCheck, Cpu, Trash2, Edit2, Play, Power, Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AtelierDashboardProps {
  currentUser: User | null;
  users: User[];
  vehicles: Vehicle[];
  serviceJobs: ServiceJob[];
  onUpdateJobStatus: (jobId: string, newStatus: JobStatus) => void;
  onNotify: (message: string, type: "success" | "info") => void;
  onOpenJobs: () => void;
  onSelectJobId: (jobId: string) => void;
}

interface SlotState {
  id: string;
  name: string;
  type: "mechanic" | "electrician";
  status: "Free" | "Busy" | "AwaitingParts" | "Maintenance";
  mechanicId: string; // User ID
  jobId: string;      // ServiceJob ID
  vehicleId: string;  // Vehicle ID
  notes: string;
}

export default function AtelierDashboard({
  currentUser,
  users,
  vehicles,
  serviceJobs,
  onUpdateJobStatus,
  onNotify,
  onOpenJobs,
  onSelectJobId
}: AtelierDashboardProps) {
  // Filter mechanics and electrician
  const mechanics = useMemo(() => users.filter(u => u.role === UserRole.MECHANIC), [users]);
  
  // Available vehicles for assigning
  const checkedInVehicles = vehicles;
  
  // Active / Pendind or in progress jobs
  const activeJobs = useMemo(() => serviceJobs.filter(
    j => j.status !== JobStatus.FINISHED && j.status !== JobStatus.READY_FOR_DELIVERY
  ), [serviceJobs]);

  // Initial slot assignments based on active jobs in the workshop
  const [slots, setSlots] = useState<SlotState[]>([]);

  useEffect(() => {
    // Build initial setup from db.json / static active jobs
    const initialSlots: SlotState[] = [];
    
    // 5 Mechanic ramps
    for (let i = 1; i <= 5; i++) {
      // Find an active mechanical job that isn't electrical, assign if available
      const associatedJob = activeJobs.find((j, index) => {
        // Let's map them simply by index for pre-populate
        const isElectrical = j.reportedFaults.toLowerCase().includes("electric") || j.reportedFaults.toLowerCase().includes("diagno");
        return !isElectrical && index === (i - 1);
      });

      initialSlots.push({
        id: `rampa-${i}`,
        name: `Rampa Lucru ${i}`,
        type: "mechanic",
        status: associatedJob ? "Busy" : "Free",
        mechanicId: associatedJob?.allocatedMechanicId || "",
        jobId: associatedJob?.id || "",
        vehicleId: associatedJob?.vehicleId || "",
        notes: associatedJob ? `Lucrare activă pe rampă: ${associatedJob.id.toUpperCase()}` : "Gata pentru preluare autoturism."
      });
    }

    // 1 Electrician compartment
    const electricJob = activeJobs.find(j => {
      const isElectrical = j.reportedFaults.toLowerCase().includes("electric") || j.reportedFaults.toLowerCase().includes("diagno");
      return isElectrical;
    }) || activeJobs[activeJobs.length - 1]; // Fallback to last active if no electrical

    initialSlots.push({
      id: "electrician",
      name: "Compartiment Diagnoză & Electrician",
      type: "electrician",
      status: electricJob ? "Busy" : "Free",
      mechanicId: electricJob?.allocatedMechanicId || users.find(u => u.title?.toLowerCase().includes("electrician"))?.id || "",
      jobId: electricJob?.id || "",
      vehicleId: electricJob?.vehicleId || "",
      notes: electricJob ? `Diagnoză activă: ${electricJob.id.toUpperCase()}` : "Rampă de măsurători electrice complet liberă."
    });

    setSlots(initialSlots);
  }, [serviceJobs]);

  // Handle local changes to slot
  const handleUpdateSlot = useCallback((slotId: string, updates: Partial<SlotState>) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    const nextSlot = { ...slot, ...updates };
    
    // Side effects logic
    if (updates.status === "Free") {
      nextSlot.jobId = "";
      nextSlot.vehicleId = "";
      nextSlot.notes = "Rampă golită. Gata pentru o nouă recepție.";
      onNotify(`Slotul ${slot.name} a fost eliberat.`, "success");
    } else if (updates.status) {
      const statusLabels: Record<string, string> = {
        Busy: "În Lucru",
        AwaitingParts: "Așteaptă piese",
        Maintenance: "Revizie rampă"
      };
      onNotify(`Status schimbat pentru ${slot.name}: ${statusLabels[updates.status]}`, "info");
    }

    if (updates.status && nextSlot.jobId) {
      if (updates.status === "Busy") {
        onUpdateJobStatus(nextSlot.jobId, JobStatus.IN_PROGRESS);
      } else if (updates.status === "AwaitingParts") {
        onUpdateJobStatus(nextSlot.jobId, JobStatus.AWAITING_PARTS);
      }
    }

    // Now update local state purely
    setSlots(prev => prev.map(s => s.id === slotId ? nextSlot : s));
  }, [slots, onNotify, onUpdateJobStatus]);

  // Quick simulate ramp calibration
  const handleCalibrateRamp = useCallback((name: string) => {
    onNotify(`Senzori presiune și elevație recalibrați cu succes pe ${name}! Toleranță 0.02mm.`, "success");
  }, [onNotify]);

  return (
    <div id="atelier-dashboard-root" className="space-y-6">
      
      {/* Top action header card (One UI style) */}
      <div className="bg-white rounded-3xl p-6 border border-[#E9E9EB] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#034EA2] shadow-inner shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#1D1D1F] tracking-tight">Zone Atelier • Repartiție Rampe</h3>
            <p className="text-xs text-[#86868B] font-bold mt-1 max-w-xl leading-relaxed">
              Vizualizare în timp real a celor 5 rampe active și a compartimentului de electricitate auto. Planifică lucrul, schimbă mecanicii și urmărește progresul tehnic.
            </p>
          </div>
        </div>
        
        {/* Dynamic button directly link to service jobs list */}
        <button
          onClick={onOpenJobs}
          className="bg-[#1D1D1F] text-white hover:bg-[#034EA2] font-bold px-5 py-3.5 rounded-2xl text-[11px] uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md self-start md:self-auto shrink-0"
        >
          <Wrench className="w-4 h-4 text-white" />
          <span> Deschide Fișe Service & Devize</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Grid: columns layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Slot Ramps (8 columns list) */}
        <div className="xl:col-span-8 space-y-4">
          <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Rampe Elevatoare Mecanici (5 Zone)</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-normal">
                Sistem Hidraulic activ (Ungheni Node)
              </span>
            </div>

            <div className="space-y-4">
              {slots.filter(s => s.type === "mechanic").map((slot) => {
                const associatedMechanic = mechanics.find(m => m.id === slot.mechanicId);
                const associatedVeh = vehicles.find(v => v.id === slot.vehicleId);
                const vehicleOwner = users.find(u => u.id === associatedVeh?.clientId);
                
                return (
                  <div 
                    key={slot.id} 
                    className={`p-5 rounded-[22px] border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      slot.status === "Busy" ? "bg-[#E8F0FE]/30 border-[#034EA2]/10" :
                      slot.status === "AwaitingParts" ? "bg-amber-50/40 border-amber-200" :
                      slot.status === "Maintenance" ? "bg-gray-50/50 border-gray-200" :
                      "bg-white border-[#E9E9EB] shadow-sm hover:border-gray-300"
                    }`}
                  >
                    
                    {/* Visual indicators */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                        slot.status === "Busy" ? "bg-[#E8F0FE] text-[#034EA2]" :
                        slot.status === "AwaitingParts" ? "bg-amber-14 py-2 text-amber-600" :
                        slot.status === "Maintenance" ? "bg-gray-200 text-gray-500" :
                        "bg-[#F2F2F7] text-[#86868B]"
                      }`}>
                        <Hammer className="w-5 h-5 focus:scale-105" />
                      </div>
                      
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-extrabold text-[#1D1D1F] tracking-tight">{slot.name}</h4>
                          <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-normal ${
                            slot.status === "Busy" ? "bg-blue-50 text-[rgb(3,78,162)]" :
                            slot.status === "AwaitingParts" ? "bg-amber-50 text-amber-700" :
                            slot.status === "Maintenance" ? "bg-gray-100 text-gray-600" :
                            "bg-emerald-50 text-emerald-700"
                          }`}>
                            {slot.status === "Busy" ? "În lucru" :
                             slot.status === "AwaitingParts" ? "Așteaptă piese" :
                             slot.status === "Maintenance" ? "Pregătire tehnică" :
                             "Rampă Liberă"}
                          </span>
                        </div>
                        
                        {/* Display slot active assignments */}
                        {slot.status !== "Free" && (associatedVeh || associatedMechanic) ? (
                          <div className="space-y-1 text-left">
                            <div className="flex flex-wrap gap-x-2.5 gap-y-1 text-xs">
                              {associatedVeh && (
                                <p className="text-[#1D1D1F] font-bold">
                                  🚗 {associatedVeh.brand} {associatedVeh.model} <span className="text-[#86868B] font-bold">({associatedVeh.licensePlate})</span>
                                </p>
                              )}
                              {vehicleOwner && (
                                <p className="text-[#86868B] font-bold">• Client: {vehicleOwner.name}</p>
                              )}
                            </div>
                            
                            {associatedMechanic && (
                              <div className="flex items-center gap-2 mt-1">
                                <img 
                                  src={associatedMechanic.avatarUrl} 
                                  alt={associatedMechanic.name}
                                  className="w-5 h-5 rounded-full object-cover border border-white max-h-5"
                                />
                                <span className="text-[11px] text-[#5C5C5C] font-semibold">{associatedMechanic.name} ({associatedMechanic.title || "Mecanic"})</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-[#86868B] font-bold">Rampă pregătită. Niciun vehicul în reparație în acest moment.</p>
                        )}
                        
                        <p className="text-[10px] text-[#86868B] font-medium leading-normal italic bg-[#F2F2F7]/40 px-3 py-1.5 rounded-lg inline-block">
                          Note: {slot.notes}
                        </p>
                      </div>
                    </div>

                    {/* Quick Control selectors */}
                    <div className="flex flex-wrap items-center gap-2 md:self-center">
                      
                      {/* Dropdown status selector */}
                      <select
                        value={slot.status}
                        onChange={(e) => handleUpdateSlot(slot.id, { status: e.target.value as any })}
                        className="bg-[#F2F2F7] border border-[#E9E9EB] text-xs font-bold rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer outline-none focus:border-[#034EA2]"
                      >
                        <option value="Free">Liber / Gata</option>
                        <option value="Busy">În lucru</option>
                        <option value="AwaitingParts">Așteaptă piese</option>
                        <option value="Maintenance">Mentenanță</option>
                      </select>

                      {/* Select active vehicle link if vacant */}
                      {slot.status === "Free" && activeJobs.length > 0 && (
                        <select
                          onChange={(e) => {
                            const selectedJobId = e.target.value;
                            const job = serviceJobs.find(j => j.id === selectedJobId);
                            if (job) {
                              handleUpdateSlot(slot.id, {
                                status: "Busy",
                                jobId: job.id,
                                vehicleId: job.vehicleId,
                                mechanicId: job.allocatedMechanicId || slot.mechanicId || mechanics[0]?.id || "",
                                notes: `Preluat automat din fisa de lucru ${job.id.toUpperCase()}`
                              });
                            }
                          }}
                          className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10.5px] font-bold rounded-lg p-1.5 cursor-pointer outline-none max-w-[130px]"
                        >
                          <option value="">+ Aloca masina</option>
                          {activeJobs.map(j => {
                            const v = vehicles.find(veh => veh.id === j.vehicleId);
                            return (
                              <option key={j.id} value={j.id}>
                                {v ? `${v.brand} (${v.licensePlate})` : j.id}
                              </option>
                            );
                          })}
                        </select>
                      )}

                      {/* Detailed Link Actions */}
                      {slot.jobId && (
                        <button
                          onClick={() => {
                            onSelectJobId(slot.jobId);
                            onOpenJobs();
                          }}
                          className="p-1.5 bg-white text-[#034EA2] border border-[#E9E9EB] hover:bg-[#E8F0FE] rounded-lg transition-all text-xs font-bold"
                          title="Vezi Fisa"
                        >
                          Detalii Fișă
                        </button>
                      )}

                      {/* Recalibrate button */}
                      <button
                        onClick={() => handleCalibrateRamp(slot.name)}
                        className="p-1 px-2.5 bg-[#F2F2F7] text-[#86868B] hover:bg-[#E9E9EB] hover:text-[#1D1D1F] border-none rounded-lg text-[9.5px] font-extrabold uppercase tracking-tight duration-200"
                        title="Calibrare rampa"
                      >
                        Calibrare
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Electrician compartment and Quick tools (4 columns) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* SPECIAL ELECTRICIAN COMPARTMENT */}
          <div className="bg-[#1D1D1F] text-white rounded-3xl p-6 border border-white/5 shadow-md flex flex-col justify-between min-h-[350px] relative overflow-hidden group">
            <div className="absolute -right-16 -bottom-16 w-44 h-44 bg-[#034EA2]/25 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
            
            <div className="space-y-4 relative z-10 text-left">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-[#034EA2] rounded-xl flex items-center justify-center text-white shadow-[0_8px_16px_rgba(3,78,162,0.4)]">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  Electrică & Diagnoză OBDII
                </span>
              </div>

              <div>
                <h4 className="text-base font-extrabold tracking-tight">Postul Central de Diagnoză</h4>
                <p className="text-xs text-[#86868B] font-bold mt-1">Echipat cu software de scanare multi-marcă, osciloscop auto și testere baterii de înaltă precizie.</p>
              </div>

              {/* Find and view active electrician configuration */}
              {(() => {
                const elSlot = slots.find(s => s.id === "electrician");
                if (!elSlot) return null;
                const activeElectrician = users.find(u => u.title?.toLowerCase().includes("electric") || u.role === UserRole.MECHANIC);
                const assignedVehicle = vehicles.find(v => v.id === elSlot.vehicleId);
                const vehicleOwner = users.find(u => u.id === assignedVehicle?.clientId);

                return (
                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-lg">
                      <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">STATUS POST:</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${elSlot.status === "Busy" ? "text-blue-400" : "text-emerald-400"}`}>
                        {elSlot.status === "Busy" ? "Diagnoză în Curs" : "Liber / Gata"}
                      </span>
                    </div>

                    {elSlot.status !== "Free" && assignedVehicle ? (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🚙</span>
                          <div>
                            <p className="font-bold text-white leading-none">{assignedVehicle.brand} {assignedVehicle.model}</p>
                            <p className="text-[10px] font-bold text-white/50 mt-1">{assignedVehicle.licensePlate} • {vehicleOwner?.name || "Client"}</p>
                          </div>
                        </div>

                        {activeElectrician && (
                          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                            <span className="text-xs">⚡</span>
                            <span className="text-[11px] text-white/70 font-bold">Diagnostician: {activeElectrician.name}</span>
                          </div>
                        )}
                        
                        <div className="mt-2 text-[10px] bg-red-400/5 text-amber-300 font-bold rounded-lg p-2 border border-amber-300/10 leading-normal">
                          Problemă: {serviceJobs.find(j => j.id === elSlot.jobId)?.reportedFaults || "Coduri eroare check engine"}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[11.5px] text-white/40 font-bold py-4 text-center">Niciun autoturism parcat pentru diagnoză în acest moment.</p>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10 mt-6 lg:mt-4">
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  const elSlot = slots.find(s => s.id === "electrician");
                  if (elSlot) {
                    if (val === "Free") {
                      handleUpdateSlot("electrician", { status: "Free" });
                    } else if (val) {
                      const job = serviceJobs.find(j => j.id === val);
                      if (job) {
                        handleUpdateSlot("electrician", {
                          status: "Busy",
                          jobId: job.id,
                          vehicleId: job.vehicleId,
                          notes: "Escanare flux diagnoza"
                        });
                      }
                    }
                  }
                }}
                className="bg-white/10 text-white font-bold p-2.5 rounded-xl text-xs outline-none border border-white/10 cursor-pointer"
              >
                <option value="Free" className="bg-[#1D1D1F]">Liber / Eliberează</option>
                {activeJobs.map(j => {
                  const v = vehicles.find(veh => veh.id === j.vehicleId);
                  return (
                    <option key={j.id} value={j.id} className="bg-[#1D1D1F]">
                      {v ? `${v.brand} (${v.licensePlate})` : j.id}
                    </option>
                  );
                })}
              </select>

              <button
                onClick={() => onNotify("Osciloscopul digital auto a inițiat autotestarea. Toate 4 canale active (OK).", "success")}
                className="bg-[#034EA2] hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-normal border-none cursor-pointer"
              >
                Tester OBD II
              </button>
            </div>

          </div>

          {/* QUICK TOOLBOX WORKSHOP STATS */}
          <div className="bg-white rounded-3xl p-6 border border-[#E9E9EB] shadow-sm text-left space-y-4">
            <h4 className="text-xs font-bold text-[#1D1D1F] uppercase tracking-normal">Ghid Operational Atelier</h4>
            
            <div className="space-y-2.5">
              <div className="p-4 bg-[#F2F2F7] rounded-2xl flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#E8F0FE] flex items-center justify-center text-[#034EA2]">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold leading-tight">
                  <p className="text-[#1D1D1F]">Urmărirea fluxului de lucru (Mecanică)</p>
                  <p className="text-[#86868B] font-semibold mt-1">O fișă trecută în lucru modifică automat starea rampei desemnate în portalul central de monitorizare.</p>
                </div>
              </div>

              <div className="p-4 bg-[#F2F2F7] rounded-2xl flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold leading-tight">
                  <p className="text-[#1D1D1F]">Reguli Securitate în Muncă</p>
                  <p className="text-[#86868B] font-semibold mt-1">Înainte de începerea lucrărilor de elevație, verificați stabilizatoarele hidraulice și unghiul de sprijin.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
