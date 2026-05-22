import React, { useState } from "react";
import { User, UserRole, Timesheet, ServiceJob, JobStatus } from "../types";
import { getRoleAvatar } from "../utils/avatarUtils";
import { 
  Briefcase, Phone, Mail, Clock, CreditCard, ChevronLeft, Calendar, FileText, 
  MapPin, Award, Star, TrendingUp, AlertCircle, PlusCircle, Bookmark, CheckCircle, Save,
  ShieldCheck, UserCheck, Download, Printer, Copy, Info, CalendarDays, ShieldAlert, Check, X, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { jobDescriptions } from "../data/jobDescriptions";
import { getEquivalentProfile, RoleAccessProfile } from "../utils/rbac";

export interface VacationRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: "Anual" | "Medical" | "Fără Plată" | "Eveniment Deosebit";
  status: "În așteptare" | "Aprobat" | "Respins";
  notes?: string;
  daysRequested: number;
}

interface EmployeeSheetProps {
  employeeId: string | null;
  users: User[];
  serviceJobs: ServiceJob[];
  timesheets: Timesheet[];
  onAddTimesheet: (ts: Timesheet) => void;
  onBack: () => void;
  onNotify: (message: string, type?: "success" | "info") => void;
  currentUser?: User | null;
}

type SheetTab = "overview" | "fisa_postului" | "contract_cim" | "history" | "pontaj" | "concedii" | "salariu";

export default function EmployeeSheet({
  employeeId,
  users,
  serviceJobs,
  timesheets,
  onAddTimesheet,
  onBack,
  onNotify,
  currentUser
}: EmployeeSheetProps) {
  const [activeTab, setActiveTab] = useState<SheetTab>("overview");
  
  // Find employee
  const employee = users.find(u => u.id === employeeId);

  // States for internal performance notes
  const [internalNotes, setInternalNotes] = useState(() => {
    if (employeeId) {
      const saved = localStorage.getItem(`emp-internal-notes-${employeeId}`);
      return saved || "Angajat de încredere, punctual și axat pe soluționarea directă a problemelor tehnice complexe.";
    }
    return "";
  });

  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // States for manual hours addition
  const [logHours, setLogHours] = useState<number>(8);
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [logNotes, setLogNotes] = useState<string>("Sesiune tehnică, asistență mecanică devize.");

  // States for Vacation Form
  const [vacStartDate, setVacStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [vacEndDate, setVacEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split("T")[0];
  });
  const [vacType, setVacType] = useState<"Anual" | "Medical" | "Fără Plată" | "Eveniment Deosebit">("Anual");
  const [vacNotes, setVacNotes] = useState<string>("");

  // Load/save vacations
  const [vacations, setVacations] = useState<VacationRequest[]>(() => {
    if (employeeId) {
      const saved = localStorage.getItem(`emp-vacations-${employeeId}`);
      if (saved) return JSON.parse(saved);
      
      const defaultVacations: VacationRequest[] = [
        {
          id: `vac-1`,
          startDate: "2025-08-10",
          endDate: "2025-08-24",
          type: "Anual",
          status: "Aprobat",
          notes: "Concediu de odihnă anual programat (perioada estivală).",
          daysRequested: 14
        },
        {
          id: `vac-2`,
          startDate: "2026-02-02",
          endDate: "2026-02-06",
          type: "Medical",
          status: "Aprobat",
          notes: "Recuperare gripă sezonieră, certificat medical depus.",
          daysRequested: 5
        }
      ];
      localStorage.setItem(`emp-vacations-${employeeId}`, JSON.stringify(defaultVacations));
      return defaultVacations;
    }
    return [];
  });

  if (!employee) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-4 rounded-2xl border border-red-100 shadow-xl space-y-6 text-center animate-in fade-in slide-in-from-bottom duration-300">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-950 text-lg tracking-tight">Angajatul nu a fost găsit</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Identificatorul angajatului selectat este invalid sau nu există în baza de date AutoBOX.
          </p>
        </div>
        <button 
          onClick={onBack}
          className="w-full bg-[#034EA2] text-white font-bold py-4 rounded-[22px] text-xs uppercase tracking-normal hover:bg-[#023a7a] transition-all"
        >
          Înapoi la Listă
        </button>
      </div>
    );
  }

  // Calculate stats dynamically
  let totalCommissionsEarned = 0;
  let hoursLoggedOnJobs = 0;
  let allocatedJobsCount = 0;
  const jobsWorkedOn: { job: ServiceJob; hours: number; commission: number; desc: string }[] = [];

  serviceJobs.forEach(job => {
    job.labor.forEach(l => {
      if (l.mechanicId === employee.id) {
        allocatedJobsCount++;
        hoursLoggedOnJobs += l.hoursSpent;
        const taskCost = l.hourlyRate * l.hoursSpent;
        const taskMecCom = (taskCost * l.commissionRate) / 100;
        totalCommissionsEarned += taskMecCom;
        jobsWorkedOn.push({
          job,
          hours: l.hoursSpent,
          commission: taskMecCom,
          desc: l.description
        });
      }
    });
  });

  const empTimesheets = timesheets.filter(t => t.employeeId === employee.id);
  const manualHoursSum = empTimesheets.reduce((acc, curr) => acc + curr.hoursWorked, 0);
  
  // Utilizăm arhitectura inteligentă de privilegii și salarizare stabilita prin profiling-ul RBAC
  const rbacProfile = getEquivalentProfile(employee.title || employee.role || "");
  const baseSalaryFallback = rbacProfile.baseSalaryMDL;

  const grandTotalHours = hoursLoggedOnJobs + manualHoursSum;
  const grandTotalLichidare = baseSalaryFallback + totalCommissionsEarned;

  // Constants / Fallback data structures for Employee File Details
  const dummyPersonalDetails = {
    idnp: `1985${employee.id.replace(/\D/g, "") || "98"}4021008`,
    address: "Str. Alexandru cel Bun 45, Ungheni, Republica Moldova",
    hireDate: "2024-03-12",
    workContractType: "Nedeterminat (FTE)",
    department: rbacProfile.category === "tehnic" ? "Atelier Mecanică-Tren Rulare" : rbacProfile.category === "auxiliar" ? "Echipă Tehnică Auxiliară" : "Secție Administrativă & Management",
    specializations: rbacProfile.category === "tehnic"
      ? ["Diagnoză și Electronică Auto", "Reglare Stand Mecanic Unghi Direcție", "Revizii Curate Componente Transmisie"]
      : rbacProfile.category === "auxiliar"
      ? ["Gestiune Tehnică Spălătorie", "Curățare Ecologică Chimică", "Proceduri Securitate RAMPA"]
      : ["Gestiune CRM & ERP AutoBOX", "Suport Clienți / Întocmire Devize", "Contabilitate și Analiză Financiară"],
    workLicenseGrade: rbacProfile.category === "tehnic" ? "Certificat Tehnic Clasa A / Gradul III" : "Atestat Administrativ Clasa I",
    equipmentsReceived: rbacProfile.category === "tehnic" 
      ? "Salopetă Întărită AutoBOX, Bocanci Protecție S3, Trusă Completă YATO 120 piese" 
      : rbacProfile.category === "auxiliar"
      ? "Echipament Protecție Mediu Toxic, Manual Proceduri Spălare, Trusă Lavete Microfibră"
      : "Laptop Lenovo ThinkPad L14, Telefon Mobil Corporativ, Token Securitate One UI Secure"
  };

  // Precise Job Description Selection Logic based on Title or Role
  const getJobDescription = () => {
    const titleUpper = (employee.title || "").toUpperCase();
    
    // Check by Title Keywords
    if (titleUpper.includes("DIRECTOR") || titleUpper.includes("OWNER") || titleUpper.includes("PROPRIETAR")) return jobDescriptions["OWNER"];
    if (titleUpper.includes("RECEPTOR") || titleUpper.includes("RECEPȚIE") || titleUpper.includes("CONSILIER")) return jobDescriptions["RECEPTION"];
    if (titleUpper.includes("ELECTRICIAN") || titleUpper.includes("DIAGNOSTICIAN")) return jobDescriptions["ELECTRICIAN"];
    if (titleUpper.includes("MOTORIST")) return jobDescriptions["MOTORIST"];
    if (titleUpper.includes("GEOMETRIE")) return jobDescriptions["GEOMETRY"];
    if (titleUpper.includes("TINICHIGIU")) return jobDescriptions["BODYWORK"];
    if (titleUpper.includes("VOPSITOR")) return jobDescriptions["PAINTER"];
    if (titleUpper.includes("DETAILING")) return jobDescriptions["DETAILING"];
    if (titleUpper.includes("VULCANIZATOR")) return jobDescriptions["VULCANIZER"];
    if (titleUpper.includes("SPĂLĂTOR")) return jobDescriptions["WASHER"];
    if (titleUpper.includes("ACHIZITII") || titleUpper.includes("ACHIZITOR")) return jobDescriptions["PURCHASING"];
    if (titleUpper.includes("CONTABIL") || titleUpper.includes("ECONOMIST")) return jobDescriptions["ACCOUNTANT"];
    if (titleUpper.includes("HR") || titleUpper.includes("UMANE")) return jobDescriptions["HR"];
    if (titleUpper.includes("AUXILIAR") || titleUpper.includes("SERVICIU")) return jobDescriptions["AUXILIARY"];

    // Fallback by Role
    if (employee.role === UserRole.OWNER) return jobDescriptions["OWNER"];
    if (employee.role === UserRole.RECEPTION) return jobDescriptions["RECEPTION"];
    if (employee.role === UserRole.ACCOUNTANT) return jobDescriptions["ACCOUNTANT"];
    if (employee.role === UserRole.HR) return jobDescriptions["HR"];
    if (employee.role === UserRole.MECHANIC) return jobDescriptions["MECHANIC"];

    return jobDescriptions["GENERIC"];
  };

  const jd = getJobDescription();

  const handleSaveNotes = () => {
    localStorage.setItem(`emp-internal-notes-${employee.id}`, internalNotes);
    setIsEditingNotes(false);
    onNotify("Notițele de performanță au fost salvate cu succes!", "success");
  };

  const handleRequestVacation = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(vacStartDate);
    const end = new Date(vacEndDate);
    if (end < start) {
      onNotify("Data de sfârșit nu poate fi din trecut sau înaintea datei de început!", "info");
      return;
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newVac: VacationRequest = {
      id: `vac-${Date.now()}`,
      startDate: vacStartDate,
      endDate: vacEndDate,
      type: vacType,
      status: "În așteptare",
      notes: vacNotes || `${vacType} solicitat de ${employee.name}.`,
      daysRequested: diffDays
    };

    const updated = [newVac, ...vacations];
    setVacations(updated);
    localStorage.setItem(`emp-vacations-${employee.id}`, JSON.stringify(updated));
    setVacNotes("");
    onNotify(`Cererea de concediu de ${diffDays} zile a fost înregistrată!`, "success");
  };

  const handleUpdateVacationStatus = (vacId: string, status: "Aprobat" | "Respins") => {
    const updated = vacations.map(v => v.id === vacId ? { ...v, status } : v);
    setVacations(updated);
    localStorage.setItem(`emp-vacations-${employee.id}`, JSON.stringify(updated));
    onNotify(`Cererea de concediu a fost ${status === "Aprobat" ? "aprobată" : "respinsă"} cu succes.`, "success");
  };

  const handleSubmitTimesheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (logHours <= 0) {
      onNotify("Numărul de ore lucrate trebuie să fie pozitiv!", "info");
      return;
    }

    const newTs: Timesheet = {
      id: `ts-${Date.now()}`,
      employeeId: employee.id,
      date: logDate,
      hoursWorked: logHours,
      notes: logNotes,
      basePay: 0,
      commissionEarned: 0
    };

    onAddTimesheet(newTs);
    setLogHours(8);
    setLogNotes("Sesiune tehnică, asistență mecanică devize.");
    onNotify(`Pontaj manual de ${logHours} ore înregistrat cu succes pentru ${employee.name}!`, "success");
  };

  const tabs: { id: SheetTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Profil & KPI/RBAC", icon: <UserCheck className="w-4 h-4" /> },
    { id: "concedii", label: "Concedii & Libere", icon: <CalendarDays className="w-4 h-4" /> },
    { id: "salariu", label: "Salarizare", icon: <CreditCard className="w-4 h-4" /> },
    { id: "fisa_postului", label: "Fișa Postului", icon: <FileText className="w-4 h-4" /> },
    { id: "contract_cim", label: "Contract (CIM)", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "history", label: "Activitate Devize", icon: <Briefcase className="w-4 h-4" /> },
    { id: "pontaj", label: "Pontaj Manual", icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-500 text-left">
      
      {/* 1. SECTIUNE INAPOI SI TITLU */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-[#E9E9EB] rounded-2xl text-[#86868B] hover:text-[#1D1D1F] transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#1D1D1F] tracking-tight flex items-center gap-3">
              <img 
                src={employee.avatarUrl || getRoleAvatar(employee.role)} 
                alt={employee.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
              Fisă Angajat: {employee.name}
            </h1>
            <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-1 ml-13">
               GESTIUNE RESURSE UMANE • AUTOBOX UNGHENI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#E8F0FE] p-1.5 rounded-full border border-indigo-100/50 shadow-sm">
           <div className="px-4 py-2 bg-white rounded-full shadow-sm text-xs font-semibold uppercase tracking-normal text-[#034EA2] flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             Status: Activ
           </div>
           <div className="px-4 py-2 text-xs font-semibold uppercase tracking-normal text-[#86868B]">
             ID: {employee.id.toUpperCase()}
           </div>
        </div>
      </div>

      {/* 2. TAB NAVIGATOR */}
      <div className="flex items-center gap-1.5 bg-[#F2F2F7] p-1.5 rounded-2xl border border-[#E9E9EB] w-full lg:w-max overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-normal transition-all cursor-pointer shrink-0 ${
              activeTab === tab.id 
                ? "bg-[#034EA2] text-white shadow-lg shadow-[#034EA2]/20" 
                : "text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E9E9EB]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW: OVERVIEW */}
        {activeTab === "overview" && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* CARD PROFIL PRINCIPAL */}
            <div className="bg-white border border-[#E9E9EB] rounded-2xl p-4 lg:p-6 shadow-sm flex flex-col lg:flex-row gap-6 items-center lg:items-start">
              <img 
                src={employee.avatarUrl || getRoleAvatar(employee.role)} 
                alt={employee.name} 
                className="w-40 h-40 lg:w-48 lg:h-48 rounded-2xl object-cover bg-slate-50 border-8 border-[#F2F2F7] shadow-xl flex-shrink-0"
                referrerPolicy="no-referrer"
              />

              <div className="space-y-4 flex-1 text-center lg:text-left w-full">
                <div className="space-y-2">
                  <div className="flex flex-col lg:flex-row lg:items-end gap-3 justify-center lg:justify-start">
                    <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">{employee.name}</h2>
                    <span className="px-4 py-1.5 bg-[#1D1D1F] text-white text-xs font-semibold uppercase tracking-normal rounded-full self-center lg:mb-1.5 shadow-sm">
                      {employee.title || employee.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal leading-none">
                    Titular post: {jd?.title || employee.role}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-bold text-[#1D1D1F]">
                  <div className="flex items-center gap-4 bg-[#F2F2F7] p-5 rounded-xl border border-transparent hover:border-[#E8F0FE] transition-colors">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#86868B] shadow-sm">
                       <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal leading-none mb-1">Contact Telefon</p>
                      <span className="text-sm font-bold text-[#1D1D1F] tracking-tight">{employee.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-[#F2F2F7] p-5 rounded-xl border border-transparent hover:border-[#E8F0FE] transition-colors">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#86868B] shadow-sm">
                       <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal leading-none mb-1">E-mail Corporativ</p>
                      <span className="text-sm font-bold text-[#1D1D1F] tracking-tight truncate max-w-[150px] block">{employee.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-[#F2F2F7] p-5 rounded-xl border border-transparent hover:border-[#E8F0FE] transition-colors">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-[#86868B] shadow-sm">
                       <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal leading-none mb-1">Localitate Reședință</p>
                      <span className="text-sm font-bold text-[#1D1D1F] tracking-tight">Ungheni, MD</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                  <div className="group relative">
                    <div className="flex flex-wrap gap-2">
                       {dummyPersonalDetails.specializations.map((spec, sIdx) => (
                         <span key={sIdx} className="bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
                           <CheckCircle className="w-3 h-3" />
                           {spec}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI INDICATORS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Ore Logate Luna Curentă", value: `${grandTotalHours.toFixed(1)}h`, sub: `${hoursLoggedOnJobs.toFixed(1)} deviz + ${manualHoursSum.toFixed(1)} m`, icon: <Clock />, color: "bg-[#1D1D1F] text-white" },
                { label: "Comisioane Acumulate", value: `${totalCommissionsEarned.toLocaleString()} MDL`, sub: `Din ${allocatedJobsCount} operații finalizate`, icon: <CreditCard />, color: "bg-white text-[#1D1D1F] border border-[#E9E9EB]" },
                { label: "Venit Total Estimativ", value: `${grandTotalLichidare.toLocaleString()} MDL`, sub: `Inclusiv Salariu de bază`, icon: <TrendingUp />, color: "bg-white text-[#1D1D1F] border border-[#E9E9EB]" },
                { label: "Evaluare Performanță", value: "5.0 / 5.0", sub: "Bazat pe feedback post-service", icon: <Star />, color: "bg-white text-amber-500 border border-[#E9E9EB]" }
              ].map((kpi, kIdx) => (
                <div key={kIdx} className={`${kpi.color} rounded-2xl p-4 space-y-4 shadow-sm group hover:scale-[1.02] transition-transform`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-normal opacity-60">{kpi.label}</span>
                    <div className="w-10 h-10 rounded-2xl bg-current opacity-10 flex items-center justify-center">
                       {kpi.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-mono tracking-tight">{kpi.value}</h3>
                    <p className="text-xs font-semibold uppercase tracking-normal opacity-40 mt-2">{kpi.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CARD CLASIFICARE INTELIGENTĂ RBAC (Samsung One UI 8 Style) */}
            <div className="bg-white border border-[#E9E9EB] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#F2F2F7] pb-4">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-[#1D1D1F] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#034EA2]" /> Clasificare Acces Securitate (RBAC)
                  </h3>
                  <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-normal">Grup de responsabilitate și privilegii funcționale în timp real</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#86868B] uppercase">Sistem Echivalent:</span>
                  <span className="px-3.5 py-1 bg-[#1D1D1F] text-white text-[10px] font-mono font-bold uppercase rounded-full">
                    {rbacProfile.systemRole}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Grupa Fundamentala */}
                <div className="md:col-span-4 p-5 bg-[#F2F2F7] rounded-xl space-y-3 border border-transparent hover:border-[#E9E9EB] transition-all">
                  <p className="text-[10px] text-[#86868B] font-extrabold uppercase tracking-normal">Grupa Fundamentala Personal</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      rbacProfile.category === "administrativ" 
                        ? "bg-blue-100 text-[#034EA2]" 
                        : rbacProfile.category === "tehnic"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-teal-100 text-teal-700"
                    }`}>
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[#86868B] font-bold uppercase tracking-normal leading-none block">Categorie Angajat</span>
                      <p className="text-sm font-extrabold text-[#1D1D1F] mt-1 uppercase tracking-tight">
                        {rbacProfile.category === "administrativ" 
                          ? "Personal Administrativ" 
                          : rbacProfile.category === "tehnic"
                          ? "Personal Tehnic (Atelier)"
                          : "Personal Auxiliar / Suport"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Privilegii in timp real */}
                <div className="md:col-span-8 space-y-2">
                  <p className="text-[10px] text-[#86868B] font-extrabold uppercase tracking-normal mb-3">Drepturi Active de Securitate în Platformă:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { key: "viewFinancials", label: "Financiar & Salarii" },
                      { key: "editInventory", label: "Gestiune Stocuri" },
                      { key: "manageClients", label: "Gestiune Clienți" },
                      { key: "manageWorkorders", label: "Fișe & Devize" },
                      { key: "logLaborHours", label: "Pontaj / Manoperă" },
                      { key: "viewAllEmployeeSheets", label: "Dosare Resurse HR" },
                      { key: "approveVacations", label: "Aprobare Concedii" },
                      { key: "editCatalogAndServices", label: "Catalog Servicii" }
                    ].map((perm) => {
                      const isGranted = rbacProfile.permissions[perm.key as keyof typeof rbacProfile.permissions];
                      return (
                        <div key={perm.key} className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                          isGranted 
                            ? "bg-emerald-50/50 border-emerald-100 text-emerald-800" 
                            : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
                        }`}>
                          {isGranted ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="text-[10px] font-bold leading-none">{perm.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* DETALII ADMINISTRATIVE & NOTE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
               <div className="lg:col-span-12 bg-white border border-[#E9E9EB] rounded-2xl p-4 shadow-sm space-y-5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#F2F2F7] pb-8">
                     <div className="space-y-1">
                        <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight flex items-center gap-3">
                           <ShieldCheck className="w-6 h-6 text-[#034EA2]" />
                           Informații Administrative & Notițe Management
                        </h3>
                        <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal ml-9">Dosar intern HR - Acces restricționat</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="space-y-6">
                        <h4 className="text-xs font-semibold uppercase tracking-normal text-[#86868B] flex items-center gap-2">
                           <FileText className="w-4 h-4" /> Date Identificare
                        </h4>
                        <div className="space-y-4">
                           <div className="bg-[#F2F2F7] p-5 rounded-2xl">
                              <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-1">IDNP (Cod Numeric)</p>
                              <p className="font-mono text-sm font-bold text-[#1D1D1F] tracking-normal">{dummyPersonalDetails.idnp}</p>
                           </div>
                           <div className="bg-[#F2F2F7] p-5 rounded-2xl">
                              <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-1">Dată Înregistrare</p>
                              <p className="text-sm font-bold text-[#1D1D1F] tracking-tight">{dummyPersonalDetails.hireDate}</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-xs font-semibold uppercase tracking-normal text-[#86868B] flex items-center gap-2">
                           <Award className="w-4 h-4" /> Structura Postului
                        </h4>
                        <div className="space-y-4">
                           <div className="bg-[#F2F2F7] p-5 rounded-2xl">
                              <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-1">Grup Salarizare</p>
                              <p className="text-sm font-bold text-[#1D1D1F] tracking-tight">{dummyPersonalDetails.workContractType}</p>
                           </div>
                           <div className="bg-[#F2F2F7] p-5 rounded-2xl">
                              <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-1">Nivel Calificare</p>
                              <p className="text-sm font-bold text-[#1D1D1F] tracking-tight">{dummyPersonalDetails.workLicenseGrade}</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h4 className="text-xs font-semibold uppercase tracking-normal text-[#86868B] flex items-center gap-2">
                           <Star className="w-4 h-4" /> Evaluare Internă
                        </h4>
                        <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-2xl h-full flex flex-col justify-between">
                           <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                 {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                              </div>
                              {isEditingNotes ? (
                                <textarea 
                                  value={internalNotes}
                                  onChange={(e) => setInternalNotes(e.target.value)}
                                  className="w-full h-32 bg-white border border-amber-100 p-4 rounded-xl text-xs font-semibold focus:outline-none"
                                />
                              ) : (
                                <p className="text-xs font-semibold text-slate-700 italic leading-relaxed">
                                  "{internalNotes}"
                                </p>
                              )}
                           </div>
                           <button 
                             onClick={isEditingNotes ? handleSaveNotes : () => setIsEditingNotes(true)}
                             className="mt-6 w-full py-3 bg-white border border-amber-200 rounded-xl text-xs font-semibold uppercase tracking-normal hover:bg-amber-100 transition-colors cursor-pointer"
                           >
                             {isEditingNotes ? "Salvează Note" : "Modifică Observații"}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: CONCEDII & LIBERE */}
        {activeTab === "concedii" && (
          <motion.div 
            key="concedii"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Statistici Concedii (One UI Style) */}
            <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Zile Standard */}
              <div className="bg-white border border-[#E9E9EB] p-5 rounded-2xl shadow-sm space-y-1">
                <span className="text-xs text-[#86868B] font-bold uppercase tracking-normal">Zile Anuale Legale</span>
                <p className="text-3xl font-extrabold text-[#1D1D1F] font-mono">{rbacProfile.annualLeaveDays} <span className="text-xs font-bold text-[#86868B]">zile</span></p>
                <p className="text-[10px] text-[#86868B] font-medium leading-none">Conform fișei {rbacProfile.title}</p>
              </div>

              {/* Zile Aprobate */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-5 rounded-2xl shadow-sm space-y-1">
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-normal flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Zile Utilizate (Anual)
                </span>
                <p className="text-3xl font-extrabold text-emerald-800 font-mono">
                  {vacations.filter(v => v.status === "Aprobat" && v.type === "Anual").reduce((sum, v) => sum + v.daysRequested, 0)}{" "}
                  <span className="text-xs font-bold text-emerald-600">zile</span>
                </p>
                <p className="text-[10px] text-emerald-600 font-medium leading-none">Aprobate de HR / Admin</p>
              </div>

              {/* Concediu Rămas */}
              <div className="bg-blue-50/40 border border-blue-100 p-5 rounded-2xl shadow-sm space-y-1">
                <span className="text-xs text-[#034EA2] font-bold uppercase tracking-normal flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#034EA2]" /> Zile de Concediu Rămase
                </span>
                <p className="text-3xl font-extrabold text-[#034EA2] font-mono">
                  {Math.max(0, rbacProfile.annualLeaveDays - vacations.filter(v => v.status === "Aprobat" && v.type === "Anual").reduce((sum, v) => sum + v.daysRequested, 0))}{" "}
                  <span className="text-xs font-bold text-blue-600">zile</span>
                </p>
                <p className="text-[10px] text-[#034EA2] font-medium leading-none">Disponibilitate curentă CIM</p>
              </div>

              {/* În Așteptare / Medical */}
              <div className="bg-amber-50/40 border border-amber-100 p-5 rounded-2xl shadow-sm space-y-1">
                <span className="text-xs text-amber-700 font-bold uppercase tracking-normal flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Cereri în Așteptare
                </span>
                <p className="text-3xl font-extrabold text-amber-800 font-mono">
                  {vacations.filter(v => v.status === "În așteptare").reduce((sum, v) => sum + v.daysRequested, 0)}{" "}
                  <span className="text-xs font-bold text-amber-600">zile</span>
                </p>
                <p className="text-[10px] text-amber-600 font-medium leading-none">Necesită decizie HR / Manager</p>
              </div>
            </div>

            {/* Bara de progres vizuală */}
            <div className="lg:col-span-12 bg-white border border-[#E9E9EB] p-6 rounded-2xl shadow-sm space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-[#1D1D1F] uppercase tracking-normal">
                <span>Rata de consum a concediului de odihnă</span>
                <span className="font-mono">
                  {Math.min(100, Math.round((vacations.filter(v => v.status === "Aprobat" && v.type === "Anual").reduce((sum, v) => sum + v.daysRequested, 0) / rbacProfile.annualLeaveDays) * 100))}% consumat
                </span>
              </div>
              <div className="w-full bg-[#F2F2F7] h-3.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#034EA2] h-full rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, Math.round((vacations.filter(v => v.status === "Aprobat" && v.type === "Anual").reduce((sum, v) => sum + v.daysRequested, 0) / rbacProfile.annualLeaveDays) * 100))}%` }}
                />
              </div>
            </div>

            {/* Solicită Concediu / Formular */}
            <div className="lg:col-span-5 bg-white border border-[#E9E9EB] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="space-y-1 border-b border-[#F2F2F7] pb-4">
                <h3 className="text-base font-bold text-[#1D1D1F] flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-[#034EA2]" /> Solicită Concediu Nou
                </h3>
                <p className="text-[11px] text-[#86868B] font-bold uppercase tracking-normal">Formular pontaj concedii (One UI)</p>
              </div>

              <form onSubmit={handleRequestVacation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-normal ml-1">Dată Început</label>
                    <input 
                      type="date"
                      required
                      value={vacStartDate}
                      onChange={(e) => setVacStartDate(e.target.value)}
                      className="w-full bg-[#F2F2F7] border border-transparent p-3.5 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#034EA2] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-normal ml-1">Dată Sfârșit</label>
                    <input 
                      type="date"
                      required
                      value={vacEndDate}
                      onChange={(e) => setVacEndDate(e.target.value)}
                      className="w-full bg-[#F2F2F7] border border-transparent p-3.5 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#034EA2] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-normal ml-1">Tip Concediu</label>
                  <select
                    value={vacType}
                    onChange={(e) => setVacType(e.target.value as any)}
                    className="w-full bg-[#F2F2F7] border border-transparent p-3.5 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#034EA2] outline-none transition-all"
                  >
                    <option value="Anual">Concediu de Odihnă Anual</option>
                    <option value="Medical">Concediu Medical</option>
                    <option value="Fără Plată">Concediu Fără Plată</option>
                    <option value="Eveniment Deosebit">Eveniment Deosebit (Familie/Căsătorie)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-normal ml-1">Comentariu / Justificare</label>
                  <textarea
                    rows={3}
                    value={vacNotes}
                    onChange={(e) => setVacNotes(e.target.value)}
                    placeholder="Specificați motivele sau detalii adiționale..."
                    className="w-full bg-[#F2F2F7] border border-transparent p-3.5 rounded-xl text-xs font-semibold focus:bg-white focus:border-[#034EA2] outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1D1D1F] text-white font-bold py-4 rounded-xl text-xs uppercase tracking-normal hover:bg-[#034EA2] transition-all shadow-sm cursor-pointer"
                >
                  Trimite spre Aprobare
                </button>
              </form>
            </div>

            {/* Istoric și Flux Aprobare (One UI interactive list) */}
            <div className="lg:col-span-7 bg-white border border-[#E9E9EB] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-4">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-[#1D1D1F]">Flux Aprobare cereri concediu</h3>
                  <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-normal">Status decizional în timp real</p>
                </div>
                <div className="w-8 h-8 bg-[#F2F2F7] rounded-full flex items-center justify-center text-[#86868B]">
                  <CalendarDays className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {vacations.length === 0 ? (
                  <div className="py-12 text-center opacity-30 text-xs font-bold uppercase tracking-normal">
                    Nicio cerere înregistrată.
                  </div>
                ) : (
                  vacations.map((v) => {
                    const isPending = v.status === "În așteptare";
                    return (
                      <div key={v.id} className="p-4 bg-[#F2F2F7] rounded-xl border border-transparent hover:border-[#E9E9EB] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-[#1D1D1F] font-mono">
                              {v.startDate} – {v.endDate}
                            </span>
                            <span className="text-[10px] bg-white border border-[#E9E9EB] text-[#1D1D1F] px-2.5 py-0.5 rounded-full font-bold">
                              {v.daysRequested} zile
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-500 italic">"{v.notes}"</p>
                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-[9px] font-bold uppercase tracking-normal text-[#86868B]">Tip: {v.type}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {/* Status Badge */}
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-normal border ${
                            v.status === "Aprobat" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : v.status === "Respins"
                              ? "bg-rose-50 text-rose-700 border-rose-100"
                              : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                          }`}>
                            {v.status}
                          </span>

                          {/* Control Aprobare pentru Admin/HR/Owner */}
                          {isPending && (
                            <div className="flex gap-1.5 ml-1">
                              <button
                                onClick={() => handleUpdateVacationStatus(v.id, "Aprobat")}
                                title="Aprobă"
                                className="p-1.5 bg-white hover:bg-emerald-500 hover:text-white text-emerald-600 rounded-lg border border-[#E9E9EB] transition-all cursor-pointer shadow-sm active:scale-95"
                              >
                                <Check className="w-3.5 h-3.5 font-bold" />
                              </button>
                              <button
                                onClick={() => handleUpdateVacationStatus(v.id, "Respins")}
                                title="Respinge"
                                className="p-1.5 bg-white hover:bg-rose-500 hover:text-white text-rose-600 rounded-lg border border-[#E9E9EB] transition-all cursor-pointer shadow-sm active:scale-95"
                              >
                                <X className="w-3.5 h-3.5 font-bold" />
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
          </motion.div>
        )}

        {/* VIEW: SALARIZARE */}
        {activeTab === "salariu" && (
          <motion.div 
            key="salariu"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Secțiune principală detalii salariu */}
            <div className="lg:col-span-12 bg-white border border-[#E9E9EB] p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <span className="text-[10px] bg-blue-50 text-[#034EA2] px-3 py-1 rounded-full font-bold uppercase tracking-normal">
                  Grilă Salarizare Activă (CIM & Comisioane AutoBOX)
                </span>
                <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Stat Financiar Angajat - {employee.name}</h3>
                <p className="text-xs text-[#86868B] font-medium leading-none">Rata orară și contractul sunt corelate automat pe baza funcției {rbacProfile.title}</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-[#F2F2F7] hover:bg-[#E9E9EB] text-[#1D1D1F] px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-normal transition-all cursor-pointer border border-[#E9E9EB] active:scale-95"
              >
                <Printer className="w-4 h-4" /> Tipărește Fișa Salarială
              </button>
            </div>

            {/* Calculatoare Salariale / Impozite */}
            <div className="lg:col-span-7 bg-white border border-[#E9E9EB] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="space-y-1.5 border-b border-[#F2F2F7] pb-4">
                <h4 className="text-sm font-bold text-[#1D1D1F] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> Detaliere Impozite & Net (Fluturaș Curent)
                </h4>
                <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-normal">Conform Codului Fiscal din Republica Moldova</p>
              </div>

              {/* Informatii pe Rânduri */}
              <div className="space-y-3">
                {/* Salariu de Bază fix */}
                <div className="flex justify-between items-center py-2.5 border-b border-[#F2F2F7] text-xs">
                  <span className="text-[#86868B] font-medium">Salariu de Bază (CIM lunar fix):</span>
                  <span className="font-bold text-[#1D1D1F] font-mono">{baseSalaryFallback.toLocaleString()} MDL</span>
                </div>

                {/* Comisioane obținute din manopere */}
                <div className="flex justify-between items-center py-2.5 border-b border-[#F2F2F7] text-xs">
                  <span className="text-[#86868B] font-medium flex items-center gap-1.5">
                    Comisioane Devize Lucrate: <span className="text-[10px] text-emerald-600 font-bold">({allocatedJobsCount} task-uri active)</span>
                  </span>
                  <span className="font-bold text-emerald-600 font-mono">+{Math.round(totalCommissionsEarned).toLocaleString()} MDL</span>
                </div>

                {/* Venit Brut Total */}
                <div className="flex justify-between items-center py-3 bg-[#F2F2F7]/50 px-4 rounded-xl text-sm font-bold my-4">
                  <span className="text-[#1D1D1F]">VENIT BRUT TOTAL:</span>
                  <span className="text-[#1D1D1F] font-mono">{(baseSalaryFallback + Math.round(totalCommissionsEarned)).toLocaleString()} MDL</span>
                </div>

                {/* Deduceri detaliat */}
                <div className="space-y-2 bg-[#F2F2F7]/30 p-4 rounded-xl">
                  <p className="text-[10px] text-[#86868B] font-extrabold uppercase tracking-normal">Taxe și Contribuții Reținute:</p>
                  
                  {/* AOAM 9% */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#86868B] font-medium">1. Asigurare Medicală Obligatorie (AOAM 9%):</span>
                    <span className="font-semibold text-[#1D1D1F] font-mono">-{Math.round((baseSalaryFallback + totalCommissionsEarned) * 0.09).toLocaleString()} MDL</span>
                  </div>

                  {/* Impozit pe Venit 12% */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#86868B] font-medium">2. Impozit pe Venit Persoane Fizice (IV 12%):</span>
                    <span className="font-semibold text-[#1D1D1F] font-mono">
                      -{Math.round(((baseSalaryFallback + totalCommissionsEarned) - ((baseSalaryFallback + totalCommissionsEarned) * 0.09)) * 0.12).toLocaleString()} MDL
                    </span>
                  </div>
                </div>

                {/* Total Taxe Reținute */}
                <div className="flex justify-between items-center py-2.5 border-b border-[#F2F2F7] text-xs font-semibold text-rose-600">
                  <span>Total Contribuții Opere Fiscale:</span>
                  <span className="font-mono">
                    -{Math.round(
                      ((baseSalaryFallback + totalCommissionsEarned) * 0.09) + 
                      (((baseSalaryFallback + totalCommissionsEarned) - ((baseSalaryFallback + totalCommissionsEarned) * 0.09)) * 0.12)
                    ).toLocaleString()} MDL
                  </span>
                </div>

                {/* Salariul Net (Lichidare de primit) */}
                <div className="flex justify-between items-center p-5 bg-emerald-50 text-emerald-800 rounded-2xl text-base font-extrabold shadow-sm border border-emerald-100 mt-6">
                  <span className="flex items-center gap-2">
                    SALARIU LICHIDARE (NET):
                  </span>
                  <span className="font-mono text-xl">
                    {Math.round(
                      (baseSalaryFallback + totalCommissionsEarned) - 
                      (
                        ((baseSalaryFallback + totalCommissionsEarned) * 0.09) + 
                        (((baseSalaryFallback + totalCommissionsEarned) - ((baseSalaryFallback + totalCommissionsEarned) * 0.09)) * 0.12)
                      )
                    ).toLocaleString()} MDL
                  </span>
                </div>
              </div>
            </div>

            {/* Istoric Plăți / Fluturași Salariu Recenți */}
            <div className="lg:col-span-5 bg-white border border-[#E9E9EB] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="space-y-1 border-b border-[#F2F2F7] pb-4">
                <h4 className="text-sm font-bold text-[#1D1D1F]">Fluturași Salariu Recenți (Arhivă)</h4>
                <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-normal">Confirmare lichidare cu semnătură digitală</p>
              </div>

              {/* Lista fluturasi */}
              <div className="space-y-3">
                {[
                  { luna: "Aprilie 2026", brut: baseSalaryFallback + 1200, net: Math.round((baseSalaryFallback + 1200) * 0.8), stare: "Lichidat" },
                  { luna: "Martie 2026", brut: baseSalaryFallback + 900, net: Math.round((baseSalaryFallback + 900) * 0.8), stare: "Lichidat" },
                  { luna: "Februarie 2026", brut: baseSalaryFallback + 3400, net: Math.round((baseSalaryFallback + 3400) * 0.8), stare: "Lichidat" }
                ].map((f, idx) => (
                  <div key={idx} className="p-4 bg-[#F2F2F7]/70 rounded-xl border border-transparent hover:border-[#E9E9EB] transition-all space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#1D1D1F]">{f.luna}</span>
                      <span className="text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {f.stare}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[#86868B]">
                      <span>Venit Brut: <strong className="font-mono font-bold text-slate-700">{f.brut.toLocaleString()} MDL</strong></span>
                      <span>Card Net: <strong className="font-mono font-bold text-emerald-600">{f.net.toLocaleString()} MDL</strong></span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/50">
                      <span className="text-[9px] text-[#86868B] font-semibold font-mono">Ref: BOX-PAY-{Date.now() - (idx * 1500000)}</span>
                      <button 
                        onClick={() => {
                          onNotify(`Se descarcă fluturașul semnat digital pentru luna ${f.luna}!`, "success");
                        }}
                        className="text-[10px] text-[#034EA2] hover:underline font-bold transition-all cursor-pointer"
                      >
                        Descarcă PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: FISA POSTULUI */}
        {activeTab === "fisa_postului" && (
          <motion.div 
            key="fisa_postului"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border border-[#E9E9EB] rounded-2xl p-4 lg:p-6 shadow-xl space-y-5"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#F2F2F7] pb-10">
               <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Fișa Postului (Profil Funcțional)</h3>
                  <div className="flex items-center gap-3">
                     <span className="px-3 py-1 bg-[#F2F2F7] text-[#1D1D1F] text-xs font-semibold uppercase tracking-normal rounded-lg">CORM: 121205</span>
                     <span className="text-xs text-[#86868B] font-bold uppercase tracking-normal">AutoBOX v2.1 • Republica Moldova</span>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button className="p-3 bg-[#F2F2F7] text-[#1D1D1F] rounded-2xl hover:bg-[#E9E9EB] transition-all cursor-pointer">
                     <Printer className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 bg-[#034EA2] text-white px-6 py-3.5 rounded-[22px] font-bold text-xs uppercase tracking-normal shadow-lg shadow-[#034EA2]/20 cursor-pointer">
                     <Download className="w-4 h-4" />
                     Descarcă PDF
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-6">
                  {/* SCOP */}
                  <section className="space-y-4">
                     <h4 className="text-xs font-bold text-[#034EA2] uppercase tracking-normal flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">01</div>
                        Scopul General al Postului
                     </h4>
                     <div className="pl-11 pr-10 py-4 bg-[#F2F2F7] rounded-2xl border-l-4 border-[#034EA2]">
                        <p className="text-sm font-bold text-[#1D1D1F] leading-relaxed italic">
                           "{jd?.role || "Misiunea de a asigura excelența tehnică în atelierele AutoBOX Ungheni."}"
                        </p>
                     </div>
                  </section>

                  {/* ATRIBUTII */}
                  <section className="space-y-6">
                     <h4 className="text-xs font-bold text-[#034EA2] uppercase tracking-normal flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">02</div>
                        Atribuții și Sarcini de Serviciu
                     </h4>
                     <div className="grid grid-cols-1 gap-4 pl-11">
                        {jd?.responsibilities.map((resp, i) => (
                          <div key={i} className="flex items-start gap-4 p-5 bg-white border border-[#E9E9EB] rounded-2xl hover:border-indigo-100 transition-colors">
                             <div className="w-6 h-6 rounded-full bg-indigo-50 text-[#034EA2] flex items-center justify-center shrink-0 text-xs font-bold">
                                {i + 1}
                             </div>
                             <p className="text-sm font-bold text-[#1D1D1F] leading-snug">{resp}</p>
                          </div>
                        ))}
                     </div>
                  </section>
               </div>

               <div className="space-y-5">
                  <div className="p-4 bg-[#1D1D1F] text-white rounded-2xl space-y-4 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-10">
                        <ShieldCheck className="w-12 h-12" />
                     </div>
                     <div className="space-y-1 relative z-10">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-normal">Salarizare Targetată</p>
                        <h5 className="text-lg font-bold tracking-tight">{jd?.salaryStructure}</h5>
                     </div>
                     <div className="space-y-1 relative z-10">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-normal">Program de Lucru</p>
                        <h5 className="text-lg font-bold tracking-tight">{jd?.schedule}</h5>
                     </div>
                     <div className="pt-4 border-t border-white/10 space-y-1 relative z-10">
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-normal">Supra-ordonat Direct</p>
                        <h5 className="text-sm font-bold text-white">Administrator General</h5>
                     </div>
                  </div>

                  <div className="p-4 bg-[#F2F2F7] rounded-2xl space-y-6">
                     <h5 className="text-xs font-semibold uppercase tracking-normal text-[#1D1D1F]">Competențe Lingvistice</h5>
                     <div className="space-y-3">
                        {[
                          { lang: "Română (Nativ)", level: "100%" },
                          { lang: "Rusă (Tehnic)", level: "90%" },
                          { lang: "Engleză (Tehnic)", level: "40%" }
                        ].map((l, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex justify-between text-xs font-semibold uppercase">
                                <span>{l.lang}</span>
                                <span className="text-[#034EA2]">{l.level}</span>
                             </div>
                             <div className="h-1.5 bg-white rounded-full overflow-hidden">
                                <div className="h-full bg-[#034EA2]" style={{ width: l.level }} />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: CONTRACT (CIM) */}
        {activeTab === "contract_cim" && (
           <motion.div 
             key="contract_cim"
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.98 }}
             className="bg-[#F2F2F7]/50 border border-[#E9E9EB] rounded-2xl p-6 lg:p-4 shadow-inner space-y-6"
           >
              <div className="bg-white p-6 lg:p-10 shadow-2xl rounded-sm border border-gray-200 max-w-4xl mx-auto space-y-6 font-sans text-[#1D1D1F] relative">
                 {/* Watermark Logo */}
                 <div className="absolute top-1/2 left-32 -translate-y-1/2 opacity-[0.03] -rotate-45 select-none pointer-events-none">
                    <h1 className="text-9xl font-bold">AUTOBOX</h1>
                 </div>

                 {/* HEADER */}
                 <div className="text-center space-y-2 border-b-2 border-gray-900 pb-8">
                    <h1 className="text-xl font-bold uppercase tracking-normal">CONTRACT INDIVIDUAL DE MUNCĂ</h1>
                    <p className="text-sm font-bold">Model conform Codului Muncii al Republicii Moldova</p>
                    <p className="font-sans text-xs text-gray-500 font-bold uppercase tracking-normal mt-4">Nr. AB-{employee.id.toUpperCase()} / 2024</p>
                 </div>

                 {/* PARTIES */}
                 <section className="space-y-6">
                    <p className="leading-relaxed text-sm">
                       Prezentul contract este încheiat între <strong>SUCCES AUTO S.R.L.</strong>, IDNO 1014600000000, 
                       cu sediul în mun. Ungheri, str. Industrială 2a, reprezentată prin <strong>Administrator</strong>, 
                       denumită în continuare <strong>ANGAJATOR</strong>, pe de o parte,
                    </p>
                    <p className="leading-relaxed text-sm">
                       și <strong>{employee.name.toUpperCase()}</strong>, deținător al actului de identitate seria 
                       {dummyPersonalDetails.idnp.substring(0, 2)} nr. {dummyPersonalDetails.idnp.substring(2, 9)}, IDNP {dummyPersonalDetails.idnp}, 
                       cu domiciliul în mun. Ungheni, denumit în continuare <strong>SALARIAT</strong>.
                    </p>
                 </section>

                 <section className="space-y-4">
                    <h4 className="font-bold border-b border-gray-300 pb-2 text-base">Articolul I. OBIECTUL CONTRACTULUI</h4>
                    <p className="text-sm">1.1. Salariatul este angajat în funcția de <strong>{jd?.title || employee.role}</strong>.</p>
                    <p className="text-sm">1.2. Locul de muncă: Sediul principal AutoBOX Ungheni, Atelier Tehnic Central.</p>
                 </section>

                 <section className="space-y-4">
                    <h4 className="font-bold border-b border-gray-300 pb-2 text-base">Articolul II. SALARIZAREA ȘI TIMPUL DE MUNCĂ</h4>
                    <p className="text-sm">2.1. Angajatorul stabilește un salariu lunar de funcție de <strong>{baseSalaryFallback.toLocaleString()} MDL</strong>.</p>
                    <p className="text-sm">2.2. Salariul se achită de două ori pe lună (Avans și Lichidare) prin transfer bancar sau numerar.</p>
                    <p className="text-sm">2.3. Durata normală a timpului de muncă este de 40 ore pe săptămână, 8 ore pe zi.</p>
                 </section>

                 <div className="pt-10 grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <p className="font-bold text-xs uppercase tracking-normal border-b border-gray-900 pb-2">Pentru ANGAJATOR</p>
                       <div className="h-20 border-b border-dashed border-gray-300"></div>
                       <p className="text-xs font-bold text-gray-400">L.Ș. Administrator AutoBOX</p>
                    </div>
                    <div className="space-y-4">
                       <p className="font-bold text-xs uppercase tracking-normal border-b border-gray-900 pb-2">SALARIAT</p>
                       <div className="h-20 border-b border-dashed border-gray-300"></div>
                       <p className="text-xs font-bold text-gray-400">{employee.name}</p>
                    </div>
                 </div>
              </div>

              <div className="flex justify-center gap-4">
                 <button className="flex items-center gap-2 bg-white border border-[#E9E9EB] text-[#1D1D1F] px-4 py-4 rounded-[22px] font-bold text-xs uppercase tracking-normal shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <Printer className="w-4 h-4" /> Imprimă Contract
                 </button>
                 <button className="flex items-center gap-2 bg-[#1D1D1F] text-white px-4 py-4 rounded-[22px] font-bold text-xs uppercase tracking-normal shadow-lg hover:bg-black transition-all cursor-pointer">
                    <Briefcase className="w-4 h-4" /> Validare Juridică
                 </button>
              </div>
           </motion.div>
        )}

        {/* VIEW: HISTORY */}
        {activeTab === "history" && (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-[#E9E9EB] rounded-2xl p-4 lg:p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#F2F2F7] pb-8">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                  Istoric Intervenții Tehnic-Devize
                </h3>
                <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal ml-9">Registrul operațiunilor facturate în ERP</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              {jobsWorkedOn.length === 0 ? (
                <div className="p-4 text-center space-y-4">
                  <div className="w-12 h-12 bg-[#F2F2F7] text-zinc-300 rounded-full flex items-center justify-center mx-auto">
                    <Info className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-[#86868B] uppercase tracking-normal">Niciun deviz asociat înregistrat</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="text-xs font-bold text-[#86868B] uppercase tracking-normal border-b border-[#F2F2F7]">
                      <th className="px-4 py-4">Cod Fişă</th>
                      <th className="px-4 py-4">Detalii Tehnice Manoperă</th>
                      <th className="px-4 py-4 text-center">Timp Realizat</th>
                      <th className="px-4 py-4 text-right">Comision Brut</th>
                      <th className="px-4 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F2F7]">
                    {jobsWorkedOn.map((item, idx) => (
                      <tr key={idx} className="hover:bg-[#F2F2F7]/50 transition-all group">
                        <td className="px-4 py-6 font-mono text-xs font-bold text-[#034EA2]">
                           <span className="bg-[#E8F0FE] border border-blue-100/50 px-2 py-1 rounded-lg">
                              {item.job.id.toUpperCase()}
                           </span>
                        </td>
                        <td className="px-4 py-6">
                           <p className="text-xs font-bold text-[#1D1D1F] leading-tight">{item.desc}</p>
                           <p className="text-xs text-[#86868B] font-bold mt-1">Tarif: {item.job.labor[0]?.hourlyRate} MDL/h</p>
                        </td>
                        <td className="px-4 py-6 text-center">
                           <div className="inline-flex items-center gap-2 bg-[#F2F2F7] px-3 py-1.5 rounded-full font-mono text-xs font-bold">
                              <Clock className="w-3.5 h-3.5 text-[#034EA2]" />
                              {item.hours.toFixed(1)} h
                           </div>
                        </td>
                        <td className="px-4 py-6 text-right">
                           <p className="text-sm font-bold text-emerald-600 font-mono">+{item.commission.toLocaleString()} MDL</p>
                           <p className="text-xs font-bold text-emerald-600/60 uppercase">Rată: {item.job.labor[0]?.commissionRate}%</p>
                        </td>
                        <td className="px-4 py-6 text-center">
                           <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-normal ${
                             item.job.status === JobStatus.FINISHED 
                               ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                               : "bg-blue-50 text-blue-600 border border-blue-100" 
                           }`}>
                             {item.job.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW: PONTAJ */}
        {activeTab === "pontaj" && (
          <motion.div 
            key="pontaj"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4"
          >
            <div className="lg:col-span-5 bg-white border border-[#E9E9EB] rounded-2xl p-4 lg:p-6 shadow-sm space-y-5">
               <div className="space-y-1 border-b border-[#F2F2F7] pb-6">
                  <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight flex items-center gap-3">
                     <PlusCircle className="w-6 h-6 text-emerald-600" />
                     Înregistrare Prezență
                  </h3>
                  <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal ml-9">Adăugare manuală ore suplimentare</p>
               </div>

               <form onSubmit={handleSubmitTimesheet} className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-[#1D1D1F] uppercase tracking-normal ml-2">Data Calendaristică</label>
                        <input 
                          type="date"
                          required
                          value={logDate}
                          onChange={(e) => setLogDate(e.target.value)}
                          className="w-full bg-[#F2F2F7] border border-transparent p-4 rounded-2xl text-xs font-bold focus:bg-white focus:border-[#034EA2] outline-none transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-[#1D1D1F] uppercase tracking-normal ml-2">Număr Ore</label>
                        <input 
                          type="number"
                          required
                          min="1"
                          max="24"
                          value={logHours}
                          onChange={(e) => setLogHours(Number(e.target.value))}
                          className="w-full bg-[#F2F2F7] border border-transparent p-4 rounded-2xl text-xs font-bold focus:bg-white focus:border-[#034EA2] outline-none transition-all font-mono"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-[#1D1D1F] uppercase tracking-normal ml-2">Justificare / Activitate</label>
                     <textarea 
                       required
                       rows={4}
                       value={logNotes}
                       onChange={(e) => setLogNotes(e.target.value)}
                       className="w-full bg-[#F2F2F7] border border-transparent p-4 rounded-2xl text-xs font-bold focus:bg-white focus:border-[#034EA2] outline-none transition-all"
                       placeholder="Descrieți motivele orelor adăugate..."
                     />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#1D1D1F] text-white font-bold py-5 rounded-[22px] text-xs uppercase tracking-normal hover:bg-emerald-600 transition-all shadow-xl shadow-slate-100 cursor-pointer"
                  >
                    Confirmă Pontaj
                  </button>
               </form>
            </div>

            <div className="lg:col-span-7 bg-white border border-[#E9E9EB] rounded-2xl p-4 lg:p-6 shadow-sm space-y-4">
               <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-6">
                  <div className="space-y-1">
                     <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight">Istoric Prezențe</h3>
                     <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal italic ml-0">Ultimele pontaje înregistrate manual</p>
                  </div>
                  <div className="w-10 h-10 bg-[#F2F2F7] rounded-full flex items-center justify-center text-[#86868B]">
                     <Clock className="w-5 h-5" />
                  </div>
               </div>

               <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {empTimesheets.length === 0 ? (
                    <div className="py-5 text-center opacity-30">
                       <p className="text-xs font-semibold uppercase tracking-normal">Niciun pontaj găsit</p>
                    </div>
                  ) : (
                    empTimesheets.map((ts) => (
                      <div key={ts.id} className="p-6 bg-[#F2F2F7] rounded-2xl border border-transparent hover:border-[#E9E9EB] transition-all group">
                         <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal flex items-center gap-2">
                               <Calendar className="w-3.5 h-3.5" />
                               {ts.date}
                            </span>
                            <span className="bg-white border border-[#E9E9EB] text-[#1D1D1F] px-4 py-1.5 rounded-full text-xs font-bold font-mono shadow-sm">
                               {ts.hoursWorked} ORE
                            </span>
                         </div>
                         <p className="text-xs font-bold text-[#1D1D1F] leading-relaxed italic">"{ts.notes}"</p>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

