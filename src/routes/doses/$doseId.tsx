import { createFileRoute, redirect } from "@tanstack/react-router";
import { DoseDetailPage } from "@/features/pending-doses/pages/DoseDetailPage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/doses/$doseId")({
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
  component: DoseDetailRoute,
});

function DoseDetailRoute() {
  const { doseId } = Route.useParams();

  return <DoseDetailPage doseId={doseId} />;
}
