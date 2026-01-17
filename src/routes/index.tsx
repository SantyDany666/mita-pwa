import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '../store/auth.store'
import { useAuth } from '../features/auth/hooks/useAuth'
import { useProfile } from '../features/create-profile/hooks/useProfile'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({
  component: HomeScreen,
})

function HomeScreen() {
  const { session, isLoading } = useAuthStore()
  const { profile } = useProfile()
  const { logout } = useAuth()

  if (isLoading) return null
  if (!session) return <Navigate to="/welcome" />

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-gray-900 p-4 space-y-6 transition-colors duration-300">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground dark:text-white">Home</h1>
        <p className="text-muted-foreground dark:text-gray-400">Bienvenido, {profile?.name || session.user.email}</p>
      </div>

      <Button
        variant="destructive"
        onClick={logout}
      >
        Cerrar Sesión
      </Button>
    </div>
  )
}

