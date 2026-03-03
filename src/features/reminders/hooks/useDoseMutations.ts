import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doseService } from "@/features/reminders/services/dose.service";
import type { Tables } from "@/types/database.types";

export type DoseWithReminder = Tables<"dose_events"> & {
  reminders: Tables<"reminders"> | null;
};

export const useDoseMutations = () => {
  const queryClient = useQueryClient();

  // Note: We no longer need this specific queryKey for optimistic updates
  // because we will update ALL cached dose lists matching ["doses"]
  // with queryClient.setQueriesData.

  const performOptimisticUpdate = async (
    doseId: string,
    updateFn: (dose: DoseWithReminder) => DoseWithReminder,
  ) => {
    // 1. Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["doses"] });
    await queryClient.cancelQueries({ queryKey: ["scheduler-pending-doses"] });

    // 2. Snapshot previous state
    const previousDosesState = queryClient.getQueriesData<DoseWithReminder[]>({
      queryKey: ["doses"],
    });
    const previousSchedulerState = queryClient.getQueriesData<
      DoseWithReminder[]
    >({ queryKey: ["scheduler-pending-doses"] });

    // 3. Optimistically update ALL 'doses' lists
    queryClient.setQueriesData<DoseWithReminder[]>(
      { queryKey: ["doses"] },
      (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((dose) => (dose.id === doseId ? updateFn(dose) : dose));
      },
    );

    // 4. Optimistically update the scheduler list
    queryClient.setQueriesData<DoseWithReminder[]>(
      { queryKey: ["scheduler-pending-doses"] },
      (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((dose) => (dose.id === doseId ? updateFn(dose) : dose));
      },
    );

    return { previousDosesState, previousSchedulerState };
  };

  const onErrorRollback = (
    _err: unknown,
    _variables: unknown,
    context:
      | {
          previousDosesState?: Array<
            [
              import("@tanstack/react-query").QueryKey,
              DoseWithReminder[] | undefined,
            ]
          >;
          previousSchedulerState?: Array<
            [
              import("@tanstack/react-query").QueryKey,
              DoseWithReminder[] | undefined,
            ]
          >;
        }
      | undefined,
  ) => {
    if (context?.previousDosesState) {
      context.previousDosesState.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    }
    if (context?.previousSchedulerState) {
      context.previousSchedulerState.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
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
