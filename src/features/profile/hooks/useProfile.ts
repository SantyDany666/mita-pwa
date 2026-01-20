
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { profileService, Profile } from "../services/profile.service"

export const useProfile = (userId: string | undefined) => {
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileService.getProfile(userId!),
    enabled: !!userId,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<Profile>) => profileService.updateProfile(userId!, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  }
}
