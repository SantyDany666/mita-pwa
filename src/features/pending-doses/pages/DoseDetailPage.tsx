import { useNavigate } from "@tanstack/react-router";
import { format, parseISO, differenceInMinutes, differenceInHours } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { useState } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  RotateCcw,
  CalendarDays,
  CalendarClock,
  Loader2,
  CalendarCog,
} from "lucide-react";

import { AppHeader } from "@/components/ui/AppHeader";
import { MedicineIconDisplay } from "@/features/reminders/components/MedicineIconDisplay";
import { MedicineIconType } from "@/features/reminders/utils/medicine-icons";
import { useDoseDetail } from "../hooks/useDoseDetail";
import { useDoseMutations } from "@/features/reminders/hooks/useDoseMutations";
import { useUIStore } from "@/store/ui.store";
import { UndoConfirmDrawer } from "../components/UndoConfirmDrawer";

interface DoseDetailPageProps {
  doseId: string;
}

export function DoseDetailPage({ doseId }: DoseDetailPageProps) {
  const navigate = useNavigate();
  const { data: dose, isLoading, error } = useDoseDetail(doseId);
  const { takeDose, skipDose, undoDose } = useDoseMutations();
  const { setSnoozeDoseId } = useUIStore();

  const [isUndoConfirmOpen, setIsUndoConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-[#F7F9FC] dark:bg-gray-950">
        <Loader2 className="w-10 h-10 animate-spin text-[#054A91]" />
      </div>
    );
  }

  if (error || !dose || !dose.reminders) {
    return (
      <div className="flex flex-col w-full h-screen items-center justify-center bg-[#F7F9FC] dark:bg-gray-950 p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Dosis no encontrada
        </h2>
        <p className="text-gray-500 mt-2 mb-6">
          No pudimos localizar la información de esta dosis.
        </p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="bg-[#054A91] text-white px-6 py-3 rounded-xl font-semibold"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const reminder = dose.reminders;
  const status = dose.status as "pending" | "taken" | "skipped";
  const scheduledDate = parseISO(dose.scheduled_at);
  const takenDate = dose.taken_at ? parseISO(dose.taken_at) : null;
  const isOverdue = status === "pending" && scheduledDate < new Date();

  // Undo Policy Logic
  const now = new Date();
  const minsSinceAction = takenDate ? differenceInMinutes(now, takenDate) : 0;
  const hoursSinceAction = takenDate ? differenceInHours(now, takenDate) : 0;

  const isBeyondGracePeriod = minsSinceAction >= 30;
  const isBeyondLimit = hoursSinceAction >= 24;

  // Status Presentation Configuration
  let statusColor = "text-[#054A91] dark:text-[#81A4CD]";
  let statusBg = "bg-[#054A91]/10 dark:bg-[#054A91]/20";
  let statusLabel = "Pendiente";
  let StatusIcon = Clock;

  if (status === "taken") {
    statusColor = "text-teal-600 dark:text-teal-400";
    statusBg = "bg-teal-100/50 dark:bg-teal-900/30";
    statusLabel = "Tomada";
    StatusIcon = CheckCircle2;
  } else if (status === "skipped") {
    statusColor = "text-gray-600 dark:text-gray-400";
    statusBg = "bg-gray-100 dark:bg-gray-800";
    statusLabel = "Omitida";
    StatusIcon = XCircle;
  } else if (isOverdue) {
    statusColor = "text-orange-600 dark:text-orange-400";
    statusBg = "bg-orange-100 dark:bg-orange-900/30";
    statusLabel = "Vencida";
    StatusIcon = AlertCircle;
  }

  // Inventory presentation code removed per request

  // Actions
  const handleTake = async () => {
    try {
      await takeDose(dose.id);
      toast.success("Dosis tomada exitosamente");
    } catch {
      toast.error("Error al tomar la dosis");
    }
  };

  const handleSkip = async () => {
    try {
      await skipDose(dose.id);
      toast.info("Dosis omitida");
    } catch {
      toast.error("Error al omitir");
    }
  };

  const handleUndo = async (confirmed = false) => {
    if (isBeyondGracePeriod && !confirmed) {
      setIsUndoConfirmOpen(true);
      return;
    }

    try {
      await undoDose(dose.id);
      toast.success("Estado revertido a pendiente");
    } catch {
      toast.error("Error al revertir");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F7F9FC] dark:bg-gray-950 font-sans pb-24">
      {/* Header */}
      <AppHeader
        title="Detalle de Dosis"
        className="border-none shadow-none bg-[#F7F9FC] dark:bg-gray-950 pt-[max(1rem,env(safe-area-inset-top))] pb-2"
        titleClassName="text-[#054A91] dark:text-white"
        onBack={() => window.history.back()}
        rightAction={
          <button
            onClick={() =>
              navigate({
                to: "/reminders/$id",
                params: { id: reminder.id },
              })
            }
            className="flex size-12 items-center justify-center text-[#054A91] dark:text-[#81A4CD] active:opacity-60"
          >
            <CalendarCog className="w-6 h-6" />
          </button>
        }
      />

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Medicine Hero Card */}
        <section
          className={`flex flex-col items-center justify-center p-8 rounded-3xl border shadow-sm transition-colors ${
            status === "taken"
              ? "bg-teal-50/50 border-teal-100/50 dark:bg-teal-900/5 dark:border-teal-800/30"
              : status === "skipped"
                ? "bg-gray-50 border-gray-200 dark:bg-gray-900/40 dark:border-gray-800"
                : isOverdue
                  ? "bg-orange-50/50 border-orange-100/60 dark:bg-orange-900/10 dark:border-orange-500/20"
                  : "bg-white border-slate-200 dark:bg-gray-900 dark:border-gray-800"
          }`}
        >
          <div
            className={`flex shrink-0 items-center justify-center w-20 h-20 rounded-2xl mb-4 ${statusBg} ${statusColor}`}
          >
            <MedicineIconDisplay
              type={reminder.medicine_icon as MedicineIconType}
              className="w-10 h-10"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-1">
            {reminder.medicine_name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {reminder.dose} {reminder.unit}
          </p>

          <div
            className={`mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusBg} ${statusColor} border-current/20`}
          >
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">{statusLabel}</span>
          </div>
        </section>

        {/* Schedule & Timing details */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-slate-50 dark:bg-gray-800 p-3 rounded-xl shrink-0">
              <CalendarClock className="w-6 h-6 text-[#054A91] dark:text-[#81A4CD]" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                Programada para
              </p>
              <p className="text-gray-900 dark:text-white font-semibold">
                {format(scheduledDate, "hh:mm a")}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-0.5">
                {format(scheduledDate, "EEEE, d 'de' MMMM, yyyy", {
                  locale: es,
                })}
              </p>
            </div>
          </div>

          {(status === "taken" || status === "skipped") && takenDate && (
            <>
              <hr className="border-slate-100 dark:border-gray-800" />
              <div className="flex items-start gap-4">
                <div className="bg-slate-50 dark:bg-gray-800 p-3 rounded-xl shrink-0">
                  <CalendarDays className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                    {status === "taken" ? "Tomada a las" : "Omitida a las"}
                  </p>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {format(takenDate, "hh:mm a")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-0.5">
                    {format(takenDate, "d 'de' MMMM", { locale: es })}
                  </p>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Indications */}
        {reminder.indications && (
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-[#00B8A5]" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Indicaciones
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {reminder.indications}
            </p>
          </section>
        )}
      </main>

      {/* Floating Action Bar */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] left-0 right-0 px-4 pointer-events-none z-10 w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-900 py-3 px-4 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex gap-3 flex-wrap items-center justify-center pointer-events-auto">
          {status === "pending" ? (
            <>
              <button
                onClick={handleTake}
                className="flex-1 min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#054A91] dark:bg-[#054A91] text-white text-base font-medium leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
              >
                <span className="truncate">Tomar</span>
              </button>
              <button
                onClick={() => setSnoozeDoseId(dose.id)}
                className="flex-1 min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-base font-medium leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="truncate">Posponer</span>
              </button>
              <button
                onClick={handleSkip}
                className="w-full cursor-pointer flex items-center justify-center overflow-hidden rounded-lg h-12 px-4 text-gray-500 dark:text-gray-400 text-base font-medium leading-normal tracking-[0.015em] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="truncate">Omitir</span>
              </button>
            </>
          ) : !isBeyondLimit ? (
            <button
              onClick={() => handleUndo()}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98]"
            >
              <RotateCcw className="w-5 h-5" />
              Deshacer Acción
            </button>
          ) : null}
        </div>
      </div>

      <UndoConfirmDrawer
        isOpen={isUndoConfirmOpen}
        onOpenChange={setIsUndoConfirmOpen}
        onConfirm={() => handleUndo(true)}
        status={status as "taken" | "skipped"}
      />
    </div>
  );
}
