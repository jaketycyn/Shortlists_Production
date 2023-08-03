import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// individual list
export interface User {
  id: string;
  username: string;
  email: string;
}

//the entire Lists state (all things attributed to lists)
export interface UserState {
  users: null | User[];
  loading: boolean;
  error: any;
}

//initializing state preloading of any data
const initialState: UserState = {
  users: null,

  loading: false,
  error: null,
};

// ACTIONS

// SLICE
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
  },
});

export default userSlice.reducer;
export const { setUsers } = userSlice.actions;
