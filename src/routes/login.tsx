import { createFileRoute, Navigate } from '@tanstack/react-router'
import { PhoneLoginScreen } from '../features/auth/components/PhoneLoginScreen'
import { useAuthStore } from '../store/auth.store'

export const Route = createFileRoute('/login')({
  component: () => {
    const { session, isLoading } = useAuthStore()
    if (isLoading) return null
    if (session) return <Navigate to="/" />
    return <PhoneLoginScreen />
  },
})
