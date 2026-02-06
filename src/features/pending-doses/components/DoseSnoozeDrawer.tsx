import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { addHours, addMinutes } from "date-fns";

interface DoseSnoozeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSnooze: (date: Date) => void;
}

export function DoseSnoozeDrawer({
  open,
  onOpenChange,
  onSnooze,
}: DoseSnoozeDrawerProps) {
  const handleOption = (action: "15m" | "30m" | "1h" | "2h") => {
    const now = new Date();
    let newDate = now;

    switch (action) {
      case "15m":
        newDate = addMinutes(now, 15);
        break;
      case "30m":
        newDate = addMinutes(now, 30);
        break;
      case "1h":
        newDate = addHours(now, 1);
        break;
      case "2h":
        newDate = addHours(now, 2);
        break;
    }
    onSnooze(newDate);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-center text-[#054A91] dark:text-[#81A4CD] text-xl font-bold">
              Posponer Dosis
            </DrawerTitle>
            <p className="text-center text-gray-500 text-sm mt-1">
              ¿En cuánto tiempo te recordamos?
            </p>
          </DrawerHeader>

          <div className="p-4 pb-2 flex flex-col gap-3">
            {/* 15 Minutes */}
            <button
              onClick={() => handleOption("15m")}
              className="flex items-center justify-between w-full p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 hover:border-slate-200 transition-all group"
            >
              <span className="font-semibold text-gray-900 dark:text-gray-100 pl-2">
                En 15 minutos
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>

            {/* 30 Minutes */}
            <button
              onClick={() => handleOption("30m")}
              className="flex items-center justify-between w-full p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 hover:border-slate-200 transition-all group"
            >
              <span className="font-semibold text-gray-900 dark:text-gray-100 pl-2">
                En 30 minutos
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>

            {/* 1 Hour */}
            <button
              onClick={() => handleOption("1h")}
              className="flex items-center justify-between w-full p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 hover:border-slate-200 transition-all group"
            >
              <span className="font-semibold text-gray-900 dark:text-gray-100 pl-2">
                En 1 hora
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>

            {/* 2 Hours */}
            <button
              onClick={() => handleOption("2h")}
              className="flex items-center justify-between w-full p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 hover:border-slate-200 transition-all group"
            >
              <span className="font-semibold text-gray-900 dark:text-gray-100 pl-2">
                En 2 horas
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="ghost" className="w-full text-gray-500">
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
