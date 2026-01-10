import { createFileRoute, redirect, Navigate } from '@tanstack/react-router'
import { PhoneLoginScreen } from '../features/auth/components/PhoneLoginScreen'
import { useAuthStore } from '../store/auth.store'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const { session, isLoading } = useAuthStore.getState()
    if (!isLoading && session) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => {
    const { session, isLoading } = useAuthStore()
    if (isLoading) return null
    if (session) return <Navigate to="/" />
    return <PhoneLoginScreen />
  },
})
