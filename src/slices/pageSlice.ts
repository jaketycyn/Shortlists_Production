import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PagesState {
  activePage: number;
}

const initialState: PagesState = {
  activePage: 0,
};

const pagesSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    decrementActivePage: (state) => {
      state.activePage = Math.max(0, state.activePage - 1);
    },
    incrementActivePage: (state) => {
      state.activePage += 1;
    },
    setActivePage: (state, action: PayloadAction<number>) => {
      state.activePage = action.payload;
    },
  },
});

export const { decrementActivePage, incrementActivePage, setActivePage } =
  pagesSlice.actions;
export default pagesSlice.reducer;
