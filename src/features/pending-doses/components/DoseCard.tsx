import { AlertCircle, AlarmClock, CheckCircle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export interface DoseCardProps {
  id?: string;
  time: string;
  medicine: string;
  instruction: string;
  status: "pending" | "taken" | "skipped" | "postponed";
  variant: "default" | "overdue";
  showActions?: boolean;
}

export function DoseCard({
  id = "1", // Default for dev
  time,
  medicine,
  instruction,
  status,
  variant,
  showActions = true,
}: DoseCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({ to: "/reminders/$id", params: { id } });
  };

  // Overdue style
  if (variant === "overdue") {
    return (
      <div
        onClick={handleCardClick}
        className="flex flex-col gap-3 rounded-lg bg-orange-50/50 dark:bg-orange-900/10 p-4 shadow-sm border border-orange-100 dark:border-orange-800/30 cursor-pointer hover:bg-orange-100/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-orange-600 dark:text-orange-300 text-sm font-bold leading-normal">
              {time}
            </p>
            <p className="text-[#054A91] dark:text-orange-100 text-base font-bold leading-tight">
              {medicine}
            </p>
            <p className="text-gray-600 dark:text-orange-200/70 text-sm font-normal leading-normal">
              {instruction}
            </p>
          </div>
          <div className="text-orange-500 dark:text-orange-400">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        {showActions && (
          <div className="flex flex-1 gap-3 flex-wrap pt-3 justify-start border-t border-orange-100 dark:border-orange-800/30">
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-orange-500 text-white text-sm font-medium leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
            >
              <span className="truncate">Tomada</span>
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-transparent border border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-300 text-sm font-medium leading-normal tracking-[0.015em] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
            >
              <span className="truncate">Omitida</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Taken style (Completed)
  if (status === "taken") {
    return (
      <div
        onClick={handleCardClick}
        className="flex flex-col gap-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 shadow-sm opacity-80 border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-[#00B8A5] dark:text-[#00B8A5] text-sm font-medium leading-normal">
              {time}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-base font-bold leading-tight line-through">
              {medicine}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm font-normal leading-normal">
              {instruction}
            </p>
          </div>
          <div className="text-[#00B8A5] dark:text-[#00B8A5]">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>
    );
  }

  // Pending / Default style
  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col gap-3 rounded-lg bg-[#F7F9FC] dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <p className="text-[#00B8A5] dark:text-[#00B8A5] text-sm font-medium leading-normal">
            {time}
          </p>
          <p className="text-[#054A91] dark:text-white text-base font-bold leading-tight">
            {medicine}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
            {instruction}
          </p>
        </div>
        <div className="text-[#00B8A5] dark:text-[#00B8A5]">
          <AlarmClock className="w-6 h-6" />
        </div>
      </div>
      {showActions && (
        <div className="flex flex-1 gap-3 flex-wrap pt-3 justify-start border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#054A91] dark:bg-[#054A91] text-white text-sm font-medium leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
          >
            <span className="truncate">Tomada</span>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="truncate">Omitida</span>
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="truncate">Posponer</span>
          </button>
        </div>
      )}
    </div>
  );
}
