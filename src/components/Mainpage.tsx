import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";

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
  //const [subMenuIndexes, setSubMenuIndexes] = useState([]);
  //const [userReceivedListsOpen, setUserReceivedListsOpen] = useState(true);
  //const [subMenuIndex, setSubMenuIndex] = useState();

  // const toggleSubMenu = (index: number, subMenuIndexes: any) => {
  //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in. Thus we use newIndex
  // const newIndex = index + 1;
  // }

  //const [showShareForm, setShowShareForm] = useState(false);
  const getLists = trpc.userList.getLists.useQuery();
  const { data } = useSession();
  //console.log("data from useSession: ", data);
  // console.log("data: ", data?.user.username)

  return (
    <div className="flex h-screen flex-col justify-between">
      <div
        onClick={
          () => console.log("hi")
          //setAddItemOrList(false)
        }
      >
        getLists ({getLists.status}):{" "}
        <pre>{JSON.stringify(getLists.data, null, 2)}</pre>
        <header className="absolute top-0 z-10 mb-2 flex h-14 w-full  flex-col items-center border-2 bg-white pt-4 text-center">
          <h1 className="font-semibold">Shortlists</h1>
          {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}
        </header>
        {getLists ? (
          <div className="z-0 m-2 flex flex-col items-center rounded-md text-black ">
            <ul className="w-5/6 pt-2 ">
              {/* My Lists Button: Begin*/}
              <div className="flex flex-col items-center text-center">
                <button
                  className="h-30 mt-12 grid  w-1/2 grid-cols-4 grid-rows-1 items-center rounded-lg border-2 border-slate-400 text-center font-semibold"
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
                className={` container relative z-0 h-full items-center
                `}
                //? addItemOrList && "opacity-30" ^ above
              >
                {}
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
