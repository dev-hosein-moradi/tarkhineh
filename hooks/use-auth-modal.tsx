import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state
interface AuthModalState {
  isOpen: boolean;
  level: number;
}

const initialState: AuthModalState = {
  isOpen: false,
  level: 1,
};

// Create a slice
const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    onOpen: (state) => {
      state.isOpen = true;
    },
    onClose: (state) => {
      state.isOpen = false;
    },
    nextLevel: (state) => {
      state.level = 2;
    },
    prevLevel: (state) => {
      state.level = 1;
    },
  },
});

// Export the actions
export const { onOpen, onClose, nextLevel, prevLevel } = authModalSlice.actions;

// Export the reducer
export default authModalSlice.reducer;
