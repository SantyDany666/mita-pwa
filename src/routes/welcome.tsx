import { createFileRoute, Navigate } from '@tanstack/react-router'
import { WelcomeScreen } from '../features/auth/components/WelcomeScreen'
import { useAuthStore } from '../store/auth.store'

export const Route = createFileRoute('/welcome')({
  component: () => {
    const { session, isLoading } = useAuthStore()
    if (isLoading) return null
    if (session) return <Navigate to="/" />
    return <WelcomeScreen />
  },
})
