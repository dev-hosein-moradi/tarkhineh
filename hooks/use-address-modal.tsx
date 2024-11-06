import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  selectedId: null as string | null, // Specify type as string | null
};

const addressModalSlice = createSlice({
  name: "addressModal",
  initialState,
  reducers: {
    onOpen: (state, action: PayloadAction<string | null>) => {
      state.isOpen = true;
      state.selectedId = action.payload; // Store the passed ID or null
    },
    onClose: (state) => {
      state.isOpen = false;
      state.selectedId = null; // Reset the ID when closing
    },
  },
});

export const { onOpen, onClose } = addressModalSlice.actions;

export default addressModalSlice.reducer;
