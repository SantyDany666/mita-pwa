import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { ReminderDetail } from "@/features/reminders/components/ReminderDetail";

export const Route = createFileRoute("/reminders/$id/")({
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
  loader: async ({ params }) => {
    return {
      id: params.id,
      name: "Paracetamol",
      status: "active" as const,
      dose: "500",
      unit: "mg",
      frequency: "Cada 8 horas",
      duration: "Hasta el 25 de Octubre",
      indications: "Tomar con alimentos",
      stock: 14,
    };
  },
  component: ReminderDetailRoute,
});

function ReminderDetailRoute() {
  const data = Route.useLoaderData();
  return <ReminderDetail {...data} />;
}
