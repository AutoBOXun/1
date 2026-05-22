/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { User, UserRole, Vehicle, ServiceType, Appointment } from "../types";
import { getRoleAvatar } from "../utils/avatarUtils";
import { 
  Wrench, Shield, CheckCircle2, AlertCircle, LogIn, UserPlus, 
  Car, Calendar, ClipboardCheck, Star, Users, Phone, Mail, 
  ArrowRight, ShieldCheck, Cpu, KeyRound, Sparkles, Database, Plus
} from "lucide-react";

interface LandingPageProps {
  vehicles: Vehicle[];
  users: User[];
  serviceTypes: ServiceType[];
  appointments: Appointment[];
  currentUser?: User | null;
  setActiveView: (view: "landing" | "client" | "admin" | "schema" | "control-panel" | "services-catalog") => void;
  onLoginSuccess: (user: User, isOwner: boolean) => void;
  onRegisterSuccess: (newUser: User, newVehicle?: Vehicle) => void;
  onNotify: (message: string, type: "success" | "info") => void;
}

export default function LandingPage({
  vehicles,
  users,
  serviceTypes,
  appointments,
  currentUser,
  setActiveView,
  onLoginSuccess,
  onRegisterSuccess,
  onNotify
}: LandingPageProps) {
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  
  // Register optional vehicle state
  const [includeVehicle, setIncludeVehicle] = useState(true);
  const [carBrand, setCarBrand] = useState("Dacia");
  const [carModel, setCarModel] = useState("Duster Stepway");
  const [carPlate, setCarPlate] = useState("UN-252-MD");
  const [carVin, setCarVin] = useState("UU1KSDDA000" + Math.floor(100000 + Math.random() * 900000));
  const [carYear, setCarYear] = useState(2022);
  const [carEngine, setCarEngine] = useState("1.5 dCi 115 CP");

  // Handle registration logic
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      onNotify("Vă rugăm să completați câmpurile obligatorii (*).", "info");
      return;
    }

    const emailExists = users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailExists) {
      onNotify("Această adresă de e-mail este deja înregistrată. Vă rugăm să vă conectați.", "info");
      setAuthTab("login");
      setLoginEmail(regEmail);
      return;
    }

    const newUserId = `u-${Date.now().toString().slice(-4)}`;
    const newUser: User = {
      id: newUserId,
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword.trim(),
      phone: regPhone.trim() || "Nespecificat",
      role: UserRole.CLIENT,
      avatarUrl: getRoleAvatar("Client")
    };

    let newVehicle: Vehicle | undefined = undefined;
    if (includeVehicle && carBrand.trim() && carModel.trim() && carPlate.trim()) {
      newVehicle = {
        id: `v-${Date.now().toString().slice(-4)}`,
        clientId: newUserId,
        brand: carBrand.trim(),
        model: carModel.trim(),
        licensePlate: carPlate.trim().toUpperCase(),
        vin: carVin.trim() || "Nespecificat",
        year: carYear,
        engine: carEngine.trim() || "1.6 MPI",
        mileage: 65000
      };
    }

    onRegisterSuccess(newUser, newVehicle);
    setRegName("");
    setRegEmail("");
    setRegPassword("");
    setRegPhone("");
  };

  // Handle login logic
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();

    // 1. CHECKS SECURE OWNER ACCESS VIA INTERNAL VALUE (WITHOUT REVEALING IT IN THE UI)
    if ((cleanEmail === "basile" || cleanEmail === "basile@autoservice.md") && loginPassword === "franta05") {
      const ownerUser = users.find(u => u.role === UserRole.OWNER) || {
        id: "u-owner",
        name: "basile",
        email: "basile@autoservice.md",
        phone: "060999999",
        role: UserRole.OWNER,
        avatarUrl: getRoleAvatar("Client")
      };
      onLoginSuccess(ownerUser, true);
      return;
    }

    // 2. CHECK IF OTHER VALID REGISTERED USER
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail || u.name.toLowerCase() === cleanEmail);
    if (foundUser) {
      if (foundUser.role === UserRole.OWNER) {
        setLoginError("Pentru acces administrative securizat este necesară introducerea parolei corecte.");
        return;
      }
      onLoginSuccess(foundUser, false);
      return;
    }

    setLoginError("Utilizatorul nu a fost găsit sau codul este incorect. (Sfat: folosiți e-mailul de client înregistrat sau creați un cont nou!)");
  };

  const upcomingAppointments = appointments.filter(a => {
    const apDate = new Date(a.date);
    const today = new Date();
    const futureLimit = new Date();
    futureLimit.setDate(today.getDate() + 30);
    return apDate >= today && apDate <= futureLimit;
  }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div id="landing-page-hero-container" className="space-y-4 py-4 animate-in fade-in duration-500">
      
      {/* Layout Control */}
      {currentUser ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-[#E9E9EB] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#034EA2]/5 rounded-bl-[60px] -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700" />
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-2xl object-cover shadow-sm bg-[#F2F2F7] border-2 border-white relative z-10" />
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight leading-tight">Salut, {currentUser.name}<span className="text-[#034EA2]">.</span></h2>
                <div className="text-[#86868B] text-xs mt-2 font-bold uppercase tracking-normal flex flex-col gap-1 opacity-80">
                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {currentUser.email}</p>
                  <p className="text-[#034EA2] flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {currentUser.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-bold text-[#1D1D1F] text-lg px-2 uppercase tracking-tight flex items-center gap-2">
                Garajul tău<span className="w-2 h-2 bg-[#034EA2] rounded-full translate-y-0.5" />
              </h3>
              <div className="bg-white p-6 rounded-2xl border border-[#E9E9EB] shadow-sm space-y-4">
                {vehicles.filter(v => v.clientId === currentUser.id).length === 0 ? (
                  <div className="text-center py-4 space-y-3">
                    <Car className="w-12 h-12 text-[#F2F2F7] mx-auto" />
                    <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal">Niciun vehicul în garaj</p>
                  </div>
                ) : (
                  vehicles.filter(v => v.clientId === currentUser.id).map(v => (
                    <div key={v.id} className="flex items-center gap-6 bg-[#F2F2F7]/50 p-4 rounded-2xl border border-transparent hover:border-[#E8F0FE] hover:bg-white transition-colors group cursor-pointer active:scale-95">
                      <div className="w-10 h-10 bg-white text-[#034EA2] rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-[#E9E9EB] group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
                        <Car className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-bold text-[#1D1D1F] text-lg leading-tight uppercase tracking-tight">{v.brand} {v.model}</h4>
                        <p className="text-xs text-[#034EA2] font-bold mt-1.5 tracking-normal bg-[#E8F0FE] inline-block px-3 py-1 rounded-full">{v.licensePlate}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-bold text-[#86868B] block px-4 py-1.5 bg-white rounded-full shadow-sm border border-[#E9E9EB] uppercase tracking-normal">{v.year}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>


            <div className="space-y-4">
              <h3 className="font-bold text-[#1D1D1F] text-lg px-2 uppercase tracking-tight flex items-center gap-2">
                Servicii recomandate<span className="w-2 h-2 bg-[#34C759] rounded-full translate-y-0.5" />
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceTypes.slice(0, 4).map((service) => (
                  <div key={service.id} className="flex flex-col p-6 bg-white border border-[#E9E9EB] shadow-sm rounded-2xl space-y-4 hover:shadow-md transition-all group cursor-pointer active:scale-95">
                    <div className="w-12 h-12 bg-[#F2F2F7] rounded-xl flex items-center justify-center text-[#1D1D1F] group-hover:bg-[#034EA2] group-hover:text-white transition-colors">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-[#1D1D1F] text-sm tracking-tight leading-tight uppercase">{service.name}</span>
                    <div className="flex items-center justify-between pt-3 border-t border-[#F2F2F7]">
                      <span className="text-xs font-bold text-[#86868B]">Estimare: {service.estimatedDuration}m</span>
                      <span className="text-xs font-bold text-[#034EA2] uppercase tracking-normal">{service.estimatedPrice} MDL</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Calendar Design Pattern */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#1D1D1F] text-lg px-2 uppercase tracking-tight">Status Operativ.</h3>
            <div className="bg-white p-6 rounded-2xl border border-[#E9E9EB] shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[#F2F2F7]">
                 <Calendar className="w-5 h-5 text-[#034EA2]" />
                 <h3 className="font-bold text-xs uppercase tracking-normal text-[#1D1D1F]">Programări Active (30 zile)</h3>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="py-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-[#F2F2F7] rounded-2xl flex items-center justify-center mx-auto text-[#86868B] border border-[#E9E9EB]">
                      <ClipboardCheck className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal text-center opacity-60">Nu există programări iminente.</p>
                  </div>
                ) : (
                  upcomingAppointments.slice(0, 8).map(ap => (
                    <div key={ap.id} className="p-4 bg-[#F2F2F7] border border-transparent hover:border-[#E9E9EB] hover:bg-white rounded-2xl flex justify-between items-center transition-all group hover:shadow-md">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-14 bg-white rounded-xl shadow-sm border border-[#E9E9EB] flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                            <span className="text-xs font-bold text-[#034EA2] uppercase tracking-normal leading-none">
                              {new Date(ap.date).toLocaleDateString("ro-RO", { month: "short" })}
                            </span>
                            <span className="text-lg font-bold text-[#1D1D1F] leading-none mt-1">
                              {new Date(ap.date).getDate()}
                            </span>
                         </div>
                         <div>
                            <p className="text-[#1D1D1F] font-bold text-sm uppercase tracking-tight">{serviceTypes.find(s => (ap.serviceTypeIds || []).includes(s.id))?.name || "Serviciu General"}</p>
                            <p className="text-[#86868B] font-bold text-xs uppercase tracking-normal mt-1 opacity-70">Confirmat • {ap.time}</p>
                         </div>
                      </div>
                      <div className="bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5 hidden sm:flex">
                         <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                         <span className="text-emerald-700 text-xs font-semibold uppercase tracking-normal">Activ</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Hero: One UI 8 Style */}
          <div className="text-center space-y-4 py-4 relative overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-6 py-2 bg-white text-[#1D1D1F] rounded-full text-xs font-semibold uppercase tracking-normal border border-[#E9E9EB] shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#034EA2]" />
              <span>Standardul de asistență auto în Ungheni</span>
            </motion.div>
            
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-4xl font-bold text-[#1D1D1F] tracking-tight leading-none select-none"
              >
                AutoBOX <br/>
                <span className="text-[#034EA2]">Evolution<span className="text-[#1D1D1F]">.</span></span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-lg md:text-xl text-[#86868B] font-bold tracking-tight max-w-2xl mx-auto leading-relaxed"
              >
                O platformă integrată definită de precizie și performanță digitală. Soluții inteligente pentru mașina ta.
              </motion.p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Left Column: Service Catalog */}
            <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Servicii.</h2>
                  <p className="text-[#86868B] text-xs font-semibold uppercase tracking-normal opacity-80">Excelență în Ungheni • Peste 150 operațiuni active</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {serviceTypes.slice(0, 4).map(s => (
                    <div 
                      key={s.id} 
                      className="bg-white p-6 rounded-2xl border border-[#E9E9EB] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group cursor-default"
                    >
                      <div className="w-12 h-12 bg-[#F2F2F7] text-[#034EA2] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#034EA2] group-hover:text-white transition-all border border-blue-50/50">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight leading-tight group-hover:text-[#034EA2] transition-colors">{s.name}</h3>
                        <p className="text-[#86868B] text-sm font-medium leading-relaxed line-clamp-2">
                          {s.description}
                        </p>
                        <div className="pt-4 mt-2 flex items-center justify-between border-t border-[#F2F2F7]">
                          <span className="text-xs font-semibold uppercase tracking-normal text-[#034EA2]">De la {s.estimatedPrice} MDL</span>
                          <div className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center group-hover:bg-[#034EA2] transition-colors shadow-sm">
                            <Plus className="w-4 h-4 text-[#034EA2] group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-center sm:justify-start">
                   <button 
                    onClick={() => setActiveView("services-catalog")}
                    className="group flex items-center gap-3 bg-[#034EA2] text-white px-6 py-3 rounded-full font-bold text-xs uppercase tracking-normal shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                   >
                     Catalog complet <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
            </div>

            {/* Right Column: Calendar Redesign */}
            <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Calendar.</h2>
                  <p className="text-[#86868B] text-sm font-medium tracking-tight">Disponibilitate și programări în timp real (30 zile).</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#E9E9EB] shadow-sm space-y-4 min-h-[400px] flex flex-col">
                  <div className="flex items-center gap-4 pb-6 border-b border-[#F2F2F7]">
                    <Calendar className="w-6 h-6 text-[#034EA2]" strokeWidth={2.5} />
                    <h3 className="font-bold text-xs uppercase tracking-normal text-[#1D1D1F]">PROGRAMĂRI VIITOARE</h3>
                  </div>

                  <div className="space-y-4 flex-1">
                    {upcomingAppointments.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-6 opacity-60">
                        <div className="w-12 h-12 bg-[#F2F2F7] rounded-2xl flex items-center justify-center mx-auto text-[#86868B]">
                          <ClipboardCheck className="w-8 h-8" />
                        </div>
                        <p className="text-xs font-bold text-[#86868B]">Momentan nu există <br/> programări active în sistem.</p>
                      </div>
                    ) : (
                      upcomingAppointments.slice(0, 4).map(ap => {
                         const dateObj = new Date(ap.date);
                         const month = ["IAN", "FEB", "MAR", "APR", "MAI", "IUN", "IUL", "AUG", "SEP", "OCT", "NOI", "DEC"][dateObj.getMonth()] || "MAI";
                         const day = dateObj.getDate();
                         
                         return (
                            <div key={ap.id} className="flex items-center gap-5 p-5 rounded-2xl bg-[#F2F2F7] border border-transparent hover:bg-[#E8F0FE] transition-colors group">
                              <div className="w-14 h-16 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm shrink-0 border border-[#E9E9EB]">
                                <span className="text-xs font-bold text-[#034EA2] uppercase leading-none mb-1">{month}</span>
                                <span className="text-lg font-bold text-[#1D1D1F] leading-none">{day}</span>
                              </div>
                              <div className="flex-1 min-w-0 space-y-1">
                                 <h4 className="font-bold text-[#1D1D1F] text-sm truncate tracking-tight">
                                    {serviceTypes.find(s => (ap.serviceTypeIds || []).includes(s.id))?.name || "Serviciu Tehnic"}
                                 </h4>
                                 <p className="text-xs font-bold text-[#86868B]">Status: <span className="text-emerald-600">Confirmat</span> • {ap.time}</p>
                              </div>
                              <div className="shrink-0 bg-white px-4 py-2 rounded-full border border-[#E9E9EB] shadow-sm">
                                 <span className="text-xs font-bold text-[#034EA2] tracking-normal">MDL</span>
                              </div>
                            </div>
                         );
                      })
                    )}
                  </div>

                  <div className="pt-6 border-t border-[#F2F2F7]">
                    <button 
                      onClick={() => onNotify("Autentifică-te pentru a face o programare!", "info")}
                      className="w-full bg-[#034EA2] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-normal shadow-md hover:bg-[#1D1D1F] transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-95 group"
                    >
                      PROGRAMEAZĂ ACUM <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
            </div>
        </div>
      </div>
      )}


    </div>
  );
}

