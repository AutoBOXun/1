import React, { useState, useMemo, useCallback } from "react";
import { User, UserRole, Timesheet, ServiceJob } from "../types";
import { getRoleAvatar } from "../utils/avatarUtils";
import { 
  Users, UserPlus, Clock, Heart, Award, ShieldAlert, Phone, Mail, FileText, 
  Trash2, Plus, DollarSign, BarChart3, Star, Briefcase, Sparkles, CalendarDays, UserMinus, ListChecks, Settings
} from "lucide-react";
import { RolesView } from "./hr-subviews/RolesView";
import { RoleDetailsView } from "./hr-subviews/RoleDetailsView";
import { AddRoleView } from "./hr-subviews/AddRoleView";
import { VacationView } from "./hr-subviews/VacationView";
import { TerminatedView } from "./hr-subviews/TerminatedView";
import { TimesheetView } from "./hr-subviews/TimesheetView";
import { SettingsView } from "./hr-subviews/SettingsView";
import { rolesCatalog } from "../data/roles";

interface HRDashboardProps {
  users: User[];
  timesheets: Timesheet[];
  serviceJobs: ServiceJob[];
  onAddUser: (user: User) => void;
  onSelectEmployee: (empId: string) => void;
  onNotify: (msg: string, type?: "success" | "info") => void;
  onAddTimesheet?: (timesheet: Timesheet) => void;
  hideHeader?: boolean;
  onExport: (table: string) => void;
  onImport: (table: string, file: File) => void;
  onDelete: (table: string) => void;
}

export default function HRDashboard({
  users,
  timesheets,
  serviceJobs,
  onAddUser,
  onSelectEmployee,
  onNotify,
  onAddTimesheet,
  hideHeader = false,
  onExport,
  onImport,
  onDelete
}: HRDashboardProps) {
  const staff = useMemo(() => users.filter(u => u.role !== UserRole.CLIENT && u.role !== UserRole.OWNER), [users]);
  const [roles, setRoles] = useState(rolesCatalog);

  const [showAddForm, setShowAddForm] = useState(false);
  const [activeSubView, setActiveSubView] = useState("Angajați");
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [empRole, setEmpRole] = useState<UserRole>(UserRole.MECHANIC);
  const [empAvatar, setEmpAvatar] = useState("");
  const [empPassword, setEmpPassword] = useState("");

  const stats = useMemo(() => {
    let totalCommissionsCombined = 0;
    let totalHoursCombined = 0;

    serviceJobs.forEach(job => {
      job.labor.forEach(l => {
        totalHoursCombined += l.hoursSpent;
        const taskCost = l.hourlyRate * l.hoursSpent;
        totalCommissionsCombined += (taskCost * l.commissionRate) / 100;
      });
    });

    const manualHoursCombined = timesheets.reduce((acc, curr) => acc + curr.hoursWorked, 0);
    const grandTotalHours = totalHoursCombined + manualHoursCombined;
    const baseSalarySum = staff.length * 1500;
    const totalPayrollEstimate = baseSalarySum + totalCommissionsCombined;

    return { totalCommissionsCombined, totalHoursCombined, grandTotalHours, totalPayrollEstimate };
  }, [serviceJobs, timesheets, staff]);

  const { totalCommissionsCombined, totalHoursCombined, grandTotalHours, totalPayrollEstimate } = stats;

  const handleRegisterEmployee = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empEmail || !empPhone) {
      onNotify("Vă rugăm să completați toate câmpurile obligatorii!", "info");
      return;
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: empName,
      email: empEmail,
      phone: empPhone,
      role: empRole,
      avatarUrl: empAvatar || getRoleAvatar("HR"),
      password: empPassword
    };

    onAddUser(newUser);
    onNotify(`Angajatul ${empName} a fost înregistrat cu succes!`, "success");
    
    setEmpName("");
    setEmpEmail("");
    setEmpPhone("");
    setEmpAvatar("");
    setEmpPassword("");
    setShowAddForm(false);
  }, [empName, empEmail, empPhone, empRole, empAvatar, empPassword, onNotify, onAddUser]);

  return (
    <div className="space-y-4 font-sans text-slate-800">
      
      {!hideHeader && (
        <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-2xl p-4 border border-[#E9E9EB] shadow-sm gap-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-4">
              <Users className="w-6 h-6 text-blue-600" />
              Resurse Umane (HR)
            </h3>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-normal pl-10">Evidența personalului și performanță</p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl text-sm flex items-center gap-2 transition-all shadow-md shadow-blue-100"
          >
            <UserPlus className="w-4 h-4" />
            {showAddForm ? "Închide Formular" : "Înregistrează Angajat"}
          </button>
        </div>
        </>
      )}

        {/* Toolbox Actions */}
        <div className="flex gap-3 overflow-x-auto pb-4 justify-center">
          {[
            { label: "Lista de funcții", icon: Briefcase },
            { label: "Angajați", icon: Users },
            { label: "Concedii", icon: CalendarDays },
            { label: "Concediați", icon: UserMinus },
            { label: "Tabel de pontaj", icon: ListChecks },
            { label: "Setări HR", icon: Settings },
          ].map(action => (
            <button 
              key={action.label} 
              onClick={() => {
                setActiveSubView(action.label);
                setSelectedRoleId(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 bg-white border ${activeSubView === action.label ? 'border-blue-500 text-blue-600' : 'border-slate-200'} rounded-xl text-sm font-medium text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all whitespace-nowrap shadow-sm`}
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </button>
          ))}
        </div>

      {showAddForm && (
        <form 
          onSubmit={handleRegisterEmployee}
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-6"
        >
          <div className="border-b border-slate-100 pb-4">
            <h4 className="font-semibold text-slate-900">Contractare & Fișă Angajat Nou</h4>
            <p className="text-sm text-slate-500">Adaugă elementele de identitate și asignează rolul oficial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-1">Nume Complet:</label>
              <input 
                type="text" required value={empName} onChange={e => setEmpName(e.target.value)} 
                placeholder="Ex. Vasile Chirtoacă" 
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-1">Email:</label>
              <input 
                type="email" required value={empEmail} onChange={e => setEmpEmail(e.target.value)} 
                placeholder="Ex. vasile.c@autobox.md" 
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-1">Telefon:</label>
              <input 
                type="tel" required value={empPhone} onChange={e => setEmpPhone(e.target.value)} 
                placeholder="Ex. 068112233" 
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-1">Parola Cont:</label>
              <input 
                type="password" required value={empPassword} onChange={e => setEmpPassword(e.target.value)} 
                placeholder="Ex. ******" 
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase font-semibold text-slate-400 block mb-1">Rol / Funcție:</label>
              <select 
                value={empRole} onChange={e => setEmpRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
              >
                <option value={UserRole.MECHANIC}>Mecanic auto</option>
                <option value={UserRole.ADMIN}>Administrator</option>
                <option value={UserRole.RECEPTION}>Recepție</option>
                <option value={UserRole.ACCOUNTANT}>Contabilitate</option>
              </select>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl text-sm transition-all shadow-md"
          >
            Salvează Angajat
          </button>
        </form>
      )}

      {activeSubView === "Angajați" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: "Echipă Activă", value: `${staff.length} angajați`, icon: Users, bgColor: "bg-blue-50", color: "text-blue-600" },
                { label: "Fond Salarii Mediu", value: `${totalPayrollEstimate.toLocaleString()} MDL`, icon: DollarSign, bgColor: "bg-emerald-50", color: "text-emerald-600" },
                { label: "Ore Pontate", value: `${grandTotalHours.toFixed(1)} h`, icon: Clock, bgColor: "bg-amber-50", color: "text-amber-600" },
                { label: "Rating Eficiență", value: "98.4%", icon: Star, bgColor: "bg-rose-50", color: "text-rose-600" }
            ].map((stat, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-normal text-slate-400">{stat.label}</span>
                    <div className={`w-8 h-8 rounded-full ${stat.bgColor} ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 leading-none">{stat.value}</h4>
                </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" />
                Dosare & Registre Personal Activ
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staff.map((emp) => (
                <div key={emp.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 text-sm transition-all hover:border-blue-200 hover:shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={emp.avatarUrl} alt={emp.name} className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h5 className="font-semibold text-slate-900">{emp.name}</h5>
                      <span className="inline-block mt-0.5 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold uppercase rounded-lg">
                        {emp.role}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 font-medium text-slate-600">
                    <p className="flex justify-between"><span>Email:</span> {emp.email}</p>
                    <p className="flex justify-between"><span>Contact:</span> {emp.phone}</p>
                  </div>
                  <button 
                    onClick={() => onSelectEmployee(emp.id)}
                    className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-xs hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5" /> Deschide Fișa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeSubView === "Lista de funcții" ? (
        selectedRoleId ? (
          <RoleDetailsView 
            role={roles.find(r => r.id === selectedRoleId)!}
            onBack={() => setSelectedRoleId(null)}
            onUpdateUnits={(id, units) => {
                setRoles(roles.map(r => r.id === id ? {...r, totalUnits: units} : r));
                setSelectedRoleId(null);
            }}
          />
        ) : isAddingRole ? (
          <AddRoleView 
            onSave={(newRole) => {
              setRoles([...roles, { ...newRole, id: `r-${Date.now()}`, responsibilities: newRole.responsibilities || [], occupiedUnits: 0 }]);
              setIsAddingRole(false);
            }}
            onCancel={() => setIsAddingRole(false)}
          />
        ) : (
          <RolesView 
            onSelectRole={setSelectedRoleId} 
            staff={staff} 
            onSelectEmployee={onSelectEmployee} 
            onAddRole={() => setIsAddingRole(true)} 
            roles={roles}
          />
        )
      ) : activeSubView === "Concedii" ? (
        <VacationView staff={staff} onNotify={onNotify} />
      ) : activeSubView === "Concediați" ? (
        <TerminatedView staff={staff} onNotify={onNotify} />
      ) : activeSubView === "Tabel de pontaj" ? (
        <TimesheetView staff={staff} timesheets={timesheets} onAddTimesheet={onAddTimesheet} onNotify={onNotify} />
      ) : activeSubView === "Setări HR" ? (
        <SettingsView 
          onNotify={onNotify} 
          onExport={onExport}
          onImport={onImport}
          onDelete={onDelete}
        />
      ) : null}
    </div>
  );
}
