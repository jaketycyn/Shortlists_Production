import Link from "next/link";
import React from "react";

type Props = {};

export const RankItems = (props: Props) => {
  //hardcoded list id
  const id = "clj8xczxh0001w3nowj7xixur";

  return (
    <div>
      <Link
        className=" b-4 w-1/4 border-solid border-gray-700 bg-blue-200"
        onClick={() => console.log("hiiii clicked Rank")}
        href={`/lists/${id}/ranking`}
      >
        Rank Items
      </Link>
    </div>
  );
};
