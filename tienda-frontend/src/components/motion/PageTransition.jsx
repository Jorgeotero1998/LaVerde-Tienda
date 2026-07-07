import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

const pageVariants = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(4px)" },
};

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();
  const variants = reduced ? reducedVariants : pageVariants;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname + location.search}
        className="page-transition-wrap"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: reduced ? 0.15 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
