import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, type Resolver, SubmitHandler } from "react-hook-form";

import { HiPlus, HiX, HiDotsVertical } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";

import { trpc } from "../../utils/trpc";
import {
  type ArchiveItemSchema,
  type AddItemSchema,
} from "../../server/schema/itemSchema";
import { type ShareListSchema } from "../../server/schema/listSchema";
import {
  type Item,
  setItems,
  setItemPotentialRank,
  setInitialItemsPotentialRank,
} from "../../slices/itemSlice";
import ListFooterNav from "../../components/navigation/ListFooterNav";

import { Dialog, Menu, Transition } from "@headlessui/react";
import { current } from "@reduxjs/toolkit";
import { AnyAaaaRecord } from "dns";
import { match } from "assert";

const ranking = () => {
  //imports - remove unnecsarry later
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showTextInput, setShowTextInput] = useState(false);
  const [showItemOptions, setShowItemOptions] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<any>();
  const [hasFocus, setFocus] = useState(false);
  //const [listItems, setListItems] = useState([]);
  const [showToast, setShowToast] = React.useState<boolean>(false);
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const listId = router.query.id as string;

  // Retrieve state variables from Redux
  const { users } = useAppSelector((state) => state.user);
  // items are already items only from the active list
  const { items } = useAppSelector((state) => state.item);
  const { activeList, lists, error, loading } = useAppSelector(
    (state) => state.list
  );

  let contentText;

  //console.log("lists inside [id]: ", lists);

  const Listindex = lists?.findIndex((item) => item.id === listId);
  //console.log("ListIndex is: ", Listindex);

  //?both methods work for finding title of active list
  //const activeListTitle = lists?.[Listindex!]?.title;
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

  const sortedRankedItems = rankedItems
    .slice()
    // false = reversed order ; lowest # is highest rank
    .sort(sortAlgo("potentialRank", true, parseInt));
  console.log("sortedRankedItems - ranking.tsx: ", sortedRankedItems);

  const topBound =
    sortedRankedItems[sortedRankedItems.length - 1]?.potentialRank;
  const botBound = sortedRankedItems[0]?.potentialRank;
  // console.log("newTopBound - ", topBound);
  // console.log("newBotBound - ", botBound);

  // const wonlostitem = items?.filter((i) => (i.status === "won") | "lost");
  // console.log("wonlostitem: ", wonlostitem);

  // if (wonlostitem.length === 1) {
  //   optionA = wonlostitem[0];
  // }

  const wonlostitem = items?.filter(
    (i) => (i.status === "won") | (i.status === "lost")
  );

  //!
  //Going to keep logic outside the slice as much as possible and only pass to the slice information that is needed
  // that info will be
  //* Params needed for ranking:
  // 1. itemId
  // 2. itemWinStatus
  // 3. ItemsHistory of opponents (separate table/column)
  // 4. potential Opponents (separate table/column)
  const changeRankUnrankedItems = (optionSelected: any, combatants: any) => {
    console.log("unrankedMatchup", unrankedMatchup);
    console.log("optionSelected: ", optionSelected);
    //know both items are unranked can hardcore using bounds
    if (unrankedMatchup.length >= 2) {
      //find Index of Losing Option
      const losingIndex = unrankedMatchup.findIndex(
        (i: any) => i.id !== optionSelected.id
      );
      //assign Losing Option Variable
      const losingOption = unrankedMatchup[losingIndex];
      //console.log("losingOption: ", losingOption);

      dispatch(
        setInitialItemsPotentialRank({
          optionSelected,
          combatants,
        })
      );
      console.log("unranked matchup here");
    }
  };

  const changeRankUnrankedItemVsRanked = (
    optionSelected: number,
    optionB: any
  ) => {
    //console.log("newTopBound - ", topBound);
    //console.log("newBotBound - ", botBound);

    const combatants = [optionA, optionB];

    dispatch(
      setItemPotentialRank({
        optionSelected,
        combatants,
      })
    );
  };

  /* Phase 1: Unranked vs Unranked */

  let optionA: any;
  let optionB: any;
  let unrankedMatchup: any;

  // do we have any ranked items?
  if (rankedItems?.length <= 1) {
    if (unRankedItems?.length === 0) {
      contentText = "List is Empty we need Items";
    } else if (unRankedItems?.length === 1) {
      contentText = "List is has only 1 item";
    } else {
      unrankedMatchup = unRankedItems?.slice(0, 2);
      //console.log("unrankedMatchup", unrankedMatchup);
      optionA = unRankedItems?.[0];
      optionB = unRankedItems?.[1];
    }

    return (
      <div className="flex h-full flex-col items-center space-y-4">
        <p>{contentText}</p>
        <div
          className="h-20 w-40 bg-blue-400 p-2"
          onClick={() => changeRankUnrankedItems(optionA, unrankedMatchup)}
        >
          {optionA && <div>{optionA?.title}</div>}
        </div>
        <div
          className="h-20 w-40 bg-pink-400 p-2"
          onClick={() => changeRankUnrankedItems(optionB, unrankedMatchup)}
        >
          {optionB && <div>{optionB?.title}</div>}
        </div>
      </div>
    );
  } else if (wonlostitem.length === 1) {
    console.log("ranked v ranked scenario");
  } else {
    // we have unranked items and ranked items

    //Figuring Out Option A
    if (unRankedItems.length >= 1) {
      optionA = unRankedItems[0];
    }
    //Figuring Out Option B
    //basic sort algo
    // ref: https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values

    const optionBIndex = Math.floor(sortedRankedItems.length / 2);
    //console.log("sortedRankedItemsLength: ", sortedRankedItems.length);
    const optionB = sortedRankedItems[optionBIndex];
    //console.log("option B: ", optionB);

    return (
      <div className="flex h-full flex-col items-center space-y-4">
        <p>{contentText}</p>
        <div
          className="h-20 w-40 bg-blue-400 p-2"
          onClick={() => changeRankUnrankedItemVsRanked(0, optionB)}
        >
          {optionA && <div>{optionA?.title}</div>}
        </div>
        <div
          className="h-20 w-40 bg-pink-400 p-2"
          onClick={() => changeRankUnrankedItemVsRanked(1, optionB)}
        >
          {optionB && <div>{optionB?.title}</div>}
        </div>
      </div>
    );
  }
};

export default ranking;
