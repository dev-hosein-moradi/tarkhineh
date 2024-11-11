import { IOrder } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartToOrder } from "./use-cart";

// Define the initial state

export interface UserOrder extends IOrder {
  orders: UserOrder[];
  branchId: string;
}

const initialState: UserOrder = {
  id: "",
  userId: "",
  foods: [{ id: "", quantity: 0 }],
  status: "",
  userAddress: "",
  price: "",
  time: "",
  discount: "",
  deliverType: "",
  branchId: "",
  orders: [],
  paymentType: "",
};

// Create a slice
const userOrderSlice = createSlice({
  name: "userOrder",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
});

// Export the actions
export const { setOrders } = userOrderSlice.actions;

// Export the reducer
export default userOrderSlice.reducer;
