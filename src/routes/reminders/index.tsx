import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { RemindersPage } from "@/features/reminders/pages/RemindersPage";

export const Route = createFileRoute("/reminders/")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({
        to: "/welcome",
      });
    }
  },
  component: RemindersPage,
});
