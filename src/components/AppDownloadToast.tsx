import React, { useState, useRef, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// DENSE STREAM OF GOLDEN GLITTER PARTICLES: 60 particles in 12 continuous staggered batches
// Spans across the full duration of the card movement (traveling WITH the card)
interface StreamParticle {
  id: number;
  batch: number;
  fraction: number; // 0 (near toast) to 1 (near center)
  lateralOffset: number; // perpendicular spread for volume/width (-48px to +48px)
  verticalJitter: number; // slight vertical spread around card (-22px to +22px)
  size: number; // 3px to 9px
  isStar: boolean;
  spawnDelaySec: number; // staggered emission timing (0ms to ~500ms)
  upwardDrift: number; // -65px to -140px on open
  downwardDrift: number; // +65px to +140px on close
  horizontalDrift: number;
  baseRotate: number;
  spinAmount: number;
  durationSec: number;
}

// Generate a deterministic, rich swarm of 60 particles
const DENSE_PARTICLES: StreamParticle[] = (() => {
  const particles: StreamParticle[] = [];
  const totalBatches = 12;
  const particlesPerBatch = 5;

  // Curated varied values for organic visual spread
  const lateralSpreads = [-42, 14, -18, 38, -6, 28, -32, 8, 45, -24];
  const verticalSpreads = [-16, 12, -8, 18, -12, 15, -5, 20, -18, 10];
  const sizes = [4, 7, 5, 8.5, 3.5, 6, 8, 4.5, 7.5, 5];
  const drifts = [75, 110, 85, 130, 95, 120, 70, 105, 135, 90];
  const hDrifts = [-18, 22, -12, 28, -24, 15, -8, 26, -15, 20];
  const rotations = [15, -30, 45, -15, 60, -45, 20, -25, 50, -35];

  let id = 1;
  for (let b = 0; b < totalBatches; b++) {
    // Base fraction along the travel path (from 0.05 to 0.96)
    const baseFraction = 0.05 + (b / (totalBatches - 1)) * 0.91;
    // Base spawn delay: batches spaced roughly ~35ms apart over the card's ~620ms travel
    const baseDelay = b * 0.038;

    for (let p = 0; p < particlesPerBatch; p++) {
      const idx = (b * particlesPerBatch + p) % 10;
      // Slight staggered fraction within each batch
      const fractionOffset = ((p - 2) * 0.02);
      const fraction = Math.max(0.02, Math.min(0.98, baseFraction + fractionOffset));
      
      // Batch delay plus tiny sub-delay so particles don't all appear on the exact same microsecond
      const spawnDelay = baseDelay + p * 0.007;

      particles.push({
        id: id++,
        batch: b,
        fraction,
        lateralOffset: lateralSpreads[(idx + p) % lateralSpreads.length],
        verticalJitter: verticalSpreads[(idx + b) % verticalSpreads.length],
        size: sizes[(idx + p) % sizes.length],
        isStar: p % 2 === 0, // balanced 50/50 mix of 4-point stars and gleaming dots
        spawnDelaySec: spawnDelay,
        upwardDrift: -drifts[(idx + p) % drifts.length],
        downwardDrift: drifts[(idx + p) % drifts.length],
        horizontalDrift: hDrifts[(idx + p) % hDrifts.length],
        baseRotate: rotations[(idx + p) % rotations.length],
        spinAmount: p % 2 === 0 ? 45 : -40,
        durationSec: 0.58 + ((p * 7 + b * 3) % 5) * 0.04, // 0.58s to 0.74s individual lifespan
      });
    }
  }

  return particles;
})();

function FourPointStar({ size = 7 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="drop-shadow-[0_0_6px_rgba(217,197,110,0.9)]"
    >
      <defs>
        <linearGradient id="gold-star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ebe0a6" />
          <stop offset="50%" stopColor="#d9c56e" />
          <stop offset="100%" stopColor="#a89537" />
        </linearGradient>
      </defs>
      <path
        d="M12 0 C12 6.5 6.5 12 0 12 C6.5 12 12 17.5 12 24 C12 17.5 17.5 12 24 12 C17.5 12 12 6.5 12 0 Z"
        fill="url(#gold-star-grad)"
      />
    </svg>
  );
}

function GoldDot({ size = 5 }: { size?: number }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: "radial-gradient(circle, #fff3c4 0%, #d9c56e 55%, #a89537 100%)",
        boxShadow: "0 0 8px rgba(217, 197, 110, 0.85)",
      }}
      className="rounded-full"
    />
  );
}

export default function AppDownloadToast() {
  const [dismissed, setDismissed] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [flipFinished, setFlipFinished] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [startCoords, setStartCoords] = useState({ deltaX: 200, deltaY: 250, startScale: 0.18 });

  const tileRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const calculatePath = () => {
    if (tileRef.current) {
      const rect = tileRef.current.getBoundingClientRect();
      const cardSize = window.innerWidth < 640 ? 270 : 290;
      const tileCenterX = rect.left + rect.width / 2;
      const tileCenterY = rect.top + rect.height / 2;
      const cardCenterX = window.innerWidth / 2;
      // Center of modal card
      const cardCenterY = window.innerHeight / 2 - 35;

      setStartCoords({
        deltaX: tileCenterX - cardCenterX,
        deltaY: tileCenterY - cardCenterY,
        startScale: rect.width / cardSize,
      });
    }
  };

  const handleOpen = () => {
    calculatePath();
    setIsClosing(false);
    setFlipFinished(false);
    setIsEnlarged(true);
  };

  const handleClose = () => {
    if (isClosing) return;
    if (prefersReducedMotion) {
      setIsEnlarged(false);
      return;
    }

    // Step 1: Caption and badges fade out first (~150ms)
    setIsClosing(true);
    setFlipFinished(false);

    // Step 2: Card reverse flight + 3D flip starts at 150ms, runs for 620ms (until 770ms)
    // Step 3: Backdrop finishes fade out, full unmount clean-up at 950ms
    setTimeout(() => {
      setIsEnlarged(false);
      setIsClosing(false);
    }, 950);
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
  }, [isEnlarged, isClosing]);

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

      {/* Enlarged QR Code Centered Overlay with 3D Flip & DENSE Glitter Stream */}
      <AnimatePresence>
        {isEnlarged && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
            {/* Dim Backdrop fading in sync */}
            <motion.div
              className="absolute inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: isClosing ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.62,
                delay: isClosing ? 0.65 : 0,
                ease: "easeOut",
              }}
              onClick={() => {
                if (flipFinished && !isClosing) handleClose();
              }}
              aria-label="Close enlarged QR code backdrop"
            />

            {/* Modal Content Wrapper with 3D Perspective */}
            <div
              className="relative z-10 flex flex-col items-center"
              style={{ perspective: 1200 }}
            >
              {/* DENSE GOLDEN GLITTER STREAM (60 particles rising with QR on open, descending on close) */}
              {!prefersReducedMotion && (
                <div className="absolute inset-0 pointer-events-none -z-5 overflow-visible">
                  {DENSE_PARTICLES.map((p) => {
                    // Position along path from startCoords (toast) to (0, 0) (center)
                    // On OPEN: fraction goes 0 (toast) -> 1 (center)
                    // On CLOSE: returns from center (0) back to toast (deltaX, deltaY)
                    const originX = !isClosing
                      ? startCoords.deltaX * (1 - p.fraction) + p.lateralOffset
                      : startCoords.deltaX * p.fraction + p.lateralOffset;

                    const originY = !isClosing
                      ? startCoords.deltaY * (1 - p.fraction) + p.verticalJitter
                      : startCoords.deltaY * p.fraction + p.verticalJitter;

                    // Open: generous upward drift (-65px to -140px)
                    // Close: downward funnel rush (+65px to +140px)
                    const driftY = !isClosing ? p.upwardDrift : p.downwardDrift;
                    // On close, drift slightly inward toward the corner
                    const driftX = !isClosing
                      ? p.horizontalDrift
                      : p.horizontalDrift + (startCoords.deltaX > 0 ? 12 : -12);

                    const spawnDelay = (isClosing ? 0.15 : 0) + p.spawnDelaySec;

                    return (
                      <motion.div
                        key={`particle-${p.id}-${isClosing ? "close" : "open"}`}
                        className="absolute flex items-center justify-center pointer-events-none"
                        style={{
                          left: "50%",
                          top: "50%",
                          x: originX,
                          y: originY,
                        }}
                        initial={{
                          opacity: 0,
                          scale: 0.4,
                          x: originX,
                          y: originY,
                          rotate: p.baseRotate,
                        }}
                        animate={{
                          opacity: [0, 1, 0.85, 0],
                          scale: [0.45, 1.25, 0.8, 0.2],
                          x: originX + driftX,
                          y: originY + driftY,
                          rotate: p.baseRotate + p.spinAmount,
                        }}
                        transition={{
                          duration: p.durationSec,
                          delay: spawnDelay,
                          ease: [0.2, 0.8, 0.2, 1],
                        }}
                      >
                        {p.isStar ? (
                          <FourPointStar size={p.size} />
                        ) : (
                          <GoldDot size={p.size} />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Traveling & Flipping Card (Translate + Scale + RotateY) */}
              <motion.div
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        x: startCoords.deltaX,
                        y: startCoords.deltaY,
                        scale: startCoords.startScale,
                        rotateY: 90,
                        opacity: 0,
                      }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : isClosing
                    ? {
                        x: startCoords.deltaX,
                        y: startCoords.deltaY,
                        scale: startCoords.startScale,
                        rotateY: 90,
                        opacity: [1, 1, 0],
                      }
                    : {
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotateY: 0,
                        opacity: 1,
                      }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        x: startCoords.deltaX,
                        y: startCoords.deltaY,
                        scale: startCoords.startScale,
                        rotateY: 90,
                        opacity: 0,
                      }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0.2, ease: "easeOut" }
                    : {
                        duration: 0.62,
                        delay: isClosing ? 0.15 : 0, // allow caption to fade first on close
                        ease: [0.2, 0.8, 0.2, 1],
                      }
                }
                onAnimationComplete={() => {
                  if (!isClosing) {
                    setFlipFinished(true);
                  }
                }}
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transformOrigin: "center center",
                }}
                className="relative w-[270px] h-[270px] sm:w-[290px] sm:h-[290px] bg-white rounded-2xl p-5 border border-[rgba(212,175,55,0.35)] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_40px_rgba(212,175,55,0.25)]"
              >
                {/* Moving Golden Radial Glow attached to the card illuminating the stream */}
                <div
                  className="absolute inset-0 -z-10 rounded-2xl pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.08) 65%, transparent 100%)",
                    filter: "blur(22px)",
                    transform: "scale(1.25)",
                  }}
                />

                {/* Close Button on Card - active only when open and paused */}
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={!flipFinished || isClosing}
                  aria-label="Close enlarged QR code"
                  title="Close"
                  className={`absolute -top-3.5 -right-3.5 w-8 h-8 rounded-full bg-[#141416] border border-white/20 hover:border-[#d4af37]/60 text-white/80 hover:text-[#f1e7b4] flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-105 cursor-pointer z-40 ${
                    !flipFinished || isClosing
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100 pointer-events-auto"
                  }`}
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

              {/* Caption & Store Badges Below - Separated, fades in AFTER flip finishes, fades out first on close */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: flipFinished && !isClosing ? 1 : 0,
                  y: flipFinished && !isClosing ? 0 : 8,
                }}
                transition={{
                  duration: isClosing ? 0.15 : 0.2,
                  ease: "easeOut",
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
