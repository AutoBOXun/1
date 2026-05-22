import React from "react";
import { Invoice, ServiceJob, InventoryItem, User } from "../types";
import { 
  FileText, Download, Printer, Share2, CheckCircle2, Clock, 
  User as UserIcon, Car, CreditCard, Landmark, ShieldCheck, Mail, Phone, MapPin
} from "lucide-react";
import { motion } from "motion/react";

interface InvoiceDocumentProps {
  invoice: Invoice;
  onClose: () => void;
}

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoice, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1F]/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/40"
      >
        {/* Header Control Bar */}
        <div className="px-8 py-6 bg-[#F2F2F7] border-b border-[#E9E9EB] flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#034EA2] rounded-xl flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1D1D1F] uppercase tracking-normal">Previzualizare Document</h3>
              <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-widest">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white border border-[#E9E9EB] rounded-xl text-[#1D1D1F] hover:bg-gray-50 transition-all active:scale-95">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-3 bg-white border border-[#E9E9EB] rounded-xl text-[#1D1D1F] hover:bg-gray-50 transition-all active:scale-95">
              <Printer className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-3 bg-[#1D1D1F] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#034EA2] transition-all active:scale-95 shadow-md shadow-black/10"
            >
              Închide
            </button>
          </div>
        </div>

        {/* Invoice Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-white selection:bg-blue-50 selection:text-blue-900">
          
          {/* Top Info Section */}
          <div className="flex justify-between items-start gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#034EA2] rounded-2xl flex items-center justify-center text-white">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-[#1D1D1F] tracking-tighter uppercase italic">AutoBOX<span className="text-[#034EA2]">.</span></h1>
                  <p className="text-[10px] font-bold text-[#86868B] tracking-widest uppercase">Service Auto Ungheni</p>
                </div>
              </div>
              <div className="space-y-1 text-xs font-bold text-[#86868B] uppercase tracking-normal">
                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Mun. Ungheni, str. Industrială 12</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> +373 60 123 456</p>
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> office@autobox.md</p>
              </div>
            </div>

            <div className="text-right space-y-4 pt-2">
              <h2 className="text-5xl font-extrabold text-[#1D1D1F] tracking-tighter opacity-10">FACTURĂ FISCALĂ</h2>
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#86868B] uppercase tracking-widest leading-none mb-4">Detalii Document</p>
                <p className="text-lg font-bold text-[#1D1D1F] tracking-tight">{invoice.invoiceNumber}</p>
                <div className="flex justify-end items-center gap-3 py-1">
                  <span className="text-[10px] font-bold text-[#86868B] uppercase">Dată Emiterii:</span>
                  <span className="text-xs font-bold text-[#1D1D1F]">{invoice.issueDate}</span>
                </div>
                <div className="flex justify-end items-center gap-3 py-1">
                  <span className="text-[10px] font-bold text-[#86868B] uppercase">Scadență:</span>
                  <span className="text-xs font-bold text-[#034EA2]">{invoice.dueDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#F2F2F7]"></div>

          {/* Client & Vehicle Section */}
          <div className="grid grid-cols-2 gap-12">
            <div className="p-8 bg-[#F2F2F7]/50 rounded-[32px] border border-[#E9E9EB]/50 space-y-6">
              <div className="flex items-center gap-3 text-[#034EA2]">
                <UserIcon className="w-5 h-5" />
                <h4 className="text-[10px] font-bold tracking-widest uppercase">Destinatar (Cumpărător)</h4>
              </div>
              <div className="space-y-4">
                <h5 className="text-2xl font-bold text-[#1D1D1F] tracking-tight uppercase">{invoice.clientName}</h5>
                <div className="space-y-1 text-xs font-bold text-[#86868B] tracking-normal uppercase">
                  <p>Tel: {invoice.clientPhone}</p>
                  <p>Email: {invoice.clientName.toLowerCase().replace(/ /g, '.')}@cloud.md</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#F2F2F7]/50 rounded-[32px] border border-[#E9E9EB]/50 space-y-6">
              <div className="flex items-center gap-3 text-[#1D1D1F]">
                <Car className="w-5 h-5" />
                <h4 className="text-[10px] font-bold tracking-widest uppercase">Specificații Autovehicul</h4>
              </div>
              <div className="space-y-4">
                 <h5 className="text-2xl font-bold text-[#1D1D1F] tracking-tight uppercase">{invoice.vehicleDetails.split('(')[0]}</h5>
                 <p className="text-sm font-bold bg-[#1D1D1F] text-white px-3 py-1 rounded inline-block tracking-widest">
                   {invoice.vehicleDetails.match(/\(([^)]+)\)/)?.[1] || "MD 888 BOX"}
                 </p>
                 <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest opacity-60">Serviciu efectuat în Atelierul Central Ungheni</p>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-6">
             <div className="overflow-hidden bg-white border border-[#F2F2F7] rounded-[24px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#1D1D1F] text-white text-[10px] font-bold uppercase tracking-widest">
                      <th className="px-8 py-5">Descriere Detaliată Servicii și Piese</th>
                      <th className="px-6 py-5 text-center">Cant.</th>
                      <th className="px-6 py-5 text-right">Preț Unitar</th>
                      <th className="px-6 py-5 text-right">Total (Fără TVA)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2F2F7]">
                    {invoice.items.map((item, i) => (
                      <tr key={i} className="group hover:bg-[#F2F2F7]/40 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-[#1D1D1F] tracking-tight uppercase">{item.description}</p>
                          <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-normal mt-1">Cotă TVA: {invoice.vatRate}%</p>
                        </td>
                        <td className="px-6 py-6 text-center text-sm font-bold text-[#1D1D1F] font-mono">{item.quantity}</td>
                        <td className="px-6 py-6 text-right text-sm font-bold text-[#1D1D1F] tracking-tight">{item.unitPrice.toLocaleString()} MDL</td>
                        <td className="px-6 py-6 text-right text-sm font-bold text-[#1D1D1F] tracking-tighter">{(item.unitPrice * item.quantity).toLocaleString()} MDL</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>

          {/* Footer Calculations */}
          <div className="flex flex-col md:flex-row justify-between gap-12 pt-8">
             <div className="flex-1 space-y-6">
                <div className="p-8 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4">
                   <Landmark className="w-6 h-6 text-[#034EA2] mt-1" />
                   <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#034EA2] uppercase tracking-widest">Instrucțiuni de Plată</h4>
                      <p className="text-xs font-bold text-[#1D1D1F] uppercase leading-relaxed tracking-normal">
                         Vă rugăm să achitați suma totală în termen de 14 zile prin transfer bancar sau numerar la casieria service-ului.
                      </p>
                      <div className="pt-2 text-[10px] font-bold text-[#86868B] uppercase tracking-widest">
                         IBAN: MD09 AUTO 2026 8888 7777 6666 (BC VICTORIABANK S.A.)
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-6 p-2">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Document Generat Digital</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">Securizat AutoBOX</span>
                   </div>
                </div>
             </div>

             <div className="min-w-[320px] bg-[#1D1D1F] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#034EA2]/30 rounded-full blur-[50px] -mr-16 -mt-16"></div>
                
                <div className="relative z-10 space-y-6">
                   <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-[#86868B]">
                      <span>Subtotal</span>
                      <span className="text-white">{invoice.subtotal.toLocaleString()} MDL</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-[#86868B]">
                      <span>TVA ({invoice.vatRate}%)</span>
                      <span className="text-white">{invoice.vatAmount.toLocaleString()} MDL</span>
                   </div>
                   <div className="h-px bg-white/10 my-6"></div>
                   <div className="flex justify-between items-end">
                      <div className="space-y-1">
                         <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Total de Plată</p>
                         <h3 className="text-4xl font-extrabold tracking-tighter leading-none italic">{invoice.total.toLocaleString()}</h3>
                      </div>
                      <span className="text-sm font-bold opacity-30 tracking-widest mb-1 underline">MDL</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-[#F2F2F7] border-t border-[#E9E9EB] text-center">
           <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">
             AutoBOX Assistant Services • © 2026 Mun. Ungheni • Powered by AI Intelligence G8
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default InvoiceDocument;
