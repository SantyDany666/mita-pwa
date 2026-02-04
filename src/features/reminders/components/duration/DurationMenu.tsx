import {
  ChevronRight,
  Infinity as InfinityIcon,
  Calendar,
  Hash,
} from "lucide-react";
import { DurationMode } from "../../utils/duration-utils";

interface DurationMenuProps {
  onSelect: (mode: DurationMode) => void;
}

export function DurationMenu({ onSelect }: DurationMenuProps) {
  return (
    <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
      <button
        onClick={() => onSelect("forever")}
        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all text-left group"
      >
        <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
          <InfinityIcon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white">
            Sin fecha de fin
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Tratamiento continuo o crónico
          </p>
        </div>
        <ChevronRight className="text-gray-300 dark:text-gray-600" />
      </button>

      <button
        onClick={() => onSelect("fixed")}
        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all text-left group"
      >
        <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
          <Hash size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white">
            Tiempo determinado
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Ej: Por 5 días, por una semana
          </p>
        </div>
        <ChevronRight className="text-gray-300 dark:text-gray-600" />
      </button>

      <button
        onClick={() => onSelect("date")}
        className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-all text-left group"
      >
        <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
          <Calendar size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white">
            Hasta una fecha
          </h3>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Finaliza un día específico
          </p>
        </div>
        <ChevronRight className="text-gray-300 dark:text-gray-600" />
      </button>
    </div>
  );
}
