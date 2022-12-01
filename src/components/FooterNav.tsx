import React, { useState } from "react";
import Link from "next/link";

import { HiPlus } from "react-icons/hi";
import type { NextPage } from "next";

//import { useAppContext } from "../context/appContext";

const FooterNav: NextPage = () => {
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  //console.log("showAdd", showAdd);

  return (
    <div className="">
      {/* AddItemOrList Component: Start*/}
      <div className="mb-20 flex flex-col items-center justify-center text-center">
        {showAdd ? (
          <div className="">
            <button className="btn m-2 bg-blue-400 sm:btn-sm md:btn-md lg:btn-lg">
              <Link href="/addList" onClick={() => console.log("addList")}>
                Add List
              </Link>
            </button>
            <button className=" btn m-2 bg-orange-400 sm:btn-sm md:btn-md lg:btn-lg ">
              <Link href="/" onClick={() => console.log("addItem")}>
                Add Item
              </Link>
            </button>
          </div>
        ) : null}
      </div>
      {/* AddItemOrList Component: End*/}

      {/* FooterBar Component: Start*/}
      {/* This is below the AddItem/List and has its own separate forced bottom-0 position */}

      <div className="btm-nav bottom-0  grid h-14 w-full grid-cols-3 grid-rows-1 items-center justify-center bg-black/30 text-center">
        <div className="col-start-1 row-start-1 flex flex-col items-center">
          <Link href="/" className="absolute bottom-3 text-center">
            Hamburger
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
          <Link href="/" className="z-80 absolute bottom-3 text-center">
            Bell
          </Link>
        </div>
      </div>
      {/* FooterBar Component: End*/}
    </div>
  );
};

export default FooterNav;
