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
