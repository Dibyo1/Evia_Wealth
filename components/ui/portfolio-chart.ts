/**
 * portfolio-chart.ts — "Your Portfolio" animated growth card (Evia Wealth hero)
 *
 * Framework-free. Renders ONE responsive <svg viewBox="0 0 472 384"> into a host element.
 * All geometry, colors and timings below were measured frame-by-frame from the original site recording.
 *
 * Timeline (seconds from the moment the card enters the viewport):
 *   0.00 – 0.55  card fades in + rises 20px
 *   0.30 – 0.60  label / number / grid fade in
 *   0.47 + 0.10·i  bar i starts growing (i = 0..4), 0.90s each, easeOutBack (overshoots ~10% then settles)
 *   0.72 – 2.52  number counts ₹0.0L → ₹24.5L and badge counts + 0.0% → + 18.2% (easeOutCubic, in sync)
 *   0.80 – 1.50  soft green area fill fades in
 *   0.85 – 1.45  lime line draws left → right (easeInOutCubic)
 *   bar start + 0.42  white dot + "+x.x%" chip pop in on top of each bar (0.28s)
 * Replays every time the card scrolls back into view.
 */

export interface PortfolioChartOptions {
  /** start automatically when ≥50% visible (default true) */
  autoplay?: boolean
  /** replay each time the card re-enters the viewport (default true) */
  replayOnView?: boolean
  /** playback speed multiplier (default 1). 0.25 = slow motion for inspecting the animation */
  speed?: number
  /** continuously loop the graph animation (default true) */
  loop?: boolean
  /** hold duration at the peak before looping again (default 1.8 seconds) */
  holdDuration?: number
}

export interface PortfolioChartHandle {
  /** restart the animation from t = 0 */
  replay(): void
  /** freeze the card at time t (seconds) — useful for debugging / screenshots */
  seek(t: number): void
  /** change playback speed for the next replay */
  setSpeed(speed: number): void
  destroy(): void
}

// ---------------------------------------------------------------- geometry (card design space 472 × 384)
const W = 472
const H = 384
const BASE = 333.6 // baseline y of the bars
const XS = [92.4, 164.4, 236.8, 309.5, 381.5] // bar centres
const TOPS = [284.8, 255.0, 224.5, 195.0, 166.0] // final bar-top y
const BAR_W = 24.5
const CHART_X0 = 46
const CHART_X1 = 428
const GRID_Y = [195.8, 253.1, 310.3]
const LABELS = ["FY21", "FY22", "FY23", "FY24", "FY25"]
const GROWTH = ["+3.4%", "+7.8%", "+11.6%", "+15.2%", "+18.2%"]
const FINAL_VALUE = 24.5 // ₹ lakh
const FINAL_PCT = 18.2

// Line samples traced from the original (passes through each bar-top dot, dips in the gaps, flattens after FY25)
const LINE_PTS: [number, number][] = [
  [46.2, 302.2],
  [59.1, 297.4],
  [70.2, 292.6],
  [81.3, 286.7],
  [88.7, 284.1],
  [92.4, 283.0],
  [99.8, 282.4],
  [107.1, 283.3],
  [114.5, 285.2],
  [121.9, 287.0],
  [129.3, 288.0],
  [136.7, 286.8],
  [144.1, 282.4],
  [149.6, 275.6],
  [155.1, 267.8],
  [158.8, 261.9],
  [161.8, 258.2],
  [164.4, 256.8],
  [173.6, 256.2],
  [181.0, 256.6],
  [188.4, 257.9],
  [195.8, 258.8],
  [203.2, 259.0],
  [210.5, 256.9],
  [217.9, 250.8],
  [221.6, 245.7],
  [225.3, 239.8],
  [229.0, 233.5],
  [232.7, 228.7],
  [236.8, 226.1],
  [243.8, 225.4],
  [251.2, 225.5],
  [258.5, 227.6],
  [265.9, 229.6],
  [273.3, 230.7],
  [280.7, 229.6],
  [288.1, 224.8],
  [293.6, 218.3],
  [299.2, 211.0],
  [302.9, 205.1],
  [306.5, 199.9],
  [309.5, 197.3],
  [317.6, 192.5],
  [325.0, 189.5],
  [339.8, 182.5],
  [354.6, 176.8],
  [369.3, 172.0],
  [381.5, 168.1],
  [395.2, 167.4],
  [409.9, 166.3],
  [424.7, 165.2]
]

// ---------------------------------------------------------------- timings
const T_CARD = 0.55
const T_CONTENT = 0.3
const T_BAR_START = 0.47
const T_BAR_STAGGER = 0.1
const T_BAR_DUR = 0.9
const T_COUNT_START = 0.72
const T_COUNT_DUR = 1.8
const T_AREA_START = 0.8
const T_AREA_DUR = 0.7
const T_LINE_START = 0.85
const T_LINE_DUR = 0.6
const T_POP_DELAY = 0.42
const T_POP_DUR = 0.28
const T_END = 2.7

// ---------------------------------------------------------------- easing
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeOutBack = (x: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

// Catmull-Rom → cubic Bézier path through the traced points
function smoothPath(pts: [number, number][]): string {
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0]} ${p2[1]}`
  }
  return d
}

const LINE_D = smoothPath(LINE_PTS)
const AREA_D = `${LINE_D}L${LINE_PTS[LINE_PTS.length - 1][0]} ${BASE}L${LINE_PTS[0][0]} ${BASE}Z`

let uid = 0

/** Pure function: returns the SVG markup of the card at time t (seconds). t < 0 → hidden. */
export function renderPortfolioFrame(t: number, id = "pc0", isLoop = false, loopFade = 1): string {
  const card = isLoop ? 1 : easeOutCubic(clamp01(t / T_CARD))
  const content = easeOutCubic(clamp01((t - T_CONTENT) / 0.3))
  const count = easeOutCubic(clamp01((t - T_COUNT_START) / T_COUNT_DUR))
  const area = easeOutCubic(clamp01((t - T_AREA_START) / T_AREA_DUR))
  const reveal = easeInOutCubic(clamp01((t - T_LINE_START) / T_LINE_DUR))
  const clipW = reveal * (W + 4)

  const value = (FINAL_VALUE * count).toFixed(1)
  const pct = (FINAL_PCT * count).toFixed(1)

  // bars + dots + chips
  let bars = ""
  let marks = ""
  for (let i = 0; i < 5; i++) {
    const finalH = BASE - TOPS[i]
    const age = (t - (T_BAR_START + T_BAR_STAGGER * i)) / T_BAR_DUR
    const h = age > 0 ? finalH * easeOutBack(clamp01(age)) : 0
    if (h > 0.4) {
      const rx = Math.min(6.5, h / 2)
      bars += `<rect x="${(XS[i] - BAR_W / 2).toFixed(2)}" y="${(BASE - h).toFixed(2)}" width="${BAR_W}" height="${h.toFixed(2)}" rx="${rx.toFixed(2)}" fill="url(#${id}-bar)"/>`
    }
    const pop = easeOutCubic(clamp01((t - (T_BAR_START + T_BAR_STAGGER * i + T_POP_DELAY)) / T_POP_DUR))
    if (pop > 0.001) {
      const topY = BASE - h
      const dotY = topY - 1.8
      const chipY = dotY - 20 + (1 - pop) * 5
      marks +=
        `<g opacity="${pop.toFixed(3)}">` +
        (i === 4 ? `<circle cx="${XS[i]}" cy="${dotY.toFixed(2)}" r="11" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.13)"/>` : "") +
        `<circle cx="${XS[i]}" cy="${dotY.toFixed(2)}" r="${(8 * (0.6 + 0.4 * pop)).toFixed(2)}" fill="rgba(150,255,120,.55)" filter="url(#${id}-blur)"/>` +
        `<circle cx="${XS[i]}" cy="${dotY.toFixed(2)}" r="${(4.3 * (0.6 + 0.4 * pop)).toFixed(2)}" fill="#fff"/>` +
        `<rect x="${XS[i] - 20}" y="${(chipY - 7.5).toFixed(2)}" width="40" height="15" rx="4.5" fill="#090909" stroke="#1f1f1f"/>` +
        `<text x="${XS[i]}" y="${(chipY + 3.6).toFixed(2)}" text-anchor="middle" font-size="9.4" font-weight="700" fill="#82dc58">${GROWTH[i]}</text>` +
        `</g>`
    }
  }

  const xLabels = LABELS.map(
    (l, i) =>
      `<text x="${XS[i]}" y="349.5" text-anchor="middle" font-size="11" font-weight="500" fill="rgba(255,255,255,.55)">${l}</text>`,
  ).join("")

  const grid = GRID_Y.map(
    (y) =>
      `<line x1="${CHART_X0}" x2="${CHART_X1}" y1="${y}" y2="${y}" stroke="rgba(255,255,255,.055)" stroke-dasharray="3 4"/>`,
  ).join("")

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" style="display:block;overflow:visible;font-family:var(--font-sans,Inter,'Segoe UI',system-ui,sans-serif)" role="img" aria-label="Portfolio growth from ₹0 to ₹24.5L, up 18.2%">` +
    `<defs>` +
    `<linearGradient id="${id}-bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ad150"/><stop offset="1" stop-color="#337830"/></linearGradient>` +
    `<linearGradient id="${id}-line" gradientUnits="userSpaceOnUse" x1="${CHART_X0}" y1="0" x2="${CHART_X1}" y2="0"><stop offset="0" stop-color="#357831"/><stop offset="1" stop-color="#7bd650"/></linearGradient>` +
    `<linearGradient id="${id}-area" gradientUnits="userSpaceOnUse" x1="0" y1="160" x2="0" y2="${BASE}"><stop offset="0" stop-color="rgba(123,214,80,.24)"/><stop offset="1" stop-color="rgba(123,214,80,0)"/></linearGradient>` +
    `<linearGradient id="${id}-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(255,255,255,.045)"/><stop offset=".45" stop-color="rgba(255,255,255,0)"/></linearGradient>` +
    `<clipPath id="${id}-reveal"><rect x="0" y="0" width="${clipW.toFixed(1)}" height="${H}"/></clipPath>` +
    `<filter id="${id}-blur" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.6"/></filter>` +
    `<filter id="${id}-glow" x="-10%" y="-30%" width="120%" height="160%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
    `</defs>` +
    `<g opacity="${card.toFixed(3)}" transform="translate(0 ${((1 - card) * 20).toFixed(2)})">` +
    // card
    `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="#121212" stroke="rgba(255,255,255,.08)"/>` +
    `<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="url(#${id}-sheen)"/>` +
    // header
    `<circle cx="31" cy="40" r="7" fill="rgba(52,211,153,.35)" filter="url(#${id}-blur)"/>` +
    `<circle cx="31" cy="40" r="3.6" fill="#34d399"/>` +
    `<text x="45" y="45" font-size="15" font-weight="500" fill="#fff">Your Portfolio</text>` +
    `<rect x="381.5" y="28.5" width="65" height="22" rx="11" fill="rgba(52,211,153,.12)" stroke="rgba(52,211,153,.38)"/>` +
    `<text x="414" y="43.3" text-anchor="middle" font-size="11" font-weight="600" fill="#3ddc97" opacity="${loopFade.toFixed(3)}" style="font-variant-numeric:tabular-nums">+ ${pct}%</text>` +
    // body
    `<g opacity="${content.toFixed(3)}">` +
    `<text x="27" y="82" font-size="10" letter-spacing="1.6" fill="rgba(255,255,255,.45)">CURRENT WEALTH GROWTH</text>` +
    `<text x="27" y="122" opacity="${loopFade.toFixed(3)}" style="font-variant-numeric:tabular-nums"><tspan font-size="33" font-weight="700" fill="#fff" letter-spacing="-.3">₹${value}L</tspan><tspan dx="10" font-size="12.5" font-weight="400" fill="rgba(255,255,255,.4)">(₹0 → ₹24.5L)</tspan></text>` +
    grid +
    `<line x1="${CHART_X0}" x2="${CHART_X1}" y1="${BASE}" y2="${BASE}" stroke="#262626"/>` +
    xLabels +
    `</g>` +
    // chart
    `<path d="${AREA_D}" fill="url(#${id}-area)" opacity="${(area * loopFade).toFixed(3)}"/>` +
    `<g opacity="${loopFade.toFixed(3)}">${bars}</g>` +
    `<g clip-path="url(#${id}-reveal)" opacity="${loopFade.toFixed(3)}"><path d="${LINE_D}" fill="none" stroke="url(#${id}-line)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#${id}-glow)"/></g>` +
    `<g opacity="${loopFade.toFixed(3)}">${marks}</g>` +
    `</g></svg>`
  )
}

export function mountPortfolioChart(host: HTMLElement, options: PortfolioChartOptions = {}): PortfolioChartHandle {
  const { autoplay = true, replayOnView = true, loop = true } = options
  let speed = options.speed ?? 1
  const id = `pc${uid++}`
  const reduce = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches
  const holdDuration = options.holdDuration ?? 1.8
  const fadeDuration = 0.45
  const totalCycle = T_END + holdDuration + fadeDuration

  let raf = 0
  let start = 0
  let playing = false
  let inView = false
  let isLooping = false

  const paint = (t: number, isLoop = false, loopFade = 1) => {
    host.innerHTML = renderPortfolioFrame(t, id, isLoop, loopFade)
  }
  const stop = () => {
    cancelAnimationFrame(raf)
    playing = false
  }
  const tick = (now: number) => {
    const elapsed = ((now - start) / 1000) * speed

    if (loop) {
      if (elapsed >= totalCycle) {
        start = now
        isLooping = true
        paint(0, true, 1)
        raf = requestAnimationFrame(tick)
        return
      }

      if (elapsed > T_END + holdDuration) {
        const fadeProgress = (elapsed - (T_END + holdDuration)) / fadeDuration
        const loopFade = Math.max(0, 1 - fadeProgress)
        paint(T_END, true, loopFade)
        raf = requestAnimationFrame(tick)
        return
      }

      if (elapsed >= T_END) {
        paint(T_END, isLooping, 1)
        raf = requestAnimationFrame(tick)
        return
      }

      paint(elapsed, isLooping, 1)
      raf = requestAnimationFrame(tick)
      return
    }

    if (elapsed >= T_END) {
      paint(99, false, 1)
      playing = false
      return
    }
    paint(elapsed, false, 1)
    raf = requestAnimationFrame(tick)
  }
  const play = () => {
    stop()
    if (reduce) return paint(99, false, 1)
    playing = true
    start = performance.now()
    paint(0, isLooping, 1)
    raf = requestAnimationFrame(tick)
  }

  paint(-1, false, 1)
  let io: IntersectionObserver | undefined
  if (autoplay && typeof IntersectionObserver === "function") {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.5 && !inView) {
            inView = true
            play()
          } else if (e.intersectionRatio <= 0.05 && inView) {
            inView = false
            if (replayOnView) {
              stop()
              paint(-1, false, 1)
            }
          }
        }
      },
      { threshold: [0, 0.05, 0.5] },
    )
    io.observe(host)
  }

  return {
    replay: play,
    seek(t: number) {
      stop()
      paint(t, isLooping, 1)
    },
    setSpeed(next: number) {
      speed = next > 0 ? next : 1
    },
    destroy() {
      stop()
      io?.disconnect()
      host.innerHTML = ""
    },
  }
}
