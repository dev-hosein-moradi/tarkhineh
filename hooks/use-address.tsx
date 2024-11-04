import { IAddress } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state

interface UserAddress extends IAddress {
  addresses: [];
}

const initialState: UserAddress = {
  id: "",
  title: "",
  content: "",
  tel: "",
  userId: "",
  isReciver: false,
  addresses: [],
};
// Create a slice
const userAddressSlice = createSlice({
  name: "userAddress",
  initialState,
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload;
      console.log(action.payload);
    },
  },
});

// Export the actions
export const { setAddresses } = userAddressSlice.actions;

// Export the reducer
export default userAddressSlice.reducer;
