import React from "react";

interface CarouselProps {
  children: React.ReactNode;
}

const SmallCarousel = ({ children }: CarouselProps) => {
  return <div className="flex h-1/3 w-full overflow-x-scroll">{children}</div>;
};

export default SmallCarousel;
