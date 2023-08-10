import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";
import { trpc } from "../../utils/trpc";
import { type UpdateItemsRankSchema } from "../../server/schema/itemSchema";
import {
  setItemPotentialRank,
  setInitialItemsPotentialRank,
  setCurrentTab,
  setIsSubmitting,
} from "../../slices/itemSlice";

const Ranking = () => {
  //imports - remove unnecsarry later
  const router = useRouter();
  const dispatch = useAppDispatch();
  const listId = router.query.id as string;

  // items are already items only from the active list
  const { items, isSubmitting } = useAppSelector((state) => state.item);
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
      const result = await mutateAsync(simplifyItems);
      //console.log("result: ", result);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    console.log("useEffect called:", isSubmitting, unRankedItems?.length);
    if (isSubmitting && unRankedItems?.length === 0) {
      console.log("simplifyItems: ", simplifyItems);
      // console.log("SHOULDUPDATE ITEMS NOWWWWWWWWWWs");
      const timer = setTimeout(() => {
        console.log("Timer fired");
        // ... rest of your code
        updateItemsRank(simplifyItems);
        dispatch(setIsSubmitting(false));
      }, 1000);
      return () => {
        console.log("useEffect cleanup");
        clearTimeout(timer);
      };
    }
  }, [isSubmitting]);

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

  // const RankedItemDisplay = () => {
  //   return (
  //     <div>
  //       <h1>Item Rankings off Potential</h1>
  //       <div>
  //         {sortedRankedItems.map((i, index) => {
  //           return (
  //             <div className="flex" key={index}>
  //               <div className="mx-2">{index + 1}.</div>
  //               <div>{i.title}</div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   );
  // };

  // Update Item Ranks Function:

  /* Phase 1: Unranked vs Unranked */

  interface ItemDisplayComponentProps {
    titleA?: string;
    titleB?: string;
    onClickA?: () => void;
    onClickB?: () => void;
  }

  const ItemDisplayComponent: React.FC<ItemDisplayComponentProps> = ({
    titleA,
    titleB,
    onClickA,
    onClickB,
  }) => {
    //scaling font size based on title length - if needed
    function getFontSize(title: string) {
      if (title.length < 15) return "text-4xl";
      if (title.length < 30) return "text-4xl";
      if (title.length < 50) return "text-4xl";
      if (title.length < 100) return "text-4xl";
      if (title.length < 150) return "text-2xl";
      if (title.length < 200) return "text-lg";
    }

    let fontSizeA = getFontSize(titleA || "");
    let fontSizeB = getFontSize(titleB || "");

    if (titleA) {
      fontSizeA = getFontSize(titleA);
    }

    if (titleB) {
      fontSizeB = getFontSize(titleB);
    }

    return (
      <div className="flex flex-grow flex-col items-center text-center">
        {titleA && (
          <div
            className={`mb-2 box-border flex h-1/2 w-full items-center justify-center bg-blue-300 ${fontSizeA}`}
            onClick={onClickA ? () => onClickA() : undefined}
          >
            {titleA}
          </div>
        )}
        {titleB && (
          <div
            className={`box-border flex h-1/2 w-full items-center justify-center bg-orange-200 ${fontSizeB}`}
            onClick={onClickB ? () => onClickB() : undefined}
          >
            {titleB}
          </div>
        )}
      </div>
    );
  };

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

    // console.log("unranked v unranked");
    return (
      <ItemDisplayComponent
        titleA={optA?.title}
        titleB={optB?.title}
        onClickA={() => changeRankUnrankedItems(optA, unrankedMatchup)}
        onClickB={() => changeRankUnrankedItems(optB, unrankedMatchup)}
      />
    );
  } else if (activeItem.length === 1) {
    // console.log("ranked v ranked");

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
    return (
      <ItemDisplayComponent
        titleA={optA?.title}
        titleB={optB?.title}
        onClickA={() => changeItemRank(0, optB)}
        onClickB={() => changeItemRank(1, optB)}
      />
    );
  } else if (unRankedItems?.length === 0 && rankedItems?.length >= 2) {
    console.log("No items left to rank");

    //!Fire updateDBRank function
    dispatch(setIsSubmitting(true));
    console.log("setIsSubmitting(true) fired");

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

    // console.log("unranked v ranked");
    return (
      <ItemDisplayComponent
        titleA={optA?.title}
        titleB={optB?.title}
        onClickA={() => changeItemRank(0, optB)}
        onClickB={() => changeItemRank(1, optB)}
      />
    );
  }
};

export default Ranking;
