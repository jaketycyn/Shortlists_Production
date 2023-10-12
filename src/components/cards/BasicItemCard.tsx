import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setActiveList, setListsLoading } from "../../slices/listSlice";
import ConfirmationModal from "../modals/ConfirmationModal";
import ProgressToast from "../toasts/ProgressToast";
import { set } from "cypress/types/lodash";
import AddItem from "../AddItem";
import Link from "next/link";

// abusing null/undefined for now will need to fix later

type ListType = {
  id: string;
  title?: string | null;
  category?: string | null | undefined;
  userId: string;
  coverImage: string | null | undefined;
  parentListId?: string | null;
  parentListUserId?: string | null;
  createdAt: Date;
};

type ItemType = {
  id: string;
  title: string;
  userId: string;
  listId: string;
  archive?: string | null | undefined;
  createdAt: Date;
  currentRank?: number;
  potentialRank?: number;
  album?: string | null;
  artist?: string | null;
  genre?: string | null;
  label?: string | null;
  year?: number | null;
  bucket?: string | null;
  director?: string | null;
};

interface BasicItemCardProps {
  title: string;
  index: number;
  items?: ItemType[];
  lists: ListType[];
}

const BasicItemCard = ({
  title,
  index,
  items = [],
  lists,
}: BasicItemCardProps) => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isToastVisible, setToastVisible] = useState(false);
  const [isAddItemModalOpen, setAddItemModalOpen] = useState(false);
  const currentList = lists!.find((list) => list.title === title);
  const backgroundImage = currentList ? currentList.coverImage || "" : "";

  //console.log("currentList: ", currentList);

  // Function to filter items based on listId
  const filterItemsByList = (listId: string) => {
    const filteredItems = items!.filter((item) => item.listId === listId);
    return filteredItems.map((item) => item.title).join(", ");
  };

  const handleClick = () => {
    if (currentList) {
      setModalOpen(true);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // set an Active List in Redux/local storage
  // gets used by ListHeader.tsx to display the title of the list
  const setActiveListFunction = async (activeList: List) => {
    //console.log("activeList: ", activeList);
    await dispatch(setActiveList(activeList));
  };

  // can later change this call to be more efficient
  const { refetch } = trpc.userList.getLists.useQuery();

  const { mutateAsync: mutateAsyncCopyFeatureList } =
    trpc.userList.copyList.useMutation();

  const handleAddList = async () => {
    setConfirmOpen(true);
    if (isConfirmOpen) {
      const currentListItems = items.filter(
        (i) => i.listId === currentList?.id
      );

      if (currentList) {
        try {
          const data = {
            userId: session!.user!.id,
            parentListUserId: currentList.userId!,
            listId: currentList.id!,
            listTitle: currentList.title!,
            items: currentListItems,
            category: currentList.category!,
          };
          //process data
          const result = await mutateAsyncCopyFeatureList(data);
          refetch();
          //show toast
          setToastVisible(true);
          dispatch(setListsLoading(true));
          //close modal & cleanup
          setTimeout(() => {
            setModalOpen(false);
            setToastVisible(false);
          }, 1000);

          console.log("data: ", data);
        } catch (error) {
          console.error("Failed to copy list", error);
        }
      }

      // You can place code here that would handle the actual database operations
    }
  };

  const defaultColors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-400",
    "bg-pink-400",
  ];
  const defaultColorClass = defaultColors[index % defaultColors.length];
  return (
    <div
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={`${
        backgroundImage === "" || backgroundImage === "undefined"
          ? defaultColorClass
          : ""
      } relative flex h-[35vw] w-full items-center justify-center rounded-lg md:h-[25vw] lg:h-[20vw]`}
    >
      <div className="absolute inset-0 rounded-lg bg-black opacity-20"></div>
      <p
        className="truncate-2-lines font-inter relative z-10 w-full px-4 py-2 text-center text-xl font-semibold leading-relaxed tracking-wider text-white"
        onClick={handleClick}
      >
        {title}
      </p>

      {isModalOpen && (
        <div>
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-70"
            onClick={handleClose}
          >
            {/* Progress Toast - Start */}

            {/* Progress Toast - End */}
            <div
              className="absolute left-1/2 top-1/2 h-4/5 w-4/5 -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto bg-white p-5"
              onClick={stopPropagation}
            >
              <div className="flex w-full flex-col items-center justify-center ">
                <h2 className="pb-2 text-center text-2xl font-bold">{title}</h2>
                <div className="relative z-50 flex w-full flex-col items-center justify-center bg-opacity-40">
                  <ProgressToast
                    message="Adding List"
                    visible={isToastVisible}
                  />
                </div>
                <div className="flex flex-row gap-10 pb-4">
                  <button
                    className="w-32 rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    onClick={() => setConfirmOpen(true)}
                    data-testid="add-list-button"
                  >
                    + Copy List
                  </button>

                  <div className="mx-auto flex w-20 items-center justify-center rounded-md border-2 bg-orange-400 text-center text-lg text-white">
                    <Link
                      href={`/lists/${encodeURIComponent(currentList!.id)}`}
                      key={index}
                      passHref
                      onClick={() => setActiveListFunction(currentList!)}
                    >
                      <button
                        onClick={() =>
                          console.log("go into list", currentList!.id)
                        }
                      >
                        Rank
                      </button>
                    </Link>
                  </div>
                  <ConfirmationModal
                    title="Confirmation"
                    message="Are you sure you want to add this list?"
                    onConfirm={handleAddList}
                    onCancel={() => console.log("cancelled")}
                    isOpen={isConfirmOpen}
                    setIsOpen={setConfirmOpen}
                  />

                  {/* //TODO add in share button feature in the future */}
                  {/* <button className="w-32 rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                  Share
                </button> */}
                </div>

                <ul className="w-full space-y-1 ">
                  {items
                    ? items
                        .filter((item) => item.listId === currentList?.id)
                        .map((item) => (
                          <div key={item.id} className="w-full grow-0 ">
                            <li className="rounded-lg border  border-gray-300 bg-zinc-200 p-2 text-center font-semibold">
                              {item.title}
                            </li>
                          </div>
                        ))
                    : null}
                </ul>

                {/* Add Item Modal - Start */}
                <div
                  className={`${
                    isAddItemModalOpen ? "h-40" : "h-0"
                  }   transition-height fixed bottom-0 w-full overflow-hidden bg-white  shadow-lg duration-300 ease-in-out`}
                >
                  <AddItem listId={currentList!.id} />
                </div>
                {/* Circular Button - Bot Right Corner*/}
                <button
                  onClick={() => setAddItemModalOpen(!isAddItemModalOpen)}
                  className={` ${
                    isAddItemModalOpen
                      ? "h-12 w-12 rounded-full  bg-red-400  "
                      : "h-12 w-32 rounded-xl bg-green-700"
                  } fixed bottom-[56px] right-4 flex items-center  justify-center text-lg text-white shadow-lg`}
                >
                  {isAddItemModalOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-1">Add Item</span>
                    </div>
                  )}
                </button>
                {/* Add Item Modal - End */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicItemCard;
