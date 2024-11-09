import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFood } from "@/types";

export interface CartToOrder extends IFood {
  quantity?: number;
  branchId: string;
}

interface CartState {
  items: CartToOrder[];
  addressId: string;
  level: number;
  selectedBranch: string;
}

const initialState: CartState = {
  items: [],
  addressId: "",
  level: 0,
  selectedBranch: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addFoodToCart: (state, action: PayloadAction<CartToOrder>) => {
      state.level = 1;
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem && existingItem.quantity) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },
    updateFoodQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        const newQuantity = Math.max(action.payload.quantity, 0); // Allow quantity to be 0 to trigger removal
        if (newQuantity === 0) {
          state.items = state.items.filter(
            (item) => item.id !== action.payload.id
          );
        } else {
          item.quantity = newQuantity; // Update quantity
        }
      }
    },
    removeFoodFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.level = 1;
      state.selectedBranch = "";
    },
    increaseLevel: (state) => {
      state.level = state.level + 1;
    },
    decreaseLevel: (state) => {
      if (state.level > 1) {
        state.level = state.level - 1;
      }
    },
    addCustomLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload;
    },
    setAddressId: (state, action) => {
      state.addressId = action.payload;
    },
    setSelectedBranch: (state, action) => {
      state.selectedBranch = action.payload;
    },
  },
});

export const {
  addFoodToCart,
  updateFoodQuantity,
  removeFoodFromCart,
  clearCart,
  increaseLevel,
  decreaseLevel,
  addCustomLevel,
  setAddressId,
  setSelectedBranch,
} = cartSlice.actions;
export default cartSlice.reducer;
