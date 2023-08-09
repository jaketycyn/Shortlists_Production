import React from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { trpc } from "../../utils/trpc";
import { type UpdateItemsRankSchema } from "../../server/schema/itemSchema";
import {
  setItemPotentialRank,
  setInitialItemsPotentialRank,
} from "../../slices/itemSlice";

const Ranking = () => {
  //imports - remove unnecsarry later
  const router = useRouter();
  const dispatch = useAppDispatch();
  const listId = router.query.id as string;

  // items are already items only from the active list
  const { items } = useAppSelector((state) => state.item);
  const { activeList, lists } = useAppSelector((state) => state.list);

  const { mutateAsync } = trpc.userItem.updateManyItemsRank.useMutation();
  const simplifyItems = items.map(({ id, listId, userId, potentialRank }) => ({
    itemId: id,
    listId,
    userId,
    potentialRank,
  }));
  // console.log("simplifyItems: ", simplifyItems);

  const updateItemsRank = async (simplifyItems: UpdateItemsRankSchema) => {
    try {
      //console.log("items: ", items);
      //simplify items test
      //console.log("simplifyItems: ", simplifyItems);
      const result = await mutateAsync(simplifyItems);
      //console.log("result: ", result);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const activeListTitle = activeList?.title;

  //!New Ranking System area
  //!General notes
  /*
    If an items currentRank === 0 && potentialRank === 0 it means an item has not been ranked at all and is effectively 'unranked'
  */

  const rankedItems = items?.filter(
    (i) => i.potentialRank !== null && i.potentialRank > 0
  );
  // console.log("rankedItems:", JSON.stringify(rankedItems, 0, 2));

  const unRankedItems = items?.filter(
    (i) =>
      i.potentialRank !== null && i.potentialRank === 0 && i.currentRank === 0
  );
  // console.log("unRankedItems:", JSON.stringify(unRankedItems, 0, 2));

  const sortedRankedItems = rankedItems.sort(
    (a, b) => b.potentialRank! - a.potentialRank!
  );
  // console.log("sortedRankedItems: ", sortedRankedItems);

  const activeItem = items?.filter(
    (i) => i.status === "won" || i.status === "lost"
  );

  const changeRankUnrankedItems = (optionSelected: any, combatants: any) => {
    console.log("unrankedMatchup", unrankedMatchup);
    console.log("optionSelected: ", optionSelected);
    console.log("combatants: ", combatants);
    //know both items are unranked can hardcore using bounds
    if (unrankedMatchup.length >= 2) {
      //find Index of Losing Option
      const losingIndex = unrankedMatchup.findIndex(
        (i: any) => i.id !== optionSelected.id
      );

      dispatch(
        setInitialItemsPotentialRank({
          optionSelected,
          combatants,
        })
      );
      console.log("unranked matchup here");
    }
  };

  const changeItemRank = (optionSelected: number, optB: any) => {
    //console.log("newTopBound - ", topBound);
    //console.log("newBotBound - ", botBound);

    const combatants = [optA, optB];

    dispatch(
      setItemPotentialRank({
        optionSelected,
        combatants,
      })
    );
  };

  const RankedItemDisplay = () => {
    return (
      <div>
        <h1>Item Rankings off Potential</h1>
        <div>
          {sortedRankedItems.map((i, index) => {
            return (
              <div className="flex" key={index}>
                <div className="mx-2">{index + 1}.</div>
                <div>{i.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* Phase 1: Unranked vs Unranked */

  let optA: any;
  let optB: any;
  let unrankedMatchup: any;

  // do we have any ranked items?
  if (rankedItems?.length <= 1) {
    if (unRankedItems?.length === 0) {
      return (
        <div className="pt-32 text-center">
          <h4>List is Empty we need Items</h4>
        </div>
      );
    } else if (unRankedItems?.length === 1) {
      return (
        <div>
          <h4>List is has only 1 item</h4>
        </div>
      );
    } else {
      unrankedMatchup = unRankedItems?.slice(0, 2);
      //console.log("unrankedMatchup", unrankedMatchup);
      optA = unRankedItems?.[0];
      optB = unRankedItems?.[1];
    }

    console.log("unranked v unranked");
    return (
      <div className="flex h-full flex-col items-center space-y-4">
        <div
          className="h-20 w-40 bg-blue-400 p-2"
          onClick={() => changeRankUnrankedItems(optA, unrankedMatchup)}
        >
          {optA && <div>{optA?.title}</div>}
        </div>
        <div
          className="h-20 w-40 bg-pink-400 p-2"
          onClick={() => changeRankUnrankedItems(optB, unrankedMatchup)}
        >
          {optB && <div>{optB?.title}</div>}
        </div>
        <RankedItemDisplay />
      </div>
    );
  } else if (activeItem.length === 1) {
    console.log("ranked v ranked");

    optA = activeItem[0];
    const sortedRankedItemsExcludeOptA = sortedRankedItems.filter(
      (i) => i.id !== optA.id
    );
    //console.log("optA - ", optA);

    if (optA.status === "won") {
      const filtRankedItems = sortedRankedItemsExcludeOptA.filter(
        (i) =>
          i.potentialRank! < optA.topBound && i.potentialRank! > optA.botBound
      );

      // console.log("filtRankedOpps, ", filtRankedItems);
      // console.log("filtRankedItemslength, ", filtRankedItems.length);

      if (filtRankedItems.length === 1) {
        optB = filtRankedItems[0];
      } else {
        const newOppIndex = Math.floor(filtRankedItems.length / 2);
        optB = filtRankedItems[newOppIndex];
      }
    }

    if (optA.status === "lost") {
      const filtRankedItems = sortedRankedItemsExcludeOptA.filter(
        (i) =>
          i.potentialRank! < optA.topBound && i.potentialRank! > optA.botBound
      );
      // console.log("filtRankedItems, ", filtRankedItems);
      // console.log("filtRankedItemslength, ", filtRankedItems.length);

      if (sortedRankedItemsExcludeOptA.length === 1) {
        optB = filtRankedItems[0];
      } else {
        const optIndex = Math.floor(filtRankedItems.length / 2);
        //console.log("optIndex: ", optIndex);
        optB = filtRankedItems[optIndex];

        //optB =
      }
    }

    // optB

    //using potential rank of current item we need to deduce which direction it can go
    //should add a bound variable, bot or top to the current won/lost item

    // optB = rankedItems[0];

    return (
      <div className="flex h-full flex-col items-center space-y-4">
        <div
          className="h-20 w-40 bg-blue-400 p-2"
          onClick={() => changeItemRank(0, optB)}
        >
          {optA && <div>{optA?.title}</div>}
        </div>
        <div
          className="h-20 w-40 bg-pink-400 p-2"
          onClick={() => changeItemRank(1, optB)}
        >
          {optB && <div>{optB?.title}</div>}
        </div>
      </div>
    );
  } else if (unRankedItems?.length === 0 && rankedItems?.length >= 2) {
    console.log("No items left to rank");

    //!Fire updateDBRank function

    return (
      <div className="flex h-full flex-col items-center space-y-4">
        <button
          className="h-20 w-20 bg-slate-500"
          onClick={() => updateItemsRank(simplifyItems)}
        >
          Update Ranks
        </button>
      </div>
    );
  } else {
    // we have unranked items and ranked items

    //Figuring Out Option A
    if (unRankedItems.length >= 1) {
      optA = unRankedItems[0];
    }
    //Figuring Out Option B
    //basic sort algo
    // ref: https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values

    const optBIndex = Math.floor(sortedRankedItems.length / 2);
    //console.log("sortedRankedItemsLength: ", sortedRankedItems.length);
    const optB = sortedRankedItems[optBIndex];
    //console.log("option B: ", optB);

    console.log("unranked v ranked");
    return (
      <div className="flex h-full flex-col items-center space-y-4">
        <div
          className="h-20 w-40 bg-blue-400 p-2"
          onClick={() => changeItemRank(0, optB)}
        >
          {optA && <div>{optA?.title}</div>}
        </div>
        <div
          className="h-20 w-40 bg-pink-400 p-2"
          onClick={() => changeItemRank(1, optB)}
        >
          {optB && <div>{optB?.title}</div>}
        </div>
      </div>
    );
  }
};

export default Ranking;
