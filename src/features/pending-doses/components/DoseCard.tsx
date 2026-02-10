import { Check, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { MedicineIconType } from "@/features/reminders/utils/medicine-icons";
import { MedicineIconDisplay } from "@/features/reminders/components/MedicineIconDisplay";

export interface DoseCardProps {
  id?: string;
  time: string;
  medicine: string;
  status: "pending" | "taken" | "skipped" | "postponed";
  variant: "default" | "overdue";
  showActions?: boolean;
  icon?: MedicineIconType;
  takenTime?: string;
  skippedTime?: string;
  dateLabel?: string; // New prop for relative date (e.g. "Ayer")
  onTake?: () => void;
  onSkip?: () => void;
  onSnooze?: () => void;
}

export function DoseCard({
  id,
  time,
  medicine,
  status,
  variant,
  showActions = true,
  icon = "capsule",
  takenTime,
  skippedTime,
  dateLabel,
  onTake,
  onSkip,
  onSnooze,
}: DoseCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (id) {
      navigate({ to: "/reminders/$id", params: { id } });
    }
  };

  // Overdue style
  if (variant === "overdue") {
    return (
      <div
        onClick={handleCardClick}
        className="flex flex-col gap-3 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 p-4 shadow-sm border border-orange-100/60 dark:border-orange-500/20 cursor-pointer hover:bg-orange-100/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Medicine Icon - Overdue Warning Color */}
          <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
            <MedicineIconDisplay type={icon} className="w-6 h-6" />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 gap-1">
                {dateLabel && (
                  <span className="opacity-75 font-normal">{dateLabel} •</span>
                )}
                {time}
              </span>
            </div>

            <p className="text-orange-800 dark:text-orange-100 text-base font-bold leading-tight truncate">
              {medicine}
            </p>
          </div>
        </div>

        {showActions && (
          <div className="flex flex-1 gap-3 flex-wrap pt-3 justify-start border-t border-orange-100/60 dark:border-orange-500/20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTake?.();
              }}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-orange-500 text-white text-sm font-medium leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
            >
              <span className="truncate">Tomar</span>
            </button>

            {/* Posponer - Ghost Variant for Overdue */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSnooze?.();
              }}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-transparent border border-orange-200/60 dark:border-orange-500/30 text-orange-700 dark:text-orange-300 text-sm font-medium leading-normal tracking-[0.015em] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
            >
              <span className="truncate">Posponer</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSkip?.();
              }}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-orange-600/70 dark:text-orange-400/70 text-sm font-medium leading-normal tracking-[0.015em] hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
            >
              <span className="truncate">Omitir</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Skipped style (Distinct from Taken)
  if (status === "skipped") {
    return (
      <div
        onClick={handleCardClick}
        className="flex flex-col gap-3 rounded-xl bg-gray-50 dark:bg-gray-900/40 p-4 shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-100 transition-colors opacity-80"
      >
        <div className="flex items-center gap-4">
          {/* Medicine Icon - Muted */}
          <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600">
            <MedicineIconDisplay
              type={icon}
              className="w-6 h-6 grayscale opacity-70"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                <X className="w-3 h-3" />
                {time} • {skippedTime || "--:--"}
              </span>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-base font-medium leading-tight truncate">
              {medicine}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Taken style (Success Theme)
  if (status === "taken") {
    return (
      <div
        onClick={handleCardClick}
        className="flex flex-col gap-3 rounded-xl bg-teal-50/50 dark:bg-teal-900/10 p-4 shadow-sm border border-teal-100/50 dark:border-teal-800/30 cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Medicine Icon - Teal/Active */}
          <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-teal-100/50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
            <MedicineIconDisplay type={icon} className="w-6 h-6" />
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                <Check className="w-3 h-3" />
                {time} • {takenTime || "--:--"}
              </span>
            </div>

            <p className="text-teal-900 dark:text-teal-50 text-base font-bold leading-tight truncate">
              {medicine}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Pending / Default style
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
              {time}
            </span>
          </div>

          <p className="text-[#054A91] dark:text-white text-base font-bold leading-tight truncate">
            {medicine}
          </p>
        </div>
      </div>
      {showActions && (
        <div className="flex flex-1 gap-3 flex-wrap pt-3 justify-start border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTake?.();
            }}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#054A91] dark:bg-[#054A91] text-white text-sm font-medium leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors"
          >
            <span className="truncate">Tomar</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSnooze?.();
            }}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="truncate">Posponer</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSkip?.();
            }}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal tracking-[0.015em] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="truncate">Omitir</span>
          </button>
        </div>
      )}
    </div>
  );
}
