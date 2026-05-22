import { Notification } from "../types";
import { Bell, CheckCircle2, AlertCircle, Info, ChevronLeft, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface NotificationsPageProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export default function NotificationsPage({ notifications, onMarkAsRead, onDelete, onBack }: NotificationsPageProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2.5 bg-white border border-[#eef1f6] rounded-2xl text-[#86868B] hover:text-[#1D1D1F] transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-[#1D1D1F]">Notificări</h2>
          <p className="text-xs text-[#86868B]">Istoricul mesajelor și alertelor sistemului</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-[#eef1f6] text-center space-y-4">
            <div className="w-12 h-12 bg-[#F2F2F7] text-[#86868B] rounded-full flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-[#86868B]">Nu aveți nicio notificare momentan.</p>
          </div>
        ) : (
          notifications.map((n, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={n.id}
              className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                n.isRead ? "bg-white border-[#eef1f6]" : "bg-blue-50/30 border-blue-100 shadow-sm"
              }`}
            >
              <div className={`p-3 rounded-2xl shrink-0 ${
                n.type === "success" ? "bg-emerald-50 text-emerald-600" :
                n.type === "warning" ? "bg-amber-50 text-amber-600" :
                n.type === "alert" ? "bg-rose-50 text-rose-600" :
                "bg-blue-50 text-blue-600"
              }`}>
                {n.type === "success" ? <CheckCircle2 className="w-5 h-5" /> :
                 n.type === "warning" ? <AlertCircle className="w-5 h-5" /> :
                 n.type === "alert" ? <AlertCircle className="w-5 h-5" /> :
                 <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1 space-y-1 text-left">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-sm text-[#1D1D1F] leading-tight">{n.title}</h4>
                  <span className="text-xs font-bold text-[#86868B] uppercase">{new Date(n.date).toLocaleDateString("ro-RO")}</span>
                </div>
                <p className="text-xs text-[#86868B] leading-relaxed max-w-2xl">{n.message}</p>
                
                <div className="pt-3 flex items-center gap-3">
                  {!n.isRead && (
                    <button 
                      onClick={() => onMarkAsRead(n.id)}
                      className="text-xs font-bold text-blue-600 uppercase tracking-normal hover:underline cursor-pointer"
                    >
                      Marchează ca citit
                    </button>
                  )}
                  <button 
                    onClick={() => onDelete(n.id)}
                    className="text-xs font-bold text-[#86868B] uppercase tracking-normal hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Șterge
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
