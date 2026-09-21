import React, { useRef, useState, useEffect, useCallback } from "react";

/**
 * High-Performance Leadership Philosophy Section
 * 
 * Features:
 * - Silky smooth 60/120fps word-by-word scroll reveal into champagne gold.
 * - Zero layout thrashing: uses cached geometry and window.scrollY instead of getBoundingClientRect() on scroll.
 * - Viewport-bounded: IntersectionObserver ensures scroll listeners and RAF only tick when in view.
 * - Streamlined 180vh track for immediate, responsive momentum without dead space.
 */
export default function PhilosophySection() {
  const containerRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
      if (Math.abs(rawProgress - lastProgressRef.current) > 0.004) {
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

  // Word reveal: mapped from scroll progress 0.05 to 0.85
  const wordRevealProgress = Math.min(Math.max((scrollProgress - 0.05) / 0.80, 0), 1);

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

    // Interpolate from --gold-dim: rgba(226, 214, 160, 0.22)
    // to --gold-cream: rgb(241, 231, 180) (alpha 1.0)
    const r = Math.round(226 + (241 - 226) * factor);
    const g = Math.round(214 + (231 - 214) * factor);
    const b = Math.round(160 + (180 - 160) * factor);
    const a = 0.22 + 0.78 * factor;

    return {
      color: `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`,
      textShadow:
        factor > 0.1
          ? `0 0 20px rgba(232, 214, 140, ${(0.2 * factor).toFixed(2)})`
          : "none",
    };
  };

  // Closing quote factor
  const closingFactor = Math.min(Math.max((wordRevealProgress - 0.82) / 0.18, 0), 1);
  const cr = Math.round(226 + (241 - 226) * closingFactor);
  const cg = Math.round(214 + (231 - 214) * closingFactor);
  const cb = Math.round(160 + (180 - 160) * closingFactor);
  const ca = 0.22 + 0.78 * closingFactor;

  // Attribution chip opacity
  const attributionOpacity = Math.min(Math.max(0.22 + ((wordRevealProgress - 0.65) / 0.35) * 0.78, 0.22), 1);

  return (
    <section
      ref={containerRef}
      id="philosophy"
      className="relative h-[180vh] bg-[#0a0a0c]"
    >
      {/* Sticky Fullscreen Frame Pinned to Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center px-5 sm:px-6">
        {/* Subtle radial warmth behind quote */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-[rgba(212,175,55,0.06)] rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-[840px] mx-auto flex flex-col items-center text-center">
          {/* Eyebrow Pill */}
          <div className="gold-eyebrow-pill mb-8 sm:mb-10">
            <span className="gold-dot" />
            <span className="gold-eyebrow-text">
              LEADERSHIP PHILOSOPHY • EVIA WEALTH
            </span>
          </div>

          {/* Centered Quote in Poppins 700 */}
          <div className="text-[26px] sm:text-[34px] md:text-[40px] lg:text-[44px] font-bold leading-[1.25] tracking-[-0.02em] select-none text-center">
            {/* Opening quote mark */}
            <span
              className="inline-block font-serif mr-1.5"
              style={getWordStyle(0)}
            >
              “
            </span>

            {/* Words with scroll-linked gold wave reveal */}
            {words.map((word, index) => (
              <span
                key={index}
                className="inline-block mr-[0.26em]"
                style={getWordStyle(index)}
              >
                {word}
              </span>
            ))}

            {/* Closing quote mark */}
            <span
              className="inline-block font-serif ml-1"
              style={{
                color: `rgba(${cr}, ${cg}, ${cb}, ${ca.toFixed(2)})`,
                textShadow:
                  closingFactor > 0.1
                    ? `0 0 20px rgba(232, 214, 140, ${(0.2 * closingFactor).toFixed(2)})`
                    : "none",
              }}
            >
              ”
            </span>
          </div>

          {/* Attribution Chip */}
          <div
            className="mt-8 sm:mt-10 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#111114]/90 border border-white/10 shadow-lg transition-opacity duration-150"
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
      </div>
    </section>
  );
}
