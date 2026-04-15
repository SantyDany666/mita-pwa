import { createFileRoute, redirect } from "@tanstack/react-router";
import { MoodDetailPage } from "@/features/mood-tracking/pages/MoodDetailPage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/mood/$moodId")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/welcome" });
    }
  },
  component: MoodDetailRoute,
});

function MoodDetailRoute() {
  const { moodId } = Route.useParams();
  return <MoodDetailPage moodId={moodId} />;
}
