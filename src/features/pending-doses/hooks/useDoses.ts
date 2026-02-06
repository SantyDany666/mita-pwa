import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doseService } from "@/features/reminders/services/dose.service";
import { useProfileStore } from "@/store/profile.store";
import { startOfDay, endOfDay, isToday } from "date-fns";
import { DoseWithReminder } from "../components/DailyDoseList";

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

  // Helper for Optimistic Updates
  const performOptimisticUpdate = async (
    doseId: string,
    updateFn: (dose: DoseWithReminder) => DoseWithReminder,
  ) => {
    // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: ["doses"] });

    // 2. Snapshot the previous value
    const previousDoses = queryClient.getQueryData<DoseWithReminder[]>([
      "doses",
      currentProfile?.id,
      start.toISOString(),
    ]);

    // 3. Optimistically update to the new value
    queryClient.setQueryData(
      ["doses", currentProfile?.id, start.toISOString()],
      (old: DoseWithReminder[] | undefined) => {
        if (!old) return [];
        return old.map((dose) => (dose.id === doseId ? updateFn(dose) : dose));
      },
    );

    // 4. Return a context object with the snapshotted value
    return { previousDoses };
  };

  // Helper for onError (Rollback)
  const onErrorRollback = (
    _err: unknown, // Prefixed with _ to ignore unused warning
    _variables: unknown,
    context: { previousDoses?: DoseWithReminder[] } | undefined,
  ) => {
    if (context?.previousDoses) {
      queryClient.setQueryData(
        ["doses", currentProfile?.id, start.toISOString()],
        context.previousDoses,
      );
    }
  };

  // Helper for onSettled (Refetch)
  const onSettledRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ["doses"] });
  };

  // Actions
  const takeDoseMutation = useMutation({
    mutationFn: (doseId: string) => doseService.markAsTaken(doseId),
    onMutate: (doseId) =>
      performOptimisticUpdate(doseId, (dose) => ({
        ...dose,
        status: "taken",
        taken_at: new Date().toISOString(),
      })),
    onError: onErrorRollback,
    onSettled: onSettledRefetch,
  });

  const skipDoseMutation = useMutation({
    mutationFn: (doseId: string) => doseService.markAsSkipped(doseId),
    onMutate: (doseId) =>
      performOptimisticUpdate(doseId, (dose) => ({
        ...dose,
        status: "skipped",
      })),
    onError: onErrorRollback,
    onSettled: onSettledRefetch,
  });

  const snoozeDoseMutation = useMutation({
    mutationFn: ({ doseId, date }: { doseId: string; date: Date }) =>
      doseService.snoozeDose(doseId, date),
    onMutate: ({ doseId, date }) =>
      performOptimisticUpdate(doseId, (dose) => ({
        ...dose,
        scheduled_at: date.toISOString(), // Optimistically move it
      })),
    onError: onErrorRollback,
    onSettled: onSettledRefetch,
  });

  return {
    doses: dosesQuery.data || [],
    isLoading: dosesQuery.isLoading,
    takeDose: takeDoseMutation.mutateAsync,
    skipDose: skipDoseMutation.mutateAsync,
    snoozeDose: snoozeDoseMutation.mutateAsync,
  };
};
