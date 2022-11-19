import React, { useState } from "react";
import Link from "next/link";

import { HiPlus } from "react-icons/hi";
import type { NextPage } from "next";

//import { useAppContext } from "../context/appContext";

const FooterNav: NextPage = () => {
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  console.log("showAdd", showAdd);

  return (
    <div className="grid h-14 w-full grid-cols-3 grid-rows-1 items-center justify-center text-center  ">
      <div className="col-start-1 row-start-1">
        <Link href="/">Home</Link>
      </div>
      <div className="col-start-2 row-start-1"></div>
      <div className="col-start-3 row-start-1 flex items-center justify-center">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex h-6 w-6 items-center justify-center  border-2 border-black "
        >
          <HiPlus />
        </button>
        {/* AddItemOrList Component Start*/}

        {showAdd ? (
          <div className="absolute bottom-16 right-2 z-10 flex bg-white">
            <ul className=" grid gap-y-4">
              <button>
                <Link href="/addList" onClick={() => setShowAdd(false)}>
                  <li className="bg-white-900 z-10 flex h-16 w-32 flex-row items-center justify-center border-4 ">
                    <p className="z-10 flex flex-row">Add List</p>
                  </li>
                </Link>
              </button>
              <button>
                <Link href="/addItem" onClick={() => setShowAdd(false)}>
                  <li className=" flex h-16 w-32 items-center justify-center border-4">
                    <p className="flex flex-row ">Add Item</p>
                  </li>
                </Link>
              </button>
            </ul>
          </div>
        ) : (
          <div></div>
        )}
        {/* AddItemOrList Component End*/}
      </div>
    </div>
  );
};

export default FooterNav;
