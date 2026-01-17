import { createFileRoute, Navigate } from '@tanstack/react-router'
import { OtpScreen } from '../features/auth/components/OtpScreen'
import { useAuthStore } from '../store/auth.store'

export const Route = createFileRoute('/otp')({
  component: () => {
    const { session, isLoading } = useAuthStore()
    if (isLoading) return null
    if (session) return <Navigate to="/" />
    return <OtpScreen />
  },
})
