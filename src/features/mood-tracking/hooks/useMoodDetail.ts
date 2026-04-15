import { useQuery } from "@tanstack/react-query";
import { moodService } from "../services/mood.service";

export function useMoodDetail(id: string) {
  return useQuery({
    queryKey: ["mood", id],
    queryFn: () => moodService.getById(id),
    enabled: !!id,
  });
}
