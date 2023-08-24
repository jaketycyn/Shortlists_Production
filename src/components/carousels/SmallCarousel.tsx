import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselProps {
  children: React.ReactNode[];
}

const SmallCarousel = ({ children }: CarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % children.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative flex w-full flex-row items-center justify-center overflow-hidden bg-green-400">
      <button onClick={handlePrev} className="pr-4">
        Prev
      </button>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {children[activeIndex]}
        </motion.div>
      </AnimatePresence>
      <button onClick={handleNext} className="pl-4">
        Next
      </button>
    </div>
  );
};

export default SmallCarousel;
