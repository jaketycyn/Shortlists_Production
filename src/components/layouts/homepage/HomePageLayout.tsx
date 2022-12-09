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

  console.log("typeofResults", typeof results);
  //const { data } = useSession();

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
  const createdFilteredArchivedLists = lists?.filter(
    (i) =>
      i.archive !== "archive" &&
      i.archive !== "trash" &&
      i.parentListUserId === "undefined"
  );
  const receivedFilteredArchivedLists = lists?.filter(
    (i) =>
      i.archive !== "archive" &&
      i.archive !== "trash" &&
      i.parentListUserId !== "undefined"
  );
  console.log("receivedFilteredArchivedLists: ", receivedFilteredArchivedLists);

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
      <div className="flex h-screen flex-col justify-between ">
        <div>
          {/* userLists ({getLists.status}):{" "}
        <pre>{JSON.stringify(usersLists, null, 2)}</pre> */}
          <header className="absolute top-0 z-10 mb-2 flex h-14 w-full  flex-col items-center pt-4 text-center">
            <h1 className="font-semibold">Shortlists</h1>
            {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}
          </header>

          <div className="z-0 mt-12 flex  flex-col items-center justify-center rounded-md  text-black">
            <ul className="mb-0 flex list-none flex-row  pb-4 " role="tablist">
              <li className="-mb-px mr-2  text-center last:mr-0">
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
              <li className="-mb-px mr-2  text-center last:mr-0">
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
              <li className="-mb-px mr-2  text-center last:mr-0">
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
            <div className="mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white text-center shadow-lg lg:w-3/5">
              <div className=" px-4 py-5">
                <div className="tab-content tab-space">
                  {/*Tab 1 Selected*/}
                  <div
                    className={openTab === 1 ? "block" : "hidden"}
                    id="link1"
                  >
                    {createdFilteredArchivedLists === undefined ||
                    createdFilteredArchivedLists?.length === 0 ? (
                      <div className="flex h-3/5 w-full flex-col">
                        <h1>You have no Lists created</h1>
                        <p className="mt-8">
                          To create your first lists and any future lists click
                          the {"+"} in the bottom right hand corner
                        </p>
                        <p className="mt-8">
                          Then select the option {"Add List"}
                        </p>
                      </div>
                    ) : (
                      <div className="container z-0 h-full items-center">
                        {/* Display UserClassicLists Module: Starts*/}
                        {createdFilteredArchivedLists && userListsOpen ? (
                          <div>
                            {createdFilteredArchivedLists.map((list, index) => (
                              <div
                                className="mt-2 flex cursor-pointer snap-center items-center justify-between gap-x-2 rounded-md border-2 border-gray-600 bg-white/90  text-sm  text-black"
                                key={index}
                              >
                                <button className=" flex h-10 w-10 items-center  p-2">
                                  <HiOutlineChevronRight
                                    //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in.
                                    className="h-4 w-4"
                                    // onClick={() => {
                                    //   toggleSubMenu(index, subMenuIndexes);
                                    // }
                                  />
                                </button>
                                <Link
                                  href={`/lists/${encodeURIComponent(list.id)}`}
                                  key={index}
                                  onClick={() =>
                                    setActiveListFunction(
                                      createdFilteredArchivedLists[index]!
                                    )
                                  }
                                  className="h-full w-full "
                                >
                                  {list.title}
                                </Link>

                                {/* DropDown: Begin */}
                                <div className="dropdown-left dropdown">
                                  <label tabIndex={0} className="btn m-1">
                                    ...
                                  </label>
                                  <ul
                                    tabIndex={0}
                                    className="dropdown-content menu rounded-box flex w-20 flex-col items-center divide-black  border-2 border-black bg-white p-2 text-center  shadow"
                                  >
                                    <li
                                      className="p-1 "
                                      onClick={() => console.log("Share")}
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
                            ))}
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
                    {receivedFilteredArchivedLists === undefined ||
                    receivedFilteredArchivedLists?.length === 0 ? (
                      <div className="flex h-3/5 w-full flex-col">
                        <div className="z-0 flex flex-col items-center rounded-md text-center">
                          <h1>You have received no lists :sad:</h1>
                          <p className="mt-8">
                            Make some friends and have them send you a list
                          </p>
                          <p className="mt-8">
                            Or send them a list and maybe they will send you one
                            back
                          </p>
                          <p className="mt-8">
                            Use the profile section in the bottom right to find
                            and add friends
                          </p>
                          <p className="mt-8">
                            If you are looking for a friend send a list to
                            Bob@gmail.com. He loves being sent new lists and may
                            send you one back.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="container  z-0 h-full items-center">
                        {/* Display UserClassicLists Module: Starts*/}
                        {receivedFilteredArchivedLists && userListsOpen ? (
                          <div>
                            {receivedFilteredArchivedLists.map(
                              (list, index) => (
                                <div
                                  className=" mt-2 flex cursor-pointer snap-center items-center justify-between gap-x-2 rounded-md border-2 border-gray-600 bg-white/90  text-sm  text-black"
                                  key={index}
                                >
                                  <button className=" flex h-10 w-10 items-center  p-2">
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
                                        receivedFilteredArchivedLists[index]!
                                      )
                                    }
                                    className="h-full w-full "
                                  >
                                    {list.title}
                                  </Link>

                                  {/* DropDown: Begin */}
                                  <div className="dropdown-left dropdown">
                                    <label tabIndex={0} className="btn m-1">
                                      ...
                                    </label>
                                    <ul
                                      tabIndex={0}
                                      className="dropdown-content menu rounded-box flex w-20 flex-col items-center divide-black  border-2 border-black bg-white p-2 text-center  shadow"
                                    >
                                      <li
                                        className="p-1 "
                                        onClick={() => console.log("Share")}
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
                  {/*Tab 3 Selected*/}
                  <div
                    className={openTab === 3 ? "block" : "hidden"}
                    id="link3"
                  >
                    <div>
                      <p>You have not sent any lists to anybody</p>
                      <p>Send a list to a friend to see it here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 z-40 flex w-full flex-col text-center">
          <FooterNav />
        </div>
      </div>
    </motion.div>
  );
};

export default HomePageLayout;
