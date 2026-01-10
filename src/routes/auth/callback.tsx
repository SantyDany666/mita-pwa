import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '../../store/auth.store'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const { session, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        navigate({ to: '/' })
      } else {
        // If loading finishes and no session, something went wrong or no code was found
        navigate({ to: '/welcome' })
      }
    }
  }, [session, isLoading, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}
