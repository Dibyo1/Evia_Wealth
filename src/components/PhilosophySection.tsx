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

  // Segment C: Incoming content fades & rises in from progress 0.78 to 0.95
  const contentProgress = Math.min(Math.max((scrollProgress - 0.78) / 0.17, 0), 1);

  // Compute word reveal styling
  const getWordStyle = (index: number) => {
    const center = 0.10 + (index / Math.max(totalWords - 1, 1)) * 0.80;
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

  // --- FULL TRAVEL TRANSLATION ---
  // Dome starts completely below the screen (translateY = H)
  // Dome ends completely above the screen (translateY = -domeHeightPx)
  const domeTranslateY = H + (-domeHeightPx - H) * easedArcProgress;

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

  // Subtle glow layer positioned immediately preceding the curved edge
  const glowShiftPx = Math.round(isMobile ? (W * 0.12) : (W * 0.04));
  const glowTranslateY = domeTranslateY - glowShiftPx;
  const glowHeightPx = Math.round(isMobile ? (W * 0.25) : (W * 0.12));

  // Incoming timeline header fade & rise
  const easedContentNorm = contentProgress * contentProgress * (3 - 2 * contentProgress);
  const contentOpacity = easedContentNorm;
  const contentTranslateY = Math.round((1 - easedContentNorm) * 35);

  return (
    <section
      ref={containerRef}
      id="philosophy"
      className="relative h-[260vh] bg-black"
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
          {/* Layer A: Very soft wide atmospheric background glow */}
          <div 
            style={{
              width: `${domeWidthPx}px`,
              height: `${domeHeightPx}px`,
              borderRadius: "50% 50% 0 0",
              position: "absolute",
              left: "50%",
              top: "0px",
              transform: `translateX(-50%) translateY(${domeTranslateY - 15}px)`,
              background: "radial-gradient(ellipse at top, rgba(160, 160, 160, 0.16) 0%, rgba(80, 80, 80, 0.05) 45%, rgba(0, 0, 0, 0) 75%)",
              filter: "blur(24px)",
              willChange: "transform",
              pointerEvents: "none",
            }} 
          />

          {/* Layer B: Medium-width soft curved atmospheric highlight (charcoal/grey) */}
          <div 
            style={{
              width: `${domeWidthPx}px`,
              height: `${domeHeightPx}px`,
              borderRadius: "50% 50% 0 0",
              position: "absolute",
              left: "50%",
              top: "0px",
              transform: `translateX(-50%) translateY(${domeTranslateY}px)`,
              borderTop: "5px solid rgba(170, 170, 170, 0.22)",
              borderLeft: "2.5px solid rgba(120, 120, 120, 0.04)",
              borderRight: "2.5px solid rgba(120, 120, 120, 0.04)",
              filter: "blur(2.5px)",
              willChange: "transform",
              pointerEvents: "none",
            }} 
          />

          {/* Layer B2: Defined elegant boundary halo to give a clear curved definition */}
          <div 
            style={{
              width: `${domeWidthPx}px`,
              height: `${domeHeightPx}px`,
              borderRadius: "50% 50% 0 0",
              position: "absolute",
              left: "50%",
              top: "0px",
              transform: `translateX(-50%) translateY(${domeTranslateY}px)`,
              borderTop: "1.5px solid rgba(220, 220, 220, 0.38)",
              borderLeft: "0.5px solid rgba(150, 150, 150, 0.03)",
              borderRight: "0.5px solid rgba(150, 150, 150, 0.03)",
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
              boxShadow: "0 -35px 80px -15px rgba(0, 0, 0, 0.98)",
              pointerEvents: "none",
            }} 
          >
            {/* Layer D: Massive solid black fill underneath to cover everything below the curve */}
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

        {/* =================================================================== */}
        {/* LAYER 3: INCOMING SECTION CONTENT                                    */}
        {/* =================================================================== */}
        <div
          className="absolute inset-0 w-full h-full z-30 flex flex-col items-center justify-center p-6 md:p-12 text-center pointer-events-none"
          style={{
            opacity: contentOpacity,
            transform: `translateY(${contentTranslateY}px)`,
            willChange: "opacity, transform",
          }}
        >
          <div className="max-w-3xl mx-auto flex flex-col items-center pointer-events-auto">
            <div className="gold-eyebrow-pill mb-6">
              <span className="gold-dot" />
              <span className="gold-eyebrow-text">HOW WE ARE DIFFERENT</span>
            </div>

            <h2 className="text-[34px] sm:text-[46px] md:text-[52px] font-bold tracking-[-0.03em] mb-4 gold-gradient-heading leading-[1.14]">
              How Evia Wealth does things
              <br />
              differently
            </h2>

            <p className="text-[14px] sm:text-[16px] text-[#c4c0b8] max-w-2xl leading-relaxed font-normal">
              We monitor macroeconomic swings, rebalance your asset allocation in real-time, and eliminate biased commissions.
            </p>

            <div className="mt-8 flex flex-col items-center gap-1 text-[10px] text-[#cdb864] font-mono tracking-widest uppercase">
              <span className="animate-pulse">Scroll down to explore timeline steps</span>
              <span className="text-base animate-bounce mt-1">↓</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
