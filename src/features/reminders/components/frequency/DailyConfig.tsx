import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { INTERVAL_OPTIONS } from "../../utils/frequency-utils";
import {
  isToday,
  isTomorrow,
  parse,
  addDays,
  isPast,
  setHours,
  setMinutes,
} from "date-fns";
import { Check, X } from "lucide-react";

interface DailyConfigProps {
  onConfirm: (
    value: string,
    time?: string,
    logs?: Record<string, "taken" | "skipped" | undefined>,
  ) => void;
  initialInterval?: string;
  initialTime?: string;
  startDate?: string;
  initialLogs?: Record<string, "taken" | "skipped" | undefined>;
}

export function DailyConfig({
  onConfirm,
  initialInterval = "8h",
  initialTime = "08:00",
  startDate,
  initialLogs,
}: DailyConfigProps) {
  const [selectedInterval, setSelectedInterval] =
    useState<string>(initialInterval);
  const [startTime, setStartTime] = useState<string>(initialTime);

  // State to track actions for past doses: { "timeStr": "taken" | "skipped" }
  const [pastDoseActions, setPastDoseActions] = useState<
    Record<string, "taken" | "skipped" | undefined>
  >(initialLogs || {});

  const projectedDailyDoses = useMemo(() => {
    if (!selectedInterval || !startTime) return [];

    const hours = parseInt(selectedInterval.replace("h", ""));
    const [startH, startM] = startTime.split(":").map(Number);
    const dosesCount = Math.floor(24 / hours);
    const result = [];

    // Parse start date or default to today
    const start = startDate
      ? parse(startDate, "yyyy-MM-dd", new Date())
      : new Date();

    for (let i = 0; i < dosesCount; i++) {
      let h = startH + hours * i;
      const dayOffset = Math.floor(h / 24);
      h = h % 24;

      const timeStr = `${h.toString().padStart(2, "0")}:${startM.toString().padStart(2, "0")}`;
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      const niceTime = `${h12}:${startM.toString().padStart(2, "0")} ${ampm}`;

      // Calculate the specific date and time for this dose
      const doseDate = addDays(start, dayOffset);
      // Set the specific time logic for comparison (approximated for UX)
      const specificDoseDateTime = setMinutes(setHours(doseDate, h), startM);

      const isDosePast = isPast(specificDoseDateTime); // Simple check if time passed

      let label = "Hoy"; // Default fallback
      if (isToday(doseDate)) label = "Hoy";
      else if (isTomorrow(doseDate)) label = "Mañana";
      else {
        // Format: "Jue 5 Oct"
        const formatted = doseDate.toLocaleDateString("es-ES", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
        label = formatted.charAt(0).toUpperCase() + formatted.slice(1);
      }

      result.push({
        time: niceTime,
        raw: timeStr,
        day: label,
        isPast: isDosePast,
        id: `${label}-${timeStr}`, // Simple ID
      });
    }
    return result; // Show all doses
  }, [selectedInterval, startTime, startDate]);

  const togglePastDoseAction = (id: string, action: "taken" | "skipped") => {
    setPastDoseActions((prev) => ({
      ...prev,
      [id]: prev[id] === action ? undefined : action,
    }));
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex-1 flex flex-col gap-6">
        <div className="text-sm text-center text-slate-500 dark:text-gray-400 px-4">
          Elige cada cuánto tiempo debes tomar el medicamento.
        </div>
        <div className="grid grid-cols-3 gap-3">
          {INTERVAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedInterval(opt.value)}
              className={`flex flex-col items-center justify-center p-2 h-20 rounded-xl border transition-all ${selectedInterval === opt.value ? "bg-[#054A91]/10 border-[#054A91] dark:bg-[#054A91]/20" : "bg-slate-50 dark:bg-gray-800 border-slate-200 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-gray-700"}`}
            >
              <span
                className={`text-lg font-bold ${selectedInterval === opt.value ? "text-[#054A91] dark:text-white" : "text-slate-700 dark:text-gray-300"}`}
              >
                {opt.value}
              </span>
              <span className="text-[10px] text-gray-400 text-center leading-tight">
                {opt.detail}
              </span>
            </button>
          ))}
        </div>
        {/* Projection */}
        <div className="bg-slate-50 dark:bg-gray-800/50 rounded-xl border border-slate-100 dark:border-gray-800 p-4 mt-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium dark:text-white">
                Primera toma
              </span>
              <span className="text-xs text-gray-500 text-left">
                Hora de inicio
              </span>
            </div>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-base font-bold dark:text-white dark:[color-scheme:dark] border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-[#054A91]/20 outline-none"
            />
          </div>
          <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 dark:border-gray-700 ml-1">
            {projectedDailyDoses.map((dose, i) => {
              const action = pastDoseActions[dose.id];

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 text-sm relative transition-all ${dose.isPast ? "opacity-100" : ""}`}
                >
                  <div
                    className={`absolute -left-[21px] size-3 rounded-full border-2 border-white dark:border-gray-800 z-10 ${
                      dose.isPast
                        ? action === "taken"
                          ? "bg-green-500 ring-2 ring-green-100 dark:ring-green-900"
                          : action === "skipped"
                            ? "bg-slate-400 ring-2 ring-slate-100 dark:ring-slate-800"
                            : "bg-orange-400 ring-2 ring-orange-100 dark:ring-orange-900"
                        : i === 0
                          ? "bg-[#00B8A5]"
                          : "bg-slate-300 dark:bg-gray-600"
                    }`}
                  ></div>

                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-semibold ${
                          dose.isPast && !action
                            ? "text-orange-500 dark:text-orange-400"
                            : dose.isPast && action === "taken"
                              ? "text-green-600 dark:text-green-400 line-through decoration-slate-300"
                              : dose.isPast && action === "skipped"
                                ? "text-slate-400 line-through"
                                : i === 0
                                  ? "text-slate-900 dark:text-white"
                                  : "text-slate-500 dark:text-gray-400"
                        }`}
                      >
                        {dose.time}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm font-bold ${
                          dose.isPast
                            ? "bg-transparent text-gray-400 pl-0"
                            : "text-gray-500 bg-slate-200/50 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {dose.day}
                      </span>
                    </div>

                    {/* Past Dose Actions */}
                    {dose.isPast && (
                      <div className="flex items-center gap-1 animate-in fade-in zoom-in duration-200">
                        {!action ? (
                          <>
                            <button
                              onClick={() =>
                                togglePastDoseAction(dose.id, "skipped")
                              }
                              className="size-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-gray-700 text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                            <button
                              onClick={() =>
                                togglePastDoseAction(dose.id, "taken")
                              }
                              className="size-7 flex items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors shadow-sm"
                            >
                              <Check size={14} strokeWidth={3} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              togglePastDoseAction(dose.id, action)
                            }
                            className={`text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${
                              action === "taken"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-slate-100 text-slate-500 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {action === "taken" ? (
                              <Check size={12} />
                            ) : (
                              <X size={12} />
                            )}
                            {action === "taken" ? "Tomada" : "Omitida"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <DrawerFooter className="pt-4 px-0">
        <Button
          onClick={() => {
            const cleanLogs = Object.entries(pastDoseActions).reduce(
              (acc, [k, v]) => {
                if (v) acc[k] = v;
                return acc;
              },
              {} as Record<string, "taken" | "skipped">,
            );
            onConfirm(selectedInterval, startTime, cleanLogs);
          }}
          className="w-full h-12 rounded-xl text-base font-bold bg-[#054A91] hover:bg-[#054A91]/90 text-white shadow-lg shadow-blue-900/20"
          disabled={!selectedInterval}
        >
          Confirmar Frecuencia
        </Button>
      </DrawerFooter>
    </div>
  );
}
