import { createFileRoute, redirect } from "@tanstack/react-router";
import { MoodEntryPage } from "@/features/mood-tracking/pages/MoodEntryPage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/mood/log")({
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
  component: MoodEntryPage,
});
