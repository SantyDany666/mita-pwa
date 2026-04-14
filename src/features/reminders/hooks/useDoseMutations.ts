import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doseService } from "@/features/reminders/services/dose.service";
import { notificationService } from "@/services/notification.service";
import type { Tables } from "@/types/database.types";
import { hashString } from "@/utils/scheduler.utils";

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
    await queryClient.cancelQueries({ queryKey: ["dose-detail", doseId] });

    // 2. Snapshot previous state
    const previousDosesState = queryClient.getQueriesData<DoseWithReminder[]>({
      queryKey: ["doses"],
    });
    const previousSchedulerState = queryClient.getQueriesData<
      DoseWithReminder[]
    >({ queryKey: ["scheduler-pending-doses"] });
    const previousDetailState = queryClient.getQueryData<DoseWithReminder>([
      "dose-detail",
      doseId,
    ]);

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

    // 5. Optimistically update the specific detail if it exists
    if (previousDetailState) {
      queryClient.setQueryData<DoseWithReminder>(
        ["dose-detail", doseId],
        updateFn(previousDetailState),
      );
    }

    return { previousDosesState, previousSchedulerState, previousDetailState };
  };

  const onErrorRollback = (
    _err: unknown,
    _variables: string | { doseId: string; date: Date },
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
          previousDetailState?: DoseWithReminder;
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
    if (context?.previousDetailState && _variables) {
      const doseId =
        typeof _variables === "string" ? _variables : _variables.doseId;
      if (doseId) {
        queryClient.setQueryData(
          ["dose-detail", doseId],
          context.previousDetailState,
        );
      }
    }
  };

  const onSettledRefetch = (doseId?: string) => {
    queryClient.invalidateQueries({ queryKey: ["doses"] });
    queryClient.invalidateQueries({ queryKey: ["scheduler-pending-doses"] });
    if (doseId) {
      queryClient.invalidateQueries({ queryKey: ["dose-detail", doseId] });
    }
  };

  const takeDoseMutation = useMutation({
    mutationFn: (doseId: string) => doseService.markAsTaken(doseId),
    onMutate: (doseId) => {
      notificationService.cancel(hashString(doseId));
      return performOptimisticUpdate(doseId, (dose) => ({
        ...dose,
        status: "taken",
        taken_at: new Date().toISOString(),
      }));
    },
    onError: onErrorRollback,
    onSuccess: (data) => {
      // Data returns the payload from doseService.markAsTaken
      if (
        data?.triggerInventoryAlert &&
        data.medicineName &&
        data.remainingStock !== undefined
      ) {
        notificationService.triggerLowInventoryAlert(
          data.medicineName,
          data.remainingStock,
        );
      }
    },
    onSettled: (_data, _error, doseId) => onSettledRefetch(doseId),
  });

  const skipDoseMutation = useMutation({
    mutationFn: (doseId: string) => doseService.markAsSkipped(doseId),
    onMutate: (doseId) => {
      notificationService.cancel(hashString(doseId));
      return performOptimisticUpdate(doseId, (dose) => ({
        ...dose,
        status: "skipped",
      }));
    },
    onError: onErrorRollback,
    onSettled: (_data, _error, doseId) => onSettledRefetch(doseId),
  });

  const snoozeDoseMutation = useMutation({
    mutationFn: ({ doseId, date }: { doseId: string; date: Date }) =>
      doseService.snoozeDose(doseId, date),
    onMutate: ({ doseId, date }) => {
      notificationService.cancel(hashString(doseId));
      return performOptimisticUpdate(doseId, (dose) => ({
        ...dose,
        scheduled_at: date.toISOString(),
      }));
    },
    onError: onErrorRollback,
    onSettled: (_data, _error, variables) => onSettledRefetch(variables.doseId),
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
    onSettled: (_data, _error, doseId) => onSettledRefetch(doseId),
  });

  return {
    takeDose: takeDoseMutation.mutateAsync,
    skipDose: skipDoseMutation.mutateAsync,
    snoozeDose: snoozeDoseMutation.mutateAsync,
    undoDose: undoDoseMutation.mutateAsync,
  };
};
