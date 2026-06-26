import { create } from "zustand";

export type ModalType = "login";

interface ModalState {
  open: boolean;
  type: ModalType | null;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  open: false,
  type: null,
  openModal: (type) => set({ open: true, type }),
  closeModal: () => set({ open: false, type: null }),
}));
