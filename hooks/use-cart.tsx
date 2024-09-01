import { IFood } from "@/types";
import { create } from "zustand";

interface CartItem extends IFood {
  quantity: number;
}

export const useCartStore = create<{
  carts: CartItem[];
  addFoodToCart: (food: IFood) => void;
  updateFoodQuantity: (id: string, quantity: number) => void;
  removeFoodFromCart: (id: string) => void;
  clearCart: () => void;
}>((set) => ({
  carts: [],

  addFoodToCart: (food) =>
    set((state) => {
      const existingItem = state.carts.find((item) => item.id === food.id);
      if (existingItem) {
        return {
          carts: state.carts.map((item) =>
            item.id === food.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return { carts: [...state.carts, { ...food, quantity: 1 }] };
      }
    }),

  updateFoodQuantity: (id, quantity) =>
    set((state) => ({
      carts: state.carts.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      ),
    })),

  removeFoodFromCart: (id) =>
    set((state) => ({
      carts: state.carts.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ carts: [] }),
}));
