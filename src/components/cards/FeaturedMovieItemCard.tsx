import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setListsLoading } from "../../slices/listSlice";
import ConfirmationModal from "../modals/ConfirmationModal";
import ProgressToast from "../toasts/ProgressToast";

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

interface FeaturedItemCardProps {
  title: string;
  index: number;
  featuredItems?: ItemType[];
  featuredLists: ListType[];
}

const FeaturedMovieItemCard = ({
  title,
  index,
  featuredItems = [],
  featuredLists,
}: FeaturedItemCardProps) => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isToastVisible, setToastVisible] = useState(false);
  const currentList = featuredLists!.find((list) => list.title === title);
  const backgroundImage = currentList ? currentList.coverImage : "";

  // Function to filter items based on listId
  const filterItemsByList = (listId: string) => {
    const filteredItems = featuredItems!.filter(
      (item) => item.listId === listId
    );
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

  const { refetch } = trpc.userList.getLists.useQuery();

  const { mutateAsync: mutateAsyncCopyFeatureList } =
    trpc.userList.shareList.useMutation();

  const handleAddList = async () => {
    setConfirmOpen(true);
    if (isConfirmOpen) {
      const currentListItems = featuredItems.filter(
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

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative flex h-[35vw] w-full items-center justify-center rounded-lg md:h-[25vw] lg:h-[20vw]"
    >
      <div className="absolute inset-0 rounded-lg bg-black opacity-50"></div>
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
                    + Add List
                  </button>

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
                  {featuredItems
                    ? featuredItems
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedMovieItemCard;
