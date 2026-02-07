import { supabase } from "@/lib/supabase";
import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";

export const authService = {
  /**
   * Initiates the OAuth sign-in flow with Google.
   * On Native (Android/iOS), it uses the native Google Sign-In SDK.
   * On Web, it redirects to the Google sign-in page.
   */
  signInWithGoogle: async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const result = await SocialLogin.login({
          provider: "google",
          options: {
            scopes: ["email", "profile"],
          },
        });

        if (result.result.responseType === "offline") {
          throw new Error("Offline mode not supported");
        }

        const idToken = result.result.idToken;
        if (!idToken) throw new Error("No ID Token found");

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
        });

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            // We can request additional scopes here if needed in the future
          },
        });

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
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
      type: "sms",
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
