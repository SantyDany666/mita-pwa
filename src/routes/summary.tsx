import { createFileRoute, redirect } from "@tanstack/react-router";
import SummaryPage from "@/features/summary/pages/SummaryPage";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/summary")({
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
  component: SummaryPage,
});
