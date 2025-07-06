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
interface IUserState {
  userList: IUser | null;
}
const initialState: IUserState = {
  userList: null,
};
const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserList: (state, action) => {
      // const { user, accessToken } = action.payload;
      state.userList = action.payload;
      // state.accessToken = accessToken;
    },
  },
});

// Action
export const { setUserList } = userSlice.actions;

export default userSlice.reducer;
