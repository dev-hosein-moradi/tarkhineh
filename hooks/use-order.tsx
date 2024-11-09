import { IOrder } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state

interface UserOrder extends IOrder {
  orders: IOrder[];
}

const initialState: UserOrder = {
  id: "",
  userId: "",
  foods: [{ id: "", quantity: 0 }],
  status: "",
  userAddress: "",
  price: "",
  time: "",
  orders: [],
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
