import { getCategories } from "@/services/category-service";
import { ICategory } from "@/types";
import { create } from "zustand";

// Define the state and actions for the store
export const useCategoryStore = create<{
  categories: ICategory[];
  fetchCategories: () => Promise<void>;
  setCategories: (categories: ICategory[]) => void;
  addCategory: (category: ICategory) => void;
  updateCategory: (id: string, updateCategory: Partial<ICategory>) => void;
  removeCategory: (id: string) => void;
}>((set) => ({
  categories: [],

  fetchCategories: async () => {
    try {
      const categories = await getCategories();
      set({ categories });
    } catch (error) {
      console.error("Failed to fetch categories in hook", error);
    }
  },

  setCategories: (categories) => set(() => ({ categories })),

  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),

  updateCategory: (id, updateCategory) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === id ? { ...category, ...updateCategory } : category
      ),
    })),

  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((category) => category.id !== id),
    })),
}));
