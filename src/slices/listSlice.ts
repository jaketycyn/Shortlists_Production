import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { trpc } from "../utils/trpc";

// individual list
export interface List {
  id: string;
  userId: string;
  title: string;
  archive: string;
  //This date will force a serialization error every time Will need to be converted to a string later or omitted on storage.
  createdAt: Date;
  parentListId: string | undefined;
  parentListUserId: string | undefined;
}

//the entire Lists state (all things attributed to lists)
export interface ListState {
  lists: null | List[];
  activeList: undefined | List;
  loading: boolean;
  error: any;
}

//initializing state preloading of any data
const initialState: ListState = {
  lists: null,
  activeList: undefined,
  loading: false,
  error: null,
};

// ACTIONS
export const getLists = createAsyncThunk(
  "lists/getLists",
  async (lists, thunkApi) => {
    try {
      const response = trpc.userList.getLists.useQuery();
      //const response = "hi";
      console.log("response in Slice: ", response);

      return response;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

// SLICE
export const listSlice = createSlice({
  name: "lists",
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
    },
    setActiveList: (state, action: PayloadAction<any>) => {
      state.activeList = action.payload;
    },
    setListsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLists.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(getLists.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default listSlice.reducer;
export const { setLists, setActiveList, setListsLoading } = listSlice.actions;
