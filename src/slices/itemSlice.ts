import { Item } from "./itemSlice";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { trpc } from "../utils/trpc";

// individual item
export interface Item {
  listId: string | undefined;
  id: string;
  userId: string;
  title: string;
  archive: string;
  //This date will force a serialization error every time Will need to be converted to a string later or omitted on storage.
  createdAt: Date;
  //could add createdAt: string | Date
  // for now swapping it fully over to string since it gets converted to string on import
  potentialRank: null | number;
  currentRank: null | number;
}

export interface UnrankedObject {
  optionSelected: Item[];
  winningRank: Number;
  losingOption: Item[];
  losingRank: Number;
}

//the entire Items state (all things attributed to items)
export interface ItemState {
  items: Item[];
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
    //hardcoded reset items rank
    //keep for when server is pinged
    resetItemsTest: (state) => {
      state.items[0].potentialRank = 0;
      state.items[1].potentialRank = 0;
      state.items[2].potentialRank = 0;
      state.items[3].potentialRank = 0;
    },

    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },

    //change current item Rank
    setItemPotentialRank: (state, action: PayloadAction<Object>) => {
      //! hard code test - begin
      // const { index, rank } = action.payload;
      // console.log("hi - inside itemSlice", action.payload);
      // console.log("index", index);
      // console.log("rank", rank);
      // state.items[index].potentialRank = rank;
      //! hard code test - end
      console.log("payload received - ", action.payload);

      //modifiying winning option
      if (action.payload.optionSelected) {
        console.log("optionSelected exists");
        //find Item matching Option Selected
        // const foundItem = state.items?.find(
        //   (i) => i.id === action.payload.optionSelected.id
        // );
        //console.log("found Item: ", JSON.stringify(foundItem, 0, 2));
        const foundItemIndex = state.items?.findIndex(
          (i) => i.id === action.payload.optionSelected.id
        );
        console.log(
          "found foundItemIndex: ",
          JSON.stringify(foundItemIndex, 0, 2)
        );

        state.items[foundItemIndex].potentialRank = action.payload.rank;
      }

      //modifying losing option (only for 2 unranked items)
      if (action.payload.losingUnrankedOption) {
        // console.log(
        //   "losingOption exists",
        //   action.payload.losingUnrankedOption[0].id
        // );
        //find Item matching Option Selected

        // const foundItem = state.items?.find(
        //   (i) => i.id === action.payload.losingUnrankedOption[0].id
        // );
        //console.log("found Item: ", JSON.stringify(foundItem, 0, 2));
        const foundItemIndex = state.items?.findIndex(
          (i) => i.id === action.payload.losingUnrankedOption[0].id
        );
        console.log(
          "lost foundItemIndex: ",
          JSON.stringify(foundItemIndex, 0, 2)
        );

        console.log(
          "asdfasdfasf - ",
          action.payload.losingUnrankedOption.losingRank
        );

        //state.items[foundItemIndex].potentialRank = action.payload.losingRank;
      }
    },
    setInitialItemsPotentialRank: (
      state,
      action: PayloadAction<UnrankedObject>
    ) => {
      console.log(
        "action.payload - setInitialItemsPotentialRank: ",
        action.payload
      );

      const winningItemIndex = state.items?.findIndex(
        (i) => i.id === action.payload.optionSelected.id
      );
      const losingItemIndex = state.items?.findIndex(
        (i) => i.id === action.payload.losingOption.id
      );
      state.items[winningItemIndex].potentialRank = action.payload.winningRank;
      state.items[losingItemIndex].potentialRank = action.payload.losingRank;
    },
  },
});

export default itemSlice.reducer;
export const {
  resetItemsTest,
  setItems,
  setItemPotentialRank,
  setInitialItemsPotentialRank,
} = itemSlice.actions;
