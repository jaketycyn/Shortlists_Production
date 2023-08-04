import React, {
  Fragment,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type { NextPage } from "next";
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
import { type Item, resetItemsTest, setItems } from "../../slices/itemSlice";
import ListFooterNav from "../../components/navigation/ListFooterNav";

import { Dialog, Menu, Transition } from "@headlessui/react";
import { RankItems } from "../../components/RankItems";
import ListDisplayTabs from "../../components/layouts/listpage/ListDisplayTabs";
import ListDisplayProto from "../../components/layouts/listpage/ListDisplayProto";

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

const ListPage: NextPage = () => {
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
  const { items } = useAppSelector((state) => state.item);
  const { activeList, lists, error, loading } = useAppSelector(
    (state) => state.list
  );
  //! Placeholders for testing and basic setup. Later will use actual profile page info

  const testProp = "howdypartner";

  const clearItemInput = () => {
    setShowTextInput(!showTextInput);

    //clearItemValue();
    // ^ context that cleared the input value of the form previously
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

  //reset item input form afterSubmit
  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        itemTitle: "",
        listId: listId,
      });
      refetch();
      setTimeout(() => setShowToast(false), 1000);
    }
  }, [formState, reset]);

  const {
    data: retrievedItems,
    refetch,
    isLoading,
  } = trpc.userItem.getItems.useQuery({ listId });

  //console.log("retrievedItems: ", retrievedItems);

  //TODO : Set items into redux

  const fetchedItems = retrievedItems as Item[];
  //console.log("fetchedItems: ", fetchedItems);
  useEffect(() => {
    if (fetchedItems) {
      const filteredFetchedItems = fetchedItems!.filter(
        (i) => i.archive === "undefined"
      );
      // console.log("filteredFetchedItems: ", filteredFetchedItems);
      dispatch(setItems(filteredFetchedItems));
    }
  }, [dispatch, fetchedItems]);

  //TODO: Utilize items from redux for local rendering purposes

  //TODO: DELETE items through trpc
  const { mutateAsync: mutateArchiveItem } =
    trpc.userItem.archiveItem.useMutation();

  const ArchiveItem = async (data: ArchiveItemSchema) => {
    try {
      const result = await mutateArchiveItem(data);

      // await and fire a mutateArchiveItem.many ?? maybe

      console.log("result: ", result);

      refetch();

      setShowItemOptions(false);
    } catch (error) {}
  };
  //console.log("lists inside [id]: ", lists);

  const Listindex = lists?.findIndex((item) => item.id === listId);
  //console.log("ListIndex is: ", Listindex);

  const currentTitle = lists?.[Listindex!]?.title;

  //Display Item Options Function:
  const displayItemOptions = (index: number) => {
    setShowItemOptions(!showItemOptions);
    setActiveItemIndex(index);
  };

  const nonArchivedItems = items?.filter(
    (i) => i.archive !== "trash" && i.archive !== "archive"
  );

  //console.log("nonArchivedItems - start [id]: ", nonArchivedItems);

  const nonArchiveLists = lists?.filter(
    (i) =>
      i.archive !== "trash" &&
      i.archive !== "archive" &&
      i.parentListUserId === "undefined"
  );

  //search Function
  const [filteredResults, setFilteredResults] = useState<any>([]);

  // Debounce Search Users Input

  //type SomeFunction = (...args: any[]) => void;

  function useDebounce<T>(value: T, delay: number): T {
    const timer = useRef<T>();

    //TODO: might need to change UseState to a ref to handle react batching
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(
      () => {
        // Update debounced value after delay
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        // Cancel the timeout if value changes (also on delay change or unmount)
        // This is how we prevent debounced value from updating if value is changed ...
        // .. within the delay period. Timeout gets cleared and restarted.
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay] // Only re-call effect if value or delay changes
    );

    return debouncedValue;
  }

  const [searchTerm, setSearchTerm] = useState<string>("");

  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, 500);
  //console.log("debouncedSearchTerm: ", debouncedSearchTerm);

  const currentUser = users?.filter((i) => i.id === session?.user?.id);
  const usersNotCurrent = users?.filter((i) => i.id !== session?.user?.id);

  //console.log("usersNotCurrent: ," + JSON.stringify(usersNotCurrent, 0, 2));

  useEffect(() => {
    if (debouncedSearchTerm) {
      //changes usersNotCurrent to not include id - prevents the odd issue of the debounce term showing names that do not match the lettering typed into the search bar:
      //ex: typing in "l" looking for levi and seeing sarah because her Id contains an 'l'
      //decided to exclude emails as well since the letters in gmail or yahoo, etc would be included in search. Can look into changing this later if people go for more funky names, or having a separate lookup of email for sending.
      const usersNotCurrentWOIdEmail = usersNotCurrent?.map(
        ({ id, email, ...rest }) => ({
          ...rest,
        })
      );

      //console.log("newFilteredUsers: ," + JSON.stringify(newFilteredUsers, 0, 2));
      const filteredUsers = usersNotCurrentWOIdEmail?.filter((user) => {
        return Object.values(user)
          .join("")
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      });

      console.log("filteredUsers: ", filteredUsers);

      //? https://stackoverflow.com/questions/31005396/filter-array-of-objects-with-another-array-of-objects
      //setResults from a filtering of usernames from usersNotCurrentWOIdEmail but including emails/ids
      const newFilteredResults = usersNotCurrent?.filter((el) => {
        return filteredUsers?.some((u) => {
          return u.username === el.username;
        });
      });
      console.log("newFilteredResults: ", newFilteredResults);

      setFilteredResults(newFilteredResults);
    } else {
      setFilteredResults([]);
    }
  }, [debouncedSearchTerm]);

  //getFriendShipQuery
  const { data: friendshipData, refetch: refetchFriendships } =
    trpc.friendship.getFriendships.useQuery();
  //console.log("data from Friendships: ", friendshipData);
  const friendshipExist = true;

  const friendshipExistFunction = (userId: string) => {
    const status = friendshipData?.results.filter(
      (user) => user.senderId === userId || user.receiverId === userId
    );
    //console.log("status: ", status);
    if (status?.length === 1) {
      if (status[0]?.status === "pending") {
        const response = "added";
        return response;
      }
      if (status[0]?.status === "friend") {
      }
      return false;
    }
  };

  //friends
  //console.log("users: ", users);
  const usersWithStatusFriend = friendshipData?.results.filter(
    (r) => r.status === "friend"
  );

  //console.log("usersWithStatusFriend: ", usersWithStatusFriend);

  //TODO: Add more indicators of friend strength or recency to change which friends are shown first or in higher priority

  const filteredFriends = usersNotCurrent?.filter((el) => {
    return usersWithStatusFriend?.some((u) => {
      return u.receiverId === el.id || u.senderId === el.id;
    });
  });

  //console.log("filteredFriends", filteredFriends);
  //console.log("filteredResults", filteredResults);

  // share function

  const { mutateAsync: mutateShareListAsync } =
    trpc.userList.shareList.useMutation();

  const shareListOnSubmit = useCallback(
    async (data: any) => {
      try {
        const { email } = data;
        data.targetEmail = email;
        data.listId = activeList!.id;
        data.listTitle = activeList!.title;
        data.userId = activeList!.userId;

        console.log("email: ", email);
        if (items) {
          //filter out archived/trash items so they aren't sent/copied over
          const filteredItems = items.filter(
            (i) => i.archive == "archive" || "trash"
          );
          console.log("filteredItems: ", filteredItems);

          data.items = filteredItems;
          console.log("data.items: ", data.items);
          const result = await mutateShareListAsync(data);
          console.log("result in Onsubmit share form: ", result);
          //old toast notification for sending
          // if (result) {
          //   setShowToast(true);
          //   setTimeout(() => {
          //     setShowToast(false);
          //   }, 1000);
          // }
        } else {
          const result = await mutateShareListAsync(data);
          console.log("result in Onsubmit share form: ", result);
          //old toast notification for sending
          // if (result) {
          //   setShowToast(true);
          //   setTimeout(() => {
          //     setShowToast(false);
          //   }, 1000);
          // }
          //redirection if needed
          // setTimeout(() => {
          //   router.push("/");
          // }, 500);
        }
        //setShowToast(false);
      } catch (err) {
        console.error(err);
      }
    },
    [mutateShareListAsync]
  );
  //main Function
  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0 bg-gray-400 bg-opacity-50 transition-opacity" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pt-20 lg:pl-10 lg:pr-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-y-full"
                  enterTo="translate-y-0 "
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-y-0"
                  leaveTo="translate-y-full"
                >
                  <Dialog.Panel className="max-w pointer-events-auto w-screen">
                    <div className="flex h-full flex-col  bg-white shadow-xl ">
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Share
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                              onClick={() => {
                                setOpen(false);
                                setSearchTerm("");
                              }}
                            >
                              <span className="sr-only">Close panel</span>
                              <HiX className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Tabs for future */}
                      {/* <div className="border-b border-gray-200">
                        <div className="px-6">
                          <nav
                            className="-mb-px flex space-x-6"
                            x-descriptions="Tab component"
                          >
                            {tabs.map((tab) => (
                              <a
                                key={tab.name}
                                href={tab.href}
                                className={classNames(
                                  tab.current
                                    ? "border-indigo-500 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                  "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                                )}
                              >
                                {tab.name}
                              </a>
                            ))}
                          </nav>
                        </div>
                      </div> */}

                      {/* Start - Search for Friend/Person to share list with */}
                      {/* Bring from profile page component the share logic over - will need to slightly tweak parts of it to add in a favor friends aspect. Will most likely use the logic from the seperate tabs (friends/pending/sent) most notably the friends tab to prioritize those users */}
                      <form>
                        <div className="relative flex flex-col">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                              />
                            </svg>
                          </div>
                          <input
                            type="search"
                            id="friend-search"
                            autoComplete="off"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 "
                            placeholder="Search for Friends..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          {/* <button
                    type="submit"
                    className="absolute right-2.5 bottom-2.5 rounded-lg bg-black/80 px-4 py-2 text-sm font-medium text-white"
                  >
                    Search
                  </button> */}
                        </div>
                        {/* Display Users from Search */}
                        {/* test */}
                        <div>
                          {filteredResults.length > 0 ? (
                            <div className="flex flex-col">
                              <p>hi</p>
                              <ul
                                role="list"
                                className="h-screen flex-1 divide-y divide-gray-200 overflow-y-auto"
                              >
                                {filteredResults.map((user: any, key: any) => (
                                  <li key={key}>
                                    <div className="group relative flex items-center py-6 px-5">
                                      <a className="-m-1 block flex-1 p-1">
                                        <div
                                          className="absolute "
                                          aria-hidden="true"
                                        />
                                        <div className="relative flex min-w-0 flex-1 items-center">
                                          <span className="relative inline-block flex-shrink-0">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth={1.5}
                                              stroke="currentColor"
                                              className="h-6 w-6"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                              />
                                            </svg>
                                          </span>
                                          <div className="ml-4 truncate">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                              {user.username}
                                            </p>
                                            <p className="truncate text-sm text-gray-500">
                                              {user.email}
                                            </p>
                                          </div>
                                        </div>
                                      </a>
                                      <div className="ml-4 border-2">
                                        {/* //! Actually send Data to users on button press - prevent default of reloading page on sending once */}
                                        <button
                                          className="hover:bg-green-200"
                                          type="button"
                                          onClick={() => handleSubmit(onSubmit)}
                                        >
                                          Send
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : filteredFriends!.length > 0 ||
                            filteredFriends === undefined ||
                            null ? (
                            <div className="flex flex-col">
                              <ul
                                role="list"
                                className="h-screen flex-1 divide-y divide-gray-200 overflow-y-auto"
                              >
                                {filteredFriends!.map((user: any, key: any) => (
                                  <li key={key}>
                                    <div className="group relative flex items-center py-6 px-5">
                                      <a className="-m-1 block flex-1 p-1">
                                        <div
                                          className="absolute "
                                          aria-hidden="true"
                                        />
                                        <div className="relative flex min-w-0 flex-1 items-center">
                                          <span className="relative inline-block flex-shrink-0">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              strokeWidth={1.5}
                                              stroke="currentColor"
                                              className="h-6 w-6"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                              />
                                            </svg>
                                          </span>
                                          <div className="ml-4 truncate">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                              {user.username}
                                            </p>
                                            <p className="truncate text-sm text-gray-500">
                                              {user.email}
                                            </p>
                                          </div>
                                        </div>
                                      </a>
                                      <div className="ml-4 border-2">
                                        <button
                                          className="hover:bg-green-200"
                                          type="button"
                                          onClick={() =>
                                            shareListOnSubmit(user)
                                          }
                                        >
                                          Send
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </form>
                      {/* End - Search for Friend/Person to share list with */}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex h-screen flex-col justify-between">
        {/* Header Nav: Start */}
        <header className="border-grey z-80 sticky top-0 grid h-14 w-full grid-cols-8 grid-rows-1 border-b p-4 text-center">
          {/* Back button - Home page link */}
          <div className="col-start-1 row-start-1">
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                />
              </svg>
            </Link>
          </div>
          {/* List Title */}
          <div className="col-span-2 col-start-3 row-start-1 w-full items-center justify-between text-center">
            {lists ? <h1> {currentTitle}</h1> : null}
          </div>
          {/* Share Form Link */}
          <div className="col-start-7 row-start-1 flex flex-col items-end">
            <button
              //href="/share"
              //onClick={() => dispatch(setActiveItems(*all items attached to active list))}

              onClick={() => setOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
            </button>
          </div>
          {/* Options */}
          <div className="col-start-8 row-start-1 flex flex-col items-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
              onClick={() => console.log("options")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </div>
        </header>
        {/* Header Nav: End */}

        <ListDisplayProto />

        <div className="z-0 m-2 grid h-screen grid-flow-row auto-rows-max items-center overflow-hidden p-2">
          <div className="relative grid">
            <div className="items-center py-1 text-center">
              <h3 className="mb-4 text-lg font-semibold">{currentTitle}</h3>
              <RankItems />
              <div
                className="bg-pink-400"
                onClick={() => dispatch(resetItemsTest())}
              >
                resetItemsTest
              </div>

              {/* https://stackoverflow.com/questions/62382324/react-typescript-this-jsx-tags-children-prop-expects-a-single-child-of-type */}
              {/* react fragments solve error  */}
              {/*   Display Items Module: Start */}
              <>
                {nonArchivedItems! === undefined ||
                nonArchivedItems?.length === 0 ||
                nonArchivedItems! === null ? (
                  <div className="z-0 m-2 flex flex-col items-center rounded-md text-center">
                    <h1>You have no Items in this list</h1>
                    <p className="mt-8">
                      To create an item click the addItem button below.
                    </p>
                  </div>
                ) : (
                  nonArchivedItems!.map((item, index) => (
                    <div
                      className="relative z-0 m-1 grid cursor-pointer grid-cols-7 grid-rows-1 rounded-lg border-2 border-solid border-black bg-white p-2 font-semibold text-black hover:bg-gray-200"
                      key={index}
                      onBlur={() => setShowItemOptions(false)}
                    >
                      <div className="col-span-5 col-start-1 row-start-1">
                        {item.title}
                      </div>
                      {/* Show ... Options: Start */}
                      <div className="col-start-6">
                        {showItemOptions && activeItemIndex === index ? (
                          <div className=" row-start-1 flex flex-row-reverse ">
                            <button
                              className="btn-sm btn md:btn-md"
                              id="trashBtn"
                              onClick={async () =>
                                ArchiveItem({
                                  userId: item.userId,
                                  itemId: item.id,
                                  listId,
                                  archiveStatus: "trash",
                                })
                              }
                            >
                              <svg
                                id="trashBtn"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6 sm:h-5 md:w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className=" justify-end ">
                            <button
                              className="btn-sm btn "
                              id="...Btn"
                              onClick={() => displayItemOptions(index)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-6 w-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                        {/* Show ... Options: End */}
                      </div>
                    </div>
                  ))
                )}
              </>
              {/*   Display Items Module: End */}
              {/*   Add Item Module: Start */}
              <div className="text-gray-dark my-8 items-center rounded">
                <button
                  className={`cursor pointer btn-wide btn mt-8   justify-center rounded-lg border-2 border-solid border-black bg-primary p-2 hover:bg-gray-400 ${
                    showTextInput && "hidden"
                  }`}
                  onClick={() => {
                    setShowTextInput(!showTextInput);
                    setShowItemOptions(false);
                  }}
                >
                  Add an item...
                </button>
                <span className={`${!showTextInput && "hidden"}`}>
                  <form
                    className="flex flex-col items-center justify-center"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    {/* Error Toast/Message: Start */}
                    {/* Toast: Start*/}
                    {showToast ? (
                      <div
                        id="toast-simple"
                        className="flex h-14 w-60 items-center space-x-4 divide-x divide-gray-200 rounded-lg bg-green-400 p-4 text-black shadow"
                        role="alert"
                      >
                        <HiPlus />
                        <div className="pl-6 font-normal">Item Created</div>
                      </div>
                    ) : (
                      <div></div>
                    )}

                    {/* Toast: End */}
                    {/* //TODO: Change to Toast pop up and use useState to clear it on cancel so a new submit must be fired for error toast to appear */}
                    <div className="mb-4">
                      {errors?.itemTitle && (
                        <p className="inline  p-2 font-bold text-red-800">
                          ⚠{errors.itemTitle.message}
                        </p>
                      )}
                    </div>
                    {/* Error Toast/Message: End */}
                    <input
                      type="text"
                      id="itemTitle"
                      className="input-bordered input  input-md block h-20 w-full max-w-xs rounded-lg border border-gray-300 bg-primary p-2.5  text-center"
                      placeholder="Enter your item name here..."
                      autoComplete="off"
                      onFocus={() => setFocus(true)}
                      onTouchCancel={() => setFocus(false)}
                      onTouchEnd={() => setFocus(false)}
                      {...register("itemTitle")}
                    />
                    <span className="relative mt-2 flex items-center justify-center ">
                      <button
                        className="hover:bg-green-800focus:ring-4 btn  rounded-lg bg-green-500 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-blue-300 "
                        type="submit"
                        //onClick={handleSubmit}
                      >
                        Add Item
                      </button>
                      <span className="m-6" />
                      <button
                        className="btn  rounded-lg bg-red-700 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300  "
                        onClick={() => clearItemInput()}
                        type="reset"
                      >
                        Cancel
                      </button>
                    </span>
                  </form>
                </span>
              </div>
              {/*   Add Item Module: End */}
            </div>
          </div>
        </div>
        <div>
          <div className="">
            {/* AddItemOrList Component: Start*/}
            <div className="mb-20 flex flex-col items-center justify-center text-center">
              {showAdd ? (
                <div className="" onBlur={() => setShowAdd(false)}>
                  {nonArchiveLists!.length >= 1 ? (
                    <button
                      className=" btn m-2 sm:btn-sm md:btn-md lg:btn-lg "
                      onClick={() => {
                        setShowTextInput(!showTextInput);
                        setShowItemOptions(false);
                        setShowAdd(false);
                      }}
                    >
                      Add Item
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
            {/* AddItemOrList Component: End*/}

            {/* FooterBar Component: Start*/}
            {/* This is below the AddItem/List and has its own separate forced bottom-0 position */}

            <div className="btm-nav bottom-0  grid h-14 w-full grid-cols-3 grid-rows-1 items-center justify-center bg-black/30 text-center">
              <div className="col-start-1 row-start-1 flex flex-col items-center justify-center">
                <Link href="/" className="absolute bottom-3 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                </Link>
              </div>
              <div className="col-start-2 row-start-1 flex flex-col items-center">
                <button
                  onClick={() => setShowAdd(!showAdd)}
                  className="btn-circle btn absolute bottom-8 flex h-12 w-12 bg-black/40 "
                >
                  <HiPlus />
                </button>
              </div>
              <div className="col-start-3 row-start-1">
                <Link
                  href="/profile"
                  className="z-80 absolute bottom-3 text-center"
                >
                  {/* profile link */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            {/* FooterBar Component: End*/}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListPage;
