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

  /**
   * Initiates the Phone sign-in flow (sends OTP).
   * @param phone The phone number in E.164 format (e.g., +573001234567)
   */
  signInWithPhone: async (phone: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Verifies the OTP sent to the user's phone.
   * @param phone The phone number in E.164 format
   * @param token The 6-digit OTP code
   */
  verifyOtp: async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      throw error;
    }

    return data;
  },

  /**
   * Resends the OTP to the user's phone.
   * Note: Supabase handles rate limiting and resend intervals automatically,
   * but usually calling signInWithOtp again triggers a resend.
   */
  resendOtp: async (phone: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      throw error;
    }

    return data;
  },
};
