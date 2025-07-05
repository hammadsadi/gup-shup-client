import type { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

interface IUser {
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  isAccountActive?: boolean;
  id?: string;
}
interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
}
const initialState: IAuthState = {
  user: null,
  accessToken: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // const { user, accessToken } = action.payload;
      state.user = action.payload;
      // state.accessToken = accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
    cleanUser: (state) => {
      state.user = null;
    },
  },
});

export const authSelector = (state: RootState) => state.auth;
export const loggedInUserSelector = (state: RootState) => state.auth.user;

// Action
export const { setUser, logout, cleanUser } = authSlice.actions;

export default authSlice.reducer;
