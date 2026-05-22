import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { UserMinus, Archive, FileText, Calendar, ShieldAlert, Award, Trash2 } from "lucide-react";

interface TerminatedEmployee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl: string;
  terminationDate: string;
  reason: string;
  regulatoryArticle: string; // Codul Muncii RM article
  severancePayMDL: number;
  notes: string;
}

interface TerminatedViewProps {
  staff: User[];
  onNotify: (msg: string, type?: "success" | "info") => void;
}

export const TerminatedView = ({ staff, onNotify }: TerminatedViewProps) => {
  const [terminatedList, setTerminatedList] = useState<TerminatedEmployee[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>("");
  const [termReason, setTermReason] = useState<string>("Demisie (la propria dorință)");
  const [termArticle, setTermArticle] = useState<string>("Articolul 85");
  const [severance, setSeverance] = useState<string>("0");
  const [termNotes, setTermNotes] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("autopro-terminated-employees");
    if (saved) {
      try {
        setTerminatedList(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Mock historical terminated employees in Moldova
      const mockTerminated: TerminatedEmployee[] = [
        {
          id: "term-1",
          name: "Andrei Cebotari",
          email: "andrei.c@autopro.md",
          phone: "079883344",
          role: "Mecanic Auto (Suspensii)",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
          terminationDate: "2026-03-15",
          reason: "Demisie voluntară (replecare peste hotare)",
          regulatoryArticle: "Art. 85 Codul Muncii RM",
          severancePayMDL: 0,
          notes: "A predat toate sculele în stare perfectă de funcționare. Fără obiecții financiare din ambele părți."
        },
        {
          id: "term-2",
          name: "Vadim Grosu",
          email: "vadim.g@autopro.md",
          phone: "068112277",
          role: "Spălător Auto",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
          terminationDate: "2026-01-20",
          reason: "Acordul comun al părților contractante",
          regulatoryArticle: "Art. 82¹ Codul Muncii RM",
          severancePayMDL: 4500,
          notes: "S-a achitat salariul la zi și indemnizația de eliberare din serviciu agreată."
        }
      ];
      localStorage.setItem("autopro-terminated-employees", JSON.stringify(mockTerminated));
      setTerminatedList(mockTerminated);
    }
  }, []);

  const handleTerminateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) {
      onNotify("Vă rugăm să selectați angajatul pe care doriți să-l arhivați/concediați!", "info");
      return;
    }

    const matchedActive = staff.find(s => s.id === selectedEmpId);
    if (!matchedActive) return;

    const newTerminated: TerminatedEmployee = {
      id: `term-${Date.now()}`,
      name: matchedActive.name,
      email: matchedActive.email,
      phone: matchedActive.phone,
      role: matchedActive.title || matchedActive.role,
      avatarUrl: matchedActive.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
      terminationDate: new Date().toISOString().split("T")[0],
      reason: termReason,
      regulatoryArticle: termArticle,
      severancePayMDL: parseInt(severance) || 0,
      notes: termNotes || "Arhivat din panoul administrativ."
    };

    const updated = [newTerminated, ...terminatedList];
    setTerminatedList(updated);
    localStorage.setItem("autopro-terminated-employees", JSON.stringify(updated));

    onNotify(`Angajatul ${matchedActive.name} a fost arhivat ca personal plecat (status inactiv)!`, "success");
    
    // Clean fields
    setSelectedEmpId("");
    setTermNotes("");
    setSeverance("0");
  };

  const handleDeleteRecord = (id: string, name: string) => {
    const updated = terminatedList.filter(t => t.id !== id);
    setTerminatedList(updated);
    localStorage.setItem("autopro-terminated-employees", JSON.stringify(updated));
    onNotify(`Dosarul arhivat al lui ${name} a fost șters definitiv din sistem.`, "info");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans text-slate-800">
      
      {/* Formular concediere / arhivare personal activ */}
      {staff.length > 0 && (
        <form onSubmit={handleTerminateEmployee} className="bg-white border border-[#E9E9EB] rounded-3xl p-6 shadow-sm space-y-5">
          <div className="border-b border-[#F2F2F7] pb-4">
            <h3 className="text-lg font-bold text-[#1D1D1F] flex items-center gap-2.5">
              <UserMinus className="w-5 h-5 text-rose-600" />
              Procesează Demisie / Încetare CIM
            </h3>
            <p className="text-xs text-slate-500 font-medium">Asigură încetarea legală și mutarea angajatului în starea de arhivă istorică</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#86868B] block mb-1">Alege un angajat:</label>
              <select 
                value={selectedEmpId} 
                onChange={e => setSelectedEmpId(e.target.value)}
                className="w-full bg-[#F2F2F7] text-xs font-bold p-3 rounded-xl border border-transparent focus:border-[#034EA2] outline-none cursor-pointer"
              >
                <option value="">-- Selectează din listă --</option>
                {staff.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.title || emp.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#86868B] block mb-1">Temei de Încetare / Motiv:</label>
              <select 
                value={termReason} 
                onChange={e => {
                  setTermReason(e.target.value);
                  if (e.target.value.includes("Demisie")) setTermArticle("Articolul 85");
                  else if (e.target.value.includes("Acord")) setTermArticle("Articolul 82¹");
                  else if (e.target.value.includes("Abateri")) setTermArticle("Articolul 86 (1) g)");
                  else setTermArticle("Articolul 82");
                }}
                className="w-full bg-[#F2F2F7] text-xs font-bold p-3 rounded-xl border border-transparent focus:border-[#034EA2] outline-none cursor-pointer"
              >
                <option value="Demisie (la propria dorință)">Demisie (la propria dorință)</option>
                <option value="Acordul scris al părților">Acordul scris al părților</option>
                <option value="Abateri disciplinare grave repetate">Concediere pentru abateri grave</option>
                <option value="Expirația termenului CIM determinat">Expirarea termenului contractului</option>
                <option value="Inaptitudine profesională atestată">Inaptitudine profesională</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#86868B] block mb-1">Articol Codul Muncii RM:</label>
              <input 
                type="text" 
                value={termArticle} 
                onChange={e => setTermArticle(e.target.value)}
                className="w-full bg-[#F2F2F7] text-xs font-bold p-3 rounded-xl border border-transparent focus:border-[#034EA2] outline-none"
                placeholder="Ex. Articolul 85"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#86868B] block mb-1">Compensații Finale (Excedente MDL):</label>
              <input 
                type="number" 
                value={severance} 
                onChange={e => setSeverance(e.target.value)}
                className="w-full bg-[#F2F2F7] text-xs font-bold p-3 rounded-xl border border-transparent focus:border-[#034EA2] outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="md:col-span-3">
              <label className="text-[10px] uppercase font-bold text-[#86868B] block mb-1">Observații din fișa de lichidare (scule predate, CASCO, chei etc.):</label>
              <input 
                type="text" 
                value={termNotes}
                onChange={e => setTermNotes(e.target.value)}
                className="w-full bg-[#F2F2F7] text-xs font-medium p-3 rounded-xl border border-transparent focus:border-[#034EA2] outline-none"
                placeholder="Predat set chei dinamometrice, dulap curat, lipsă litigii."
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold p-3.5 rounded-xl text-xs uppercase tracking-normal mt-5 transition-all cursor-pointer shadow-sm shadow-rose-100"
            >
              Arhivează ca Inactiv
            </button>
          </div>
        </form>
      )}

      {/* Registrul istoric arhivati */}
      <div className="bg-white border border-[#E9E9EB] rounded-3xl p-6 shadow-sm space-y-6">
        <div className="border-b border-[#F2F2F7] pb-4 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-2">
              <Archive className="w-5 h-5 text-slate-500" />
              Arhivă Personal Plecat / Istoric Plecări
            </h3>
            <p className="text-xs text-slate-400 font-medium">Baza de date a contractelor reziliate și dosarele de pensionare / demisie</p>
          </div>
          <span className="px-3 py-1 bg-slate-50 border border-[#E9E9EB] text-[10px] text-slate-500 rounded-full font-extrabold uppercase">
            {terminatedList.length} Dosare
          </span>
        </div>

        {terminatedList.length === 0 ? (
          <div className="p-16 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-[#E9E9EB] space-y-3">
            <UserMinus className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold uppercase tracking-normal">Nu există salariați concediați înregistrați în baza de date.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {terminatedList.map((emp) => (
              <div 
                key={emp.id} 
                className="bg-[#F2F2F7]/45 border border-transparent hover:border-[#E8E8EC] transition-all p-5 rounded-2xl relative group space-y-4 text-xs"
              >
                <button
                  onClick={() => handleDeleteRecord(emp.id, emp.name)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 cursor-pointer p-1 rounded-xl hover:bg-white transition-all"
                  title="Șterge dosar definitiv din arhivă"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex gap-4">
                  <img 
                    src={emp.avatarUrl} 
                    alt={emp.name} 
                    className="w-12 h-12 rounded-full object-cover filter grayscale border border-[#E8E8EC] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[#1D1D1F]">{emp.name}</h4>
                    <p className="font-extrabold text-[10px] text-slate-400 uppercase tracking-normal">{emp.role}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold bg-white border border-[#E9E9EB] px-2.5 py-1 rounded-lg w-max mt-1">
                      <Calendar className="w-3.5 h-3.5" /> Reziliat la: {emp.terminationDate}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-[#E9E9EB] space-y-2">
                  <p className="flex justify-between border-b border-[#F2F2F7] pb-1.5 leading-none">
                    <span className="text-slate-400 font-semibold font-mono uppercase text-[9px]">Motiv Plecare:</span>
                    <span className="font-bold text-slate-800">{emp.reason}</span>
                  </p>
                  <p className="flex justify-between border-b border-[#F2F2F7] pb-1.5 leading-none">
                    <span className="text-slate-400 font-semibold font-mono uppercase text-[9px]">Articol Legal:</span>
                    <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">{emp.regulatoryArticle}</span>
                  </p>
                  <p className="flex justify-between leading-none">
                    <span className="text-slate-400 font-semibold font-mono uppercase text-[9px]">Compensație achitată:</span>
                    <span className="font-extrabold text-emerald-700">{emp.severancePayMDL > 0 ? `${emp.severancePayMDL.toLocaleString()} MDL` : "Fără costuri suplimentare"}</span>
                  </p>
                </div>

                {emp.notes && (
                  <div className="text-[11px] text-slate-500 italic px-1 pt-1 border-t border-slate-200/40">
                    "{emp.notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
