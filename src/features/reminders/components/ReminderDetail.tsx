import {
  Clock,
  CalendarDays,
  Utensils,
  Archive,
  Pause,
  Pencil,
  Package,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/ui/AppHeader";
import { MedicineIconDisplay } from "./MedicineIconDisplay";
import { MedicineIconType } from "./MedicineIconSelector";

interface ReminderDetailProps {
  id: string;
  name: string;
  status: "active" | "paused" | "finished";
  dose: string;
  unit: string;
  frequency: string;
  duration: string;
  indications: string;
  stock?: number;
  icon?: MedicineIconType;
}

export function ReminderDetail({
  id,
  name,
  status,
  dose,
  unit,
  frequency,
  duration,
  indications,
  stock,
  icon = "capsule",
}: ReminderDetailProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return (
          <div className="flex h-7 shrink-0 items-center justify-center gap-x-1.5 rounded-full bg-[#00B8A5]/10 px-3 border border-[#00B8A5]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00B8A5]" />
            <p className="text-[#00B8A5] text-xs font-semibold leading-normal">
              Activo
            </p>
          </div>
        );
      case "paused":
        return (
          <div className="flex h-7 shrink-0 items-center justify-center gap-x-1.5 rounded-full bg-[#3E7CB1]/10 px-3 border border-[#81A4CD]/50">
            <Pause className="w-3 h-3 text-[#3E7CB1] dark:text-[#81A4CD]" />
            <p className="text-[#3E7CB1] dark:text-[#81A4CD] text-xs font-semibold leading-normal">
              Pausado
            </p>
          </div>
        );
      case "finished":
        return (
          <div className="flex h-7 shrink-0 items-center justify-center gap-x-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-3 border border-gray-200 dark:border-gray-700">
            <Archive className="w-3 h-3 text-gray-500" />
            <p className="text-gray-500 text-xs font-semibold leading-normal">
              Finalizado
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-white dark:bg-gray-950 font-sans">
      <AppHeader
        title="Detalle del Recordatorio"
        className="border-gray-100 dark:border-gray-800 shadow-none bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
        titleClassName="text-[#054A91] dark:text-white"
        rightAction={getStatusBadge()}
      />

      <main className="flex-grow px-5 pt-6 pb-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-[#054A91]/10 dark:bg-[#054A91]/20 text-[#054A91] dark:text-[#81A4CD]">
            <MedicineIconDisplay type={icon} className="w-12 h-12" />
          </div>
          <div className="text-center">
            <h2 className="text-[#054A91] dark:text-white text-2xl font-bold leading-tight">
              {name}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base font-medium mt-1">
              {dose} {unit}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <section className="rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50 p-4 space-y-4">
            {/* Frequency */}
            <div className="flex items-center gap-4">
              <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 text-[#054A91] dark:text-[#81A4CD]">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Frecuencia
                </span>
                <p className="text-slate-900 dark:text-white text-base font-medium leading-tight">
                  {frequency}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-4">
              <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 text-[#054A91] dark:text-[#81A4CD]">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                  Duración
                </span>
                <p className="text-slate-900 dark:text-white text-base font-medium leading-tight">
                  {duration}
                </p>
              </div>
            </div>

            {/* Inventory (Conditional) */}
            {stock !== undefined && (
              <div className="flex items-center gap-4">
                <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 text-[#054A91] dark:text-[#81A4CD]">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    Inventario
                  </span>
                  <p className="text-slate-900 dark:text-white text-base font-medium leading-tight">
                    {stock > 0 ? `${stock} unidades` : "Sin stock"}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Indications */}
          {indications && (
            <section className="rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50 p-4">
              <div className="flex items-start gap-4">
                <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 text-[#054A91] dark:text-[#81A4CD] mt-0.5">
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                    Indicaciones
                  </span>
                  <p className="text-slate-900 dark:text-white text-base font-normal leading-normal mt-0.5">
                    {indications}
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-slate-100 dark:border-gray-800 p-4">
        <div className="flex flex-col gap-3">
          <Link
            to="/reminders/$id/edit"
            params={{ id }}
            className="w-full flex items-center justify-center h-12 rounded-xl bg-[#054A91] shadow-lg shadow-[#054A91]/20 transition-transform active:scale-95 hover:bg-[#054A91]/90"
          >
            <Pencil className="w-4 h-4 mr-2 text-white" />
            <span className="text-white text-base font-semibold">
              Editar Recordatorio
            </span>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            {/* Pause Button - Outline Primary */}
            <button className="w-full flex items-center justify-center h-12 rounded-xl bg-white dark:bg-transparent border border-[#054A91]/30 dark:border-[#81A4CD]/50 hover:bg-[#054A91]/5 dark:hover:bg-[#054A91]/20 transition-colors text-[#054A91] dark:text-[#81A4CD]">
              <Pause className="w-4 h-4 mr-2" />
              <span className="text-base font-medium">Pausar</span>
            </button>

            {/* Finalize Button - Outline Archive/Slate */}
            <button className="w-full flex items-center justify-center h-12 rounded-xl bg-white dark:bg-transparent border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
              <Archive className="w-4 h-4 mr-2" />
              <span className="text-base font-medium">Finalizar</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
