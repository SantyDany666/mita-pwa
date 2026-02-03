import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Minus, Plus } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface InventoryState {
  stock: number;
  stockAlertEnabled: boolean;
  stockThreshold: number;
}

interface InventorySelectionDrawerProps {
  value: InventoryState;
  onSave: (value: InventoryState) => void;
  children: React.ReactNode;
}

export function InventorySelectionDrawer({
  value,
  onSave,
  children,
}: InventorySelectionDrawerProps) {
  const [open, setOpen] = useState(false);

  // Local state for the drawer
  const [currentStock, setCurrentStock] = useState(value?.stock || 0);
  const [isAlertEnabled, setIsAlertEnabled] = useState(
    value?.stockAlertEnabled || false,
  );
  const [currentThreshold, setCurrentThreshold] = useState(
    value?.stockThreshold || 5,
  );

  // Sync state when drawer opens
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setCurrentStock(value?.stock || 0);
      setIsAlertEnabled(value?.stockAlertEnabled || false);
      setCurrentThreshold(value?.stockThreshold || 5);
    }
  };

  const handleSave = () => {
    onSave({
      stock: currentStock,
      stockAlertEnabled: isAlertEnabled,
      stockThreshold: currentThreshold,
    });
    setOpen(false);
  };

  const handleStockChange = (delta: number) => {
    const newValue = Math.max(0, currentStock + delta);
    setCurrentStock(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setCurrentStock(val);
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-white dark:bg-gray-900 dark:border-gray-800 flex flex-col h-[85vh]">
        <div className="mx-auto w-full max-w-sm flex flex-col flex-1 overflow-hidden relative">
          <DrawerHeader className="pb-0 shrink-0">
            <DrawerTitle className="text-center text-lg font-bold text-[#054A91] dark:text-[#81A4CD] pt-2">
              Inventario y Alertas
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col flex-1 overflow-y-auto px-6 pb-6 mt-6">
            <p className="text-slate-500 dark:text-gray-400 text-sm font-normal leading-relaxed pb-8">
              Introduce el número total de pastillas, ampollas o dosis que
              tienes disponibles actualmente.
            </p>

            {/* Main Stock Input */}
            <div className="flex flex-col flex-1 mb-8">
              <label className="text-[#054A91] dark:text-[#81A4CD] text-xs font-bold uppercase tracking-wider leading-normal pb-3 text-center w-full">
                ¿Cuántas unidades tienes?
              </label>
              <div className="relative flex items-center justify-center">
                <button
                  onClick={() => handleStockChange(-1)}
                  className="absolute left-0 p-4 text-slate-400 hover:text-[#00B8A5] transition-colors active:scale-95 disabled:opacity-50"
                  disabled={currentStock <= 0}
                >
                  <Minus size={32} />
                </button>

                <input
                  type="number"
                  value={currentStock}
                  onChange={handleInputChange}
                  className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-2xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] h-20 placeholder:text-gray-400 p-[15px] text-3xl font-bold leading-normal text-center shadow-sm appearance-none"
                  inputMode="numeric"
                />

                <button
                  onClick={() => handleStockChange(1)}
                  className="absolute right-0 p-4 text-slate-400 hover:text-[#00B8A5] transition-colors active:scale-95"
                >
                  <Plus size={32} />
                </button>
              </div>
            </div>

            <hr className="border-t border-slate-100 dark:border-gray-800 my-2" />

            {/* Alert Configuration */}
            <div className="flex flex-col gap-6 mt-6">
              {/* Toggle Row */}
              <div className="flex items-center justify-between min-h-14">
                <div className="flex items-center gap-4">
                  <div
                    className={clsx(
                      "flex items-center justify-center rounded-2xl shrink-0 size-12 transition-colors",
                      isAlertEnabled
                        ? "bg-[#054A91]/10 text-[#054A91] dark:bg-[#054A91]/20 dark:text-[#81A4CD]"
                        : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600",
                    )}
                  >
                    <Bell className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-900 dark:text-white text-base font-semibold leading-normal">
                      Alerta de bajo inventario
                    </p>
                    <p className="text-slate-500 dark:text-gray-400 text-xs font-normal">
                      Recibe una notificación push
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <Switch
                    checked={isAlertEnabled}
                    onCheckedChange={setIsAlertEnabled}
                  />
                </div>
              </div>

              {/* Threshold Input (Conditional) */}
              <div
                className={clsx(
                  "flex flex-col min-w-40 flex-1 transition-all duration-300 overflow-hidden",
                  isAlertEnabled
                    ? "opacity-100 max-h-40"
                    : "opacity-50 max-h-40 grayscale pointer-events-none",
                )}
              >
                <label className="text-slate-600 dark:text-gray-300 text-sm font-medium leading-normal pb-3">
                  Notificarme cuando queden menos de:
                </label>
                <div className="relative flex items-center w-full">
                  <input
                    type="number"
                    value={currentThreshold}
                    onChange={(e) =>
                      setCurrentThreshold(parseInt(e.target.value) || 0)
                    }
                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-2xl text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#054A91]/20 border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 focus:border-[#054A91] h-14 placeholder:text-gray-400 p-[15px] pl-5 text-base font-bold leading-normal text-left shadow-sm transition-all"
                    inputMode="numeric"
                  />
                  <span className="absolute right-5 text-slate-400 font-medium pointer-events-none">
                    unidades
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter className="px-6 pb-8 pt-4 bg-white dark:bg-gray-900 border-t border-slate-50 dark:border-gray-800 flex flex-col gap-3">
            <Button
              onClick={handleSave}
              className="w-full bg-[#054A91] text-white text-lg font-bold rounded-xl h-12 hover:bg-[#054A91]/90 shadow-lg shadow-[#054A91]/20"
            >
              Confirmar Inventario
            </Button>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="w-full text-slate-500 dark:text-gray-400 h-12 rounded-xl text-base hover:bg-slate-100 dark:hover:bg-gray-800"
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
