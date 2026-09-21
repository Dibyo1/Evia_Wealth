import React, { useRef, useState, useEffect, useCallback } from "react";

/**
 * High-Performance Leadership Philosophy Section
 * 
 * Features:
 * - Silky smooth 60/120fps word-by-word scroll reveal into champagne gold.
 * - Zero layout thrashing: uses cached geometry and window.scrollY.
 * - Viewport-bounded: IntersectionObserver ensures scroll listeners and RAF only tick when in view.
 * - Prominent Dezerv-style curved dome transition that physically sweeps upward through the entire viewport.
 */
export default function PhilosophySection() {
  const containerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewportSize, setViewportSize] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const quoteText =
    "Traditional wealth management is broken & you need a better way to manage your money. Using unbiased data driven decisions, we ensure your investment journey is successful so you can focus on what matters most to you";

  const words = quoteText.split(" ");
  const totalWords = words.length;

  // Cached geometry to avoid getBoundingClientRect layout thrashing
  const geometryRef = useRef({ top: 0, height: 1000, active: false });
  const lastProgressRef = useRef(0);

  const measureGeometry = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    geometryRef.current = {
      top: rect.top + scrollTop,
      height: rect.height,
      active: geometryRef.current.active,
    };
  }, []);

  useEffect(() => {
    measureGeometry();
    window.addEventListener("resize", measureGeometry, { passive: true });
    return () => window.removeEventListener("resize", measureGeometry);
  }, [measureGeometry]);

  // Viewport-aware scroll scrub: only active when section is in or near viewport
  useEffect(() => {
    if (!containerRef.current) return;

    let rafId: number | null = null;
    let ticking = false;

    const computeProgress = () => {
      ticking = false;
      const { top, height } = geometryRef.current;
      const windowHeight = window.innerHeight || 800;
      const scrollableDistance = height - windowHeight;

      if (scrollableDistance <= 0) return;

      const currentScroll = window.scrollY || window.pageYOffset || 0;
      const scrolled = currentScroll - top;
      const rawProgress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

      // Quantize slightly to prevent unnecessary React renders
      if (Math.abs(rawProgress - lastProgressRef.current) > 0.003) {
        lastProgressRef.current = rawProgress;
        setScrollProgress(rawProgress);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(computeProgress);
      }
    };

    // IntersectionObserver to enable scroll listening only when section is near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            geometryRef.current.active = true;
            measureGeometry();
            window.addEventListener("scroll", handleScroll, { passive: true });
            computeProgress();
          } else {
            geometryRef.current.active = false;
            window.removeEventListener("scroll", handleScroll);
            if (rafId !== null) {
              window.cancelAnimationFrame(rafId);
              rafId = null;
            }
          }
        }
      },
      { rootMargin: "200px 0px 200px 0px", threshold: 0 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [measureGeometry]);

  // --- SCROLL TIMELINE SEGMENTS ---
  // Segment A: Word reveal from scroll progress 0.10 to 0.45
  const wordRevealProgress = Math.min(Math.max((scrollProgress - 0.10) / 0.35, 0), 1);

  // Segment B: Black dome mask sweeping up from progress 0.48 to 0.82
  const arcProgress = Math.min(Math.max((scrollProgress - 0.48) / 0.34, 0), 1);

  // Compute word reveal styling
  const getWordStyle = (index: number) => {
    const center = 0.05 + (index / Math.max(totalWords - 1, 1)) * 0.90;
    const waveHalfWidth = 0.07;

    let factor = 0;
    if (wordRevealProgress <= center - waveHalfWidth) {
      factor = 0;
    } else if (wordRevealProgress >= center + waveHalfWidth) {
      factor = 1;
    } else {
      const t = (wordRevealProgress - (center - waveHalfWidth)) / (2 * waveHalfWidth);
      factor = t * t * (3 - 2 * t); // smoothstep
    }

    const r = Math.round(226 + (241 - 226) * factor);
    const g = Math.round(214 + (231 - 214) * factor);
    const b = Math.round(160 + (180 - 160) * factor);
    const a = 0.22 + 0.78 * factor;

    // Subtle wave glow that peaks near the transition front and fades
    const distance = wordRevealProgress - center;
    const glowFactor = Math.max(0, 1 - Math.abs(distance) / 0.08);
    const glowOpacity = 0.22 * Math.pow(glowFactor, 2);

    return {
      color: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
      textShadow:
        glowOpacity > 0.01
          ? `0 0 20px rgba(232, 214, 140, ${glowOpacity.toFixed(2)})`
          : "none",
    };
  };

  // Closing quote factor
  const closingFactor = Math.min(Math.max((wordRevealProgress - 0.82) / 0.18, 0), 1);
  const cr = Math.round(226 + (241 - 226) * closingFactor);
  const cg = Math.round(214 + (231 - 214) * closingFactor);
  const cb = Math.round(160 + (180 - 160) * closingFactor);
  const ca = 0.22 + 0.78 * closingFactor;

  const closingGlowOpacity = 0.22 * Math.pow(Math.max(0, 1 - Math.abs(closingFactor - 0.8) / 0.2), 2);
  const closingTextShadow = closingGlowOpacity > 0.01
    ? `0 0 20px rgba(232, 214, 140, ${closingGlowOpacity.toFixed(2)})`
    : "none";

  // --- GEOMETRIC DOME CONFIGURATION ---
  const W = viewportSize.width || 1440;
  const H = viewportSize.height || 900;
  const isMobile = W < 768;

  // Recommended starting geometry for perfect shallow premium curvature:
  // Desktop: 200vw width, 60vw height.
  // Mobile: 280vw width, 120vw height.
  const domeWidthVw = isMobile ? 280 : 200;
  const domeHeightVw = isMobile ? 120 : 60;

  const domeWidthPx = Math.round((domeWidthVw * W) / 100);
  const domeHeightPx = Math.round((domeHeightVw * W) / 100);

  // Cubic ease-in-out curve for natural, premium physical momentum
  const easedArcProgress = arcProgress < 0.5
    ? 4 * arcProgress * arcProgress * arcProgress
    : 1 - Math.pow(-2 * arcProgress + 2, 3) / 2;

  // --- CINEMATIC RELEASE / SCROLL UP PHASE ---
  // From 0.80 to 1.00 scroll progress, the entire sticky content translates upward
  // so that the next section (Timeline) enters the screen continuously.
  const exitProgress = Math.min(Math.max((scrollProgress - 0.80) / 0.20, 0), 1);
  const easedExit = exitProgress * exitProgress * (3 - 2 * exitProgress);
  const exitTranslateY = Math.round(easedExit * -250); // Translate up by 250px

  // --- FULL TRAVEL TRANSLATION ---
  // Dome starts completely below the screen (translateY = H)
  // Dome ends completely above the screen (translateY = -domeHeightPx)
  const domeTranslateYBase = H + (-domeHeightPx - H) * easedArcProgress;
  const domeTranslateY = domeTranslateYBase + exitTranslateY;

  // Physical-based outgoing opacity:
  // Quote is centered vertically.
  // Starts at H * 0.30, ends at H * 0.65.
  const quoteBottomY = H * 0.65;
  const quoteTopY = H * 0.30;
  
  let outgoingOpacity = 1;
  if (domeTranslateY <= quoteTopY) {
    outgoingOpacity = 0;
  } else if (domeTranslateY >= quoteBottomY) {
    outgoingOpacity = 1;
  } else {
    outgoingOpacity = (domeTranslateY - quoteTopY) / (quoteBottomY - quoteTopY);
  }

  // Attribution chip is positioned lower than the quote.
  // Starts at H * 0.65, ends at H * 0.78.
  const attributionReveal = Math.min(Math.max((wordRevealProgress - 0.65) / 0.35, 0), 1);
  const baseAttributionOpacity = 0.22 + 0.78 * attributionReveal;

  const attrBottomY = H * 0.78;
  const attrTopY = H * 0.65;
  let attrCoverFactor = 1;
  if (domeTranslateY <= attrTopY) {
    attrCoverFactor = 0;
  } else if (domeTranslateY >= attrBottomY) {
    attrCoverFactor = 1;
  } else {
    attrCoverFactor = (domeTranslateY - attrTopY) / (attrBottomY - attrTopY);
  }
  const attributionOpacity = baseAttributionOpacity * attrCoverFactor;

  return (
    <section
      ref={containerRef}
      id="philosophy"
      className="relative h-[160vh] bg-black"
    >
      {/* Sticky Fullscreen Frame Pinned to Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center px-5 sm:px-6">
        
        {/* =================================================================== */}
        {/* LAYER 1: OUTGOING CONTENT (WORD REVEAL PHILOSOPHY)                 */}
        {/* =================================================================== */}
        <div 
          className="relative z-10 max-w-[840px] mx-auto flex flex-col items-center text-center select-none"
          style={{ 
            opacity: outgoingOpacity,
            willChange: "opacity"
          }}
        >
          {/* Subtle radial warmth behind quote */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-[rgba(212,175,55,0.06)] rounded-full blur-[140px] pointer-events-none" />

          {/* Eyebrow Pill */}
          <div className="gold-eyebrow-pill mb-8 sm:mb-10">
            <span className="gold-dot" />
            <span className="gold-eyebrow-text">
              LEADERSHIP PHILOSOPHY • EVIA WEALTH
            </span>
          </div>

          {/* Centered Quote */}
          <div className="text-[26px] sm:text-[34px] md:text-[40px] lg:text-[44px] font-bold leading-[1.25] tracking-[-0.02em] text-center">
            <span className="inline-block font-serif mr-1.5" style={getWordStyle(0)}>
              “
            </span>
            {words.map((word, index) => (
              <span key={index} className="inline-block mr-[0.26em]" style={getWordStyle(index)}>
                {word}
              </span>
            ))}
            <span
              className="inline-block font-serif ml-1"
              style={{
                color: `rgba(${cr}, ${cg}, ${cb}, ${ca.toFixed(2)})`,
                textShadow: closingTextShadow,
              }}
            >
              ”
            </span>
          </div>

          {/* Attribution Chip */}
          <div
            className="mt-8 sm:mt-10 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#111114]/90 border border-white/10 shadow-lg"
            style={{ opacity: attributionOpacity }}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-white/10 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Investment Council"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover filter grayscale contrast-110"
              />
            </div>
            <div className="text-left">
              <div className="text-[13px] font-semibold text-[#f1e7b4] leading-tight font-sans">
                Investment Council
              </div>
              <div className="text-[11px] text-neutral-400 font-sans">
                Leadership Team, Evia Wealth
              </div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER 2: THE CURVED DOME MASK AND HALO GLOW                         */}
        {/* =================================================================== */}
        <div className="absolute inset-0 w-full h-full z-20 overflow-hidden pointer-events-none">
          {/* Layer A: Wide, extremely soft atmospheric fade (Curved) */}
          <div 
            style={{
              width: `${domeWidthPx}px`,
              height: `${domeHeightPx}px`,
              position: "absolute",
              left: "50%",
              top: "0px",
              transform: `translateX(-50%) translateY(${domeTranslateY}px)`,
              borderRadius: "50% 50% 0 0",
              background: "linear-gradient(to top, rgba(160, 140, 100, 0.16) 0%, rgba(45, 45, 45, 0.08) 60%, rgba(0, 0, 0, 0) 100%)",
              filter: "blur(60px)",
              willChange: "transform",
              pointerEvents: "none",
            }}
          />

          {/* Layer B: Medium, tighter premium halo glow (Curved) */}
          <div 
            style={{
              width: `${domeWidthPx}px`,
              height: `${domeHeightPx}px`,
              position: "absolute",
              left: "50%",
              top: "0px",
              transform: `translateX(-50%) translateY(${domeTranslateY - (isMobile ? 12 : 24)}px)`,
              borderRadius: "50% 50% 0 0",
              background: "linear-gradient(to top, rgba(160, 140, 100, 0.28) 0%, rgba(65, 65, 65, 0.18) 50%, rgba(0, 0, 0, 0) 100%)",
              filter: "blur(25px)",
              willChange: "transform",
              pointerEvents: "none",
            }}
          />

          {/* Layer C: Physical solid black dome */}
          <div 
            style={{
              width: `${domeWidthPx}px`,
              height: `${domeHeightPx}px`,
              backgroundColor: "#000000",
              borderRadius: "50% 50% 0 0",
              position: "absolute",
              left: "50%",
              top: "0px",
              transform: `translateX(-50%) translateY(${domeTranslateY}px)`,
              willChange: "transform",
              pointerEvents: "none",
            }} 
          >
            {/* Continuous black fill below the curved dome to block any text beneath */}
            <div 
              style={{
                position: "absolute",
                top: `${domeHeightPx - 2}px`,
                left: "-10%",
                width: "120%",
                height: `${H * 3.5}px`,
                backgroundColor: "#000000",
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
