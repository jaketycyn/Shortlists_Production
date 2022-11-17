import React, { useState } from "react";
import  Link from "next/link";

import { HiPlus } from "react-icons/hi";
import type { NextPage } from "next";

//import { useAppContext } from "../context/appContext";

const FooterNav: NextPage = () => {
  const [showAdd, setShowAdd ] = React.useState<boolean>(false);
  console.log('showAdd', showAdd)

  return (
    <div className="h-14 grid grid-rows-1 grid-cols-3 w-full text-center justify-center items-center  ">
      <div className="row-start-1 col-start-1">
        <Link href="/">Home</Link>
      </div>
      <div className="row-start-1 col-start-2"></div>
      <div className="row-start-1 col-start-3 flex justify-center items-center">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex justify-center items-center w-6 h-6  border-2 border-black "
        >
          <HiPlus />
        </button>
        {/* AddItemOrList Component Start*/}

      {showAdd ? (
        <div className="absolute flex bottom-16 right-2 z-10 bg-white">
          <ul className=" grid gap-y-4">
            <button>
              <Link href="/add-list" onClick={() => setShowAdd(false)}>
                <li className="flex flex-row justify-center items-center z-10 bg-white-900 h-16 w-32 border-4 ">
                  <p className="flex flex-row z-10">Add List</p>
                </li>
              </Link>
            </button>
            <button>
              <Link href="/add-item" onClick={() => setShowAdd(false)}>
                <li className=" flex justify-center items-center h-16 w-32 border-4">
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
