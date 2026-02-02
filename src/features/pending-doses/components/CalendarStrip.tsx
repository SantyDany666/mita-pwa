import { useRef } from "react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarStripProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function CalendarStrip({
  selectedDate,
  onDateSelect,
}: CalendarStripProps) {
  const today = startOfDay(new Date());

  const days = Array.from({ length: 7 }, (_, i) => {
    return addDays(today, i - 2);
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollContainerRef}
      className="flex overflow-x-auto px-4 py-3 gap-3 hide-scrollbar bg-white dark:bg-gray-900"
    >
      {days.map((date, idx) => {
        const isActive = isSameDay(date, selectedDate);
        const dayName = format(date, "EEE", { locale: es }).replace(".", "");
        const dayNum = format(date, "d");

        return (
          <button
            key={idx}
            onClick={() => onDateSelect(date)}
            className={`flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-2xl transition-all duration-200 ${
              isActive
                ? "bg-[#054A91] text-white shadow-md active:scale-95"
                : "bg-[#F7F9FC] dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95"
            }`}
          >
            <span
              className={`text-[10px] font-medium uppercase leading-tight ${
                isActive ? "text-white/80" : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {dayName}
            </span>
            <span
              className={`text-base font-bold leading-tight ${
                isActive ? "text-white" : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {dayNum}
            </span>
            {isActive && (
              <div className="w-1 h-1 bg-white rounded-full mt-0.5"></div>
            )}
            {!isActive && isSameDay(date, today) && (
              <div className="w-1 h-1 bg-[#054A91] rounded-full mt-0.5"></div>
            )}
          </button>
        );
      })}
    </div>
  );
}
