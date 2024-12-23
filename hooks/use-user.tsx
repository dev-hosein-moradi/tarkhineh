import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Define the initial state
interface User {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  mobileNumber: string;
  token: string;
  userId: string;
  isAuthenticated: boolean;
}

const initialState: User = {
  firstname: "",
  lastname: "",
  password: "",
  email: "",
  mobileNumber: "",
  token: "",
  userId: "",
  isAuthenticated: false,
};

// Create a slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<Omit<User, "isAuthenticated">>
    ) => {
      const { firstname, lastname, password, email, mobileNumber, token } =
        action.payload;
      state.firstname = firstname;
      state.lastname = lastname;
      state.password = password;
      state.email = email;
      state.mobileNumber = mobileNumber;
      state.token = token;
      state.isAuthenticated = true;

      const expirationTime = new Date(
        new Date().getTime() + 1 * 60 * 60 * 1000
      );

      Cookies.set("accessToken", token, {
        expires: expirationTime,
        path: "/",
      });
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.mobileNumber = action.payload.mobile;
      state.isAuthenticated = true;

      const expirationTime = new Date(
        new Date().getTime() + 1 * 60 * 60 * 1000
      );

      Cookies.set("accessToken", action.payload.token, {
        expires: expirationTime,
        path: "/",
      });
    },
    updateUserData: (
      state,
      action: PayloadAction<Partial<Omit<User, "isAuthenticated">>>
    ) => {
      Object.assign(state, action.payload);
    },
    logout: (state) => {
      state.firstname = "";
      state.lastname = "";
      state.password = "";
      state.email = "";
      state.mobileNumber = "";
      state.token = "";
      state.userId = "";
      state.isAuthenticated = false;

      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
    },
  },
});

// Export the actions
export const { setToken, setUserData, updateUserData, logout } =
  userSlice.actions;

// Export the reducer
export default userSlice.reducer;
