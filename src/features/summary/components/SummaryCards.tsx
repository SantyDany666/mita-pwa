import { format } from "date-fns";
import { Check, X, Thermometer } from "lucide-react";
import { Tables } from "@/types/database.types";
import { MedicineIconDisplay } from "@/features/reminders/components/MedicineIconDisplay";
import { MedicineIconType } from "@/features/reminders/utils/medicine-icons";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";

export interface DoseRecordCardProps {
  dose: Tables<"dose_events"> & { reminders: Tables<"reminders"> | null };
}

export function DoseRecordCard({ dose }: DoseRecordCardProps) {
  const navigate = useNavigate();
  const status = dose.status as "taken" | "skipped";
  const time = format(new Date(dose.scheduled_at), "HH:mm");
  const takenTime = dose.taken_at
    ? format(new Date(dose.taken_at), "HH:mm")
    : null;
  const medicineName = dose.reminders?.medicine_name || "Medicamento";
  const icon = (dose.reminders?.medicine_icon as MedicineIconType) || "capsule";

  return (
    <button
      onClick={() => navigate({ to: "/doses/$doseId", params: { doseId: dose.id } })}
      className="w-full text-left flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md active:scale-[0.98] h-24"
    >
      <div className="flex shrink-0 items-center justify-center w-14 h-14 rounded-2xl bg-blue-100/50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
        <MedicineIconDisplay type={icon} className="w-8 h-8" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
              Dosis
            </span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
              {time}
            </span>
          </div>

          {status === "taken" ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600 dark:text-teal-400">
              <Check className="size-3" /> Tomada {takenTime}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500">
              <X className="size-3" /> Omitida
            </span>
          )}
        </div>
        <p className="text-gray-900 dark:text-white font-bold truncate text-lg">
          {medicineName}
        </p>
      </div>
    </button>
  );
}

export function SymptomRecordCard({
  symptom,
}: {
  symptom: Tables<"symptom_logs">;
}) {
  const navigate = useNavigate();
  const time = format(new Date(symptom.created_at!), "HH:mm");

  const intensityData = [
    {
      value: 1,
      label: "Muy Leve",
      color: "text-emerald-500",
      bg: "bg-emerald-500",
    },
    { value: 2, label: "Leve", color: "text-yellow-500", bg: "bg-yellow-500" },
    {
      value: 3,
      label: "Moderado",
      color: "text-orange-500",
      bg: "bg-orange-500",
    },
    { value: 4, label: "Severo", color: "text-red-500", bg: "bg-red-500" },
    { value: 5, label: "Muy Severo", color: "text-red-700", bg: "bg-red-700" },
  ];

  const currentIntensity =
    intensityData.find((i) => i.value === symptom.intensity) ||
    intensityData[0];

  return (
    <button
      onClick={() => navigate({ to: "/symptoms/$symptomId", params: { symptomId: symptom.id } })}
      className="w-full text-left flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md active:scale-[0.98] min-h-[100px]"
    >
      <div className="flex shrink-0 items-center justify-center w-14 h-14 rounded-2xl bg-orange-100/50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
        <Thermometer className="w-8 h-8" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-md">
              Síntoma
            </span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
              {time}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900/50 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-700">
            <div className={cn("size-2 rounded-full", currentIntensity.bg)} />
            <span
              className={cn(
                "text-[10px] font-black uppercase",
                currentIntensity.color,
              )}
            >
              {currentIntensity.label}
            </span>
          </div>
        </div>
        <p className="text-gray-900 dark:text-white font-bold mb-1 text-lg">
          {symptom.symptom}
        </p>
        {symptom.note && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic line-clamp-2 leading-relaxed">
            "{symptom.note}"
          </p>
        )}
      </div>
    </button>
  );
}

export function MoodRecordCard({ mood }: { mood: Tables<"mood_logs"> }) {
  const navigate = useNavigate();
  const time = format(new Date(mood.created_at!), "HH:mm");

  const moodData = [
    {
      value: 1,
      emoji: "😭",
      label: "Muy mal",
      color: "text-red-500",
      bg: "bg-red-500",
    },
    {
      value: 2,
      emoji: "🙁",
      label: "Mal",
      color: "text-orange-500",
      bg: "bg-orange-500",
    },
    {
      value: 3,
      emoji: "😐",
      label: "Regular",
      color: "text-yellow-500",
      bg: "bg-yellow-500",
    },
    {
      value: 4,
      emoji: "🙂",
      label: "Bien",
      color: "text-emerald-500",
      bg: "bg-emerald-500",
    },
    {
      value: 5,
      emoji: "😄",
      label: "Excelente",
      color: "text-teal-500",
      bg: "bg-teal-500",
    },
  ];

  const currentMood =
    moodData.find((m) => m.value === mood.mood_value) || moodData[2];

  return (
    <button
      onClick={() => navigate({ to: "/mood/$moodId", params: { moodId: mood.id } })}
      className="w-full text-left flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md active:scale-[0.98] min-h-[100px]"
    >
      <div className="flex shrink-0 items-center justify-center w-14 h-14 rounded-2xl bg-purple-100/50 dark:bg-purple-900/30 text-3xl">
        {currentMood.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md">
              Ánimo
            </span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
              {time}
            </span>
          </div>
        </div>
        <p className="text-gray-900 dark:text-white font-bold mb-0.5 text-lg">
          Me siento {currentMood.label.toLowerCase()}
        </p>
        {mood.note && (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic line-clamp-2 leading-relaxed">
            "{mood.note}"
          </p>
        )}
      </div>
    </button>
  );
}
