/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from "react";
import { 
  User, Vehicle, ServiceType, Appointment, ServiceJob, InventoryItem, 
  Supplier, Timesheet, Invoice, UserRole, JobStatus, JobCardPart, 
  JobCardLabor, DamagePhoto, Expense, StockMovement 
} from "../types";
import { getRoleAvatar } from "../utils/avatarUtils";
import { 
  Users, Car, FileText, ClipboardList, Warehouse, Settings, UserCheck, 
  Search, Plus, Hammer, Trash2, Ban, DollarSign, BarChart3, AlertTriangle, 
  CheckSquare, RefreshCw, Home, Calendar, Clock, ChevronRight, Activity, 
  TrendingUp, Info, Shield, CheckCircle2, UserPlus, FileCheck, Coins, User as UserIcon, Wrench,
  Truck, X, ArrowRight
} from "lucide-react";
import { motion } from "motion/react";
import ServiceJobsManagement from "./ServiceJobsManagement";
import ServiceJobDetails from "./ServiceJobDetails";
import HRDashboard from "./HRDashboard";
import AccountingDashboard from "./AccountingDashboard";
import WarehouseDashboard from "./WarehouseDashboard";
import LogisticsDashboard from "./LogisticsDashboard";
import AtelierDashboard from "./AtelierDashboard";
import { RecentActivityFeed } from "./RecentActivityFeed";

interface KpiCardState {
  id: string;
  label: string;
  sub: string;
  value: string;
  isDynamic: boolean;
  percentage: number;
  percentageLabel: string;
  bottomText: string;
  color: string;
  progressColor: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  tabLink?: "dashboard" | "appointments" | "jobs" | "crm" | "inventory" | "hr" | "finance" | "logistics";
}

interface AdminERPProps {
  currentUser: User | null;
  users: User[];
  vehicles: Vehicle[];
  serviceTypes: ServiceType[];
  appointments: Appointment[];
  serviceJobs: ServiceJob[];
  inventoryItems: InventoryItem[];
  suppliers: Supplier[];
  timesheets: Timesheet[];
  invoices: Invoice[];
  expenses?: Expense[];
  stockMovements?: StockMovement[];
  onBack: () => void;
  
  // State Mutators
  onUpdateJobStatus: (jobId: string, newStatus: JobStatus) => void;
  onAddJobCardPart: (jobId: string, part: JobCardPart) => void;
  onAddJobCardLabor: (jobId: string, labor: JobCardLabor) => void;
  onAddDamagePhoto: (jobId: string, photo: DamagePhoto) => void;
  onAddInventoryItem: (item: InventoryItem) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
  onAddUser: (user: User) => void;
  onAddTimesheet: (timesheet: Timesheet) => void;
  onGenerateInvoice: (jobId: string) => void;
  onUpdateInvoicePayment: (invoiceId: string, isPaid: boolean, method?: "Card" | "Cash" | "OP") => void;
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  onAddStockMovement: (movement: Omit<StockMovement, "id">) => void;
  onExport: (table: string) => void;
  onImport: (table: string, file: File) => void;
  onDelete: (table: string) => void;
  onNotify: (message: string, type: "success" | "info") => void;
  onSelectEmployee?: (empId: string) => void;
  onUpdateAppointmentStatus: (id: string, status: "Pending" | "Confirmed" | "Canceled") => void;
  onCreateJobFromAppointment?: (ap: Appointment) => void;
  setConfirm: (confirm: { title: string; message: string; onConfirm: () => void } | null) => void;
}

export default function AdminERP({
  currentUser,
  users,
  vehicles,
  serviceTypes,
  appointments,
  serviceJobs,
  inventoryItems,
  suppliers,
  timesheets,
  invoices,
  expenses = [],
  stockMovements = [],
  
  onUpdateJobStatus,
  onAddJobCardPart,
  onAddJobCardLabor,
  onAddDamagePhoto,
  onAddInventoryItem,
  onAddVehicle,
  onAddUser,
  onAddTimesheet,
  onGenerateInvoice,
  onUpdateInvoicePayment,
  onAddExpense,
  onAddStockMovement,
  onExport,
  onImport,
  onDelete,
  onNotify,
  onBack,
  onSelectEmployee,
  onUpdateAppointmentStatus,
  onCreateJobFromAppointment,
  setConfirm
}: AdminERPProps) {
// Helper to resolve allowed tabs for the role
  const getAllowedTabs = (role?: UserRole) => {
    if (!role) return ["dashboard"];
    switch (role) {
      case UserRole.OWNER:
      case UserRole.ADMIN:
        return ["dashboard", "appointments", "jobs", "atelier", "crm", "inventory", "hr", "finance", "logistics"];
      case UserRole.ACCOUNTANT:
        return ["finance"];
      case UserRole.MECHANIC:
        return ["atelier", "jobs"];
      case UserRole.RECEPTION:
        return ["appointments", "crm", "atelier", "jobs"];
      case UserRole.HR:
        return ["hr"];
      default:
        return ["dashboard"];
    }
  };

  const allowedTabs = getAllowedTabs(currentUser?.role);

  // Navigation State inside ERP/CRM Sidebar Layout
  const [erpTab, setErpTab] = useState<
    "dashboard" | "appointments" | "jobs" | "crm" | "inventory" | "hr" | "finance" | "logistics" | "atelier"
  >(() => {
    const allowed = getAllowedTabs(currentUser?.role);
    const defaultTab = allowed.includes("atelier") ? "atelier" : allowed[0];
    return defaultTab as any;
  });

  // Ensure ERP tab stays in sync when user role changes
  React.useEffect(() => {
    if (currentUser) {
      const allowed = getAllowedTabs(currentUser.role);
      if (!allowed.includes(erpTab)) {
        const defaultTab = allowed.includes("atelier") ? "atelier" : allowed[0];
        setErpTab(defaultTab as any);
      }
    }
  }, [currentUser, erpTab]);

  // Filter & Search states
  const [crmSearch, setCrmSearch] = useState("");
  const [itemsSearch, setItemsSearch] = useState("");
  const [selectedJobIdForEdit, setSelectedJobIdForEdit] = useState<string | null>(
    serviceJobs[0]?.id || null
  );

  // Modal / Form States
  // 1. Add Client Form
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientPassword, setNewClientPassword] = useState("");

  // 2. Add Vehicle Form
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehBrand, setNewVehBrand] = useState("");
  const [newVehModel, setNewVehModel] = useState("");
  const [newVehPlate, setNewVehPlate] = useState("");
  const [newVehVin, setNewVehVin] = useState("");
  const [newVehYear, setNewVehYear] = useState(2018);
  const [newVehEngine, setNewVehEngine] = useState("");
  const [newVehClientId, setNewVehClientId] = useState("");

  // 3. Add Replacement Part Form
  const [partItemId, setPartItemId] = useState("");
  const [partQty, setPartQty] = useState(1);

  // 4. Add Labor Line Form
  const [laborDesc, setLaborDesc] = useState("");
  const [laborHours, setLaborHours] = useState(1);
  const [laborRate, setLaborRate] = useState(120);
  const [laborMecId, setLaborMecId] = useState("");

  // 5. Add Damage Photo Form
  const [damageDesc, setDamageDesc] = useState("");
  const [damageUrl, setDamageUrl] = useState("https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600");

  // 6. Add Inventory Item Form
  const [showAddInv, setShowAddInv] = useState(false);
  const [invOem, setInvOem] = useState("");
  const [invAftermarket, setInvAftermarket] = useState("");
  const [invName, setInvName] = useState("");
  const [invBrand, setInvBrand] = useState("");
  const [invPurchase, setInvPurchase] = useState(50);
  const [invSell, setInvSell] = useState(85);
  const [invStock, setInvStock] = useState(10);
  const [invMin, setInvMin] = useState(3);
  const [invSupId, setInvSupId] = useState(suppliers[0]?.id || "");

  // 7. Manual Timesheet Form
  const [tsEmpId, setTsEmpId] = useState("");
  const [tsHours, setTsHours] = useState(8);
  const [tsNotes, setTsNotes] = useState("Asamblare elemente punte față și verificare echilibrare directă.");

  // Computed data
  const activeJob = useMemo(() => serviceJobs.find(j => j.id === selectedJobIdForEdit), [serviceJobs, selectedJobIdForEdit]);
  const mechanics = useMemo(() => users.filter(u => u.role === UserRole.MECHANIC), [users]);

  // 1. DYNAMIC CALCULATIONS FOR THE DASHBOARD
  const activeJobsToday = useMemo(() => serviceJobs.filter(
    j => j.status === JobStatus.IN_PROGRESS || j.status === JobStatus.AWAITING_PARTS
  ), [serviceJobs]);
  const totalJobsCount = serviceJobs.length;
  
  const upcomingAppointments = useMemo(() => appointments.filter(
    ap => ap.status === "Pending"
  ), [appointments]);
  
  const lowStockItems = useMemo(() => inventoryItems.filter(
    item => item.currentStock <= item.minStockLevel
  ), [inventoryItems]);

  // Financial aggregates
  const financialStats = useMemo(() => {
    const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.total, 0);
    const totalCollected = invoices.filter(i => i.isPaid).reduce((acc, curr) => acc + curr.total, 0);
    const totalPending = invoices.filter(i => !i.isPaid).reduce((acc, curr) => acc + curr.total, 0);

    // Profit calculations
    let partsProfit = 0;
    let laborProfit = 0;

    serviceJobs.forEach(job => {
      job.parts.forEach(p => {
        const dbPart = inventoryItems.find(item => item.id === p.partId);
        if (dbPart) {
          partsProfit += (p.sellPrice - dbPart.purchasePrice) * p.quantity;
        } else {
          partsProfit += p.sellPrice * 0.4 * p.quantity; // Margin fallback
        }
      });

      job.labor.forEach(l => {
        const mechanicLaborCost = (l.hourlyRate * l.hoursSpent * l.commissionRate) / 100;
        laborProfit += (l.hourlyRate * l.hoursSpent) - mechanicLaborCost;
      });
    });

    const totalExpensesAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const estimatedProfit = partsProfit + laborProfit - totalExpensesAmount;

    return { totalInvoiced, totalCollected, totalPending, partsProfit, laborProfit, totalExpensesAmount, estimatedProfit };
  }, [invoices, serviceJobs, inventoryItems, expenses]);

  const { totalInvoiced, totalCollected, totalPending, partsProfit, laborProfit, totalExpensesAmount, estimatedProfit } = financialStats;

  // ==========================================
  // DYNAMIC & UNLIMITED CUSTOMIZABLE KPI SYSTEM
  // ==========================================
  const [kpis, setKpis] = useState<KpiCardState[]>([
    {
      id: "atelier",
      label: "Status Atelier",
      sub: "Capacitate",
      value: "",
      isDynamic: true,
      percentage: 25,
      percentageLabel: "Ocupare Atelier",
      bottomText: "",
      color: "bg-blue-50 text-blue-600 border-blue-100",
      progressColor: "bg-blue-600",
      badge: "Activ",
      badgeColor: "bg-emerald-50 text-emerald-600",
      iconName: "Activity",
      tabLink: "jobs"
    },
    {
      id: "planificare",
      label: "Planificare",
      sub: "Cerințe",
      value: "",
      isDynamic: true,
      percentage: 20,
      percentageLabel: "Timp de Răspuns ~15m",
      color: "bg-[#E8F0FE] text-[#034EA2] border-indigo-100",
      progressColor: "bg-[#034EA2]",
      badge: "Validare",
      badgeColor: "bg-[#E8F0FE] text-[#034EA2]",
      iconName: "Calendar",
      tabLink: "appointments"
    },
    {
      id: "stoc",
      label: "Stoc Critic",
      sub: "Piese",
      value: "",
      isDynamic: true,
      percentage: 25,
      percentageLabel: "Nivel re-aprovizionare",
      color: "bg-rose-50 text-rose-600 border-rose-100",
      progressColor: "bg-rose-600",
      badge: "Prioritate",
      badgeColor: "bg-rose-50 text-rose-600",
      iconName: "AlertTriangle",
      tabLink: "inventory"
    },
    {
      id: "contabilitate",
      label: "Contabilitate",
      sub: "Facturat",
      value: "",
      isDynamic: true,
      percentage: 60,
      percentageLabel: "Încasări vs Facturi",
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      progressColor: "bg-emerald-600",
      badge: "Încasat",
      badgeColor: "bg-emerald-50 text-[#034EA2]",
      iconName: "DollarSign",
      tabLink: "finance"
    },
    {
      id: "depozit_val",
      label: "Valoare Depozit",
      sub: "Total active",
      value: "",
      isDynamic: true,
      percentage: 75,
      percentageLabel: "Ocupare rafturi",
      color: "bg-amber-50 text-amber-600 border-amber-100",
      progressColor: "bg-amber-600",
      badge: "Stoc",
      badgeColor: "bg-amber-50 text-amber-600",
      iconName: "Warehouse",
      tabLink: "inventory"
    },
    {
      id: "profit_net",
      label: "Profit Brut Estimat",
      sub: "Lichiditate",
      value: "",
      isDynamic: true,
      percentage: 85,
      percentageLabel: "Marjă operațională",
      color: "bg-emerald-50 text-[#034EA2] border-emerald-100",
      progressColor: "bg-[#034EA2]",
      badge: "Profit",
      badgeColor: "bg-emerald-50 text-emerald-600",
      iconName: "TrendingUp",
      tabLink: "finance"
    },
    {
      id: "cheltuieli",
      label: "Cheltuieli Lunare",
      sub: "Operativ",
      value: "",
      isDynamic: true,
      percentage: 30,
      percentageLabel: "Grad îndatorare",
      color: "bg-rose-50 text-[#1D1D1F] border-rose-100",
      progressColor: "bg-rose-500",
      badge: "Costuri",
      badgeColor: "bg-rose-50 text-rose-600",
      iconName: "DollarSign",
      tabLink: "finance"
    },
    {
      id: "custom-eficienta",
      label: "Grad Satisfacție",
      sub: "Clienți",
      value: "98.4%",
      isDynamic: false,
      percentage: 98,
      percentageLabel: "Feedback AutoBOX",
      bottomText: "✓ Indicator Calitate Recurent",
      color: "bg-purple-50 text-purple-700 border-purple-100",
      progressColor: "bg-purple-600",
      badge: "Clienți",
      badgeColor: "bg-purple-100 text-purple-800",
      iconName: "Activity"
    },
    {
      id: "custom-garantie",
      label: "Garanții Active",
      sub: "Post-Service",
      value: "0 Reclamații",
      isDynamic: false,
      percentage: 100,
      percentageLabel: "Fără erori de execuție",
      bottomText: "✓ Obiectiv de Calitate",
      color: "bg-neutral-50 text-neutral-800 border-neutral-200",
      progressColor: "bg-neutral-800",
      badge: "Garanție",
      badgeColor: "bg-neutral-100 text-neutral-800",
      iconName: "Activity"
    }
  ]);

  const [enabledKpis, setEnabledKpis] = useState<string[]>([
    "atelier",
    "planificare",
    "stoc",
    "contabilitate",
    "depozit_val",
    "profit_net",
    "cheltuieli",
    "custom-eficienta",
    "custom-garantie"
  ]);

  const [isKpiConfigOpen, setIsKpiConfigOpen] = useState(false);
  const [newKpiLabel, setNewKpiLabel] = useState("");
  const [newKpiVal, setNewKpiVal] = useState("");
  const [newKpiSub, setNewKpiSub] = useState("Urmărire");
  const [newKpiPercentage, setNewKpiPercentage] = useState<number>(70);
  const [newKpiBottomText, setNewKpiBottomText] = useState("✓ Adăugat manual");
  const [newKpiColor, setNewKpiColor] = useState<string>("bg-blue-50 text-blue-600 border-blue-105");
  const [newKpiProgressColor, setNewKpiProgressColor] = useState<string>("bg-blue-600");
  const [newKpiBadgeColor, setNewKpiBadgeColor] = useState<string>("bg-blue-100 text-blue-800");
  const [newKpiIconName, setNewKpiIconName] = useState<string>("Activity");

  const [editingKpi, setEditingKpi] = useState<KpiCardState | null>(null);

  const handleAddCustomKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpiLabel || !newKpiVal) return;
    const newId = `custom-${Date.now()}`;
    const newKpi: KpiCardState = {
      id: newId,
      label: newKpiLabel,
      sub: newKpiSub,
      value: newKpiVal,
      isDynamic: false,
      percentage: newKpiPercentage,
      percentageLabel: "Nivel curent setat",
      bottomText: newKpiBottomText || "✓ Indicator personalizat adăugat",
      color: newKpiColor,
      progressColor: newKpiProgressColor,
      badge: newKpiSub || "Custom",
      badgeColor: newKpiBadgeColor,
      iconName: newKpiIconName
    };
    setKpis(prev => [...prev, newKpi]);
    setEnabledKpis(prev => [...prev, newId]);
    setNewKpiLabel("");
    setNewKpiVal("");
    setNewKpiSub("Urmărire");
    setNewKpiPercentage(70);
    setNewKpiBottomText("✓ Adăugat manual");
    setIsKpiConfigOpen(false);
    onNotify("Un nou indicator complet funcțional a fost adăugat în sistem!", "success");
  };

  const handleSaveKpi = (updated: KpiCardState) => {
    setKpis(prev => prev.map(item => item.id === updated.id ? updated : item));
    setEditingKpi(null);
    onNotify(`Indicatorul "${updated.label}" a fost salvat cu succes!`, "success");
  };

  const handleDeleteKpiPermanently = (id: string, label: string) => {
    setKpis(prev => prev.filter(item => item.id !== id));
    setEnabledKpis(prev => prev.filter(item_id => item_id !== id));
    if (editingKpi?.id === id) {
      setEditingKpi(null);
    }
    onNotify(`Indicatorul "${label}" a fost elimat complet!`, "info");
  };

  const getKpiDisplayData = (k: KpiCardState) => {
    if (!k.isDynamic) {
      return {
        value: k.value,
        percentage: k.percentage,
        bottomText: k.bottomText
      };
    }
    switch (k.id) {
      case "atelier":
        return {
          value: `${activeJobsToday.length} unități`,
          percentage: Math.min(Math.round((activeJobsToday.length / 4) * 100), 100),
          bottomText: `Total istoric: ${serviceJobs.length} fișe`
        };
      case "planificare":
        return {
          value: `${upcomingAppointments.length} cerințe`,
          percentage: Math.min(upcomingAppointments.length * 20, 100),
          bottomText: upcomingAppointments.length > 0 ? "⚠️ Necesită atenție" : "✓ Programări în regulă"
        };
      case "stoc":
        return {
          value: `${lowStockItems.length} piese`,
          percentage: Math.min(lowStockItems.length * 15, 100),
          bottomText: lowStockItems.length > 0 ? "⚠️ Comandă urgentă" : "✓ Stocuri excelente"
        };
      case "contabilitate": {
        const payRatio = Math.min(Math.round((invoices.filter(i => i.isPaid).length / Math.max(invoices.length, 1)) * 100), 100);
        return {
          value: `${totalCollected.toLocaleString()} MDL`,
          percentage: payRatio,
          bottomText: `Total facturi emise: ${invoices.length}`
        };
      }
      case "depozit_val": {
        const totalVal = inventoryItems.reduce((acc, i) => acc + (i.sellPrice * i.currentStock), 0);
        return {
          value: `${totalVal.toLocaleString()} MDL`,
          percentage: 75,
          bottomText: `${inventoryItems.length} tipuri de piese`
        };
      }
      case "profit_net": {
        return {
          value: `${estimatedProfit.toLocaleString()} MDL`,
          percentage: 85,
          bottomText: `Piese: ${partsProfit.toLocaleString()} | Manoperă: ${laborProfit.toLocaleString()}`
        };
      }
      case "cheltuieli": {
        return {
          value: `${totalExpensesAmount.toLocaleString()} MDL`,
          percentage: Math.min(Math.round((totalExpensesAmount / Math.max(totalCollected, 1)) * 100), 100),
          bottomText: `${expenses.length} facturi externe înregistrate`
        };
      }
      default:
        return {
          value: k.value,
          percentage: k.percentage,
          bottomText: k.bottomText
        };
    }
  };

  const activeKpisToShow = kpis
    .filter(k => enabledKpis.includes(k.id))
    .map(k => {
      const live = getKpiDisplayData(k);
      return {
        ...k,
        value: live.value,
        percentage: live.percentage,
        bottomText: live.bottomText
      };
    });

  const getIconComponent = (name: string) => {
    switch (name) {
      case "Activity": return Activity;
      case "Calendar": return Calendar;
      case "AlertTriangle": return AlertTriangle;
      case "DollarSign": return DollarSign;
      case "Warehouse": return Warehouse;
      case "Clock": return Clock;
      case "Truck": return Truck;
      default: return Activity;
    }
  };

  // HANDLERS
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientEmail) return;

    const newClient: User = {
      id: `u-${Date.now()}`,
      name: newClientName,
      email: newClientEmail,
      phone: newClientPhone,
      role: UserRole.CLIENT,
      avatarUrl: getRoleAvatar(UserRole.CLIENT),
      password: newClientPassword
    };

    onAddUser(newClient);
    onNotify(`Clientul ${newClientName} a fost înregistrat cu succes!`, "success");
    setNewClientName("");
    setNewClientEmail("");
    setNewClientPhone("");
    setNewClientPassword("");
    setShowAddClient(false);
  };

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehBrand || !newVehPlate || !newVehClientId) return;

    const newVeh: Vehicle = {
      id: `v-${Date.now()}`,
      clientId: newVehClientId,
      brand: newVehBrand,
      model: newVehModel,
      licensePlate: newVehPlate.toUpperCase(),
      vin: newVehVin.toUpperCase() || "VIN-MOCK-UNGHENI-888",
      year: newVehYear,
      engine: newVehEngine,
      mileage: 120000
    };

    onAddVehicle(newVeh);
    onNotify(`Vehiculul ${newVehBrand} [${newVehPlate.toUpperCase()}] s-a adăugat clientului!`, "success");
    setNewVehBrand("");
    setNewVehModel("");
    setNewVehPlate("");
    setNewVehVin("");
    setShowAddVehicle(false);
  };

  const handleAddPartToJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobIdForEdit || !partItemId) return;

    const stockItem = inventoryItems.find(i => i.id === partItemId);
    if (!stockItem) return;

    if (stockItem.currentStock < partQty) {
      onNotify(`Stoc critic pentru ${stockItem.name}! Maxim disponibil: ${stockItem.currentStock}`, "info");
      return;
    }

    const newPart: JobCardPart = {
      id: `jp-${Date.now()}`,
      partId: stockItem.id,
      name: stockItem.name,
      oemCode: stockItem.oemCode,
      quantity: Number(partQty),
      sellPrice: Number(stockItem.sellPrice)
    };

    onAddJobCardPart(selectedJobIdForEdit, newPart);
    onNotify(`Piesa ${stockItem.name} a fost utilizată pe fișă!`, "success");
  };

  const handleAddLaborToJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobIdForEdit || !laborDesc || !laborMecId) {
      onNotify("Te rugăm să completezi câmpurile manoperei și mecanicului!", "info");
      return;
    }

    const newLabor: JobCardLabor = {
      id: `jl-${Date.now()}`,
      mechanicId: laborMecId,
      description: laborDesc,
      hoursSpent: Number(laborHours),
      hourlyRate: Number(laborRate),
      commissionRate: 30 // standard 30% commission
    };

    onAddJobCardLabor(selectedJobIdForEdit, newLabor);
    onNotify(`Manopera "${laborDesc}" a fost înregistrată!`, "success");
    setLaborDesc("");
  };

  const handleAddDamageToJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobIdForEdit || !damageDesc) return;

    const newDmg: DamagePhoto = {
      id: `dmg-${Date.now()}`,
      jobId: selectedJobIdForEdit,
      url: damageUrl,
      description: damageDesc,
      dateAdded: new Date().toISOString().split("T")[0]
    };

    onAddDamagePhoto(selectedJobIdForEdit, newDmg);
    onNotify("Fotografia de constatare a fost adăugată pe fișa mașinii!", "success");
    setDamageDesc("");
  };

  const handleCreateInventoryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invOem || !invName) return;

    const newItem: InventoryItem = {
      id: `i-${Date.now()}`,
      oemCode: invOem,
      aftermarketCode: invAftermarket,
      name: invName,
      brand: invBrand,
      purchasePrice: Number(invPurchase),
      sellPrice: Number(invSell),
      currentStock: Number(invStock),
      minStockLevel: Number(invMin),
      supplierId: invSupId
    };

    onAddInventoryItem(newItem);
    onNotify(`Articolul ${invName} a fost adăugat în inventar.`, "success");
    setInvOem("");
    setInvAftermarket("");
    setInvName("");
    setInvBrand("");
    setShowAddInv(false);
  };

  const handleCreateTimesheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tsEmpId) return;

    const newTs: Timesheet = {
      id: `ts-${Date.now()}`,
      employeeId: tsEmpId,
      date: new Date().toISOString().split("T")[0],
      hoursWorked: Number(tsHours),
      basePay: 180, // Basic daily pay
      commissionEarned: 0,
      notes: tsNotes
    };

    onAddTimesheet(newTs);
    onNotify("Pontajul personalului a fost înregistrat manual!", "success");
    setTsNotes("");
  };

  const getPanelRoleLabel = (role?: UserRole) => {
    switch (role) {
      case UserRole.OWNER:
        return "DIRECTOR COORDONATOR";
      case UserRole.ADMIN:
        return "CONTROL ADMINISTRATIV";
      case UserRole.ACCOUNTANT:
        return "SERVICIU FINANCIAR (CONTABIL)";
      case UserRole.MECHANIC:
        return "MANAGEMENT FIȘE ATELIER";
      case UserRole.RECEPTION:
        return "DISPECER PRINCIPAL RECEPȚIE";
      case UserRole.HR:
        return "DEPARTAMENT RESURSE UMANE (HR)";
      default:
        return "SISTEM SECURIZAT AUTOBOX";
    }
  };

  const panelRoleLabel = getPanelRoleLabel(currentUser?.role);

  const erpTabsList = [
    { id: "dashboard", label: "Acasă", icon: Home },
    { id: "appointments", label: "Programări noi", icon: Calendar, badge: upcomingAppointments.length },
    { id: "atelier", label: "Atelier", icon: ClipboardList },
    { id: "crm", label: "Clienți & garaj", icon: Users },
    { id: "inventory", label: "Depozit & stocuri", icon: Warehouse, badge: lowStockItems.length, badgeColor: "bg-amber-500" },
    { id: "hr", label: "Resurse umane (HR)", icon: UserCheck },
    { id: "finance", label: "Contabilitate", icon: DollarSign },
    { id: "logistics", label: "Logistică & flotă", icon: Truck },
  ].filter(tab => allowedTabs.includes(tab.id));

  const tabMetadata: Record<string, { title: string; subtitle: string; icon: any }> = {
    dashboard: {
      title: "Panoul de administrare",
      subtitle: "Ecosistemul tău auto • Prezentare generală și indicatori de performanță live.",
      icon: Home
    },
    appointments: {
      title: "Planificator programări",
      subtitle: "Gestiune solicitări clienți • Monitorizează și validează programările primite în service.",
      icon: Calendar
    },
    atelier: {
      title: "Harta Atelier • Zone de Lucru",
      subtitle: "Monitor tehnic • Urmărește cele 5 rampe și postul de electricitate, asociază mecanicii și modifică statusul.",
      icon: ClipboardList
    },
    jobs: {
      title: "Fișe service & devize",
      subtitle: "Management fișe de lucru • Urmărește progresul reparațiilor și personalul alocat pe elevator.",
      icon: ClipboardList
    },
    crm: {
      title: "Clienți & garaj",
      subtitle: "Management baza de date • Administrarea clienților și corelarea cu autoturismele active.",
      icon: Users
    },
    inventory: {
      title: "Depozit & stocuri piese",
      subtitle: "Control stocuri • Supravegherea inventarului, necesarului de reaprovizionat și a furnizorilor.",
      icon: Warehouse
    },
    hr: {
      title: "Resurse umane (HR)",
      subtitle: "Management personal • Programul pontajelor, performanța angajaților și pontajul orelor.",
      icon: UserCheck
    },
    finance: {
      title: "Contabilitate & facturare",
      subtitle: "Serviciul financiar • Inspectarea plăților, facturilor emise și bilanțul general.",
      icon: DollarSign
    },
    logistics: {
      title: "Logistică & flotă",
      subtitle: "Management logistic • Monitorizarea mașinilor active, flotei de tractare și platforme auto.",
      icon: Truck
    }
  };

  return (
    <div id="admin-erp-root" className="space-y-4 pb-20">
      
      {/* RESTORED & OPTIMIZED MENU BOX (SAMSUNG ONE UI 8 INSPIRED - NO SCROLL) */}
      <div className="bg-white border border-[#E9E9EB] rounded-2xl p-2.5 shadow-sm w-full">
        <div className="flex flex-wrap items-center gap-1 bg-[#F2F2F7] p-1.5 rounded-xl w-full">
          {erpTabsList.map((tab) => {
            const Icon = tab.icon;
            const isActive = erpTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`sidebar-menu-${tab.id}`}
                onClick={() => setErpTab(tab.id as any)}
                className={`flex-1 min-w-[110px] px-3 py-2.5 text-xs font-semibold rounded-[14px] transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap relative ${
                  isActive 
                    ? "bg-[#1D1D1F] text-white shadow-md scale-[1.01] font-bold" 
                    : "bg-transparent text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E9E9EB]/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#86868B]"}`} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className={`ml-1 ${tab.badgeColor || "bg-[#034EA2]"} text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[18px] text-center shadow-sm`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC CASETA / UNIFIED PAGE DESIGN BOX (SAMSUNG ONE UI 8 STYLE) */}
      {tabMetadata[erpTab] && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E9E9EB] shadow-sm animate-in fade-in duration-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F2F2F7] rounded-xl flex items-center justify-center text-[#034EA2] shadow-inner">
              {React.createElement(tabMetadata[erpTab].icon, { className: "w-6 h-6 text-[#034EA2]" })}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1D1D1F] tracking-tight leading-tight">
                {tabMetadata[erpTab].title}
              </h2>
              <p className="text-xs text-[#86868B] font-bold mt-1">
                {tabMetadata[erpTab].subtitle}
              </p>
            </div>
          </div>

          {/* Context Actions right inside the Unified Header Card */}
          <div className="flex flex-wrap items-center gap-2">
            {erpTab === "dashboard" && (
              <button
                onClick={() => {
                  setIsKpiConfigOpen(true);
                  setTimeout(() => {
                    const el = document.getElementById("add-kpi-form-anchor");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
                className="px-5 py-3 text-xs font-bold rounded-2xl bg-[#034EA2] text-white hover:bg-[#1D1D1F] transition-all cursor-pointer flex items-center gap-2 uppercase tracking-normal shadow-sm"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Adaugă indicator</span>
              </button>
            )}

            {erpTab === "appointments" && (
              <div className="flex items-center gap-3 bg-[#F2F2F7] p-1.5 rounded-[22px] border border-[#E9E9EB]">
                <div className="px-5 py-2.5 bg-white rounded-[18px] shadow-sm border border-[#E9E9EB]/60 text-center min-w-[80px]">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-tighter mb-0.5 leading-none">Total</p>
                  <p className="text-base font-extrabold text-[#1D1D1F] leading-none">{appointments.length}</p>
                </div>
                <div className="px-5 py-2.5 text-center min-w-[100px]">
                  <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-tighter mb-0.5 leading-none">Confirmate</p>
                  <p className="text-base font-extrabold text-emerald-600 leading-none">{appointments.filter(a => a.status === "Confirmed").length}</p>
                </div>
              </div>
            )}

            {erpTab === "crm" && (
              <div className="flex items-center gap-2">
                <button
                  id="add-client-modal-trigger"
                  onClick={() => setShowAddClient(!showAddClient)}
                  className="px-5 py-3 text-xs font-bold bg-[#034EA2] text-white hover:bg-[#1D1D1F] rounded-2xl transition-all shadow-sm flex items-center gap-2 uppercase tracking-normal cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Client Nou</span>
                </button>
                <button
                  id="add-car-modal-trigger"
                  onClick={() => {
                    if (users.filter(u => u.role === UserRole.CLIENT).length === 0) {
                      onNotify("Trebuie să înregistrezi mai întâi un Client înainte de a crea un Autoturism!", "info");
                      return;
                    }
                    setShowAddVehicle(!showAddVehicle);
                  }}
                  className="px-5 py-3 text-xs font-bold bg-white border border-[#E9E9EB] text-[#1D1D1F] hover:bg-[#F2F2F7] rounded-2xl transition-all shadow-sm flex items-center gap-2 uppercase tracking-normal cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  <span>Vehicul Nou</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA - DISPLAYING SELECTED VIEW */}
      <div className="space-y-4">
        
        {/* A. VIEW: PAGINA PRINCIPALĂ DE DASHBOARD (VEDERE DE ANSAMBLU) */}
        {erpTab === "dashboard" && (
          <div id="erp-view-dashboard" className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Dynamic KPI Configuration Drawer/Dialog Pane */}
            {isKpiConfigOpen && (
              <div id="add-kpi-form-anchor" className="bg-white border border-[#E9E9EB] p-4 rounded-2xl shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-500">
                <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase text-[#1D1D1F] tracking-normal">Configurează Casete Indicatori</h3>
                    <p className="text-xs text-[#86868B] font-medium">Bifează casetele pe care vrei să le afișezi sau adaugă un indicator complet nou.</p>
                  </div>
                  <button 
                    onClick={() => setIsKpiConfigOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-[#86868B] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Afișează/Ascunde Indicatori Activi</span>
                  <div className="flex flex-wrap gap-2.5">
                    {kpis.map(k => {
                      const isEnabled = enabledKpis.includes(k.id);
                      return (
                        <button
                          key={k.id}
                          onClick={() => {
                            if (isEnabled) {
                              setEnabledKpis(prev => prev.filter(id => id !== k.id));
                            } else {
                              setEnabledKpis(prev => [...prev, k.id]);
                            }
                          }}
                          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all border flex items-center gap-2 ${
                            isEnabled 
                              ? "bg-slate-900 border-slate-900 text-white" 
                              : "bg-white border-[#E9E9EB] text-[#86868B] hover:text-[#1D1D1F]"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isEnabled ? "bg-emerald-400 animate-pulse" : "bg-gray-300"}`} />
                          <span>{k.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form to dynamically Add a brand NEW custom KPI card (unlimited) */}
                <form onSubmit={handleAddCustomKpi} className="border-t border-[#F2F2F7] pt-6 space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Adaugă un indicator nou personalizat (Număr nelimitat)</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Denumire Indicator</label>
                      <input
                        type="text"
                        placeholder="Ex: Grad Reclamații, Piese expediate..."
                        value={newKpiLabel}
                        onChange={(e) => setNewKpiLabel(e.target.value)}
                        className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Valoare Curentă</label>
                      <input
                        type="text"
                        placeholder="Ex: 99.2%, 24 Unități, 0"
                        value={newKpiVal}
                        onChange={(e) => setNewKpiVal(e.target.value)}
                        className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Categorie/Subtitlu</label>
                      <input
                        type="text"
                        placeholder="Ex: Calitate, Eficiență, Garantie"
                        value={newKpiSub}
                        onChange={(e) => setNewKpiSub(e.target.value)}
                        className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Advanced settings for creating KPI card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pb-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Iconiță</label>
                      <select
                        value={newKpiIconName}
                        onChange={(e) => setNewKpiIconName(e.target.value)}
                        className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold text-[#1D1D1F] focus:outline-none"
                      >
                        <option value="Activity">Activitate (Pulse)</option>
                        <option value="Calendar">Calendar (Planificator)</option>
                        <option value="AlertTriangle">Alertă (Atenționare)</option>
                        <option value="DollarSign">Valută (Financiar)</option>
                        <option value="Warehouse">Depozit (Piese)</option>
                        <option value="Truck">Logistică (Transport)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Gamă Culori</label>
                      <select
                        value={newKpiColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewKpiColor(val);
                          if (val.includes("blue")) {
                            setNewKpiProgressColor("bg-blue-600");
                            setNewKpiBadgeColor("bg-blue-100 text-blue-850");
                          } else if (val.includes("rose")) {
                            setNewKpiProgressColor("bg-rose-600");
                            setNewKpiBadgeColor("bg-rose-100 text-rose-850");
                          } else if (val.includes("emerald")) {
                            setNewKpiProgressColor("bg-emerald-600");
                            setNewKpiBadgeColor("bg-emerald-100 text-emerald-800");
                          } else if (val.includes("amber")) {
                            setNewKpiProgressColor("bg-amber-600");
                            setNewKpiBadgeColor("bg-amber-100 text-amber-800");
                          } else if (val.includes("purple")) {
                            setNewKpiProgressColor("bg-purple-600");
                            setNewKpiBadgeColor("bg-purple-100 text-purple-800");
                          } else {
                            setNewKpiProgressColor("bg-neutral-800");
                            setNewKpiBadgeColor("bg-neutral-200 text-neutral-800");
                          }
                        }}
                        className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold text-[#1D1D1F] focus:outline-none"
                      >
                        <option value="bg-blue-50 text-blue-600 border-blue-100">Albastru Fin</option>
                        <option value="bg-rose-50 text-rose-600 border-rose-100">Roșu Alertă</option>
                        <option value="bg-emerald-50 text-emerald-600 border-emerald-100">Verde Succes</option>
                        <option value="bg-amber-50 text-amber-600 border-amber-100">Portocaliu Activ</option>
                        <option value="bg-purple-50 text-purple-700 border-purple-100">Purpuriu Premium</option>
                        <option value="bg-[#F2F2F7] text-[#1D1D1F] border-[#E9E9EB]">Slate Elegant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Progres inițial (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newKpiPercentage}
                        onChange={(e) => setNewKpiPercentage(Number(e.target.value))}
                        className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold text-[#1D1D1F] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Text Subsol</label>
                      <input
                        type="text"
                        placeholder="Ex: ✓ Actualizat duminică"
                        value={newKpiBottomText}
                        onChange={(e) => setNewKpiBottomText(e.target.value)}
                        className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold text-[#1D1D1F] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#1D1D1F] text-white rounded-2xl text-xs font-semibold uppercase tracking-normal hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adaugă casetă în Panou</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* One UI 8 Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeKpisToShow.map((kpi, idx) => {
                const Icon = getIconComponent(kpi.iconName);
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.6 }}
                    key={kpi.id} 
                    onClick={() => kpi.tabLink && setErpTab(kpi.tabLink)}
                    className="bg-white rounded-2xl p-4 border border-[#E9E9EB] shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 relative group overflow-hidden cursor-pointer"
                  >
                    <div className="flex flex-col h-full space-y-4">
                      <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300`}>
                          <Icon className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                        <div className={`px-4 py-1.5 rounded-full ${kpi.badgeColor} text-xs font-semibold uppercase tracking-normal shadow-sm border border-white/50`}>
                          {kpi.badge}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[#86868B] font-bold uppercase tracking-normal text-xs opacity-80">{kpi.label}</p>
                        <h4 className="text-xl font-bold text-[#1D1D1F] tracking-tighter leading-none">{kpi.value}</h4>
                        <p className="text-xs font-bold text-[#86868B]">{kpi.sub}</p>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="w-full h-2 bg-[#F2F2F7] rounded-full overflow-hidden border border-[#E9E9EB]">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${kpi.percentage}%` }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className={`h-full ${kpi.progressColor} rounded-full`}
                          />
                        </div>
                        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-normal text-[#86868B]">
                          <span>Stare: {kpi.percentage}%</span>
                          <span className="text-[#034EA2]">{kpi.percentageLabel}</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-[#F2F2F7] flex items-center justify-between group-hover:px-1 transition-all">
                        <span className="text-xs font-bold text-[#86868B]">{kpi.bottomText}</span>
                        <ChevronRight className="w-4 h-4 text-[#86868B] group-hover:text-[#034EA2] group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div 
                onClick={() => setIsKpiConfigOpen(true)}
                className="bg-[#F2F2F7]/50 border-2 border-dashed border-[#E9E9EB] rounded-2xl p-4 hover:bg-white hover:border-[#034EA2]/30 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-6 group min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E9E9EB] flex items-center justify-center text-[#86868B] group-hover:scale-105 group-hover:text-[#034EA2] transition-all shadow-md group-hover:rotate-12">
                  <Plus className="w-8 h-8" strokeWidth={2.5} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-[#1D1D1F] tracking-normal">Personalizează</h4>
                  <p className="text-xs text-[#86868B] font-bold max-w-[200px] mx-auto leading-relaxed opacity-70">
                    Configurează panoul și adaugă casete.
                  </p>
                </div>
              </div>
            </div>

            <RecentActivityFeed appointments={appointments} serviceJobs={serviceJobs} invoices={invoices} />

            {/* Zero state: when no indicator is selected */}
            {activeKpisToShow.length === 0 && (
              <div className="bg-[#F2F2F7] border-2 border-dashed border-[#E9E9EB] rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-4">
                <AlertTriangle className="w-10 h-10 text-amber-500 animate-bounce" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold uppercase text-[#1D1D1F]">Niciun indicator activ</h3>
                  <p className="text-xs text-[#86868B] font-medium">Toate casetele KPI au fost eliminate. Apasă pe Configurare pentru a le adăuga înapoi.</p>
                </div>
                <button 
                  onClick={() => {
                    setEnabledKpis(["atelier", "planificare", "stoc", "contabilitate", "depozit_val", "custom-eficienta", "custom-garantie"]);
                    onNotify("Indicatorii impliciți au fost restaurați!", "success");
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-normal rounded-xl transition-all cursor-pointer"
                >
                  Restaurează Toate Casetele
                </button>
              </div>
            )}

            {/* Dialog Overlay Modal for Editing existing KPI completely */}
            {editingKpi && (
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-9999 animate-in fade-in duration-200">
                <div className="bg-white border border-[#E9E9EB] w-full max-w-lg rounded-2xl p-4 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase text-[#1D1D1F] tracking-normal">Modifică Indicator</h3>
                      <p className="text-xs text-[#86868B] font-medium">Reajustează datele și aspectul casetei în timp real.</p>
                    </div>
                    <button 
                      onClick={() => setEditingKpi(null)}
                      className="w-8 h-8 rounded-full hover:bg-slate-105 flex items-center justify-center text-[#86868B] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Denumire Indicator</label>
                      <input
                        type="text"
                        value={editingKpi.label}
                        onChange={(e) => setEditingKpi({ ...editingKpi, label: e.target.value })}
                        className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Valoare Curentă</label>
                        <input
                          type="text"
                          value={editingKpi.value}
                          onChange={(e) => setEditingKpi({ ...editingKpi, value: e.target.value })}
                          className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Subtitlu/Categorie</label>
                        <input
                          type="text"
                          value={editingKpi.sub}
                          onChange={(e) => setEditingKpi({ ...editingKpi, sub: e.target.value })}
                          className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Progres învechit (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editingKpi.percentage}
                          onChange={(e) => setEditingKpi({ ...editingKpi, percentage: Number(e.target.value) })}
                          className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Săritură Tab Link direct</label>
                        <select
                          value={editingKpi.tabLink || "none"}
                          onChange={(e) => setEditingKpi({ ...editingKpi, tabLink: e.target.value === "none" ? undefined : e.target.value as any })}
                          className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold focus:outline-none"
                        >
                          <option value="none">Fără legătură</option>
                          <option value="dashboard">Acasă</option>
                          <option value="appointments">Programări Noi</option>
                          <option value="jobs">Fișe Service (Atelier)</option>
                          <option value="crm">Clienți & Garaj</option>
                          <option value="inventory">Depozit & Stocuri</option>
                          <option value="hr">Resurse Umane (HR)</option>
                          <option value="finance">Contabilitate</option>
                          <option value="logistics">Logistică & Flotă</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-normal text-[#86868B] mb-2">Text Informație Subsol</label>
                      <input
                        type="text"
                        value={editingKpi.bottomText}
                        onChange={(e) => setEditingKpi({ ...editingKpi, bottomText: e.target.value })}
                        className="w-full h-12 bg-[#F2F2F7] rounded-xl px-4 text-xs font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F2F2F7]">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirm({
                          title: "Confirmă Ștergerea Indicatorului",
                          message: `Sigur dorești să ștergi definitiv indicatorul "${editingKpi.label}"?`,
                          onConfirm: () => handleDeleteKpiPermanently(editingKpi.id, editingKpi.label)
                        });
                      }}
                      className="px-4 py-2.5 text-xs bg-rose-50 text-rose-600 rounded-xl font-bold uppercase tracking-normal hover:bg-rose-100 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Șterge Definitiv</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingKpi(null)}
                        className="px-4 py-2.5 text-xs bg-[#E9E9EB] text-[#1D1D1F] rounded-xl font-bold uppercase tracking-normal hover:bg-[#D1D1D6] transition-all cursor-pointer"
                      >
                        Anulează
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveKpi(editingKpi)}
                        className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold uppercase tracking-normal hover:bg-slate-800 transition-all cursor-pointer shadow-md"
                      >
                        Salvează Modificări
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TWO COLUMN GRID FOR LISTS */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                
                {/* COL 1: PROGRAMĂRI VIITOARE ÎN DETALIU (Left column) */}
                <div className="xl:col-span-8 bg-white border border-[#E9E9EB] rounded-2xl p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] space-y-5">
                  <div className="flex justify-between items-center border-b border-[#F2F2F7] pb-6">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-[#1D1D1F] uppercase tracking-normal flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#E8F0FE] text-[#034EA2] rounded-xl flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                        Cereri de Programare Active
                      </h4>
                      <p className="text-xs text-[#86868B] font-bold ml-10 uppercase tracking-normal leading-none">Solicitări din portalul client</p>
                    </div>
                    <button
                      id="dashboard-view-all-ap"
                      onClick={() => setErpTab("appointments")}
                      className="text-xs font-bold text-[#034EA2] hover:text-indigo-800 transition-colors uppercase tracking-normal bg-[#E8F0FE] px-4 py-2 rounded-xl"
                    >
                      Vezi tot ➔
                    </button>
                  </div>

                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-4 bg-[#F2F2F7] rounded-2xl border border-dashed border-[#E9E9EB]">
                      <Calendar className="w-8 h-8 text-[#86868B] mx-auto mb-3" />
                      <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Nicio cerere nouă în așteptare</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {upcomingAppointments.map((ap) => {
                        const clientUser = users.find(u => u.id === ap.clientId);
                        const carObj = vehicles.find(v => v.id === ap.vehicleId);
                        const sType = serviceTypes.find(s => (ap.serviceTypeIds || []).includes(s.id));
                        
                        const dateObj = new Date(ap.date);
                        const month = ["IAN", "FEB", "MAR", "APR", "MAI", "IUN", "IUL", "AUG", "SEP", "OCT", "NOI", "DEC"][dateObj.getMonth()] || "MAI";
                        const day = dateObj.getDate();

                        return (
                          <div key={ap.id} className="p-4 rounded-2xl border border-[#F2F2F7] bg-[#F2F2F7]/50 hover:bg-[#E8F0FE]/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                            <div className="flex items-start md:items-center gap-4 flex-1">
                              {/* Date Badge */}
                              <div className="w-20 h-24 bg-white rounded-2xl flex flex-col items-center justify-center border border-[#E9E9EB] shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-500">
                                <span className="text-xs font-bold text-[#034EA2] uppercase leading-none mb-1">{month}</span>
                                <span className="text-xl font-bold text-[#1D1D1F] leading-none">{day}</span>
                              </div>
                              
                              <div className="space-y-4 flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="text-xs font-bold text-[#034EA2] bg-[#E8F0FE] px-4 py-1.5 rounded-full uppercase tracking-normal border border-blue-100/50">
                                    {ap.time}
                                  </span>
                                  <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-40">{ap.id.toUpperCase()}</span>
                                </div>
                                <div className="space-y-1">
                                  <h5 className="text-xl font-bold text-[#1D1D1F] leading-tight tracking-tight group-hover:text-[#034EA2] transition-colors">
                                    {sType?.name || "Operațiune Tehnică"}
                                  </h5>
                                  <p className="text-sm font-bold text-[#86868B] flex items-center gap-3">
                                    <span className="text-[#1D1D1F]">{clientUser?.name}</span>
                                    <span className="w-1.5 h-1.5 bg-[#86868B]/30 rounded-full"></span>
                                    <span className="text-[#034EA2]/70">{carObj?.licensePlate}</span>
                                  </p>
                                </div>
                                {ap.notes && (
                                  <p className="text-xs text-[#86868B] font-bold italic leading-relaxed py-3 border-t border-[#E9E9EB]/50">
                                    "{ap.notes}"
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-[#E9E9EB]/50">
                              <button
                                onClick={() => {
                                  onUpdateAppointmentStatus(ap.id, "Confirmed");
                                  if (onCreateJobFromAppointment) {
                                    onCreateJobFromAppointment(ap);
                                  }
                                  onNotify(`Programarea ${ap.id.toUpperCase()} a fost confirmată și Fișa Service a fost creată.`, "success");
                                }}
                                className="flex-1 md:flex-none bg-[#034EA2] text-white font-bold text-xs px-5 py-5 rounded-2xl hover:bg-[#1D1D1F] transition-all uppercase tracking-normal shadow-xl shadow-blue-100 active:scale-95 whitespace-nowrap"
                              >
                                Confirmă Programarea
                              </button>
                               <button 
                                 onClick={() => setErpTab("appointments")}
                                 className="w-12 h-12 bg-white border border-[#E9E9EB] text-[#1D1D1F] rounded-2xl flex items-center justify-center hover:bg-[#034EA2] hover:text-white hover:border-transparent transition-all shadow-sm group/btn shrink-0"
                               >
                                 <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                               </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* COL 2: ALERTE STOC */}
                <div className="xl:col-span-4 bg-white border border-[#E9E9EB] rounded-2xl p-4 shadow-sm space-y-6">
                  <div>
                    <h4 className="font-bold text-xs text-rose-900 uppercase tracking-normal flex items-center gap-2.5">
                       <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4" />
                       </div>
                       Alerte Stoc Critic
                    </h4>
                    <p className="text-xs text-[#86868B] font-bold ml-10 uppercase tracking-normal leading-none">Piese sub limita de siguranță</p>
                  </div>

                  <div className="space-y-4">
                    {lowStockItems.map((item) => {
                      const sup = suppliers.find(s => s.id === item.supplierId);
                      return (
                        <div key={item.id} className="p-5 bg-rose-50/20 border border-rose-100/50 rounded-2xl space-y-4 group hover:bg-white hover:shadow-2xl transition-all duration-500">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1.5">
                              <p className="font-bold text-[#1D1D1F] font-sans tracking-tight leading-none text-xs">{item.name}</p>
                              <span className="text-xs font-mono text-[#86868B] font-bold uppercase tracking-normal">OEM: {item.oemCode}</span>
                            </div>
                            <span className="bg-rose-600 text-white font-bold text-xs px-2.5 py-1.5 rounded-xl shadow-lg shadow-rose-100">
                              {item.currentStock}
                            </span>
                          </div>
                          <div className="text-xs font-semibold uppercase tracking-normal text-[#86868B] flex justify-between items-center bg-white p-3 rounded-2xl border border-[#F2F2F7] shadow-sm">
                            <span>{sup?.name || "Ungheni Autoparts"}</span>
                            <span className="text-rose-600">LIMITĂ: {item.minStockLevel}</span>
                          </div>
                        </div>
                      );
                    })}

                    {lowStockItems.length === 0 && (
                      <div className="text-center py-4 bg-[#F2F2F7] rounded-2xl border border-dashed border-[#E9E9EB]">
                        <CheckCircle2 className="w-8 h-8 text-emerald-300 mx-auto mb-3" />
                        <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Stocuri în parametri optimi</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* COMPREHENSIVE WORKSHOP OCCUPANCY */}
              <div className="bg-white border border-[#E9E9EB] rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div className="space-y-1">
                      <h4 className="font-bold text-xs text-[#1D1D1F] uppercase tracking-normal flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                           <Hammer className="w-4 h-4" />
                        </div>
                        Monitorizare Rampe Atelier
                      </h4>
                      <p className="text-xs text-[#86868B] font-bold ml-11 uppercase tracking-normal">Coordonare în timp real</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                         <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Disponibil</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                         <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Ocupat</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { bay: "Rampă 1 - Diagnoză", mechanic: "Andrei Nistor", spec: "Fibră optică & Osciloscope", occupiedBy: "Dacia Logan (UN-999-ST)" },
                    { bay: "Rampă 2 - Mecanică", mechanic: "Bogdan Marin", spec: "Hidraulic Pro-Lift", occupiedBy: "Renault Duster (UN-456-MD)" },
                    { bay: "Rampă 3 - Direcție", mechanic: "Liber", spec: "Laser 3D Pro-Align", occupiedBy: "Volkswagen Golf (UN-345-BG)" },
                    { bay: "Rampă 4 - Revizii", mechanic: "Andrei Nistor", spec: "Stație Freon R1234yf", occupiedBy: "Liber" }
                  ].map((bay, idx) => {
                    const isOccupied = bay.occupiedBy !== "Liber";
                    return (
                      <div 
                        key={idx} 
                        className={`p-6 rounded-2xl border transition-all duration-500 group cursor-default ${
                          isOccupied 
                            ? "bg-[#F2F2F7] border-[#E9E9EB] hover:shadow-lg" 
                            : "bg-emerald-50/10 border-emerald-100 hover:bg-emerald-50/30"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-tighter leading-none">{bay.bay}</span>
                           <div className={`w-2 h-2 rounded-full ${isOccupied ? "bg-amber-500 shadow-lg shadow-amber-200 animate-pulse" : "bg-emerald-500 shadow-lg shadow-emerald-200"}`}></div>
                        </div>
                        
                        <div className="space-y-4">
                           <div className="bg-white p-4 rounded-2xl border border-[#E9E9EB] shadow-sm space-y-3">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#86868B] group-hover:bg-[#E8F0FE] group-hover:text-[#034EA2] transition-colors">
                                    <UserIcon className="w-4 h-4" />
                                 </div>
                                 <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal leading-none">Mecanic</p>
                                    <p className="text-xs font-bold text-[#1D1D1F] tracking-tight">{bay.mechanic}</p>
                                 </div>
                              </div>
                              <div className="pt-3 border-t border-[#F2F2F7]">
                                 <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal leading-none mb-1.5">Vehicul</p>
                                 <p className={`text-xs font-bold tracking-tight truncate ${isOccupied ? "text-[#034EA2]" : "text-emerald-600 italic"}`}>
                                    {bay.occupiedBy}
                                 </p>
                              </div>
                           </div>
                           <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal text-center leading-none">
                              Spec: <span className="text-[#86868B]">{bay.spec}</span>
                           </p>
                        </div>
                      </div>
                    );
                   })}
                </div>
              </div>

            </div>
          )}

          {/* B. VIEW: PROGRAMĂRI MANAGER */}
          {erpTab === "appointments" && (
            <div id="erp-view-appointments" className="bg-white border border-[#E9E9EB] rounded-2xl p-4 md:p-6 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#F2F2F7] pb-8">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F2F2F7] text-[#1D1D1F] rounded-2xl flex items-center justify-center shadow-sm border border-[#E9E9EB]">
                      <Calendar className="w-6 h-6 text-[#034EA2]" />
                    </div>
                    Programări Service
                  </h3>
                  <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-16">Validarea solicitărilor de reparații și diagnoză</p>
                </div>

                <div className="flex items-center gap-3 bg-[#F2F2F7] p-1.5 rounded-[22px] border border-[#E9E9EB]">
                  <div className="px-5 py-2 bg-white rounded-[18px] shadow-sm text-[11px] font-bold uppercase tracking-tight text-[#034EA2]">
                    TOTAL: {appointments.length}
                  </div>
                  <div className="px-5 py-2 text-[11px] font-bold uppercase tracking-tight text-[#86868B]">
                    AȘTEPTARE: {appointments.filter(a => a.status !== "Confirmed").length}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto bg-white rounded-xl border border-[#E9E9EB]">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="text-xs font-bold text-[#86868B] uppercase tracking-normal border-b border-[#F2F2F7]">
                      <th className="px-4 py-5">ID</th>
                      <th className="px-4 py-5">Proprietar</th>
                      <th className="px-4 py-5">Vehicul</th>
                      <th className="px-4 py-5">Interval temporal</th>
                      <th className="px-4 py-5">Operațiune</th>
                      <th className="px-4 py-5">Validare</th>
                      <th className="px-4 py-5 text-right">Acțiuni</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F2F7]">
                      {appointments.map((ap) => {
                        const client = users.find(u => u.id === ap.clientId);
                        const veh = vehicles.find(v => v.id === ap.vehicleId);
                        const selectedServices = serviceTypes.filter(s => (ap.serviceTypeIds || []).includes(s.id));
                        const isConfirmed = ap.status === "Confirmed";
                        
                        return (
                          <tr key={ap.id} className="hover:bg-[#F2F2F7]/50 transition-all group">
                            <td className="px-4 py-6 font-mono text-[11px] font-bold text-[#034EA2]">
                               <span className="bg-[#E8F0FE] border border-blue-100/50 px-3 py-2 rounded-lg">
                                  {ap.id.toUpperCase()}
                               </span>
                            </td>
                            <td className="px-4 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#86868B] border border-[#E9E9EB]">
                                    <UserIcon className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <p className="font-bold text-[#1D1D1F] text-sm tracking-tight">{client?.name}</p>
                                    <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mt-0.5">{client?.phone}</p>
                                 </div>
                              </div>
                            </td>
                            <td className="px-4 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#034EA2] border border-[#E9E9EB] shadow-sm">
                                    <Car className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <p className="font-bold text-[#1D1D1F] text-sm tracking-tight">{veh?.brand} {veh?.model}</p>
                                    <p className="text-xs font-bold text-[#86868B] font-mono uppercase mt-0.5">{veh?.licensePlate}</p>
                                  </div>
                              </div>
                            </td>
                            <td className="px-4 py-6">
                               <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                     <Calendar className="w-3.5 h-3.5 text-[#034EA2]" />
                                     <p className="text-xs font-bold text-[#1D1D1F] tracking-tight">{ap.date}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <Clock className="w-3.5 h-3.5 text-[#86868B]" />
                                     <span className="text-xs font-bold text-[#86868B] font-mono">{ap.time}</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-4 py-6">
                               <div className="flex flex-col gap-1">
                                  <span className="text-xs font-bold text-[#1D1D1F] bg-[#F2F2F7] border border-[#E9E9EB] px-3.5 py-2 rounded-xl uppercase tracking-normal inline-block">
                                     {selectedServices.length > 0 ? selectedServices[0].name : "Diagnoză Tehnică"}
                                  </span>
                                  {selectedServices.length > 1 && (
                                    <span className="text-[10px] font-bold text-blue-600 ml-2">
                                      +{selectedServices.length - 1} alte servicii
                                    </span>
                                  )}
                               </div>
                            </td>
                          <td className="px-4 py-6">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold uppercase tracking-normal text-xs ${isConfirmed ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100 animate-pulse"}`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? "bg-emerald-500" : "bg-amber-500"}`}></div>
                               <span>{isConfirmed ? "Validată" : "Așteptare"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-6 text-right">
                            {!isConfirmed ? (
                              <button
                                onClick={() => {
                                  onUpdateAppointmentStatus(ap.id, "Confirmed");
                                  if (onCreateJobFromAppointment) {
                                    onCreateJobFromAppointment(ap);
                                  }
                                  onNotify(`Programarea ${ap.id.toUpperCase()} confirmată și Fișă Service deschisă!`, "success");
                                }}
                                className="bg-[#034EA2] hover:bg-[#1D1D1F] text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition-all cursor-pointer uppercase tracking-normal shadow-sm active:scale-95"
                              >
                                Confirmă
                              </button>
                            ) : (
                              <div className="flex items-center justify-end gap-2 text-emerald-600">
                                 <CheckCircle2 className="w-4 h-4" />
                                 <span className="text-xs font-semibold uppercase tracking-normal">Confirmată</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* NEW VIEW: ATELIER DASHBOARD (5 Ramps and Electrician compartiment) */}
          {erpTab === "atelier" && (
            <div id="erp-view-atelier" className="animate-in fade-in duration-500 w-full">
              <AtelierDashboard
                currentUser={currentUser}
                users={users}
                vehicles={vehicles}
                serviceJobs={serviceJobs}
                onUpdateJobStatus={onUpdateJobStatus}
                onNotify={onNotify}
                onOpenJobs={() => setErpTab("jobs")}
                onSelectJobId={setSelectedJobIdForEdit}
              />
            </div>
          )}

          {/* C. VIEW: FIȘE ATELIER / JOBS (Daily mechanic operations and billable devizes) */}
          {erpTab === "jobs" && (
            <div id="erp-view-jobs" className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {!selectedJobIdForEdit ? (
                <div className="h-[calc(100vh-280px)]">
                  <ServiceJobsManagement 
                    jobs={serviceJobs}
                    vehicles={vehicles}
                    users={users}
                    onSelectJob={(job) => setSelectedJobIdForEdit(job.id)}
                    onUpdateStatus={onUpdateJobStatus}
                    onCreateJob={() => onNotify("Funcționalitate creare job în lucru!", "info")}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  {/* Left sidebar: Quick switcher if needed, or just the management reduced */}
                  <div className="xl:col-span-4 space-y-4">
                     <button 
                       onClick={() => setSelectedJobIdForEdit(null)}
                       className="w-full bg-white border border-[#E9E9EB] p-5 rounded-2xl flex items-center gap-3 text-xs font-black text-[#1D1D1F] uppercase tracking-widest hover:bg-[#F2F2F7] transition-all cursor-pointer shadow-sm active:scale-95"
                     >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Înapoi la Flux Control
                     </button>

                     <div className="bg-white border border-[#E9E9EB] rounded-3xl overflow-hidden h-[calc(100vh-420px)] flex flex-col">
                        <div className="p-5 border-b border-[#F2F2F7] bg-white">
                           <h4 className="text-[10px] font-black text-[#86868B] uppercase tracking-widest leading-none mb-1">Restul Fișelor</h4>
                           <p className="text-xs font-bold text-[#1D1D1F]">Comută rapid între unități</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-[#F2F2F7]/30">
                           {serviceJobs.filter(j => j.id !== selectedJobIdForEdit).map(job => {
                             const v = vehicles.find(veh => veh.id === job.vehicleId);
                             return (
                               <div 
                                 key={job.id}
                                 onClick={() => setSelectedJobIdForEdit(job.id)}
                                 className="p-4 bg-white rounded-xl border border-[#E9E9EB] hover:border-[#034EA2]/30 cursor-pointer transition-all shadow-sm group"
                               >
                                  <div className="flex justify-between items-start mb-1">
                                     <span className="text-[9px] font-black text-[#86868B] uppercase">#{job.id.slice(-4).toUpperCase()}</span>
                                     <span className="w-2 h-2 rounded-full bg-blue-500" />
                                  </div>
                                  <h5 className="text-[11px] font-bold text-[#1D1D1F] truncate group-hover:text-[#034EA2] transition-colors">{v?.brand} {v?.model}</h5>
                                  <p className="text-[9px] font-bold text-[#86868B] uppercase tracking-tighter mt-1">{v?.licensePlate}</p>
                               </div>
                             );
                           })}
                        </div>
                     </div>
                  </div>

                  {/* Editing Card (8 columns) - Incorporating complex ServiceJobDetails component */}
                  <div className="xl:col-span-8 bg-white rounded-[32px] border border-[#E9E9EB] shadow-sm overflow-y-auto h-[calc(100vh-280px)] custom-scrollbar">
                    {activeJob ? (
                      <div className="p-6">
                        <ServiceJobDetails
                          activeJob={activeJob}
                          users={users}
                      vehicles={vehicles}
                      inventoryItems={inventoryItems}
                      invoices={invoices}
                      onUpdateJobStatus={onUpdateJobStatus}
                      onAddJobCardPart={onAddJobCardPart}
                      onAddJobCardLabor={onAddJobCardLabor}
                      onGenerateInvoice={onGenerateInvoice}
                      onNotify={onNotify}
                      onBack={() => setSelectedJobIdForEdit(null)}
                    />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center space-y-8 text-center p-12 bg-white rounded-[32px] border border-dashed border-[#E9E9EB] animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-40 h-40 bg-[#F2F2F7] text-[#034EA2] rounded-[40px] flex items-center justify-center shadow-inner relative overflow-hidden group">
                       <div className="absolute inset-x-0 bottom-0 h-1/3 bg-blue-500/10 group-hover:h-full transition-all duration-700"></div>
                       <Activity className="w-16 h-16 relative z-10 animate-pulse" />
                    </div>
                    <div className="space-y-4 max-w-sm">
                      <h4 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Turn de Control Integrat</h4>
                      <p className="text-sm font-bold text-[#86868B] uppercase tracking-normal leading-relaxed">
                        Selectează un ordin de lucru din fluxul operațional pentru a accesa controlul tehnic, evidența pieselor și managementul manoperei.
                      </p>
                    </div>
                    <div className="flex gap-4">
                       <span className="px-5 py-2 bg-[#F2F2F7] rounded-full text-[10px] font-bold text-[#86868B] uppercase tracking-widest border border-[#E9E9EB]">Diagnosticare</span>
                       <span className="px-5 py-2 bg-[#F2F2F7] rounded-full text-[10px] font-bold text-[#86868B] uppercase tracking-widest border border-[#E9E9EB]">Logistică</span>
                       <span className="px-5 py-2 bg-[#F2F2F7] rounded-full text-[10px] font-bold text-[#86868B] uppercase tracking-widest border border-[#E9E9EB]">Decontare</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

          {/* D. VIEW: CLIENȚI / CRM (Clients & Vehicles management) */}
          {erpTab === "crm" && (
            <div id="erp-view-crm" className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* CRM Forms (Client, Car) */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {showAddClient && (
                  <div id="crm-add-client-block" className="bg-white rounded-2xl p-4 md:p-6 border border-[#E9E9EB] shadow-sm space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="space-y-1 border-b border-[#F2F2F7] pb-8">
                      <h4 className="font-bold text-lg text-[#1D1D1F] uppercase tracking-tight flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#E8F0FE] text-[#034EA2] rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100/50">
                          <Plus className="w-5 h-5" />
                        </div>
                        Adăugare Client
                      </h4>
                      <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-2 ml-14">Creează o fișă nouă în baza de date AutoBOX</p>
                    </div>
                    
                    <form onSubmit={handleCreateClient} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="crm-c-name" className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Nume Complet</label>
                          <input id="crm-c-name" type="text" required value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="Ex: Popa Sergiu" className="w-full bg-[#F2F2F7] border-none p-4 rounded-2xl font-bold text-[#1D1D1F] focus:ring-4 focus:ring-[#034EA2]/10 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="crm-c-phone" className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Nr. Telefon</label>
                          <input id="crm-c-phone" type="text" required value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} placeholder="06XXXXXXXX" className="w-full bg-[#F2F2F7] border-none p-4 rounded-2xl font-bold text-[#1D1D1F] focus:ring-4 focus:ring-[#034EA2]/10 transition-all" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="crm-c-email" className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Adresă Email</label>
                          <input id="crm-c-email" type="email" required value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} placeholder="sergiu@mail.md" className="w-full bg-[#F2F2F7] border-none p-4 rounded-2xl font-bold text-[#1D1D1F] focus:ring-4 focus:ring-[#034EA2]/10 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="crm-c-password" className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Parolă Cont</label>
                          <input id="crm-c-password" type="password" required value={newClientPassword} onChange={(e) => setNewClientPassword(e.target.value)} placeholder="******" className="w-full bg-[#F2F2F7] border-none p-4 rounded-2xl font-bold text-[#1D1D1F] focus:ring-4 focus:ring-[#034EA2]/10 transition-all" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-6 border-t border-[#F2F2F7]">
                        <button id="crm-c-cancel-btn" type="button" onClick={() => setShowAddClient(false)} className="px-6 py-4 font-bold text-[#86868B] text-xs uppercase tracking-normal hover:bg-[#F2F2F7] rounded-2xl transition-colors">Anulează</button>
                        <button id="crm-c-save-btn" type="submit" className="bg-[#1D1D1F] hover:bg-[#034EA2] text-white font-bold px-4 py-4 rounded-2xl text-xs uppercase tracking-normal transition-all shadow-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-95">Înregistrează Acum</button>
                      </div>
                    </form>
                  </div>
                )}

                {showAddVehicle && (
                  <div id="crm-add-vehicle-block" className="bg-white rounded-2xl p-4 md:p-6 border border-[#E9E9EB] shadow-sm space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#F2F2F7] pb-8 gap-6">
                      <div className="space-y-1">
                        <h4 className="font-bold text-lg text-[#1D1D1F] uppercase tracking-tight flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#1D1D1F] text-white rounded-2xl flex items-center justify-center shadow-lg border border-black">
                            <Car className="w-5 h-5" />
                          </div>
                          Fișă Vehicul
                        </h4>
                        <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-1 ml-14">Înregistrarea specificațiilor tehnice</p>
                      </div>
                      {/* AI AUTOFILL VIN TOOL */}
                      <button 
                        type="button"
                        onClick={() => {
                          if (!newVehVin || newVehVin.length < 10) {
                            onNotify("Introdu un cod VIN valid pentru decodare!", "info");
                            return;
                          }
                          onNotify("AI procesează codul VIN... Datele vehiculului au fost extrase!", "success");
                          setNewVehBrand("Volkswagen");
                          setNewVehModel("Golf 7");
                          // Simulate setting more fields if they existed in state
                        }}
                        className="bg-[#E8F0FE] text-[#034EA2] px-6 py-3 rounded-2xl border border-indigo-100 hover:bg-[#034EA2] hover:text-white transition-all flex items-center gap-3 group cursor-pointer shadow-sm ml-14 md:ml-0"
                      >
                         <Wrench className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                         <span className="text-xs font-semibold uppercase tracking-normal">VIN Decodor AI</span>
                      </button>
                    </div>

                    <form onSubmit={handleCreateVehicle} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="crm-v-owner" className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Proprietar (Client CRM)</label>
                        <select
                          id="crm-v-owner"
                          required
                          value={newVehClientId}
                          onChange={(e) => setNewVehClientId(e.target.value)}
                          className="w-full bg-[#F2F2F7] border-none p-4 rounded-2xl font-bold text-xs text-[#1D1D1F] cursor-pointer focus:ring-4 focus:ring-[#034EA2]/10"
                        >
                          <option value="">Alege deținătorul...</option>
                          {users.filter(u => u.role === UserRole.CLIENT).map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="crm-v-brand" className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Marcă</label>
                          <input id="crm-v-brand" type="text" required value={newVehBrand} onChange={(e) => setNewVehBrand(e.target.value)} placeholder="Dacia, VW..." className="w-full bg-[#F2F2F7] border-none p-4 rounded-2xl font-bold text-[#1D1D1F] focus:ring-4 focus:ring-[#034EA2]/10" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="crm-v-model" className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Model</label>
                          <input id="crm-v-model" type="text" value={newVehModel} onChange={(e) => setNewVehModel(e.target.value)} placeholder="Logan, Tiguan..." className="w-full bg-[#F2F2F7] border-none p-4 rounded-2xl font-bold text-[#1D1D1F] focus:ring-4 focus:ring-[#034EA2]/10" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="crm-v-plate" className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Nr. Înamtriculare</label>
                          <input id="crm-v-plate" type="text" required value={newVehPlate} onChange={(e) => setNewVehPlate(e.target.value.toUpperCase())} placeholder="UN-123-AA" className="w-full bg-[#F2F2F7] border-none p-4 rounded-2xl font-bold font-mono text-indigo-700 uppercase tracking-normal focus:ring-4 focus:ring-[#034EA2]/10" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="crm-v-vin" className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-1">Cod VIN (17 caractere)</label>
                          <input id="crm-v-vin" type="text" maxLength={17} value={newVehVin} onChange={(e) => setNewVehVin(e.target.value.toUpperCase())} placeholder="WVBZZZ1K..." className="w-full bg-[#F2F2F7] border-none p-4 rounded-2xl font-bold font-mono text-[#1D1D1F] tracking-normal focus:ring-4 focus:ring-[#034EA2]/10" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-6 border-t border-[#F2F2F7]">
                        <button id="crm-v-cancel-btn" type="button" onClick={() => setShowAddVehicle(false)} className="px-6 py-4 font-bold text-[#86868B] text-xs uppercase tracking-normal hover:bg-[#F2F2F7] rounded-2xl transition-colors">Închide</button>
                        <button id="crm-v-save-btn" type="submit" className="bg-[#1D1D1F] hover:bg-[#034EA2] text-white font-bold px-4 py-4 rounded-2xl text-xs uppercase tracking-normal transition-all shadow-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-95">Adaugă în Parcul Auto</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* CRM Grid List */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#E9E9EB] shadow-sm space-y-4">
                  <div className="flex justify-between items-center bg-[#F2F2F7] p-6 rounded-2xl border border-[#E9E9EB]">
                    <h4 className="font-bold text-sm text-[#1D1D1F] uppercase tracking-tight flex items-center gap-4">
                      <div className="w-10 h-10 bg-white border border-[#E9E9EB] text-[#034EA2] rounded-xl flex items-center justify-center shadow-sm">
                        <Users className="w-5 h-5" />
                      </div>
                      Portofoliu Clienți
                    </h4>
                    <span className="text-xs font-bold text-[#86868B] bg-white border border-[#E9E9EB] px-4 py-1.5 rounded-full uppercase tracking-normal shadow-sm">
                      {users.filter(u => u.role === UserRole.CLIENT).length} ACTIVE
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-5 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {users.filter(u => u.role === UserRole.CLIENT).map(client => {
                      const correlatedCars = vehicles.filter(v => v.clientId === client.id);
                      return (
                        <div key={client.id} className="p-4 bg-[#F2F2F7] rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-indigo-900 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                             <UserPlus className="w-32 h-32" />
                          </div>
                          
                          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 relative z-10">
                            <img src={client.avatarUrl || getRoleAvatar(client.role)} alt={client.name} referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover border-4 border-white shadow-xl group-hover:rotate-3 transition-transform" />
                            <div className="flex-1 space-y-4 text-center md:text-left">
                              <div>
                                <h5 className="font-bold text-[#1D1D1F] text-xl tracking-tight group-hover:text-[#034EA2] transition-colors uppercase">{client.name}</h5>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                                  <p className="text-xs font-bold text-[#86868B] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                    {client.email}
                                  </p>
                                  <p className="text-xs font-bold text-[#86868B] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    {client.phone}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="pt-4 space-y-4 border-t border-[#E9E9EB]/50">
                                <p className="text-xs font-bold text-[#034EA2]/60 uppercase tracking-normal font-mono">Garaj Digital Asociat</p>
                                {correlatedCars.length === 0 ? (
                                  <div className="flex items-center gap-2 text-xs font-bold text-[#86868B] italic bg-white/50 p-4 rounded-2xl border border-dashed border-[#E9E9EB]">
                                    <Car className="w-4 h-4 opacity-50" />
                                    Niciun vehicul înregistrat activ
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {correlatedCars.map(c => (
                                      <div key={c.id} className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-[#E9E9EB] shadow-sm hover:shadow-md transition-shadow group/car">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-[#F2F2F7] rounded-lg flex items-center justify-center text-[#86868B] group-hover/car:bg-[#E8F0FE] group-hover/car:text-[#034EA2] transition-colors">
                                            <Car className="w-4 h-4" />
                                          </div>
                                          <div className="space-y-0.5">
                                            <span className="text-xs font-bold text-[#1D1D1F] uppercase block tracking-tight">{c.brand} {c.model}</span>
                                            <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal">{c.year}</span>
                                          </div>
                                        </div>
                                        <span className="text-xs font-bold font-mono text-[#034EA2] bg-[#E8F0FE] px-3 py-1.5 rounded-xl border border-indigo-100 shadow-inner">{c.licensePlate}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#E9E9EB] shadow-sm space-y-4">
                  <div className="flex justify-between items-center bg-[#1D1D1F] p-6 rounded-2xl text-white">
                    <h4 className="font-bold text-sm uppercase tracking-tight flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <Car className="w-5 h-5" />
                      </div>
                      Unități Parcul Auto
                    </h4>
                    <span className="text-xs font-bold text-[#86868B] bg-white/5 border border-white/10 px-4 py-1.5 rounded-full uppercase tracking-normal">
                      {vehicles.length} VEHICULE
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {vehicles.map(veh => {
                      const owner = users.find(u => u.id === veh.clientId);
                      return (
                        <div key={veh.id} className="p-6 bg-[#F2F2F7] hover:bg-white hover:shadow-xl hover:border-indigo-100 border-2 border-transparent rounded-2xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white border border-[#E9E9EB] rounded-xl flex items-center justify-center text-[#86868B] group-hover:text-[#034EA2] group-hover:scale-110 transition-all shadow-sm">
                               <Car className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-[#1D1D1F] text-lg tracking-tight uppercase group-hover:text-[#034EA2] transition-colors">{veh.brand} {veh.model} <span className="text-[#86868B] ml-1 font-mono text-sm">/{veh.year}</span></p>
                              <div className="flex items-center gap-4">
                                <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal flex items-center gap-2">
                                  <UserIcon className="w-3 h-3" />
                                  <span className="text-[#86868B] font-bold">{owner?.name || "N/A"}</span>
                                </p>
                                <span className="w-1 h-1 rounded-full bg-[#86868B]"></span>
                                <p className="text-xs font-bold font-mono text-[#86868B] tracking-normal uppercase">VIN: {veh.vin || "---"}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-[#E9E9EB] pt-4 sm:pt-0">
                             <div className="font-mono font-bold text-indigo-700 bg-white border-2 border-indigo-100 rounded-xl px-6 py-3 text-sm shadow-lg group-hover:bg-[#034EA2] group-hover:text-white group-hover:border-indigo-600 transition-all tracking-tighter">
                                {veh.licensePlate}
                             </div>
                             {veh.mileage && (
                               <span className="text-xs font-bold text-[#86868B] uppercase tracking-normal bg-[#E9E9EB] px-3 py-1 rounded-full">{veh.mileage.toLocaleString()} KM</span>
                             )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* E. VIEW: INVENTAR / DEPOT (Products inventory levels controls) */}
          {erpTab === "inventory" && (
            <WarehouseDashboard 
              inventoryItems={inventoryItems}
              suppliers={suppliers}
              stockMovements={stockMovements}
              users={users}
              onAddInventoryItem={onAddInventoryItem}
              onAddStockMovement={onAddStockMovement}
              onNotify={onNotify}
              hideHeader={true}
            />
          )}

          {/* F. VIEW: ANGAJAȚI / HR WORKSPACE (The requested HR panel) */}
          {erpTab === "hr" && (
            <HRDashboard 
              users={users}
              timesheets={timesheets}
              serviceJobs={serviceJobs}
              onAddUser={onAddUser}
              onSelectEmployee={onSelectEmployee || (() => {})}
              onNotify={onNotify}
              onAddTimesheet={onAddTimesheet}
              onExport={onExport}
              onImport={onImport}
              onDelete={onDelete}
              hideHeader={true}
            />
          )}

          {/* G. VIEW: FACTURARE / FINANCE (Billing registry) */}
          {erpTab === "finance" && (
            <AccountingDashboard 
              users={users}
              vehicles={vehicles}
              invoices={invoices}
              serviceJobs={serviceJobs}
              expenses={expenses}
              onUpdateInvoicePayment={onUpdateInvoicePayment}
              onAddExpense={onAddExpense}
              onGenerateInvoice={onGenerateInvoice}
              onNotify={onNotify}
              onSelectJob={(jobId) => {
                setErpTab("jobs");
                setSelectedJobIdForEdit(jobId);
              }}
              hideHeader={true}
            />
          )}

          {/* H. VIEW: LOGISTICS & FLEET (Logistics panel) */}
          {erpTab === "logistics" && (
            <LogisticsDashboard 
              users={users}
              vehicles={vehicles}
              serviceJobs={serviceJobs}
              onNotify={onNotify}
              hideHeader={true}
            />
          )}

        </div>

    </div>
  );
}

// Simple internal helper icon to satisfy standard typescript compilation
function HistoryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
