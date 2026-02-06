import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, Profile } from "../services/profile.service";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { ProfileData } from "../schemas/profile-schemas";

export const useProfile = (specificUserId?: string) => {
  const { session } = useAuthStore();
  const { setCurrentProfile } = useProfileStore();
  const queryClient = useQueryClient();

  const userId = specificUserId || session?.user?.id;

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => profileService.getProfile(userId!),
    enabled: !!userId,
  });

  // Sync with global store for Reminder accessibility
  useEffect(() => {
    if (profileQuery.data) {
      setCurrentProfile(profileQuery.data);
    }
  }, [profileQuery.data, setCurrentProfile]);

  const createProfileMutation = useMutation({
    mutationFn: (data: ProfileData) => profileService.createProfile(data),
    onSuccess: (newProfile) => {
      queryClient.setQueryData(["profile", userId], newProfile);
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      setCurrentProfile(newProfile); // Immediate sync
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
