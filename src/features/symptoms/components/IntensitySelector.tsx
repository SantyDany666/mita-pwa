import { cn } from "@/lib/utils";

const INTENSITIES = [
  { value: 1, label: "Muy Leve", color: "bg-green-500" },
  { value: 2, label: "Leve", color: "bg-yellow-500" },
  { value: 3, label: "Moderado", color: "bg-orange-500" },
  { value: 4, label: "Severo", color: "bg-red-500" },
  { value: 5, label: "Muy Severo", color: "bg-red-700" },
];

interface IntensitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  label?: string;
}

export function IntensitySelector({
  value,
  onChange,
  error,
  label,
}: IntensitySelectorProps) {
  const getIntensityLevel = (val: number) => {
    switch (val) {
      case 1:
        return { height: "30%", color: "bg-emerald-500" };
      case 2:
        return { height: "45%", color: "bg-yellow-500" };
      case 3:
        return { height: "65%", color: "bg-orange-500" };
      case 4:
        return { height: "85%", color: "bg-red-500" };
      case 5:
        return { height: "100%", color: "bg-red-700" };
      default:
        return { height: "20%", color: "bg-slate-200" };
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <p className="text-slate-900 dark:text-gray-200 text-base font-medium leading-normal pb-2">
          {label}
        </p>
      )}
      <div className="flex justify-between items-end h-24 gap-3 px-2">
        {INTENSITIES.map((intensity) => {
          const isSelected = value === intensity.value;
          const level = getIntensityLevel(intensity.value);

          return (
            <button
              key={intensity.value}
              type="button"
              onClick={() => onChange(intensity.value)}
              className="flex-1 group flex flex-col items-center gap-3 outline-none h-full justify-end"
            >
              <div
                style={{ height: level.height }}
                className={cn(
                  "w-full rounded-2xl transition-all duration-300 shadow-sm border",
                  isSelected
                    ? `${level.color} border-transparent scale-x-110 shadow-md`
                    : "bg-slate-200 dark:bg-gray-800 border-slate-300/50 dark:border-gray-700 group-hover:bg-slate-300",
                )}
              />
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-bold whitespace-nowrap transition-all uppercase tracking-tight",
                  isSelected
                    ? "text-slate-900 dark:text-white scale-110"
                    : "text-slate-400 dark:text-gray-500",
                )}
              >
                {intensity.label}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-center text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
