import { createRootRoute, Outlet } from '@tanstack/react-router'
import { AuthListener } from '../features/auth/components/AuthListener'

export const Route = createRootRoute({
  component: () => (
    <>
      <AuthListener />
      <div className="min-h-screen bg-background font-sans antialiased text-foreground">
        <Outlet />
      </div>
    </>
  ),
})
