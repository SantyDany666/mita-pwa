import { cn } from "@/lib/utils";
import { MEDICINE_ICONS, MedicineIconType } from "../utils/medicine-icons";

export type { MedicineIconType };

interface MedicineIconSelectorProps {
  selected?: MedicineIconType;
  onSelect: (icon: MedicineIconType) => void;
}

export function MedicineIconSelector({
  selected = "capsule",
  onSelect,
}: MedicineIconSelectorProps) {
  return (
    <div className="flex flex-col w-full gap-3">
      <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal">
        Presentación
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {MEDICINE_ICONS.map((item) => {
          const isSelected = selected === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-xl border transition-all duration-200",
                isSelected
                  ? "bg-[#054A91]/10 border-[#054A91] dark:bg-[#054A91]/30 dark:border-[#054A91]"
                  : "bg-slate-50 border-slate-200 dark:bg-gray-800 dark:border-gray-700 hover:border-[#054A91]/30",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                  isSelected
                    ? "bg-[#054A91] text-white"
                    : "bg-white dark:bg-gray-700 text-[#054A91] dark:text-[#81A4CD]",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center",
                  isSelected
                    ? "text-[#054A91] dark:text-white"
                    : "text-slate-600 dark:text-gray-400",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
