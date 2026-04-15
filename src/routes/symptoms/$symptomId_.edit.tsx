import { createFileRoute, redirect } from "@tanstack/react-router";
import { SymptomEntryPage } from "@/features/symptoms/pages/SymptomEntryPage";
import { supabase } from "@/lib/supabase";
import { symptomService } from "@/features/symptoms/services/symptom.service";

export const Route = createFileRoute("/symptoms/$symptomId_/edit")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/welcome" });
    }
  },
  loader: async ({ params }) => {
    return symptomService.getById(params.symptomId);
  },
  component: SymptomEditRoute,
});

function SymptomEditRoute() {
  const { symptomId } = Route.useParams();
  const symptom = Route.useLoaderData();
  return (
    <SymptomEntryPage
      mode="edit"
      symptomId={symptomId}
      initialValues={{
        symptom: symptom.symptom,
        intensity: symptom.intensity,
        note: symptom.note ?? "",
      }}
    />
  );
}
