import { list } from "postcss";
import React, { useState } from "react";
import { trpc } from "../../utils/trpc";

// abusing null/undefined for now will need to fix later

type ListType = {
  id: string | null;
  title: string | null;
  category: string | null;
  userId: string | null;
  coverImage: string | null;
};

type ItemType = {
  id: string;
  title: string;
  userId: string;
  listId: string;
  archive?: string | null;
  currentRank?: number;
  potentialRank?: number;
  album?: string | null | undefined;
  artist?: string | null | undefined;
  genre?: string | null | undefined;
  label?: string | null | undefined;
  year?: number | null | undefined;
  bucket?: string | null | undefined;
  director?: string | null | undefined;
};

interface FeaturedItemCardProps {
  title: string | null;
  index: number | null;
  featuredItems?: ItemType[];
  featuredLists: ListType[];
}

const FeaturedItemCard = ({
  title,
  index,
  featuredItems,
  featuredLists,
}: FeaturedItemCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
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

  const { mutateAsync: mutateAsyncCopyFeatureList } =
    trpc.userList.shareList.useMutation();

  const handleAddList = (list: any) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to add a new list?"
    );

    if (isConfirmed) {
      // Mock targeting a database
      console.log("New list has been added.");
      console.log("list", list);

      console.log(
        "finding Items belonging to current list: ",
        filterItemsByList(list.id)
      );

      if (currentList) {
        const newList = {
          id: list.id,
          title: list.title,
          category: list.category,
          userId: list.userId,
          coverImage: list.coverImage,
          items: filterItemsByList(list.id),
        };
        console.log("newList: ", newList);
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
        className="truncate-2-lines font-inter relative z-10 w-full text-center text-lg font-semibold text-white"
        onClick={handleClick}
      >
        {title}
      </p>
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
          }}
          onClick={handleClose}
        >
          <div
            style={{
              width: "80%",
              height: "80%",
              position: "absolute",
              top: "10%",
              left: "10%",
              backgroundColor: "white",
              overflowY: "auto",
              padding: "20px",
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-row gap-10">
                <button
                  className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  onClick={() => handleAddList(currentList)}
                >
                  + Add List
                </button>
                <button className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                  Share
                </button>
              </div>
              <h2 className="text-center">{`Items belonging to List: ${title}`}</h2>
              <ul>
                {featuredItems
                  ? featuredItems
                      .filter((item) => item.listId === currentList?.id)
                      .map((item) => <li key={item.id}>{item.title}</li>)
                  : null}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedItemCard;
