import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moodService, UpdateMoodLogParams } from "../services/mood.service";

export function useMoodActions(moodId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["mood", moodId] });
    queryClient.invalidateQueries({ queryKey: ["summary"] });
  };

  const updateMutation = useMutation({
    mutationFn: (params: UpdateMoodLogParams) =>
      moodService.update(moodId, params),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: () => moodService.delete(moodId),
    onSuccess: invalidate,
  });

  return {
    updateMood: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteMood: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
