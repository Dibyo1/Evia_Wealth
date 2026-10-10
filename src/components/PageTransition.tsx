import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PageTransitionProps {
  children: ReactNode;
  routeKey: string;
}

/**
 * PageTransition provides an animated exit and enter transition across routes:
 * 1. Exit: opacity 1 -> 0, scale 1 -> 0.98, translateY(0) -> translateY(-4px), ~220ms, easeInOut
 * 2. Enter: starts at opacity 0, scale 0.98, translateY(4px) -> opacity 1, scale 1, translateY(0), ~350ms, easeOut
 * Cross-fade with mode="wait" to prevent layout jumps or flashes.
 */
export default function PageTransition({ children, routeKey }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, scale: 0.98, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -4 }}
        transition={{
          duration: 0.32,
          ease: [0.22, 1, 0.36, 1], // premium easeOut / easeInOut curve
        }}
        className="w-full relative"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
