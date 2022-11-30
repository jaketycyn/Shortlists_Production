import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { HiOutlineChevronLeft } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../../hooks/useTypedSelector";

const ListPage: NextPage = () => {
  const router = useRouter();
  const listId = router.query.id;

  const listItems = [
    { id: 123, title: "item1" },
    { id: 456, title: "item2" },
  ];

  const dispatch = useAppDispatch();

  const { lists, errors, loading } = useAppSelector((state) => state.list);
  //console.log("lists inside [id]: ", lists);

  const Listindex = lists?.findIndex((item) => item.id === listId);
  //console.log("ListIndex is: ", Listindex);

  const currentTitle = lists?.[Listindex!]?.title;
  return (
    <>
      <div className="flex h-screen flex-col justify-between">
        {/* Header Nav: Start */}
        <header className="border-grey z-80 sticky top-0 grid h-14 w-full grid-rows-1 border-b p-4 text-center">
          <Link href="/" className="row-start-1">
            <HiOutlineChevronLeft className="mt-1 h-4 w-4" />
          </Link>
          <div className="row-start-1 w-full items-center justify-between text-center">
            {lists ? <h1> {currentTitle}</h1> : null}
          </div>
          <div className="row-start-1">
            {/* some sort of share interface or module pop up or navigation to a share form page for inputs */}
            <div className="share">Share Icon</div>
          </div>
          <div className="row-start-1">...</div>
        </header>
        {/* Header Nav: End */}
        <div className="z-0 m-6 grid h-full grid-flow-row auto-rows-max items-center overflow-scroll p-2">
          <div className="relative grid">
            <div className="items-center py-1 text-center">
              <h3 className="bg-primary text-lg">{currentTitle}</h3>

              {/* https://stackoverflow.com/questions/62382324/react-typescript-this-jsx-tags-children-prop-expects-a-single-child-of-type */}
              {/* react fragments solve error  */}
              <>
                {listItems.length >= 1 ? (
                  listItems.map((item, index) => (
                    <div
                      className="relative z-0 mt-1 grid cursor-pointer grid-cols-4 gap-2 rounded-lg border-2 border-solid border-black bg-white p-2 font-semibold text-black hover:bg-gray-200"
                      key={index}
                    >
                      <div className="col-span-3 col-start-1">{item.title}</div>
                    </div>
                  ))
                ) : (
                  <div>No items in this list. Please add some below</div>
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListPage;
