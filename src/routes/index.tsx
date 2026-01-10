import { createFileRoute, redirect, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '../store/auth.store'
import { useAuth } from '../features/auth/hooks/useAuth'
import { Button } from '../components/ui/button'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { session, isLoading } = useAuthStore.getState()
    if (!isLoading && !session) {
      throw redirect({
        to: '/welcome',
      })
    }
  },
  component: HomeScreen,
})

function HomeScreen() {
  const { session, isLoading } = useAuthStore()
  const { logout } = useAuth()

  if (isLoading) return null
  if (!session) return <Navigate to="/welcome" />

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Home</h1>
        <p className="text-muted-foreground">Bienvenido, {session.user.email}</p>
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

