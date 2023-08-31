import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { trpc } from "../utils/trpc";

// individual list
export interface List {
  archive: string | null;
  createdAt: Date;
  id: string;
  parentListId: string | undefined | null;
  parentListUserId: string | undefined | null;
  title: string | null;
  userId: string;
  //This date will force a serialization error every time Will need to be converted to a string later or omitted on storage.
}

// feature list
export interface FeaturedList extends List {
  coverImage: string;
  category?: string;
}

//the entire Lists state (all things attributed to lists)
export interface ListState {
  activeList: undefined | List;
  error: any;
  featuredLists: null | FeaturedList[];
  lists: null | List[];
  loading: boolean;
}

//initializing state preloading of any data
const initialState: ListState = {
  activeList: undefined,
  error: null,
  featuredLists: null,
  lists: null,
  loading: false,
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

export const getFeaturedLists = createAsyncThunk(
  "lists/getFeaturedLists",
  async (adminUserId: string, thunkApi) => {
    try {
      const response = await trpc.userList.getListsByUserId.useQuery({
        userId: adminUserId,
      });
      return response.data?.filter((list) => list.archive !== "trash");
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
    setActiveList: (state, action: PayloadAction<any>) => {
      state.activeList = action.payload;
    },
    setFeaturedLists: (state, action: PayloadAction<FeaturedList[]>) => {
      state.featuredLists = action.payload;
    },
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
    },
    setListsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // getFeaturedLists
      .addCase(getFeaturedLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getFeaturedLists.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.featuredLists = action.payload;
        }
      )
      .addCase(
        getFeaturedLists.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      // getLists
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
export const { setActiveList, setFeaturedLists, setLists, setListsLoading } =
  listSlice.actions;
