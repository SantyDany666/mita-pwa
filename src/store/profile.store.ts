import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Tables } from "@/types/database.types";

export type Profile = Tables<"profiles">;

interface ProfileState {
  currentProfile: Profile | null;
  setCurrentProfile: (profile: Profile | null) => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      currentProfile: null,
      setCurrentProfile: (profile) => set({ currentProfile: profile }),
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "profile-storage",
      partialize: (state) => ({ currentProfile: state.currentProfile }),
    },
  ),
);
