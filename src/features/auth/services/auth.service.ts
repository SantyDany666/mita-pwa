import { supabase } from "@/lib/supabase";

export const authService = {
  /**
   * Initiates the OAuth sign-in flow with Google.
   * This will redirect the user to the Google sign-in page.
   */
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // We can request additional scopes here if needed in the future
      },
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Signs out the current user.
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  },
};
