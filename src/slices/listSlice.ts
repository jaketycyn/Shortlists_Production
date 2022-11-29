import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ListState {
  value: number;
}

const initialState: ListState = {
  value: 0,
};

export const listSlice = createSlice({
  name: "listSlice",
  initialState,
  reducers: {
    addList: (state) => {
      state.value += 1;
    },
    removeList: (state) => {
      state.value -= 1;
    },
    getLists: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { addList, removeList, getLists } = listSlice.actions;

export default listSlice.reducer;
