import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { rolesCatalog, RoleJobDescription } from '../../data/roles';
import { User } from '../../types';

interface RolesViewProps {
  onSelectRole: (id: string) => void;
  staff: User[];
  onSelectEmployee: (id: string) => void;
  onAddRole: () => void;
  roles: RoleJobDescription[];
}

export const RolesView = ({ onSelectRole, staff, onSelectEmployee, onAddRole, roles }: RolesViewProps) => (
  <div className="bg-white border border-[#E9E9EB] rounded-[32px] p-8 shadow-sm space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-blue-600" />
        Catalog Funcții și Roluri
      </h3>
      <button 
        onClick={onAddRole}
        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
        title="Adaugă Funcție Nouă"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roles.map(role => {
        const occupant = staff.find(u => u.role === (role.role as any));
        return (
          <div key={role.id} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 transition-all shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-500 px-1">
                    {role.occupiedUnits}/{role.totalUnits}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold uppercase ${role.isOccupied ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {role.isOccupied ? 'Ocupată' : 'Vacantă'}
                  </span>
                </div>
                {role.isOccupied && occupant && (
                  <button 
                    onClick={() => onSelectEmployee(occupant.id)}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold underline"
                  >
                    {occupant.name}
                  </button>
                )}
              </div>
              <h4 
                className="font-semibold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => onSelectRole(role.id)}
              >
                {role.title}
              </h4>
              <p className="text-sm text-slate-600 mt-2">{role.responsibilities[0]}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
