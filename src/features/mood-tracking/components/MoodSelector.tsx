import { cn } from "@/lib/utils";

interface MoodOption {
  value: number;
  emoji: string;
  label: string;
}

const moods: MoodOption[] = [
  { value: 1, emoji: "😭", label: "Muy mal" },
  { value: 2, emoji: "🙁", label: "Mal" },
  { value: 3, emoji: "😐", label: "Regular" },
  { value: 4, emoji: "🙂", label: "Bien" },
  { value: 5, emoji: "😄", label: "Excelente" },
];

interface MoodSelectorProps {
  value?: number;
  onChange: (value: number) => void;
  error?: string;
}

export function MoodSelector({ value, onChange, error }: MoodSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between w-full px-2">
        {moods.map((mood) => {
          const isSelected = value === mood.value;
          return (
            <button
              key={mood.value}
              type="button"
              onClick={() => onChange(mood.value)}
              className={cn(
                "flex flex-col items-center gap-2 group transition-all duration-300",
                isSelected ? "scale-110" : "scale-100 opacity-60 hover:opacity-100"
              )}
            >
              <div
                className={cn(
                  "flex size-14 items-center justify-center rounded-2xl text-4xl transition-all duration-300 shadow-sm",
                  isSelected
                    ? "bg-[#054A91]/10 dark:bg-[#054A91]/20 ring-2 ring-[#054A91] dark:ring-[#81A4CD] shadow-[#054A91]/20 scale-110"
                    : "bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-[#054A91]/30"
                )}
              >
                {mood.emoji}
              </div>
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider transition-colors",
                  isSelected
                    ? "text-[#054A91] dark:text-[#81A4CD]"
                    : "text-gray-400 dark:text-gray-500"
                )}
              >
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-center text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
