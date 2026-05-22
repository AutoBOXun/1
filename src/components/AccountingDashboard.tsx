import React, { useState, useMemo } from "react";
import { Invoice, ServiceJob, User, Expense, UserRole, Vehicle, JobStatus } from "../types";
import InvoiceDocument from "./InvoiceDocument";
import { getEquivalentProfile } from "../utils/rbac";
import { 
  DollarSign, TrendingUp, TrendingDown, ClipboardList, AlertCircle, FileText, 
  CheckCircle2, XCircle, Calendar, PlusCircle, Scale, Coins, Wallet, Landmark,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Tag, Download, Printer, ShieldCheck, Activity, Search, Filter, History, Trash2, ArrowRight, Car
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AccountingDashboardProps {
  invoices: Invoice[];
  serviceJobs: ServiceJob[];
  users: User[];
  vehicles: Vehicle[];
  expenses?: Expense[];
  onUpdateInvoicePayment: (invoiceId: string, isPaid: boolean, method?: "Card" | "Cash" | "OP") => void;
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  onGenerateInvoice: (jobId: string) => void;
  onNotify: (msg: string, type?: "success" | "info") => void;
  onSelectJob?: (jobId: string) => void;
  hideHeader?: boolean;
}

export default function AccountingDashboard({
  invoices,
  serviceJobs,
  users,
  vehicles,
  expenses = [],
  onUpdateInvoicePayment,
  onAddExpense,
  onGenerateInvoice,
  onNotify,
  onSelectJob,
  hideHeader = false
}: AccountingDashboardProps) {
  // Tabs for the accounting view
  const [activeView, setActiveView] = useState<"invoices" | "expenses" | "reports" | "pending">("invoices");

  // Filters state for Invoices
  const [filterPaid, setFilterPaid] = useState<"all" | "paid" | "unpaid">("all");
  const [methodFilter, setMethodFilter] = useState<"all" | "Card" | "Cash" | "OP">("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Filters state for Expenses
  const [expenseFilterCat, setExpenseFilterCat] = useState<string>("all");

  // Expense Form State
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpCat, setNewExpCat] = useState<Expense["category"]>("Diverse");
  const [newExpDesc, setNewExpDesc] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [newExpDate, setNewExpDate] = useState(new Date().toISOString().split("T")[0]);
  const [newExpPaid, setNewExpPaid] = useState<"Paid" | "Pending">("Paid");

  // Uninvoiced Jobs
  const uninvoicedJobs = useMemo(() => {
    const invoicedJobIds = new Set(invoices.map(i => i.jobId));
    return serviceJobs.filter(j => 
      (j.status === JobStatus.FINISHED || j.status === JobStatus.READY_FOR_DELIVERY) && 
      !invoicedJobIds.has(j.id)
    );
  }, [serviceJobs, invoices]);

  // Sum valuations calculated via useMemo for performance
  const stats = useMemo(() => {
    const totalRevenue = invoices.reduce((acc, curr) => acc + curr.total, 0);
    const totalPaidRevenue = invoices.filter(i => i.isPaid).reduce((acc, curr) => acc + curr.total, 0);
    const totalUnpaidRevenue = invoices.filter(i => !i.isPaid).reduce((acc, curr) => acc + curr.total, 0);
    const totalVatCalculated = invoices.reduce((acc, curr) => acc + curr.vatAmount, 0);
    
    // Dynamic payroll expenses calculation (Base salary + commissions for staff)
    const staff = users.filter(u => u.role !== UserRole.CLIENT && u.role !== UserRole.OWNER);
    const totalBaseSalary = staff.reduce((sum, u) => {
      const profile = getEquivalentProfile(u.title || u.role);
      return sum + profile.baseSalaryMDL;
    }, 0);

    let totalCommissions = 0;
    serviceJobs.forEach(job => {
      job.labor.forEach(l => {
        const cost = l.hourlyRate * l.hoursSpent;
        totalCommissions += (cost * l.commissionRate) / 100;
      });
    });

    const totalPayroll = totalBaseSalary + totalCommissions;
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0) + totalPayroll;
    const netProfit = totalPaidRevenue - totalExpenses;
    
    return {
      totalRevenue,
      totalPaidRevenue,
      totalUnpaidRevenue,
      totalVatCalculated,
      totalExpenses,
      netProfit,
      totalPayroll
    };
  }, [invoices, expenses, users, serviceJobs]);

  // Filtered invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesPaid = 
      filterPaid === "all" ? true :
      filterPaid === "paid" ? inv.isPaid : !inv.isPaid;
    
    const matchesMethod = 
      methodFilter === "all" ? true :
      inv.paymentMethod === methodFilter;

    return matchesPaid && matchesMethod;
  });

  // Filtered expenses
  const filteredExpenses = expenses.filter(exp => {
    return expenseFilterCat === "all" ? true : exp.category === expenseFilterCat;
  });

  const handleTogglePaymentStatus = (invId: string, isCurrentlyPaid: boolean) => {
    const defaultMethod = isCurrentlyPaid ? undefined : "Card";
    onUpdateInvoicePayment(invId, !isCurrentlyPaid, defaultMethod);
    onNotify(
      `Factura ${invId} a fost marcată ca fiind ${!isCurrentlyPaid ? "ACHITATĂ" : "NEPLĂTITĂ"} cu succes!`,
      "success"
    );
  };

  const handleSubmitExpense = () => {
    if (!newExpDesc || !newExpAmount) {
      onNotify("Te rugăm să completezi descrierea și suma!", "info");
      return;
    }
    onAddExpense({
      category: newExpCat,
      description: newExpDesc,
      amount: parseFloat(newExpAmount),
      date: newExpDate,
      paymentStatus: newExpPaid,
    });
    setShowExpenseForm(false);
    setNewExpDesc("");
    setNewExpAmount("");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <AnimatePresence>
        {selectedInvoice && (
          <InvoiceDocument 
            invoice={selectedInvoice} 
            onClose={() => setSelectedInvoice(null)} 
          />
        )}
      </AnimatePresence>

      {/* 1. Monumental Financial Summary Banner */}
      {!hideHeader && (
        <div className="bg-[#1D1D1F] text-white rounded-2xl p-6 md:p-4 border border-[#E9E9EB] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(3,78,162,0.15),transparent_70%)] pointer-events-none"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[22px] bg-[#034EA2] flex items-center justify-center shadow-2xl shadow-blue-900/50">
                    <Landmark className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight leading-none">Finanțe & Gestiune.</h2>
                    <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mt-2">Centralizator Fiscal Automatizat</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  {[
                    { id: "invoices", label: "Facturare", icon: FileText },
                    { id: "pending", label: `Nefacturate (${uninvoicedJobs.length})`, icon: ClipboardList },
                    { id: "expenses", label: "Cheltuieli", icon: TrendingDown },
                    { id: "reports", label: "Rapoarte", icon: BarChart3 }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveView(tab.id as any)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-normal transition-all cursor-pointer border ${
                        activeView === tab.id ? "bg-white text-[#1D1D1F] shadow-xl shadow-white/5 border-white" : "bg-white/5 text-white/50 border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-3xl rounded-2xl p-6 border border-white/5 lg:min-w-[400px] flex justify-between items-center group/cash active:scale-95 transition-all cursor-pointer">
                 <div className="space-y-1">
                    <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Încasări Reale</p>
                    <h3 className="text-xl font-bold text-emerald-400 tracking-tighter leading-none">
                      {stats.totalPaidRevenue.toLocaleString()}
                      <span className="text-sm font-normal text-zinc-500 ml-2">MDL</span>
                    </h3>
                 </div>
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-emerald-400">
                    <TrendingUp className="w-8 h-8" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Financial KPI Bento Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
         {[
           { label: "Venit Prognozat", val: stats.totalRevenue, icon: DollarSign, color: "text-[#034EA2]", bg: "bg-blue-50", sub: "Total devize închise" },
           { label: "Opex (Cheltuieli)", val: stats.totalExpenses, icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-50", sub: "Costuri operare atelier" },
           { label: "Taxe & TVA", val: stats.totalVatCalculated, icon: PieChart, color: "text-amber-500", bg: "bg-amber-50", sub: "Datorie Buget (20%)" },
           { label: "Profitabilitate", val: stats.netProfit, icon: Scale, color: "text-emerald-500", bg: "bg-emerald-50", sub: "Cashflow Minus Costuri" }
         ].map((kpi, i) => (
           <div key={i} className="bg-white border border-[#E9E9EB] rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
             <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                   <kpi.icon className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F2F2F7] rounded-full text-xs font-bold text-[#1D1D1F] uppercase tracking-normal">
                   <Activity className="w-3 h-3 text-[#034EA2]" /> Real-time
                </div>
             </div>
             <div>
                <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal mb-2">{kpi.label}</p>
                <h4 className={`text-xl font-bold tracking-tighter leading-none ${kpi.color}`}>
                   {kpi.val.toLocaleString()} 
                   <span className="text-xs items-baseline font-normal ml-1 opacity-40">MDL</span>
                </h4>
                <p className="text-xs font-bold text-[#86868B] mt-6 flex items-center gap-2 uppercase tracking-normal opacity-60">
                   <CheckCircle2 className="w-3.5 h-3.5 opacity-40" />
                   {kpi.sub}
                </p>
             </div>
           </div>
         ))}
      </div>

      {/* 3. Main Operational Views */}
      <AnimatePresence mode="wait">
        
        {/* VIEW: INVOICES (Regisru Facturi) */}
        {activeView === "invoices" && (
          <motion.div 
            key="invoices"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-[#E9E9EB] rounded-2xl overflow-hidden shadow-sm"
          >
             <div className="p-6 border-b border-[#F2F2F7] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F0FE] text-[#034EA2] rounded-full text-xs font-semibold uppercase tracking-normal">
                     <History className="w-3.5 h-3.5" />
                     <span>Registru Central</span>
                  </div>
                   <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Flux Facturare.</h3>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                   <div className="bg-[#F2F2F7] p-2 rounded-xl flex border border-[#E9E9EB]">
                      {[
                        { id: "all", label: "Toate" },
                        { id: "paid", label: "Achitate" },
                        { id: "unpaid", label: "Restante" }
                      ].map(f => (
                        <button 
                          key={f.id}
                          onClick={() => setFilterPaid(f.id as any)}
                          className={`px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-normal transition-all cursor-pointer ${
                            filterPaid === f.id ? "bg-[#1D1D1F] text-white shadow-xl shadow-black/10" : "text-[#86868B] hover:text-[#1D1D1F]"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                   </div>
                   
                   <div className="relative group">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B] group-focus-within:text-[#034EA2] transition-colors" />
                      <input 
                        placeholder="Caută Client / Factură..." 
                        className="pl-16 pr-8 py-4 bg-[#F2F2F7] border border-[#E9E9EB] rounded-full text-xs font-bold text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-8 focus:ring-blue-50 transition-all shadow-sm"
                      />
                   </div>
                </div>
             </div>

             <div className="overflow-x-auto p-4 md:p-4 xl:p-6">
                <table className="w-full text-left min-w-[1000px]">
                   <thead>
                      <tr className="text-xs font-bold text-[#86868B] uppercase tracking-normal border-b border-[#F2F2F7]">
                         <th className="px-5 py-6">ID Fiscal</th>
                         <th className="px-5 py-6">Entitate / Vehicul</th>
                         <th className="px-5 py-6">Data Emiterii</th>
                         <th className="px-5 py-6 text-right">Debit</th>
                         <th className="px-5 py-6 text-center">Status Decontare</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#F2F2F7]">
                      {filteredInvoices.map((inv, idx) => (
                        <motion.tr 
                          key={inv.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group hover:bg-[#F2F2F7]/50 transition-colors"
                        >
                          <td className="px-5 py-4">
                             <div className="flex flex-col cursor-pointer group" onClick={() => setSelectedInvoice(inv)}>
                                <span className="font-bold font-mono text-xs text-[#034EA2] uppercase tracking-normal group-hover:underline">{inv.invoiceNumber}</span>
                                <span className="text-xs font-bold text-[#86868B] uppercase mt-1">FIȘA_{inv.id.split('-')[0]}</span>
                             </div>
                          </td>
                          <td className="px-5 py-4">
                             <p className="text-lg font-bold text-[#1D1D1F] tracking-tight group-hover:text-[#034EA2] transition-colors uppercase">{inv.clientName}</p>
                             <div className="flex items-center gap-2 text-xs font-bold text-[#86868B] uppercase tracking-normal mt-1">
                                <Car className="w-3.5 h-3.5 opacity-40" /> {inv.vehicleDetails}
                             </div>
                          </td>
                          <td className="px-5 py-4 text-xs font-mono text-[#86868B] uppercase">
                             <Calendar className="inline-block w-3.5 h-3.5 mr-2 opacity-50" /> {inv.issueDate}
                          </td>
                          <td className="px-5 py-4 text-right">
                             <p className="text-xl font-bold text-[#1D1D1F] tracking-tighter">
                                {inv.total.toLocaleString()}
                                <span className="text-xs ml-1 font-normal opacity-40">MDL</span>
                             </p>
                             <p className="text-xs font-bold text-blue-500/60 uppercase tracking-normal mt-1">TVA INCLUS 20%</p>
                          </td>
                          <td className="px-5 py-4">
                             <div className="flex items-center justify-center gap-4">
                                <button 
                                  onClick={() => handleTogglePaymentStatus(inv.id, inv.isPaid)}
                                  className={`px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-normal transition-all active:scale-95 shadow-sm border ${
                                    inv.isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                                  }`}
                                >
                                  {inv.isPaid ? "Achitată" : "Restantă"}
                                </button>
                                {inv.isPaid && (
                                  <div className="px-4 py-3 bg-[#F2F2F7] rounded-xl text-xs font-bold text-[#1D1D1F] uppercase tracking-normal border border-slate-200">
                                    {inv.paymentMethod || "Card"}
                                  </div>
                                )}
                             </div>
                          </td>
                        </motion.tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </motion.div>
        )}

        {/* VIEW: PENDING INVOICES (Generare Facturi) */}
        {activeView === "pending" && (
          <motion.div 
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-[#E9E9EB] rounded-2xl overflow-hidden shadow-sm"
          >
             <div className="p-6 border-b border-[#F2F2F7] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold uppercase tracking-normal">
                     <AlertCircle className="w-3.5 h-3.5" />
                     <span>Devize Finalizate</span>
                  </div>
                   <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Pregătire Facturare.</h3>
                </div>
                <div className="text-xs font-bold text-[#86868B] uppercase tracking-normal bg-[#F2F2F7] px-4 py-3 rounded-xl border border-[#E9E9EB]">
                   {uninvoicedJobs.length} LUCRĂRI ÎN AȘTEPTARE
                </div>
             </div>

             <div className="overflow-x-auto p-4 md:p-6">
                {uninvoicedJobs.length > 0 ? (
                  <table className="w-full text-left min-w-[900px]">
                     <thead>
                        <tr className="text-xs font-bold text-[#86868B] uppercase tracking-normal border-b border-[#F2F2F7]">
                           <th className="px-5 py-6">Referință Lucrare</th>
                           <th className="px-5 py-6">Client / Vehicul</th>
                           <th className="px-5 py-6">Data Finalizării</th>
                           <th className="px-5 py-6 text-right">Valoare Brută</th>
                           <th className="px-5 py-6 text-center">Acțiune</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#F2F2F7]">
                        {uninvoicedJobs.map((job, idx) => {
                          const client = users.find(u => u.id === job.clientId);
                          const veh = vehicles.find(v => v.id === job.vehicleId);
                          const partsTotal = job.parts.reduce((a, p) => a + (p.sellPrice * p.quantity), 0);
                          const laborTotal = job.labor.reduce((a, l) => a + (l.hourlyRate * l.hoursSpent), 0);
                          const total = (partsTotal + laborTotal) * 1.2; // Including 20% VAT
                          
                          return (
                            <motion.tr 
                              key={job.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="group hover:bg-[#F2F2F7]/50 transition-colors"
                            >
                              <td className="px-5 py-4">
                                 <div className="flex flex-col">
                                    <span className="font-bold font-mono text-xs text-[#034EA2] uppercase tracking-normal">FIȘĂ_{job.id.split('-')[0].toUpperCase()}</span>
                                    <span className="text-xs font-bold text-[#86868B] uppercase mt-1">Ref: {job.id}</span>
                                 </div>
                              </td>
                              <td className="px-5 py-4">
                                 <p className="font-bold text-[#1D1D1F] tracking-tight uppercase">{client?.name || "Client anonim"}</p>
                                 <div className="flex items-center gap-2 text-xs font-bold text-[#86868B] uppercase tracking-normal mt-1">
                                    <Car className="w-3.5 h-3.5 opacity-40" /> {veh ? `${veh.brand} ${veh.model} [${veh.licensePlate}]` : "Fără Vehicul"}
                                 </div>
                              </td>
                              <td className="px-5 py-4 text-xs font-mono text-[#86868B] uppercase">
                                 <Calendar className="inline-block w-3.5 h-3.5 mr-2 opacity-50" /> {job.realFinishDate || job.entryDate}
                              </td>
                              <td className="px-5 py-4 text-right">
                                 <p className="text-xl font-bold text-[#1D1D1F] tracking-tighter">
                                    {total.toLocaleString()}
                                    <span className="text-xs ml-1 font-normal opacity-40">MDL</span>
                                 </p>
                                 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-normal">GATA DE FACTURARE</p>
                              </td>
                              <td className="px-5 py-4">
                                 <div className="flex items-center justify-center gap-3">
                                    <button 
                                      onClick={() => onSelectJob && onSelectJob(job.id)}
                                      className="p-3 bg-white border border-[#E9E9EB] text-[#86868B] hover:text-[#034EA2] hover:bg-[#E8F0FE] rounded-xl transition-all"
                                      title="Vezi detalii"
                                    >
                                      <Search className="w-4 h-4" />
                                    </button>
                                    <button 
                                      onClick={() => {
                                        onGenerateInvoice(job.id);
                                        onNotify(`Factura pentru lucrarea ${job.id.split('-')[0].toUpperCase()} a fost generată!`, "success");
                                      }}
                                      className="flex items-center gap-2 px-5 py-3 bg-[#1D1D1F] hover:bg-[#034EA2] text-white rounded-xl text-xs font-bold uppercase tracking-normal transition-all active:scale-95 shadow-md"
                                    >
                                      <FileText className="w-4 h-4" />
                                      Generează Factură
                                    </button>
                                 </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                     </tbody>
                  </table>
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center space-y-6 text-center">
                     <div className="w-20 h-20 bg-[#F2F2F7] rounded-full flex items-center justify-center text-[#86868B]">
                        <CheckCircle2 className="w-10 h-10" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-lg font-bold text-[#1D1D1F] uppercase tracking-tight">Totul este la zi!</h4>
                        <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal max-w-sm">
                           Toate fișele service finalizate au fost facturate. Nu există devize în așteptare.
                        </p>
                     </div>
                  </div>
                )}
             </div>
          </motion.div>
        )}

        {/* VIEW: EXPENSES (Cheltuieli Operative) */}
        {activeView === "expenses" && (
           <motion.div 
            key="expenses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-[#E9E9EB] rounded-2xl overflow-hidden shadow-sm"
          >
             <div className="p-6 border-b border-[#F2F2F7] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-xs font-semibold uppercase tracking-normal">
                     <TrendingDown className="w-3.5 h-3.5" />
                     <span>OPEX Analytics</span>
                  </div>
                   <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Ieșiri de Numerar.</h3>
                </div>

                <div className="flex gap-6">
                   <select 
                     value={expenseFilterCat}
                     onChange={(e) => setExpenseFilterCat(e.target.value)}
                     className="px-4 py-4 bg-[#F2F2F7] border border-[#E9E9EB] rounded-full text-xs font-semibold uppercase tracking-normal outline-none cursor-pointer focus:bg-white shadow-sm"
                   >
                      <option value="all">Toate Direcțiile</option>
                      <option value="Piese">Piese de schimb</option>
                      <option value="Utilități">Utilități & Regie</option>
                      <option value="Salarii">Salarii Echipa</option>
                      <option value="Marketing">Marketing & Expansiune</option>
                   </select>
                   <button 
                    onClick={() => setShowExpenseForm(true)}
                    className="bg-[#1D1D1F] hover:bg-[#034EA2] text-white px-5 py-4 rounded-full font-bold text-xs uppercase tracking-normal flex items-center gap-3 shadow-xl transition-all active:scale-95"
                   >
                     <PlusCircle className="w-5 h-5" /> Adaugă Cheltuială
                   </button>
                </div>
             </div>

             <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar">
                {filteredExpenses.map((exp, idx) => (
                  <motion.div 
                    key={exp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-6 bg-[#F2F2F7] rounded-2xl border border-transparent hover:bg-white hover:border-rose-100 hover:shadow-2xl hover:shadow-rose-900/5 transition-all group flex flex-col md:flex-row justify-between items-center gap-6"
                  >
                     <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-[#E9E9EB] shadow-sm text-rose-500 group-hover:scale-110 transition-transform shrink-0">
                           <TrendingDown className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                           <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-white text-rose-600 rounded-lg text-xs font-semibold uppercase tracking-normal border border-[#E9E9EB] shadow-sm">{exp.category}</span>
                              <span className="text-xs font-mono font-bold text-[#86868B] uppercase tracking-normal">{exp.date}</span>
                           </div>
                           <h4 className="text-lg font-bold text-[#1D1D1F] tracking-tight uppercase leading-tight">{exp.description}</h4>
                        </div>
                     </div>
                     <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                           <p className="text-xl font-bold text-rose-600 tracking-tighter">-{exp.amount.toLocaleString()}</p>
                           <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal opacity-40">MDL Valuta</p>
                        </div>
                        <div className={`px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-normal border ${
                          exp.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}>
                           {exp.paymentStatus === "Paid" ? "Decontat" : "În Proces"}
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
           </motion.div>
        )}

        {/* VIEW: REPORTS & METRICS */}
        {activeView === "reports" && (
          <motion.div 
            key="reports"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-6"
          >
             {/* Expense Breakdown Card */}
             <div className="bg-white border border-[#E9E9EB] rounded-2xl p-6 lg:p-4 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Structură Costuri</p>
                      <h4 className="text-xl font-bold text-[#1D1D1F] tracking-tight">OPEX Analysis.</h4>
                   </div>
                   <div className="w-10 h-10 rounded-2xl bg-[#F2F2F7] flex items-center justify-center border border-[#E9E9EB] text-[#1D1D1F]">
                      <PieChart className="w-7 h-7" />
                   </div>
                </div>

                <div className="space-y-5 py-5">
                   {[
                     { label: "Piese & Logistica", amount: expenses.filter(e => e.category === "Piese").reduce((a,c)=>a+c.amount,0), color: "bg-[#034EA2]", shadow: "shadow-blue-200" },
                     { label: "Serviciu Echipa (Salarii & Comisioane)", amount: expenses.filter(e => e.category === "Salarii").reduce((a,c)=>a+c.amount,0) + stats.totalPayroll, color: "bg-emerald-500", shadow: "shadow-emerald-200" },
                     { label: "Regie & Utilități", amount: expenses.filter(e => e.category === "Utilități" || e.category === "Chirie").reduce((a,c)=>a+c.amount,0), color: "bg-amber-500", shadow: "shadow-amber-200" },
                     { label: "Marketing / Diverse", amount: expenses.filter(e => e.category === "Marketing" || e.category === "Diverse").reduce((a,c)=>a+c.amount,0), color: "bg-[#1D1D1F]", shadow: "shadow-zinc-300" }
                   ].map((cat, i) => {
                     const total = Math.max(1, stats.totalExpenses);
                     const perc = (cat.amount / total) * 100;
                     return (
                       <div key={i} className="space-y-3">
                          <div className="flex justify-between text-xs font-semibold uppercase tracking-normal">
                             <span className="text-[#86868B]">{cat.label}</span>
                             <span className="text-[#1D1D1F]">{cat.amount.toLocaleString()} MDL</span>
                          </div>
                          <div className="h-6 bg-[#F2F2F7] rounded-full overflow-hidden flex relative group cursor-help">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${perc}%` }}
                               transition={{ delay: 0.3 + i * 0.1, duration: 1.5, ease: "circOut" }}
                               className={`h-full ${cat.color} ${cat.shadow} shadow-lg relative`}
                             >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                             </motion.div>
                          </div>
                       </div>
                     );
                   })}
                </div>

                <div className="p-6 bg-[#1D1D1F] rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
                   <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-normal">Economic Health</p>
                      <h4 className="text-white text-lg font-bold uppercase tracking-tight">{(stats.totalExpenses / Math.max(1, stats.totalRevenue)).toFixed(2)}x Burn Rate</h4>
                   </div>
                   <button className="bg-[#034EA2] text-white px-4 py-4 rounded-full font-bold text-xs uppercase tracking-normal shadow-xl shadow-blue-900/50 flex items-center gap-2 active:scale-95 transition-all">
                      <Download className="w-4 h-4" /> Exportă Raport
                   </button>
                </div>
             </div>

             {/* Profitability Center */}
             <div className="bg-[#1D1D1F] text-white rounded-2xl p-6 lg:p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.08),transparent_60%)] pointer-events-none"></div>
                
                <div className="space-y-5 relative z-10">
                   <div className="flex justify-between items-center">
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-emerald-400 uppercase tracking-normal">Consolă Financiară</p>
                         <h4 className="text-xl font-bold tracking-tight">Net Profitability.</h4>
                      </div>
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-emerald-400 group-hover:rotate-12 transition-transform">
                         <ShieldCheck className="w-8 h-8" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-5 border-y border-white/5">
                      <div className="space-y-4 group/item">
                         <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Cifra de Afaceri</p>
                            <TrendingUp className="w-4 h-4 text-emerald-500 group-hover/item:-translate-y-1 transition-transform" />
                         </div>
                         <h5 className="text-xl font-bold tracking-tighter">+{stats.totalPaidRevenue.toLocaleString()} <span className="text-xs text-[#86868B]">MDL</span></h5>
                      </div>
                      <div className="space-y-4 group/item">
                         <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Datorii & Costuri</p>
                            <TrendingDown className="w-4 h-4 text-rose-500 group-hover/item:translate-y-1 transition-transform" />
                         </div>
                         <h5 className="text-xl font-bold tracking-tighter">-{stats.totalExpenses.toLocaleString()} <span className="text-xs text-[#86868B]">MDL</span></h5>
                      </div>
                   </div>
                </div>

                <div className="bg-[#034EA2] rounded-2xl p-6 md:p-4 text-center shadow-2xl shadow-blue-900/80 border border-white/10 relative overflow-hidden group/total active:scale-95 transition-all mt-10">
                   <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover/total:opacity-[0.03] transition-opacity"></div>
                   <p className="text-xs font-bold text-blue-100 uppercase tracking-normal mb-6">FONDURI DISPONIBILE</p>
                   <h2 className="text-5xl md:text-6xl font-bold text-white tracking-[-0.05em] mb-8 font-sans">
                      {stats.netProfit.toLocaleString()}
                      <span className="text-2xl text-blue-200 ml-4 font-normal">MDL</span>
                   </h2>
                   <div className="inline-flex items-center gap-3 px-4 py-3 bg-white/10 rounded-full border border-white/5 text-xs font-bold text-blue-50 uppercase tracking-normal backdrop-blur-md">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Rezumat Verificat de Inteligență Fiscală
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. EXPENSE MODAL OVERLAY */}
      <AnimatePresence>
        {showExpenseForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1F]/90 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, rotateX: 20 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 50, rotateX: 20 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 lg:p-4 space-y-6 overflow-hidden border border-white/20"
            >
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-[#F2F2F7] rounded-2xl flex items-center justify-center text-[#1D1D1F] border border-[#E9E9EB] shadow-sm">
                    <History className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Nou Debit.</h3>
                 <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal">Înregistrarea ieșirilor de capital din atelier</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-normal text-[#86868B] ml-4">Direcție Flux</label>
                    <select 
                      value={newExpCat}
                      onChange={(e) => setNewExpCat(e.target.value as any)}
                      className="w-full bg-[#F2F2F7] border border-[#E9E9EB] p-6 rounded-2xl text-xs font-semibold uppercase tracking-normal outline-none focus:bg-white focus:ring-8 focus:ring-blue-50 transition-all cursor-pointer shadow-inner"
                    >
                      <option value="Piese">Piese de schimb</option>
                      <option value="Utilități">Utilități & Regie</option>
                      <option value="Chirie">Chirie Locație</option>
                      <option value="Salarii">Salarii & Retribuții</option>
                      <option value="Marketing">Marketing / Web</option>
                      <option value="Diverse">Diverse Fluxuri</option>
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-normal text-[#86868B] ml-4">Data Validării</label>
                    <input 
                      type="date"
                      value={newExpDate}
                      onChange={(e) => setNewExpDate(e.target.value)}
                      className="w-full bg-[#F2F2F7] border border-[#E9E9EB] p-6 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-8 focus:ring-blue-50 transition-all shadow-inner"
                    />
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-xs font-semibold uppercase tracking-normal text-[#86868B] ml-4">Referință Tranzacție / Furnizor</label>
                 <input 
                   type="text"
                   value={newExpDesc}
                   onChange={(e) => setNewExpDesc(e.target.value)}
                   placeholder="Ex: Factură Premier Energy / Piese AutoDoc..."
                   className="w-full bg-[#F2F2F7] border border-[#E9E9EB] p-6 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-8 focus:ring-blue-50 transition-all shadow-inner placeholder-[#86868B]/40"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-normal text-[#86868B] ml-4">Cuantum (MDL)</label>
                    <input 
                      type="number"
                      value={newExpAmount}
                      onChange={(e) => setNewExpAmount(e.target.value)}
                      className="w-full bg-[#F2F2F7] border border-[#E9E9EB] p-6 rounded-2xl text-xl font-bold text-rose-600 outline-none focus:bg-white focus:ring-8 focus:ring-blue-50 transition-all shadow-inner"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-normal text-[#86868B] ml-4">Validare Plată</label>
                    <select 
                      value={newExpPaid}
                      onChange={(e) => setNewExpPaid(e.target.value as any)}
                      className="w-full bg-[#F2F2F7] border border-[#E9E9EB] p-6 rounded-2xl text-xs font-semibold uppercase tracking-normal outline-none focus:bg-white focus:ring-8 focus:ring-blue-50 transition-all cursor-pointer shadow-inner"
                    >
                      <option value="Paid">Executată / Achitată</option>
                      <option value="Pending">În Așteptare Decont</option>
                    </select>
                 </div>
              </div>

              <div className="flex gap-6 pt-10">
                 <button 
                  onClick={() => setShowExpenseForm(false)}
                  className="flex-1 px-5 py-5 bg-[#F2F2F7] text-[#1D1D1F] rounded-2xl font-bold text-xs uppercase tracking-normal hover:bg-gray-200 transition-all active:scale-95"
                 >
                   Anulează
                 </button>
                 <button 
                  onClick={handleSubmitExpense}
                  className="flex-1 px-5 py-5 bg-[#1D1D1F] text-white rounded-2xl font-bold text-xs uppercase tracking-normal shadow-2xl hover:bg-[#034EA2] transition-all active:scale-95"
                 >
                   Confirmă Debitarea
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
