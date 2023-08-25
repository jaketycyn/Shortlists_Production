import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PagesState {
  activePage: number;
  pageLimit: number;
}

const initialState: PagesState = {
  activePage: 0,
  pageLimit: 3,
};

const pagesSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    decrementActivePage: (state) => {
      state.activePage = Math.max(0, state.activePage - 1);
    },
    incrementActivePage: (state) => {
      // ensure the active page is not greater than the page limit
      if (state.activePage < state.pageLimit - 1) {
        state.activePage += 1;
      }
    },
    setActivePage: (state, action: PayloadAction<number>) => {
      state.activePage = action.payload;
    },
  },
});

export const { decrementActivePage, incrementActivePage, setActivePage } =
  pagesSlice.actions;
export default pagesSlice.reducer;
