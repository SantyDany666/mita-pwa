import { createFileRoute, redirect } from "@tanstack/react-router";
import { SymptomDetailPage } from "@/features/symptoms/pages/SymptomDetailPage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/symptoms/$symptomId")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/welcome" });
    }
  },
  component: SymptomDetailRoute,
});

function SymptomDetailRoute() {
  const { symptomId } = Route.useParams();
  return <SymptomDetailPage symptomId={symptomId} />;
}
