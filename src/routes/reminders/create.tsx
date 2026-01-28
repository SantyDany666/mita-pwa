import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { ReminderForm } from "@/features/reminders/components/ReminderForm";

export const Route = createFileRoute("/reminders/create")({
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
  component: () => <ReminderForm mode="create" />,
});
