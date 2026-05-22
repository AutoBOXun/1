/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { saveToStorage, getFromStorage, clearStorage } from "./utils/persistence";
import { User, Vehicle, ServiceType, Appointment, ServiceJob, InventoryItem, Supplier, Timesheet, Invoice, UserRole, JobStatus, JobCardPart, JobCardLabor, DamagePhoto, Notification, Expense, StockMovement } from "./types";
import { 
  initialUsers, initialVehicles, initialServiceTypes, initialSuppliers, 
  initialInventoryItems, initialAppointments, initialServiceJobs, 
  initialInvoices, initialTimesheets, initialNotifications,
  initialExpenses, initialStockMovements
} from "./data";
import SchemaExplorer from "./components/SchemaExplorer";
import ClientPortal from "./components/ClientPortal";
import AdminERP from "./components/AdminERP";
import LandingPage from "./components/LandingPage";
import ServicesCatalog from "./components/ServicesCatalog";
import OwnerControlPanel from "./components/OwnerControlPanel";
import NotificationsPage from "./components/NotificationsPage";
import AIChatBot from "./components/AIChatBot";
import AuthPage from "./components/AuthPage";
import MaintenancePage from "./components/MaintenancePage";
import ClientsManagement from "./components/ClientsManagement";
import EmployeesManagement from "./components/EmployeesManagement";
import { getRoleAvatar } from "./utils/avatarUtils";
import ServicesManagement from "./components/ServicesManagement";
import InventoryManagement from "./components/InventoryManagement";
import EmployeeSheet from "./components/EmployeeSheet";
import { 
  Database, User as UserIcon, Users, Settings, Wrench, Shield, CheckCircle2, AlertCircle, LogOut, X, Car, ChevronDown, Home, Bell, Trash2, Info, LogIn, UserPlus, Plus, Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation history to support the "Back" requirement
  const [viewHistory, setViewHistory] = useState<string[]>(["landing"]);

  const navigateTo = (view: typeof activeView) => {
    setViewHistory(prev => [...prev, view]);
    setActiveView(view);
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // remove current
      const lastView = newHistory[newHistory.length - 1] as any;
      setViewHistory(newHistory);
      setActiveView(lastView);
    } else {
      if (currentUser) {
        if (currentUser.role === UserRole.CLIENT) {
          setClientActiveTab("home");
          setActiveView("client");
        } else {
          setActiveView("admin");
        }
      } else {
        setActiveView("landing");
      }
    }
  };

  // Navigation tabs: landing page, client portal, admin erp portal, database schema portal, control panel, notifications, auth, maintenance, clients-list, employees-list, services-list, inventory-list, employee-record, services-catalog
  const [activeView, setActiveView] = useState<"landing" | "client" | "admin" | "schema" | "control-panel" | "notifications" | "auth" | "maintenance" | "clients-list" | "employees-list" | "services-list" | "inventory-list" | "employee-record" | "services-catalog">("landing");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [clientActiveTab, setClientActiveTab] = useState<"home" | "dashboard" | "book-wizard" | "documents" | "catalog" | "my-vehicle" | "add-vehicle">("home");
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "register">("login");

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOwnerModeActive, setIsOwnerModeActive] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUnauthMenuOpen, setIsUnauthMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const unauthMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (unauthMenuRef.current && !unauthMenuRef.current.contains(event.target as Node)) {
        setIsUnauthMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const { password, ...userWithoutPassword } = currentUser;
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const [confirm, setConfirm] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Core Stateful Database
  const [users, setUsers] = useState<User[]>(() => getFromStorage("users", initialUsers));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getFromStorage("vehicles", initialVehicles));
  const [serviceTypes] = useState<ServiceType[]>(initialServiceTypes);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => getFromStorage("inventoryItems", initialInventoryItems));
  const [appointments, setAppointments] = useState<Appointment[]>(() => getFromStorage("appointments", initialAppointments));
  const [serviceJobs, setServiceJobs] = useState<ServiceJob[]>(() => getFromStorage("serviceJobs", initialServiceJobs));
  const [timesheets, setTimesheets] = useState<Timesheet[]>(initialTimesheets);
  const [invoices, setInvoices] = useState<Invoice[]>(() => getFromStorage("invoices", initialInvoices));
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);

  // Persistence effects
  useEffect(() => { saveToStorage("users", users); }, [users]);
  useEffect(() => { saveToStorage("vehicles", vehicles); }, [vehicles]);
  useEffect(() => { saveToStorage("inventoryItems", inventoryItems); }, [inventoryItems]);
  useEffect(() => { saveToStorage("appointments", appointments); }, [appointments]);
  useEffect(() => { saveToStorage("serviceJobs", serviceJobs); }, [serviceJobs]);
  useEffect(() => { saveToStorage("invoices", invoices); }, [invoices]);

  // Filter notifications for current user
  const userNotifications = notifications.filter(n => n.userId === currentUser?.id || (currentUser?.role === UserRole.OWNER && n.userId === "u-owner"));
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Filter out basile (OWNER u-owner) from visible users until logged in as owner!
  const visibleUsers = useMemo(() => isOwnerModeActive 
    ? users 
    : users.filter(u => u.role !== UserRole.OWNER && u.id !== "u-owner" && u.name.toLowerCase() !== "basile" && u.email.toLowerCase() !== "basile@autoservice.md"),
    [isOwnerModeActive, users]
  );

  // Active Simulation User selector (For multi-role preview testing inside portals)
  const [currentClientId, setCurrentClientId] = useState<string>("u-1");
  
  // Use current logged in user if present, otherwise use the selected simulation client
  const activeClient = currentUser 
    ? currentUser 
    : (visibleUsers.find(u => u.id === currentClientId) || visibleUsers.filter(u => u.role === UserRole.CLIENT)[0] || {
        id: "guest-client",
        name: "Client Vizitator",
        email: "vizitator@autoservice.md",
        phone: "Nespecificat",
        role: UserRole.CLIENT,
        avatarUrl: getRoleAvatar(UserRole.CLIENT)
      });

  // Floating Alert Toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  // MUTATORS
  const handleAddAppointment = (ap: Appointment) => {
    setAppointments(prev => [ap, ...prev]);
    
    // Side effect: Automatically generate a corresponding ServiceJob (Job Card) 
    const matchingService = serviceTypes.find(s => s.id === ap.serviceTypeIds[0]);
    
    const newJob: ServiceJob = {
      id: `job-${Date.now().toString().slice(-4)}`,
      appointmentId: ap.id,
      vehicleId: ap.vehicleId,
      clientId: ap.clientId,
      status: JobStatus.SCHEDULED,
      receptionNotes: "Programare planificată din portalul client.",
      reportedFaults: ap.notes || `Remediere: ${matchingService?.name || "Verificare generală"}`,
      parts: [],
      labor: [],
      damages: [],
      entryDate: ap.date,
      estimatedFinishDate: ap.date
    };

    setServiceJobs(prev => [newJob, ...prev]);
  };

  const handleUpdateAppointmentStatus = (id: string, status: "Pending" | "Confirmed" | "Canceled") => {
    setAppointments(prev => prev.map(ap => ap.id === id ? { ...ap, status } : ap));
  };

  const handleCreateJobFromAppointment = (ap: Appointment) => {
    // Verificăm dacă există deja o fișă pentru această programare
    const exists = serviceJobs.some(j => j.appointmentId === ap.id);
    if (exists) return;

    const matchingService = serviceTypes.find(s => s.id === ap.serviceTypeIds[0]);
    
    const newJob: ServiceJob = {
      id: `job-${Date.now().toString().slice(-4)}`,
      appointmentId: ap.id,
      vehicleId: ap.vehicleId,
      clientId: ap.clientId,
      status: JobStatus.SCHEDULED,
      receptionNotes: "Gestiune automată: Fișă deschisă la confirmare.",
      reportedFaults: ap.notes || `Intervenție: ${matchingService?.name || "Inspectie Generală"}`,
      parts: [],
      labor: [],
      damages: [],
      entryDate: ap.date,
      estimatedFinishDate: ap.date
    };

    setServiceJobs(prev => [newJob, ...prev]);
  };

  const handleAddVehicle = (veh: Vehicle) => {
    setVehicles(prev => [...prev, veh]);
  };

  const handleAddUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const handleAddTimesheet = (ts: Timesheet) => {
    setTimesheets(prev => [ts, ...prev]);
  };

  const handleUpdateJobStatus = useCallback((jobId: string, newStatus: JobStatus) => {
    setServiceJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        let realFinishDate = job.realFinishDate;
        if (newStatus === JobStatus.READY_FOR_DELIVERY || newStatus === JobStatus.FINISHED) {
          realFinishDate = new Date().toISOString().split("T")[0];
        }
        return { ...job, status: newStatus, realFinishDate };
      }
      return job;
    }));
    showToast(`Status fișă ${jobId.toUpperCase()} actualizat: ${newStatus}`, "info");
  }, [showToast]);

  const handleAddJobCardPart = (jobId: string, newPart: JobCardPart) => {
    setServiceJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, parts: [...job.parts, newPart] };
      }
      return job;
    }));

    // Record stock movement (OUT)
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      itemId: newPart.partId,
      type: "OUT",
      quantity: newPart.quantity,
      reason: `Utilizat în devizul de lucru ${jobId.toUpperCase()}`,
      date: new Date().toISOString().split("T")[0],
      userId: currentUser?.id || "u-system"
    };
    setStockMovements(prev => [newMovement, ...prev]);

    // Side effect: Decrement stock levels of the corresponding Inventory item
    setInventoryItems(prev => prev.map(item => {
      if (item.id === newPart.partId) {
        const remainingStock = Math.max(item.currentStock - newPart.quantity, 0);
        if (remainingStock <= item.minStockLevel) {
          showToast(`Alertă stoc critic pentru ${item.name}! A scăzut sub limita minimă.`, "info");
        }
        return { ...item, currentStock: remainingStock };
      }
      return item;
    }));
  };

  const handleAddJobCardLabor = (jobId: string, newLabor: JobCardLabor) => {
    setServiceJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, labor: [...job.labor, newLabor] };
      }
      return job;
    }));

    // Side-effect: Append a direct timesheet log to compute work hours and commissions dynamically!
    const comisionAmount = (newLabor.hoursSpent * newLabor.hourlyRate * newLabor.commissionRate) / 100;
    const newTs: Timesheet = {
      id: `ts-${Date.now()}`,
      employeeId: newLabor.mechanicId,
      jobId: jobId,
      date: new Date().toISOString().split("T")[0],
      hoursWorked: newLabor.hoursSpent,
      notes: `Manoperă fișă ${jobId.toUpperCase()}: ${newLabor.description}`,
      basePay: 0, // commissions supplement
      commissionEarned: comisionAmount
    };

    setTimesheets(prev => [newTs, ...prev]);
  };

  const handleAddDamagePhoto = (jobId: string, newPhoto: DamagePhoto) => {
    setServiceJobs(prev => prev.map(job => {
      if (job.id === jobId) {
        return { ...job, damages: [...job.damages, newPhoto] };
      }
      return job;
    }));
  };

  const handleAddInventoryItem = (item: InventoryItem) => {
    setInventoryItems(prev => [item, ...prev]);
  };

  const handleGenerateInvoice = (jobId: string) => {
    const job = serviceJobs.find(j => j.id === jobId);
    if (!job) return;

    // Avoid duplicate invoice issuance
    const alreadyIssued = invoices.some(i => i.jobId === jobId);
    if (alreadyIssued) return;

    const invoiceVeh = vehicles.find(v => v.id === job.vehicleId);
    const invoiceClient = users.find(u => u.id === job.clientId);

    // Calculate subtotal from parts and labor
    const partsVal = job.parts.reduce((acc, curr) => acc + (curr.sellPrice * curr.quantity), 0);
    const laborVal = job.labor.reduce((acc, curr) => acc + (curr.hourlyRate * curr.hoursSpent), 0);
    const subtotal = partsVal + laborVal;

    // TVA 20% standard Republica Moldova (municipiul Ungheni)
    const vatRate = 20;
    const vatAmount = (subtotal * vatRate) / 100;
    const total = subtotal + vatAmount;

    // generate line details for printing
    const invoiceItems = [
      ...job.parts.map(p => ({
        description: `Piesă: ${p.name} (OEM: ${p.oemCode})`,
        quantity: p.quantity,
        unitPrice: p.sellPrice,
        total: p.sellPrice * p.quantity
      })),
      ...job.labor.map(l => ({
        description: `Manoperă: ${l.description}`,
        quantity: l.hoursSpent,
        unitPrice: l.hourlyRate,
        total: l.hourlyRate * l.hoursSpent
      }))
    ];

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      jobId: jobId,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 14 days due
      clientId: job.clientId,
      clientName: invoiceClient?.name || "Client autoservice",
      clientPhone: invoiceClient?.phone || "0722",
      vehicleDetails: invoiceVeh ? `${invoiceVeh.brand} ${invoiceVeh.model} (${invoiceVeh.licensePlate})` : "General",
      items: invoiceItems,
      subtotal: subtotal,
      vatRate: vatRate,
      vatAmount: vatAmount,
      total: total,
      isPaid: false
    };

    setInvoices(prev => [newInvoice, ...prev]);
  };

  const handleUpdateInvoicePayment = (invoiceId: string, isPaid: boolean, method?: "Card" | "Cash" | "OP") => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          isPaid: isPaid,
          paymentDate: isPaid ? new Date().toISOString().split("T")[0] : undefined,
          paymentMethod: method
        };
      }
      return inv;
    }));
  };

  const handleAddExpense = (expense: Omit<Expense, "id">) => {
    const newExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast("Cheltuială înregistrată cu succes în registrul contabil.", "success");
  };

  const handleAddStockMovement = (mov: Omit<StockMovement, "id">) => {
    const newMovement: StockMovement = {
      ...mov,
      id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setStockMovements(prev => [newMovement, ...prev]);
  };

  // MAINTENANCE HANDLERS
  const handleExportTable = useCallback((table: string) => {
    let dataToExport;
    switch(table) {
      case "users": dataToExport = users; break;
      case "vehicles": dataToExport = vehicles; break;
      case "appointments": dataToExport = appointments; break;
      case "serviceJobs": dataToExport = serviceJobs; break;
      case "inventory": dataToExport = inventoryItems; break;
      case "invoices": dataToExport = invoices; break;
      default: return;
    }
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `autobox_${table}_backup_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`Export reușit pentru tabela: ${table}`, "success");
  }, [users, vehicles, appointments, serviceJobs, inventoryItems, invoices, showToast]);

  const handleImportTable = useCallback((table: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (!Array.isArray(importedData)) throw new Error("Formatul trebuie să fie un tablou (Array).");
        
        switch(table) {
          case "users": setUsers(importedData); break;
          case "vehicles": setVehicles(importedData); break;
          case "appointments": setAppointments(importedData); break;
          case "serviceJobs": setServiceJobs(importedData); break;
          case "inventory": setInventoryItems(importedData); break;
          case "invoices": setInvoices(importedData); break;
        }
        showToast(`Restaurare reușită pentru: ${table}`, "success");
      } catch (err) {
        showToast("Eroare la import! JSON invalid sau format greșit.", "info");
      }
    };
    reader.readAsText(file);
  }, [showToast]);

  const handleDeleteAllDatabase = useCallback(() => {
    setConfirm({
      title: "Ștergere Integrală",
      message: "Sunteți sigur că doriți să ștergeți TOATE datele din baza de date (cu excepția contului de proprietar)? Această acțiune este ireversibilă.",
      onConfirm: () => {
        clearStorage(["users", "vehicles", "appointments", "serviceJobs", "inventoryItems", "invoices"]);
        const owner = users.find(u => u.role === UserRole.OWNER);
        setUsers(owner ? [owner] : []);
        setVehicles([]);
        setAppointments([]);
        setServiceJobs([]);
        setInventoryItems([]);
        setInvoices([]);
        showToast("Toate datele (cu excepția proprietarului) au fost șterse.", "success");
      }
    });
  }, [users, showToast]);

  const handleDeleteTable = useCallback((table: string) => {
    setConfirm({
      title: `Resetare ${table}`,
      message: `Sunteți sigur că doriți să ștergeți TOATE datele din tabela ${table}? Această acțiune este ireversibilă.`,
      onConfirm: () => {
        switch(table) {
          case "users": 
            const owner = users.find(u => u.role === UserRole.OWNER);
            setUsers(owner ? [owner] : []); 
            break;
          case "vehicles": setVehicles([]); break;
          case "appointments": setAppointments([]); break;
          case "serviceJobs": setServiceJobs([]); break;
          case "inventory": setInventoryItems([]); break;
          case "invoices": setInvoices([]); break;
        }
        showToast(`Tabela ${table} a fost resetată.`, "info");
      }
    });
  }, [users, showToast]);

  return (
    <div id="application-layout-wrapper" className="min-h-screen bg-[#F2F2F7] text-[#1D1D1F] antialiased font-sans flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      
        {/* Global Confirmation Modal */}
        {confirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirm(null)} />
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10 transition-all">
              <h2 className="text-xl font-bold text-[#1D1D1F]">{confirm.title}</h2>
              <p className="text-sm text-[#86868B] mt-2">{confirm.message}</p>
              <div className="flex gap-3 mt-8">
                <button
                   onClick={() => setConfirm(null)}
                   className="flex-1 px-4 py-3 bg-[#F2F2F7] rounded-xl text-sm font-bold text-[#1D1D1F] hover:bg-[#E9E9EB]"
                >
                  Anulează
                </button>
                <button
                   onClick={() => {
                     confirm.onConfirm();
                     setConfirm(null);
                   }}
                   className="flex-1 px-4 py-3 bg-rose-600 rounded-xl text-sm font-bold text-white hover:bg-rose-700"
                >
                  Confirmă
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Top Header Bar: One UI 8 Aesthetic */}
      <header className="bg-white border-b border-[#E9E9EB] sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col lg:flex-row justify-between items-center gap-4">
          
          {/* Logo & Brand description */}
          <div 
            onClick={() => {
              if (currentUser) {
                navigateTo("client");
                setClientActiveTab("home");
              } else {
                navigateTo("landing");
              }
            }}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#034EA2] text-white flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(3,78,162,0.4)] group-hover:scale-105 transition-all">
              <Wrench className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1D1D1F] text-xl tracking-tighter">AutoBOX<span className="text-[#034EA2]">.</span></span>
                <span className="text-[9px] font-bold bg-[#F2F2F7] text-[#86868B] px-3 py-1 rounded-full uppercase tracking-normal">
                  UNGHENI
                </span>
              </div>
              <p className="text-[10px] text-[#86868B] font-bold tracking-tight mt-0.5 opacity-70">Sistem Management Tehnic Integrat</p>
            </div>
          </div>

          {/* Navigation Controls: Clean Rounded Design */}
          {currentUser && (
            <nav className="flex items-center bg-[#F2F2F7] p-1 rounded-lg border border-[#E9E9EB]">
              {(currentUser.role !== UserRole.CLIENT || isOwnerModeActive) && (
                <button
                  id="view-admin-erp-btn"
                  onClick={() => navigateTo("admin")}
                  className={`px-3 py-2 text-[11px] font-bold uppercase tracking-normal rounded-md flex items-center gap-2 transition-all cursor-pointer ${
                    activeView === "admin" ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#86868B] hover:text-[#1D1D1F]"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  ERP Portal
                </button>
              )}

              {isOwnerModeActive && (
                <button
                  id="view-database-schema-btn"
                  onClick={() => navigateTo("schema")}
                  className={`px-3 py-2 text-[11px] font-bold uppercase tracking-normal rounded-md flex items-center gap-2 transition-all cursor-pointer ${
                    activeView === "schema" ? "bg-white text-[#034EA2] shadow-sm" : "text-[#86868B] hover:text-[#1D1D1F]"
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  SCHEMA
                </button>
              )}
            </nav>
          )}

          {/* Header Controls */}
          <div className="flex items-center gap-4 relative">
            {currentUser ? (
              <div className="flex items-center gap-3 flex-wrap justify-end">
                
                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      navigateTo("client");
                      setClientActiveTab("book-wizard");
                    }}
                    className="w-9 h-9 bg-[#034EA2] text-white rounded-lg flex items-center justify-center hover:bg-[#1D1D1F] transition-all shadow-[0_10px_20px_-8px_rgba(3,78,162,0.3)] active:scale-90 group border-none cursor-pointer"
                    title="Programare Nouă"
                  >
                    <Plus className="w-6 h-6" strokeWidth={3} />
                  </button>

                  <div className="relative" ref={notificationsRef}>
                    <button 
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className={`w-9 h-9 rounded-lg transition-all cursor-pointer relative flex items-center justify-center ${
                        isNotificationsOpen || unreadCount > 0 
                          ? "bg-[#E8F0FE] text-[#034EA2]" 
                          : "bg-[#F2F2F7] text-[#86868B] hover:text-[#1D1D1F]"
                      }`}
                    >
                      <Bell className={`w-6 h-6 ${unreadCount > 0 ? "animate-bounce" : ""}`} />
                      {unreadCount > 0 && (
                        <span className="absolute top-3 right-3 w-4 h-4 bg-[#FF3B30] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {isNotificationsOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.95 }}
                          className="absolute right-0 top-full mt-6 w-[420px] bg-white rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-[#E9E9EB] z-50 overflow-hidden origin-top-right"
                        >
                          <div className="p-4 flex justify-between items-center bg-[#F2F2F7]">
                            <h3 className="font-bold text-sm uppercase tracking-normal text-[#1D1D1F]">Notificări</h3>
                            <button 
                              onClick={() => {
                                setNotifications(prev => prev.map(n => {
                                  const isUserNotif = n.userId === currentUser?.id || (currentUser?.role === UserRole.OWNER && n.userId === "u-owner");
                                  return isUserNotif ? { ...n, isRead: true } : n;
                                }));
                                showToast("Toate notificările au fost marcate ca citite.", "success");
                              }}
                              className="text-[11px] font-bold text-[#034EA2] hover:text-[#1D1D1F] transition-all border-none bg-transparent cursor-pointer uppercase tracking-normal"
                            >
                              Citește tot
                            </button>
                          </div>
                          
                          <div className="max-h-[500px] overflow-y-auto p-4 space-y-2">
                            {userNotifications.length === 0 ? (
                              <div className="p-20 text-center space-y-6">
                                <div className="w-10 h-10 bg-[#F2F2F7] rounded-xl flex items-center justify-center mx-auto text-[#86868B]">
                                  <Bell className="w-10 h-10 opacity-30" />
                                </div>
                                <p className="text-sm font-bold text-[#86868B]">Nicio notificare vizibilă</p>
                              </div>
                            ) : (
                              userNotifications.slice(0, 5).map(n => (
                                <div 
                                  key={n.id} 
                                  onClick={() => { handleMarkAsRead(n.id); setIsNotificationsOpen(false); }}
                                  className={`p-6 rounded-xl transition-all cursor-pointer text-left group ${!n.isRead ? "bg-[#E8F0FE]/40" : "hover:bg-[#F2F2F7]"}`}
                                >
                                  <div className="flex gap-6">
                                    <div className={`w-3 h-3 rounded-full mt-2 shrink-0 ${
                                      n.type === "success" ? "bg-[#34C759]" :
                                      n.type === "warning" ? "bg-[#FFCC00]" :
                                      n.type === "alert" ? "bg-[#FF3B30]" :
                                      "bg-[#034EA2]"
                                    }`} />
                                    <div className="space-y-2 flex-1">
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-base text-[#1D1D1F] tracking-tight leading-tight">{n.title}</h4>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteNotification(n.id);
                                          }}
                                          className="p-2 hover:bg-[#FF3B30] hover:text-white rounded-full text-[#86868B] transition-all scale-75 opacity-0 group-hover:opacity-100"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                      <p className="text-sm text-[#86868B] font-medium leading-relaxed">{n.message}</p>
                                      <p className="text-[10px] font-bold text-[#86868B] opacity-50 uppercase tracking-normal pt-2">
                                        {new Date(n.date).toLocaleDateString("ro-RO")}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-4 bg-[#F2F2F7] hover:bg-[#E9E9EB] p-2 pr-6 rounded-xl cursor-pointer transition-all active:scale-95 border border-[#E9E9EB]"
                  >
                    <img 
                      src={currentUser.avatarUrl || getRoleAvatar(currentUser.role)} 
                      referrerPolicy="no-referrer" 
                      alt={currentUser.name} 
                      className="w-11 h-11 rounded-lg bg-white object-cover shrink-0 border border-white shadow-sm" 
                    />
                    <div className="text-left hidden md:block">
                      <h6 className="text-sm font-bold text-[#1D1D1F] leading-tight tracking-tight">
                        {currentUser.name}
                      </h6>
                      <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-normal mt-1">{currentUser.role}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#86868B] transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 top-full mt-4 w-72 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 p-3 border border-[#E9E9EB] origin-top-right"
                      >
                        <div className="px-6 py-5 border-b border-[#F2F2F7] mb-3">
                          <h6 className="text-base font-bold text-[#1D1D1F] tracking-tight">{currentUser.name}</h6>
                          <p className="text-xs font-bold text-[#86868B] truncate mt-1">{currentUser.email}</p>
                        </div>
                        
                        <div className="space-y-1">
                          {isOwnerModeActive && (
                            <button onClick={() => { navigateTo("control-panel"); setIsProfileMenuOpen(false); }} className="w-full text-left px-5 py-3.5 rounded-lg text-sm font-bold hover:bg-[#F2F2F7] text-[#1D1D1F] flex items-center gap-4 transition-colors">
                              <Shield className="w-5 h-5 text-[#034EA2]" />Panou Control
                            </button>
                          )}
                          <button 
                            onClick={() => { 
                              if (currentUser?.role === UserRole.CLIENT) {
                                setClientActiveTab("home");
                                navigateTo("client"); 
                              } else {
                                navigateTo("admin");
                              }
                              setIsProfileMenuOpen(false); 
                            }} 
                            className="w-full text-left px-5 py-3.5 rounded-lg text-sm font-bold hover:bg-[#F2F2F7] text-[#1D1D1F] flex items-center gap-4 transition-colors"
                          >
                            <Home className="w-5 h-5 text-[#86868B]" />Acasă
                          </button>

                          {currentUser && currentUser.role !== UserRole.CLIENT && (
                            <button 
                              onClick={() => { 
                                setSelectedEmployeeId(currentUser.id);
                                navigateTo("employee-record");
                                setIsProfileMenuOpen(false); 
                              }} 
                              className="w-full text-left px-5 py-3.5 rounded-lg text-sm font-bold hover:bg-blue-50 text-blue-700 flex items-center gap-4 transition-colors"
                            >
                              <Briefcase className="w-5 h-5 text-[#034EA2]" />Pagina Angajatului
                            </button>
                          )}
                          <hr className="my-2 border-[#F2F2F7]" />
                          <button 
                            onClick={() => {
                              setCurrentUser(null);
                              setIsOwnerModeActive(false);
                              navigateTo("landing");
                              setIsProfileMenuOpen(false);
                              showToast("Deconectare reușită (One UI Secure).", "success");
                            }} 
                            className="w-full text-left px-5 py-4 rounded-lg text-sm font-bold hover:bg-rose-50 text-rose-600 flex items-center gap-4 transition-colors"
                          >
                            <LogOut className="w-5 h-5" />Deconectare
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="relative" ref={unauthMenuRef}>
                <button 
                  onClick={() => setIsUnauthMenuOpen(!isUnauthMenuOpen)}
                  className="flex items-center gap-6 bg-[#F2F2F7] hover:bg-[#E9E9EB] p-2 pr-8 rounded-xl cursor-pointer transition-all active:scale-95 border border-[#E9E9EB]"
                >
                  <div className="w-12 h-12 rounded-[22px] bg-white flex items-center justify-center text-[#034EA2] shadow-sm border border-[#E9E9EB]">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-[#1D1D1F] uppercase tracking-normal hidden sm:block">Contul Meu</span>
                  <ChevronDown className={`w-4 h-4 text-[#86868B] transition-transform ${isUnauthMenuOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isUnauthMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-full mt-4 w-72 bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 p-3 border border-[#E9E9EB] origin-top-right"
                    >
                      <button 
                        onClick={() => { navigateTo("auth"); setAuthDefaultTab("login"); setIsUnauthMenuOpen(false); }} 
                        className="w-full text-left px-6 py-4.5 rounded-[22px] text-sm font-bold text-[#1D1D1F] hover:bg-[#F2F2F7] flex items-center gap-4 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-[14px] bg-[#E8F0FE] flex items-center justify-center">
                          <LogIn className="w-5 h-5 text-[#034EA2]" /> 
                        </div>
                        Autentificare
                      </button>
                      <button 
                        onClick={() => { navigateTo("auth"); setAuthDefaultTab("register"); setIsUnauthMenuOpen(false); }} 
                        className="w-full text-left px-6 py-4.5 rounded-[22px] text-sm font-bold text-[#1D1D1F] hover:bg-[#F2F2F7] flex items-center gap-4 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-[14px] bg-emerald-50 flex items-center justify-center">
                          <UserPlus className="w-5 h-5 text-emerald-600" /> 
                        </div>
                        Cont Nou
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-4 flex-1 w-full">
        {activeView === "landing" && (
          <LandingPage
            vehicles={vehicles}
            users={users}
            serviceTypes={serviceTypes}
            appointments={appointments}
            currentUser={currentUser}
            setActiveView={navigateTo}
            onLoginSuccess={(user, isOwner) => {
              setCurrentUser(user);
              if (isOwner) {
                setIsOwnerModeActive(true);
                navigateTo("admin");
                showToast("Acces supervizor administrativ activ. Bun venit, Stimate Director!", "success");
              } else {
                setIsOwnerModeActive(false);
                if (user.role === UserRole.CLIENT) {
                  setClientActiveTab("home");
                  setCurrentClientId(user.id);
                  navigateTo("client");
                } else {
                  navigateTo("admin");
                }
                showToast(`Bun venit în ecosistem, ${user.name}!`, "success");
              }
            }}
            onRegisterSuccess={(newUser, newVehicle) => {
              setUsers(prev => [...prev, newUser]);
              if (newVehicle) {
                setVehicles(prev => [...prev, newVehicle]);
              }
              setCurrentUser(newUser);
              setCurrentClientId(newUser.id);
              setClientActiveTab("home");
              navigateTo("client");
              showToast(`Cont creat cu succes pentru ${newUser.name}! Mașina dvs. a fost configurată în portal.`, "success");
            }}
            onNotify={showToast}
          />
        )}

        {activeView === "client" && (
          <ClientPortal
            users={visibleUsers}
            vehicles={vehicles}
            serviceTypes={serviceTypes}
            appointments={appointments}
            serviceJobs={serviceJobs}
            invoices={invoices}
            currentClient={activeClient}
            currentUser={currentUser}
            activeTab={clientActiveTab}
            onTabChange={setClientActiveTab}
            onAddAppointment={handleAddAppointment}
            onAddVehicle={handleAddVehicle}
            onNotify={showToast}
            setActiveView={navigateTo}
            onLoginSuccess={(user, isOwner) => {
              setCurrentUser(user);
              if (isOwner) {
                setIsOwnerModeActive(true);
                navigateTo("admin");
                showToast("Acces supervizor administrativ activ. Bun venit, Stimate Director!", "success");
              } else {
                setIsOwnerModeActive(false);
                if (user.role === UserRole.CLIENT) {
                  setClientActiveTab("home");
                  setCurrentClientId(user.id);
                  navigateTo("client");
                } else {
                  navigateTo("admin");
                }
                showToast(`Bun venit în ecosistem, ${user.name}!`, "success");
              }
            }}
            onRegisterSuccess={(newUser, newVehicle) => {
              setUsers(prev => [...prev, newUser]);
              if (newVehicle) {
                setVehicles(prev => [...prev, newVehicle]);
              }
              setCurrentUser(newUser);
              setCurrentClientId(newUser.id);
              setClientActiveTab("home");
              navigateTo("client");
              showToast(`Cont creat cu succes pentru ${newUser.name}! Mașina dvs. a fost configurată în portal.`, "success");
            }}
          />
        )}

        {activeView === "control-panel" && (
          <OwnerControlPanel
            setActiveView={navigateTo}
            onNotify={showToast}
            onBack={goBack}
          />
        )}
        
        {activeView === "admin" && (
          <AdminERP
            currentUser={currentUser}
            users={visibleUsers}
            vehicles={vehicles}
            serviceTypes={serviceTypes}
            appointments={appointments}
            serviceJobs={serviceJobs}
            inventoryItems={inventoryItems}
            suppliers={suppliers}
            timesheets={timesheets}
            invoices={invoices}
            expenses={expenses}
            stockMovements={stockMovements}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onCreateJobFromAppointment={handleCreateJobFromAppointment}
            onUpdateJobStatus={handleUpdateJobStatus}
            onAddJobCardPart={handleAddJobCardPart}
            onAddJobCardLabor={handleAddJobCardLabor}
            onAddDamagePhoto={handleAddDamagePhoto}
            onAddInventoryItem={handleAddInventoryItem}
            onAddVehicle={handleAddVehicle}
            onAddUser={handleAddUser}
            onAddTimesheet={handleAddTimesheet}
            onGenerateInvoice={handleGenerateInvoice}
            onUpdateInvoicePayment={handleUpdateInvoicePayment}
            onAddExpense={handleAddExpense}
            onAddStockMovement={handleAddStockMovement}
            onExport={handleExportTable}
            onImport={handleImportTable}
            onDelete={handleDeleteTable}
            onNotify={showToast}
            onBack={goBack}
            setConfirm={setConfirm}
            onSelectEmployee={(empId) => {
              setSelectedEmployeeId(empId);
              navigateTo("employee-record");
            }}
          />
        )}

        {activeView === "notifications" && (
          <NotificationsPage 
            notifications={userNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            onBack={goBack}
          />
        )}

        {activeView === "auth" && (
          <AuthPage
            users={users}
            onLoginSuccess={(user, isOwner) => {
              setCurrentUser(user);
              if (isOwner) {
                setIsOwnerModeActive(true);
                navigateTo("admin");
                showToast("Acces supervizor administrativ activ. Bun venit, Stimate Director!", "success");
              } else {
                setIsOwnerModeActive(false);
                if (user.role === UserRole.CLIENT) {
                  setClientActiveTab("home");
                  setCurrentClientId(user.id);
                  navigateTo("client");
                } else {
                  navigateTo("admin");
                }
                showToast(`Bun venit în ecosistem, ${user.name}!`, "success");
              }
            }}
            onRegisterSuccess={(newUser, newVehicle) => {
              setUsers(prev => [...prev, newUser]);
              if (newVehicle) {
                setVehicles(prev => [...prev, newVehicle]);
              }
              setCurrentUser(newUser);
              setCurrentClientId(newUser.id);
              setClientActiveTab("home");
              navigateTo("client");
              showToast(`Cont creat cu succes pentru ${newUser.name}! Mașina dvs. a fost configurată în portal.`, "success");
            }}
            onNotify={showToast}
            defaultTab={authDefaultTab}
            onBack={goBack}
          />
        )}

        {activeView === "maintenance" && (
          <MaintenancePage
            onBack={goBack}
            data={{
              users,
              vehicles,
              appointments,
              serviceJobs,
              inventoryItems,
              invoices
            }}
            actions={{
              onExport: handleExportTable,
              onImport: handleImportTable,
              onDelete: handleDeleteTable,
              onDeleteAll: handleDeleteAllDatabase
            }}
          />
        )}

        {activeView === "clients-list" && (
          <ClientsManagement 
            users={users}
            vehicles={vehicles}
            onBack={goBack}
          />
        )}

        {activeView === "employees-list" && (
          <EmployeesManagement 
            users={users}
            timesheets={timesheets}
            onBack={goBack}
            onSelectEmployee={(empId) => {
              setSelectedEmployeeId(empId);
              navigateTo("employee-record");
            }}
          />
        )}

        {activeView === "employee-record" && (
          <EmployeeSheet 
            employeeId={selectedEmployeeId}
            users={users}
            serviceJobs={serviceJobs}
            timesheets={timesheets}
            onAddTimesheet={handleAddTimesheet}
            onBack={goBack}
            onNotify={showToast}
            currentUser={currentUser}
          />
        )}

        {activeView === "services-list" && (
          <ServicesManagement 
            serviceTypes={serviceTypes}
            onBack={goBack}
          />
        )}

        {activeView === "inventory-list" && (
          <InventoryManagement 
            inventory={inventoryItems}
            suppliers={suppliers}
            onBack={goBack}
          />
        )}

        {activeView === "services-catalog" && (
          <ServicesCatalog 
            services={serviceTypes}
            onBack={goBack}
          />
        )}

        {activeView === "schema" && (
          isOwnerModeActive ? (
            <SchemaExplorer
              onNotify={showToast}
              users={users}
              setUsers={setUsers}
              vehicles={vehicles}
              setVehicles={setVehicles}
              appointments={appointments}
              setAppointments={setAppointments}
              serviceJobs={serviceJobs}
              setServiceJobs={setServiceJobs}
              inventoryItems={inventoryItems}
              setInventoryItems={setInventoryItems}
              serviceTypes={serviceTypes}
              timesheets={timesheets}
              setTimesheets={setTimesheets}
              invoices={invoices}
              setInvoices={setInvoices}
              suppliers={suppliers}
              setSuppliers={setSuppliers}
              currentClientId={currentClientId}
              setCurrentClientId={setCurrentClientId}
              setActiveView={navigateTo}
              onBack={goBack}
              setConfirm={setConfirm}
            />
          ) : (
            <div className="max-w-md mx-auto my-12 bg-white p-4 rounded-2xl border border-rose-150 shadow-md space-y-6 text-center animate-in fade-in slide-in-from-bottom duration-300">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                <Shield className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-950 text-md tracking-tight">Acces Supervizor Necesar</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Vizualizarea și configurarea schemelor bazelor de date este strict restricționată. Te rugăm să te conectezi ca **Supervizor** pentru a vizualiza și edita tabelele sistemului.
                </p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const cleanUser = loginUsername.trim().toLowerCase();
                if ((cleanUser === "basile" || cleanUser === "basile@autoservice.md") && loginPassword === "franta05") {
                  setIsOwnerModeActive(true);
                  showToast("Autentificare de securitate reușită. Modul Administrare Principală activ.", "success");
                } else {
                  setLoginError("Credențiale de acces incorecte! Conexiune securizată refuzată.");
                }
              }} className="space-y-4 text-left">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Nume sau Email Administrator</label>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={e => { setLoginUsername(e.target.value); setLoginError(""); }}
                    className="w-full bg-slate-50 border border-[#eef1f6] p-3 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                    placeholder="Introduceți cont supervizor administrator..."
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Cheie de Securitate</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }}
                    className="w-full bg-slate-50 border border-[#eef1f6] p-3 rounded-2xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                    placeholder="••••••••"
                  />
                </div>
                {loginError && (
                  <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-150 leading-relaxed">
                    ⚠️ {loginError}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold p-3.5 rounded-2xl text-xs transition-all tracking-wide shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  CONECTARE & ACTIVARE MOD SUPERVIZOR
                </button>
              </form>
            </div>
          )
        )}
      </main>

      {/* Absolute High-Craftsmanship Owner Login Modal */}
      {isLoginModalOpen && (
        <div id="login-modal-overlay" className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#eef1f6] shadow-2xl max-w-sm w-full p-6 space-y-4 relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-[#f4f6fa]">
              <h3 className="font-extrabold text-xs uppercase tracking-normal text-slate-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-600 animate-pulse" />
                Autentificare Securizată Supervizor
              </h3>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-gray-400 hover:text-gray-950 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const cleanUser = loginUsername.trim().toLowerCase();
                if ((cleanUser === "basile" || cleanUser === "basile@autoservice.md") && loginPassword === "franta05") {
                  setIsOwnerModeActive(true);
                  navigateTo("schema");
                  setIsLoginModalOpen(false);
                  showToast("Autentificare de securitate reușită. Modul Administrare Principală activ.", "success");
                } else {
                  setLoginError("Nume cont sau parolă incorecte!");
                }
              }}
              className="space-y-4 text-xs text-left"
            >
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Cont utilizator supervizor (nume sau email ex: director)</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={e => { setLoginUsername(e.target.value); setLoginError(""); }}
                  className="w-full bg-[#f4f6fa] border border-[#eef1f6] p-3 rounded-2xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Introduceți numele de cont..."
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Cheie secretă</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }}
                  className="w-full bg-[#f4f6fa] border border-[#eef1f6] p-3 rounded-2xl text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="••••••••"
                />
              </div>
              {loginError && (
                <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-150 p-2.5 rounded-2xl leading-relaxed">
                  ⚠️ {loginError}
                </p>
              )}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(false)}
                  className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-2xl hover:bg-gray-50 cursor-pointer text-xs"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer text-xs"
                >
                  Autentificare
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Styled toast notification component */}
      {toast && (
        <div 
          id="global-toast-notification" 
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 p-5 rounded-lg shadow-2xl flex items-center gap-4 min-w-[320px] max-w-md transition-all duration-300 transform scale-100 border ${
            toast.type === "success" 
              ? "bg-[#1D1D1F] text-white border-[#E9E9EB]/10" 
              : "bg-[#034EA2] text-white border-white/10"
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/20 text-white"
          }`}>
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
          <span className="text-[13px] font-bold leading-tight tracking-tight">{toast.message}</span>
        </div>
      )}

      {/* Human and Humble Page Footer */}
      <footer className="bg-white border-t border-[#E9E9EB] py-5 text-center text-[11px] text-[#86868B] font-bold uppercase tracking-normal">
        <p>© 2026 AutoBOX Ecosystem • Municipiul Ungheni</p>
        <p className="mt-2 text-[#034EA2]/60">Sistem Relational de Gestiune Tehnică v8.0</p>
      </footer>

      <AIChatBot 
        userId={currentUser?.id}
        onBookAppointment={(data) => {
          if (!currentUser) {
            setAuthDefaultTab("login");
            navigateTo("auth");
            showToast("Te rugăm să te autentifici pentru a finaliza programarea.", "info");
            return;
          }
          // Navigate to client booking tab
          setClientActiveTab("book-wizard");
          navigateTo("client");
          showToast(`Am preluat solicitarea: ${data.notes || "Pregătit pentru rezervare"}. Finalizează selecția în Expert Wizard.`, "success");
        }}
      />
    </div>
  );
}
