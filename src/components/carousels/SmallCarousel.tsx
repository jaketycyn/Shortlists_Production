import React from "react";

interface CarouselProps {
  children: React.ReactNode;
}

const SmallCarousel = React.forwardRef(
  ({ children }: CarouselProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        ref={ref}
        className="scrollbar-hide flex overflow-x-auto bg-green-400"
        data-type="carousel"
      >
        {children}
      </div>
    );
  }
);

export default SmallCarousel;
