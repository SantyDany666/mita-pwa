import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { AuthListener } from "../features/auth/components/AuthListener";
import { ProfileGuard } from "../features/auth/components/ProfileGuard";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient } from "@tanstack/react-query";
import { useNotificationScheduler } from "@/features/reminders/hooks/useNotificationScheduler";

interface MyRouterContext {
  queryClient: QueryClient;
}

import { useUIStore } from "@/store/ui.store";
import { DoseSnoozeDrawer } from "@/features/pending-doses/components/DoseSnoozeDrawer";
import { useDoseMutations } from "@/features/reminders/hooks/useDoseMutations";

function RootComponent() {
  useNotificationScheduler(); // Global Notification Scheduler
  const { snoozeDoseId, setSnoozeDoseId } = useUIStore();
  const { snoozeDose } = useDoseMutations();

  return (
    <>
      <AuthListener />
      <ProfileGuard>
        <div className="min-h-screen bg-background font-sans antialiased text-foreground dark:bg-gray-900 dark:text-white transition-colors duration-300">
          <Outlet />
        </div>
      </ProfileGuard>
      <DoseSnoozeDrawer
        open={!!snoozeDoseId}
        onOpenChange={(open) => !open && setSnoozeDoseId(null)}
        onSnooze={async (date) => {
          if (snoozeDoseId) {
            await snoozeDose({ doseId: snoozeDoseId, date });
            setSnoozeDoseId(null);
          }
        }}
      />
      <Toaster />
    </>
  );
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});
