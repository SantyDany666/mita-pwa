import {
  SummaryData,
  SummaryEventType,
  DoseWithReminder,
} from "../services/summary.service";
import {
  DoseRecordCard,
  SymptomRecordCard,
  MoodRecordCard,
} from "./SummaryCards";
import { Tables } from "@/types/database.types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type DoseEvent = {
  id: string;
  type: "dose";
  timestamp: string;
  payload: DoseWithReminder;
};
type SymptomEvent = {
  id: string;
  type: "symptom";
  timestamp: string;
  payload: Tables<"symptom_logs">;
};
type MoodEvent = {
  id: string;
  type: "mood";
  timestamp: string;
  payload: Tables<"mood_logs">;
};
type SummaryEvent = DoseEvent | SymptomEvent | MoodEvent;

interface SummaryRecordListProps {
  data: SummaryData | null | undefined;
  selectedCategories: SummaryEventType[];
}

export function SummaryRecordList({
  data,
  selectedCategories,
}: SummaryRecordListProps) {
  if (!data) return null;

  // 1. Flatten and tag all events with discriminated union types
  const events: SummaryEvent[] = [
    ...(selectedCategories.includes("dose")
      ? data.doses.map(
          (d): DoseEvent => ({
            id: d.id,
            type: "dose",
            timestamp: d.scheduled_at,
            payload: d,
          }),
        )
      : []),
    ...(selectedCategories.includes("symptom")
      ? data.symptoms.map(
          (s): SymptomEvent => ({
            id: s.id,
            type: "symptom",
            timestamp: s.created_at!,
            payload: s,
          }),
        )
      : []),
    ...(selectedCategories.includes("mood")
      ? data.moods.map(
          (m): MoodEvent => ({
            id: m.id,
            type: "mood",
            timestamp: m.created_at!,
            payload: m,
          }),
        )
      : []),
  ];

  // 2. Sort by timestamp (descending)
  const sortedEvents = events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="size-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center">
          <span className="text-4xl text-gray-300 dark:text-gray-600">📂</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-gray-900 dark:text-white font-bold text-lg">
            Sin registros
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[240px]">
            No se encontraron registros para el periodo y filtros seleccionados.
          </p>
        </div>
      </div>
    );
  }

  // 3. Group by Day
  const groupedEvents: { date: string; items: typeof sortedEvents }[] = [];

  sortedEvents.forEach((event) => {
    const dateStr = format(new Date(event.timestamp), "yyyy-MM-dd");
    let group = groupedEvents.find((g) => g.date === dateStr);
    if (!group) {
      group = { date: dateStr, items: [] };
      groupedEvents.push(group);
    }
    group.items.push(event);
  });

  return (
    <div className="space-y-8 pb-32">
      {groupedEvents.map((group) => {
        const dateObj = new Date(group.date + "T12:00:00"); // Avoid timezone shifts
        const dayLabel = format(dateObj, "EEEE d 'de' MMMM", { locale: es });

        return (
          <div key={group.date} className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#054A91]/60 dark:text-[#81A4CD]/60 sticky top-0 py-3 bg-[#F7F9FC]/90 dark:bg-gray-900/90 backdrop-blur-md z-20 px-1 border-b border-gray-100 dark:border-gray-800/50">
              {dayLabel}
            </h3>
            <div className="space-y-3">
              {group.items.map((event) => (
                <div key={`${event.type}-${event.id}`}>
                  {event.type === "dose" && (
                    <DoseRecordCard dose={event.payload} />
                  )}
                  {event.type === "symptom" && (
                    <SymptomRecordCard symptom={event.payload} />
                  )}
                  {event.type === "mood" && (
                    <MoodRecordCard mood={event.payload} />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
