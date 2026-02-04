import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";

export const Route = createFileRoute("/profile")({
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
  component: ProfilePage,
});
