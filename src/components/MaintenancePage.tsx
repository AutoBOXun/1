import { 
  Users, Car, Calendar, Wrench, Database, FileText, 
  Download, Upload, Trash2, ChevronLeft, ShieldAlert 
} from "lucide-react";
import { motion } from "motion/react";
import { User, Vehicle, Appointment, ServiceJob, InventoryItem, Invoice } from "../types";

interface MaintenancePageProps {
  onBack: () => void;
  data: {
    users: User[];
    vehicles: Vehicle[];
    appointments: Appointment[];
    serviceJobs: ServiceJob[];
    inventoryItems: InventoryItem[];
    invoices: Invoice[];
  };
  actions: {
    onExport: (table: string) => void;
    onImport: (table: string, file: File) => void;
    onDelete: (table: string) => void;
    onDeleteAll: () => void;
  };
}

export default function MaintenancePage({ onBack, data, actions }: MaintenancePageProps) {
  const categories = [
    { id: "users", name: "UTILIZATORI", icon: <Users className="w-6 h-6" />, count: data.users.length },
    { id: "vehicles", name: "VEHICULE", icon: <Car className="w-6 h-6" />, count: data.vehicles.length },
    { id: "appointments", name: "PROGRAMĂRI", icon: <Calendar className="w-6 h-6" />, count: data.appointments.length },
    { id: "serviceJobs", name: "FIȘE SERVICE", icon: <Wrench className="w-6 h-6" />, count: data.serviceJobs.length },
    { id: "inventory", name: "INVENTAR PIESE", icon: <Database className="w-6 h-6" />, count: data.inventoryItems.length },
    { id: "invoices", name: "FACTURI FISCALE", icon: <FileText className="w-6 h-6" />, count: data.invoices.length },
  ];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E9E9EB] p-4 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
          <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-2.5 bg-white border border-[#eef1f6] rounded-2xl text-[#86868B] hover:text-[#1D1D1F] transition-all cursor-pointer mr-1"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1D1D1F]">Mentenanță & Recuperare</h1>
            <p className="text-[#86868B] text-xs font-semibold uppercase tracking-normal mt-1">Sistem de Gestiune Database AutoBOX</p>
          </div>
        </div>
        
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center shadow-inner">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-normal">Zona de Risc</p>
            <p className="text-xs font-bold text-[#1D1D1F] leading-none mt-1">Intervenții directe asupra tabelelor</p>
            <button
               onClick={() => actions.onDeleteAll()}
               className="mt-2 text-rose-600 font-bold text-[10px] uppercase underline hover:text-rose-700 cursor-pointer"
            >
               Curățare integrală (păstrează owner)
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={cat.id}
            className="bg-white border border-[#E9E9EB] shadow-sm rounded-2xl p-4 space-y-4 hover:shadow-xl hover:border-blue-100 transition-all group overflow-hidden relative text-left"
          >
            {/* Background Accent */}
            <div className="absolute -top-6 -right-12 w-32 h-32 bg-[#E8F0FE] rounded-full blur-3xl group-hover:bg-[#034EA2]/10 transition-colors"></div>

            <div className="flex justify-between items-start relative z-10">
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-[#034EA2] rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-[#034EA2] group-hover:text-white transition-all duration-500">
                {cat.icon}
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal block mb-1">Înregistrări</span>
                <span className="text-xl font-bold text-[#1D1D1F] leading-none">{cat.count}</span>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F]">{cat.name}</h3>
              <p className="text-xs text-[#86868B] font-bold mt-1 uppercase tracking-normal">Gestiune binară obiecte {cat.id}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2 relative z-10">
              <button 
                onClick={() => actions.onExport(cat.id)}
                className="w-full bg-[#F2F2F7] hover:bg-[#E9E9EB] text-[#1D1D1F] font-bold py-4 px-6 rounded-xl border border-[#E9E9EB] flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-normal active:scale-[0.98] cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#034EA2]" /> Export JSON
              </button>
              
              <label className="w-full bg-white hover:bg-[#E8F0FE] text-[#1D1D1F] font-bold py-4 px-6 rounded-xl border border-[#E9E9EB] flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-normal cursor-pointer border-dashed hover:border-[#034EA2]/50 hover:text-[#034EA2]">
                <Upload className="w-4 h-4 text-emerald-600" /> Restaurare
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) actions.onImport(cat.id, file);
                  }}
                />
              </label>

              <button 
                onClick={() => actions.onDelete(cat.id)}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-4 px-6 rounded-xl border border-rose-100 flex items-center justify-center gap-3 transition-all text-xs uppercase tracking-normal active:scale-[0.98] cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Resetează Secțiunea
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-[#F2F2F7] p-4 rounded-2xl text-center max-w-2xl mx-auto border border-[#E9E9EB]">
        <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal leading-loose">
          Toate acțiunile de import vor suprascrie datele curente pe secțiunea selectată. <br />
          Asigurați-vă că dețineți un backup valid înainte de orice operațiune de restaurare sau ștergere.
        </p>
      </div>
    </div>
  );
}
