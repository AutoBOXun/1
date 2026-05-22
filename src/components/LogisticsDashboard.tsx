import React, { useState } from "react";
import { User, Vehicle, ServiceJob, JobStatus } from "../types";
import { 
  Truck, Car, Landmark, Navigation, Clock, ShieldCheck, MapPin, 
  PlusCircle, CheckCircle2, RefreshCw, Send, AlertCircle, FileText, UserCheck, Calendar
} from "lucide-react";

interface LogisticsDashboardProps {
  users: User[];
  vehicles: Vehicle[];
  serviceJobs: ServiceJob[];
  onNotify: (msg: string, type?: "success" | "info") => void;
  hideHeader?: boolean;
}

// Initial Simulated Courtesy Cars Fleet list
interface CourtesyCar {
  id: string;
  brand: string;
  model: string;
  plate: string;
  status: "Disponibil" | "Închiriat Client" | "În Service / Igienizare";
  currentClient?: string;
  fuelLevel: string;
  returnDate?: string;
}

// Initial Simulated Parts Deliveries Orders
interface PartDelivery {
  id: string;
  partName: string;
  supplier: string;
  carrier: "AutoBOX Courier" | "Autonet Van" | "NovaPost" | "Urgent Cargus";
  status: "Pregătire Expediere" | "În Tranzit înspre Ungheni" | "Sosit la Atelier" | "Întârziat";
  eta: string; // Estimated time of arrival
  relatedJobId?: string;
}

export default function LogisticsDashboard({
  users,
  vehicles,
  serviceJobs,
  onNotify,
  hideHeader = false
}: LogisticsDashboardProps) {
  // Simulated State for Courtesy Cars
  const [courtesyCars, setCourtesyCars] = useState<CourtesyCar[]>([
    { id: "cc-1", brand: "Dacia", model: "Logan Blue dCi", plate: "UN-901-AB", status: "Închiriat Client", currentClient: "Elena Vasiliu", fuelLevel: "85%", returnDate: "2026-05-23" },
    { id: "cc-2", brand: "Volkswagen", model: "Polo Trendline", plate: "UN-502-AB", status: "Disponibil", fuelLevel: "100%" },
    { id: "cc-3", brand: "Renault", model: "Clio Zen", plate: "UN-404-AB", status: "În Service / Igienizare", fuelLevel: "45%" }
  ]);

  // Simulated State for Parts Shipments
  const [deliveries, setDeliveries] = useState<PartDelivery[]>([
    { id: "del-101", partName: "Senzor turație Bosch (OEM: 11202)", supplier: "AutoTotal S.R.L.", carrier: "Autonet Van", status: "În Tranzit înspre Ungheni", eta: "Astăzi, 14:15", relatedJobId: "job-1" },
    { id: "del-102", partName: "Ulei Transmisie ZF 6 / 8 Trepte (5L)", supplier: "Elit Moldova", carrier: "AutoBOX Courier", status: "Sosit la Atelier", eta: "Sosit ieri", relatedJobId: "job-2" },
    { id: "del-103", partName: "Amortizor Bilstein B4 Spate (2 buc)", supplier: "Autonet import", carrier: "NovaPost", status: "Pregătire Expediere", eta: "Mâine dimineață" }
  ]);

  // States for Booking Courtesy Car form
  const [selectedCarId, setSelectedCarId] = useState(courtesyCars[1]?.id || "");
  const [clientNameInput, setClientNameInput] = useState("");
  const [daysInput, setDaysInput] = useState(3);

  // States for requesting Part Delivery form
  const [partNameInp, setPartNameInp] = useState("");
  const [supplierInp, setSupplierInp] = useState("AutoTotal Moldova");
  const [jobIdInp, setJobIdInp] = useState("job-1");
  const [selectedCarrier, setSelectedCarrier] = useState<"AutoBOX Courier" | "Autonet Van" | "NovaPost" | "Urgent Cargus">("AutoBOX Courier");

  const handleBookCourtesyCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientNameInput) {
      onNotify("Te rugăm să introduci numele clientului beneficiar!", "info");
      return;
    }

    const todayPlusDays = new Date();
    todayPlusDays.setDate(todayPlusDays.getDate() + daysInput);
    const dateStr = todayPlusDays.toISOString().split("T")[0];

    setCourtesyCars(prev => prev.map(car => {
      if (car.id === selectedCarId) {
        return {
          ...car,
          status: "Închiriat Client",
          currentClient: clientNameInput,
          returnDate: dateStr
        };
      }
      return car;
    }));

    onNotify(`Automobilul de curtoazie a fost rezervat cu succes pentru ${clientNameInput} până pe date de ${dateStr}!`, "success");
    setClientNameInput("");
  };

  const handleTriggerPartShipmentOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partNameInp) {
      onNotify("Te rugăm să introduci denumirea piesei solicitate!", "info");
      return;
    }

    const newShipment: PartDelivery = {
      id: `del-${Date.now().toString().slice(-3)}`,
      partName: partNameInp,
      supplier: supplierInp,
      carrier: selectedCarrier,
      status: "Pregătire Expediere",
      eta: "Peste 24-48 ore",
      relatedJobId: jobIdInp || undefined
    };

    setDeliveries(prev => [newShipment, ...prev]);
    onNotify(`Ordin logistic de expediere ${newShipment.id} generat cu succes pentru piesa: ${partNameInp}!`, "success");
    setPartNameInp("");
  };

  const handleUpdateStatus = (delId: string) => {
    setDeliveries(prev => prev.map(del => {
      if (del.id === delId) {
        const nextStatus: PartDelivery["status"] = 
          del.status === "Pregătire Expediere" ? "În Tranzit înspre Ungheni" :
          del.status === "În Tranzit înspre Ungheni" ? "Sosit la Atelier" : "Pregătire Expediere";
        return { ...del, status: nextStatus };
      }
      return del;
    }));
    onNotify(`Zborul curierului actualizat pentru livrarea ${delId}!`, "success");
  };

  const activeVehiclesCount = vehicles.length;
  const inWorkJobsCount = serviceJobs.filter(j => j.status === JobStatus.IN_PROGRESS).length;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header Block */}
      {!hideHeader ? (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-2xl border border-[#E9E9EB] shadow-sm gap-6 p-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F2F2F7] text-[#1D1D1F] rounded-2xl flex items-center justify-center shadow-sm border border-[#E9E9EB]">
                <Truck className="w-6 h-6 text-[#034EA2]" />
              </div>
              Logistică & Aprovizionare
            </h3>
            <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-16">Monitorizarea livrărilor urgente și flotei de curtoazie</p>
          </div>

          <div className="bg-[#E8F0FE] text-[#034EA2] font-bold px-4 py-2 rounded-full text-xs uppercase tracking-normal flex items-center gap-2 border border-indigo-100/50">
            <span className="w-2 h-2 rounded-full bg-[#034EA2] animate-pulse" />
            Dispecerat Flotă Activ
          </div>
        </div>
      ) : null}

      {/* 2. STATS KEY PERFORMANCE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-[#E9E9EB] text-[#1D1D1F] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Mașini de Curtoazie active</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#034EA2] flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#1D1D1F] leading-none">
              {courtesyCars.filter(c => c.status === "Închiriat Client").length} / {courtesyCars.length} Unități
            </h4>
            <p className="text-xs text-[#86868B] font-bold mt-2">Pe bază de contract de împrumut gratuit</p>
          </div>
        </div>

        <div className="bg-[#1D1D1F] text-white rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-normal text-zinc-400">Expedieri Active Piese</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Truck className="w-4 h-4 text-emerald-400 animate-bounce" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold font-mono leading-none text-emerald-400">
              {deliveries.filter(d => d.status !== "Sosit la Atelier").length} în tranzit
            </h4>
            <p className="text-xs text-zinc-400 font-semibold mt-2">Asigurate prin curieri Express în MD</p>
          </div>
        </div>

        <div className="bg-white border border-[#E9E9EB] text-[#1D1D1F] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Vehicule în curte</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF5FF] text-indigo-600 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#1D1D1F] leading-none">
              {activeVehiclesCount} mașini înregistrate
            </h4>
            <p className="text-xs text-[#86868B] font-bold mt-2">Pe rampe sau în parcare tehnică</p>
          </div>
        </div>

        <div className="bg-white border border-[#E9E9EB] text-[#1D1D1F] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Rată Livrare La Timp (SLA)</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#1D1D1F] leading-none">
              99.1%
            </h4>
            <p className="text-xs text-[#86868B] font-bold mt-2">Datorită parteneriatelor din Ungheni</p>
          </div>
        </div>

      </div>

      {/* 3. DUAL SECTIONS GRID: REGISTERING CONTROLS FOR COURTESY CARS & SHIPMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* BOOK COURTESY CARS FORM (Lg: 6) */}
        <div className="bg-white border border-[#E9E9EB] rounded-2xl p-6 lg:p-6 shadow-sm lg:col-span-6 space-y-4">
          <div className="border-b border-[#F2F2F7] pb-6">
            <h4 className="font-bold text-[#1D1D1F] text-lg uppercase tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E8F0FE] text-[#034EA2] flex items-center justify-center">
                 <Car className="w-4 h-4" />
              </div>
              Mașină de curtoazie
            </h4>
            <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-2">Alocare autoturisme pe durata lucrărilor programate</p>
          </div>

          <form onSubmit={handleBookCourtesyCar} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Alege Mașina Disponibilă:</label>
              <select 
                value={selectedCarId}
                onChange={e => setSelectedCarId(e.target.value)}
                className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-[#034EA2] outline-none cursor-pointer"
              >
                {courtesyCars.map(car => (
                  <option 
                    key={car.id} 
                    value={car.id}
                    disabled={car.status !== "Disponibil"}
                  >
                    {car.brand} {car.model} ({car.plate}) — Stare: {car.status} [Combustibil: {car.fuelLevel}]
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Nume Client Beneficiar:</label>
                <input 
                  type="text"
                  required
                  value={clientNameInput}
                  onChange={e => setClientNameInput(e.target.value)}
                  placeholder="Ex. Mihail Goreanu"
                  className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] text-xs font-semibold focus:ring-2 focus:ring-[#034EA2] outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Durată Alocare (zile):</label>
                <input 
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={daysInput}
                  onChange={e => setDaysInput(Number(e.target.value))}
                  className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] text-xs font-bold focus:ring-2 focus:ring-[#034EA2] outline-none font-mono"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#1D1D1F] text-white hover:bg-indigo-600 font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-normal cursor-pointer transition-all shadow-sm"
            >
              Emite Proces-verbal Alocare Auto
            </button>
          </form>
        </div>

        {/* SHIP PARTS DISPATCH ORDER FORM (Lg: 6) */}
        <div className="bg-white border border-[#E9E9EB] rounded-2xl p-6 lg:p-6 shadow-sm lg:col-span-6 space-y-4">
          <div className="border-b border-[#F2F2F7] pb-6">
            <h4 className="font-bold text-[#1D1D1F] text-lg uppercase tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                 <Truck className="w-4 h-4" />
              </div>
              Aprovizionare Piese
            </h4>
            <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-2">Comandă piese suplimentare cu transport express</p>
          </div>

          <form onSubmit={handleTriggerPartShipmentOrder} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Denumire Piesă + Detalii Tehnice:</label>
              <input 
                type="text"
                required
                value={partNameInp}
                onChange={e => setPartNameInp(e.target.value)}
                placeholder="Ex. Supapă admisie VW Golf (Brembo cod: 204)"
                className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] text-xs font-semibold focus:ring-2 focus:ring-[#034EA2] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Distribuitor / Furnizor:</label>
                <input 
                  type="text"
                  required
                  value={supplierInp}
                  onChange={e => setSupplierInp(e.target.value)}
                  placeholder="Ex. AutoTotal S.R.L."
                  className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] text-xs font-semibold focus:ring-2 focus:ring-[#034EA2] outline-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Opțiune Transport Curier:</label>
                <select
                  value={selectedCarrier}
                  onChange={e => setSelectedCarrier(e.target.value as any)}
                  className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-[#034EA2] outline-none cursor-pointer"
                >
                  <option value="AutoBOX Courier">AutoBOX Courier (Intern)</option>
                  <option value="Autonet Van">Autonet Van (Fix)</option>
                  <option value="NovaPost">NovaPost (Moldova)</option>
                  <option value="Urgent Cargus">Urgent Cargus Express</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#034EA2] text-white hover:bg-slate-900 font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-normal cursor-pointer transition-all shadow-sm"
            >
              Trimite Unitate Aprovizionare pe Traseu
            </button>
          </form>
        </div>

      </div>

      {/* 4. TABLES: EXPEDIERI ACTIVE PIESE & STARE CURENTĂ MAȘINI CURTOAZIE */}
      <div className="bg-white border border-[#E9E9EB] rounded-2xl p-4 lg:p-6 shadow-sm space-y-4">
        <div className="border-b border-[#F2F2F7] pb-6">
          <h4 className="font-bold text-[#1D1D1F] text-xl uppercase tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F2F2F7] text-[#1D1D1F] rounded-2xl flex items-center justify-center shadow-sm border border-[#E9E9EB]">
               <Clock className="w-5 h-5" />
            </div>
            Monitorizare Livrări
          </h4>
          <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-2 ml-14">Urmărirea în timp real a pieselor comandate pentru atelier</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead>
              <tr className="text-zinc-400 border-b border-gray-100">
                <th className="pb-3 text-left">ID Expediere</th>
                <th className="pb-3 text-left">Piesă Solicitată</th>
                <th className="pb-3 text-left">Furnizor Origine</th>
                <th className="pb-3 text-left">Curier / Transportor</th>
                <th className="pb-3 text-center">Timp estimat Arrival (ETA)</th>
                <th className="pb-3 text-center">Status Livrare</th>
                <th className="pb-3 text-center">Actualizează</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[#1D1D1F] font-semibold">
              {deliveries.map((del) => (
                <tr key={del.id} className="hover:bg-[#F2F2F7]/50 transition-colors">
                  <td className="py-4 font-bold font-mono text-[#034EA2] uppercase">{del.id}</td>
                  <td className="py-4 font-bold">
                    <span>{del.partName}</span>
                    {del.relatedJobId && (
                      <span className="block text-xs text-zinc-400">Atribuit devizului: {del.relatedJobId}</span>
                    )}
                  </td>
                  <td className="py-4 text-[#1D1D1F]">{del.supplier}</td>
                  <td className="py-4 text-zinc-500 font-mono text-xs uppercase font-semibold">{del.carrier}</td>
                  <td className="py-4 text-center font-mono text-zinc-500">{del.eta}</td>
                  <td className="py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-normal ${
                      del.status === "Sosit la Atelier" 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-150" 
                        : del.status === "În Tranzit înspre Ungheni"
                        ? "bg-blue-50 text-blue-600 border border-blue-150" 
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      {del.status}
                    </span>
                  </td>
                  <td className="py-4 text-center">
                    <button 
                      onClick={() => handleUpdateStatus(del.id)}
                      className="p-1 px-2.5 bg-zinc-100 hover:bg-[#034EA2] hover:text-white rounded-md text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                    >
                      Status următor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
