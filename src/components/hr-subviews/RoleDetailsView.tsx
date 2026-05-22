import React, { useState } from 'react';
import { ArrowLeft, Briefcase, Save, ClipboardCheck, User, Info, FileText } from 'lucide-react';
import { RoleJobDescription } from '../../data/roles';

interface RoleDetailsViewProps {
  role: RoleJobDescription;
  onBack: () => void;
  onUpdateUnits: (id: string, units: number) => void;
}

export const RoleDetailsView = ({ role, onBack, onUpdateUnits }: RoleDetailsViewProps) => {
  const [units, setUnits] = useState(role.totalUnits);

  const getRoleCormCode = (roleId: string) => {
    const mapping: Record<string, string> = {
      admin: "121205",
      reception: "311518",
      purchaser: "332301",
      accountant: "241103",
      mechanic: "723103",
      electrician: "741214",
      motorist: "723110",
      geometry: "723120",
      bodywork: "721303",
      painter: "713204",
      detailing: "812204",
      tire: "723125",
      washer: "912203",
      auxiliary: "962201"
    };
    return mapping[roleId] || "723103";
  };

  const getRoleSubdivision = (roleId: string) => {
    const mapping: Record<string, string> = {
      admin: "Conducere & Administrație",
      reception: "Recepție & Relații Clienți",
      purchaser: "Achiziții & Gestiune Stoc",
      accountant: "Financiar & Contabilitate",
      mechanic: "Atelier Mecanică Generală",
      electrician: "Atelier Electrică & Diagnoză",
      motorist: "Atelier Mecanică Complexe / Motoare",
      geometry: "Atelier Aliniere & Geometrie 3D",
      bodywork: "Atelier Tinichigerie & Caroserii",
      painter: "Atelier Vopsitorie & Pregătiri",
      detailing: "Atelier Detailing / Cosmetică Auto",
      tire: "Atelier Vulcanizare",
      washer: "Spălătorie Auto",
      auxiliary: "Întreținere / Muncitori Auxiliari"
    };
    return mapping[roleId] || "Secția de Reparații Auto";
  };

  const handleSave = () => {
    onUpdateUnits(role.id, units);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-8">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-blue-600">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Înapoi la Catalog
      </button>
      
      <div className="flex justify-between items-start pb-6 border-b border-slate-100">
        <div>
          <h3 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            {role.title}
          </h3>
          <p className="text-slate-500 mt-2">Cod CORM: <span className="font-mono font-bold text-slate-800">{getRoleCormCode(role.id)}</span> | Subdiviziune: <span className="font-medium text-slate-800">{getRoleSubdivision(role.id)}</span></p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <label className="text-sm text-slate-700 font-medium">Unități Personal:</label>
            <input 
                type="number" 
                value={units} 
                onChange={(e) => setUnits(parseInt(e.target.value))}
                className="p-2 border border-slate-200 rounded-xl w-20 text-center font-bold text-blue-600" 
            />
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4" /> Validare
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="flex items-center gap-2 font-semibold text-lg text-slate-900"><Info className="w-5 h-5 text-blue-500" /> Dispoziții Generale</h4>
          <p className="text-slate-600 text-sm italic">Titularul postului se subordonează direct: Directorului General.</p>
        </div>
        <div className="space-y-6">
          <h4 className="flex items-center gap-2 font-semibold text-lg text-slate-900"><ClipboardCheck className="w-5 h-5 text-blue-500" /> Responsabilități</h4>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
            {role.responsibilities.map((resp, index) => (
              <li key={index}>{resp}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-100">
        <h4 className="flex items-center gap-2 font-semibold text-lg text-slate-900"><FileText className="w-5 h-5 text-blue-500" /> Contract Model (Fișa Postului)</h4>
        <pre className="p-6 bg-slate-50 rounded-2xl text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">{role.contractTemplate}</pre>
      </div>
      
    </div>
  );
};
