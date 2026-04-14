import { useMutation } from "@tanstack/react-query";
import { symptomService, CreateSymptomLogParams } from "../services/symptom.service";

export function useSymptomMutations() {
  const logSymptomMutation = useMutation({
    mutationFn: (params: CreateSymptomLogParams) =>
      symptomService.createSymptomLog(params),
  });

  return {
    logSymptom: logSymptomMutation.mutateAsync,
    isLogging: logSymptomMutation.isPending,
    error: logSymptomMutation.error,
  };
}
