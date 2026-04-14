import { doseService } from "@/features/reminders/services/dose.service";
import { symptomService } from "@/features/symptoms/services/symptom.service";
import { moodService } from "@/features/mood-tracking/services/mood.service";
import { Tables } from "@/types/database.types";

export type DoseWithReminder = Tables<"dose_events"> & {
  reminders: Tables<"reminders"> | null;
};

export interface SummaryData {
  doses: DoseWithReminder[];
  symptoms: Tables<"symptom_logs">[];
  moods: Tables<"mood_logs">[];
}

export type SummaryEventType = "dose" | "symptom" | "mood";

export const summaryService = {
  getSummary: async (
    profileId: string,
    start: Date,
    end: Date,
  ): Promise<SummaryData> => {
    const [doses, symptoms, moods] = await Promise.all([
      doseService.getByDateRange(profileId, start, end),
      symptomService.getByDateRange(profileId, start, end),
      moodService.getByDateRange(profileId, start, end),
    ]);

    const filteredDoses = doses.filter(
      (d) => d.status === "taken" || d.status === "skipped",
    );

    return {
      doses: filteredDoses,
      symptoms,
      moods,
    };
  },
};
