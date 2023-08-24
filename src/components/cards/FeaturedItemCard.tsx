import React from "react";

interface FeaturedItemCard {
  title: string;
  index: number;
}

const images = [
  "https://parade.com/.image/c_limit%2Ccs_srgb%2Cq_auto:good%2Cw_620/MTk3MzM3ODU4NTU2NTY4Nzc1/marveldisney.webp",
  "https://media.newyorker.com/photos/5cae6ad5671c64058676f05c/master/w_2560%2Cc_limit/Larson-GameofThronesPreview.jpg",
  "https://assets.teenvogue.com/photos/637e51fbebf13d8100c6e3a0/4:3/w_2608,h_1956,c_limit/163644955",
  "https://img.buzzfeed.com/buzzfeed-static/complex/images/fcy36om1zuyfqaq3wbu0/best-nba-players-ever.jpg",
];

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

const FeaturedItemCard = ({ title, index }: FeaturedItemCard) => {
  const backgroundImage = images[index % images.length];
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative m-2 flex h-20 w-40 items-center justify-center rounded-lg"
    >
      <div className="absolute inset-0 rounded-lg bg-black opacity-50"></div>
      <p
        className="truncate-2-lines font-inter relative z-10 w-full text-center text-lg font-semibold text-white"
        onClick={() => alert(title)}
      >
        {title}
      </p>
    </div>
  );
};

export default FeaturedItemCard;
