import React, { useState } from "react";

type ListType = {
  id: string;
  title: string;
  category: string;
  userId: string;
  img: string;
};

type ItemType = {
  title: string;
  id: string;
  userId: string;
  listId: string;
};

interface FeaturedItemCardProps {
  title: string;
  index: number;
  featuredItems: ItemType[];
  featuredLists: ListType[];
}

// alternating colors for the cards
//   const colors = [
//     "bg-red-300",
//     "bg-blue-300",
//     "bg-yellow-300",
//     "bg-green-300",
//     "bg-indigo-300",
//     "bg-purple-300",
//   ];

//   const bgColor = colors[index % 6];

const filterItemsBylist = () => {};

const FeaturedItemCard = ({
  title,
  index,
  featuredItems,
  featuredLists,
}: FeaturedItemCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const listWithImage = featuredLists.find((list) => list.title === title);
  const backgroundImage = listWithImage ? listWithImage.img : "";

  // Function to filter items based on listId
  const filterItemsByList = (listId: string) => {
    const filteredItems = featuredItems.filter(
      (item) => item.listId === listId
    );
    return filteredItems.map((item) => item.title).join(", ");
  };

  const handleClick = () => {
    if (listWithImage) {
      setModalOpen(true);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
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
                <div>+ Add List</div>
                <div>Share</div>
              </div>
              <h2 className="text-center">{`Items belonging to List: ${title}`}</h2>
              <ul>
                {featuredItems
                  .filter((item) => item.listId === listWithImage?.id)
                  .map((item) => (
                    <li key={item.id}>{item.title}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedItemCard;
