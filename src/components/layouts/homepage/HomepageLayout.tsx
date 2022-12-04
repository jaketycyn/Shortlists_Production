import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../hooks/useTypedSelector";

import {
  // HiOutlineDotsVertical,
  // HiPlus,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { motion } from "framer-motion";

import { trpc } from "../../../utils/trpc";

import {
  type ArchiveListSchema,
  //type DeleteListSchema,
} from "../../../server/schema/listSchema";
import { setActiveList, setLists, type List } from "../../../slices/listSlice";

import FooterNav from "../../navigation/FooterNav";

const HomePageLayout: NextPage = () => {
  const dispatch = useAppDispatch();
  const { lists, error, loading } = useAppSelector((state) => state.list);
  const [openTab, setOpenTab] = React.useState(1);
  const [userListsOpen, setUserListsOpen] = useState(true);
  // const [showShareForm, setShowShareForm] = useState(true);

  const {
    data: results,
    refetch,
    isLoading,
  } = trpc.userList.getLists.useQuery();

  //console.log("results: ", results);

  const { data } = useSession();
  //console.log("data from useSession: ", data);

  //redux setting Lists

  const fetchedLists = results as List[];

  useEffect(() => {
    dispatch(setLists(fetchedLists));
  }, [dispatch, fetchedLists]);

  // Delete Item
  // const { mutateAsync } = trpc.userList.deleteList.useMutation();
  const { mutateAsync: mutateArchiveList } =
    trpc.userList.archiveList.useMutation();
  const { mutateAsync: mutateArchiveItems } =
    trpc.userItem.archiveManyItems.useMutation();

  const ArchiveList = async (data: ArchiveListSchema) => {
    try {
      const result = await mutateArchiveList(data);
      const itemResult = await mutateArchiveItems(data);
      // await and fire a mutateArchiveItem.many ?? maybe

      console.log("result: ", result);
      console.log("itemResult: ", itemResult);
      refetch();
    } catch (error) {}
  };

  //filtering out lists in Redux with archive set as "archive" these will be displayed in a trash bin for permanent deletion later
  const filteredArchivedLists = lists?.filter((i) => i.archive !== "trash");

  //set Active List in Redux
  const setActiveListFunction = async (activeList: List) => {
    console.log("activeList: ", activeList);
    await dispatch(setActiveList(activeList));
  };

  //if (isLoading) return <div>Loading ...</div>;
  return (
    <motion.div
      initial={{ x: 2000 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      exit={{ x: -2000 }}
    >
      <div className="flex h-screen flex-col justify-between">
        <div>
          {/* userLists ({getLists.status}):{" "}
        <pre>{JSON.stringify(usersLists, null, 2)}</pre> */}
          <header className="absolute top-0 z-10 mb-2 flex h-14 w-full flex-col  items-center bg-primary pt-4 text-center">
            <h1 className="font-semibold">Shortlists</h1>
            {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}
          </header>

          {filteredArchivedLists === undefined ||
          filteredArchivedLists?.length === 0 ? (
            <div className="z-0 m-2 mt-40 flex flex-col items-center rounded-md text-center">
              <h1>You have no Lists created</h1>
              <p className="mt-8">
                To create your first lists and any future lists click the {"+"}{" "}
                in the bottom right hand corner
              </p>
              <p className="mt-8">Then select the option {"Add List"}</p>
            </div>
          ) : (
            <div className="z-0 m-2 flex flex-col items-center rounded-md text-black ">
              <ul className="w-5/6 pt-2 ">
                {/* New List Tab Module: Start */}
                <div className="mt-8 flex flex-wrap">
                  <div className="w-full">
                    <ul
                      className="mb-0 flex list-none flex-row flex-wrap pt-3 pb-4"
                      role="tablist"
                    >
                      <li className="-mb-px mr-2 flex-auto text-center last:mr-0">
                        <a
                          className={
                            "block rounded px-5 py-3 text-xs font-bold uppercase leading-normal shadow-lg " +
                            (openTab === 1
                              ? "bg-blue-600 text-white"
                              : "bg-white text-blue-600")
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenTab(1);
                          }}
                          data-toggle="tab"
                          href="#link1"
                          role="tablist"
                        >
                          My Lists
                        </a>
                      </li>
                      <li className="-mb-px mr-2 flex-auto text-center last:mr-0">
                        <a
                          className={
                            "block rounded px-5 py-3 text-xs font-bold uppercase leading-normal shadow-lg " +
                            (openTab === 2
                              ? "bg-blue-600 text-white"
                              : "bg-white text-blue-600")
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenTab(2);
                          }}
                          data-toggle="tab"
                          href="#link2"
                          role="tablist"
                        >
                          Received Lists
                        </a>
                      </li>
                      <li className="-mb-px mr-2 flex-auto text-center last:mr-0">
                        <a
                          className={
                            "block rounded px-5 py-3 text-xs font-bold uppercase leading-normal shadow-lg " +
                            (openTab === 3
                              ? "bg-blue-600 text-white"
                              : "bg-white text-blue-600")
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenTab(3);
                          }}
                          data-toggle="tab"
                          href="#link3"
                          role="tablist"
                        >
                          Sent Lists
                        </a>
                      </li>
                    </ul>
                    <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white shadow-lg">
                      <div className="flex-auto px-4 py-5">
                        <div className="tab-content tab-space">
                          {/*Tab 1 Selected*/}
                          <div
                            className={openTab === 1 ? "block" : "hidden"}
                            id="link1"
                          >
                            {filteredArchivedLists === undefined ||
                            filteredArchivedLists?.length === 0 ? (
                              <div className="z-0 m-2 mt-40 flex flex-col items-center rounded-md text-center">
                                <h1>You have no Lists created</h1>
                                <p className="mt-8">
                                  To create your first lists and any future
                                  lists click the {"+"} in the bottom right hand
                                  corner
                                </p>
                                <p className="mt-8">
                                  Then select the option {"Add List"}
                                </p>
                              </div>
                            ) : (
                              <div className="container relative z-0 h-full items-center">
                                {/* Display UserClassicLists Module: Starts*/}
                                {filteredArchivedLists && userListsOpen ? (
                                  <div>
                                    {filteredArchivedLists.map(
                                      (list, index) => (
                                        <div
                                          className="relative mt-2 flex cursor-pointer snap-center items-center justify-between gap-x-2 rounded-md border-2 border-gray-600 bg-white/90  text-sm  text-black"
                                          key={index}
                                        >
                                          <button className="relative flex h-10 w-10 items-center  p-2">
                                            <HiOutlineChevronRight
                                              //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in.
                                              className="h-4 w-4"
                                              // onClick={() => {
                                              //   toggleSubMenu(index, subMenuIndexes);
                                              // }
                                            />
                                          </button>
                                          <Link
                                            href={`/lists/${encodeURIComponent(
                                              list.id
                                            )}`}
                                            key={index}
                                            onClick={() =>
                                              setActiveListFunction(
                                                filteredArchivedLists[index]!
                                              )
                                            }
                                            className="h-full w-full "
                                          >
                                            {list.title}
                                          </Link>

                                          {/* DropDown: Begin */}
                                          <div className="dropdown-left dropdown">
                                            <label
                                              tabIndex={0}
                                              className="btn m-1"
                                            >
                                              ...
                                            </label>
                                            <ul
                                              tabIndex={0}
                                              className="dropdown-content menu rounded-box flex w-20 flex-col items-center divide-black  border-2 border-black bg-white p-2 text-center  shadow"
                                            >
                                              <li
                                                className="p-1 "
                                                onClick={() =>
                                                  console.log("Share")
                                                }
                                              >
                                                Share
                                              </li>
                                              <li
                                                className="p-1"
                                                // onClick={() => console.log("Trash: ", list.id, list.userId)}
                                                onClick={
                                                  async () =>
                                                    ArchiveList({
                                                      listId: list.id,
                                                      userId: list.userId,
                                                      archiveStatus: "trash",
                                                    })
                                                  // set reQuery to ture
                                                }
                                              >
                                                Trash
                                              </li>
                                            </ul>
                                          </div>
                                          {/* DropDown: End */}
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <div></div>
                                )}
                              </div>
                            )}
                          </div>
                          {/* Display UserClassicLists Module: Ends*/}
                          {/*Tab 2 Selected*/}
                          <div
                            className={openTab === 2 ? "block" : "hidden"}
                            id="link2"
                          >
                            <p>
                              Completely synergize resource taxing relationships
                              via premier niche markets. Professionally
                              cultivate one-to-one customer service with robust
                              ideas.
                              <br />
                              <br />
                              Dynamically innovate resource-leveling customer
                              service for state of the art customer service.
                            </p>
                          </div>
                          {/*Tab 3 Selected*/}
                          <div
                            className={openTab === 3 ? "block" : "hidden"}
                            id="link3"
                          >
                            <p>
                              Efficiently unleash cross-media information
                              without cross-media value. Quickly maximize timely
                              deliverables for real-time schemas.
                              <br />
                              <br /> Dramatically maintain clicks-and-mortar
                              solutions without functional solutions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ul>
            </div>
          )}
        </div>

        {/* Counter Slice Redux Example: Start */}
        {/* <div className="flex flex-col items-center">
        <h1>{count}</h1>
        <button
          className="mt-2 w-40 bg-green-900/80"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <button
          className="mt-2 w-40 bg-red-900/80"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div> */}
        {/*  Counter Slice Redux Example: End */}
        <div className="absolute bottom-0 z-40 flex w-full flex-col text-center">
          <FooterNav />
        </div>
      </div>
    </motion.div>
  );
};

export default HomePageLayout;
