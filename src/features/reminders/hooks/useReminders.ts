import { useQuery } from "@tanstack/react-query";
import { reminderService } from "../services/reminder.service";
import { useProfileStore } from "@/store/profile.store";

export function useReminders() {
  const { currentProfile } = useProfileStore();

  const query = useQuery({
    queryKey: ["reminders", currentProfile?.id],
    queryFn: async () => {
      if (!currentProfile) return [];
      return reminderService.getAllByProfile(currentProfile.id);
    },
    enabled: !!currentProfile,
  });

  return {
    reminders: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
