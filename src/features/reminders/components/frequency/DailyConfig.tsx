import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { INTERVAL_OPTIONS } from "../../utils/frequency-utils";

interface DailyConfigProps {
  onConfirm: (value: string, time?: string) => void;
  initialInterval?: string;
  initialTime?: string;
}

export function DailyConfig({
  onConfirm,
  initialInterval = "8h",
  initialTime = "08:00",
}: DailyConfigProps) {
  const [selectedInterval, setSelectedInterval] =
    useState<string>(initialInterval);
  const [startTime, setStartTime] = useState<string>(initialTime);

  const projectedDailyDoses = useMemo(() => {
    if (!selectedInterval || !startTime) return [];

    const hours = parseInt(selectedInterval.replace("h", ""));
    const [startH, startM] = startTime.split(":").map(Number);
    const dosesCount = Math.floor(24 / hours);
    const result = [];

    for (let i = 0; i < dosesCount; i++) {
      let h = startH + hours * i;
      const dayOffset = Math.floor(h / 24);
      h = h % 24;

      const timeStr = `${h.toString().padStart(2, "0")}:${startM.toString().padStart(2, "0")}`;
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      const niceTime = `${h12}:${startM.toString().padStart(2, "0")} ${ampm}`;

      let label = "Hoy";
      if (dayOffset === 1) label = "Mañana";

      result.push({ time: niceTime, raw: timeStr, day: label });
    }
    return result;
  }, [selectedInterval, startTime]);

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
                Hora de inicio hoy
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
            {projectedDailyDoses.map((dose, i) => (
              <div key={i} className="flex items-center gap-3 text-sm relative">
                <div
                  className={`absolute -left-[21px] size-3 rounded-full border-2 border-white dark:border-gray-800 ${i === 0 ? "bg-[#00B8A5]" : "bg-slate-300 dark:bg-gray-600"}`}
                ></div>
                <span
                  className={`font-semibold ${i === 0 ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-gray-400"}`}
                >
                  {dose.time}
                </span>
                <span className="text-xs text-gray-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  {dose.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DrawerFooter className="pt-4 px-0">
        <Button
          onClick={() => onConfirm(selectedInterval, startTime)}
          className="w-full h-12 rounded-xl text-base font-bold bg-[#054A91] hover:bg-[#054A91]/90 text-white shadow-lg shadow-blue-900/20"
          disabled={!selectedInterval}
        >
          Confirmar Frecuencia
        </Button>
      </DrawerFooter>
    </div>
  );
}
