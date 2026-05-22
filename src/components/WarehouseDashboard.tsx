import React, { useState } from "react";
import { InventoryItem, Supplier, StockMovement, User } from "../types";
import { 
  Warehouse, Plus, AlertTriangle, HelpCircle, Package, Layers, ShieldAlert,
  Search, CheckCircle2, RotateCcw, Truck, Bookmark, Barcode, DollarSign, Activity,
  History, ArrowUpRight, ArrowDownLeft, Clock
} from "lucide-react";

interface WarehouseDashboardProps {
  inventoryItems: InventoryItem[];
  suppliers: Supplier[];
  stockMovements?: StockMovement[];
  users?: User[];
  onAddInventoryItem: (item: InventoryItem) => void;
  onAddStockMovement: (movement: Omit<StockMovement, "id">) => void;
  onNotify: (msg: string, type?: "success" | "info") => void;
  hideHeader?: boolean;
}

export default function WarehouseDashboard({
  inventoryItems,
  suppliers,
  stockMovements = [],
  users = [],
  onAddInventoryItem,
  onAddStockMovement,
  onNotify,
  hideHeader = false
}: WarehouseDashboardProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "movements">("inventory");
  // Local state for add inventory form
  const [showForm, setShowForm] = useState(false);
  const [oem, setOem] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [buyPrice, setBuyPrice] = useState(50);
  const [sellPrice, setSellPrice] = useState(85);
  const [stock, setStock] = useState(15);
  const [minLevel, setMinLevel] = useState(5);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "");

  // Simulated Barcode Scanner Search
  const [scannedOem, setScannedOem] = useState("");
  const [scanResult, setScanResult] = useState<InventoryItem | null>(null);

  // Search Filter
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate stats
  const totalItemsCount = inventoryItems.length;
  const totalStockValue = inventoryItems.reduce((acc, curr) => acc + (curr.purchasePrice * curr.currentStock), 0);
  const lowStockCount = inventoryItems.filter(i => i.currentStock <= i.minStockLevel).length;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oem || !name || !brand) {
      onNotify("Te rugăm să completezi Codul OEM, Denumirea și Producătorul!", "info");
      return;
    }

    const newItemId = `inv-${Date.now()}`;
    const newItem: InventoryItem = {
      id: newItemId,
      oemCode: oem,
      aftermarketCode: `${oem}-AM`,
      name,
      brand,
      purchasePrice: buyPrice,
      sellPrice: sellPrice,
      currentStock: stock,
      minStockLevel: minLevel,
      supplierId: selectedSupplierId
    };

    onAddInventoryItem(newItem);

    // Log Stock Movement (IN)
    onAddStockMovement({
      itemId: newItemId,
      type: "IN",
      quantity: stock,
      reason: `Recepție inițială / Achiziție lot nou (${brand})`,
      date: new Date().toISOString().split("T")[0],
      userId: "u-owner"
    });

    onNotify(`Piesa "${name}" (Brand: ${brand}, OEM: ${oem}) a fost recepționată și plasată în Depozit!`, "success");

    // Clear form
    setOem("");
    setName("");
    setBrand("");
    setShowForm(false);
  };

  const handleSimulateScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedOem) return;

    const found = inventoryItems.find(
      item => item.oemCode.toLowerCase() === scannedOem.toLowerCase() || 
              (item.aftermarketCode && item.aftermarketCode.toLowerCase() === scannedOem.toLowerCase())
    );

    if (found) {
      setScanResult(found);
      onNotify(`Scaner: Piesa "${found.name}" identificată cu succes în zona fizică atribuită!`, "success");
    } else {
      setScanResult(null);
      onNotify(`Scaner: Codul "${scannedOem}" nu figurează în gestiunea curentă.`, "info");
    }
  };

  // Helper function to assign warehouse zone based on category/name
  const getWarehouseZone = (itemName: string) => {
    const nameLower = itemName.toLowerCase();
    if (nameLower.includes("filt") || nameLower.includes("ulei") || nameLower.includes("lichid")) {
      return "Sector A-04 (Consumabile / Fluide)";
    }
    if (nameLower.includes("plăcuț") || nameLower.includes("disc") || nameLower.includes("frân")) {
      return "Sector C-12 (Frâne și Rulare)";
    }
    if (nameLower.includes("amort") || nameLower.includes("susp") || nameLower.includes("articu")) {
      return "Sector D-08 (Mecanisme Direcție)";
    }
    return "Sector Universal B-02 (Diverse Accesorii)";
  };

  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.oemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header Block */}
      {!hideHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-2xl border border-[#E9E9EB] shadow-sm gap-6 p-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F2F2F7] text-[#1D1D1F] rounded-2xl flex items-center justify-center shadow-sm border border-[#E9E9EB]">
                <Warehouse className="w-6 h-6 text-[#034EA2]" />
              </div>
              Depozit & Inventar
            </h3>
            <p className="text-xs font-bold text-[#86868B] uppercase tracking-normal ml-16">Organizarea stocurilor fizice și recepție marfă</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-[#F2F2F7] p-1 rounded-2xl border border-[#E9E9EB]">
               <button 
                  onClick={() => setActiveTab("inventory")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-normal transition-all ${activeTab === "inventory" ? "bg-white text-[#034EA2] shadow-sm" : "text-[#86868B] hover:text-[#1D1D1F]"}`}
               >
                  Stocuri
               </button>
               <button 
                  onClick={() => setActiveTab("movements")}
                  className={`px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-normal transition-all ${activeTab === "movements" ? "bg-white text-[#034EA2] shadow-sm" : "text-[#86868B] hover:text-[#1D1D1F]"}`}
               >
                  Mișcări
               </button>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#034EA2] hover:bg-[#1D1D1F] text-white font-bold px-6 py-4 rounded-[22px] text-xs uppercase tracking-normal flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {showForm ? "Închide" : "Recepție Factură"}
            </button>
          </div>
        </div>
      )}

      {hideHeader && (
        <div className="flex justify-between items-center bg-white rounded-2xl p-4 border border-[#E9E9EB] mb-4">
           <div className="flex bg-[#F2F2F7] p-1 rounded-2xl border border-[#E9E9EB]">
               <button 
                  onClick={() => setActiveTab("inventory")}
                  className={`px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-normal transition-all ${activeTab === "inventory" ? "bg-white text-[#034EA2] shadow-sm" : "text-[#86868B] hover:text-[#1D1D1F]"}`}
               >
                  Stocuri
               </button>
               <button 
                  onClick={() => setActiveTab("movements")}
                  className={`px-6 py-2 rounded-xl text-xs font-semibold uppercase tracking-normal transition-all ${activeTab === "movements" ? "bg-white text-[#034EA2] shadow-sm" : "text-[#86868B] hover:text-[#1D1D1F]"}`}
               >
                  Mișcări
               </button>
            </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 text-xs font-bold bg-[#034EA2] hover:bg-[#1D1D1F] text-white rounded-2xl transition-all shadow-sm flex items-center gap-2 uppercase tracking-normal cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Recepție Marfă"}
          </button>
        </div>
      )}

      {/* 2. Formular recepție nou item */}
      {showForm && (
        <form 
          onSubmit={handleCreateItem}
          className="bg-white rounded-2xl p-6 lg:p-4 border border-[#E9E9EB] shadow-sm space-y-6 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-extrabold text-slate-950 text-base">📝 Recepționare Factură - Lot Nou Piese schimb</h4>
            <p className="text-xs text-gray-500">Adaugă elementele tehnologice și asignează furnizorul primar cu prețurile logistice.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Cod OEM Original:</label>
              <input 
                type="text" 
                required 
                value={oem} 
                onChange={e => setOem(e.target.value)} 
                placeholder="Ex. 5Q0615301G" 
                className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-[#034EA2] outline-none" 
              />
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Denumire / Tip Piese:</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Ex. Filtru Combustibil 2.0 TDI" 
                className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-[#034EA2] outline-none" 
              />
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Producător (Brand):</label>
              <input 
                type="text" 
                required 
                value={brand} 
                onChange={e => setBrand(e.target.value)} 
                placeholder="Ex. Bosch / Brembo" 
                className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-[#034EA2] outline-none" 
              />
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Furnizor Distribuție:</label>
              <select 
                value={selectedSupplierId} 
                onChange={e => setSelectedSupplierId(e.target.value)}
                className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-[#034EA2] outline-none cursor-pointer"
              >
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Preț Achiziție (MDL):</label>
              <input 
                type="number" 
                required 
                value={buyPrice} 
                onChange={e => setBuyPrice(Number(e.target.value))} 
                className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-[#034EA2] outline-none font-mono" 
              />
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Preț Recomandat Vânzare (MDL):</label>
              <input 
                type="number" 
                required 
                value={sellPrice} 
                onChange={e => setSellPrice(Number(e.target.value))} 
                className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-[#034EA2] outline-none font-mono" 
              />
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Cantitate Gestiune (buc.):</label>
              <input 
                type="number" 
                required 
                value={stock} 
                onChange={e => setStock(Number(e.target.value))} 
                className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-[#034EA2] outline-none font-mono" 
              />
            </div>

            <div>
              <label className="text-xs uppercase font-semibold text-gray-400 block mb-1">Stoc Minim Alertă (buc.):</label>
              <input 
                type="number" 
                required 
                value={minLevel} 
                onChange={e => setMinLevel(Number(e.target.value))} 
                className="w-full bg-[#F2F2F7] border-0 p-3.5 rounded-[16px] font-semibold text-[#1D1D1F] focus:ring-2 focus:ring-[#034EA2] outline-none font-mono" 
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#034EA2] hover:bg-[#1D1D1F] text-white font-bold py-4 rounded-[22px] text-xs uppercase tracking-normal cursor-pointer shadow-md transition-all"
          >
            Recepționează Lotul și Alocă Raft de Depozit
          </button>
        </form>
      )}

      {/* 3. CASETE INDICATORI KPI PITORESTI (DEPOT METRICS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-[#E9E9EB] text-[#1D1D1F] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Repere Active</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-[#034EA2] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#1D1D1F] leading-none">{totalItemsCount} repere</h4>
            <p className="text-xs text-[#86868B] font-bold mt-2">Piese înregistrate în sistemul de căutare</p>
          </div>
        </div>

        <div className="bg-[#1D1D1F] text-white rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-normal text-zinc-400">Valoare Totală Gestiune</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold font-mono leading-none text-emerald-400">
              {totalStockValue.toLocaleString()} MDL
            </h4>
            <p className="text-xs text-zinc-400 font-medium mt-2">Calculat pe baza prețului de achiziție primară</p>
          </div>
        </div>

        <div className="bg-white border border-[#E9E9EB] text-[#1D1D1F] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Alerte Stoc Critic</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold font-mono leading-none text-rose-500">
              {lowStockCount} repere critice
            </h4>
            <p className="text-xs text-[#86868B] font-bold mt-2">Necesită completare prin ordine noi</p>
          </div>
        </div>

        <div className="bg-white border border-[#E9E9EB] text-[#1D1D1F] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-normal text-[#86868B]">Furnizori Parteneri</span>
            <div className="w-8 h-8 rounded-full bg-[#EBF5FF] text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#1D1D1F] leading-none">
              {suppliers.length} distribuitori
            </h4>
            <p className="text-xs text-[#86868B] font-bold mt-2">Timp livrare mediu: 24h direct în Ungheni</p>
          </div>
        </div>

      </div>

      {/* 4. BARCODE SIMULATOR TOOL & RAPID DISPATCH LIST (Double layout grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* BARCODE SIMULATION (Lg: 5) */}
        <div className="bg-white border border-[#E9E9EB] rounded-2xl p-6 lg:p-4 shadow-sm lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-[#F2F2F7] pb-6">
              <h4 className="font-bold text-[#1D1D1F] text-base uppercase tracking-tight flex items-center gap-2">
                <Barcode className="w-5 h-5 text-[#034EA2] animate-pulse" />
                Scaner Cod Bare
              </h4>
              <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-2 leading-relaxed">Identificarea rapidă a reperelor în gestiune</p>
            </div>

            <form onSubmit={handleSimulateScan} className="flex gap-2">
              <input 
                type="text" 
                value={scannedOem}
                onChange={e => setScannedOem(e.target.value)}
                placeholder="Introdu cod OEM (Ex: 11201-0L010)"
                className="flex-1 bg-[#F2F2F7] border border-[#E9E9EB] px-4 py-3 rounded-2xl text-xs font-semibold focus:ring-2 focus:ring-[#034EA2] outline-none"
              />
              <button 
                type="submit"
                className="bg-[#1D1D1F] text-white hover:bg-[#034EA2] font-bold px-4 py-3 rounded-2xl text-xs uppercase cursor-pointer transition-all"
              >
                Scanare
              </button>
            </form>

            {scanResult ? (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl">
                  <span className="text-xs text-zinc-400 font-extrabold uppercase">Cod scanat:</span>
                  <span className="text-xs font-bold font-mono text-emerald-600">{scanResult.oemCode}</span>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 text-xs">{scanResult.name}</p>
                  <p className="text-xs text-slate-500 font-semibold">{scanResult.brand} • Preț: {scanResult.sellPrice} MDL</p>
                  <p className="text-xs font-bold text-[#034EA2] bg-[#E8F0FE] inline-block px-3 py-1 rounded-full">{getWarehouseZone(scanResult.name)}</p>
                </div>
              </div>
            ) : (
              <div className="bg-[#F2F2F7] border border-[#E9E9EB] p-4 rounded-2xl text-center text-[#86868B] text-xs">
                Așteptare intrare scaner fizic...
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 flex gap-2">
            <button 
              onClick={() => { setScannedOem("11201-0L010"); setScanResult(inventoryItems[0] || null); }}
              className="w-full bg-[#F2F2F7] hover:bg-slate-200 text-[#1D1D1F] font-bold py-3.5 rounded-xl text-xs uppercase tracking-normal transition-all"
            >
              Exemplu OEM Bosch
            </button>
            <button 
              onClick={() => { setScannedOem("5Q0615301G"); setScanResult(inventoryItems[2] || null); }}
              className="w-full bg-[#F2F2F7] hover:bg-slate-200 text-[#1D1D1F] font-bold py-3.5 rounded-xl text-xs uppercase tracking-normal transition-all"
            >
              Exemplu Plăcuțe Brembo
            </button>
          </div>
        </div>

        {/* WAREHOUSE ZONES PHYSICAL DIRECTORY (Lg: 7) */}
        <div className="bg-white border border-[#E9E9EB] rounded-2xl p-6 lg:p-4 shadow-sm lg:col-span-7 space-y-6">
          <div className="border-b border-[#F2F2F7] pb-6">
            <h4 className="font-bold text-[#1D1D1F] text-base uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#034EA2]" />
              Sectoare Depozit Ungheni
            </h4>
            <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-2 leading-relaxed">Organizarea spațială a terminalului logistic AutoBOX</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="p-6 bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl space-y-2 group hover:bg-white hover:shadow-xl transition-all">
              <span className="text-xs bg-[#E8F0FE] text-[#034EA2] px-2.5 py-1 rounded-full font-bold uppercase tracking-normal block w-max">Sector A</span>
              <p className="text-sm font-bold text-[#1D1D1F] tracking-tight">Consumabile & Fluide</p>
              <p className="text-xs text-[#86868B] font-medium leading-normal">Filtre, uleiuri și lichide tehnice motor</p>
            </div>

            <div className="p-6 bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl space-y-2 group hover:bg-white hover:shadow-xl transition-all">
              <span className="text-xs bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-normal block w-max">Sector C</span>
              <p className="text-sm font-bold text-[#1D1D1F] tracking-tight">Sisteme de Frânare</p>
              <p className="text-xs text-[#86868B] font-medium leading-normal">Discuri, plăcuțe și componente metalice</p>
            </div>

            <div className="p-6 bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl space-y-2 group hover:bg-white hover:shadow-xl transition-all">
              <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-bold uppercase tracking-normal block w-max">Sector D</span>
              <p className="text-sm font-bold text-[#1D1D1F] tracking-tight">Suspensie & Direcție</p>
              <p className="text-xs text-[#86868B] font-medium leading-normal">Piese voluminoase și articulatii elastice</p>
            </div>

            <div className="p-6 bg-[#F2F2F7] border border-[#E9E9EB] rounded-xl space-y-2 group hover:bg-white hover:shadow-xl transition-all">
              <span className="text-xs bg-zinc-200 text-zinc-800 px-2.5 py-1 rounded-full font-bold uppercase tracking-normal block w-max">Sector B</span>
              <p className="text-sm font-bold text-[#1D1D1F] tracking-tight">Electrice & Senzorică</p>
              <p className="text-xs text-[#86868B] font-medium leading-normal">Componente delicate, senzori OEM și relee</p>
            </div>
          </div>
        </div>

      </div>

      {/* 5. TABELLAR VIEWS BASED ON ACTIVE TAB */}
      {activeTab === "inventory" ? (
        <div className="bg-white border border-[#E9E9EB] rounded-2xl p-4 lg:p-6 shadow-sm space-y-4">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#F2F2F7]">
            <div>
              <h4 className="font-bold text-[#1D1D1F] text-xl uppercase tracking-tight">Registru Stocuri</h4>
              <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-1">Căutare după OEM, Aftermarket sau Producător</p>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" />
              <input 
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Caută OEM, piesă sau producător..."
                className="w-full bg-[#F2F2F7] border border-[#E9E9EB] pl-10 pr-4 py-3 rounded-full text-xs font-semibold focus:ring-2 focus:ring-[#034EA2] outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center text-zinc-400 text-xs">
                Mda! Nu am găsit niciun reper conform criteriilor tale în gestiune.
              </div>
            ) : (
              <table className="w-full text-xs text-left min-w-[800px]">
                <thead>
                  <tr className="text-zinc-400 border-b border-gray-150">
                    <th className="pb-3 text-left font-bold uppercase tracking-normal">Cod OEM</th>
                    <th className="pb-3 text-left font-bold uppercase tracking-normal">Denumire Piesă Tehnică</th>
                    <th className="pb-3 text-left font-bold uppercase tracking-normal">Producător/Brand</th>
                    <th className="pb-3 text-right font-bold uppercase tracking-normal">Preț Achiziție</th>
                    <th className="pb-3 text-right font-bold uppercase tracking-normal">Preț Vânzare RECO</th>
                    <th className="pb-3 text-center font-bold uppercase tracking-normal">Stoc Curent</th>
                    <th className="pb-3 text-center font-bold uppercase tracking-normal">Stoc Siguranță</th>
                    <th className="pb-3 text-left font-bold uppercase tracking-normal">Sector Fizic Depozit</th>
                    <th className="pb-3 text-center font-bold uppercase tracking-normal">Status Alertă</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[#1D1D1F] font-semibold">
                  {filteredItems.map((item) => {
                    const isLow = item.currentStock <= item.minStockLevel;
                    return (
                      <tr key={item.id} className="hover:bg-[#F2F2F7]/50 transition-colors">
                        <td className="py-4 font-bold font-mono text-[#034EA2] uppercase">{item.oemCode}</td>
                        <td className="py-4 font-bold">{item.name}</td>
                        <td className="py-4 text-zinc-500">{item.brand}</td>
                        <td className="py-4 text-right font-mono text-slate-500">{item.purchasePrice} MDL</td>
                        <td className="py-4 text-right font-mono text-emerald-600 font-bold">{item.sellPrice} MDL</td>
                        <td className="py-4 text-center font-mono font-bold">{item.currentStock} buc.</td>
                        <td className="py-4 text-center font-mono text-zinc-400">{item.minStockLevel} buc.</td>
                        <td className="py-4 text-slate-600 text-xs italic font-medium">{getWarehouseZone(item.name)}</td>
                        <td className="py-4 text-center">
                          {isLow ? (
                            <span className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold uppercase tracking-normal px-2 py-1 rounded-full animate-pulse inline-block">
                              Stoc Critic
                            </span>
                          ) : (
                            <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold uppercase tracking-normal px-2 py-1 rounded-full inline-block">
                              Securizat
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E9E9EB] rounded-2xl p-4 lg:p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
           <div className="flex items-center justify-between pb-6 border-b border-[#F2F2F7]">
              <div>
                <h4 className="font-bold text-[#1D1D1F] text-xl uppercase tracking-tight">Istoric Mișcări Stoc</h4>
                <p className="text-xs text-[#86868B] font-bold uppercase tracking-normal mt-1">Trasabilitatea intrărilor și ieșirilor din depozit</p>
              </div>
              <Activity className="w-6 h-6 text-[#034EA2]" />
           </div>

           <div className="overflow-x-auto">
             <table className="w-full text-xs text-left min-w-[800px]">
                <thead>
                   <tr className="text-zinc-400 border-b border-gray-150">
                      <th className="pb-3 font-bold uppercase tracking-normal">Data / Ora</th>
                      <th className="pb-3 font-bold uppercase tracking-normal">Reper / Cod</th>
                      <th className="pb-3 font-bold uppercase tracking-normal text-center">Tip</th>
                      <th className="pb-3 font-bold uppercase tracking-normal text-right">Cantitate</th>
                      <th className="pb-3 font-bold uppercase tracking-normal">Motiv / Referință</th>
                      <th className="pb-3 font-bold uppercase tracking-normal">Operator</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[#1D1D1F]">
                   {stockMovements.length === 0 ? (
                      <tr>
                         <td colSpan={6} className="py-4 text-center text-zinc-400 font-bold uppercase italic">Nu există mișcări înregistrate în perioada curentă.</td>
                      </tr>
                   ) : (
                      stockMovements.map((mov) => {
                         const item = inventoryItems.find(i => i.id === mov.itemId);
                         const user = users.find(u => u.id === mov.userId);
                         return (
                            <tr key={mov.id} className="hover:bg-slate-50/50">
                               <td className="py-5 font-mono text-xs text-zinc-500">
                                  <div className="flex items-center gap-2">
                                     <Clock className="w-3.5 h-3.5" />
                                     {mov.date}
                                  </div>
                               </td>
                               <td className="py-5">
                                  <p className="font-bold text-[#1D1D1F]">{item?.name || "Produs Șters"}</p>
                                  <p className="text-xs font-mono text-[#034EA2] uppercase">{item?.oemCode || "N/A"}</p>
                               </td>
                               <td className="py-5 text-center">
                                  {mov.type === "IN" ? (
                                     <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 w-max mx-auto shadow-sm border border-emerald-100">
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                        INTRARE
                                     </span>
                                  ) : (
                                     <span className="bg-rose-50 text-rose-600 px-2.5 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 w-max mx-auto shadow-sm border border-rose-100">
                                        <ArrowDownLeft className="w-3.5 h-3.5" />
                                        IEȘIRE
                                     </span>
                                  )}
                               </td>
                               <td className={`py-5 text-right font-bold font-mono text-sm ${mov.type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
                                  {mov.type === "IN" ? "+" : "-"}{mov.quantity} buc.
                               </td>
                               <td className="py-5">
                                  <p className="text-xs font-bold text-slate-800 italic">"{mov.reason}"</p>
                               </td>
                               <td className="py-5">
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border border-white">
                                        {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="text-xs font-bold">ST</div>}
                                     </div>
                                     <span className="text-xs font-semibold uppercase text-zinc-500">{user?.name || "Sistem"}</span>
                                  </div>
                               </td>
                            </tr>
                         )
                      })
                   )}
                </tbody>
             </table>
           </div>
        </div>
      )}

    </div>
  );
}
