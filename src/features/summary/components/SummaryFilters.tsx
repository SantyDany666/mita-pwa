import { Check } from "lucide-react";
import { SummaryEventType } from "../services/summary.service";
import { cn } from "@/lib/utils";

interface SummaryFiltersProps {
  dateRange: { start: Date; end: Date };
  onDateChange: (range: { start: Date; end: Date }) => void;
  onPresetChange: (preset: "today" | "last7" | "last30") => void;
  selectedCategories: SummaryEventType[];
  onToggleCategory: (category: SummaryEventType) => void;
  activePreset: "today" | "last7" | "last30" | null;
}

export function SummaryFilters({
  dateRange,
  onDateChange,
  onPresetChange,
  selectedCategories,
  onToggleCategory,
}: Omit<SummaryFiltersProps, "activePreset">) {
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    if (!isNaN(newStart.getTime())) {
      onDateChange({ ...dateRange, start: newStart });
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    if (!isNaN(newEnd.getTime())) {
      onDateChange({ ...dateRange, end: newEnd });
    }
  };

  const activePreset = (function () {
    const now = new Date();
    const isToday = (d: Date) =>
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    if (isToday(dateRange.start) && isToday(dateRange.end)) return "today";

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    if (
      dateRange.start.getDate() === sevenDaysAgo.getDate() &&
      dateRange.start.getMonth() === sevenDaysAgo.getMonth() &&
      isToday(dateRange.end)
    )
      return "last7";

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    if (
      dateRange.start.getDate() === thirtyDaysAgo.getDate() &&
      dateRange.start.getMonth() === thirtyDaysAgo.getMonth() &&
      isToday(dateRange.end)
    )
      return "last30";

    return null;
  })();

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "today", label: "Hoy" },
          { id: "last7", label: "Últimos 7 días" },
          { id: "last30", label: "Últimos 30 días" },
        ].map((preset) => {
          const isActive = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onPresetChange(preset.id as "today" | "last7" | "last30")}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap active:scale-95 transition-all shadow-sm border",
                isActive
                  ? "bg-[#054A91] text-white border-[#054A91] shadow-[#054A91]/20"
                  : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#054A91]/30 text-gray-400",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Custom Range Picker (Native for Mobile UX) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative group">
          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 absolute -top-2 left-3 bg-white dark:bg-gray-900 px-1 z-10">
            Desde
          </label>
          <input
            type="date"
            value={formatDateForInput(dateRange.start)}
            onChange={handleStartChange}
            className="w-full py-3 px-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-[#054A91] outline-none transition-all dark:[color-scheme:dark]"
          />
        </div>
        <div className="relative group">
          <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 absolute -top-2 left-3 bg-white dark:bg-gray-900 px-1 z-10">
            Hasta
          </label>
          <input
            type="date"
            value={formatDateForInput(dateRange.end)}
            onChange={handleEndChange}
            className="w-full py-3 px-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-[#054A91] outline-none transition-all dark:[color-scheme:dark]"
          />
        </div>
      </div>

      {/* Category Toggles */}
      <div className="flex gap-2">
        {(["dose", "symptom", "mood"] as SummaryEventType[]).map((cat) => {
          const isActive = selectedCategories.includes(cat);
          const labels: Record<SummaryEventType, string> = {
            dose: "Dosis",
            symptom: "Síntomas",
            mood: "Ánimo",
          };
          const colors: Record<SummaryEventType, string> = {
            dose: "bg-blue-500",
            symptom: "bg-orange-500",
            mood: "bg-purple-500",
          };

          return (
            <button
              key={cat}
              onClick={() => onToggleCategory(cat)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all text-sm font-semibold",
                isActive
                  ? "bg-white dark:bg-gray-800 border-[#054A91] dark:border-[#81A4CD] text-[#054A91] dark:text-[#81A4CD] shadow-md shadow-[#054A91]/5"
                  : "bg-gray-50 dark:bg-gray-800/50 border-transparent text-gray-400 dark:text-gray-600",
              )}
            >
              <div
                className={cn(
                  "size-2 rounded-full",
                  isActive ? colors[cat] : "bg-gray-300 dark:bg-gray-700",
                )}
              />
              {labels[cat]}
              {isActive && <Check className="size-3" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
