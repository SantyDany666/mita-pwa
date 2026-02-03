import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { Pill, Clock } from "lucide-react";
import {
  getEstimate,
  getDaysFromDate,
  formatDate,
  parseLocalDate,
} from "../../utils/duration-utils";
import { parse } from "date-fns";

interface SpecificDateConfigProps {
  onConfirm: (value: string) => void;
  frequency: string;
  initialValue?: string;
  startDate?: string;
}

export function SpecificDateConfig({
  onConfirm,
  frequency,
  initialValue,
  startDate,
}: SpecificDateConfigProps) {
  // Default to start date + 1 day, or today + 1 day
  const defaultBase = startDate
    ? parse(startDate, "yyyy-MM-dd", new Date())
    : new Date();
  const defaultDate = new Date(defaultBase);
  defaultDate.setDate(defaultDate.getDate() + 1);
  const minDate = defaultDate.toISOString().split("T")[0];

  const [dateStr, setDateStr] = useState<string>(initialValue || minDate);

  const projection = useMemo(() => {
    if (!dateStr) return null;
    const targetDate = parseLocalDate(dateStr); // Use safe parser

    // Pass startDate to calculate diff from the start of treatment
    const start = startDate
      ? parse(startDate, "yyyy-MM-dd", new Date())
      : undefined;
    const daysDiff = getDaysFromDate(targetDate, start);

    const totalDoses = getEstimate(frequency, daysDiff, "days");

    return { totalDoses, daysDiff, formattedDate: formatDate(targetDate) };
  }, [dateStr, frequency, startDate]);

  const handleConfirm = () => {
    onConfirm(`date:${dateStr}`);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex-1 flex flex-col gap-6">
        <div className="text-sm text-center text-slate-500 dark:text-gray-400 px-4">
          Selecciona la fecha de la última toma.
        </div>

        <div className="flex justify-center">
          <input
            type="date"
            min={minDate}
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full p-4 text-center text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#054A91]/20 dark:[color-scheme:dark]"
          />
        </div>

        {/* Smart Feedback */}
        {projection && (
          <div className="bg-[#054A91]/5 dark:bg-[#054A91]/10 rounded-xl border border-[#054A91]/10 dark:border-[#054A91]/20 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-[#054A91] dark:text-[#81A4CD] shadow-sm">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Duración total
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {projection.daysDiff} días de tratamiento
                </p>
              </div>
            </div>

            {projection.totalDoses > 0 && (
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-[#00B8A5] shadow-sm">
                  <Pill size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Total de dosis estimadas
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    ~ {Math.round(projection.totalDoses)} tomas
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <DrawerFooter className="pt-4 px-0">
        <Button
          onClick={handleConfirm}
          className="w-full h-12 rounded-xl text-base font-bold bg-[#054A91] hover:bg-[#054A91]/90 text-white shadow-lg shadow-blue-900/20"
          disabled={!dateStr}
        >
          Confirmar Fecha
        </Button>
      </DrawerFooter>
    </div>
  );
}
