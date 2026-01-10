import { createFileRoute, redirect, Navigate } from '@tanstack/react-router'
import { WelcomeScreen } from '../features/auth/components/WelcomeScreen'
import { useAuthStore } from '../store/auth.store'

export const Route = createFileRoute('/welcome')({
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
    return <WelcomeScreen />
  },
})
