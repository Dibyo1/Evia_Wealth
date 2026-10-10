import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AppDownloadToast() {
  const [dismissed, setDismissed] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const tileRef = useRef<HTMLButtonElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [transformState, setTransformState] = useState({
    deltaX: 0,
    deltaY: 0,
    scale: 0.2,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const calculateTransform = () => {
    if (tileRef.current) {
      const rect = tileRef.current.getBoundingClientRect();
      const cardSize = window.innerWidth < 640 ? 270 : 290;
      const tileCenterX = rect.left + rect.width / 2;
      const tileCenterY = rect.top + rect.height / 2;
      const cardCenterX = window.innerWidth / 2;
      // Account for the modal flex container centering both the card and the caption
      const cardCenterY = window.innerHeight / 2 - 35;

      setTransformState({
        deltaX: tileCenterX - cardCenterX,
        deltaY: tileCenterY - cardCenterY,
        scale: rect.width / cardSize,
      });
    }
  };

  const handleOpen = () => {
    calculateTransform();
    setIsEnlarged(true);
  };

  const handleClose = () => {
    calculateTransform();
    setIsEnlarged(false);
  };

  useEffect(() => {
    if (!isEnlarged) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEnlarged]);

  const cardAnimProps = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2, ease: "easeOut" as const },
      }
    : {
        initial: {
          x: transformState.deltaX,
          y: transformState.deltaY,
          scale: transformState.scale,
          opacity: 0.95,
        },
        animate: {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
        },
        exit: {
          x: transformState.deltaX,
          y: transformState.deltaY,
          scale: transformState.scale,
          opacity: 0,
        },
        transition: {
          duration: 0.5,
          ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
        },
      };

  if (dismissed) return null;

  return (
    <>
      <aside
        aria-label="Evia Wealth Mobile App"
        className="fixed bottom-5 right-5 z-40 w-[310px] bg-[#0f0f12]/95 backdrop-blur-xl border border-white/12 rounded-2xl p-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 group"
      >
        {/* Close button overlapping top-right */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#18181b] border border-white/20 text-neutral-400 hover:text-white flex items-center justify-center transition-colors shadow-md hover:scale-105 cursor-pointer"
          title="Dismiss notice"
          aria-label="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-3">
          {/* Clickable QR Code Tile */}
          <button
            ref={tileRef}
            type="button"
            onClick={handleOpen}
            aria-label="Click to enlarge QR code to scan"
            title="Click to enlarge QR code"
            className="shrink-0 w-[56px] h-[56px] bg-white rounded-xl p-1 flex flex-col items-center justify-center shadow-inner overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
          >
            <img
              src="/images/qr-code.png"
              alt="Scan to download Evia Wealth mobile app"
              className={`w-full h-full object-contain select-none pointer-events-none transition-opacity duration-200 ${
                isEnlarged ? "opacity-30" : "opacity-100"
              }`}
              loading="eager"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith(".svg")) {
                  target.src = "/images/qr-code.svg";
                }
              }}
            />
          </button>

          {/* Info Column */}
          <div className="flex-1 min-w-0">
            <h4 className="text-[12px] font-semibold text-white leading-tight mb-0.5 line-clamp-2">
              Track all your investments in one place
            </h4>
            <p className="text-[10px] text-neutral-400 mb-2">
              Download Evia Wealth App
            </p>

            <div className="flex items-center gap-1.5">
              <a
                href="https://play.google.com/store/apps/details?id=com.tvs.investwell"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] font-medium tracking-wide text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 px-2 py-0.5 rounded-sm border border-white/5 hover:border-white/20 transition-colors cursor-pointer"
              >
                Google Play
              </a>
              <span className="text-[9px] font-medium tracking-wide text-neutral-300 bg-neutral-800/80 px-2 py-0.5 rounded-sm border border-white/5">
                App Store
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Enlarged QR Code Centered Overlay */}
      <AnimatePresence>
        {isEnlarged && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
            {/* Dim Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.45,
                ease: "easeOut",
              }}
              onClick={handleClose}
              aria-label="Close enlarged QR code backdrop"
            />

            {/* Modal Content */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Animated White Card */}
              <motion.div
                {...cardAnimProps}
                style={{ transformOrigin: "center center" }}
                className="relative w-[270px] h-[270px] sm:w-[290px] sm:h-[290px] bg-white rounded-2xl p-5 border border-[rgba(212,175,55,0.35)] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_40px_rgba(212,175,55,0.22)]"
              >
                {/* Close Button on Card */}
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close enlarged QR code"
                  title="Close"
                  className="absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-[#141416] border border-white/20 hover:border-[#d4af37]/60 text-white/80 hover:text-[#f1e7b4] flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-105 cursor-pointer z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                <img
                  src="/images/qr-code.png"
                  alt="Evia Wealth App QR Code"
                  className="w-full h-full object-contain select-none pointer-events-none"
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith(".svg")) {
                      target.src = "/images/qr-code.svg";
                    }
                  }}
                />
              </motion.div>

              {/* Caption & Store Badges Below */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{
                  duration: prefersReducedMotion ? 0.2 : 0.35,
                  delay: prefersReducedMotion ? 0 : 0.12,
                }}
                className="mt-4 flex flex-col items-center text-center select-none"
              >
                <p className="text-[15px] font-semibold text-white tracking-tight font-['Poppins'] mb-2">
                  Scan to download the Evia Wealth App
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.tvs.investwell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-medium tracking-wide text-neutral-300 hover:text-white bg-neutral-900/90 hover:bg-neutral-800 px-2.5 py-1 rounded-md border border-white/10 hover:border-[#d4af37]/40 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    Google Play
                  </a>
                  <span className="text-[10px] font-medium tracking-wide text-neutral-300 bg-neutral-900/90 px-2.5 py-1 rounded-md border border-white/10 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    App Store
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
