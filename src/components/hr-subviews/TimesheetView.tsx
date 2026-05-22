import React, { useState, useEffect } from "react";
import { User, Timesheet } from "../../types";
import { 
  ListChecks, Calendar, Clock, Plus, ArrowRight, User as UserIcon, Check, 
  ChevronLeft, ChevronRight, FileSpreadsheet, ShieldCheck
} from "lucide-react";
import { VacationRequest } from "./VacationView";

interface TimesheetViewProps {
  staff: User[];
  timesheets: Timesheet[];
  onAddTimesheet?: (timesheet: Timesheet) => void;
  onNotify: (msg: string, type?: "success" | "info") => void;
}

export const TimesheetView = ({ staff, timesheets: propTimesheets, onAddTimesheet, onNotify }: TimesheetViewProps) => {
  // Local backing state for timesheet records to ensure immediate reflection
  const [localTimesheets, setLocalTimesheets] = useState<Timesheet[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 4, 1)); // Default to May 2026 based on metadata
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [logHours, setLogHours] = useState<number>(8);
  const [logNotes, setLogNotes] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<number>(22); // Default to current metadata day
  const [vacationMap, setVacationMap] = useState<Record<string, VacationRequest[]>>({});

  // Synchronize and seed initial timesheets if needed
  useEffect(() => {
    // Collect prop timesheets and saved local ones
    const saved = localStorage.getItem("autopro-local-timesheets");
    let combined = [...propTimesheets];
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Timesheet[];
        // Filter out duplicates present in props
        const propIds = new Set(propTimesheets.map(t => t.id));
        const filteredParsed = parsed.filter(t => !propIds.has(t.id));
        combined = [...combined, ...filteredParsed];
      } catch (e) {
        console.error(e);
      }
    }
    setLocalTimesheets(combined);

    // Load vacations for staff to display CO / CM
    const vMap: Record<string, VacationRequest[]> = {};
    staff.forEach(emp => {
      const savedVac = localStorage.getItem(`emp-vacations-${emp.id}`);
      if (savedVac) {
        try {
          vMap[emp.id] = JSON.parse(savedVac);
        } catch (e) {
          console.error(e);
        }
      }
    });
    setVacationMap(vMap);
  }, [propTimesheets, staff]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
  ];

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayLabel = (dayIndex: number) => {
    const dateObj = new Date(year, month, dayIndex);
    const dayName = dateObj.toLocaleDateString("ro-RO", { weekday: "short" });
    return dayName.substring(0, 1).toUpperCase() + dayName.substring(1, 2).toLowerCase();
  };

  const isWeekend = (dayIndex: number) => {
    const dateObj = new Date(year, month, dayIndex);
    const d = dateObj.getDay();
    return d === 0 || d === 6; // Sunday or Saturday
  };

  // Check if staff has active approved vacation on specific date
  const checkVacation = (empId: string, dayNum: number) => {
    const list = vacationMap[empId] || [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const dateObj = new Date(dateStr);

    for (const vac of list) {
      if (vac.status === "Aprobat") {
        const start = new Date(vac.startDate);
        const end = new Date(vac.endDate);
        if (dateObj >= start && dateObj <= end) {
          return vac.type; // "Anual", "Medical", "Fără Plată", etc.
        }
      }
    }
    return null;
  };

  // Get logged hours on specific date
  const getLoggedHours = (empId: string, dayNum: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    const found = localTimesheets.find(t => t.employeeId === empId && t.date === dateStr);
    return found ? found.hoursWorked : 0;
  };

  const handleLogPontaj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) {
      onNotify("Vă rugăm să alegeți un angajat!", "info");
      return;
    }

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
    const newTimesheet: Timesheet = {
      id: `ts-local-${Date.now()}`,
      employeeId: selectedStaffId,
      date: dateStr,
      hoursWorked: logHours,
      notes: logNotes || "Prezență înregistrată",
      basePay: 150, // default rate per hour
      commissionEarned: 0
    };

    // Trigger parent callback if defined
    if (onAddTimesheet) {
      onAddTimesheet(newTimesheet);
    }

    // Persist locally
    const saved = localStorage.getItem("autopro-local-timesheets");
    let currentSaved: Timesheet[] = [];
    if (saved) {
      try {
        currentSaved = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Filter out same day replacement
    const updatedLocally = [newTimesheet, ...currentSaved.filter(ts => !(ts.employeeId === selectedStaffId && ts.date === dateStr))];
    localStorage.setItem("autopro-local-timesheets", JSON.stringify(updatedLocally));
    
    // Update local state directly
    setLocalTimesheets(prev => [newTimesheet, ...prev.filter(ts => !(ts.employeeId === selectedStaffId && ts.date === dateStr))]);

    const name = staff.find(s => s.id === selectedStaffId)?.name || "Angajat";
    onNotify(`Pontaj salvat pentru ${name} la data de ${dateStr}: ${logHours} ore!`, "success");
    setLogNotes("");
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 animate-in fade-in duration-300">
      
      {/* Selector Lună & Quick Stats */}
      <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-2.5">
            <ListChecks className="w-5 h-5 text-[#034EA2]" />
            Tabel Centralizator Pontaj & Prezențe AutoPRO
          </h3>
          <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal">Calculul timpului lucrat conform fișelor zilnice și planificărilor</p>
        </div>

        {/* Luna actuală selector */}
        <div className="flex items-center gap-3 bg-[#F2F2F7] p-1.5 rounded-2xl w-full md:w-auto justify-between md:justify-start">
          <button 
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white text-[#1D1D1F] rounded-xl transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-extrabold text-[#1D1D1F] px-4 min-w-32 text-center select-none uppercase tracking-tight">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-white text-[#1D1D1F] rounded-xl transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gridul general de pontaj */}
      <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 shadow-sm overflow-hidden space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#F2F2F7]">
          <h4 className="text-sm font-bold text-[#1D1D1F]">Foaia de Pontaj Colectiv (Tabelar)</h4>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-normal text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 block"></span> Lucru (h)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 block"></span> Concediu (CO)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-100 block"></span> Medical (CM)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 block"></span> Repaus (R)</span>
          </div>
        </div>

        {/* Wrapper scrollable pentru tabelul mare de zile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 px-3 min-w-48 sticky left-0 bg-white z-10 text-xs font-bold text-[#86868B] uppercase">Angajat / Funcție</th>
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const weekend = isWeekend(dayNum);
                  return (
                    <th 
                      key={dayNum} 
                      className={`py-2 px-1 text-center text-[10px] font-bold min-w-8 ${weekend ? "bg-slate-50 text-slate-400" : "text-slate-700"}`}
                    >
                      <div>{dayNum}</div>
                      <div className="text-[8px] opacity-70 mt-0.5">{getDayLabel(dayNum)}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={daysInMonth + 1} className="text-center py-8 text-slate-400 text-xs">
                    Niciun salariat activ pentru înregistrare în această secție.
                  </td>
                </tr>
              ) : (
                staff.map(emp => {
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Name Card Sticky Left */}
                      <td className="py-3.5 px-3 sticky left-0 bg-white z-10 font-bold border-r border-[#F2F2F7] shadow-[2px_0_5px_rgba(0,0,0,0.01)]">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={emp.avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100`} 
                            alt={emp.name} 
                            className="w-7 h-7 rounded-full object-cover border border-slate-100"
                          />
                          <div>
                            <div className="text-xs text-[#1D1D1F] line-clamp-1">{emp.name}</div>
                            <div className="text-[9px] text-[#86868B] font-extrabold uppercase line-clamp-1">{emp.title || emp.role}</div>
                          </div>
                        </div>
                      </td>

                      {/* Zilele lunii pontaje */}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const dayNum = i + 1;
                        const hours = getLoggedHours(emp.id, dayNum);
                        const vacType = checkVacation(emp.id, dayNum);
                        const weekend = isWeekend(dayNum);

                        let cellContent = "";
                        let colorClass = "text-slate-300 hover:bg-slate-100 hover:text-[#1D1D1F]";
                        
                        if (vacType) {
                          if (vacType === "Medical") {
                            cellContent = "CM";
                            colorClass = "bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200/50 rounded-lg font-bold";
                          } else {
                            cellContent = "CO";
                            colorClass = "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200/50 rounded-lg font-bold";
                          }
                        } else if (hours > 0) {
                          cellContent = `${hours}`;
                          colorClass = "bg-blue-500 text-white rounded-lg font-extrabold shadow-sm hover:bg-blue-600";
                        } else if (weekend) {
                          cellContent = "R";
                          colorClass = "bg-slate-50 text-slate-400 hover:bg-slate-100 rounded-lg";
                        } else {
                          // Default blank work shift (assumed standard 8h if filled, but empty for now)
                          cellContent = "-";
                          colorClass = "text-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer";
                        }

                        return (
                          <td 
                            key={dayNum} 
                            onClick={() => {
                              setSelectedStaffId(emp.id);
                              setSelectedDay(dayNum);
                              setLogHours(hours > 0 ? hours : 8);
                            }}
                            className={`p-1.5 text-center transition-all cursor-pointer`}
                          >
                            <span className={`w-7 h-7 flex items-center justify-center text-[10px] mx-auto transition-all ${colorClass}`}>
                              {cellContent}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor/Logare Rapidă Pontaj */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formular logare */}
        <form 
          onSubmit={handleLogPontaj} 
          className="bg-white border border-[#E9E9EB] rounded-3xl p-6 shadow-sm md:col-span-1 space-y-4"
        >
          <div className="border-b border-[#F2F2F7] pb-3">
            <h4 className="font-bold text-[#1D1D1F] flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#034EA2]" />
              Înregistrează Zi de Lucru (Pontaj)
            </h4>
            <p className="text-[10px] text-slate-500">Adaugă sau modifică manual orele de prezență fizică</p>
          </div>

          <div className="space-y-3.5 text-xs font-semibold">
            <div>
              <label className="text-[10px] uppercase font-extrabold text-[#86868B] block mb-1">Selectează Angajat:</label>
              <select 
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                required
                className="w-full bg-[#F2F2F7] text-xs font-bold p-3 rounded-xl border border-transparent focus:border-[#034EA2] outline-none cursor-pointer"
              >
                <option value="">-- Alege salariat --</option>
                {staff.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-extrabold text-[#86868B] block mb-1">Ziua selectată:</label>
                <input 
                  type="number" 
                  min="1" 
                  max={daysInMonth}
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#F2F2F7] text-xs font-bold p-3 rounded-xl border border-transparent focus:border-[#034EA2] outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-extrabold text-[#86868B] block mb-1">Număr ore:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="16"
                  value={logHours}
                  onChange={(e) => setLogHours(parseInt(e.target.value) || 8)}
                  className="w-full bg-[#F2F2F7] text-xs font-bold p-3 rounded-xl border border-transparent focus:border-[#034EA2] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold text-[#86868B] block mb-1">Note / Mențiuni (Ex: Sâmbătă plată dublă):</label>
              <input 
                type="text" 
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
                placeholder="Ex. Schimb de zi, ore suplimentare."
                className="w-full bg-[#F2F2F7] text-xs font-medium p-3 rounded-xl border border-transparent focus:border-[#034EA2] outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#1D1D1F] hover:bg-[#034EA2] text-white font-bold py-3.5 rounded-xl text-xs uppercase transition-all tracking-normal cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              Salvează în Pontaj
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Instruituni SSM si Conditii de Munca */}
        <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 shadow-sm md:col-span-2 space-y-4">
          <div className="border-b border-[#F2F2F7] pb-3">
            <h4 className="font-bold text-[#1D1D1F] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Notificări de Protecție & Statut Juridic
            </h4>
            <p className="text-[10px] text-slate-500">Regulamentul de ordine interioară auto raliat la prevederile legale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-600">
            <div className="bg-[#F2F2F7]/40 p-4 rounded-2xl border border-dashed border-[#E9E9EB] space-y-2">
              <span className="font-extrabold text-slate-900 block text-xs">Ore Suplimentare (Sănătate)</span>
              <p className="text-[11px] leading-relaxed text-[#86868B]">
                Conform Art. 104 din Codul Muncii RM, orele suplimentare sunt limitate la un maxim de 120 de ore pe an calendaristic (sau 240 ore cu acordul scris al sindicatului sau reprezentanților).
              </p>
            </div>

            <div className="bg-[#F2F2F7]/40 p-4 rounded-2xl border border-dashed border-[#E9E9EB] space-y-2">
              <span className="font-extrabold text-slate-900 block text-xs">Distanțe Sociale și Repaus</span>
              <p className="text-[11px] leading-relaxed text-[#86868B]">
                Toți salariații de la Atelierele de Mecanică și Tinichigerie beneficiază de 2 zile libere consecutive pe săptămână (de regulă weekend sau conform graficului de livrări alternative).
              </p>
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-[#034EA2] shrink-0" />
            <div>
              <span className="font-bold text-[#034EA2] text-xs block">Generare automată Raport Pontaj (F12)</span>
              <span className="text-[10px] text-slate-500 leading-normal block">
                Tabelul reflectă direct orele cumulate zilnic. În caz de audit, pontajul lunar este pre-completat în formatul Excel standard aprobat de Serviciul Fiscal de Stat RM.
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
