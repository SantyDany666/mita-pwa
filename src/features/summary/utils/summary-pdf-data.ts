import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SummaryData, SummaryEventType } from "../services/summary.service";

// ─── Type definitions for the PDF data structure ─────────────────────────────

export interface PdfDoseRow {
  time: string;
  medicineName: string;
  status: "taken" | "skipped";
  takenAt: string | null;
  dosage: string | null;
}

export interface PdfSymptomRow {
  time: string;
  symptom: string;
  intensity: number;
  intensityLabel: string;
  note: string | null;
}

export interface PdfMoodRow {
  time: string;
  moodValue: number;
  moodLabel: string;
  note: string | null;
}

export type PdfEventRow =
  | ({ type: "dose" } & PdfDoseRow)
  | ({ type: "symptom" } & PdfSymptomRow)
  | ({ type: "mood" } & PdfMoodRow);

export interface PdfDayGroup {
  dateLabel: string; // e.g. "Miércoles 14 de Abril, 2026"
  events: PdfEventRow[];
}

export interface PdfStats {
  totalDoses: number;
  takenDoses: number;
  skippedDoses: number;
  adherencePercent: number | null;
  totalSymptoms: number;
  totalMoods: number;
  avgMood: number | null;
}

export interface SummaryPdfData {
  patientName: string;
  periodLabel: string;
  generatedAt: string;
  stats: PdfStats;
  days: PdfDayGroup[];
  selectedCategories: SummaryEventType[];
}

// ─── Intensity & Mood lookup tables ──────────────────────────────────────────

const INTENSITY_LABELS: Record<number, string> = {
  1: "Muy leve",
  2: "Leve",
  3: "Moderado",
  4: "Severo",
  5: "Muy severo",
};

const MOOD_LABELS: Record<number, string> = {
  1: "Muy mal",
  2: "Mal",
  3: "Regular",
  4: "Bien",
  5: "Excelente",
};

// ─── Main builder function ────────────────────────────────────────────────────

export function buildSummaryPdfData(
  data: SummaryData,
  patientName: string,
  dateRange: { start: Date; end: Date },
  selectedCategories: SummaryEventType[],
): SummaryPdfData {
  // ── Stats calculation ──
  const totalDoses = data.doses.length;
  const takenDoses = data.doses.filter((d) => d.status === "taken").length;
  const skippedDoses = data.doses.filter((d) => d.status === "skipped").length;
  const adherencePercent =
    totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : null;

  const totalSymptoms = data.symptoms.length;
  const totalMoods = data.moods.length;
  const avgMood =
    totalMoods > 0
      ? Math.round(
          (data.moods.reduce((sum, m) => sum + (m.mood_value ?? 0), 0) /
            totalMoods) *
            10,
        ) / 10
      : null;

  // ── Build unified event list ──
  type RawEvent = { timestamp: string; row: PdfEventRow };
  const rawEvents: RawEvent[] = [];

  if (selectedCategories.includes("dose")) {
    for (const d of data.doses) {
      rawEvents.push({
        timestamp: d.scheduled_at,
        row: {
          type: "dose",
          time: format(new Date(d.scheduled_at), "HH:mm"),
          medicineName: d.reminders?.medicine_name ?? "Medicamento",
          status: d.status as "taken" | "skipped",
          takenAt: d.taken_at
            ? format(new Date(d.taken_at), "HH:mm")
            : null,
          dosage: null,
        },
      });
    }
  }

  if (selectedCategories.includes("symptom")) {
    for (const s of data.symptoms) {
      rawEvents.push({
        timestamp: s.created_at!,
        row: {
          type: "symptom",
          time: format(new Date(s.created_at!), "HH:mm"),
          symptom: s.symptom,
          intensity: s.intensity ?? 1,
          intensityLabel: INTENSITY_LABELS[s.intensity ?? 1] ?? "Leve",
          note: s.note ?? null,
        },
      });
    }
  }

  if (selectedCategories.includes("mood")) {
    for (const m of data.moods) {
      rawEvents.push({
        timestamp: m.created_at!,
        row: {
          type: "mood",
          time: format(new Date(m.created_at!), "HH:mm"),
          moodValue: m.mood_value ?? 3,
          moodLabel: MOOD_LABELS[m.mood_value ?? 3] ?? "Regular",
          note: m.note ?? null,
        },
      });
    }
  }

  // ── Sort descending, group by day ──
  rawEvents.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const dayMap = new Map<string, PdfEventRow[]>();
  for (const ev of rawEvents) {
    const dayKey = format(new Date(ev.timestamp), "yyyy-MM-dd");
    if (!dayMap.has(dayKey)) dayMap.set(dayKey, []);
    dayMap.get(dayKey)!.push(ev.row);
  }

  const days: PdfDayGroup[] = Array.from(dayMap.entries()).map(
    ([key, events]) => ({
      dateLabel: format(new Date(key + "T12:00:00"), "EEEE d 'de' MMMM, yyyy", {
        locale: es,
      }),
      events,
    }),
  );

  // ── Period label ──
  const startLabel = format(dateRange.start, "d 'de' MMMM yyyy", { locale: es });
  const endLabel = format(dateRange.end, "d 'de' MMMM yyyy", { locale: es });
  const periodLabel =
    startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;

  return {
    patientName,
    periodLabel,
    generatedAt: format(new Date(), "d 'de' MMMM yyyy, HH:mm", { locale: es }),
    stats: {
      totalDoses,
      takenDoses,
      skippedDoses,
      adherencePercent,
      totalSymptoms,
      totalMoods,
      avgMood,
    },
    days,
    selectedCategories,
  };
}
