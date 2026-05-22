import React from "react";
import { User, UserRole, Timesheet } from "../types";
import { getRoleAvatar } from "../utils/avatarUtils";
import { Users, Shield, Briefcase, Phone, Mail, Clock, CreditCard, Search, ChevronLeft, ArrowRight, UserCheck, Star, Activity, Award } from "lucide-react";
import { motion } from "motion/react";

interface EmployeesManagementProps {
  users: User[];
  timesheets: Timesheet[];
  onBack: () => void;
  onSelectEmployee: (empId: string) => void;
}

export default function EmployeesManagement({ users, timesheets, onBack, onSelectEmployee }: EmployeesManagementProps) {
  const staff = users.filter(u => u.role !== UserRole.CLIENT);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmployeeStats = (empId: string) => {
    const empTimesheets = timesheets.filter(t => t.employeeId === empId);
    const totalHours = empTimesheets.reduce((acc, curr) => acc + curr.hoursWorked, 0);
    const totalCommissions = empTimesheets.reduce((acc, curr) => acc + curr.commissionEarned, 0);
    return { totalHours, totalCommissions };
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
               <UserCheck className="w-3.5 h-3.5" />
               <span>Resurse Umane & Performanță</span>
             </motion.div>
             <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight leading-none">
               Echipă.
             </h2>
             <p className="text-lg text-[#86868B] font-bold tracking-tight">Gestiunea talentelor și monitorizarea randamentului operațional.</p>
          </div>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-6 top-6 w-4 h-4 text-[#86868B]" />
          <input 
            type="text"
            placeholder="Nume, Rol sau Specializare..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#E9E9EB] pl-14 pr-6 py-5 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-[#034EA2]/5 transition-all text-[#1D1D1F]"
          />
        </div>
      </div>

      {/* Team Insights Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Angajați Activi", val: staff.length, icon: Users, color: "text-[#1D1D1F]" },
          { label: "Productivitate", val: "94%", icon: Activity, color: "text-[#034EA2]" },
          { label: "Eficiență Săpt.", val: "38.5h", icon: Clock, color: "text-emerald-600" },
          { label: "Top Performer", val: "M. Ionescu", icon: Award, color: "text-amber-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-[#E9E9EB] shadow-sm space-y-4">
             <div className="flex justify-between items-start">
               <div className={`p-4 rounded-2xl bg-[#F2F2F7] ${stat.color}`}>
                 <stat.icon className="w-5 h-5" />
               </div>
               <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-40">Insights</span>
             </div>
             <div className="space-y-1">
               <p className="text-xl font-bold text-[#1D1D1F] tracking-tighter">{stat.val}</p>
               <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">{stat.label}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStaff.map((emp, idx) => {
          const stats = getEmployeeStats(emp.id);
          const isAtRisk = stats.totalHours < 20;

          return (
            <motion.div 
              key={emp.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelectEmployee(emp.id)}
              className="group bg-white rounded-2xl p-6 border border-[#E9E9EB] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="relative shrink-0">
                  <img 
                    src={emp.avatarUrl || getRoleAvatar(emp.role)} 
                    alt={emp.name}
                    className="w-12 h-12 rounded-2xl object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#034EA2] transition-colors">{emp.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-normal ${
                      emp.role === UserRole.ADMIN || emp.role === UserRole.OWNER 
                      ? "bg-[#1D1D1F] text-white" 
                      : "bg-[#E8F0FE] text-[#034EA2]"
                    }`}>
                      {emp.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#F2F2F7]">
                 <div className="space-y-1">
                   <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-50">Timp Lucrat</p>
                   <p className="text-xl font-bold text-[#1D1D1F]">{stats.totalHours.toFixed(1)}<span className="text-xs ml-1 opacity-40">h</span></p>
                 </div>
                 <div className="space-y-1 text-right">
                   <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-50">Comisioane</p>
                   <p className="text-lg font-bold text-emerald-600">{stats.totalCommissions.toLocaleString()}<span className="text-xs ml-1 opacity-40">MDL</span></p>
                 </div>
              </div>

              <div className="mt-10 flex gap-4">
                 <button className="flex-1 bg-[#F2F2F7] text-[#1D1D1F] font-bold text-xs py-6 rounded-xl uppercase tracking-normal hover:bg-[#1D1D1F] hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3">
                    <Briefcase className="w-4 h-4" /> Fișă Performanță
                 </button>
                 <button className="w-12 h-12 bg-[#034EA2] text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-xl shadow-blue-100 group/btn shrink-0">
                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredStaff.length === 0 && (
        <div className="py-4 text-center space-y-6">
           <div className="w-12 h-12 bg-[#F2F2F7] rounded-2xl flex items-center justify-center mx-auto text-[#86868B] border border-[#E9E9EB]">
              <Users className="w-10 h-10" />
           </div>
           <p className="text-lg font-bold text-[#86868B] tracking-tight">Nu s-a găsit niciun profil de angajat.</p>
        </div>
      )}
    </div>
  );
}
