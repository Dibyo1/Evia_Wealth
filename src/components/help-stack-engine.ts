/**
 * help-stack-engine.ts — scroll logic for the stacking cards.
 * Layout is pure CSS (position: sticky). This file only does two things per scroll frame:
 *  1. when the NEXT card slides up over a pinned card, scale that card down (1 → 0.93) and dim it (0 → 28% black)
 *  2. while a card is pinned, move its 3-step state (highlighted list item + right-hand mock) with scroll
 */
/**
 * position: sticky silently stops working when ANY ancestor has overflow other than "visible"
 * (typically `overflow-x: hidden` on an app/page wrapper). The cards then scroll away like normal blocks
 * and the 90vh spacers show up as big black gaps. `overflow: clip` clips exactly the same way but does not
 * create a scroll container, so sticky works again. This swaps hidden → clip on the offending ancestors.
 */
function fixStickyAncestors(root: HTMLElement): void {
  const htmlHidden = getComputedStyle(document.documentElement)
  const htmlPropagates = htmlHidden.overflowX === "visible" && htmlHidden.overflowY === "visible"
  const changed: string[] = []
  const blocked: HTMLElement[] = []
  for (let el = root.parentElement; el && el !== document.documentElement; el = el.parentElement) {
    // body's overflow propagates to the viewport (harmless) when <html> itself is "visible"
    if (el === document.body && htmlPropagates) continue
    const cs = getComputedStyle(el)
    for (const axis of ["overflowX", "overflowY"] as const) {
      const v = cs[axis]
      if (v === "hidden") {
        el.style[axis] = "clip"
        changed.push(`${el.tagName.toLowerCase()}${el.className ? "." + String(el.className).trim().split(/\s+/).join(".") : ""} ${axis}`)
      } else if (v === "auto" || v === "scroll" || v === "overlay") {
        blocked.push(el)
      }
    }
  }
  if (changed.length) console.info("[HelpStack] changed overflow hidden → clip so position:sticky works on:", changed)
  if (blocked.length)
    console.warn("[HelpStack] these ancestors are real scroll containers; sticky will follow them instead of the window:", blocked)
}

export function initHelpStack(root: HTMLElement): () => void {
  fixStickyAncestors(root)
  const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-hs-card]"))
  const spacers = Array.from(root.querySelectorAll<HTMLElement>("[data-hs-spacer]"))
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches
  const MIN_SCALE = 0.93
  const MAX_DIM = 0.28
  const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))
  let raf = 0

  const update = () => {
    raf = 0
    if (!cards.length) return
    const vh = window.innerHeight
    cards.forEach((card, i) => {
      const top = parseFloat(getComputedStyle(card).top) || 0
      const H = card.offsetHeight

      // 2) step inside the pinned card: progress through the spacer that follows it
      const sp = spacers[i]
      if (sp) {
        const r = sp.getBoundingClientRect()
        const q = r.height > 0 ? clamp((H + top - r.top) / r.height, 0, 1) : 1
        const steps = Number(card.dataset.steps || 1)
        const idx = String(Math.min(steps - 1, Math.floor(q * steps)))
        if (card.dataset.step !== idx) card.dataset.step = idx
      }

      // 1) next card covering this one
      const next = cards[i + 1]
      let p = 0
      if (next) p = clamp((vh - next.getBoundingClientRect().top) / (vh - top), 0, 1)
      if (!reduce) card.style.setProperty("--hs-scale", String(1 - (1 - MIN_SCALE) * p))
      const dim = card.querySelector<HTMLElement>("[data-hs-dim]")
      if (dim) dim.style.opacity = String(MAX_DIM * p)
    })
  }
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }

  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
  update()
  return () => {
    cancelAnimationFrame(raf)
    window.removeEventListener("scroll", schedule)
    window.removeEventListener("resize", schedule)
  }
}
