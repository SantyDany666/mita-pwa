import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AuthListener } from "../features/auth/components/AuthListener";
import { ProfileGuard } from "../features/auth/components/ProfileGuard";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <AuthListener />
      <ProfileGuard>
        <div className="min-h-screen bg-background font-sans antialiased text-foreground dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <Outlet />
        </div>
      </ProfileGuard>
      <Toaster />
    </>
  ),
});
