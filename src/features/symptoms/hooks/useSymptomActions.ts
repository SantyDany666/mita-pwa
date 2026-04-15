import { useMutation, useQueryClient } from "@tanstack/react-query";
import { symptomService, UpdateSymptomLogParams } from "../services/symptom.service";

export function useSymptomActions(symptomId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["symptom", symptomId] });
    queryClient.invalidateQueries({ queryKey: ["summary"] });
  };

  const updateMutation = useMutation({
    mutationFn: (params: UpdateSymptomLogParams) =>
      symptomService.update(symptomId, params),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: () => symptomService.delete(symptomId),
    onSuccess: invalidate,
  });

  return {
    updateSymptom: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteSymptom: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
