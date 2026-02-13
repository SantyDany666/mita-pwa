import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doseService } from "@/features/reminders/services/dose.service";
import { useProfileStore } from "@/store/profile.store";
import { startOfDay } from "date-fns";
import type { Tables } from "@/types/database.types";

export type DoseWithReminder = Tables<"dose_events"> & {
  reminders: Tables<"reminders"> | null;
};

export const useDoseMutations = (selectedDate?: Date) => {
  const queryClient = useQueryClient();
  const { currentProfile } = useProfileStore();

  const queryKey =
    selectedDate && currentProfile
      ? ["doses", currentProfile.id, startOfDay(selectedDate).toISOString()]
      : null;

  const performOptimisticUpdate = async (
    doseId: string,
    updateFn: (dose: DoseWithReminder) => DoseWithReminder,
  ) => {
    await queryClient.cancelQueries({ queryKey: ["doses"] });

    let previousDoses: DoseWithReminder[] | undefined;

    if (queryKey) {
      previousDoses = queryClient.getQueryData<DoseWithReminder[]>(queryKey);

      queryClient.setQueryData(
        queryKey,
        (old: DoseWithReminder[] | undefined) => {
          if (!old) return [];
          return old.map((dose) =>
            dose.id === doseId ? updateFn(dose) : dose,
          );
        },
      );
    }
    return { previousDoses };
  };

  const onErrorRollback = (
    _err: unknown,
    _variables: unknown,
    context: { previousDoses?: DoseWithReminder[] } | undefined,
  ) => {
    if (context?.previousDoses && queryKey) {
      queryClient.setQueryData(queryKey, context.previousDoses);
    }
  };

  const onSettledRefetch = () => {
    queryClient.invalidateQueries({ queryKey: ["doses"] });
    queryClient.invalidateQueries({ queryKey: ["scheduler-pending-doses"] });
  };

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
        scheduled_at: date.toISOString(),
      })),
    onError: onErrorRollback,
    onSettled: onSettledRefetch,
  });

  const undoDoseMutation = useMutation({
    mutationFn: (doseId: string) => doseService.markAsPending(doseId),
    onMutate: (doseId) =>
      performOptimisticUpdate(doseId, (dose) => ({
        ...dose,
        status: "pending",
        taken_at: null,
      })),
    onError: onErrorRollback,
    onSettled: onSettledRefetch,
  });

  return {
    takeDose: takeDoseMutation.mutateAsync,
    skipDose: skipDoseMutation.mutateAsync,
    snoozeDose: snoozeDoseMutation.mutateAsync,
    undoDose: undoDoseMutation.mutateAsync,
  };
};
