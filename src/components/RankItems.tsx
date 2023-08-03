import Link from "next/link";
import React from "react";

export const RankItems = () => {
  //hardcoded list id
  const id = "clkcahtw50001w3443i6p25ko";

  return (
    <div>
      <Link
        className=" b-4 w-1/4 border-solid border-gray-700 bg-blue-200"
        onClick={() => console.log("hiiii clicked Rank")}
        href={`/lists/ranking`}
      >
        Rank Items
      </Link>
    </div>
  );
};
