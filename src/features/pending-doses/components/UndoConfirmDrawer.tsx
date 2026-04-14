import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertCircle } from "lucide-react";

interface UndoConfirmDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  status: "taken" | "skipped";
}

export function UndoConfirmDrawer({
  isOpen,
  onOpenChange,
  onConfirm,
  status,
}: UndoConfirmDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 w-full outline-none pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="pt-8 pb-4">
            <div className="mx-auto bg-[#054A91]/10 dark:bg-[#054A91]/20 p-4 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-[#054A91] dark:text-[#81A4CD]" />
            </div>
            <DrawerTitle className="text-center text-[#054A91] dark:text-[#81A4CD] text-xl font-bold">
              ¿Modificar historial?
            </DrawerTitle>
            <DrawerDescription className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-[280px] mx-auto leading-relaxed">
              Has marcado esta dosis como{" "}
              <strong>{status === "taken" ? "tomada" : "omitida"}</strong>.
              ¿Confirmas que quieres revertir esta acción de tu registro?
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 flex flex-col gap-3">
            <Button
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className="w-full h-14 bg-[#054A91] hover:bg-[#043c75] text-white rounded-xl text-base font-semibold shadow-lg shadow-[#054A91]/20 transition-all active:scale-[0.98]"
            >
              <RotateCcw className="w-5 h-5 mr-3" />
              Si, Deshacer Acción
            </Button>

            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="w-full h-12 rounded-xl text-slate-500 dark:text-gray-400 font-medium"
              >
                Cancelar
              </Button>
            </DrawerClose>
          </div>

          <div className="h-4 shrink-0" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
