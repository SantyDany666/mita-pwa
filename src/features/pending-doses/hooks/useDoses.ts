import { useQuery } from "@tanstack/react-query";
import { doseService } from "@/features/reminders/services/dose.service";
import { useDoseMutations } from "@/features/reminders/hooks/useDoseMutations";
import { useProfileStore } from "@/store/profile.store";
import { startOfDay, endOfDay, isToday } from "date-fns";

export const useDoses = (selectedDate: Date) => {
  const { currentProfile } = useProfileStore();

  const start = startOfDay(selectedDate);
  const end = endOfDay(selectedDate);

  // Fetch doses for the selected day
  const dosesQuery = useQuery({
    queryKey: ["doses", currentProfile?.id, start.toISOString()],
    queryFn: async () => {
      if (!currentProfile) return [];

      const dayDoses = await doseService.getByDateRange(
        currentProfile.id,
        start,
        end,
      );

      // If viewing today, also fetch past overdue doses (before today)
      if (isToday(selectedDate)) {
        const overdueDoses = await doseService.getOverduePending(
          currentProfile.id,
          start,
        );
        return [...overdueDoses, ...dayDoses];
      }

      return dayDoses;
    },
    enabled: !!currentProfile,
  });

  // Use the shared mutations hook
  const { takeDose, skipDose, snoozeDose, undoDose } =
    useDoseMutations(selectedDate);

  return {
    doses: dosesQuery.data || [],
    isLoading: dosesQuery.isLoading,
    takeDose,
    skipDose,
    snoozeDose,
    undoDose,
  };
};
