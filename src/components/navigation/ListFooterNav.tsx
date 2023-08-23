import React, { useState } from "react";
import Link from "next/link";

import { HiPlus } from "react-icons/hi";
import type { NextPage } from "next";
import { useAppSelector } from "../../hooks/useTypedSelector";

//import { useAppContext } from "../context/appContext";

const ListFooterNav: NextPage = () => {
  const { lists } = useAppSelector((state) => state.list);
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  //console.log("showAdd", showAdd);

  const nonArchiveLists = lists?.filter(
    (i) =>
      i.archive !== "trash" &&
      i.archive !== "archive" &&
      i.parentListUserId === "undefined"
  );

  return (
    <div className="">
      {/* AddItemOrList Component: Start*/}
      <div className="mb-20 flex flex-col items-center justify-center text-center">
        {showAdd ? (
          <div className="" onBlur={() => setShowAdd(false)}>
            {nonArchiveLists!.length >= 1 ? (
              <button
                className=" btn m-2 sm:btn-sm md:btn-md lg:btn-lg "
                onClick={() => console.log("addItem")}
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
            className="btn btn-circle absolute bottom-8 flex h-12 w-12 bg-black/40 "
          >
            <HiPlus />
          </button>
        </div>
        <div className="col-start-3 row-start-1">
          <Link href="/profile" className="z-80 absolute bottom-3 text-center">
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
  );
};

export default ListFooterNav;
