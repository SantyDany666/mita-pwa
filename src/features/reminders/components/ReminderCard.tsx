import { Play, Pause, Archive } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { MedicineIconType } from "@/features/reminders/utils/medicine-icons";
import { MedicineIconDisplay } from "@/features/reminders/components/MedicineIconDisplay";

export interface ReminderCardProps {
  id?: string;
  medicineName: string;
  dose: string;
  unit: string;
  frequency: string;
  status: "active" | "paused" | "finished";
  nextDose?: string;
  endDate?: string;
  icon?: MedicineIconType;
}

export function ReminderCard({
  id = "1",
  medicineName,
  dose,
  unit,
  frequency,
  status,
  nextDose,
  endDate,
  icon = "capsule",
}: ReminderCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({ to: "/reminders/$id", params: { id } });
  };

  // Paused Style
  if (status === "paused") {
    return (
      <div
        onClick={handleCardClick}
        className="flex flex-col gap-3 rounded-xl bg-slate-50 dark:bg-slate-900/20 p-4 shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/30"
      >
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            <MedicineIconDisplay type={icon} className="w-6 h-6 grayscale" />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <Pause className="w-3 h-3 mr-1" />
                {frequency}
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 text-base font-bold leading-tight">
              {medicineName} {dose} {unit}
            </p>
          </div>
        </div>

        <div className="flex flex-1 gap-3 flex-wrap pt-3 justify-start border-t border-slate-200 dark:border-slate-700/50">
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-3 bg-[#054A91] text-white text-sm font-medium hover:bg-opacity-90 transition-colors"
          >
            <Play className="w-4 h-4 mr-1.5" /> Reanudar
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-3 bg-white dark:bg-transparent border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Archive className="w-4 h-4 mr-1.5" /> Finalizar
          </button>
        </div>
      </div>
    );
  }

  // Finished Style
  if (status === "finished") {
    return (
      <div
        onClick={handleCardClick}
        className="flex flex-col gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 p-4 shadow-sm border border-gray-100 dark:border-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors opacity-75"
      >
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
            <MedicineIconDisplay type={icon} className="w-6 h-6 grayscale" />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <Archive className="w-3 h-3 mr-1" />
                Finalizado
              </span>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-base font-bold leading-tight line-through">
              {medicineName} {dose} {unit}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm font-normal leading-normal">
              {endDate}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active / Default Style
  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col gap-3 rounded-xl bg-[#F7F9FC] dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-center gap-4">
        {/* Medicine Icon */}
        <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-[#054A91]/10 dark:bg-[#054A91]/20 text-[#054A91] dark:text-[#81A4CD]">
          <MedicineIconDisplay type={icon} className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#00B8A5]/10 text-[#00B8A5]">
              {frequency}
            </span>
            {nextDose && (
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
                Siguiente: {nextDose}
              </span>
            )}
          </div>

          <p className="text-[#054A91] dark:text-white text-base font-bold leading-tight truncate">
            {medicineName} {dose} {unit}
          </p>
        </div>
      </div>

      <div className="flex flex-1 gap-3 flex-wrap pt-3 justify-start border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-3 bg-white dark:bg-gray-700 border border-[#054A91]/30 dark:border-gray-600 text-[#054A91] dark:text-gray-200 text-sm font-medium hover:bg-[#054A91]/5 dark:hover:bg-gray-600 transition-colors"
        >
          <Pause className="w-4 h-4 mr-1.5" /> Pausar
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-3 bg-white dark:bg-transparent border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Archive className="w-4 h-4 mr-1.5" /> Finalizar
        </button>
      </div>
    </div>
  );
}
