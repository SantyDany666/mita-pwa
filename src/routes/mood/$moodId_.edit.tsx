import { createFileRoute, redirect } from "@tanstack/react-router";
import { MoodEntryPage } from "@/features/mood-tracking/pages/MoodEntryPage";
import { supabase } from "@/lib/supabase";
import { moodService } from "@/features/mood-tracking/services/mood.service";

export const Route = createFileRoute("/mood/$moodId_/edit")({
  beforeLoad: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/welcome" });
    }
  },
  loader: async ({ params }) => {
    return moodService.getById(params.moodId);
  },
  component: MoodEditRoute,
});

function MoodEditRoute() {
  const { moodId } = Route.useParams();
  const mood = Route.useLoaderData();
  return (
    <MoodEntryPage
      mode="edit"
      moodId={moodId}
      initialValues={{
        mood: mood.mood_value,
        note: mood.note ?? "",
      }}
    />
  );
}
