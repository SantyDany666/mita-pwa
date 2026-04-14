import { useMutation } from "@tanstack/react-query";
import { moodService, CreateMoodLogParams } from "../services/mood.service";

export function useMoodMutations() {
  const logMoodMutation = useMutation({
    mutationFn: (params: CreateMoodLogParams) => moodService.createMoodLog(params),
  });

  return {
    logMood: logMoodMutation.mutateAsync,
    isLogging: logMoodMutation.isPending,
    error: logMoodMutation.error,
  };
}
