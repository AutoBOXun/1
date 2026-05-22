import React, { useState, useEffect } from "react";
import { User, UserRole } from "../../types";
import { 
  CalendarDays, CheckCircle, Clock, XCircle, Search, Filter, 
  Check, X, ShieldAlert, Award, Calendar, ChevronRight, User as UserIcon
} from "lucide-react";

export interface VacationRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: "Anual" | "Medical" | "Fără Plată" | "Eveniment Deosebit";
  status: "În așteptare" | "Aprobat" | "Respins";
  notes?: string;
  daysRequested: number;
}

interface StaffVacationItem {
  employee: User;
  vacation: VacationRequest;
}

interface VacationViewProps {
  staff: User[];
  onNotify: (msg: string, type?: "success" | "info") => void;
}

export const VacationView = ({ staff, onNotify }: VacationViewProps) => {
  const [items, setItems] = useState<StaffVacationItem[]>([]);
  const [filter, setFilter] = useState<"toate" | "în așteptare" | "aprobat" | "respins">("toate");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load all vacations from localStorage for each staff member
  useEffect(() => {
    const loadedItems: StaffVacationItem[] = [];
    
    staff.forEach(emp => {
      const saved = localStorage.getItem(`emp-vacations-${emp.id}`);
      if (saved) {
        try {
          const list: VacationRequest[] = JSON.parse(saved);
          list.forEach(vac => {
            loadedItems.push({
              employee: emp,
              vacation: vac
            });
          });
        } catch (e) {
          console.error("Eroare la parsarea concediilor pentru", emp.name, e);
        }
      } else {
        // Fallback default mock vacations if not set yet, so dashboard has content
        const defaultVacations: VacationRequest[] = [
          {
            id: `vac-1-${emp.id}`,
            startDate: "2026-08-10",
            endDate: "2026-08-24",
            type: "Anual",
            status: emp.id.includes("1") ? "În așteptare" : "Aprobat",
            notes: "Concediu de odihnă anual programat (perioada estivală).",
            daysRequested: 14
          },
          {
            id: `vac-2-${emp.id}`,
            startDate: "2026-02-02",
            endDate: "2026-02-06",
            type: "Medical",
            status: "Aprobat",
            notes: "Recuperare medicală, certificat depus.",
            daysRequested: 5
          }
        ];
        localStorage.setItem(`emp-vacations-${emp.id}`, JSON.stringify(defaultVacations));
        defaultVacations.forEach(vac => {
          loadedItems.push({
            employee: emp,
            vacation: vac
          });
        });
      }
    });

    // Sort items so "În așteptare" are at the top, then by start date
    loadedItems.sort((a, b) => {
      if (a.vacation.status === "În așteptare" && b.vacation.status !== "În așteptare") return -1;
      if (a.vacation.status !== "În așteptare" && b.vacation.status === "În așteptare") return 1;
      return new Date(b.vacation.startDate).getTime() - new Date(a.vacation.startDate).getTime();
    });

    setItems(loadedItems);
  }, [staff, refreshTrigger]);

  const handleUpdateStatus = (empId: string, vacId: string, newStatus: "Aprobat" | "Respins") => {
    const saved = localStorage.getItem(`emp-vacations-${empId}`);
    if (saved) {
      try {
        const list: VacationRequest[] = JSON.parse(saved);
        const updated = list.map(v => v.id === vacId ? { ...v, status: newStatus } : v);
        localStorage.setItem(`emp-vacations-${empId}`, JSON.stringify(updated));
        
        onNotify(`Cererea de concediu a fost ${newStatus === "Aprobat" ? "aprobată" : "respinsă"} cu succes!`, "success");
        setRefreshTrigger(prev => prev + 1);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Filtered List
  const filteredItems = items.filter(item => {
    const matchesFilter = filter === "toate" || item.vacation.status.toLowerCase() === filter;
    const matchesSearch = item.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.employee.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.vacation.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = items.filter(i => i.vacation.status === "În așteptare").length;
  const approvedCount = items.filter(i => i.vacation.status === "Aprobat").length;

  return (
    <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Header sectiune */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#F2F2F7] pb-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-2.5">
            <CalendarDays className="w-5 h-5 text-[#034EA2]" />
            Controler Global Concedii & Absențe
          </h3>
          <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal">Gestiunea centralizată a cererilor transmise de angajați</p>
        </div>
        
        {/* Quick KPI pills */}
        <div className="flex gap-2">
          <div className="px-3.5 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-[10px] text-amber-800 font-extrabold uppercase tracking-normal flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {pendingCount} în așteptare
          </div>
          <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] text-emerald-800 font-extrabold uppercase tracking-normal flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> {approvedCount} aprobate total
          </div>
        </div>
      </div>

      {/* Căutare & Filtre (One UI 8 Bar) */}
      <div className="bg-[#F2F2F7] p-3 rounded-2xl flex flex-col md:flex-row gap-3 items-center">
        {/* Input cautare */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Caută după angajat sau descriere..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-xs font-semibold pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-[#034EA2] outline-none transition-all"
          />
        </div>

        {/* Filtre interactive */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto">
          {(["toate", "în așteptare", "aprobat", "respins"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-normal whitespace-nowrap transition-all cursor-pointer ${
                filter === opt 
                  ? "bg-[#1D1D1F] text-white shadow-sm" 
                  : "bg-white hover:bg-[#E9E9EB] text-[#1D1D1F] border border-[#E9E9EB]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Lista centralizată de concedii */}
      <div className="space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-[#E9E9EB] space-y-3">
            <Calendar className="w-10 h-10 text-[#86868B] mx-auto opacity-40" />
            <p className="text-xs font-bold uppercase tracking-normal">Nu s-au găsit înregistrări conform selecției în sistem.</p>
          </div>
        ) : (
          filteredItems.map(({ employee, vacation }) => {
            const isPending = vacation.status === "În așteptare";
            return (
              <div 
                key={vacation.id} 
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-5 ${
                  isPending 
                    ? "bg-amber-50/20 border-amber-100 hover:border-amber-200" 
                    : "bg-[#F2F2F7]/50 border-transparent hover:border-[#E9E9EB]"
                }`}
              >
                {/* Informații Angajat & Concediu */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <img 
                    src={employee.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100`} 
                    alt={employee.name} 
                    className="w-11 h-11 rounded-full object-cover border border-[#E9E9EB] shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-extrabold text-[#1D1D1F]">{employee.name}</h4>
                      <span className="text-[9px] font-bold bg-white text-slate-500 border border-[#E9E9EB] px-2 py-0.5 rounded-full uppercase">
                        {employee.title || employee.role}
                      </span>
                    </div>
                    
                    {/* Interval Concediu */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-extrabold text-[#1D1D1F]">
                        {vacation.startDate} – {vacation.endDate}
                      </span>
                      <span className="text-[10px] text-[#034EA2] bg-blue-50/80 px-2 py-0.5 rounded-full font-bold">
                        {vacation.daysRequested} zile (Tip: {vacation.type})
                      </span>
                    </div>
                    {vacation.notes && (
                      <p className="text-[11px] text-slate-500 italic max-w-xl">"{vacation.notes}"</p>
                    )}
                  </div>
                </div>

                {/* Status și acțiuni */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  
                  {/* Status badge */}
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-normal border ${
                    vacation.status === "Aprobat" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                      : vacation.status === "Respins"
                      ? "bg-rose-50 text-rose-700 border-rose-100"
                      : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                  }`}>
                    {vacation.status}
                  </span>

                  {/* Actiune de decizie pentru echipa de management (Admin / HR) */}
                  {isPending && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleUpdateStatus(employee.id, vacation.id, "Aprobat")}
                        title="Aprobă cererea"
                        className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(employee.id, vacation.id, "Respins")}
                        title="Respinge cererea"
                        className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
