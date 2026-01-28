import {
  ChevronRight,
  Clock,
  CalendarDays,
  Repeat,
  AlertCircle,
} from "lucide-react";
import { FrequencyMode } from "../../utils/frequency-utils";

interface FrequencyMenuProps {
  onSelect: (mode: FrequencyMode) => void;
}

export function FrequencyMenu({ onSelect }: FrequencyMenuProps) {
  return (
    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
      <button
        onClick={() => onSelect("daily")}
        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all text-left group"
      >
        <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#054A91] dark:text-[#81A4CD] group-hover:scale-110 transition-transform">
          <Clock size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white">
            Diariamente
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Varias veces al día o cada 24h
          </p>
        </div>
        <ChevronRight className="text-gray-300 dark:text-gray-600" />
      </button>

      <button
        onClick={() => onSelect("weekdays")}
        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all text-left group"
      >
        <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
          <CalendarDays size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white">
            Días Específicos
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Ej: Lunes, Miércoles y Viernes
          </p>
        </div>
        <ChevronRight className="text-gray-300 dark:text-gray-600" />
      </button>

      <button
        onClick={() => onSelect("cyclic")}
        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all text-left group"
      >
        <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
          <Repeat size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white">
            Por Intervalos
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Ej: Cada 2 días, cada 3 semanas
          </p>
        </div>
        <ChevronRight className="text-gray-300 dark:text-gray-600" />
      </button>

      <button
        onClick={() => onSelect("sos")}
        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all text-left group"
      >
        <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
          <AlertCircle size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white">
            Solo si es necesario
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            SOS / PRN (Sin horario fijo)
          </p>
        </div>
        <ChevronRight className="text-gray-300 dark:text-gray-600" />
      </button>
    </div>
  );
}
