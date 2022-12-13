import type { NextPage } from "next";
import Image from "next/image";
import React, { useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Link from "next/link";
import FooterNav from "../../navigation/FooterNav";
import { useForm, Resolver, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../hooks/useTypedSelector";
import { setUsers } from "../../../slices/usersSlice";

const ProfilePageLayout: NextPage = () => {
  const { data: session, status } = useSession();
  // console.log("session: ", session);
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.user);

  //query to Get All Users in DB
  const { data: foundUsers } = trpc.user.getAllUsers.useQuery();
  //console.log("foundUsers: ", foundUsers);
  //store all Users in DB

  const { handleSubmit, register, watch } = useForm<any>({
    defaultValues: {
      friendIdentifier: "",
    },
  });

  useEffect(() => {
    if (foundUsers) {
      const users = foundUsers.results;
      dispatch(setUsers(users));
    }
  }, [dispatch, []]);
  //search function using Stored Users to Display

  //search Function
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState<any>([]);

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

  const [searchTerm, setSearchTerm] = useState<string>("");

  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, 500);

  console.log("debouncedSearchTerm: ", debouncedSearchTerm);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filteredUsers = usersNotCurrent?.filter((user) => {
        return Object.values(user)
          .join("")
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      });

      setFilteredResults(filteredUsers);
      console.log("filteredUsers: ", filteredUsers);

      //searchdata
    } else {
      setFilteredResults([]);
    }
  }, [debouncedSearchTerm]);

  const currentUser = users?.filter((i) => i.id === session?.user?.id);
  const usersNotCurrent = users?.filter((i) => i.id !== session?.user?.id);

  console.log("currentUser: ", currentUser);
  //console.log("users: ", users);
  //console.log("usersNotCurrent: ", usersNotCurrent);

  const sendFriendRequestFunction = () => {
    console.log("friendRequest CLicked");
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col justify-between">
        {/* Header Nav: Start */}
        <header className="border-grey z-80 sticky top-0 grid h-14 w-full grid-cols-8 grid-rows-1 border-b p-4 text-center">
          {/* Back button - Home page link */}
          <div className="col-start-1 row-start-1">
            {/* backpage route back to previous historical page I was on */}
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
          <div className="col-span-2 col-start-3 row-start-1 w-full items-center justify-between text-center"></div>
          {/* Share Form Link */}
          <div className="col-start-7 row-start-1 flex flex-col items-end">
            <Link
              href="/share"
              //onClick={() => dispatch(setActiveItems(*all items attached to active list))}
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
            </Link>
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
        {/* Profile Section */}
        <div className="mt-2 h-screen">
          <div className="flex w-full flex-col items-center justify-center">
            {/* userProfile / Info to change */}

            <Image
              src="/1.jpg"
              alt="seattle"
              width={250}
              height={250}
              className="h-20 w-20 rounded-full"
            />
            <div>
              {currentUser ? (
                <ul className="m-2 flex flex-col gap-2 text-center">
                  <p>{currentUser[0]!.username}</p>

                  <p>{currentUser[0]!.email}</p>
                </ul>
              ) : null}
            </div>
          </div>
          {/* Friendslist/Finder Section */}
          <div>
            <ul className="mt-2 mb-2 divide-y-8 divide-gray-200">
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
                <div>
                  {filteredResults ? (
                    <div className="flex flex-col">
                      <ul className="divide-y divide-gray-200">
                        {filteredResults.map((user: any, key: any) => (
                          <div className="" key={key}>
                            <li className="flex flex-row items-center py-3 sm:py-4">
                              <div className="mr-2 flex-shrink-0">
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
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium ">
                                  {user.username}
                                </p>
                                <p className="truncate text-sm ">
                                  {user.email}
                                </p>
                                {/* <p className="truncate text-sm ">{user.status}</p> */}
                              </div>

                              <button
                                className="mr-1 mb-1 rounded bg-pink-500 px-4 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-pink-600"
                                type="button"
                                onClick={() => sendFriendRequestFunction()}
                              >
                                Send Request
                              </button>
                            </li>
                          </div>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </form>
              {/* Display All Users - Will change to friends later */}
              <h1 className="text-xl">Friends</h1>
              <div>
                {users?.length === 0 ? (
                  <div className="flex flex-col">
                    <ul className="divide-y divide-gray-200">
                      {users.map((user, key) => (
                        <div className="" key={key}>
                          <li className="flex flex-row items-center py-3 sm:py-4">
                            <div className="mr-2 flex-shrink-0">
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
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium ">
                                {user.username}
                              </p>
                              <p className="truncate text-sm ">{user.email}</p>
                              {/* <p className="truncate text-sm ">{user.status}</p> */}
                            </div>
                          </li>
                        </div>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              {/* Display Users with Friends Association */}

              {/* <p>Sync Contacts (find people you know) button</p> */}
            </ul>
          </div>
        </div>
        <div>
          <FooterNav />
        </div>
      </div>
    </>
  );
};

export default ProfilePageLayout;
