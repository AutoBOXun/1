import React, { useState, useEffect } from "react";
import { Settings, Shield, Bell, DollarSign, Calendar, Check, Database } from "lucide-react";

interface HRConfig {
  hoursPerDay: number;
  notifyOnContractExpiry: boolean;
  overtimeRate: number;
  enableSalaryAvans: boolean;
  autoLogWeekend: boolean;
  minGuaranteedSalary: number;
}

interface SettingsViewProps {
  onNotify: (msg: string, type?: "success" | "info") => void;
  onExport: (table: string) => void;
  onImport: (table: string, file: File) => void;
  onDelete: (table: string) => void;
}

export const SettingsView = ({ onNotify, onExport, onImport, onDelete }: SettingsViewProps) => {
  const [config, setConfig] = useState<HRConfig>({
    hoursPerDay: 8,
    notifyOnContractExpiry: true,
    overtimeRate: 1.5,
    enableSalaryAvans: true,
    autoLogWeekend: false,
    minGuaranteedSalary: 4500,
  });

  useEffect(() => {
    const saved = localStorage.getItem("autopro-hr-config");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Eroare la încărcarea setărilor HR:", e);
      }
    }
  }, []);

  const handleSave = (updated: HRConfig) => {
    setConfig(updated);
    localStorage.setItem("autopro-hr-config", JSON.stringify(updated));
    onNotify("Setările HR au fost salvate și aplicate în timp real!", "success");
  };

  return (
    <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 md:p-8 shadow-sm space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-[#F2F2F7] pb-5">
        <h3 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-3">
          <Settings className="w-6 h-6 text-[#034EA2]" />
          Setări Administrative HR & Reglementări CIM
        </h3>
        <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-1">
          Configurarea corectă a regimului de lucru și a parametrilor salariali conform Codului Muncii RM
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Regim de Lucru */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#1D1D1F] px-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#86868B]" />
            Regim Timp de Muncă
          </h4>
          
          <div className="bg-[#F2F2F7]/50 rounded-2xl p-5 border border-transparent hover:border-[#E9E9EB] transition-all space-y-4">
            <div>
              <label className="text-xs uppercase font-extrabold text-[#86868B] block mb-1.5">
                Durata Zilnică Standard (ore/zi)
              </label>
              <input 
                type="number" 
                min="4" 
                max="12"
                value={config.hoursPerDay}
                onChange={(e) => handleSave({ ...config, hoursPerDay: parseInt(e.target.value) || 8 })}
                className="w-full bg-white text-sm font-bold px-4 py-3 rounded-xl border border-[#E9E9EB] focus:border-[#034EA2] outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Art. 95 Codul Muncii RM: standardul este de 40 de ore pe săptămână.</span>
            </div>

            <div>
              <label className="text-xs uppercase font-extrabold text-[#86868B] block mb-1.5">
                Coeficient Tarif Ore Suplimentare
              </label>
              <select 
                value={config.overtimeRate}
                onChange={(e) => handleSave({ ...config, overtimeRate: parseFloat(e.target.value) })}
                className="w-full bg-white text-sm font-bold px-4 py-3 rounded-xl border border-[#E9E9EB] focus:border-[#034EA2] outline-none cursor-pointer"
              >
                <option value="1.5">1.5x (Tarif standard + 50%)</option>
                <option value="2.0">2.0x (Dublu - recomandat sâmbătă/duminică)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Politici Financiare și Salarii */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#1D1D1F] px-1 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#86868B]" />
            Salarizare & Garanții RM
          </h4>
          
          <div className="bg-[#F2F2F7]/50 rounded-2xl p-5 border border-transparent hover:border-[#E9E9EB] transition-all space-y-4">
            <div>
              <label className="text-xs uppercase font-extrabold text-[#86868B] block mb-1.5">
                Salariu Minim Garantat în Sectorul Auto (MDL)
              </label>
              <input 
                type="number" 
                step="500"
                value={config.minGuaranteedSalary}
                onChange={(e) => handleSave({ ...config, minGuaranteedSalary: parseInt(e.target.value) || 4500 })}
                className="w-full bg-white text-sm font-bold px-4 py-3 rounded-xl border border-[#E9E9EB] focus:border-[#034EA2] outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Garanția minimă de stat pentru lucrători de calificare medie în RM.</span>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={config.enableSalaryAvans}
                  onChange={(e) => handleSave({ ...config, enableSalaryAvans: e.target.checked })}
                  className="w-5 h-5 rounded-lg border-[#E9E9EB] text-[#034EA2] focus:ring-[#034EA2] accent-[#034EA2]"
                />
                <div>
                  <span className="text-xs font-bold text-[#1D1D1F] block">Plata Avansului (25 a lunii)</span>
                  <span className="text-[10px] text-slate-500">Arată dările de seamă defalcate pentru avans pe 25 și lichidare pe 10.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Alerte contracte si Protectie */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#1D1D1F] px-1 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#86868B]" />
          Administrare Date Angajați (Import/Export/Reset)
        </h4>

        <div className="bg-[#F2F2F7]/50 rounded-2xl p-5 border border-transparent hover:border-[#E9E9EB] transition-all space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => onExport("users")} className="flex items-center gap-3 p-3 bg-white border border-[#E9E9EB] rounded-2xl cursor-pointer hover:border-[#034EA2]/30 transition-all font-bold text-xs">
                Exportă Angajați (JSON)
              </button>
              <label className="flex items-center gap-3 p-3 bg-white border border-[#E9E9EB] rounded-2xl cursor-pointer hover:border-[#034EA2]/30 transition-all font-bold text-xs">
                Importă Angajați
                <input type="file" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) onImport("users", e.target.files[0]);
                }} className="hidden" />
              </label>
              <button 
                onClick={() => { onDelete("users"); onDelete("vehicles"); onDelete("appointments"); onDelete("serviceJobs"); onDelete("inventory"); onDelete("invoices"); }}
                className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl cursor-pointer hover:border-rose-200 transition-all font-bold text-xs"
              >
                Resetare Completă Sistem
              </button>
            </div>
            <p className="text-[10px] text-slate-500">Atentie! Resetarea completă va sterge TOATE datele din sistem (angajați, mașini, fișe, facturi, inventar).</p>
        </div>
      </div>
      
      {/* Alerte contracte si Protectie */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#1D1D1F] px-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#86868B]" />
          Notificări & Securitate Date
        </h4>

        <div className="bg-[#F2F2F7]/50 rounded-2xl p-5 border border-transparent hover:border-[#E9E9EB] transition-all space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 bg-white border border-[#E9E9EB] rounded-2xl cursor-pointer hover:border-[#034EA2]/30 transition-all">
              <input 
                type="checkbox" 
                checked={config.notifyOnContractExpiry}
                onChange={(e) => handleSave({ ...config, notifyOnContractExpiry: e.target.checked })}
                className="w-5 h-5 text-[#034EA2] accent-[#034EA2]"
              />
              <div>
                <span className="text-xs font-bold text-[#1D1D1F] block">Alerte Expirare Perioadă Probă</span>
                <span className="text-[10px] text-slate-500">Avertizare cu 5 zile înainte de împlinirea celor 3 luni de probă.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-white border border-[#E9E9EB] rounded-2xl cursor-pointer hover:border-[#034EA2]/30 transition-all">
              <input 
                type="checkbox" 
                checked={config.autoLogWeekend}
                onChange={(e) => handleSave({ ...config, autoLogWeekend: e.target.checked })}
                className="w-5 h-5 text-[#034EA2] accent-[#034EA2]"
              />
              <div>
                <span className="text-xs font-bold text-[#1D1D1F] block">Marcaj Automat Repaus</span>
                <span className="text-[10px] text-slate-500">Adaugă automat sâmbăta și duminica ca zile libere (R) în pontaj.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-950 items-start">
        <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold">Notă Juridică Conformitate Registrul Muncii:</p>
          <p className="text-[10px] leading-relaxed text-amber-800">
            Amintiri utile: Modulul actual se aliniază cu dispozițiile Codului Muncii al RM. Toate corecțiile fizice s-au electronice de pontaje pot fi verificate retroactiv în caz de control de către Inspectoratul de Stat al Muncii al Republicii Moldova.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <div className="text-[11px] text-[#86868B] font-extrabold uppercase flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
          <Check className="w-3.5 h-3.5 text-emerald-600" /> Configurație activă auto-salvată
        </div>
      </div>
    </div>
  );
};
