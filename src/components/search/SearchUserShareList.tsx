import { useState, useRef, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { useAppSelector } from "../../hooks/useTypedSelector";
import { useSession } from "next-auth/react";
import { Resolver } from "react-hook-form";

import { shareListSchema } from "../../server/schema/listSchema";

const SearchUserShareList = () => {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [filteredResults, setFilteredResults] = useState<any>([]);
  const { users } = useAppSelector((state) => state.user);
  const { items } = useAppSelector((state) => state.item);
  const { activeList, error, loading } = useAppSelector((state) => state.list);

  // Debounce Search Users Input
  type Timer = ReturnType<typeof setTimeout>;
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

  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, 500);
  //console.log("debouncedSearchTerm: ", debouncedSearchTerm);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filteredUsers = usersNotCurrent?.filter((user) => {
        return Object.values(user)
          .join("")
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      });

      setFilteredResults(filteredUsers);
      //console.log("filteredUsers: ", filteredUsers);

      //searchdata
    } else {
      setFilteredResults([]);
    }
  }, [debouncedSearchTerm]);

  const currentUser = users?.filter((i) => i.id === session?.user?.id);
  const usersNotCurrent = users?.filter((i) => i.id !== session?.user?.id);
  //   console.log("usersNotCurrent: ", usersNotCurrent);

  //getFriendShipQuery
  const { data: friendshipData, refetch: refetchFriendships } =
    trpc.friendship.getFriendships.useQuery();
  //console.log("data from Friendships: ", friendshipData);

  //friends
  //console.log("users: ", users);
  const usersWithStatusFriend = friendshipData?.results.filter(
    (r) => r.status === "friend"
  );

  //Send/Share List Function
  const { mutateAsync } = trpc.userList.shareList.useMutation();

  const shareList = async (userId: string) => {
    try {
      if (!activeList) {
        console.error("activeList is undefined or null!");
        return;
      }

      if (items) {
        const filteredItems = items.filter(
          (i) => i.archive === "archive" || i.archive === "trash"
        );
        console.log("filteredItems: ", filteredItems);

        let data = {
          userId: userId,
          listId: activeList.id,
          listTitle: activeList.title,
          items: filteredItems,
        };

        const result = await mutateAsync(data);
        console.log("result in Onsubmit share form: ", result);
        if (result) {
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 1000);
        }
      } else {
        let data = {
          userId: userId,
          listId: activeList.id,
          listTitle: activeList.title,
          items: [],
        };

        const result = await mutateAsync(data);
        console.log("result in Onsubmit share form: ", result);
        if (result) {
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 1000);
        }
        // Redirection code (if needed)
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen">
      <form>
        <div className="relative flex flex-col">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-black"
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
            className="block w-full rounded-lg border border-gray-300 bg-gray-100 p-4 pl-10 text-sm text-gray-900 "
            placeholder="Search for Friends..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          {/* <button
                    type="submit"
                    className="absolute right-2.5 bottom-2.5 rounded-lg bg-black/80 px-4 py-2 text-sm font-medium text-white"
                  >
                    Search
                  </button> */}
        </div>
        {/* Display Users from Search */}
        <div>
          {filteredResults ? (
            <div className=" flex flex-col bg-gray-200">
              <ul className="divide-y divide-gray-200 text-black">
                {filteredResults.map((user: any, key: any) => (
                  <div className="pt-2" key={key}>
                    <li className="grid grid-cols-7 grid-rows-1 items-center py-3 sm:py-4">
                      <div className="col-span-5 col-start-1 row-start-1 flex flex-row items-center justify-center">
                        <div className="row-start-1 mr-1 flex-shrink-0">
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

                          {/* 
                        Image Placeholder
                      <Image className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"> */}
                        </div>
                        <div className=" row-start-1 min-w-0 flex-1 ">
                          <p className="truncate text-sm font-medium ">
                            {user.username}
                          </p>
                          <p className="mr-4 truncate text-sm">{user.email}</p>
                          {/* <p className="truncate text-sm ">{user.status}</p> */}
                        </div>
                      </div>
                      <div className="col-span-2 col-end-7 row-start-1 ml-8 w-full justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          onClick={() => shareList(user.id)}
                        >
                          Share
                        </button>
                      </div>
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default SearchUserShareList;
