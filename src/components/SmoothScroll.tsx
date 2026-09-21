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
    })
    ;(window as any).lenis = lenis
    return () => {
      lenis.destroy()
      ;(window as any).lenis = undefined
    }
  }, [])
  return null
}
