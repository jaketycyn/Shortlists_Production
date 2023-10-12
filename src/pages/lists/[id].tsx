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
  console.log("currentUser: ," + JSON.stringify(currentUser, null, 2));
  console.log("About to filter: usersNotCurrent");
  const usersNotCurrent = users?.filter((i) => i.id !== session?.user?.id);

  console.log("usersNotCurrent: ," + JSON.stringify(usersNotCurrent, null, 2));

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
          return u.name === el.name;
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
        <div className="flex h-screen flex-col">
          <ListHeader title={activeList?.title} />
          <ListDisplay />
          <FooterNav />
        </div>
      </div>
    </>
  );
};

export default ListPage;
