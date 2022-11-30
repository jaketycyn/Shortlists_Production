import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { trpc } from "../utils/trpc";

// individual item
export interface Item {
  id: string;
  userId: string;
  title: string;
  //This date will force a serialization error every time Will need to be converted to a string later or omitted on storage.
  createdAt: Date;
}

//the entire Items state (all things attributed to items)
export interface ItemState {
  items: null | Item[];
  loading: boolean;
  error: any;
}

//initializing state preloading of any data
const initialState: ItemState = {
  items: null,
  loading: false,
  error: null,
};

// ACTIONS

// SLICE
export const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },
  },
});

export default itemSlice.reducer;
export const { setItems } = itemSlice.actions;
