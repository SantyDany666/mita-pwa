import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Zap, Pill, Activity, SmilePlus } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { SosDoseDrawer } from "@/features/pending-doses/components/SosDoseDrawer";
import { toast } from "sonner";

interface GlobalActionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalActionDrawer({
  open,
  onOpenChange,
}: GlobalActionDrawerProps) {
  const [isSosOpen, setIsSosOpen] = useState(false);

  const handleSoon = () => {
    toast.info("Próximamente disponible");
    onOpenChange(false);
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 w-full outline-none pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader className="relative pb-2">
              <DrawerTitle className="text-center text-[#054A91] dark:text-[#81A4CD] text-xl font-bold">
                ¿Qué deseas registrar?
              </DrawerTitle>
            </DrawerHeader>

            <div className="p-4 grid grid-cols-2 gap-3 mb-4">
              {/* Toma Rápida (SOS) */}
              <button
                onClick={() => {
                  onOpenChange(false);
                  setIsSosOpen(true);
                }}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-800 transition-all group active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-orange-500 shadow-sm group-hover:scale-110 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-all">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Dosis Rápida
                </span>
              </button>

              {/* Nuevo Recordatorio */}
              <Link
                to="/reminders/create"
                onClick={() => onOpenChange(false)}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200 dark:hover:border-blue-800 transition-all group active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-[#054A91] dark:text-[#81A4CD] shadow-sm group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all">
                  <Pill className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Recordatorio
                </span>
              </Link>

              {/* Síntoma */}
              <button
                onClick={handleSoon}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:border-purple-200 dark:hover:border-purple-800 transition-all group active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-purple-500 shadow-sm group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-all">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  Síntoma
                </span>
              </button>

              {/* Estado de Ánimo */}
              <button
                onClick={handleSoon}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:bg-pink-50 dark:hover:bg-pink-900/10 hover:border-pink-200 dark:hover:border-pink-800 transition-all group active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-pink-500 shadow-sm group-hover:scale-110 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/30 transition-all">
                  <SmilePlus className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-300 text-sm text-center leading-tight">
                  Estado de Ánimo
                </span>
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Embedded specific drawers */}
      <SosDoseDrawer open={isSosOpen} onOpenChange={setIsSosOpen} />
    </>
  );
}
