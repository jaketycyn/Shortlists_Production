import React, { useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Link from "next/link";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../hooks/useTypedSelector";

import { HiOutlineChevronRight } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

import { trpc } from "../../../utils/trpc";

import { type ArchiveListSchema } from "../../../server/schema/listSchema";
import { setActiveList, setLists, type List } from "../../../slices/listSlice";

import FooterNav from "../../navigation/FooterNav";
import AddList from "../../AddList";
import { setError } from "../../../slices/errorSlice";
import {
  decrementActivePage,
  incrementActivePage,
  setActivePage,
} from "../../../slices/pageSlice";
import MoviePageLayout from "../moviePage/MoviePageLayout";
import FeaturedItemCard from "../../cards/FeaturedItemCard";

const HomePageLayout: NextPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [openListTab, setOpenListTab] = React.useState(1);
  const [openPageTab, setPageOpenTab] = React.useState(1);
  const [userListsOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  //get error state from Redux
  const hasGlobalError = useAppSelector((state) => state.error.hasError);
  const { lists } = useAppSelector((state) => state.list);
  const { activePage, pageLimit } = useAppSelector((state) => state.page);

  const {
    data: results,
    refetch,
    isLoading,
    isError,
  } = trpc.userList.getLists.useQuery();

  const fetchedLists = results as List[];

  useEffect(() => {
    dispatch(setLists(fetchedLists));
  }, [dispatch, fetchedLists, hasGlobalError]);

  // Delete Item
  const { mutateAsync } = trpc.userList.deleteList.useMutation();
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
    } catch (err) {
      console.error(err);
    }
  };

  //filtering out lists in Redux with archive set as "archive" these will be displayed in a trash bin for permanent deletion later
  const createdFilteredArchivedLists = useMemo(
    () =>
      lists?.filter(
        (i) =>
          i.archive !== "archive" &&
          i.archive !== "trash" &&
          i.parentListUserId === "undefined"
      ),
    [lists]
  );
  // console.log("createdFilteredArchivedLists: ", createdFilteredArchivedLists);

  const receivedFilteredArchivedLists = useMemo(
    () =>
      lists?.filter(
        (i) =>
          i.archive !== "archive" &&
          i.archive !== "trash" &&
          i.parentListUserId !== "undefined"
      ),
    [lists]
  );

  // console.log("receivedFilteredArchivedLists: ", receivedFilteredArchivedLists);

  //set Active List in Redux
  const setActiveListFunction = async (activeList: List) => {
    console.log("activeList: ", activeList);
    await dispatch(setActiveList(activeList));
  };

  //carousel/swipe test
  useEffect(() => {
    // Initialize start and end positions
    let startX = 0;
    let endX = 0;

    function handleStart(e: TouchEvent | MouseEvent) {
      if (
        e.target instanceof Element &&
        e.target.closest('[data-type="carousel"]')
      ) {
        e.preventDefault();
        return;
      }
      if (e instanceof TouchEvent) {
        startX = e.touches[0]!.clientX;
      } else if (e instanceof MouseEvent) {
        startX = e.clientX;
      }
    }

    function handleEnd(e: TouchEvent | MouseEvent) {
      if (
        e.target instanceof Element &&
        e.target.closest('[data-type="carousel"]')
      ) {
        e.preventDefault();
        return;
      }
      if (e instanceof TouchEvent) {
        endX = e.changedTouches[0]!.clientX;
      } else if (e instanceof MouseEvent) {
        endX = e.clientX;
      }

      handleSwipe(startX, endX);
    }
    function handleSwipe(startX: number, endX: number) {
      // define threshold as per requirement
      const swipeThreshold = 30; // For detecting swipe direction
      const tapThreshold = 5; // For distinguishing between tap and swipe

      const distanceMoved = Math.abs(startX - endX);

      if (distanceMoved <= tapThreshold) {
        // It's a tap, not a swipe
        return;
      }
      // detecting swipe left -> moving right
      if (startX - endX > swipeThreshold) {
        if (activePage < pageLimit) {
          // Check added here
          // console.log("swiped left");
          dispatch(incrementActivePage());
        }
      }
      // detecting swipe right <- moving left
      if (endX - startX > swipeThreshold) {
        if (activePage > 0) {
          // Check added here
          // console.log("swiped right");
          dispatch(decrementActivePage());
        }
      }
    }

    // For mobile touch
    window.addEventListener("touchstart", handleStart, { passive: false });
    window.addEventListener("touchend", handleEnd, { passive: false });
    // For desktop mouse drag
    window.addEventListener("mousedown", handleStart);
    window.addEventListener("mouseup", handleEnd);
    return () => {
      // Cleanup code
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("mousedown", handleStart);
      window.removeEventListener("mouseup", handleEnd);
    };
  }, [dispatch]);

  useEffect(() => {
    console.log("activePage:", activePage, "pageLimit:", pageLimit);
  }, [activePage, pageLimit]);

  if (isLoading) return <div>Loading ...</div>;
  if (isError)
    return <div>Error fetching the lists. Please try again later.</div>;

  // focus test

  // document.addEventListener("focusin", () => {
  //   console.log(document.activeElement);
  // });

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={activePage}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex h-screen w-full flex-col justify-between">
          <div className="">
            <header
              className={` page absolute top-0 z-10 mb-2 flex h-14  w-full flex-col items-center pt-4 text-center ${
                activePage === 0 ? "active" : "hidden"
              }`}
            >
              <h1 className="font-semibold">Shortlists</h1>
            </header>

            {/* Page Header - Start */}
            <div className="mt-12">
              {/* Page Tab - Start */}
              <div className="z-0 mt-12 flex  flex-col items-center justify-center rounded-md  text-black">
                <ul
                  className="sticky mb-0 flex list-none flex-row  pb-4 "
                  role="tablist"
                >
                  <li className="-mb-px mr-2  text-center last:mr-0">
                    <a
                      className={
                        "block rounded px-5 py-3 text-xs font-bold uppercase leading-normal shadow-lg " +
                        (openPageTab === 0
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setPageOpenTab(0);
                        dispatch(setActivePage(0));
                      }}
                      data-toggle="tab"
                      href="#link1"
                      role="tablist"
                    >
                      Home
                    </a>
                  </li>
                  <li className="-mb-px mr-2  text-center last:mr-0">
                    <a
                      className={
                        "block rounded px-5 py-3 text-xs font-bold uppercase leading-normal shadow-lg " +
                        (openPageTab === 1
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setPageOpenTab(1);
                        dispatch(setActivePage(1));
                      }}
                      data-toggle="tab"
                      href="#link2"
                      role="tablist"
                    >
                      Movies
                    </a>
                  </li>
                  <li className="-mb-px mr-2  text-center last:mr-0">
                    <a
                      className={
                        "block rounded px-5 py-3 text-xs font-bold uppercase leading-normal shadow-lg " +
                        (openPageTab === 2
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setPageOpenTab(2);
                        dispatch(setActivePage(2));
                      }}
                      data-toggle="tab"
                      href="#link3"
                      role="tablist"
                    >
                      Television
                    </a>
                  </li>
                  <li className="-mb-px mr-2  text-center last:mr-0">
                    <a
                      className={
                        "block rounded px-5 py-3 text-xs font-bold uppercase leading-normal shadow-lg " +
                        (openPageTab === 3
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setPageOpenTab(3);
                        dispatch(setActivePage(3));
                      }}
                      data-toggle="tab"
                      href="#link4"
                      role="tablist"
                    >
                      Music
                    </a>
                  </li>
                </ul>
              </div>
              {/* Page Tab - End */}
              {/* Page Header - End */}
              {/* Featured Lists - Start */}
              <div className={`page ${activePage === 0 ? "active" : "hidden"}`}>
                <div className="mx-auto  pt-4">
                  <p className="items-center pb-4 text-center">
                    Featured Lists
                  </p>
                  <ul className="grid grid-cols-2 items-center justify-center">
                    {[
                      "Top 10 Marvel Movies",
                      "Best Shows like Game of Thrones",
                      "Favorite breakup songs",
                      "NBA best players",
                    ].map((title, index) => (
                      <li
                        className="col-span-1 items-center justify-center"
                        key={title}
                      >
                        <FeaturedItemCard title={title} index={index} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Featured Lists - End */}
            </div>

            {/* Current Homepage - Page 0 - Start */}
            <div className={`page ${activePage === 0 ? "active" : "hidden"}`}>
              <div className="z-0 mt-12 flex  flex-col items-center justify-center rounded-md  text-black">
                <ul
                  className="sticky mb-0 flex list-none flex-row  pb-4 "
                  role="tablist"
                >
                  <li className="-mb-px mr-2  text-center last:mr-0">
                    <a
                      className={
                        "block rounded px-5 py-3 text-xs font-bold uppercase leading-normal shadow-lg " +
                        (openListTab === 1
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenListTab(1);
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
                        (openListTab === 2
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenListTab(2);
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
                        (openListTab === 3
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenListTab(3);
                      }}
                      data-toggle="tab"
                      href="#link3"
                      role="tablist"
                    >
                      Sent Lists
                    </a>
                  </li>
                </ul>
                <div
                  className={`${
                    isOpen ? "w-full  opacity-50" : "opacity-100"
                  } mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white text-center shadow-lg lg:w-3/5`}
                >
                  <div className=" px-4 py-5">
                    <div className="tab-content tab-space">
                      {/*Tab 1 Selected*/}
                      <div
                        className={openListTab === 1 ? "block" : "hidden"}
                        id="link1"
                      >
                        {createdFilteredArchivedLists === undefined ||
                        createdFilteredArchivedLists?.length === 0 ? (
                          <div className="flex h-3/5 w-full flex-col">
                            <h1>You have no Lists created</h1>
                            <p className="mt-8">
                              To create your first lists and any future lists
                              click the {"+"} in the bottom right hand corner
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
                                {createdFilteredArchivedLists.map(
                                  (list, index) => (
                                    <div
                                      className="mt-2 flex cursor-pointer snap-center items-center justify-between gap-x-2 rounded-md border-2 border-gray-600 bg-white/90  text-sm  text-black"
                                      key={index}
                                    >
                                      <Link
                                        href={`/lists/${encodeURIComponent(
                                          list.id
                                        )}`}
                                        key={index}
                                        onClick={() =>
                                          setActiveListFunction(
                                            createdFilteredArchivedLists[index]!
                                          )
                                        }
                                        className="flex h-full w-full flex-row items-center text-center"
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
                                        <h5 className="ml-4">{list.title}</h5>
                                      </Link>

                                      {/* DropDown: Start */}
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
                                                  archive: "trash",
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
                        className={openListTab === 2 ? "block" : "hidden"}
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
                                Or send them a list and maybe they will send you
                                one back
                              </p>
                              <p className="mt-8">
                                Use the profile section in the bottom right to
                                find and add friends
                              </p>
                              <p className="mt-8">
                                If you are looking for a friend send a list to
                                Bob@gmail.com. He loves being sent new lists and
                                may send you one back.
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
                                        <HiOutlineChevronRight className="h-4 w-4" />
                                      </button>
                                      <Link
                                        href={`/lists/${encodeURIComponent(
                                          list.id
                                        )}`}
                                        key={index}
                                        onClick={() =>
                                          setActiveListFunction(
                                            receivedFilteredArchivedLists[
                                              index
                                            ]!
                                          )
                                        }
                                        className="h-full w-full "
                                      >
                                        {list.title}
                                      </Link>

                                      {/* DropDown: Start */}
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
                                                  archive: "trash",
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
                        className={openListTab === 3 ? "block" : "hidden"}
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
            {/* Current Homepage - Page 1 - End */}

            {/* Movie Page - Page 2 - Start */}
            <div className={`page ${activePage === 1 ? "active" : "hidden"}`}>
              <MoviePageLayout />
            </div>
            {/* Movie Page - Page 2 - End */}
            {/* Movie Page - Page 2 - Start */}
            <div className={`page ${activePage === 2 ? "active" : "hidden"}`}>
              <div>Tv Show Page Placeholder</div>
            </div>
            {/* Movie Page - Page 2 - End */}
          </div>
          {/* //* Add List - Start */}
          <div className={`page ${activePage === 0 ? "active" : "hidden"}`}>
            {/* Drawer */}
            <div
              className={`${
                isOpen ? "h-40" : "h-0"
              }   transition-height fixed bottom-0 w-full overflow-hidden bg-white pb-10 shadow-lg duration-300 ease-in-out`}
            >
              <AddList />
            </div>

            {/* Circular Button - Bot Right Corner*/}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={` ${
                isOpen ? "bg-red-400" : "bg-blue-700"
              } fixed bottom-[76px] right-4 flex h-12 w-12 items-center justify-center rounded-full  text-3xl text-white shadow-lg`}
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          {/* Add List - End*/}
          <FooterNav />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomePageLayout;
