import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profile.service'
import { useAuthStore } from '@/store/auth.store'
import { ProfileData } from '../schemas/profile-schemas'

export function useProfile() {
  const { session } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: profileService.getProfile,
    enabled: !!session?.user?.id,
    staleTime: Infinity, // Profile data rarely changes automatically
  })

  const createProfileMutation = useMutation({
    mutationFn: (data: ProfileData) => profileService.createProfile(data),
    onSuccess: (newProfile) => {
      queryClient.setQueryData(['profile', session?.user?.id], newProfile)
    },
  })

  return {
    profile,
    isLoading,
    error,
    createProfile: createProfileMutation.mutateAsync,
    isCreating: createProfileMutation.isPending,
  }
}
