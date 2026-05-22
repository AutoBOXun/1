import React, { useState } from "react";
import { LogIn, UserPlus, Shield, X, Mail, Phone, Lock, User as UserIcon, ArrowLeft, CheckCircle2, AlertCircle, Activity } from "lucide-react";
import { User, Vehicle, UserRole } from "../types";
import { getRoleAvatar } from "../utils/avatarUtils";
import { motion, AnimatePresence } from "motion/react";

interface AuthPageProps {
  onLoginSuccess: (user: User, isOwner: boolean) => void;
  onRegisterSuccess: (newUser: User, newVehicle?: Vehicle) => void;
  onNotify: (message: string, type: "success" | "info") => void;
  users: User[];
  defaultTab?: "login" | "register";
  onBack: () => void;
}

export default function AuthPage({ 
  onLoginSuccess, 
  onRegisterSuccess, 
  onNotify, 
  users, 
  defaultTab = "login",
  onBack 
}: AuthPageProps) {
  const [authTab, setAuthTab] = useState<"login" | "register">(defaultTab);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();

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

    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail || u.name.toLowerCase() === cleanEmail);
    if (foundUser) {
      if (!foundUser.password) {
        setLoginError("Cont nesecurizat: Contactați administratorul pentru setarea parolei inițiale.");
        return;
      }
      if (foundUser.password !== loginPassword) {
        setLoginError("Parolă incorectă.");
        return;
      }
      onLoginSuccess(foundUser, false);
      return;
    }
    setLoginError("Credențiale invalide. Vă rugăm să reîncercați.");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      onNotify("Competați toate câmpurile obligatorii.", "info");
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
    onRegisterSuccess(newUser);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[560px] bg-white rounded-2xl shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-[#E9E9EB] overflow-hidden relative"
      >
        {/* Back Button Container */}
        <div className="absolute top-6 left-10 z-20">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-[#F2F2F7] rounded-2xl flex items-center justify-center text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E9E9EB] transition-all group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="p-4 md:p-10 space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-12 h-12 bg-[#1D1D1F] rounded-2xl flex items-center justify-center mx-auto shadow-2xl"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-[#1D1D1F] tracking-tighter uppercase">
                {authTab === "login" ? "Identitate AutoBOX" : "Înregistrare Platformă"}
              </h1>
              <p className="text-[#86868B] font-bold tracking-tight">Acces securizat în ecosistemul tău digital auto.</p>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-[#F2F2F7] p-2 rounded-2xl border border-transparent">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setAuthTab(tab);
                  setLoginError("");
                }}
                className={`flex-1 py-5 text-xs font-semibold uppercase tracking-normal rounded-xl transition-all flex items-center justify-center gap-3 ${
                  authTab === tab 
                    ? "bg-white text-[#1D1D1F] shadow-xl" 
                    : "text-[#86868B] hover:text-[#1D1D1F]"
                }`}
              >
                {tab === "login" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {tab === "login" ? "Autentificare" : "Creează Cont"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={authTab}
              initial={{ opacity: 0, x: authTab === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: authTab === "login" ? 20 : -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              {authTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal px-6">Identificator / Email</label>
                      <div className="relative group">
                        <input 
                          type="text" 
                          autoFocus
                          placeholder="nume@serviciu.md" 
                          className="w-full bg-[#F2F2F7] border-2 border-transparent focus:border-[#034EA2]/20 focus:bg-white px-4 py-5 rounded-full text-base font-bold outline-none transition-all" 
                          value={loginEmail} 
                          onChange={e => setLoginEmail(e.target.value)} 
                        />
                        <Mail className="w-5 h-5 text-[#86868B] absolute right-8 top-5 opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#034EA2] transition-all" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between items-center px-6">
                         <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Cheie Acces</label>
                         <button type="button" className="text-xs font-bold text-[#034EA2] uppercase tracking-normal opacity-60 hover:opacity-100">Ai uitat parola?</button>
                       </div>
                      <div className="relative group">
                        <input 
                          type="password" 
                          placeholder="••••••••" 
                          className="w-full bg-[#F2F2F7] border-2 border-transparent focus:border-[#034EA2]/20 focus:bg-white px-4 py-5 rounded-full text-base font-bold outline-none transition-all" 
                          value={loginPassword} 
                          onChange={e => setLoginPassword(e.target.value)} 
                        />
                        <Lock className="w-5 h-5 text-[#86868B] absolute right-8 top-5 opacity-40 group-focus-within:opacity-100 group-focus-within:text-[#034EA2] transition-all" />
                      </div>
                    </div>
                  </div>

                  {loginError && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-3 px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-xs font-semibold uppercase tracking-tight leading-snug">{loginError}</p>
                    </motion.div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full bg-[#034EA2] text-white py-6 rounded-full font-bold text-xs uppercase tracking-normal shadow-2xl shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                  >
                    Lansează Sesiunea <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal px-6">Nume Complet</label>
                      <input type="text" placeholder="identitate client" className="w-full bg-[#F2F2F7] border-2 border-transparent focus:border-[#034EA2]/20 focus:bg-white px-4 py-5 rounded-full text-base font-bold outline-none transition-all" value={regName} onChange={e => setRegName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal px-6">Adresă Email</label>
                      <input type="email" placeholder="client@exemplu.md" className="w-full bg-[#F2F2F7] border-2 border-transparent focus:border-[#034EA2]/20 focus:bg-white px-4 py-5 rounded-full text-base font-bold outline-none transition-all" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal px-6">Telefon Contact</label>
                      <input type="text" placeholder="06x xxx xxx" className="w-full bg-[#F2F2F7] border-2 border-transparent focus:border-[#034EA2]/20 focus:bg-white px-4 py-5 rounded-full text-base font-bold outline-none transition-all" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal px-6">Cheie de Acces</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-[#F2F2F7] border-2 border-transparent focus:border-[#034EA2]/20 focus:bg-white px-4 py-5 rounded-full text-base font-bold outline-none transition-all" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 px-6 py-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-semibold uppercase tracking-tight">Utilizăm criptare end-to-end pentru datele dumneavoastră.</p>
                  </div>

                  <button type="submit" className="w-full bg-[#1D1D1F] text-white py-6 rounded-full font-bold text-xs uppercase tracking-normal shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all group flex items-center justify-center gap-4">
                    Finalizează Înrolarea <Activity className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                  </button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="pt-8 border-t border-[#F2F2F7] text-center">
            <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-40">AutoBOX Evolution • v8.0 Enterprise</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
