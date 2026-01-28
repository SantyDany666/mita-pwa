import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { AlertCircle } from "lucide-react";

interface SosConfigProps {
  onConfirm: () => void;
}

export function SosConfig({ onConfirm }: SosConfigProps) {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex-1 flex flex-col items-center justify-center py-8 gap-4 text-center">
        <div className="size-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-500 dark:text-red-400">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2 max-w-[280px]">
          <p className="text-slate-500 dark:text-gray-400">
            No te enviaremos recordatorios automáticos. Podrás registrar la toma
            manualmente cuando la necesites.
          </p>
        </div>
      </div>

      <DrawerFooter className="pt-4 px-0">
        <Button
          onClick={onConfirm}
          className="w-full h-12 rounded-xl text-base font-bold bg-[#054A91] hover:bg-[#054A91]/90 text-white shadow-lg shadow-blue-900/20"
        >
          Confirmar Frecuencia
        </Button>
      </DrawerFooter>
    </div>
  );
}
