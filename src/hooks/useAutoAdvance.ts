import { useEffect, useRef } from "react";

export interface Zone {
  id: string;
  getBounds: () => {
    startY: number;
    endY: number;
    targetY: number;
    upTargetY: number;
  } | null;
}

export function useAutoAdvance(zones: Zone[]) {
  const scrollYRef = useRef(0);
  const scrollDirectionRef = useRef<"down" | "up">("down");
  const lastScrollTimeRef = useRef(0);
  const isAutoScrollingRef = useRef(false);
  const cooldownEndRef = useRef(0);

  useEffect(() => {
    const handleScrollEvent = (y: number) => {
      if (isAutoScrollingRef.current) return;
      
      const now = performance.now();
      const prevY = scrollYRef.current;
      
      if (y !== prevY) {
        scrollDirectionRef.current = y > prevY ? "down" : "up";
        scrollYRef.current = y;
        lastScrollTimeRef.current = now;
      }
    };

    // Use global lenis if available, fallback to passive window scroll listener
    let unsubscribeLenis: (() => void) | null = null;
    
    const checkLenis = () => {
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.on === "function") {
        const handler = (e: any) => {
          handleScrollEvent(e.scroll);
        };
        lenis.on("scroll", handler);
        unsubscribeLenis = () => {
          if (typeof lenis.off === "function") {
            lenis.off("scroll", handler);
          }
        };
        return true;
      }
      return false;
    };

    const hasLenis = checkLenis();
    
    const handleWindowScroll = () => {
      handleScrollEvent(window.scrollY);
    };
    
    window.addEventListener("scroll", handleWindowScroll, { passive: true });

    let lenisPollInterval: any = null;
    if (!hasLenis) {
      lenisPollInterval = setInterval(() => {
        if (checkLenis()) {
          clearInterval(lenisPollInterval);
        }
      }, 100);
    }

    return () => {
      if (unsubscribeLenis) unsubscribeLenis();
      window.removeEventListener("scroll", handleWindowScroll);
      if (lenisPollInterval) clearInterval(lenisPollInterval);
    };
  }, []);

  useEffect(() => {
    const boundsCache = new Map<string, { startY: number; endY: number; targetY: number; upTargetY: number }>();
    
    const updateBoundsCache = () => {
      zones.forEach(zone => {
        const b = zone.getBounds();
        if (b) {
          boundsCache.set(zone.id, b);
        }
      });
    };

    updateBoundsCache();
    window.addEventListener("resize", updateBoundsCache, { passive: true });
    
    // Fallback: update on scroll occasionally to keep it fully accurate
    let cacheTimeout: any = null;
    const triggerCacheUpdate = () => {
      if (cacheTimeout) clearTimeout(cacheTimeout);
      cacheTimeout = setTimeout(updateBoundsCache, 200);
    };
    window.addEventListener("scroll", triggerCacheUpdate, { passive: true });

    // Check when fonts or load events occur
    document.fonts?.ready?.then(updateBoundsCache);
    window.addEventListener("load", updateBoundsCache, { passive: true });

    const cancelAutoScroll = () => {
      if (isAutoScrollingRef.current) {
        isAutoScrollingRef.current = false;
        const lenis = (window as any).lenis;
        if (lenis) {
          lenis.stop();
          lenis.start(); // interrupts the running lenis scroll animation instantly
        }
        cooldownEndRef.current = performance.now() + 400;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ["ArrowUp", "ArrowDown", "Space", "PageUp", "PageDown", "Home", "End", " "];
      if (keys.includes(e.key)) {
        cancelAutoScroll();
      }
    };

    window.addEventListener("wheel", cancelAutoScroll, { passive: true });
    window.addEventListener("touchstart", cancelAutoScroll, { passive: true });
    window.addEventListener("pointerdown", cancelAutoScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown, { passive: true });

    const checkIdleAndAdvance = () => {
      if (isAutoScrollingRef.current) return;
      
      const now = performance.now();
      if (now < cooldownEndRef.current) return;
      
      const timeSinceLastScroll = now - lastScrollTimeRef.current;
      if (timeSinceLastScroll < 160) return; // 160ms idle requirement

      // Never trigger if a modal, menu or dialog is active
      const isModalActive = 
        document.body.style.overflow === "hidden" || 
        document.querySelector("[role='dialog']") !== null ||
        document.querySelector(".modal-open") !== null;
      if (isModalActive) return;

      const currentScroll = scrollYRef.current;
      
      for (const zone of zones) {
        const bounds = boundsCache.get(zone.id);
        if (!bounds) continue;

        const { startY, endY, targetY, upTargetY } = bounds;
        
        // If currentScroll lies in the transition zone [startY, endY]
        if (currentScroll >= startY && currentScroll <= endY) {
          const direction = scrollDirectionRef.current;
          const finalTarget = direction === "up" ? upTargetY : targetY;

          // Support prefers-reduced-motion
          const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          
          isAutoScrollingRef.current = true;
          
          if (prefersReduced) {
            const lenis = (window as any).lenis;
            if (lenis) {
              lenis.scrollTo(finalTarget, { immediate: true });
            } else {
              window.scrollTo({ top: finalTarget, behavior: "auto" });
            }
            isAutoScrollingRef.current = false;
            cooldownEndRef.current = performance.now() + 400;
          } else {
            const lenis = (window as any).lenis;
            if (lenis) {
              lenis.scrollTo(finalTarget, {
                duration: 1.0,
                easing: (t: number) => 1 - Math.pow(1 - t, 3), // cubic out
                onComplete: () => {
                  isAutoScrollingRef.current = false;
                  cooldownEndRef.current = performance.now() + 400;
                }
              });
            } else {
              window.scrollTo({ top: finalTarget, behavior: "smooth" });
              setTimeout(() => {
                isAutoScrollingRef.current = false;
                cooldownEndRef.current = performance.now() + 400;
              }, 1000);
            }
          }
          break;
        }
      }
    };

    const idleInterval = setInterval(checkIdleAndAdvance, 50);

    return () => {
      window.removeEventListener("resize", updateBoundsCache);
      window.removeEventListener("scroll", triggerCacheUpdate);
      window.removeEventListener("load", updateBoundsCache);
      window.removeEventListener("wheel", cancelAutoScroll);
      window.removeEventListener("touchstart", cancelAutoScroll);
      window.removeEventListener("pointerdown", cancelAutoScroll);
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(idleInterval);
      if (cacheTimeout) clearTimeout(cacheTimeout);
    };
  }, [zones]);
}
