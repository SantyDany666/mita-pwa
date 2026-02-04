import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { Pill, CalendarCheck } from "lucide-react";
import { getEstimate, formatDate } from "../../utils/duration-utils";
import { parse } from "date-fns";

interface FixedDaysConfigProps {
  onConfirm: (value: string) => void;
  frequency: string;
  initialValue?: string;
  initialUnit?: "days" | "weeks" | "months";
  startDate?: string;
}

export function FixedDaysConfig({
  onConfirm,
  frequency,
  initialValue = "5",
  initialUnit = "days",
  startDate,
}: FixedDaysConfigProps) {
  const [value, setValue] = useState<string>(initialValue);
  const [unit, setUnit] = useState<"days" | "weeks" | "months">(initialUnit);

  const projection = useMemo(() => {
    const d = parseInt(value) || 0;

    const totalDoses = getEstimate(frequency, d, unit);

    const endDate = startDate
      ? parse(startDate, "yyyy-MM-dd", new Date())
      : new Date();

    if (unit === "days") endDate.setDate(endDate.getDate() + d);
    if (unit === "weeks") endDate.setDate(endDate.getDate() + d * 7);
    if (unit === "months") endDate.setMonth(endDate.getMonth() + d);

    return { totalDoses, endDate };
  }, [value, unit, frequency, startDate]);

  const handleConfirm = () => {
    onConfirm(`${unit}:${value}`);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex-1 flex flex-col gap-6">
        <div className="text-sm text-center text-slate-500 dark:text-gray-400 px-4">
          ¿Por cuánto tiempo seguirás el tratamiento?
        </div>

        <div className="flex justify-center flex-col items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700">
            <input
              type="number"
              min="1"
              max="365"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-24 h-16 text-center text-3xl font-bold rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#054A91]/20"
            />
          </div>

          <div className="flex bg-slate-100 dark:bg-gray-800 p-1 rounded-lg">
            {(["days", "weeks", "months"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  unit === u
                    ? "bg-white dark:bg-gray-700 text-[#054A91] dark:text-[#81A4CD] shadow-sm"
                    : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200"
                }`}
              >
                {u === "days" ? "Días" : u === "weeks" ? "Semanas" : "Meses"}
              </button>
            ))}
          </div>
        </div>

        {/* Smart Feedback */}
        {parseInt(value) > 0 && (
          <div className="bg-[#054A91]/5 dark:bg-[#054A91]/10 rounded-xl border border-[#054A91]/10 dark:border-[#054A91]/20 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-[#054A91] dark:text-[#81A4CD] shadow-sm">
                <CalendarCheck size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Fecha de finalización
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatDate(projection.endDate)}
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
          disabled={!value || parseInt(value) <= 0}
        >
          Confirmar Duración
        </Button>
      </DrawerFooter>
    </div>
  );
}
