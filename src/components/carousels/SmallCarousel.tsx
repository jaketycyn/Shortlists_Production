import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselProps {
  children: React.ReactNode[];
}

const SmallCarousel = ({ children }: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionDirection, setMotionDirection] = useState(0);

  const handleNext = () => {
    setMotionDirection(1);
    setActiveIndex((prevIndex) => (prevIndex + 1) % children.length);
  };

  const handlePrev = () => {
    setMotionDirection(-1);
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
  };

  //carousel/swipe test
  // useEffect(() => {
  //   // Initialize start and end positions
  //   let startX = 0;
  //   let endX = 0;

  //   function handleStart(e: TouchEvent | MouseEvent) {
  //     if (
  //       e.target instanceof Element &&
  //       e.target.closest('[data-type="carousel"]')
  //     ) {
  //       e.preventDefault();
  //       return;
  //     }
  //     if (e instanceof TouchEvent) {
  //       startX = e.touches[0]!.clientX;
  //     } else if (e instanceof MouseEvent) {
  //       startX = e.clientX;
  //     }
  //   }

  //   function handleEnd(e: TouchEvent | MouseEvent) {
  //     if (
  //       e.target instanceof Element &&
  //       e.target.closest('[data-type="carousel"]')
  //     ) {
  //       e.preventDefault();
  //       return;
  //     }
  //     if (e instanceof TouchEvent) {
  //       endX = e.changedTouches[0]!.clientX;
  //     } else if (e instanceof MouseEvent) {
  //       endX = e.clientX;
  //     }

  //     handleSwipe(startX, endX);
  //   }
  //   function handleSwipe(startX: number, endX: number) {
  //     // define threshold as per requirement
  //     const swipeThreshold = 30; // For detecting swipe direction
  //     const tapThreshold = 5; // For distinguishing between tap and swipe

  //     const distanceMoved = Math.abs(startX - endX);

  //     if (distanceMoved <= tapThreshold) {
  //       // It's a tap, not a swipe
  //       return;
  //     }
  //     // detecting swipe left -> moving right
  //     if (startX - endX > swipeThreshold) {
  //       if (activePage < pageLimit) {
  //         // Check added here
  //         // console.log("swiped left");
  //         dispatch(incrementActivePage());
  //       }
  //     }
  //     // detecting swipe right <- moving left
  //     if (endX - startX > swipeThreshold) {
  //       if (activePage > 0) {
  //         // Check added here
  //         // console.log("swiped right");
  //         dispatch(decrementActivePage());
  //       }
  //     }
  //   }

  //   // For mobile touch
  //   window.addEventListener("touchstart", handleStart, { passive: false });
  //   window.addEventListener("touchend", handleEnd, { passive: false });
  //   // For desktop mouse drag
  //   window.addEventListener("mousedown", handleStart);
  //   window.addEventListener("mouseup", handleEnd);
  //   return () => {
  //     // Cleanup code
  //     window.removeEventListener("touchstart", handleStart);
  //     window.removeEventListener("touchend", handleEnd);
  //     window.removeEventListener("mousedown", handleStart);
  //     window.removeEventListener("mouseup", handleEnd);
  //   };
  // }, [dispatch]);

  return (
    <div className="relative flex w-full flex-row items-center justify-center overflow-hidden ">
      {/* Left Chevron - Start */}

      <button onClick={handlePrev} className="pr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      {/* Left Chevron - End */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: motionDirection === 1 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: motionDirection === 1 ? -100 : 100 }}
          transition={{ duration: 0.3 }}
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
      {/* Right Chevron - Start */}

      <button onClick={handleNext} className="pl-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
      {/* Right Chevron - End */}
    </div>
  );
};

export default SmallCarousel;
