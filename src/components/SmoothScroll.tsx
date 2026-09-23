import { useEffect } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,            // Dezerv measured 0.094 (default 0.1)
      wheelMultiplier: 1,   // Dezerv measured 1
      smoothWheel: true,
      anchors: true,        // smooth-scroll nav links like "Offices"
      autoResize: true,     // Keep scroll limits accurate across dynamic content
    })

    ;(window as any).lenis = lenis

    const onSplashDone = () => {
      // Ensure Lenis starts and updates its boundaries when splash overlay completes
      lenis.start()
      setTimeout(() => {
        lenis.resize()
      }, 50)
    }

    const onWindowLoad = () => {
      lenis.resize()
    }

    window.addEventListener("evia:splash-done", onSplashDone)
    window.addEventListener("load", onWindowLoad)

    // Periodic check during first 2 seconds to make sure dimensions are updated as images/fonts load
    const initialResizeTimer = setTimeout(() => {
      lenis.resize()
    }, 400)

    return () => {
      clearTimeout(initialResizeTimer)
      window.removeEventListener("evia:splash-done", onSplashDone)
      window.removeEventListener("load", onWindowLoad)
      lenis.destroy()
      ;(window as any).lenis = undefined
    }
  }, [])
  return null
}
