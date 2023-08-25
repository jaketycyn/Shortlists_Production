import React from "react";

interface MovieListCardProps {
  title: string;
}
const MovieListCard = ({ title }: MovieListCardProps) => {
  return (
    <div
      className="m-2 flex h-48 w-48 cursor-pointer items-center justify-center rounded-lg bg-blue-200 p-4"
      onClick={() => alert(`Clicked on ${title}`)}
    >
      {title}
    </div>
  );
};

export default MovieListCard;
