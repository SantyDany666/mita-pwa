import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { Pill, CalendarCheck } from "lucide-react";
import { getEstimate, formatDate } from "../../utils/duration-utils";

interface FixedDaysConfigProps {
  onConfirm: (value: string) => void;
  frequency: string;
  initialValue?: string;
}

export function FixedDaysConfig({
  onConfirm,
  frequency,
  initialValue = "5",
}: FixedDaysConfigProps) {
  const [days, setDays] = useState<string>(initialValue);

  const projection = useMemo(() => {
    const d = parseInt(days) || 0;
    const totalDoses = getEstimate(frequency, d, "days");

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + d);

    return { totalDoses, endDate };
  }, [days, frequency]);

  const handleConfirm = () => {
    onConfirm(`days:${days}`);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex-1 flex flex-col gap-6">
        <div className="text-sm text-center text-slate-500 dark:text-gray-400 px-4">
          ¿Por cuántos días seguirás el tratamiento?
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700">
            <input
              type="number"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-24 h-16 text-center text-3xl font-bold rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#054A91]/20"
            />
            <span className="text-lg font-medium text-slate-600 dark:text-gray-300">
              Días
            </span>
          </div>
        </div>

        {/* Smart Feedback */}
        {parseInt(days) > 0 && (
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
          disabled={!days || parseInt(days) <= 0}
        >
          Confirmar Duración
        </Button>
      </DrawerFooter>
    </div>
  );
}
