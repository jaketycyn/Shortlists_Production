import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasError: false,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state) => {
      state.hasError = true;
    },
    clearError: (state) => {
      state.hasError = false;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
