import { Play, Pause, CheckCircle, Archive, Clock } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export interface ReminderCardProps {
  id?: string;
  medicineName: string;
  dose: string;
  unit: string;
  frequency: string; // Displayed where "time" is in DoseCard
  status: "active" | "paused" | "finished";
  nextDose?: string; // Additional info for active
  endDate?: string; // Additional info for finished
}

export function ReminderCard({
  id = "1", // Default ID for testing
  medicineName,
  dose,
  unit,
  frequency,
  status,
  nextDose,
  endDate,
}: ReminderCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({ to: "/reminders/$id", params: { id } });
  };

  if (status === "paused") {
    return (
      <div
        onClick={handleCardClick}
        className="flex flex-col gap-3 rounded-lg bg-[#F0F7FF] dark:bg-[#3E7CB1]/10 p-4 shadow-sm border border-[#81A4CD]/30 dark:border-[#81A4CD]/20 cursor-pointer transition-colors hover:bg-[#E6F0FF] dark:hover:bg-[#3E7CB1]/20"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-[#3E7CB1] dark:text-[#81A4CD] text-sm font-bold leading-normal">
              {frequency}
            </p>
            <p className="text-[#054A91] dark:text-[#DBE4EE] text-base font-bold leading-tight">
              {medicineName}
            </p>
            <p className="text-gray-500 dark:text-[#81A4CD]/80 text-sm font-normal leading-normal">
              {dose} {unit}
            </p>
          </div>
          <div className="text-[#3E7CB1] dark:text-[#81A4CD]">
            <Pause className="w-6 h-6" />
          </div>
        </div>

        <div className="flex flex-1 gap-3 flex-wrap pt-3 justify-start border-t border-[#81A4CD]/20 dark:border-[#81A4CD]/20">
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#3E7CB1] text-white text-sm font-medium leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
          >
            <span className="truncate flex items-center gap-2">
              <Play className="w-4 h-4" /> Reanudar
            </span>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-transparent border border-[#81A4CD]/50 dark:border-[#81A4CD]/30 text-[#3E7CB1] dark:text-[#81A4CD] text-sm font-medium leading-normal tracking-[0.015em] hover:bg-blue-50 dark:hover:bg-[#3E7CB1]/10 transition-colors"
          >
            <span className="truncate flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Finalizar
            </span>
          </button>
        </div>
      </div>
    );
  }

  if (status === "finished") {
    return (
      <div
        onClick={handleCardClick}
        className="flex flex-col gap-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 shadow-sm opacity-80 border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium leading-normal">
              {frequency}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-base font-bold leading-tight line-through">
              {medicineName}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm font-normal leading-normal">
              {dose} {unit}
            </p>
            {endDate && (
              <p className="text-xs text-gray-400 mt-1">
                Finalizado: {endDate}
              </p>
            )}
          </div>
          <div className="text-gray-400 dark:text-gray-500">
            <Archive className="w-6 h-6" />
          </div>
        </div>
        {/* No actions for finished */}
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col gap-3 rounded-lg bg-[#F7F9FC] dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <p className="text-[#00B8A5] dark:text-[#00B8A5] text-sm font-medium leading-normal">
            {frequency}
          </p>
          <p className="text-[#054A91] dark:text-white text-base font-bold leading-tight">
            {medicineName}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
            {dose} {unit}
          </p>
          {nextDose && (
            <p className="text-[#00B8A5] text-xs font-semibold mt-1">
              Próxima: {nextDose}
            </p>
          )}
        </div>
        <div className="text-[#00B8A5] dark:text-[#00B8A5]">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      <div className="flex flex-1 gap-3 flex-wrap pt-3 justify-start border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#054A91] dark:bg-[#054A91] text-white text-sm font-medium leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
        >
          <span className="truncate flex items-center gap-2">
            <Pause className="w-4 h-4" /> Pausar
          </span>
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="truncate flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Finalizar
          </span>
        </button>
      </div>
    </div>
  );
}
