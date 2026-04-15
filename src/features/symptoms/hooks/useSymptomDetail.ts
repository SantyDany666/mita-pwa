import { useQuery } from "@tanstack/react-query";
import { symptomService } from "../services/symptom.service";

export function useSymptomDetail(id: string) {
  return useQuery({
    queryKey: ["symptom", id],
    queryFn: () => symptomService.getById(id),
    enabled: !!id,
  });
}
