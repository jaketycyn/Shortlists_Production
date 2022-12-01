import React, { useState } from "react";
import Link from "next/link";

import { HiPlus } from "react-icons/hi";
import type { NextPage } from "next";

//import { useAppContext } from "../context/appContext";

const FooterNav: NextPage = () => {
  const [showAdd, setShowAdd] = React.useState<boolean>(false);
  //console.log("showAdd", showAdd);

  return (
    <div className="grid h-14 w-full grid-cols-3 grid-rows-1 items-center justify-center bg-primary text-center">
      <div className="col-start-1 row-start-1">
        <Link href="/" className="absolute bottom-3 text-center">
          Hamburger
        </Link>
        {showAdd ? (
          <button className="absolute bottom-20 left-20 h-12  w-24 rounded-lg border-2 bg-white text-black">
            <Link href="/addList" onClick={() => setShowAdd(false)}>
              <p className="">Add List</p>
            </Link>
          </button>
        ) : null}
      </div>
      <div className="col-start-2 row-start-1 flex items-center justify-center">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="absolute bottom-8 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-accent/90 "
        >
          <HiPlus />
        </button>
      </div>
      <div className="col-start-3 row-start-1">
        {/* AddItemOrList Component Start*/}
        <Link href="/" className="absolute bottom-3 text-center">
          Bell
        </Link>
        {showAdd ? (
          <button className="align-right border- absolute right-20 bottom-20 h-12 w-24 rounded-lg bg-white text-black">
            <Link href="/addItem" onClick={() => setShowAdd(false)}>
              <p className="">Add Item</p>
            </Link>
          </button>
        ) : null}
        {/* AddItemOrList Component End*/}
      </div>
    </div>
  );
};

export default FooterNav;
