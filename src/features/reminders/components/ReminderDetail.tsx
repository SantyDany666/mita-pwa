import { Pill, Clock, CalendarDays, Utensils } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/ui/AppHeader";

interface ReminderDetailProps {
  id: string;
  name: string;
  status: "active" | "paused" | "finished";
  dose: string;
  unit: string;
  frequency: string;
  duration: string;
  indications: string;
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
}: ReminderDetailProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return (
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#00B8A5]/10 px-4 border border-[#00B8A5]/20">
            <p className="text-[#00B8A5] text-sm font-semibold leading-normal">
              Activo
            </p>
          </div>
        );
      case "paused":
        return (
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#3E7CB1]/10 px-4 border border-[#81A4CD]/50">
            <p className="text-[#3E7CB1] dark:text-[#81A4CD] text-sm font-semibold leading-normal">
              Pausado
            </p>
          </div>
        );
      case "finished":
        return (
          <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-gray-100 dark:bg-gray-800 px-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 text-sm font-semibold leading-normal">
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
      />

      <main className="flex-grow px-4 pt-4 pb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[#054A91] dark:text-[#81A4CD] tracking-tight text-[28px] font-bold leading-tight">
              {name}
            </h2>
            {getStatusBadge()}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-y-4">
          {/* Dose */}
          <div className="flex items-center gap-4 bg-transparent border-b border-slate-100 dark:border-gray-800 px-2 min-h-[64px] justify-between pb-2">
            <div className="flex items-center gap-4">
              <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-xl bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                <Pill className="w-6 h-6" />
              </div>
              <p className="text-slate-900 dark:text-white text-base font-medium leading-normal flex-1 truncate">
                {dose} {unit}
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-slate-500 dark:text-gray-400 text-sm font-normal leading-normal">
                Dosis
              </p>
            </div>
          </div>

          {/* Frequency */}
          <div className="flex items-center gap-4 bg-transparent border-b border-slate-100 dark:border-gray-800 px-2 min-h-[64px] justify-between pb-2">
            <div className="flex items-center gap-4">
              <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-xl bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-slate-900 dark:text-white text-base font-medium leading-normal flex-1 truncate">
                {frequency}
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-slate-500 dark:text-gray-400 text-sm font-normal leading-normal">
                Frecuencia
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-4 bg-transparent border-b border-slate-100 dark:border-gray-800 px-2 min-h-[64px] justify-between pb-2">
            <div className="flex items-center gap-4">
              <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-xl bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                <CalendarDays className="w-6 h-6" />
              </div>
              <p className="text-slate-900 dark:text-white text-base font-medium leading-normal flex-1 truncate">
                {duration}
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-slate-500 dark:text-gray-400 text-sm font-normal leading-normal">
                Duración
              </p>
            </div>
          </div>

          {/* Indications */}
          <div className="flex items-center gap-4 bg-transparent border-b border-slate-100 dark:border-gray-800 px-2 min-h-[64px] justify-between pb-2">
            <div className="flex items-center gap-4">
              <div className="text-[#054A91] dark:text-[#81A4CD] flex items-center justify-center rounded-xl bg-[#054A91]/10 dark:bg-[#054A91]/20 shrink-0 size-12">
                <Utensils className="w-6 h-6" />
              </div>
              <p className="text-slate-900 dark:text-white text-base font-medium leading-normal flex-1 truncate">
                {indications}
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-slate-500 dark:text-gray-400 text-sm font-normal leading-normal">
                Indicaciones
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-slate-100 dark:border-gray-800 p-4 pt-4">
        <div className="flex flex-col gap-3">
          <Link
            to="/reminders/$id/edit"
            params={{ id }}
            className="w-full flex items-center justify-center h-12 rounded-2xl bg-[#054A91] shadow-lg shadow-[#054A91]/20 transition-transform active:scale-95"
          >
            <span className="text-white text-base font-semibold">Editar</span>
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <button className="w-full flex items-center justify-center h-12 rounded-2xl bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors">
              <span className="text-slate-900 dark:text-white text-base font-semibold">
                Pausar
              </span>
            </button>
            <button className="w-full flex items-center justify-center h-12 rounded-2xl bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors">
              <span className="text-slate-900 dark:text-white text-base font-semibold">
                Finalizar
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
