/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// individual item
export interface Item {
  listId: string;
  id: string;
  userId: string;
  title: string;
  archive: string;
  //This date will force a serialization error every time Will need to be converted to a string later or omitted on storage.
  createdAt: Date;
  //could add createdAt: string | Date
  // for now swapping it fully over to string since it gets converted to string on import
  potentialRank: number;
  currentRank: number;
  //adding status value to rank items
  status: string;
  botBound: number;
  topBound: number;
}

export interface UnrankedObject {
  optionSelected: Item;
  combatants: Item[];
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
  items: [],
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
      //console.log("action.payload - setItemPotentialRank: ", action.payload);

      const sortedRankedItems = state.items.filter(
        (i) => i.potentialRank !== null && i.potentialRank > 0
      );

      const rankedSortedItems = sortedRankedItems.sort(
        (a, b) => b.potentialRank! - a.potentialRank!
      );

      // declaring variables based on action.payload
      const optA = action.payload.combatants[0];
      //console.log("optA inside Redux: ", optA);
      const optB = action.payload.combatants[1];
      const optionSelected = action.payload.optionSelected;
      const allItemsOptAIndex = state.items.findIndex((i) => i.id === optA.id);

      const rankedItemsOptBIndex = rankedSortedItems.findIndex(
        (i) => i.id === optB.id
      );

      const rankedSortedItemsExcludeOptA = rankedSortedItems.filter(
        (i) => i.id !== optA.id
      );
      state.round = 0;

      //*unranked vs ranked
      if (optA.potentialRank === 0 && optB.potentialRank !== 0) {
        // console.log("inside unranked vs ranked");
        state.round += 1;
        if (optionSelected === 0) {
          //assign new potential rank

          const optBPotRank =
            rankedSortedItems[rankedItemsOptBIndex]?.potentialRank;
          const itemAboveOptBPotRank =
            rankedSortedItems[rankedItemsOptBIndex - 1]?.potentialRank;

          if (
            typeof optBPotRank === "number" &&
            typeof itemAboveOptBPotRank === "number"
          ) {
            const newPotentialRank = (optBPotRank + itemAboveOptBPotRank) / 2;

            state.items[allItemsOptAIndex]!.potentialRank = newPotentialRank;

            //update status to have item keep ranking
            state.items[allItemsOptAIndex]!.status = "won";
            state.items[allItemsOptAIndex]!.botBound =
              rankedSortedItems[rankedItemsOptBIndex]?.potentialRank!;
            state.items[allItemsOptAIndex]!.topBound =
              rankedSortedItems[0]?.potentialRank! + 1;
          }
        }
        if (optionSelected === 1) {
          //? more ranked items exist so it keeps getting ranked
          if (rankedSortedItems[rankedItemsOptBIndex + 1] !== undefined) {
            console.log(
              "more items to compared - keep ranking - SHOULDNT SEE THIS MESSAGE YET"
            );

            const newPotentialRank =
              (rankedSortedItems[rankedItemsOptBIndex]?.potentialRank! +
                rankedSortedItems[rankedItemsOptBIndex + 1]?.potentialRank!) /
              2;

            console.log("newPotentialRank", newPotentialRank);

            state.items[allItemsOptAIndex]!.potentialRank = newPotentialRank;

            state.items[allItemsOptAIndex]!.status = "lost";
            state.items[allItemsOptAIndex]!.topBound =
              rankedSortedItems[rankedItemsOptBIndex]?.potentialRank!;
            state.items[allItemsOptAIndex]!.botBound =
              rankedSortedItems[rankedSortedItems.length - 1]?.potentialRank! -
              1;
          } else {
            //? optA is now lowest ranked item - done ranking
            console.log("done ranking");

            const newPotentialRank =
              rankedSortedItems[rankedItemsOptBIndex]?.potentialRank! / 2;

            console.log("newPotentialRank: ", newPotentialRank);
            state.items[allItemsOptAIndex]!.potentialRank = newPotentialRank;
          }

          // console.log(
          //   "rankedSortedItems: ",
          //   JSON.parse(JSON.stringify(rankedSortedItems))
          // );
        }
      }
      //*ranked vs ranked
      if (optA.potentialRank > 0 && optB.potentialRank !== 0) {
        //console.log("ranked vs ranked");
        if (optA.status === "lost") {
          if (optionSelected === 0) {
            //OPT A is selected
            console.log("rankedItemsOptBIndex", rankedItemsOptBIndex);
            //assign new botBound based on optB.rank to optA
            const botBound: number = optB.potentialRank;

            //find new opponents
            const possOpponents = rankedSortedItemsExcludeOptA.filter(
              (i) =>
                optA.topBound > i.potentialRank! && i.potentialRank! > botBound
            );
            console.log(
              "possOpponents - coming off a loss - rvr - A selected: ",
              JSON.parse(JSON.stringify(possOpponents))
            );

            //scenario 1: no botBound on optA && no possOpps => this item faced the very bottom item but isnt' the lowest

            if (possOpponents.length === 0) {
              state.items[allItemsOptAIndex]!.status = "";
              console.log("End of Ranking " + optA.title);
              //correctly assign newPotentialRank =
              const newPotentialRank =
                (rankedSortedItems[rankedItemsOptBIndex]?.potentialRank! +
                  rankedSortedItems[rankedItemsOptBIndex - 1]?.potentialRank!) /
                2;
              state.items[allItemsOptAIndex]!.potentialRank = newPotentialRank;
              //! dispatch rank based on optA.potentialRank
            } else if (possOpponents.length > 0) {
              state.items[allItemsOptAIndex]!.botBound = botBound;
              state.items[allItemsOptAIndex]!.status = "won";
              console.log("more opponents to face");
            } else {
              console.log("ERROR ERROR ERROR");
            }
          }
          if (optionSelected === 1) {
            const topBound: number = optB.potentialRank;
            const possOpponents = rankedSortedItemsExcludeOptA.filter(
              (i) =>
                topBound > i.potentialRank! && i.potentialRank! > optA.botBound
            );
            console.log(
              "possOpponents - coming off a loss - rvr - B selected: ",
              JSON.parse(JSON.stringify(possOpponents))
            );

            //check if nly 1 item left means its perfectly ranked where its potentiall rank currently is
            if (possOpponents.length === 1) {
              //continue to face more opponents
              console.log("2 loses in a row but 1 final matchup");
              state.items[allItemsOptAIndex]!.topBound = optB.potentialRank;

              //! send update to database of rank for optA based on potentialRank
            }
            if (possOpponents.length === 0) {
              const newPotentialRank =
                rankedSortedItems[rankedItemsOptBIndex]?.potentialRank! / 2;

              console.log("newPotentialRank: ", newPotentialRank);
              state.items[allItemsOptAIndex]!.potentialRank = newPotentialRank;
              state.items[allItemsOptAIndex]!.status = "";
            }
            //more possible items to face keep ranking
          }
        } else if (optA.status === "won") {
          if (optionSelected === 0) {
            //console.log("rankedItemsOptBIndex", rankedItemsOptBIndex);
            if (rankedItemsOptBIndex === 0) {
              console.log("This item is new top ranked item");

              const optionBPotRank =
                rankedSortedItems[rankedItemsOptBIndex]?.potentialRank;
              if (typeof optionBPotRank === "number") {
                const newPotentialRank = optionBPotRank * 2;

                state.items[allItemsOptAIndex]!.status = "";
                state.items[allItemsOptAIndex]!.potentialRank =
                  newPotentialRank;
              }

              // const newPotentialRank =
              //   rankedSortedItems[rankedItemsOptBIndex]?.potentialRank! * 2;

              // console.log("newPotentialRank: ", newPotentialRank);

              //! send update to database of rank for optA based on potentialRank
            } else if (rankedItemsOptBIndex !== 0) {
              //assign new botBound based on optB.rank to optA
              const botBound: number = optB.potentialRank;

              //find new opponents
              const possOpponents = rankedSortedItemsExcludeOptA.filter(
                (i) =>
                  optA.topBound > i.potentialRank! &&
                  i.potentialRank! > botBound
              );
              console.log(
                "possOpponents - coming off a Win - rvr - A selected: ",
                JSON.parse(JSON.stringify(possOpponents))
              );

              console.log("possOpp length: ", possOpponents.length);

              if (possOpponents.length === 0) {
                console.log("End of ranking: " + optA.title);
                state.items[allItemsOptAIndex]!.status = "";

                //! send update to database of rank for optA based on potentialRank
              } else if (possOpponents.length > 0) {
                const optionBPotRank =
                  rankedSortedItems[rankedItemsOptBIndex]?.potentialRank!;
                const itemAboveOptionBPotRank =
                  rankedSortedItems[rankedItemsOptBIndex - 1]?.potentialRank!;

                if (
                  typeof optionBPotRank === "number" &&
                  typeof itemAboveOptionBPotRank === "number"
                ) {
                  const newPotentialRank =
                    (optionBPotRank + itemAboveOptionBPotRank) / 2;

                  state.items[allItemsOptAIndex]!.potentialRank =
                    newPotentialRank;
                  state.items[allItemsOptAIndex]!.botBound =
                    rankedSortedItems[rankedItemsOptBIndex]?.potentialRank!;
                }
              }
            } else {
              console.log("ERROR ERROR ERROR");
            }
          } else if (optionSelected === 1) {
            // console.log(
            //   "rankedSortedItems: ",
            //   JSON.parse(JSON.stringify(rankedSortedItems))
            // );
            const topBound: number = optB.potentialRank;

            const possOpponents = rankedSortedItemsExcludeOptA.filter(
              (i) =>
                topBound > i.potentialRank! && i.potentialRank! > optA.botBound
            );

            console.log(
              "possOpponents - coming off a win - rvr - B selected: ",
              JSON.parse(JSON.stringify(possOpponents))
            );

            //check if only 1 item left means its perfectly ranked where its potentiall rank currently is
            if (possOpponents.length === 0) {
              const newPotentialRank =
                (rankedSortedItems[rankedItemsOptBIndex]?.potentialRank! +
                  rankedSortedItems[rankedItemsOptBIndex + 1]?.potentialRank!) /
                2;
              console.log("end of ranking: ", optA.title);
              state.items[allItemsOptAIndex]!.status = "";

              state.items[allItemsOptAIndex]!.potentialRank = newPotentialRank;
              state.items[allItemsOptAIndex]!.topBound =
                rankedSortedItems[rankedItemsOptBIndex]?.potentialRank!;

              //! send update to database of rank for optA based on potentialRank
            }
            if (possOpponents.length > 0) {
              console.log("more opponents");
              //assign new status
              state.items[allItemsOptAIndex]!.status = "lost";
              //assign new topBound
              state.items[allItemsOptAIndex]!.topBound =
                rankedSortedItems[rankedItemsOptBIndex]?.potentialRank!;
            }
            //more possible items to face keep ranking
          }
        }
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
        (i) => i.id === action.payload.combatants[losingCombatantIndex]!.id
      );

      const winningItemIndex = state.items?.findIndex(
        (i) => i.id === action.payload.optionSelected.id
      );
      const losingItemIndex = state.items?.findIndex(
        (i) => i.id === losingItem!.id
      );

      // console.log("losingItem.id: ", JSON.stringify(losingItem.id, 0, 2));
      // console.log("winningItemIndex: ", winningItemIndex);
      // console.log("losingItemIndex: ", losingItemIndex);
      state.items[winningItemIndex]!.potentialRank = winningRank;
      state.items[losingItemIndex]!.potentialRank = losingRank;
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
