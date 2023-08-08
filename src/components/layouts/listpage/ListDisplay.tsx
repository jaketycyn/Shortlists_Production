import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../hooks/useTypedSelector";
import { useForm, type Resolver } from "react-hook-form";
import {
  type ArchiveItemSchema,
  type AddItemSchema,
} from "../../../server/schema/itemSchema";
import { trpc } from "../../../utils/trpc";
import { RankItems } from "../../RankItems";
import Ranking from "../../../pages/lists/ranking";
import { setCurrentTab } from "../../../slices/itemSlice";
import AddItemToast from "../../toasts/AddItemToast";

function classNames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function ListDisplay() {
  const dispatch = useAppDispatch();
  const { items, currentTab } = useAppSelector((state) => state.item);

  //console.log("Items - ListDisplay: ", items);

  const rankedItems = items.filter((i) => i.currentRank > 0);
  //console.log("RankedItems - ListDisplay: ", rankedItems);
  const sortedRankedItems = rankedItems.sort(
    (a, b) => (b.currentRank || 0) - (a.currentRank || 0)
  );
  const unRankedItems = items.filter((i) => i.currentRank === 0);
  //console.log("unRankedItems - ListDisplay: ", unRankedItems);

  const [tabs, setTabs] = useState<
    { name: string; count: number; current: boolean }[]
  >([]);

  useEffect(() => {
    const rankedItems = items.filter((i) => i.currentRank > 0);

    const unRankedItems = items.filter((i) => i.currentRank === 0);

    if (rankedItems.length === 0) {
      setTabs([
        {
          name: "Ranked",
          count: rankedItems.length,
          current: currentTab === "Ranked",
        },
        { name: "+", count: 0, current: currentTab === "Add" },
        { name: "Rank", count: 0, current: currentTab === "Rank" },
        {
          name: "Unranked",
          count: unRankedItems.length,
          current: currentTab === "Unranked",
        },
      ]);
    } else {
      setTabs([
        {
          name: "Ranked",
          count: rankedItems.length,
          current: currentTab === "Ranked",
        },
        { name: "+", count: 0, current: currentTab === "Add" },
        { name: "Rank", count: 0, current: currentTab === "Rank" },
        {
          name: "Unranked",
          count: unRankedItems.length,
          current: currentTab === "Unranked",
        },
      ]);
    }
  }, [items]);

  const handleClick = (tabName: string) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        current: tab.name === tabName,
      }))
    );
  };

  //* Item Options Variables & Functions *//
  const [showItemOptions, setShowItemOptions] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<any>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [iconOptions, setIconOptions] = useState(false);

  const displayItemOptions = (index: number, id: string) => {
    setSelectedId(id);

    if (selectedId === id && showItemOptions) {
      setShowItemOptions(false);
      setActiveItemIndex(null);
      setIconOptions(false);
    } else {
      setShowItemOptions(true);
      setActiveItemIndex(index);
      setIconOptions(false);
    }
  };

  //* Archive/Delete Modal *//
  const [isModalOpen, setIsModalOpen] = useState(false);
  //TODO: DELETE items through trpc
  const { mutateAsync: mutateArchiveItem } =
    trpc.userItem.archiveItem.useMutation();

  const ArchiveItem = async (data: ArchiveItemSchema, currentTab: string) => {
    try {
      const result = await mutateArchiveItem(data);

      dispatch(setCurrentTab(currentTab));
      // await and fire a mutateArchiveItem.many ?? maybe

      console.log("result: ", result);

      refetch();

      setShowItemOptions(false);
    } catch (error) {}
  };

  //* Add Item Variables & Functions *//
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [hasFocus, setFocus] = useState(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const listId = router.query.id as string;

  const resolver: Resolver<AddItemSchema> = async (values) => {
    return {
      values: !values.itemTitle ? {} : values,
      errors: !values.itemTitle
        ? {
            itemTitle: {
              type: "required",
              message: "A title is required",
            },
          }
        : {},
    };
  };

  // Add items through trpc
  const {
    handleSubmit,
    register,
    reset,
    formState,
    formState: { errors },
  } = useForm<AddItemSchema>({
    resolver,
    defaultValues: { itemTitle: "", listId: listId },
  });

  const { mutateAsync } = trpc.userItem.addItem.useMutation();

  const onSubmit = useCallback(
    async (data: AddItemSchema) => {
      try {
        const result = await mutateAsync(data);
        // const result = data;
        console.log("data found with value: ", data);
        dispatch(setCurrentTab("Add"));
        if (result) {
          //showToast Agent
          console.log("result found with value: ", result);
          console.log("item should be created - will redirect from here later");
          //TODO: Clear input field after submitting
          setShowToast(true);
        }
      } catch (err) {
        console.log(err);
      }
    },
    [mutateAsync]
    //might need to add something for test firing
  );

  const {
    data: retrievedItems,
    refetch,
    isLoading,
  } = trpc.userItem.getItems.useQuery({ listId });

  //reset item input form afterSubmit
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        itemTitle: "",
        listId: listId,
      });
      refetch();
      setTimeout(() => setShowToast(false), 1000);
    }
  }, [formState, reset]);

  return (
    <div className=" flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex h-screen w-full flex-col items-center overflow-hidden pt-1">
        <nav
          className="mb-4 flex w-screen items-center justify-center space-x-4"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <a
              key={tab.name}
              href="#"
              onClick={() => handleClick(tab.name)}
              className={classNames(
                tab.name === "Ranked" || tab.name === "Unranked"
                  ? tab.current
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700"
                  : tab.name === "+" || tab.name === "Rank"
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "",
                //styles for all tabs
                "flex min-w-[50px] items-center justify-center whitespace-nowrap border-b-2  py-3  text-sm font-medium"
              )}
              aria-current={tab.current ? "page" : undefined}
            >
              {tab.name}
              {tab.count ? (
                <span
                  className={classNames(
                    tab.current
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-900",
                    "ml-3 rounded-full px-2.5 py-0.5 text-xs font-medium md:inline-block "
                  )}
                >
                  {tab.count}
                </span>
              ) : null}
            </a>
          ))}
        </nav>

        <div className="w-screen ">
          {/* //* ranked Items Display - Start */}

          <div
            className={`${tabs[0]?.current ? "block" : "hidden"} scrollbar-hide 
            h-[calc(100vh-64px)] w-full overflow-auto pb-24
            `}
          >
            {rankedItems === undefined || rankedItems.length === 0 ? (
              // no items to display
              <div>
                <h4>add some items to your list or rank your items</h4>
              </div>
            ) : (
              //display items
              <div className="text-lg">
                {sortedRankedItems.map((i, index) => (
                  <div
                    className="mx-auto grid cursor-pointer grid-cols-6 items-center gap-4 border-b border-gray-200 py-2 hover:bg-gray-100"
                    key={i.id}
                    onClick={() => displayItemOptions(index, i.id)}
                  >
                    <div className="col-span-1 justify-self-start pl-4 ">
                      {index + 1}
                    </div>
                    <div className="col-span-4 text-center ">{i.title}</div>
                    <div className="col-span-1 items-center justify-end justify-self-end pr-4">
                      <div className="h-6 w-6">
                        {selectedId === i.id &&
                          showItemOptions &&
                          activeItemIndex === index &&
                          (iconOptions ? (
                            <div className="row-start-1 flex flex-row-reverse ">
                              <svg
                                id="trashBtn"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6 sm:h-5 md:w-5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsModalOpen(true);
                                  console.log(i.title + " archive/delete");
                                  ArchiveItem(
                                    {
                                      userId: i.userId,
                                      itemId: i.id,
                                      listId: i.listId,
                                      archiveStatus: "trash",
                                    },
                                    "Ranked"
                                  );
                                }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </div>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIconOptions(true); // setting the iconOptions to true, which will trigger trash can
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                              />
                            </svg>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* ranked Items Display - End */}
          {/* //*Add Item - Start */}
          <div className={`${tabs[1]?.current ? "block" : "hidden"} `}>
            <div className="flex items-center justify-center p-4">
              <div className="relative">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    type="text"
                    id="itemTitle"
                    className="w-full rounded-md border border-gray-200 py-2 pl-3 text-sm text-black placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Item Name . . ."
                    autoComplete="off"
                    onFocus={() => setFocus(true)}
                    onTouchCancel={() => setFocus(false)}
                    onTouchEnd={() => setFocus(false)}
                    {...register("itemTitle")}
                  />
                  <AddItemToast isVisible={showToast} message="Item Added" />
                  {/* Add Item Toast */}
                </form>
              </div>
            </div>
            {/*End - Add Item or Rank Section */}
          </div>
          {/*Add Item - End */}
          {/* //*Rank Item - Start */}
          <div className={`${tabs[2]?.current ? "block" : "hidden"}  w-full`}>
            <Ranking />
          </div>
          {/* Rank Item - End */}
          {/* unRanked Items Display - Start*/}

          <div
            className={`${tabs[3]?.current ? "block" : "hidden"} scrollbar-hide 
            h-[calc(100vh-64px)] w-full overflow-auto pb-24`}
          >
            {unRankedItems === undefined || unRankedItems.length === 0 ? (
              // no items to display
              <div>
                <h4>Add some more items to rank</h4>
              </div>
            ) : (
              //display items
              <div>
                {unRankedItems.map((i, index) => (
                  <div
                    className="grid h-10 cursor-pointer grid-cols-6 gap-4 border-b border-gray-200 hover:bg-gray-100"
                    key={i.id}
                    onClick={() => displayItemOptions(index, i.id)}
                  >
                    <span className=" col-span-1 justify-self-start pl-4" />
                    <div className="col-span-4 my-auto items-center text-center ">
                      {i.title}
                    </div>
                    <div className="col-span-1 my-auto items-center justify-end justify-self-end pr-4">
                      <div className="h-6 w-6">
                        {selectedId === i.id &&
                          showItemOptions &&
                          activeItemIndex === index &&
                          (iconOptions ? (
                            <div className="row-start-1 flex flex-row-reverse ">
                              <svg
                                id="trashBtn"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6 sm:h-5 md:w-5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log(i.title + " archive/delete");
                                  ArchiveItem(
                                    {
                                      userId: i.userId,
                                      itemId: i.id,
                                      listId: i.listId,
                                      archiveStatus: "trash",
                                    },
                                    "Unranked"
                                  );
                                }}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </div>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIconOptions(true); // setting the iconOptions to true, which will trigger trash can
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                              />
                            </svg>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* unRanked Items Display - End*/}
        </div>
      </div>
    </div>
  );
}
