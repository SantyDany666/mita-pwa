import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Calendar as CalendarIcon, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  getSmartDateLabel,
  getTodayString,
  getTomorrowString,
} from "../utils/date-utils";

interface StartSelectionDrawerProps {
  value: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
  children: React.ReactNode;
}

export function StartSelectionDrawer({
  value,
  onSelect,
  children,
}: StartSelectionDrawerProps) {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value || getTodayString());

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTempDate(value || getTodayString());
    }
  };

  const handleConfirm = () => {
    onSelect(tempDate);
    setOpen(false);
  };

  const today = getTodayString();
  const tomorrow = getTomorrowString();

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-white dark:bg-gray-900 dark:border-gray-800 max-h-[90vh] flex flex-col">
        <div className="mx-auto w-full max-w-sm flex flex-col flex-1 overflow-hidden">
          <DrawerHeader className="pb-0 shrink-0">
            <DrawerTitle className="text-center text-lg font-bold text-[#054A91] dark:text-[#81A4CD] pt-2">
              ¿Cuándo inicias el tratamiento?
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4 pt-6 space-y-6">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setTempDate(today)}
                className={cn(
                  "flex-1 h-12 rounded-xl text-sm font-semibold transition-all border-2 flex items-center justify-center gap-2",
                  tempDate === today
                    ? "border-[#054A91] bg-[#054A91]/5 text-[#054A91] dark:border-[#81A4CD] dark:bg-[#81A4CD]/10 dark:text-[#81A4CD]"
                    : "border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700",
                )}
              >
                {tempDate === today && <Check size={16} />}
                Hoy
              </button>
              <button
                onClick={() => setTempDate(tomorrow)}
                className={cn(
                  "flex-1 h-12 rounded-xl text-sm font-semibold transition-all border-2 flex items-center justify-center gap-2",
                  tempDate === tomorrow
                    ? "border-[#054A91] bg-[#054A91]/5 text-[#054A91] dark:border-[#81A4CD] dark:bg-[#81A4CD]/10 dark:text-[#81A4CD]"
                    : "border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700",
                )}
              >
                {tempDate === tomorrow && <Check size={16} />}
                Mañana
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 dark:text-gray-400 text-center">
                O selecciona una fecha específica
              </p>
              <div className="flex justify-center">
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="w-full p-4 text-center text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-[#054A91]/20 dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-gray-800">
              <div className="size-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-[#054A91] dark:text-[#81A4CD] shadow-sm shrink-0">
                <CalendarIcon size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Fecha de inicio seleccionada
                </p>
                <p className="font-bold text-[#054A91] dark:text-white capitalize">
                  {getSmartDateLabel(tempDate)}
                </p>
              </div>
            </div>
          </div>

          <DrawerFooter className="pt-4 px-4 pb-8">
            <Button
              onClick={handleConfirm}
              className="w-full h-14 rounded-xl text-lg font-bold bg-[#054A91] hover:bg-[#054A91]/90 text-white shadow-lg shadow-blue-900/20"
            >
              Confirmar Fecha
            </Button>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="w-full h-12 rounded-xl text-slate-500 dark:text-gray-400"
              >
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
