import { useAuthStore } from '@/store/auth.store'
import { useProfile } from '@/features/create-profile/hooks/useProfile'
import { Navigate, useLocation } from '@tanstack/react-router'
import { FullScreenLoader } from '@/components/ui/spinner'

const PUBLIC_ROUTES = ['/welcome', '/login', '/otp']
const PROFILE_CREATION_ROUTE = '/create-profile'

export function ProfileGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading: isAuthLoading } = useAuthStore()
  const { profile, isLoading: isProfileLoading } = useProfile()
  const location = useLocation()

  if (isAuthLoading) return <FullScreenLoader />

  // If not authenticated, we don't enforce profile checks here 
  // (Auth guards in routes or layouts handle redirect to login/welcome)
  if (!session) {
    return <>{children}</>
  }

  if (isProfileLoading) return <FullScreenLoader />

  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route))
  const isProfileRoute = location.pathname.startsWith(PROFILE_CREATION_ROUTE)

  if (!profile) {
    if (!isProfileRoute && !isPublicRoute) {
      return <Navigate to="/create-profile" />
    }
  }

  if (profile) {
    if (isProfileRoute) {
      return <Navigate to="/" />
    }
  }

  return <>{children}</>
}
