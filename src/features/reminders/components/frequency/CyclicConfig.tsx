import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { Calendar } from "lucide-react";
import {
  parse,
  addDays,
  addWeeks,
  addMonths,
  isToday,
  isTomorrow,
} from "date-fns";

interface CyclicConfigProps {
  onConfirm: (value: string, time?: string) => void;
  initialValue?: string;
  initialUnit?: "days" | "weeks" | "months";
  initialTime?: string;
  startDate?: string;
}

export function CyclicConfig({
  onConfirm,
  initialValue = "2",
  initialUnit = "days",
  initialTime = "08:00",
  startDate,
}: CyclicConfigProps) {
  const [cycleValue, setCycleValue] = useState<string>(initialValue);
  const [cycleUnit, setCycleUnit] = useState<"days" | "weeks" | "months">(
    initialUnit,
  );
  const [cycleStartTime, setCycleStartTime] = useState<string>(initialTime);

  const projectedCycles = useMemo(() => {
    const val = parseInt(cycleValue) || 1;
    const result = [];

    // Use startDate if available, otherwise today
    const start = startDate
      ? parse(startDate, "yyyy-MM-dd", new Date())
      : new Date();

    for (let i = 0; i < 3; i++) {
      let d = new Date(start);
      if (cycleUnit === "days") d = addDays(start, val * i);
      if (cycleUnit === "weeks") d = addWeeks(start, val * i);
      if (cycleUnit === "months") d = addMonths(start, val * i);

      // Format date in Spanish
      let dayName = "";
      if (isToday(d)) {
        dayName = "Hoy";
      } else if (isTomorrow(d)) {
        dayName = "Mañana";
      } else {
        dayName = d.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "short",
        });
        // Capitalize first letter
        dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      }

      result.push({ date: dayName, time: cycleStartTime });
    }
    return result;
  }, [cycleValue, cycleUnit, cycleStartTime, startDate]);

  const handleConfirm = () => {
    onConfirm(`cycle:${cycleValue}${cycleUnit}`, cycleStartTime);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex-1 flex flex-col gap-6">
        <div className="text-center text-sm text-gray-500">
          Configura el intervalo de repetición:
        </div>
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700">
          <span className="text-sm font-medium whitespace-nowrap dark:text-gray-300">
            Repetir cada
          </span>
          <input
            type="number"
            min="1"
            max="99"
            value={cycleValue}
            onChange={(e) => setCycleValue(e.target.value)}
            className="w-16 h-12 text-center text-lg font-bold rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#054A91]/20"
          />
          <select
            value={cycleUnit}
            onChange={(e) =>
              setCycleUnit(e.target.value as "days" | "weeks" | "months")
            }
            className="flex-1 h-12 px-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white font-medium outline-none"
          >
            <option value="days">Días</option>
            <option value="weeks">Semanas</option>
            <option value="months">Meses</option>
          </select>
        </div>

        <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-slate-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium dark:text-white">
              Hora de la toma
            </span>
            <input
              type="time"
              value={cycleStartTime}
              onChange={(e) => setCycleStartTime(e.target.value)}
              className="bg-white dark:bg-gray-700 rounded-lg px-2 py-1 text-sm font-bold dark:text-white dark:[color-scheme:dark] border border-gray-200 dark:border-gray-600 outline-none"
            />
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold text-gray-400 uppercase">
              Próximas fechas:
            </span>
            {projectedCycles.map((cyc, i) => (
              <div key={i} className="flex items-center gap-3">
                <Calendar
                  size={16}
                  className="text-[#054A91] dark:text-[#81A4CD]"
                />
                <span className="text-sm font-semibold capitalize dark:text-white">
                  {cyc.date}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {cyc.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DrawerFooter className="pt-4 px-0">
        <Button
          onClick={handleConfirm}
          className="w-full h-12 rounded-xl text-base font-bold bg-[#054A91] hover:bg-[#054A91]/90 text-white shadow-lg shadow-blue-900/20"
        >
          Confirmar Frecuencia
        </Button>
      </DrawerFooter>
    </div>
  );
}
