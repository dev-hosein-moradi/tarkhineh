import { IBranch } from "@/types";
import { create } from "zustand";
import axios from "axios";
import { getBranchs } from "@/services/branch-service";

// Define the state and actions for the store
export const useBranchStore = create<{
  branches: IBranch[];
  fetchBranches: () => Promise<void>;
  setBranches: (branches: IBranch[]) => void;
  addBranch: (branch: IBranch) => void;
  updateBranch: (id: string, updatedBranch: Partial<IBranch>) => void;
  removeBranch: (id: string) => void;
}>((set) => ({
  branches: [],

  fetchBranches: async () => {
    try {
      const branches = await getBranchs();
      set({ branches: branches || [] });
    } catch (error) {
      console.error("Failed to fetch branches in hook", error);
    }
  },

  setBranches: (branches) => set(() => ({ branches })),

  addBranch: (branch) =>
    set((state) => ({ branches: [...state.branches, branch] })),

  updateBranch: (id, updatedBranch) =>
    set((state) => ({
      branches: state.branches.map((branch) =>
        branch.id === id ? { ...branch, ...updatedBranch } : branch
      ),
    })),

  removeBranch: (id) =>
    set((state) => ({
      branches: state.branches.filter((branch) => branch.id !== id),
    })),
}));
