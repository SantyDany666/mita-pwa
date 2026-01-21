import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, Profile } from "../services/profile.service";
import { useAuthStore } from "@/store/auth.store";
import { ProfileData } from "../schemas/profile-schemas";

export const useProfile = (specificUserId?: string) => {
  const { session } = useAuthStore();
  const queryClient = useQueryClient();

  const userId = specificUserId || session?.user?.id;

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => profileService.getProfile(userId!),
    enabled: !!userId,
  });

  const createProfileMutation = useMutation({
    mutationFn: (data: ProfileData) => profileService.createProfile(data),
    onSuccess: (newProfile) => {
      queryClient.setQueryData(["profile", userId], newProfile);
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Profile>) =>
      profileService.updateProfile(userId!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    createProfile: createProfileMutation.mutateAsync,
    isCreating: createProfileMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
};
