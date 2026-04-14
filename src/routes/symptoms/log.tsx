import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { SymptomEntryPage } from "@/features/symptoms/pages/SymptomEntryPage";

export const Route = createFileRoute("/symptoms/log")({
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
  component: SymptomEntryPage,
});
