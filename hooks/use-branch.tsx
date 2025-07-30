import { create } from "zustand";
import { getBranchs } from "@/services/branch-service";
import { IBranch } from "@/types";

interface BranchStore {
  branches: IBranch[] | null;
  loading: boolean;
  error: string | null;
  fetchBranches: () => Promise<void>;
}

export const useBranchStore = create<BranchStore>((set, get) => ({
  branches: null,
  loading: false,
  error: null,

  fetchBranches: async () => {
    // Prevent multiple simultaneous calls
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const data = await getBranchs();
      set({ branches: data, loading: false });
    } catch (error) {
      set({ error: "خطا در دریافت شعبه‌ها", loading: false });
    }
  },
}));
