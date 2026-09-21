import React, { useRef, useState, useEffect, useCallback } from "react";

export interface CircularArcTransitionProps {
  /** The section content being transitioned away from (pinned underneath) */
  outgoingContent: React.ReactNode;
  /** The incoming section content that appears on the solid black background */
  incomingContent: React.ReactNode;
  /** Background styling for the outgoing section (default solid dark neutral) */
  outgoingBg?: string;
  /** Total scroll track height that controls scrub duration (default '280vh') */
  trackHeight?: string;
  /** Multiplier for circle size relative to viewport (for gentle arc curvature, default 2.2) */
  circleMultiplier?: number;
  /** Implementation technique: 'scaled-circle' | 'clip-path' (default 'scaled-circle') */
  technique?: "scaled-circle" | "clip-path";
  /** Controlled progress (0.0 to 1.0) when used in inspector/demo mode, overrides scroll */
  forcedProgress?: number | null;
  /** Optional callback for scroll scrub progress (0.0 to 1.0) */
  onProgressChange?: (progress: number) => void;
  /** Optional custom class name */
  className?: string;
  /** Optional element id attribute for anchor navigation */
  id?: string;
  /** Shows a minimal status HUD in bottom corner */
  showDebugBadge?: boolean;
}

/**
 * CircularArcTransition
 * 
 * Implements the Dezerv.in section transition:
 * - A 100% solid, flat, opaque black filled shape (#000000).
 * - No strokes, no borders, no glow, no gradients, no green.
 * - At progress = 0: shape is 100% off-screen below the viewport.
 * - As progress increases: the curved top edge rises upward across the screen,
 *   progressively masking and covering everything beneath it in solid black.
 * - At progress >= 0.70: the solid black shape completely fills the entire viewport.
 * - From progress 0.70 to 1.00: incoming section content reveals on top of the solid black.
 * - Direct 1:1 scroll scrub binding.
 */
export default function CircularArcTransition({
  outgoingContent,
  incomingContent,
  outgoingBg = "bg-[#0c0c10]",
  trackHeight = "280vh",
  circleMultiplier = 2.2,
  technique = "scaled-circle",
  forcedProgress = null,
  onProgressChange,
  className = "",
  id,
  showDebugBadge = false,
}: CircularArcTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportSize, setViewportSize] = useState({ width: 1440, height: 900 });

  // Update viewport dimensions
  const updateDimensions = useCallback(() => {
    if (typeof window !== "undefined") {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Scroll scrub handler (only active when not in forced progress mode)
  useEffect(() => {
    if (forcedProgress !== null) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const scrollableDistance = rect.height - windowHeight;

          if (scrollableDistance <= 0) {
            ticking = false;
            return;
          }

          const scrolled = -rect.top;
          const raw = scrolled / scrollableDistance;
          const clamped = Math.min(Math.max(raw, 0), 1);

          setScrollProgress(clamped);
          onProgressChange?.(clamped);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [forcedProgress, onProgressChange]);

  const progress = forcedProgress !== null ? Math.min(Math.max(forcedProgress, 0), 1) : scrollProgress;

  // Viewport geometry
  const W = viewportSize.width || 1440;
  const H = viewportSize.height || 900;
  const maxDim = Math.max(W, H);

  // Circle dimensions: diameter is significantly wider than viewport (e.g. 2.2x)
  // so the visible top edge reads as a gentle, smooth arc spanning across the entire screen
  const circleDiameter = Math.round(maxDim * circleMultiplier);
  const R = circleDiameter / 2;
  const halfW = W / 2;

  // Sagitta: the vertical crown height from screen edges (x = 0, W) to arc apex (x = W/2)
  // sagitta = R - sqrt(R^2 - (W/2)^2)
  const sagitta = R - Math.sqrt(Math.max(R * R - halfW * halfW, 0));

  // --- TIMELINE PHASES ---
  // Phase 1 (Progress 0.00 -> 0.70): The black circle rises from below until it fully covers all 4 corners
  // Phase 2 (Progress 0.70 -> 1.00): Viewport is 100% solid black; incoming content fades & rises in

  const arcNorm = Math.min(progress / 0.70, 1);

  // Vertical position for Technique B (scaled-circle):
  // At progress = 0: apex is at y = H + 2 (completely off-screen below viewport)
  // At progress = 0.70: apex has risen to y = -sagitta - 20 (both top corners at x=0 and x=W are covered)
  const yStart = H + 2;
  const yEnd = -sagitta - 20;
  const circleTopPx = yStart + (yEnd - yStart) * arcNorm;

  // For Technique A (clip-path circle):
  // Radius grows from 0% at progress 0, up to 160% (enough to cover entire rectangle from bottom center)
  // Distance from (50%, 100%) to top corners (0,0) is sqrt(50^2 + 100^2)% = 111.8%
  const clipRadiusPercent = arcNorm * 155;

  // Incoming content opacity & rise: starts once arc is 95% complete (progress 0.68)
  const contentNorm = Math.min(Math.max((progress - 0.68) / 0.30, 0), 1);
  const contentOpacity = contentNorm;
  const contentTranslateY = Math.round((1 - contentNorm) * 30);

  // Descriptive phase status
  let phaseLabel = "0% • Shape Off-screen (Outgoing Visible)";
  if (progress > 0.02 && progress < 0.68) {
    phaseLabel = `${Math.round(progress * 100)}% • Solid Black Arc Rising (${Math.round(arcNorm * 100)}% coverage)`;
  } else if (progress >= 0.68 && progress < 0.98) {
    phaseLabel = `${Math.round(progress * 100)}% • Solid Blackout • Revealing Content`;
  } else if (progress >= 0.98) {
    phaseLabel = "100% • Transition Complete (Incoming Active)";
  }

  return (
    <div
      ref={containerRef}
      id={id}
      style={{ height: forcedProgress !== null ? "100vh" : trackHeight }}
      className={`relative w-full ${className}`}
    >
      {/* Pinned Sticky Viewport Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* ================================================================= */}
        {/* LAYER 1: OUTGOING SECTION (Pinned underneath, solid & static)    */}
        {/* ================================================================= */}
        <div
          className={`absolute inset-0 w-full h-full ${outgoingBg} z-10 overflow-hidden select-auto`}
          style={{
            // Keep completely static; it gets masked/covered by the solid black shape above it
            pointerEvents: progress > 0.65 ? "none" : "auto",
          }}
        >
          {outgoingContent}
        </div>

        {/* ================================================================= */}
        {/* LAYER 2: THE SOLID BLACK FILLED SHAPE (#000000)                   */}
        {/* No strokes, no borders, no glow, no gradients, 100% opaque black  */}
        {/* ================================================================= */}
        {technique === "scaled-circle" ? (
          <div className="absolute inset-0 w-full h-full z-20 overflow-hidden pointer-events-none">
            <div
              style={{
                width: `${circleDiameter}px`,
                height: `${circleDiameter}px`,
                backgroundColor: "#000000",
                borderRadius: "50%",
                position: "absolute",
                left: "50%",
                top: `${circleTopPx}px`,
                transform: "translateX(-50%)",
                willChange: "top",
              }}
            />
          </div>
        ) : (
          <div
            className="absolute inset-0 w-full h-full z-20 pointer-events-none"
            style={{
              backgroundColor: "#000000",
              clipPath: `circle(${clipRadiusPercent}% at 50% 100%)`,
              WebkitClipPath: `circle(${clipRadiusPercent}% at 50% 100%)`,
              willChange: "clip-path",
            }}
          />
        )}

        {/* ================================================================= */}
        {/* LAYER 3: INCOMING SECTION (Appears on top of solid black)         */}
        {/* ================================================================= */}
        <div
          className="absolute inset-0 w-full h-full z-30 flex items-center justify-center pointer-events-none"
          style={{
            opacity: contentOpacity,
            transform: `translate3d(0, ${contentTranslateY}px, 0)`,
            pointerEvents: contentNorm > 0.7 ? "auto" : "none",
            willChange: "opacity, transform",
          }}
        >
          {incomingContent}
        </div>

        {/* Status HUD (Optional) */}
        {showDebugBadge && (
          <div className="absolute bottom-6 right-6 z-40 bg-black/90 border border-white/20 px-4 py-2 rounded-xl text-xs font-mono shadow-2xl flex items-center gap-3 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#cdb864] animate-pulse" />
            <span className="text-[#ebe0a6] font-bold">
              Progress: {Math.round(progress * 100)}%
            </span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-300 text-[11px] font-sans">
              {phaseLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
