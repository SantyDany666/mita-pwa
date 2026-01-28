import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { PendingDosesPage } from "@/features/pending-doses/pages/PendingDosesPage";

export const Route = createFileRoute("/pending-doses")({
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
  validateSearch: (
    search: Record<string, unknown>,
  ): { view: "today" | "week" } => {
    const view = search.view as string;
    return {
      view: view === "today" || view === "week" ? view : "today",
    };
  },
  component: PendingDosesPage,
});
