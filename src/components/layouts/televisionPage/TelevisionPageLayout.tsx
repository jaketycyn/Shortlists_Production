import type { NextPage } from "next";
import FeaturedMovieItemCard from "../../cards/FeaturedMovieItemCard";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../hooks/useTypedSelector";
import { trpc } from "../../../utils/trpc";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { setActiveList, type List } from "../../../slices/listSlice";
import { type ArchiveListSchema } from "../../../server/schema/listSchema";
import AddList from "../../AddList";

const TelevisionPageLayout: NextPage = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [openMovieListTab, setOpenMovieListTab] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [userListsOpen] = useState(true);
  const { activePage, pageLimit } = useAppSelector((state) => state.page);
  const { lists, loading, featuredLists } = useAppSelector(
    (state) => state.list
  );
  // console.log("featuredLists: ", featuredLists);

  const featuredMovieLists = featuredLists!.filter(
    (l) => l.category === "television"
  );
  // console.log("featuredMovieLists: ", featuredMovieLists);

  const adminUserId = "cllvfh9nj0006w3jw8qligiap";

  const { data: adminLists } = trpc.userList.getListsByUserId.useQuery({
    userId: adminUserId,
  });

  // loop through list Ids and get items from those lists
  const { data: featuredItems, isLoading: isFeaturedItemsLoading } =
    trpc.userItem.getFeaturedItemsByListId.useQuery({
      userId: adminUserId,
      listIds: featuredLists?.map((list) => list.id) || [],
    });

  // User List Data

  const createdFilteredMovieLists = () =>
    lists?.filter(
      (l) =>
        l.category === "television" &&
        l.archive === "active" &&
        l.userId === adminUserId
    );

  const allUsersLists = lists?.filter(
    (l) =>
      l.category === "television" &&
      l.archive !== "archive" &&
      l.archive !== "trash" &&
      l.userId === session!.user!.id
  );
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

  const setActiveListFunction = async (activeList: List) => {
    //console.log("activeList: ", activeList);
    await dispatch(setActiveList(activeList));
  };

  const {
    data: results,
    refetch,
    isLoading,
    isError,
  } = trpc.userList.getLists.useQuery();

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

  return (
    <div className="flex h-screen w-full flex-col ">
      {/* Featured MovieLists Section - Start */}
      <div className="pt-4">
        <p className="font-semiBold items-center pb-4 text-center text-xl">
          Featured TV Lists
        </p>
        <ul className="grid grid-cols-2 items-center justify-center gap-0 md:grid-cols-3 lg:grid-cols-4">
          {featuredMovieLists && featuredMovieLists.length > 0 ? (
            featuredMovieLists.map((list, index) => (
              <li
                className="col-span-1 items-center justify-center p-0.5"
                key={list.id}
                data-testid={`featured-item-${index}`}
              >
                {list.title ? (
                  <FeaturedMovieItemCard
                    title={list.title}
                    index={index}
                    featuredLists={featuredMovieLists}
                    featuredItems={featuredItems}
                  />
                ) : (
                  <div>No title available for this list</div>
                )}
              </li>
            ))
          ) : (
            <div>No Featured lists Available at this time</div>
          )}
        </ul>
      </div>
      {/* Featured MovieLists Section - End */}
      {/* User MovieList Section - Start */}
      <div className="z-0 mt-12 flex  flex-col items-center justify-center rounded-md  text-black">
        <ul
          className="sticky mb-0 flex list-none flex-row  pb-4 "
          role="tablist"
        >
          <li className="-mb-px mr-2  text-center last:mr-0">
            <a
              className={
                "block rounded px-5 py-3 text-xs font-bold uppercase leading-normal shadow-lg " +
                (openMovieListTab === 0
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600")
              }
              onClick={(e) => {
                e.preventDefault();
                setOpenMovieListTab(0);
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
                (openMovieListTab === 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600")
              }
              onClick={(e) => {
                e.preventDefault();
                setOpenMovieListTab(1);
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
                (openMovieListTab === 2
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600")
              }
              onClick={(e) => {
                e.preventDefault();
                setOpenMovieListTab(2);
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
                className={openMovieListTab === 0 ? "block" : "hidden"}
                id="link1"
              >
                {createdFilteredMovieLists === undefined ||
                allUsersLists?.length === 0 ? (
                  <div className="flex h-3/5 w-full flex-col">
                    <h1>You have no lists</h1>
                    <p className="mt-8">
                      To create your first lists and any future lists click the{" "}
                      {"+"} in the bottom right hand corner
                    </p>
                    <p className="mt-8">
                      Or copy a featured list from above or on a page (ex:
                      Movies)
                    </p>
                  </div>
                ) : (
                  <div className="container z-0 h-full items-center">
                    {/* Display UserClassicLists Module: Starts*/}
                    {allUsersLists && userListsOpen ? (
                      <div>
                        {allUsersLists.map((list, index) => (
                          <div
                            className="mt-2 flex cursor-pointer snap-center items-center justify-between gap-x-2 rounded-md border-2 border-gray-600 bg-white/90  text-sm  text-black"
                            key={index}
                          >
                            <Link
                              href={`/lists/${encodeURIComponent(list.id)}`}
                              key={index}
                              onClick={() =>
                                setActiveListFunction(allUsersLists[index]!)
                              }
                              className="flex h-full w-full flex-row items-center text-center"
                            >
                              <button className=" flex h-10 w-10 items-center  p-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="h-6 w-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                  />
                                </svg>
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
                                  onClick={async () =>
                                    ArchiveList({
                                      listId: list.id,
                                      userId: list.userId,
                                      archive: "trash",
                                    })
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
                className={openMovieListTab === 1 ? "block" : "hidden"}
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
                        Use the profile section in the bottom right to find and
                        add friends
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
                        {receivedFilteredArchivedLists.map((list, index) => (
                          <div
                            className=" mt-2 flex cursor-pointer snap-center items-center justify-between gap-x-2 rounded-md border-2 border-gray-600 bg-white/90  text-sm  text-black"
                            key={index}
                          >
                            <button className=" flex h-10 w-10 items-center  p-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                />
                              </svg>
                            </button>
                            <Link
                              href={`/lists/${encodeURIComponent(list.id)}`}
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
                        ))}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                )}
              </div>
              {/*Tab 3 Selected*/}
              <div
                className={openMovieListTab === 2 ? "block" : "hidden"}
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
      {/* User MovieList Section - End */}
      {/* //* Add List - Start */}
      <div className={`page z-20 ${activePage === 2 ? "active" : "hidden"}`}>
        {/* Drawer */}
        <div
          className={`${
            isOpen ? "h-40" : "h-0"
          }   transition-height fixed bottom-0 w-full overflow-hidden bg-white pb-10 shadow-lg duration-300 ease-in-out`}
        >
          <AddList category="television" />
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
    </div>
  );
};

export default TelevisionPageLayout;
