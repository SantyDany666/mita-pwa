import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { CalendarDays } from "lucide-react";
import { WEEK_DAYS } from "../../utils/frequency-utils";

interface WeekdaysConfigProps {
  onConfirm: (value: string, time?: string) => void;
  initialDays?: string[];
  initialTime?: string;
}

export function WeekdaysConfig({
  onConfirm,
  initialDays = [],
  initialTime = "08:00",
}: WeekdaysConfigProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>(initialDays);
  const [weekdayTime, setWeekdayTime] = useState<string>(initialTime);

  const toggleDay = (val: string) => {
    if (selectedDays.includes(val)) {
      setSelectedDays(selectedDays.filter((d) => d !== val));
    } else {
      setSelectedDays([...selectedDays, val]);
    }
  };

  const handleConfirm = () => {
    onConfirm(`days:${selectedDays.join(",")}`, weekdayTime);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex-1 flex flex-col gap-6">
        <div className="text-center text-sm text-gray-500 mb-2">
          Toca los días para seleccionarlos:
        </div>
        <div className="flex justify-between gap-1">
          {WEEK_DAYS.map((day) => {
            const isSelected = selectedDays.includes(day.value);
            return (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isSelected
                    ? "bg-[#054A91] text-white scale-110 shadow-md"
                    : "bg-slate-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                }`}
              >
                {day.label}
              </button>
            );
          })}
        </div>
        {selectedDays.length > 0 ? (
          <div className="bg-slate-50 dark:bg-gray-800/50 p-4 rounded-xl border border-slate-100 dark:border-gray-800 mt-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium dark:text-white">
                Hora de la toma
              </span>
              <input
                type="time"
                value={weekdayTime}
                onChange={(e) => setWeekdayTime(e.target.value)}
                className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-base font-bold dark:text-white dark:[color-scheme:dark] border border-gray-200 dark:border-gray-600 outline-none"
              />
            </div>
            <div className="text-xs text-center text-gray-400 mt-2">
              Recordatorio semanal:{" "}
              <span className="text-[#054A91] dark:text-[#81A4CD] font-bold">
                {selectedDays.length} días
              </span>{" "}
              seleccionados.
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400 opacity-50">
            <CalendarDays size={48} className="mb-2 stroke-1" />
            <span className="text-sm">Selecciona al menos un día</span>
          </div>
        )}
      </div>

      <DrawerFooter className="pt-4 px-0">
        <Button
          onClick={handleConfirm}
          className="w-full h-12 rounded-xl text-base font-bold bg-[#054A91] hover:bg-[#054A91]/90 text-white shadow-lg shadow-blue-900/20"
          disabled={selectedDays.length === 0}
        >
          Confirmar Frecuencia
        </Button>
      </DrawerFooter>
    </div>
  );
}
