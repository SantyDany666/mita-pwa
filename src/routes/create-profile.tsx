import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { CreateProfileLayout } from '@/features/create-profile/components/CreateProfileLayout'
import { useAuthStore } from '@/store/auth.store'

export const Route = createFileRoute('/create-profile')({
  component: CreateProfileLayoutWrapper,
})

function CreateProfileLayoutWrapper() {
  const { session, isLoading } = useAuthStore()

  if (isLoading) return null
  if (!session) return <Navigate to="/welcome" />

  return (
    <CreateProfileLayout>
      <Outlet />
    </CreateProfileLayout>
  )
}
