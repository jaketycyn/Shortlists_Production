import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";

import {
  HiOutlineDotsVertical,
  HiPlus,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { Dialog, Menu, Transition } from "@headlessui/react";

import { trpc } from "../utils/trpc";
import FooterNav from "./FooterNav";

const Mainpage: NextPage = () => {

  // subMenu State & Functions
  const [userListsOpen, setUserListsOpen] = useState(true);
  

  // const [subMenuIndexes, setSubMenuIndexes] = useState([]);
  // const [userReceivedListsOpen, setUserReceivedListsOpen] = useState(true);
  //const [subMenuIndex, setSubMenuIndex] = useState();

  // const toggleSubMenu = (index: number, subMenuIndexes: any) => {
  //   //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in. Thus we use newIndex
  //   const newIndex = index + 1;
  //   const subMenuIndexFound = subMenuIndexes.find((i: any) => i === newIndex);
  //   if (subMenuIndexFound) {
  //     //setSubMenuIndexes([...subMenuIndexes], newIndex + 1);
  //     const result = subMenuIndexes.filter((item: any) => item !== newIndex);
  //     setSubMenuIndexes(result);
  //   } else {
  //     setSubMenuIndexes((subMenuIndexess) => [...subMenuIndexes, newIndex]);
  //   }
  // };

  const [showShareForm, setShowShareForm] = useState(false);
  const getLists = trpc.userList.getLists.useQuery();
  const usersLists = getLists.data;
  console.log("usersLists: ", usersLists);

  const { data } = useSession();
  //console.log("data from useSession: ", data);
  // console.log("data: ", data?.user.username)

  //!Deleting List from Just having userid + listId
  


  return (
    <div className="flex h-screen flex-col justify-between">
      <div>
        {/* userLists ({getLists.status}):{" "}
        <pre>{JSON.stringify(usersLists, null, 2)}</pre> */}
        <header className="absolute top-0 z-10 mb-2 flex h-14 w-full  flex-col items-center border-2 bg-white pt-4 text-center">
          <h1 className="font-semibold">Shortlists</h1>
          {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}
        </header>
        {usersLists ? (
          <div className="z-0 m-2 flex flex-col items-center rounded-md text-black ">
            <ul className="w-5/6 pt-2 ">
              {/* My Lists Button: Begin*/}
              <div className="flex flex-col items-center text-center">
                <button
                  className={`h-30 mt-12 grid  w-1/2 grid-cols-4 grid-rows-1 items-center rounded-lg border-2 border-slate-400 text-center font-semibold ${
                    !userListsOpen && "bg-gray-300"
                  }`}
                  onClick={() => setUserListsOpen(!userListsOpen)}
                >
                  <HiOutlineChevronRight
                    //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in.
                    className={`col-span-1 col-start-1 row-span-1 row-start-1 m-2 grid ${
                      userListsOpen && "rotate-90"
                    } `}
                  />

                  <h1 className="col-span-2 col-start-2 row-span-1 row-start-1 grid">
                    My lists
                  </h1>
                </button>
              </div>

              {/* My Lists Button: End*/}

              {/* Display UserClassicLists Module: Begins*/}

              <div
                className="container relative z-0 h-full items-center"
              >
                {usersLists && userListsOpen && (
                  <div>
                    {usersLists.map((list, index) => (
                      <div
                        className="relative mt-2 flex cursor-pointer  snap-center items-center justify-between gap-x-2 rounded-md border-2 border-gray-600  text-sm  text-black hover:bg-primary"
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
                          href="/list"
                          key={index}
                          //onClick={() => goInsideList(list._id)}
                          className="h-full w-full p-2"
                        >
                          {list.title}
                        </Link>
                        {/* DropDown: Begin */}
                        <div className="dropdown dropdown-left">
                          <label tabIndex={0} className='btn m-1' >...</label>
                          <ul tabIndex={0} className='dropdown-content menu flex flex-col p-2 w-20 items-center text-center  shadow border-2 border-black bg-white rounded-box  divide-black'>
                            <li className="p-1 w-full "onClick={() => console.log("Edit")}>Edit</li>
                            <li className="p-1 "onClick={() => console.log("Share")}>Share</li>
                            <li className="p-1 "onClick={() => console.log("Trash")}>Trash</li>
                          </ul>
                        </div>
                        {/* DropDown: End */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ul>
          </div>
        ) : (
          <div>Create your first list</div>
        )}
      </div>
      <FooterNav />
    </div>
  );
};

export default Mainpage;
