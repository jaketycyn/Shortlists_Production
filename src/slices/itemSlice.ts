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
  //adding status value to rank items
  status: string;
}

export interface UnrankedObject {
  optionSelected: Item[];
  winningRank: number;
  losingOption: Item[];
  losingRank: number;
}

//the entire Items state (all things attributed to items)
export interface ItemState {
  items: Item[];
  loading: boolean;
  error: any;
  round: number;
}

export interface T {
  optionSelected: number;
  combatants: any;
}

//initializing state preloading of any data
const initialState: ItemState = {
  items: null,
  loading: false,
  error: null,
  round: 0,
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
      // state.items[0].potentialRank = 0;
      // state.items[1].potentialRank = 0;
      // state.items[2].potentialRank = 0;
      // state.items[3].potentialRank = 0;
    },

    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    },

    //change current item Rank
    setItemPotentialRank: (state, action: PayloadAction<T>) => {
      console.log("action.payload - setItemPotentialRank: ", action.payload);

      const sortAlgo = (field: any, reverse: any, primer: any) => {
        const key = primer
          ? function (x: any) {
              return primer(x[field]);
            }
          : function (x: any) {
              return x[field];
            };
        reverse = !reverse ? 1 : -1;

        return function (a: any, b: any) {
          return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
        };
      };

      const rankedSortedItems = state.items
        .filter((i) => i.potentialRank > 0)
        .slice()
        .sort(sortAlgo("potentialRank", true, parseInt));

      // declaring variables based on action.payload
      const optionA = action.payload.combatants[0];
      const optionB = action.payload.combatants[1];
      const optionSelected = action.payload.optionSelected;
      const allItemsOptionAIndex = state.items.findIndex(
        (i) => i.id === optionA.id
      );
      const allItemsOptionBIndex = state.items.findIndex(
        (i) => i.id === optionB.id
      );
      const rankedItemsOptionBIndex = rankedSortedItems.findIndex(
        (i) => i.id === optionB.id
      );
      // console.log("OptionA: " + JSON.stringify(optionA, 0, 2));
      // console.log("OptionB: " + JSON.stringify(optionB, 0, 2));

      state.round = 0;

      //*unranked vs ranked
      if (optionA.potentialRank === 0 && optionB.potentialRank !== 0) {
        // console.log("inside unranked vs ranked");
        state.round += 1;
        if (optionSelected === 0) {
          //console.log("top selected");
          // console.log(
          //   "rankedSortedItems: ",
          //   JSON.parse(JSON.stringify(rankedSortedItems))
          // );
          // console.log("all items: ", JSON.parse(JSON.stringify(state.items)));
          // console.log(
          //   "optionAIndex: ",
          //   JSON.parse(JSON.stringify(optionAIndex))
          // );
          // console.log(
          //   "optionBIndex: ",
          //   JSON.parse(JSON.stringify(optionBIndex))
          // );

          //assign new potential rank
          const newPotentialRank =
            (rankedSortedItems[rankedItemsOptionBIndex]?.potentialRank +
              rankedSortedItems[rankedItemsOptionBIndex - 1]?.potentialRank) /
            2;

          state.items[allItemsOptionAIndex]!.potentialRank = newPotentialRank;

          //update status to have item keep ranking
          state.items[allItemsOptionAIndex]!.status = "won";
        }
        if (optionSelected === 1) {
          //console.log("bot selected");

          //? more ranked items exist so it keeps getting ranked
          if (rankedSortedItems[rankedItemsOptionBIndex - 1] !== undefined) {
            console.log(
              "more items to compared - keep ranking - SHOULDNT SEE THIS MESSAGE YET"
            );
          }
          //? optionA is now lowest ranked item - done ranking
          else {
            console.log("done ranking");
          }

          const newPotentialRank =
            rankedSortedItems[rankedItemsOptionBIndex]?.potentialRank / 2;

          console.log("newPotentialRank", newPotentialRank);

          state.items[allItemsOptionAIndex]!.potentialRank = newPotentialRank;
          // console.log(
          //   "rankedSortedItems: ",
          //   JSON.parse(JSON.stringify(rankedSortedItems))
          // );
        }
      }
      //*ranked vs ranked
      if (optionA.potentialRank !== 0 && optionB.potentialRank !== 0) {
        console.log("ranked vs ranked");
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
      const winningRank = 100000;
      const losingRank = 10000;

      const losingCombatantIndex = action.payload.combatants.findIndex(
        (i: any) => i.id !== action.payload.optionSelected.id
      );
      console.log("losingItemIndex ", losingCombatantIndex);

      const losingItem = state.items?.find(
        (i) => i.id === action.payload.combatants[losingCombatantIndex].id
      );
      console.log("losingItem ", JSON.stringify(losingItem, 0, 2));

      const winningItemIndex = state.items?.findIndex(
        (i) => i.id === action.payload.optionSelected.id
      );
      const losingItemIndex = state.items?.findIndex(
        (i) => i.id === losingItem.id
      );

      // console.log("losingItem.id: ", JSON.stringify(losingItem.id, 0, 2));
      // console.log("winningItemIndex: ", winningItemIndex);
      // console.log("losingItemIndex: ", losingItemIndex);
      state.items[winningItemIndex].potentialRank = winningRank;
      state.items[losingItemIndex].potentialRank = losingRank;
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
