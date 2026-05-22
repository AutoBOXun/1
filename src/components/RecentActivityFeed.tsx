import React from "react";
import { Zap } from "lucide-react";
import { Appointment, ServiceJob, Invoice } from "../types";
import { motion } from "motion/react";

interface RecentActivityFeedProps {
  appointments: Appointment[];
  serviceJobs: ServiceJob[];
  invoices: Invoice[];
}

export const RecentActivityFeed = ({ appointments, serviceJobs, invoices }: RecentActivityFeedProps) => {
  // Create a unified activity stream sorted by date
  const activities = [
    ...appointments.map(a => ({ type: "appointment", id: a.id, title: "Programare Nouă", description: a.notes || "Fără detalii", date: a.createdAt })),
    ...serviceJobs.map(j => ({ type: "job", id: j.id, title: "Fișă Service Nouă", description: j.reportedFaults, date: j.entryDate })),
    ...invoices.map(i => ({ type: "invoice", id: i.id, title: "Factură Emisă", description: `Nr: ${i.invoiceNumber}`, date: i.issueDate }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E9E9EB] shadow-sm">
      <h3 className="text-sm font-bold uppercase text-[#1D1D1F] mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-[#034EA2]" /> Activități recente
      </h3>
      <div className="space-y-4">
        {activities.map((act, idx) => (
          <motion.div 
            key={act.id + act.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#F2F2F7] transition-colors"
            >
            <div className={`mt-1 p-2 rounded-lg ${act.type === 'invoice' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-[#034EA2]'}`}>
                <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1D1D1F]">{act.title}</p>
              <p className="text-[10px] text-[#86868B]">{act.description}</p>
              <p className="text-[9px] text-[#86868B]/50 font-bold uppercase mt-1">{new Date(act.date).toLocaleDateString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
