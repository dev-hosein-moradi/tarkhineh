import { create } from "zustand";

interface useAuthModalStore {
  isOpen: boolean;
  level: number;
  onOpen: () => void;
  onClose: () => void;
  nextLevel: () => void;
  prevLevel: () => void;
}

export const useAuthModal = create<useAuthModalStore>((set) => ({
  isOpen: false,
  level: 1,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  nextLevel: () => set({ level: 2 }),
  prevLevel: () => set({ level: 1 }),
}));
