import { create } from "zustand";

interface AppState {
  ready: boolean;
  setReady: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  ready: false,
  setReady: (value) => set({ ready: value }),
}));
