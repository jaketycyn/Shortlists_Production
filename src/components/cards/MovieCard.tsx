import React from "react";

interface MovieCardProps {
  children: React.ReactNode;
}

const MovieCard = ({ children }: MovieCardProps) => {
  return <div className="flex h-1/3 w-full overflow-x-scroll">{children}</div>;
};

export default MovieCard;
