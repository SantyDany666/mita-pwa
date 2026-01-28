import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { ReminderForm } from "@/features/reminders/components/ReminderForm";

export const Route = createFileRoute("/reminders/$id/edit")({
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
  loader: async () => {
    return {
      initialValues: {
        name: "Paracetamol",
        dose: "500",
        unit: "mg",
        route: "one",
        frequency: "8h",
        duration: "date",
        indications: "Tomar con mucha agua",
      },
    };
  },
  component: EditReminderRoute,
});

function EditReminderRoute() {
  const { initialValues } = Route.useLoaderData();
  return <ReminderForm mode="edit" initialValues={initialValues} />;
}
