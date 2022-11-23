import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { List } from "../interfaces/List";
import { trpc } from "../../utils/trpc";

import type { RootState } from "../store";
import build from "next/dist/build";

interface ListState {
  lists: List[] | null;
  loading: boolean;
  singleList: List | null;
  errors: any;
}

// Define the initial state using that type
const initialState: ListState = {
  lists: [],
  loading: false,
  singleList: null,
  errors: null,
};

// actions are processes that get data from backend
export const getLists = createAsyncThunk(
  "lists/getLists",
  async (_, thunkAPI) => {
    try {
      const response = await trpc.userList.getLists.useQuery();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// reducers -> reduce to a specific state or changes state
// https://youtu.be/02qV2icZahk?t=4227

export const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
    },
  },
  // extra reducers model the lifetime process (the lifecycle) of getting the lists
  //
  extraReducers: (builder) => {
    builder.addCase(getLists.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLists.fulfilled, (state, action) => {
      state.lists = action.payload;
      state.loading = false;
    });
    builder.addCase(getLists.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    });
  },
});

export default listSlice.reducer;
export const { setLists } = listSlice.actions;
