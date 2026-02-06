import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doseService } from "@/features/reminders/services/dose.service";
import { useProfileStore } from "@/store/profile.store";
import { startOfDay, endOfDay, isToday } from "date-fns";

export const useDoses = (selectedDate: Date) => {
  const { currentProfile } = useProfileStore();
  const queryClient = useQueryClient();

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

  // Actions
  const takeDoseMutation = useMutation({
    mutationFn: (doseId: string) => doseService.markAsTaken(doseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doses"] });
    },
  });

  const skipDoseMutation = useMutation({
    mutationFn: (doseId: string) => doseService.markAsSkipped(doseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doses"] });
    },
  });

  const snoozeDoseMutation = useMutation({
    mutationFn: ({ doseId, date }: { doseId: string; date: Date }) =>
      doseService.snoozeDose(doseId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doses"] });
    },
  });

  return {
    doses: dosesQuery.data || [],
    isLoading: dosesQuery.isLoading,
    takeDose: takeDoseMutation.mutateAsync,
    skipDose: skipDoseMutation.mutateAsync,
    snoozeDose: snoozeDoseMutation.mutateAsync,
  };
};
