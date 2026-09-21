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

  // --- RESPONSIVE GEOMETRY FOR PREMIUM SHALLOW CURVATURE ---
  // On desktop (landscape): width 180vw, height 120vh keeps the dome extremely wide and shallow
  // On mobile (portrait): width 320vw, height 140vh prevents vertical squishing of the arc
  const isMobile = W < 768;
  const domeWidthVw = isMobile ? 320 : 180;
  const domeHeightVh = isMobile ? 140 : 120;

  // Convert responsive units to precise pixels for inline style safety
  const domeWidthPx = Math.round((domeWidthVw * W) / 100);
  const domeHeightPx = Math.round((domeHeightVh * H) / 100);

  // --- MATHEMATICAL VIEWPORT COVERAGE CALCULATION ---
  // To cover the top corners of the screen (x = W/2, y = 0) with the curved ellipse,
  // we use the ellipse formula: (x/a)^2 + (y/b)^2 = 1.
  // Solving for the lowest y position of the dome base to completely black out the viewport:
  const coverageRatio = Math.sqrt(Math.max(0, 1 - Math.pow(100 / domeWidthVw, 2)));
  const domeTopEndPx = Math.round(domeHeightPx * (coverageRatio - 1) - (H * 0.05)); // Include 5vh overshoot margin

  // --- PHYSICAL MOVEMENT INTERPOLATION ---
  // Map progress (0.0 -> 0.70) to the active sweep phase.
  const arcNorm = Math.min(progress / 0.70, 1);
  
  // Custom cubic ease-in-out curve for natural, expensive physical momentum (no sudden jumps/bounces)
  const easedArcProgress = arcNorm < 0.5
    ? 4 * arcNorm * arcNorm * arcNorm
    : 1 - Math.pow(-2 * arcNorm + 2, 3) / 2;

  // Compute precise pixel positions for the dome
  const domeTopPx = Math.round(H + (domeTopEndPx - H) * easedArcProgress);

  // Soft atmospheric glow immediately above the curved edge (shifted up by 3.5% H on desktop, 5% on mobile)
  const glowOffsetPx = Math.round(isMobile ? (H * 0.05) : (H * 0.035));
  const glowTopPx = domeTopPx - glowOffsetPx;

  // Incoming content opacity & rise: starts once arc is 95% complete (progress 0.68)
  const contentNorm = Math.min(Math.max((progress - 0.68) / 0.30, 0), 1);
  const easedContentNorm = contentNorm * contentNorm * (3 - 2 * contentNorm); // Smoothstep
  const contentOpacity = easedContentNorm;
  const contentTranslateY = Math.round((1 - easedContentNorm) * 20);

  // Dynamic Styles for the Dome and Glowing Halo
  const glowStyle: React.CSSProperties = {
    width: `${domeWidthPx}px`,
    height: `${domeHeightPx}px`,
    borderRadius: "50% 50% 0 0",
    position: "absolute",
    left: "50%",
    top: `${glowTopPx}px`,
    transform: "translateX(-50%)",
    background: "radial-gradient(ellipse at 50% 50%, rgba(95, 95, 95, 0.24) 0%, rgba(45, 45, 45, 0.11) 45%, rgba(0, 0, 0, 0) 75%)",
    filter: "blur(24px)",
    opacity: 1 - Math.pow(progress, 3), // Fade glow out elegantly at 100% progress
    willChange: "top, opacity",
    pointerEvents: "none",
  };

  const domeStyle: React.CSSProperties = {
    width: `${domeWidthPx}px`,
    height: `${domeHeightPx}px`,
    backgroundColor: "#000000",
    borderRadius: "50% 50% 0 0",
    position: "absolute",
    left: "50%",
    top: `${domeTopPx}px`,
    transform: "translateX(-50%)",
    willChange: "top",
    boxShadow: "0 -25px 60px -10px rgba(0, 0, 0, 0.95)", // Soft occlusion shadow blending into the scene
    pointerEvents: "none",
  };

  // Descriptive phase status for debugging and calibration
  let phaseLabel = "0% • Dome Off-screen (Outgoing Pinned)";
  if (progress > 0.02 && progress < 0.68) {
    phaseLabel = `${Math.round(progress * 100)}% • Dome Sweeping Up (${Math.round(arcNorm * 100)}% coverage)`;
  } else if (progress >= 0.68 && progress < 0.98) {
    phaseLabel = `${Math.round(progress * 100)}% • Solid Blackout • Transitioning Content`;
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
            pointerEvents: progress > 0.65 ? "none" : "auto",
          }}
        >
          {outgoingContent}
        </div>

        {/* ================================================================= */}
        {/* LAYER 2: THE SOLID BLACK OVERSIZED DOME AND HALO                 */}
        {/* ================================================================= */}
        <div className="absolute inset-0 w-full h-full z-20 overflow-hidden pointer-events-none">
          {/* Subtle soft dark-gray halo peeking above the curve */}
          <div style={glowStyle} />
          {/* Physical black mask dome */}
          <div style={domeStyle} />
        </div>

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
