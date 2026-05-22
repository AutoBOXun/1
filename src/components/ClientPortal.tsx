/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from "react";
import { User, Vehicle, ServiceType, Appointment, ServiceJob, Invoice, JobStatus } from "../types";
import { 
  Calendar, Clock, User as UserIcon, Car, FileText, CheckCircle, 
  ChevronRight, Sparkles, Filter, ShieldAlert, BadgeInfo, Download, RefreshCw,
  ArrowRight, ArrowLeft, ClipboardCheck, Info, LogOut, Shield, Key,
  ShieldCheck, Activity, Wrench, Layers, Plus, Phone
} from "lucide-react";

import LandingPage from "./LandingPage";

interface ClientPortalProps {
  users: User[];
  vehicles: Vehicle[];
  serviceTypes: ServiceType[];
  appointments: Appointment[];
  serviceJobs: ServiceJob[];
  invoices: Invoice[];
  currentClient: User;
  currentUser: User | null;
  activeTab: "home" | "dashboard" | "book-wizard" | "documents" | "catalog" | "my-vehicle" | "add-vehicle";
  onTabChange: (tab: "home" | "dashboard" | "book-wizard" | "documents" | "catalog" | "my-vehicle" | "add-vehicle") => void;
  onAddAppointment: (appointment: Appointment) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
  onNotify: (message: string, type: "success" | "info") => void;
  setActiveView: (view: "landing" | "client" | "admin" | "schema" | "control-panel") => void;
  onLoginSuccess: (user: User, isOwner: boolean) => void;
  onRegisterSuccess: (newUser: User, newVehicle?: Vehicle) => void;
}

export default function ClientPortal({
  users,
  vehicles,
  serviceTypes,
  appointments,
  serviceJobs,
  invoices,
  currentClient,
  currentUser,
  activeTab,
  onTabChange,
  onAddAppointment,
  onAddVehicle,
  onNotify,
  setActiveView,
  onLoginSuccess,
  onRegisterSuccess
}: ClientPortalProps) {
  // Local state for internal UI elements
  const [selectedCategory, setSelectedCategory] = useState<string>("Toate");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<ServiceJob | null>(null);

  // Filter lists based on the strictly required context (CurrentUser or ActiveClient)
  const clientVehicles = useMemo(() => vehicles.filter(v => v.clientId === currentClient.id), [vehicles, currentClient.id]);
  const clientAppointments = useMemo(() => appointments.filter(a => a.clientId === currentClient.id), [appointments, currentClient.id]);
  const clientJobs = useMemo(() => serviceJobs.filter(j => j.clientId === currentClient.id), [serviceJobs, currentClient.id]);
  const clientInvoices = useMemo(() => invoices.filter(i => i.clientId === currentClient.id), [invoices, currentClient.id]);

  // Sync selected job with the most relevant active job
  React.useEffect(() => {
    if (clientJobs.length > 0) {
      // Prioritize jobs in progress, then scheduled, then finished
      const active = clientJobs.find(j => j.status === JobStatus.IN_PROGRESS) 
        || clientJobs.find(j => j.status === JobStatus.IN_RECEPTION)
        || clientJobs[0];
      setSelectedJob(active);
    } else {
      setSelectedJob(null);
    }
  }, [clientJobs, currentClient.id]);

  // Stepped Programming Wizard form State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  
  // Wizards Form Data
  const [carBrand, setCarBrand] = useState("Dacia");
  const [carModel, setCarModel] = useState("Dacia Logan Stepway");
  const [carPlate, setCarPlate] = useState("UN-999-ST");
  const [carVin, setCarVin] = useState("UU1KSDDA000999555");
  const [carYear, setCarYear] = useState(2022);
  const [carEngine, setCarEngine] = useState("1.0 TCe LPG 100 CP");
  const [carEngineDisp, setCarEngineDisp] = useState("");
  const [carFuelType, setCarFuelType] = useState<any>("");
  const [carPower, setCarPower] = useState<number | "">("");
  const [carTransmission, setCarTransmission] = useState<any>("");
  const [carColor, setCarColor] = useState("");

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([serviceTypes[1]?.id || ""]);
  const [bookDate, setBookDate] = useState("2026-05-22");
  const [bookTime, setBookTime] = useState("10:00");
  const [bookNotes, setBookNotes] = useState("Revizie completă + verificare suspensie și lumini bord.");

  // Calculated Price
  const totalPrice = serviceTypes
    .filter(s => selectedServiceIds.includes(s.id))
    .reduce((sum, s) => sum + s.estimatedPrice, 0);

  const toggleService = useCallback((id: string) => {
    setSelectedServiceIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(sid => sid !== id);
      }
      return [...prev, id];
    });
  }, []);

  // Invoice view state modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Add Vehicle Form State
  const [newVehBrand, setNewVehBrand] = useState("");
  const [newVehModel, setNewVehModel] = useState("");
  const [newVehPlate, setNewVehPlate] = useState("");
  const [newVehVin, setNewVehVin] = useState("");
  const [newVehYear, setNewVehYear] = useState(new Date().getFullYear());
  const [newVehEngine, setNewVehEngine] = useState("");
  const [newVehEngineDisp, setNewVehEngineDisp] = useState("");
  const [newVehFuelType, setNewVehFuelType] = useState<any>("");
  const [newVehPower, setNewVehPower] = useState<number | "">("");
  const [newVehTransmission, setNewVehTransmission] = useState<any>("");
  const [newVehColor, setNewVehColor] = useState("");
  const [newVehMileage, setNewVehMileage] = useState(0);

  const [isDecoding, setIsDecoding] = useState(false);

  const handleDecodeVin = useCallback(async (vin: string, target: "wizard" | "new") => {
    if (vin.length < 5) {
      onNotify("Introdu un cod VIN valid pentru scanare!", "info");
      return;
    }
    
    setIsDecoding(true);
    // Simulate AI Scan
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock database logic
    const mockData: any = {
      "WBA": { brand: "BMW", model: "Seria 5 G30", year: 2019, engine: "2.0d B47", disp: "1995 cmc", fuel: "Diesel", power: 190, trans: "Automată", color: "Sophisto Grey" },
      "WVG": { brand: "VW", model: "Tiguan II", year: 2021, engine: "2.0 TDI", disp: "1968 cmc", fuel: "Diesel", power: 150, trans: "Automată", color: "Pure White" },
      "WDD": { brand: "Mercedes", model: "E-Class W213", year: 2020, engine: "E220d", disp: "1950 cmc", fuel: "Diesel", power: 194, trans: "Automată", color: "Obsidian Black" },
      "UU1": { brand: "Dacia", model: "Logan III", year: 2022, engine: "1.0 TCe", disp: "999 cmc", fuel: "GPL", power: 100, trans: "Manuală", color: "Blue Iron" },
      "TMB": { brand: "Skoda", model: "Octavia IV", year: 2023, engine: "2.0 TDI", disp: "1968 cmc", fuel: "Diesel", power: 150, trans: "Automată", color: "Graphite Grey" }
    };

    const prefix = vin.substring(0, 3).toUpperCase();
    const result = mockData[prefix] || { brand: "Unknown", model: "Scanat din VIN", year: 2020, engine: "1.6", disp: "1598 cmc", fuel: "Benzină", power: 110, trans: "Manuală", color: "Gri Metalizat" };

    if (target === "wizard") {
      setCarBrand(result.brand);
      setCarModel(result.model);
      setCarYear(result.year);
      setCarEngine(result.engine);
      setCarEngineDisp(result.disp);
      setCarFuelType(result.fuel);
      setCarPower(result.power);
      setCarTransmission(result.trans);
      setCarColor(result.color);
    } else {
      setNewVehBrand(result.brand);
      setNewVehModel(result.model);
      setNewVehYear(result.year);
      setNewVehEngine(result.engine);
      setNewVehEngineDisp(result.disp);
      setNewVehFuelType(result.fuel);
      setNewVehPower(result.power);
      setNewVehTransmission(result.trans);
      setNewVehColor(result.color);
    }

    setIsDecoding(false);
    onNotify(`✨ AI: Datele pentru ${result.brand} au fost descifrate cu succes!`, "success");
  }, [onNotify]);

  const categories = ["Toate", "Mecanică", "Electrică", "Diagnoză", "Revizie", "Climatizare", "Frâne", "Direcție"];

  // Filter service catalog
  const filteredServices = serviceTypes.filter(s => {
    const matchesCat = selectedCategory === "Toate" || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Action methods for Booking
  const nextStep = () => {
    if (wizardStep === 1) {
      if (!carBrand || !carModel || !carPlate || !carVin) {
        onNotify("Te rugăm să completezi toate datele mașinii!", "info");
        return;
      }
      if (carVin.trim().length !== 17) {
        onNotify("Seria de șasiu (VIN) trebuie să aibă exact 17 caractere!", "info");
        return;
      }
    }
    if (wizardStep === 2) {
      if (selectedServiceIds.length === 0) {
        onNotify("Te rugăm să alegi cel puțin un serviciu!", "info");
        return;
      }
    }
    setWizardStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const prevStep = () => {
    setWizardStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const loadMyVehicleToForm = (veh: Vehicle) => {
    setCarBrand(veh.brand);
    setCarModel(veh.model);
    setCarPlate(veh.licensePlate);
    setCarVin(veh.vin);
    setCarYear(veh.year);
    setCarEngine(veh.engine || "");
    setCarEngineDisp(veh.engineDisplacement || "");
    setCarFuelType(veh.fuelType || "");
    setCarPower(veh.powerHP || "");
    setCarTransmission(veh.transmission || "");
    setCarColor(veh.color || "");
    onNotify(`S-au încărcat datele mașinii înregistrate: ${veh.brand} ${veh.model}`, "success");
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedServiceIds.length === 0) {
      onNotify("Te rugăm să alegi cel puțin un serviciu!", "info");
      return;
    }

    // 1. Create and register the vehicle if it doesn't exist
    const plateUpper = carPlate.toUpperCase();
    let existingVehicle = clientVehicles.find(v => v.licensePlate === plateUpper);

    if (!existingVehicle) {
      existingVehicle = {
        id: `v-client-${Date.now()}`,
        clientId: currentClient.id,
        brand: carBrand,
        model: carModel,
        licensePlate: plateUpper,
        vin: carVin.toUpperCase(),
        year: Number(carYear),
        engine: carEngine,
        engineDisplacement: carEngineDisp,
        fuelType: carFuelType as any,
        powerHP: Number(carPower) || undefined,
        transmission: carTransmission as any,
        color: carColor,
        mileage: 82000
      };
      onAddVehicle(existingVehicle);
    }

    // 2. Submit Appointment
    const newAppointment: Appointment = {
      id: `ap-client-${Date.now().toString().slice(-4)}`,
      clientId: currentClient.id,
      vehicleId: existingVehicle.id,
      serviceTypeIds: selectedServiceIds,
      date: bookDate,
      time: bookTime,
      notes: bookNotes,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    onAddAppointment(newAppointment);
    onNotify("Programarea a fost salvată, iar mașina a intrat în fluxul de confirmare!", "success");
    
    // Reset wizard
    setWizardStep(1);
    setBookNotes("");
    onTabChange("dashboard");
  };

  const handleAddNewVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVehBrand || !newVehModel || !newVehPlate || !newVehVin) {
      onNotify("Te rugăm să completezi câmpurile obligatorii!", "info");
      return;
    }

    if (newVehVin.length !== 17) {
      onNotify("Seria de șasiu (VIN) trebuie să aibă fix 17 caractere!", "info");
      return;
    }

    const plateUpper = newVehPlate.toUpperCase();
    const existing = vehicles.find(v => v.licensePlate === plateUpper);
    if (existing) {
       onNotify("Această mașină este deja înregistrată în sistem!", "info");
       return;
    }

    const newVehicle: Vehicle = {
      id: `v-add-${Date.now()}`,
      clientId: currentClient.id,
      brand: newVehBrand,
      model: newVehModel,
      licensePlate: plateUpper,
      vin: newVehVin.toUpperCase(),
      year: Number(newVehYear),
      engine: newVehEngine,
      engineDisplacement: newVehEngineDisp,
      fuelType: newVehFuelType as any,
      powerHP: Number(newVehPower) || undefined,
      transmission: newVehTransmission as any,
      color: newVehColor,
      mileage: Number(newVehMileage)
    };

    onAddVehicle(newVehicle);
    onNotify(`Vehiculul ${newVehBrand} ${newVehModel} a fost adăugat cu succes!`, "success");
    
    // Reset form and go to my-vehicle
    setNewVehBrand("");
    setNewVehModel("");
    setNewVehPlate("");
    setNewVehVin("");
    setNewVehYear(new Date().getFullYear());
    setNewVehEngine("");
    setNewVehEngineDisp("");
    setNewVehFuelType("");
    setNewVehPower("");
    setNewVehTransmission("");
    setNewVehColor("");
    setNewVehMileage(0);
    onTabChange("my-vehicle");
  };

  // Simplified Stepper: Recepție -> În lucru -> Finalizat (Romanian translation)
  // Mapping of complex JobStatus keys into streamlined 3-step dashboard stepper
  const getStepProgressPosition = (jobStatus: JobStatus) => {
    switch (jobStatus) {
      case JobStatus.SCHEDULED:
      case JobStatus.IN_RECEPTION:
        return 0; // "Recepție"
      case JobStatus.IN_PROGRESS:
      case JobStatus.AWAITING_PARTS:
        return 1; // "În lucru"
      case JobStatus.FINISHED:
      case JobStatus.READY_FOR_DELIVERY:
        return 2; // "Finalizat"
      default:
        return 0;
    }
  };

  const getMechanicName = (job: ServiceJob) => {
    if (job.allocatedMechanicId) {
      const mech = users.find(u => u.id === job.allocatedMechanicId);
      if (mech) return mech.name;
    }
    if (!job.labor || job.labor.length === 0) return "Evaluare tehnică la rampă (Nedesemnat)";
    const mechanicId = job.labor[0].mechanicId;
    const mechanic = users.find(u => u.id === mechanicId);
    return mechanic ? mechanic.name : "Nedesemnat încă";
  };

  // Navigation Tabs Layout
  const mainTabs = [
    { id: "home", label: "Acasă", icon: <Layers className="w-5 h-5" /> },
    { id: "dashboard", label: "Status Live", icon: <Activity className="w-5 h-5" /> },
    { id: "my-vehicle", label: "Mașina mea", icon: <Shield className="w-5 h-5" /> },
    { id: "add-vehicle", label: "Adaugă Vehicul", icon: <Plus className="w-5 h-5" /> },
    { id: "book-wizard", label: "Programare", icon: <Calendar className="w-5 h-5" /> },
    { id: "documents", label: "Documente", icon: <FileText className="w-5 h-5" /> },
    { id: "catalog", label: "Catalog", icon: <BadgeInfo className="w-5 h-5" /> }
  ];

  return (
    <div id="client-portal-root" className="space-y-4 pb-20">
      
      {/* 1. Sleek, Integrated Top Navigation Header */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white border border-[#E9E9EB] rounded-full p-4 shadow-sm">
        {/* Brand & Client Status Info */}
        <div className="flex items-center gap-3.5 px-2">
          <div className="w-10 h-10 rounded-2xl bg-[#1D1D1F] text-white flex items-center justify-center shadow-md">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-[#1D1D1F] uppercase">AutoBOX PORTAL</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-[#86868B] tracking-normal uppercase">LIVE</span>
            </div>
            <p className="text-xs text-[#86868B] font-bold mt-0.5">
              {currentUser?.name || currentClient.name} • <span className="text-[#034EA2]">{currentUser?.role || "CLIENT"}</span>
            </p>
          </div>
        </div>

        {/* Resized and Harmoniously Integrated Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 bg-[#F2F2F7] p-1.5 rounded-xl max-w-full overflow-x-auto scrollbar-hide">
          {mainTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold rounded-[18px] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#1D1D1F] text-white shadow-sm scale-102"
                  : "bg-transparent text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E9E9EB]/60"
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center scale-90">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>


      {/* 3. VIEW ACTIONS */}

      {/* VIEW HOME: INTEGRATED LANDING PAGE CONTENT  */}
      {activeTab === "home" && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <LandingPage 
            vehicles={vehicles}
            users={users}
            serviceTypes={serviceTypes}
            appointments={appointments}
            currentUser={currentUser}
            setActiveView={setActiveView}
            onLoginSuccess={onLoginSuccess}
            onRegisterSuccess={onRegisterSuccess}
            onNotify={onNotify}
          />
        </div>
      )}

      {/* VIEW A: DASHBOARD PRINCIPAL  */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white rounded-[28px] p-6 md:p-8 border border-[#eef1f6] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-8 mb-10 flex-wrap gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F2F2F7] text-[#034EA2] rounded-[18px] flex items-center justify-center shadow-inner group transition-all">
                    <Activity className="w-6 h-6 animate-[pulse_2s_infinite]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Status Tehnic Live</h2>
                    <p className="text-sm text-[#86868B] font-medium">Monitorizarea progresului în timp real pentru vehiculul tău.</p>
                  </div>
                </div>
              </div>

              {clientJobs.length > 0 && selectedJob && (
                <div className="flex items-center bg-[#F2F2F7] p-1.5 rounded-[22px] border border-[#E9E9EB]">
                  <label htmlFor="active-job-sel" className="text-[10px] font-bold text-[#86868B] px-4 uppercase tracking-tighter">Vehicul Activ:</label>
                  <select
                    id="active-job-sel"
                    value={selectedJob.id}
                    onChange={(e) => {
                      const found = clientJobs.find(j => j.id === e.target.value);
                      if (found) setSelectedJob(found);
                    }}
                    className="bg-white text-xs font-bold text-[#1D1D1F] px-6 py-3 rounded-[18px] border border-[#E9E9EB] focus:outline-none cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    {clientJobs.map(j => {
                      const veh = vehicles.find(v => v.id === j.vehicleId);
                      return (
                        <option key={j.id} value={j.id}>
                          {veh ? `${veh.brand} ${veh.model} (${veh.licensePlate})` : `Fișă: ${j.id.toUpperCase()}`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>

            {clientJobs.length === 0 ? (
              <div className="text-center py-20 space-y-8 bg-[#F2F2F7]/30 rounded-[32px] border border-dashed border-[#E9E9EB]">
                <div className="w-20 h-20 rounded-[32px] bg-white flex items-center justify-center mx-auto text-[#D1D1D6] shadow-sm border border-[#E9E9EB]">
                  <Car className="w-10 h-10 opacity-40" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">E liniște în atelier.</h4>
                  <p className="text-[#86868B] font-medium max-w-sm mx-auto leading-relaxed">
                    Momentan nu ai niciun vehicul în faza de reparație activă. Îți recomandăm o verificare preventivă.
                  </p>
                </div>
                <button
                  id="dash-go-booking-btn"
                  onClick={() => {
                    onTabChange("book-wizard");
                    setWizardStep(1);
                  }}
                  className="bg-[#034EA2] hover:bg-[#1D1D1F] text-white font-bold text-sm px-8 py-5 rounded-[22px] transition-all shadow-2xl shadow-[#034EA2]/20 active:scale-95 inline-flex items-center gap-3 group cursor-pointer uppercase tracking-tight"
                >
                  Programează Vizită
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              selectedJob && (
                <div className="space-y-8">
                  {(() => {
                    const veh = vehicles.find(v => v.id === selectedJob.vehicleId);
                    const currentProgressIndex = getStepProgressPosition(selectedJob.status);
                    
                    const dashboardSteps = [
                      { 
                        title: "Recepție", 
                        desc: "Evaluare tehnică",
                        icon: <ClipboardCheck className="w-7 h-7" />
                      },
                      { 
                        title: "În Lucru", 
                        desc: "Execuție rampă",
                        icon: <Wrench className="w-7 h-7" />
                      },
                      { 
                        title: "Finalizat", 
                        desc: "Gata de livrare",
                        icon: <CheckCircle className="w-7 h-7" />
                      }
                    ];

                    return (
                      <div className="space-y-12">
                        {/* Status Stepper - Airier and cleaner */}
                        <div className="relative px-12">
                          <div className="absolute top-[32px] left-[10%] right-[10%] h-1 bg-[#F2F2F7] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#034EA2] transition-all duration-1000 ease-in-out shadow-[0_0_20px_rgba(3,78,162,0.4)]"
                              style={{ width: `${(currentProgressIndex / 2) * 100}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between items-center relative z-10">
                            {dashboardSteps.map((step, idx) => {
                              const isCompleted = idx < currentProgressIndex;
                              const isActive = idx === currentProgressIndex;

                              return (
                                <div key={idx} className="flex flex-col items-center gap-4 w-40">
                                  <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-700 border-4 shadow-xl ${
                                    isActive ? "bg-[#1D1D1F] border-[#E8F0FE] scale-110 rotate-0" : 
                                    isCompleted ? "bg-[#034EA2] border-white text-white" : 
                                    "bg-white border-[#F2F2F7] text-[#D1D1D6] shadow-none"
                                  }`}>
                                    <div className={`transition-all duration-700 ${isActive ? "text-[#034EA2] scale-100" : isCompleted ? "text-white" : "text-[#D1D1D6]"}`}>
                                      {step.icon}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <h4 className={`text-xs font-bold uppercase tracking-tight mb-0.5 ${isActive ? "text-[#1D1D1F]" : "text-[#86868B]"}`}>
                                      {step.title}
                                    </h4>
                                    <p className="text-[10px] text-[#86868B] font-bold opacity-60 leading-tight">{step.desc}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Details Cards in Bento Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-[#F2F2F7]/50 rounded-[24px] p-8 border border-[#E9E9EB] space-y-8 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-[#1D1D1F] uppercase tracking-normal flex items-center gap-3">
                                <Info className="w-5 h-5 text-[#034EA2]" />
                                Dosar Service: {selectedJob.id.toUpperCase()}
                              </h4>
                              <span className="px-3 py-1 bg-white rounded-full text-[9px] font-bold border border-[#E9E9EB] text-[#86868B]">ID: {selectedJob.id}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-tighter">Vehicul</p>
                                <p className="text-lg font-bold text-[#1D1D1F] tracking-tight">{veh?.brand} {veh?.model}</p>
                              </div>
                              <div className="space-y-1.5 text-right">
                                <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-tighter">Nr. Înmatriculare</p>
                                <p className="text-lg font-bold text-[#034EA2] font-mono tracking-tight">{veh?.licensePlate}</p>
                              </div>
                              <div className="space-y-1.5 border-t border-[#E9E9EB] pt-4">
                                <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-tighter">Data Intrării</p>
                                <p className="text-sm font-bold text-[#1D1D1F]">{selectedJob.entryDate}</p>
                              </div>
                              <div className="space-y-1.5 text-right border-t border-[#E9E9EB] pt-4">
                                <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-tighter">Mecanic Responsabil</p>
                                <p className="text-sm font-bold text-[#1D1D1F] flex items-center justify-end gap-2 text-emerald-600">
                                   {getMechanicName(selectedJob)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-[24px] p-8 border border-[#E9E9EB] shadow-sm space-y-8">
                             <h4 className="font-bold text-xs text-[#1D1D1F] uppercase tracking-normal flex items-center gap-3">
                               <ShieldAlert className="w-5 h-5 text-amber-500" />
                               Diagnostică și Observații
                             </h4>
                             <div className="space-y-5">
                                <div className="p-6 bg-amber-50/50 rounded-[20px] border border-amber-100/50 flex gap-4">
                                   <div className="w-1 h-auto bg-amber-400 rounded-full shrink-0" />
                                   <div>
                                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter mb-1">DEFECT RAPORTAT</p>
                                      <p className="text-sm font-bold text-amber-900 leading-relaxed italic">"{selectedJob.reportedFaults || "Inspectie vizuala generala solicitata."}"</p>
                                   </div>
                                </div>
                                <div className="p-6 bg-[#F2F2F7] rounded-[20px] border border-[#E9E9EB] flex gap-4">
                                   <div className="w-1 h-auto bg-[#1D1D1F] rounded-full shrink-0" />
                                   <div>
                                      <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-tighter mb-1">CONSTATARE TEHNICĂ</p>
                                      <p className="text-sm font-bold text-[#1D1D1F] leading-relaxed">
                                         {selectedJob.diagnosedProblems || "Evaluarea este în desfășurare pe elevator..."}
                                      </p>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </div>

                        {/* List items - cleaner, rounded */}
                        <div className="bg-white rounded-[24px] p-8 border border-[#E9E9EB] shadow-sm">
                           <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#F2F2F7]">
                              <h4 className="font-bold text-xs text-[#1D1D1F] uppercase tracking-normal">Lista Lucrări & Piese</h4>
                              <div className="flex gap-2">
                                <span className="text-[10px] font-bold text-[#034EA2] uppercase bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
                                   {selectedJob.parts.length} PIESE
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
                                   {selectedJob.labor.length} OPERAȚIUNI
                                </span>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest ml-1">PACHET HARDWARE</p>
                                 <div className="space-y-3">
                                    {selectedJob.parts.map((p, i) => (
                                       <div key={i} className="flex justify-between items-center p-5 bg-[#F2F2F7] rounded-[20px] border border-[#E9E9EB] hover:border-[#034EA2]/30 transition-all cursor-default">
                                          <div className="space-y-0.5">
                                            <p className="font-bold text-[#1D1D1F] text-sm">{p.name}</p>
                                            <p className="text-[10px] font-bold text-[#86868B] uppercase">{p.oemCode}</p>
                                          </div>
                                          <span className="font-extrabold text-[#034EA2] text-xs bg-white px-4 py-2 rounded-xl shadow-sm">{p.quantity} buc</span>
                                       </div>
                                    ))}
                                    {selectedJob.parts.length === 0 && <div className="p-8 text-center bg-[#F2F2F7]/50 rounded-[20px] border border-dashed border-[#E9E9EB] text-[#86868B] text-xs font-bold">Nicio piesă înregistrată.</div>}
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest ml-1">MANOPERĂ EXECUTATĂ</p>
                                 <div className="space-y-3">
                                    {selectedJob.labor.map((l, i) => (
                                       <div key={i} className="flex justify-between items-center p-5 bg-white shadow-sm rounded-[20px] border border-[#E9E9EB] hover:border-emerald-200 transition-all cursor-default group">
                                          <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                              <ClipboardCheck className="w-5 h-5" />
                                            </div>
                                            <p className="font-bold text-[#1D1D1F] text-sm">{l.description}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-extrabold text-[#1D1D1F] text-xs">{l.hoursSpent} h</p>
                                            <p className="text-[9px] font-bold text-[#86868B] uppercase">REALIZAT</p>
                                          </div>
                                       </div>
                                    ))}
                                    {selectedJob.labor.length === 0 && <div className="p-8 text-center bg-[#F2F2F7]/50 rounded-[20px] border border-dashed border-[#E9E9EB] text-[#86868B] text-xs font-bold">Așteptăm finalizarea etapelor...</div>}
                                 </div>
                              </div>
                           </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )
            )}
          </div>

          {/* Quick Actions & Bento Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Garage Widget */}
            <div className="bg-white rounded-2xl p-4 border border-[#eef1f6] shadow-sm space-y-6 flex flex-col justify-between">
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[#1D1D1F] uppercase tracking-tight flex items-center gap-3">
                      <Car className="w-5 h-5 text-blue-500" /> Garajul Tău
                    </h3>
                    <button onClick={() => onTabChange("add-vehicle")} className="w-10 h-10 bg-[#1D1D1F] text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all">
                       <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {clientVehicles.slice(0, 2).map(v => (
                       <div key={v.id} className="p-4 bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl flex justify-between items-center hover:border-blue-200 transition-all cursor-pointer group" onClick={() => onTabChange("my-vehicle")}>
                          <div>
                             <p className="font-bold text-[#1D1D1F] group-hover:text-blue-600 transition-colors uppercase text-xs">{v.brand} {v.model}</p>
                             <p className="text-xs font-mono font-bold text-[#86868B] group-hover:text-blue-400 transition-colors">{v.licensePlate}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#86868B] group-hover:translate-x-1 transition-all" />
                       </div>
                    ))}
                  </div>
               </div>
               <p className="text-xs text-[#86868B] font-medium">Gestionarea parcului auto propriu în sistemul AutoBOX Ungheni.</p>
            </div>

            {/* Visits Widget */}
            <div className="bg-[#F2F2F7] rounded-2xl p-6 space-y-4 flex flex-col justify-between border border-white">
               <div className="space-y-4">
                  <h3 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] tracking-tighter">
                    Calendar.
                  </h3>
                  <p className="text-[#86868B] font-bold tracking-tight text-lg">Disponibilitate și programări în timp real (30 zile).</p>
                  
                  <div className="bg-white rounded-2xl p-6 border border-[#E9E9EB] shadow-[0_32px_60px_-15px_rgba(0,0,0,0.03)] space-y-5 min-h-[450px] flex flex-col">
                    <div className="flex items-center gap-6 py-2 border-b border-[#F2F2F7] mb-4">
                      <Calendar className="w-6 h-6 text-[#034EA2]" strokeWidth={2.5} />
                      <h4 className="font-bold text-[#1D1D1F] uppercase tracking-normal text-xs">PROGRAMĂRI VIITOARE</h4>
                    </div>

                    <div className="space-y-6 flex-1">
                      {clientAppointments.slice(0, 3).map(ap => {
                        const dateObj = new Date(ap.date);
                        const month = ["IAN", "FEB", "MAR", "APR", "MAI", "IUN", "IUL", "AUG", "SEP", "OCT", "NOI", "DEC"][dateObj.getMonth()] || "MAI";
                        const day = dateObj.getDate();
                        const selectedSvc = serviceTypes.find(s => (ap.serviceTypeIds || []).includes(s.id));

                        return (
                          <div key={ap.id} className="p-4 bg-[#F2F2F7] rounded-2xl flex items-center gap-4 group hover:bg-[#E8F0FE] transition-all duration-500 cursor-default">
                             <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center border border-[#E9E9EB] shadow-sm shrink-0">
                                <span className="text-xs font-bold text-[#034EA2] uppercase leading-none mb-1">{month}</span>
                                <span className="text-xl font-bold text-[#1D1D1F] leading-none">{day}</span>
                             </div>
                             <div className="flex-1">
                                <p className="font-bold text-[#1D1D1F] text-lg tracking-tight line-clamp-1">{selectedSvc?.name || "Serviciu Tehnic"}</p>
                                <p className="text-xs font-bold text-[#86868B] mt-1">Status: <span className={ap.status === "Confirmed" ? "text-emerald-600" : "text-amber-500"}>{ap.status === "Confirmed" ? "Confirmat" : "Preluat"}</span></p>
                             </div>
                             <div className="bg-white px-6 py-3 rounded-full border border-[#E9E9EB] shadow-sm">
                                <span className="text-xs font-bold text-[#034EA2] uppercase tracking-normal leading-none">MDL</span>
                             </div>
                          </div>
                        );
                      })}
                      {clientAppointments.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6 opacity-50">
                           <div className="w-10 h-10 bg-[#F2F2F7] rounded-2xl flex items-center justify-center">
                              <Calendar className="w-10 h-10 text-[#86868B]" />
                           </div>
                           <p className="text-sm font-bold text-[#86868B]">Momentan nu ai <br/> programări active.</p>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => onTabChange("book-wizard")}
                      className="w-full bg-[#034EA2] text-white font-bold text-sm uppercase tracking-normal py-7 rounded-2xl hover:bg-[#1D1D1F] transition-all duration-500 shadow-[0_15px_40px_-5px_rgba(3,78,162,0.3)] flex items-center justify-center gap-4 cursor-pointer group active:scale-95"
                    >
                      PROGRAMEAZĂ ACUM <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
               </div>
            </div>

            {/* Assistance Widget */}
            <div className="bg-[#1D1D1F] rounded-2xl p-4 text-white space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 blur-xl group-hover:scale-125 transition-transform duration-1000">
                  <BadgeInfo className="w-48 h-48 rotate-12" />
               </div>
               <div className="relative z-10 space-y-6">
                  <h3 className="font-bold uppercase tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-400" /> Asistență Clienți
                  </h3>
                  <div className="space-y-4">
                     <p className="text-sm font-medium text-[#86868B] leading-relaxed">
                        Ai nevoie de ajutor urgent sau vrei să modifici o fișă tehnică? Suntem aici pentru tine.
                     </p>
                     <div className="flex items-center gap-3 text-lg font-bold text-blue-400">
                        <Phone className="w-5 h-5" />
                        069111222
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: WIZARD PROGRAMARE  */}
      {activeTab === "book-wizard" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
          <div className="bg-white rounded-2xl p-4 md:p-4 border border-[#eef1f6] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-[#1D1D1F]">
               <Calendar className="w-64 h-64 -rotate-12" />
            </div>
            
            <div className="relative z-10 flex justify-between items-center border-b border-[#F2F2F7] pb-10 mb-12 flex-wrap gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-xl font-bold text-[#1D1D1F] tracking-tight">Rezervare Atelier</h2>
                <p className="text-sm text-[#86868B] font-medium">Configurează vizita tehnică în pași rapizi.</p>
              </div>

              {/* Step Indicator */}
              <div className="flex items-center bg-[#F2F2F7] p-2.5 rounded-2xl border border-[#E9E9EB] shadow-inner">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-center gap-4 px-2">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      wizardStep === step ? "bg-[#1D1D1F] text-white shadow-2xl scale-110 -translate-y-1" : 
                      wizardStep > step ? "bg-blue-600 text-white shadow-lg" : "bg-white text-[#86868B] border border-[#E9E9EB]"
                    }`}>
                      {wizardStep > step ? "✓" : step}
                    </div>
                    {step < 3 && <div className={`w-10 h-1.5 rounded-full ${wizardStep > step ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-[#86868B]"}`} />}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleBookingSubmit} className="max-w-4xl mx-auto space-y-6">
              
              {/* PASUL 1: VEHICUL */}
              {wizardStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-12 duration-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <Car className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-[#1D1D1F]">Identificare Vehicul</h3>
                    </div>
                    
                    {clientVehicles.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {clientVehicles.map(v => (
                          <button
                            type="button"
                            key={v.id}
                            onClick={() => loadMyVehicleToForm(v)}
                            className={`p-4 border rounded-2xl text-left transition-all duration-300 group relative overflow-hidden ${
                              carPlate === v.licensePlate ? "bg-[#1D1D1F] border-[#E9E9EB] shadow-2xl -translate-y-2" : "bg-white border-[#E9E9EB] hover:border-blue-300 hover:shadow-xl"
                            }`}
                          >
                            <div className="relative z-10 flex justify-between items-center">
                              <div>
                                 <p className={`font-bold text-xs uppercase tracking-normal mb-1 ${carPlate === v.licensePlate ? "text-blue-400" : "text-[#86868B]"}`}>{v.brand} {v.model}</p>
                                 <p className={`text-lg font-bold font-mono tracking-tight ${carPlate === v.licensePlate ? "text-white" : "text-[#1D1D1F]"}`}>{v.licensePlate}</p>
                              </div>
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${carPlate === v.licensePlate ? "bg-blue-600 text-white" : "bg-[#F2F2F7] text-[#86868B] group-hover:bg-blue-50 group-hover:text-blue-300"}`}>
                                <CheckCircle className="w-5 h-5" />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="bg-[#F2F2F7] rounded-2xl p-6 space-y-4 border border-[#E9E9EB] backdrop-blur-sm relative overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-end gap-6 pb-4 border-b border-[#E9E9EB]">
                        <div className="flex-1 space-y-2.5">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Serie Șasiu (VIN) - 17 Caractere</label>
                          <div className="relative group">
                            <input 
                              type="text" required maxLength={17} value={carVin} onChange={(e) => setCarVin(e.target.value.toUpperCase())}
                              className="w-full bg-white border border-[#E9E9EB] rounded-2xl px-6 py-5 text-base font-bold font-mono tracking-normal focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all uppercase pr-24"
                              placeholder="VIN COD"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                               <button 
                                 type="button"
                                 onClick={() => handleDecodeVin(carVin, "wizard")}
                                 disabled={isDecoding || carVin.length < 3}
                                 className="bg-[#034EA2] text-white rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-normal hover:bg-[#1D1D1F] transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center gap-2"
                               >
                                 {isDecoding ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                 {isDecoding ? "Scan..." : "AI Auto-Fill"}
                               </button>
                            </div>
                          </div>
                        </div>

                        <div className="w-full md:w-[220px] space-y-2.5">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Nr. Inmatriculare</label>
                          <input 
                            type="text" required value={carPlate} onChange={(e) => setCarPlate(e.target.value.toUpperCase())}
                            className="w-full bg-white border border-[#E9E9EB] rounded-2xl px-6 py-5 text-lg font-bold font-mono text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 uppercase transition-all"
                            placeholder="MD UN ..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Marcă</label>
                          <input 
                            type="text" required value={carBrand} onChange={(e) => setCarBrand(e.target.value)}
                            className="w-full bg-white border border-[#E9E9EB] rounded-xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                            placeholder="Ex: BMW"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Model</label>
                          <input 
                            type="text" required value={carModel} onChange={(e) => setCarModel(e.target.value)}
                            className="w-full bg-white border border-[#E9E9EB] rounded-xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                            placeholder="Ex: Seria 5"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">An Fabricație</label>
                          <input 
                            type="number" required value={carYear} onChange={(e) => setCarYear(Number(e.target.value))}
                            className="w-full bg-white border border-[#E9E9EB] rounded-xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2 border-t border-[#E9E9EB]/50">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Motorizare (Cod)</label>
                          <input 
                            type="text" value={carEngine} onChange={(e) => setCarEngine(e.target.value)}
                            className="w-full bg-white border border-[#E9E9EB] rounded-xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                            placeholder="Ex: B47 2.0d"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Cilindree (cmc)</label>
                          <input 
                            type="text" value={carEngineDisp} onChange={(e) => setCarEngineDisp(e.target.value)}
                            className="w-full bg-white border border-[#E9E9EB] rounded-xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                            placeholder="1995"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Combustibil</label>
                          <select 
                            value={carFuelType} 
                            onChange={(e) => setCarFuelType(e.target.value)}
                            className="w-full bg-white border border-[#E9E9EB] rounded-xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none cursor-pointer"
                          >
                             <option value="">Alege...</option>
                             <option value="Benzină">Benzină</option>
                             <option value="Diesel">Diesel</option>
                             <option value="Hibrid">Hibrid</option>
                             <option value="Electric">Electric</option>
                             <option value="GPL">GPL</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Putere (CP)</label>
                          <input 
                            type="number" value={carPower} onChange={(e) => setCarPower(e.target.value ? Number(e.target.value) : "")}
                            className="w-full bg-white border border-[#E9E9EB] rounded-xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                            placeholder="190"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 pb-2">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Transmisie</label>
                          <div className="flex gap-4">
                            {["Manuală", "Automată"].map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setCarTransmission(t)}
                                className={`flex-1 py-3 rounded-xl text-xs font-semibold uppercase tracking-normal border transition-all ${carTransmission === t ? "bg-[#1D1D1F] text-white border-[#E9E9EB] shadow-lg" : "bg-white text-[#86868B] border-[#E9E9EB] hover:bg-[#F2F2F7]"}`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Culoare Caroserie</label>
                          <input 
                            type="text" value={carColor} onChange={(e) => setCarColor(e.target.value)}
                            className="w-full bg-white border border-[#E9E9EB] rounded-xl px-4 py-3 text-xs font-bold focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                            placeholder="Ex: Argintiu Metalizat"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button type="button" onClick={nextStep} className="bg-[#1D1D1F] hover:bg-blue-600 text-white font-bold text-sm uppercase tracking-normal px-6 py-4 rounded-xl transition-all shadow-2xl hover:shadow-blue-500/20 active:scale-95 flex items-center gap-4 group">
                      Continuă spre Pași Tehnici
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASUL 2: SERVICIU */}
              {wizardStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-12 duration-700">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#E8F0FE] text-[#034EA2] rounded-2xl flex items-center justify-center shadow-inner">
                          <Wrench className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#1D1D1F]">Servicii Tehnice</h3>
                          <p className="text-xs font-bold text-[#86868B] uppercase tracking-tighter">Poți selecta mai multe servicii</p>
                        </div>
                      </div>

                      <div className="bg-[#034EA2] text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4 border-2 border-white/20">
                         <div className="text-right">
                            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Total Estimat</p>
                            <p className="text-lg font-black tracking-tight">{totalPrice} MDL</p>
                         </div>
                         <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Sparkles className="w-5 h-5 text-white" />
                         </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[440px] overflow-y-auto pr-4 custom-scrollbar p-1">
                      {serviceTypes.map(s => {
                        const isSelected = selectedServiceIds.includes(s.id);
                        return (
                          <div 
                            key={s.id}
                            onClick={() => toggleService(s.id)}
                            className={`p-5 rounded-[22px] border cursor-pointer transition-all duration-500 group flex justify-between items-center relative overflow-hidden ${
                              isSelected 
                                ? "bg-[#1D1D1F] border-[#E9E9EB] shadow-2xl scale-[1.02]" 
                                : "bg-white border-[#F2F2F7] hover:border-blue-100 hover:shadow-xl hover:-translate-y-1"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-0 right-0 p-1 bg-[#034EA2] rounded-bl-xl text-white">
                                <CheckCircle className="w-4 h-4" />
                              </div>
                            )}
                            <div className="space-y-2 relative z-10">
                               <div className={`text-[10px] font-bold uppercase tracking-tight px-3 py-1 rounded-full border inline-block ${isSelected ? "bg-[#034EA2]/20 border-[#034EA2]/30 text-[#6799FF]" : "bg-[#F2F2F7] border-[#E9E9EB] text-[#86868B]"}`}>{s.category}</div>
                               <p className={`font-bold text-base tracking-tight leading-tight ${isSelected ? "text-white" : "text-[#1D1D1F]"}`}>{s.name}</p>
                            </div>
                            <div className="text-right relative z-10 shrink-0 ml-4">
                               <p className={`font-black text-lg ${isSelected ? "text-white" : "text-[#034EA2]"}`}>{s.estimatedPrice} <span className="text-[10px] font-bold opacity-60">MDL</span></p>
                               <p className={`text-[10px] font-bold ${isSelected ? "text-[#86868B]" : "text-[#D1D1D6]"} uppercase tracking-tighter`}>~{s.estimatedDuration} min</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-3">
                       <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Observații sau Cerințe Speciale</label>
                       <textarea 
                          rows={3}
                          value={bookNotes}
                          onChange={(e) => setBookNotes(e.target.value)}
                          placeholder="Ex: Verificare ambreiaj, zgomot la viraj stânga, revizie kit distribuție..."
                          className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-2xl px-5 py-4 text-sm font-bold text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-[#034EA2]/10 transition-all shadow-inner"
                       />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 gap-6">
                    <button type="button" onClick={prevStep} className="bg-white text-[#1D1D1F] font-bold text-sm uppercase tracking-normal px-5 py-4 rounded-xl border border-[#E9E9EB] hover:bg-[#F2F2F7] transition-all flex items-center gap-4 group">
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                      Înapoi
                    </button>
                    <button type="button" onClick={nextStep} className="bg-[#1D1D1F] hover:bg-[#034EA2] text-white font-bold text-sm uppercase tracking-normal px-6 py-4 rounded-xl transition-all shadow-2xl hover:shadow-indigo-500/20 active:scale-95 flex items-center gap-4 group">
                      Programare Dată & Oră
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* PASUL 3: DATA & CONFIRMARE */}
              {wizardStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-12 duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1D1D1F]">Dată & Oră Vizită</h3>
                      </div>
                      
                      <div className="bg-[#F2F2F7] rounded-2xl p-6 border border-[#E9E9EB] space-y-4 shadow-inner backdrop-blur-sm">
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Alege Data Vizitei</label>
                          <input 
                            type="date" required value={bookDate} onChange={(e) => setBookDate(e.target.value)}
                            className="w-full bg-white border border-[#E9E9EB] rounded-xl px-4 py-6 text-sm font-bold text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Alege Ora (Recepție)</label>
                          <input 
                            type="time" required value={bookTime} onChange={(e) => setBookTime(e.target.value)}
                            className="w-full bg-white border border-[#E9E9EB] rounded-xl px-4 py-6 text-sm font-bold text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                          <Info className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1D1D1F]">Sumar Programare</h3>
                      </div>

                      <div className="bg-white border border-[#E9E9EB] rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-all duration-1000">
                           <ClipboardCheck className="w-48 h-48" />
                        </div>
                        
                        <div className="flex justify-between items-start border-b border-[#F2F2F7] pb-6">
                           <div>
                              <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-1">Vehicul</p>
                              <h5 className="font-bold text-[#1D1D1F] text-lg tracking-tight underline decoration-blue-500 decoration-2 underline-offset-8">{carPlate}</h5>
                              <p className="text-xs font-bold text-[#86868B] mt-2">{carBrand} {carModel}</p>
                           </div>
                           <div className="w-10 h-10 bg-[#1D1D1F] text-white rounded-xl flex items-center justify-center shadow-lg">
                              <Car className="w-7 h-7" />
                           </div>
                        </div>
                        <div className="flex justify-between items-start border-b border-[#F2F2F7] pb-6">
                           <div className="flex-1">
                              <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-1">Servicii Tehnice Selectate</p>
                              <div className="space-y-1.5 mt-2">
                                {selectedServiceIds.map(sid => {
                                  const s = serviceTypes.find(svc => svc.id === sid);
                                  return (
                                    <div key={sid} className="flex justify-between items-center bg-[#F2F2F7]/50 p-2 rounded-lg border border-[#E9E9EB]">
                                      <span className="text-sm font-bold text-[#1D1D1F]">{s?.name}</span>
                                      <span className="text-xs font-bold text-[#034EA2]">{s?.estimatedPrice} MDL</span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-4 pt-4 border-t border-dashed border-[#E9E9EB] flex justify-between items-center">
                                <span className="text-xs font-black text-[#1D1D1F] uppercase italic">Total Estimat:</span>
                                <span className="text-xl font-black text-[#034EA2] tracking-tighter">{totalPrice} MDL</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex justify-between items-start pt-2">
                           <div>
                              <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-1">Programare Confirmată</p>
                              <h5 className="font-bold text-[#1D1D1F] text-base">{bookDate}</h5>
                              <p className="text-xs font-bold text-emerald-600 uppercase tracking-normal">Ora {bookTime}</p>
                           </div>
                           <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                              <Calendar className="w-7 h-7" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 gap-6">
                    <button type="button" onClick={prevStep} className="bg-white text-[#1D1D1F] font-bold text-sm uppercase tracking-normal px-5 py-4 rounded-xl border border-[#E9E9EB] hover:bg-[#F2F2F7] transition-all flex items-center gap-4 group">
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                      Înapoi la Servicii
                    </button>
                    <button type="submit" className="bg-blue-600 hover:bg-[#1D1D1F] text-white font-bold text-sm uppercase tracking-normal px-8 py-4 rounded-xl transition-all shadow-2xl hover:shadow-blue-500/20 active:scale-95 flex items-center gap-4 group">
                      Confirmă Rezervarea
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* VIEW C: DOCUMENTE & ISTORIC  */}
      {activeTab === "documents" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
          {/* Appointment History Table */}
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#eef1f6] shadow-sm space-y-5">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Istoric Programări</h2>
              <p className="text-sm text-[#86868B] font-medium">Urmărește statusul și istoricul solicitărilor tale.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="text-xs font-bold text-[#86868B] uppercase tracking-normal border-b border-[#F2F2F7]">
                    <th className="pb-6 px-4">Vehicul</th>
                    <th className="pb-6 px-4">Intervenție</th>
                    <th className="pb-6 px-4">Planificare</th>
                    <th className="pb-6 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {clientAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-5 text-[#86868B] font-medium italic">Nicio programare înregistrată încă.</td>
                    </tr>
                  ) : (
                    clientAppointments.map(ap => {
                      const vehicle = vehicles.find(v => v.id === ap.vehicleId);
                      const selectedSvc = serviceTypes.filter(s => (ap.serviceTypeIds || []).includes(s.id));
                      const serviceDisplay = selectedSvc.length > 0 
                        ? (selectedSvc.length > 1 ? `${selectedSvc[0].name} +${selectedSvc.length - 1}` : selectedSvc[0].name) 
                        : "Diagnoză";
                      return (
                        <tr key={ap.id} className="group hover:bg-[#F2F2F7] transition-colors">
                          <td className="py-4 px-4">
                            <p className="font-bold text-[#1D1D1F]">{vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehicul"}</p>
                            <p className="text-xs font-mono text-[#86868B] font-bold">{vehicle?.licensePlate}</p>
                          </td>
                          <td className="py-4 px-4">
                             <span className="text-xs font-bold text-[#86868B] bg-[#E9E9EB] px-3 py-1 rounded-xl">{serviceDisplay}</span>
                          </td>
                          <td className="py-4 px-4 font-bold text-blue-600 font-mono text-xs">
                             {ap.date} <span className="opacity-30">|</span> {ap.time}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className={`inline-flex px-4 py-2 rounded-2xl text-xs font-semibold uppercase tracking-normal ${
                              ap.status === "Confirmed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                            }`}>
                              {ap.status === "Confirmed" ? "CONFIRMAT ✓" : "ÎN ANALIZĂ..."}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoices Grid */}
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#eef1f6] shadow-sm space-y-5 text-xs">
            <div className="flex justify-between items-end flex-wrap gap-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Facturi & Garanții</h2>
                <p className="text-sm text-[#86868B] font-medium">Documentele tale digitale emise de AutoBOX Ungheni.</p>
              </div>
              <div className="flex gap-4">
                 <div className="relative group">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                    <select className="bg-[#F2F2F7] border border-[#E9E9EB] text-xs font-semibold uppercase tracking-normal pl-12 pr-8 py-4 rounded-2xl cursor-pointer hover:bg-[#E9E9EB] transition-all focus:outline-none">
                       <option>Toate Documentele</option>
                       <option>Facturi Fiscale</option>
                       <option>Polițe Garanție</option>
                    </select>
                 </div>
              </div>
            </div>

            {clientInvoices.length === 0 ? (
              <div className="text-center py-6 space-y-6">
                <div className="w-10 h-10 bg-[#F2F2F7] rounded-2xl flex items-center justify-center mx-auto text-[#86868B]">
                  <FileText className="w-10 h-10" />
                </div>
                <p className="text-[#86868B] font-medium">Momentan nu există documente fiscale emise.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {clientInvoices.map(invoice => (
                  <div 
                    key={invoice.id} 
                    className="group bg-white rounded-2xl p-6 border border-[#E9E9EB] hover:border-blue-200 transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FileText className="w-8 h-8" />
                      </div>
                      <span className={`text-xs font-semibold uppercase tracking-normal px-4 py-2 rounded-full ${
                        invoice.isPaid ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        {invoice.isPaid ? "ACHITAT ✓" : "SCADENT"}
                      </span>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-1">Nr. Factură Fiscală</p>
                        <p className="text-lg font-bold text-[#1D1D1F] tracking-tight"># {invoice.id.toUpperCase()}</p>
                      </div>
                      
                      <div className="flex justify-between items-end border-t border-[#F2F2F7] pt-6">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Data Emiterii</p>
                          <p className="font-bold text-[#1D1D1F] text-sm">{invoice.issueDate}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Total</p>
                          <p className="text-xl font-bold text-blue-600 leading-none">{invoice.total} <span className="text-xs">MDL</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-[#F2F2F7] flex items-center justify-between text-blue-500 font-bold text-xs uppercase tracking-normal opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Vizualizează & Descarcă</span>
                      <Download className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW D: CATALOG SERVICII  */}
      {activeTab === "catalog" && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
          <div className="bg-[#F2F2F7] rounded-2xl p-6 md:p-6 border border-[#eef1f6] shadow-inner space-y-4 backdrop-blur-sm">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-[#E9E9EB] shadow-sm flex-wrap gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#1D1D1F] tracking-tight">Catalog Operațiuni</h2>
                <p className="text-xs text-[#86868B] font-medium">Standarde tehnice și intervenții autorizate AutoBOX.</p>
              </div>

              <div className="flex gap-2 items-center overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-3 rounded-2xl text-xs font-semibold uppercase tracking-normal transition-all border whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#1D1D1F] text-white border-[#E9E9EB] shadow-xl"
                        : "bg-[#F2F2F7] text-[#86868B] border-[#E9E9EB] hover:text-[#1D1D1F] hover:bg-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group max-w-xl mx-auto">
               <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868B] group-hover:text-[#034EA2] transition-colors">
                  <BadgeInfo className="w-5 h-5" />
               </div>
               <input
                 type="text"
                 placeholder="Caută intervenția tehnică dorită..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-white border border-[#E9E9EB] rounded-2xl pl-14 pr-8 py-4 text-xs font-bold text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-[#034EA2]/10 transition-all shadow-sm"
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <div key={service.id} className="group bg-white rounded-2xl p-4 border border-[#E9E9EB] hover:border-indigo-400 transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
                   <div className="absolute top-0 right-0 w-12 h-12 bg-[#E8F0FE] rounded-bl-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   
                   <div className="space-y-6 relative z-10">
                      <div className="flex justify-between items-start">
                         <div className="w-12 h-12 bg-[#1D1D1F] text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-[#034EA2] transition-colors">
                            <Wrench className="w-6 h-6" />
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal leading-none mb-1">Cost Bază</p>
                            <p className="text-lg font-bold text-[#1D1D1F]">{service.estimatedPrice} <span className="text-xs text-[#86868B]">MDL</span></p>
                         </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-[#034EA2] bg-[#E8F0FE] px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-normal">{service.category}</span>
                        <h4 className="text-base font-bold text-[#1D1D1F] leading-tight group-hover:text-[#034EA2] transition-colors">{service.name}</h4>
                        <p className="text-xs text-[#86868B] font-medium leading-relaxed line-clamp-2">
                           {service.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#F2F2F7] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#86868B] uppercase tracking-normal">
                           <Clock className="w-3.5 h-3.5 text-[#86868B]" />
                           {service.estimatedDuration} min
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#86868B] uppercase tracking-normal">
                           <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                           {service.warrantyMonths || 12} Luni
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setSelectedServiceIds([service.id]);
                          onTabChange("book-wizard");
                          setWizardStep(3);
                        }}
                        className="w-full bg-[#F2F2F7] text-[#1D1D1F] font-bold text-xs uppercase tracking-normal py-4 rounded-xl hover:bg-[#1D1D1F] hover:text-white transition-all border border-[#E9E9EB] cursor-pointer shadow-sm active:scale-95"
                      >
                         Alege acest serviciu
                      </button>
                   </div>
                </div>
              ))}
              {filteredServices.length === 0 && <div className="col-span-full py-5 text-center text-[#86868B] font-medium italic">Niciun serviciu găsit în această categorie.</div>}
            </div>
          </div>
        </div>
      )}


      {/* VIRTUAL PDF INVOICE DRAWER / DIALOG MODAL */}
      {selectedInvoice && (
        <div id="invoice-modal-overlay" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-[#1D1D1F] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#034EA2]" />
                <h3 className="font-bold text-sm tracking-wide">Document Fiscal PDF (Factură Digitală MD)</h3>
              </div>
              <button
                id="close-invoice-modal-btn"
                onClick={() => setSelectedInvoice(null)}
                className="hover:bg-white/10 px-2.5 py-1 text-xs rounded text-gray-400 hover:text-white cursor-pointer"
              >
                Închide (X)
              </button>
            </div>

            {/* Invoice Print Template Body */}
            <div id="invoice-print-area" className="p-6 overflow-y-auto space-y-6 text-xs text-gray-800 leading-normal bg-white">
              <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                <div>
                  <h4 className="text-base font-bold text-[#034EA2]">AUTOBOX-UN S.R.L.</h4>
                  <p className="text-gray-400 mt-0.5">IDNO: 1012600012345 | mun. Ungheni</p>
                  <p className="text-gray-450">municipiul Ungheni, Republica Moldova</p>
                </div>
                <div className="text-right">
                  <h5 className="text-sm font-extrabold text-gray-900 uppercase">Factură Fiscală</h5>
                  <p className="font-mono text-xs font-bold text-[#034EA2] mt-1">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-gray-400 mt-0.5">Data emiteri: {selectedInvoice.issueDate}</p>
                </div>
              </div>

              {/* Client & Car info section */}
              <div className="grid grid-cols-2 gap-4 bg-[#F2F2F7] p-3 rounded-lg border border-[#E9E9EB]">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Cumparator (Client):</p>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedInvoice.clientName}</p>
                  <p className="text-gray-500">Telefon: {selectedInvoice.clientPhone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Vehicul Reparatie:</p>
                  <p className="font-bold text-gray-700 mt-0.5">{selectedInvoice.vehicleDetails}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-sm text-xs">
                    Status: ACHITATĂ ({selectedInvoice.paymentMethod || "OP"})
                  </span>
                </div>
              </div>

              {/* Table of items */}
              <div className="overflow-x-auto">
                <p className="font-bold text-gray-800 mb-2">Articole Incluse (Piese și Manoperă):</p>
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="bg-[#E9E9EB] text-gray-600 font-bold">
                      <th className="p-2 rounded-l">Descrierea Produsului / Lucrării</th>
                      <th className="p-2 text-center">Cant.</th>
                      <th className="p-2 text-right">Preț Unitar</th>
                      <th className="p-2 text-right rounded-r">Valoare Totală</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedInvoice.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 text-gray-900 font-medium">{it.description}</td>
                        <td className="p-2 text-center text-gray-600">{it.quantity}</td>
                        <td className="p-2 text-right text-gray-600">{it.unitPrice.toFixed(2)} MDL</td>
                        <td className="p-2 text-right font-bold text-gray-900">{it.total.toFixed(2)} MDL</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total calculations */}
              <div className="border-t border-gray-100 pt-4 flex justify-end">
                <div className="w-[200px] space-y-1.5 text-right">
                  <div className="flex justify-between text-gray-500">
                    <span>Valoare (Fără TVA):</span>
                    <span>{selectedInvoice.subtotal.toFixed(2)} MDL</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Valoare TVA ({selectedInvoice.vatRate}%):</span>
                    <span>{selectedInvoice.vatAmount.toFixed(2)} MDL</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-1.5">
                    <span>Total de Plată:</span>
                    <span className="text-emerald-600 font-bold">{selectedInvoice.total.toFixed(2)} MDL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-[#F2F2F7] p-4 border-t border-gray-100 flex justify-end gap-2 text-xs">
              <button
                id="invoice-print-btn"
                onClick={() => {
                  window.print();
                }}
                className="bg-[#034EA2] text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Printează Factura (PDF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW E: MASINA MEA */}
      {activeTab === "my-vehicle" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {clientVehicles.length > 0 ? (
            clientVehicles.map((vehicle) => (
              <div key={vehicle.id} className="space-y-4">
                {/* 1. Vehicle Identity Card */}
                <div className="bg-white rounded-2xl overflow-hidden p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative group border-none">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <Car className="w-64 h-64 text-[#1D1D1F]" />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-12 h-12 bg-[#E8F0FE] text-[#034EA2] rounded-xl flex items-center justify-center shadow-sm">
                              <ShieldCheck className="w-6 h-6" />
                           </div>
                           <span className="font-bold text-xs text-[#034EA2] uppercase tracking-normal">Vehicul Verificat AutoBOX</span>
                        </div>
                        <h2 className="text-2xl md:text-2xl md:text-3xl font-bold text-[#1D1D1F] tracking-tight leading-tight">
                          {vehicle.brand} <br />
                          <span className="text-[#034EA2]">{vehicle.model}</span>
                        </h2>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Număr Înmatriculare</p>
                          <p className="text-xl font-bold text-[#1D1D1F] tracking-tight">{vehicle.licensePlate}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">An Fabricație</p>
                          <p className="text-xl font-bold text-[#1D1D1F]">{vehicle.year}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                          <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Serie Șasiu (VIN)</p>
                          <p className="text-xl font-bold text-[#1D1D1F] tracking-tight break-all">{vehicle.vin}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Motorizare</p>
                          <p className="text-xl font-bold text-[#1D1D1F]">{vehicle.engine || "Nespecificat"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Kilometraj</p>
                          <p className="text-xl font-bold text-[#1D1D1F]">{vehicle.mileage?.toLocaleString()} KM</p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Health & Status Widget Panel */}
                    <div className="space-y-6">
                       <div className="bg-[#F2F2F7] rounded-2xl p-4 border-none flex flex-col justify-between h-full">
                          <div className="space-y-6">
                             <h4 className="font-bold text-sm text-[#1D1D1F] uppercase tracking-tight flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[#034EA2]" /> Status Mentenanță
                             </h4>
                             
                             <div className="space-y-4">
                                <div className="space-y-2">
                                   <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-normal text-[#86868B]">
                                      <span>Sănătate Motor</span>
                                      <span className="text-emerald-500">Optim</span>
                                   </div>
                                   <div className="w-full bg-[#86868B] h-2 rounded-full overflow-hidden">
                                      <div className="bg-emerald-500 h-full w-[95%] rounded-full" />
                                   </div>
                                </div>

                                <div className="space-y-2">
                                   <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-normal text-[#86868B]">
                                      <span>Interval Revizie</span>
                                      <span className="text-amber-500">2,400 KM rămași</span>
                                   </div>
                                   <div className="w-full bg-[#86868B] h-2 rounded-full overflow-hidden">
                                      <div className="bg-amber-500 h-full w-[80%] rounded-full" />
                                   </div>
                                </div>

                                <div className="space-y-2">
                                   <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-normal text-[#86868B]">
                                      <span>Documente (RCA/ITP)</span>
                                      <span className="text-rose-500">Expiră în 12 zile</span>
                                   </div>
                                   <div className="w-full bg-[#86868B] h-2 rounded-full overflow-hidden">
                                      <div className="bg-rose-500 h-full w-[10%] rounded-full" />
                                   </div>
                                </div>
                             </div>
                          </div>

                          <button 
                            onClick={() => {
                              loadMyVehicleToForm(vehicle);
                              onTabChange("book-wizard");
                              setWizardStep(1);
                            }}
                            className="w-full mt-8 bg-[#1D1D1F] text-white font-bold text-xs py-5 rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 group"
                          >
                            Programează Mentenanță Prevenitivă
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                  </div>
                </div>

                {/* 3. Specific History for this Vehicle */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Istoric Intervenții</h3>
                    <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal">
                       {clientJobs.filter(j => j.vehicleId === vehicle.id).length} operațiuni înregistrate
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {clientJobs.filter(j => j.vehicleId === vehicle.id).map((job) => (
                      <div key={job.id} className="bg-white rounded-2xl p-6 border-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all group">
                         <div className="flex items-start gap-5">
                            <div className="w-10 h-10 bg-[#E8F0FE] text-[#034EA2] rounded-xl flex items-center justify-center transition-all">
                               <Wrench className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-1">{job.entryDate}</p>
                               <h4 className="text-lg font-bold text-[#1D1D1F]">{job.diagnosedProblems || "Control Tehnic General"}</h4>
                               <p className="text-xs text-[#86868B] font-medium mt-0.5">Fișă de service: {job.id.toUpperCase()}</p>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start border-t md:border-t-0 border-[#F2F2F7] pt-4 md:pt-0">
                            <div className="text-right">
                               <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-1">Status Final</p>
                               <span className="text-xs font-bold text-emerald-600">Finalizat ✓</span>
                            </div>
                            <button 
                               onClick={() => {
                                 const inv = clientInvoices.find(i => i.jobId === job.id);
                                 if (inv) {
                                   setSelectedInvoice(inv);
                                   onTabChange("documents");
                                 } else {
                                   onNotify("Factura este în curs de generare.", "info");
                                 }
                               }}
                               className="p-4 bg-[#F2F2F7] text-[#034EA2] rounded-xl hover:bg-[#E9E9EB] transition-all"
                            >
                               <FileText className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                    ))}

                    {clientJobs.filter(j => j.vehicleId === vehicle.id).length === 0 && (
                      <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-[#E9E9EB] space-y-4">
                         <div className="w-12 h-12 bg-[#F2F2F7] rounded-full flex items-center justify-center mx-auto text-[#86868B]">
                            <Layers className="w-8 h-8" />
                         </div>
                         <p className="text-sm font-semibold text-[#86868B]">Niciun istoric găsit pentru acest vehicul</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="max-w-md mx-auto py-6 text-center space-y-6">
              <div className="w-12 h-12 bg-[#F2F2F7] rounded-2xl flex items-center justify-center mx-auto text-[#86868B]">
                <Car className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Nu ai nicio mașină înregistrată</h3>
                <p className="text-sm text-[#86868B] font-medium">Adaugă prima ta mașină prin efectuarea unei programări online sau la sediul nostru.</p>
              </div>
              <button 
                onClick={() => onTabChange("add-vehicle")}
                className="inline-flex items-center gap-2 bg-[#034EA2] text-white font-bold text-sm px-4 py-4 rounded-full hover:bg-[#023a7a] transition-all shadow-md cursor-pointer"
              >
                Adaugă Vehicul Nou
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW F: ADAUGA VEHICUL */}
      {activeTab === "add-vehicle" && (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
           <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 md:p-6 space-y-5 relative overflow-hidden border-none">
              <div className="absolute top-0 right-0 p-6 opacity-[0.02] text-[#1D1D1F] pointer-events-none">
                 <Plus className="w-64 h-64 rotate-45" />
              </div>

              <div className="relative z-10 space-y-2 text-center pb-6 border-b border-[#F2F2F7]">
                 <div className="w-10 h-10 bg-[#E8F0FE] text-[#034EA2] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Car className="w-10 h-10" />
                 </div>
                 <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Înregistrare Vehicul</h2>
                 <p className="text-[#86868B] font-medium text-sm">Adaugă vehiculul în garajul digital pentru monitorizare LIVE.</p>
              </div>

              <form onSubmit={handleAddNewVehicle} className="relative z-10 space-y-5">
                 <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                       <div className="flex-1 space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Serie Șasiu (VIN)</label>
                          <div className="relative group">
                             <input 
                                type="text" required maxLength={17} value={newVehVin} onChange={(e) => setNewVehVin(e.target.value.toUpperCase())}
                                placeholder="COD VIN (17 CARACTERE)"
                                className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-2xl px-6 py-5 text-sm font-bold font-mono tracking-normal focus:outline-none focus:ring-4 focus:ring-[#034EA2]/10 transition-all uppercase pr-28"
                             />
                             <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <button 
                                  type="button"
                                  onClick={() => handleDecodeVin(newVehVin, "new")}
                                  disabled={isDecoding || newVehVin.length < 3}
                                  className="bg-[#034EA2] text-white rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-normal hover:bg-[#1D1D1F] transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                >
                                  {isDecoding ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                  {isDecoding ? "Scan..." : "AI Auto-Fill"}
                                </button>
                             </div>
                          </div>
                       </div>
                       <div className="w-full md:w-1/3 space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Nr. Inmatriculare</label>
                          <input 
                             type="text" required value={newVehPlate} onChange={(e) => setNewVehPlate(e.target.value.toUpperCase())}
                             placeholder="MD ..."
                             className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-2xl px-6 py-5 text-lg font-bold text-blue-600 font-mono tracking-tighter focus:outline-none focus:ring-4 focus:ring-[#034EA2]/10 transition-all uppercase"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Marcă</label>
                          <input 
                             type="text" required value={newVehBrand} onChange={(e) => setNewVehBrand(e.target.value)}
                             className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-2xl px-6 py-4 text-sm font-bold text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Model</label>
                          <input 
                             type="text" required value={newVehModel} onChange={(e) => setNewVehModel(e.target.value)}
                             className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-2xl px-6 py-4 text-sm font-bold text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">An Fabricație</label>
                          <input 
                             type="number" required value={newVehYear} onChange={(e) => setNewVehYear(Number(e.target.value))}
                             className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-2xl px-6 py-4 text-sm font-bold text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-[#F2F2F7]">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Motorizare (Cod)</label>
                          <input 
                             type="text" value={newVehEngine} onChange={(e) => setNewVehEngine(e.target.value)}
                             className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl px-5 py-3 text-xs font-bold text-[#1D1D1F] outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Cilindree (cmc)</label>
                          <input 
                             type="text" value={newVehEngineDisp} onChange={(e) => setNewVehEngineDisp(e.target.value)}
                             className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl px-5 py-3 text-xs font-bold text-[#1D1D1F] outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Putere (CP)</label>
                          <input 
                             type="number" value={newVehPower} onChange={(e) => setNewVehPower(e.target.value ? Number(e.target.value) : "")}
                             className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl px-5 py-3 text-xs font-bold text-[#1D1D1F] outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Culoare</label>
                          <input 
                             type="text" value={newVehColor} onChange={(e) => setNewVehColor(e.target.value)}
                             className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl px-5 py-3 text-xs font-bold text-[#1D1D1F] outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Combustibil</label>
                          <select 
                             value={newVehFuelType} 
                             onChange={(e) => setNewVehFuelType(e.target.value)}
                             className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl px-5 py-3 text-xs font-bold text-[#1D1D1F] outline-none cursor-pointer"
                          >
                             <option value="">Alege...</option>
                             <option value="Benzină">Benzină</option>
                             <option value="Diesel">Diesel</option>
                             <option value="Hibrid">Hibrid</option>
                             <option value="Electric">Electric</option>
                             <option value="GPL">GPL</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Transmisie</label>
                          <div className="flex gap-2">
                             {["Manuală", "Automată"].map(t => (
                               <button
                                 key={t}
                                 type="button"
                                 onClick={() => setNewVehTransmission(t)}
                                 className={`flex-1 py-3 rounded-xl text-xs font-semibold uppercase tracking-normal border transition-all ${newVehTransmission === t ? "bg-[#1D1D1F] text-white border-[#E9E9EB] shadow-lg" : "bg-white text-[#86868B] border-[#E9E9EB] hover:bg-[#F2F2F7]"}`}
                               >
                                 {t}
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Kilometraj Actual</label>
                          <input 
                             type="number" value={newVehMileage} onChange={(e) => setNewVehMileage(Number(e.target.value))}
                             className="w-full bg-[#F2F2F7] border border-[#E9E9EB] rounded-2xl px-6 py-4 text-sm font-bold text-[#1D1D1F] focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-6">
                    <button 
                       type="button"
                       onClick={() => onTabChange("dashboard")}
                       className="flex-1 bg-[#F2F2F7] text-[#86868B] font-bold text-xs uppercase tracking-normal py-6 rounded-2xl hover:bg-[#E9E9EB] hover:text-[#1D1D1F] transition-all cursor-pointer border border-[#E9E9EB] active:scale-95"
                    >
                       Anulează
                    </button>
                    <button 
                       type="submit"
                       className="flex-[2] bg-[#1D1D1F] text-white font-bold text-xs uppercase tracking-normal py-6 rounded-2xl hover:bg-[#034EA2] transition-all shadow-2xl hover:shadow-indigo-500/20 flex items-center justify-center gap-4 group cursor-pointer active:scale-95"
                    >
                       Finalizează Înregistrarea
                       <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
