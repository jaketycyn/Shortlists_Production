import type { NextPage } from "next";
import { useSession, } from "next-auth/react";
import {  Fragment, useEffect, useState } from "react";

import {
  HiOutlineDotsVertical,
  HiPlus,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { Dialog, Menu, Transition } from "@headlessui/react";
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






    const { data } = useSession();
    console.log("data from useSession: ", data)
    // console.log("data: ", data?.user.username)
  
    return (
      <div className="flex flex-col h-screen justify-between">
        <div onClick={() => console.log('hi')
      //setAddItemOrList(false)  
      } 
      
          >
          <header className="flex flex-col absolute top-0 w-full h-14 mb-2  text-center items-center border-2 z-10 bg-white pt-4">
            <h1 className="font-semibold">Shortlists</h1>
            {/* Setup Grid - layout later for spacing of Back, list name, share icon & more options icon w/ redirect to options page like Notion*/}
           
          </header>
          <div className="flex flex-col items-center rounded-md text-black m-2 z-0 ">
            <ul className="pt-2 w-5/6 ">
              {/* My Lists Button: Begin*/}
              <div className="flex flex-col items-center text-center">
                <button className="grid grid-rows-1 grid-cols-4  mt-12 h-30 w-1/2 font-semibold items-center text-center border-2 border-slate-400 rounded-lg"
                onClick={() => setUserListsOpen(!userListsOpen)}
                >
                <HiOutlineChevronRight
                  //index + 1 needed because for some reason index at 0 was never found even with it being hard coded in.
                  className={`grid row-start-1 row-span-1 col-start-1 col-span-1 m-2 ${
                    userListsOpen && "rotate-90"
                  } `}
                />

                <h1 className="grid row-start-1 row-span-1 col-start-2 col-span-2">
                  My lists
                </h1>
                </button>
              </div>
                 {/* My Lists Button: End*/}

                  {/* Display UserClassicLists Module: Begins*/}
            
              <div className={` h-full relative items-center container z-0
                `}
                //? addItemOrList && "opacity-30" ^ above 
              >
                  <h1 className="font-black">
                {/* {data?.user?.userId} */}
                </h1> 
              </div>
            </ul>
          </div>
        </div>
        <div>  <FooterNav/></div>
      </div>
     
    );
}

export default Mainpage