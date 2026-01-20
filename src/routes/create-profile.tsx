import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { CreateProfileLayout } from '@/features/create-profile/components/CreateProfileLayout'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/create-profile')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({
        to: '/welcome',
      })
    }
  },
  component: CreateProfileLayoutWrapper,
})

function CreateProfileLayoutWrapper() {
  return (
    <CreateProfileLayout>
      <Outlet />
    </CreateProfileLayout>
  )
}
