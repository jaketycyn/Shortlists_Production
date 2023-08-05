import Link from "next/link";
import React from "react";

export const RankItems = () => {
  return (
    <div>
      <Link
        className=""
        onClick={() => console.log("hiiii clicked Rank")}
        href={`/lists/ranking`}
      >
        Rank Items
      </Link>
    </div>
  );
};
