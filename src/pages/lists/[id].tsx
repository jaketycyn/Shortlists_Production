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

  // console.log(activeList?.title);
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
      console.log("About to filter:", fetchedItems);

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

  console.log("About to filter: currentUser");
  const currentUser = users?.filter((i) => i.id === session?.user?.id);
  console.log("currentUser: ," + JSON.stringify(currentUser, 0, 2));
  console.log("About to filter: usersNotCurrent");
  const usersNotCurrent = users?.filter((i) => i.id !== session?.user?.id);

  console.log("usersNotCurrent: ," + JSON.stringify(usersNotCurrent, 0, 2));

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
      console.log("About to filter: filteredResults");
      const filteredUsers = usersNotCurrentWOIdEmail?.filter((user) => {
        return Object.values(user)
          .join("")
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      });

      console.log("filteredUsers: ", filteredUsers);

      //? https://stackoverflow.com/questions/31005396/filter-array-of-objects-with-another-array-of-objects
      //setResults from a filtering of usernames from usersNotCurrentWOIdEmail but including emails/ids
      console.log("About to filter: newFilteredResults");
      const newFilteredResults = usersNotCurrent?.filter((el) => {
        return filteredUsers?.some((u) => {
          return u.username === el.username;
        });
      });
      console.log("newFilteredResults:  newFilteredResults");
      console.log("filteredResults: ", filteredResults);
      setFilteredResults(newFilteredResults);
    } else {
      setFilteredResults([]);
    }
  }, [debouncedSearchTerm]);

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
            <ListHeader title={activeList?.title} />
            <ListDisplay />
            <FooterNav />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListPage;
