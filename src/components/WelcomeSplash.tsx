import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeSplash() {
  const [showSplash, setShowSplash] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  // Monitor font-loading with a hard 300ms timeout
  useEffect(() => {
    let active = true;

    const timer = setTimeout(() => {
      if (active) {
        setFontsReady(true);
      }
    }, 300);

    if (document.fonts && typeof document.fonts.ready !== "undefined") {
      document.fonts.ready
        .then(() => {
          if (active) {
            clearTimeout(timer);
            setFontsReady(true);
          }
        })
        .catch(() => {
          if (active) {
            clearTimeout(timer);
            setFontsReady(true);
          }
        });
    } else {
      setFontsReady(true);
    }

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    console.info("[evia] splash start");
    document.body.style.overflow = "hidden";

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = mediaQuery.matches;
    setPrefersReducedMotion(reduce);

    // Synchronize exit with the precision requestAnimationFrame-checked clock
    const handleExit = () => {
      document.documentElement.classList.remove("splash-run");
      window.dispatchEvent(new CustomEvent("evia:splash-done"));
      console.info("[evia] splash done received via rAF");
    };

    const handleUnmount = () => {
      setShowSplash(false);
    };

    window.addEventListener("evia:splash-exit", handleExit);
    window.addEventListener("evia:splash-unmount", handleUnmount);

    // Absolute fallback failsafe timer
    const failsafeTimer = setTimeout(() => {
      setShowSplash(false);
      document.documentElement.classList.remove("splash-run");
      window.dispatchEvent(new CustomEvent("evia:splash-done"));
    }, 2600);

    return () => {
      window.removeEventListener("evia:splash-exit", handleExit);
      window.removeEventListener("evia:splash-unmount", handleUnmount);
      clearTimeout(failsafeTimer);
      document.body.style.overflow = "";
      document.documentElement.classList.remove("splash-run");
    };
  }, []);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="welcome-splash-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="splash-overlay"
          style={{ pointerEvents: showSplash ? "auto" : "none" }}
        >
          {/* Main Content Container with font loading opacity protection */}
          <div
            className="relative w-full h-full"
            style={{
              opacity: fontsReady ? 1 : 0,
              transition: "opacity 0.18s ease-out",
            }}
          >
            {/* 1. Centered Heading (Absolute top: 50%, left: 50%, transform translate) */}
            <motion.h1
              id="splash-heading"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              animate={fontsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
              transition={{ duration: prefersReducedMotion ? 0.3 : 0.6, ease: "easeOut" }}
              className="font-sans font-bold text-4xl md:text-6xl lg:text-8xl tracking-tight select-none flex flex-col gap-1"
            >
              <span className="bg-gradient-to-b from-[#f6e7b4] via-[#d4af37] to-[#a8862a] bg-clip-text text-transparent leading-[1.1] pb-1 block">
                Welcome to
              </span>
              <span className="bg-gradient-to-b from-[#f6e7b4] via-[#d4af37] to-[#a8862a] bg-clip-text text-transparent leading-[1.1] pb-1 block">
                Evia Wealth
              </span>
            </motion.h1>

            {/* 2. Glow Lines Container (Relative alignment handled via calc in CSS) */}
            <div id="splash-glow-container" className="w-[280px] sm:w-[350px] md:w-[600px] h-28">
              {/* Gradients */}
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent h-[2px] w-3/4 blur-sm mx-auto" />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent h-px w-3/4 mx-auto" />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-[#f6e7b4] to-transparent h-[5px] w-1/4 blur-sm mx-auto" />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-[#f6e7b4] to-transparent h-px w-1/4 mx-auto" />

              {/* Radial Mask overlay to prevent edges from sticking out */}
              <div
                className="absolute inset-0 w-full h-full bg-black pointer-events-none"
                style={{
                  maskImage: "radial-gradient(350px 200px at top, transparent 20%, white)",
                  WebkitMaskImage: "radial-gradient(350px 200px at top, transparent 20%, white)",
                }}
              />
            </div>

            {/* 3. Subline (Relative alignment handled via calc in CSS) */}
            <motion.p
              id="splash-subline"
              initial={{ opacity: 0 }}
              animate={fontsReady ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.5, duration: 0.5, ease: "easeOut" }}
              className="text-[#d9cfae] text-xs md:text-sm tracking-[0.25em] uppercase select-none"
            >
              Your trusted wealth partner
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
