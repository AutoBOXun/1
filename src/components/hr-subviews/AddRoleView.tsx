import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface AddRoleViewProps {
  onSave: (roleData: any) => void;
  onCancel: () => void;
}

export const AddRoleView = ({ onSave, onCancel }: AddRoleViewProps) => {
  const [formData, setFormData] = useState({
    title: '',
    roleCategory: '',
    responsibilities: '',
    salary: '',
    workScheduleStart: '',
    workScheduleEnd: '',
    breakPeriod: '',
    restDays: '',
    totalUnits: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      responsibilities: formData.responsibilities.split('\n').filter(r => r.trim() !== '')
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
      <button onClick={onCancel} className="flex items-center text-slate-500 hover:text-blue-600 mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Înapoi la Catalog
      </button>
      <h3 className="text-2xl font-semibold text-slate-900">Adaugă Funcție Nouă</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Denumire Funcție</label>
            <input type="text" className="w-full p-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Categorie/Rol Intern</label>
            <input type="text" className="w-full p-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" value={formData.roleCategory} onChange={e => setFormData({...formData, roleCategory: e.target.value})} required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Responsabilități (una pe linie)</label>
          <textarea className="w-full p-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" rows={5} value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})} required />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
             <label className="block text-sm font-medium text-slate-700">Număr unități personal</label>
             <input type="number" className="w-full p-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" value={formData.totalUnits} onChange={e => setFormData({...formData, totalUnits: parseInt(e.target.value)})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Salariu (MDL/lună)</label>
            <input type="number" className="w-full p-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
              <label className="block text-sm font-medium text-slate-700">Program Start</label>
              <input type="time" className="w-full p-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" value={formData.workScheduleStart} onChange={e => setFormData({...formData, workScheduleStart: e.target.value})} />
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700">Program Sfârșit</label>
              <input type="time" className="w-full p-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" value={formData.workScheduleEnd} onChange={e => setFormData({...formData, workScheduleEnd: e.target.value})} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
              <label className="block text-sm font-medium text-slate-700">Pauză de masă</label>
              <input type="text" placeholder="ex: 12:00 - 13:00" className="w-full p-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" value={formData.breakPeriod} onChange={e => setFormData({...formData, breakPeriod: e.target.value})} />
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700">Zile de repaus</label>
              <input type="text" placeholder="ex: Sâmbătă, Duminică" className="w-full p-3 border border-slate-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all" value={formData.restDays} onChange={e => setFormData({...formData, restDays: e.target.value})} />
          </div>
        </div>
        
        <div className="pt-6">
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <Save className="w-5 h-5" />
            Salvează Funcția
          </button>
        </div>
      </form>
    </div>
  );
};
