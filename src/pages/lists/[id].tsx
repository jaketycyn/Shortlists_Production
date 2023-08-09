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

import ListDisplay from "../../components/layouts/listpage/ListDisplay";
import { ListHeader } from "../../components/navigation/ListHeader";
import FooterNav from "../../components/navigation/FooterNav";

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
      const convertCurrentRankToPotentialRank = filteredFetchedItems.map(
        (item) => {
          return {
            ...item,
            potentialRank: item.currentRank,
          };
        }
      );

      // console.log("filteredFetchedItems: ", filteredFetchedItems);
      dispatch(setItems(convertCurrentRankToPotentialRank));
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
      <div className="flex overflow-hidden">
        <div className="flex ">
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
                                    {filteredResults.map(
                                      (user: any, key: any) => (
                                        <li key={key}>
                                          <div className="group relative flex items-center px-5 py-6">
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
                                                onClick={() =>
                                                  handleSubmit(onSubmit)
                                                }
                                              >
                                                Send
                                              </button>
                                            </div>
                                          </div>
                                        </li>
                                      )
                                    )}
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
                                    {filteredFriends!.map(
                                      (user: any, key: any) => (
                                        <li key={key}>
                                          <div className="group relative flex items-center px-5 py-6">
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
                                      )
                                    )}
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
          <div className="flex h-screen flex-col">
            <ListHeader />
            <ListDisplay />
            <FooterNav />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListPage;
