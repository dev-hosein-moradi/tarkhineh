import { create } from "zustand";
import { getCategories } from "@/services/category-service"; // Update with your service
import { ICategory } from "@/types";

interface CategoryStore {
  categories: ICategory[] | null;
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: null,
  loading: false,
  error: null,

  fetchCategories: async () => {
    // Prevent multiple simultaneous calls
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const data = await getCategories();
      set({ categories: data, loading: false });
    } catch (error) {
      set({ error: "خطا در دریافت دسته‌بندی‌ها", loading: false });
    }
  },
}));
