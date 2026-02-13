import { create } from "zustand";

interface UIState {
  snoozeDoseId: string | null;
  setSnoozeDoseId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  snoozeDoseId: null,
  setSnoozeDoseId: (id) => set({ snoozeDoseId: id }),
}));
