import { useQuery } from "@tanstack/react-query";
import { doseService } from "@/features/reminders/services/dose.service";
import { DoseWithReminder } from "../components/DailyDoseList";

export const useDoseDetail = (doseId: string) => {
  return useQuery<DoseWithReminder, Error>({
    queryKey: ["dose-detail", doseId],
    queryFn: () => doseService.getById(doseId),
    enabled: !!doseId,
  });
};
