import { Button } from "@/components/ui/button";
import { DrawerFooter } from "@/components/ui/drawer";
import { Infinity as InfinityIcon } from "lucide-react";

interface ForeverConfigProps {
  onConfirm: () => void;
}

export function ForeverConfig({ onConfirm }: ForeverConfigProps) {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="flex-1 flex flex-col items-center justify-center py-8 gap-4 text-center">
        <div className="size-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-500 dark:text-green-400">
          <InfinityIcon size={40} />
        </div>
        <div className="space-y-2 max-w-[280px]">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Tratamiento Continuo
          </h3>
          <p className="text-slate-500 dark:text-gray-400">
            El recordatorio se mantendrá activo indefinidamente hasta que
            decidas pausarlo o finalizarlo manualmente.
          </p>
        </div>
      </div>

      <DrawerFooter className="pt-4 px-0">
        <Button
          onClick={onConfirm}
          className="w-full h-12 rounded-xl text-base font-bold bg-[#054A91] hover:bg-[#054A91]/90 text-white shadow-lg shadow-blue-900/20"
        >
          Confirmar Duración
        </Button>
      </DrawerFooter>
    </div>
  );
}
