import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const addressModalSlice = createSlice({
  name: "addressModal",
  initialState,
  reducers: {
    onOpen: (state) => {
      state.isOpen = true;
    },
    onClose: (state) => {
      state.isOpen = false;
    },
  },
});

export const { onOpen, onClose } = addressModalSlice.actions;

export default addressModalSlice.reducer;
