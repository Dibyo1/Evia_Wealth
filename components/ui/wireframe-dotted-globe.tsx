/**
 * wireframe-dotted-globe.tsx — fast, perfectly round, wireframe + halftone-dot globe (canvas 2D + d3-geo)
 *
 * Why this exists (jank fixes vs. the original RotatingEarth component):
 *  1. NEVER touches the wheel. The old canvas had a non-passive `wheel` listener that called preventDefault()
 *     (zoom), which blocks / stalls page scrolling — and Lenis smooth-scroll — whenever the cursor is over the globe.
 *  2. Dots are pre-computed once as unit vectors and rotated with a tiny matrix (no d3 projection call per dot),
 *     back-hemisphere dots are skipped, and all dots are drawn in 4 batched paths (4 fills, not ~10,000).
 *  3. Renders ONLY while it is on screen and the tab is visible, and it holds still while the page is scrolling
 *     (so the main thread is free for scroll). Canvas DPR is capped at 2.
 *  4. Canvas is always a square and the radius comes from min(width, height) → the globe is a true circle.
 *  5. One marker, drawn inside render() with the same rotation math as the dots → it cannot drift or ghost.
 */
import { useEffect, useRef } from "react"
import * as d3 from "d3"

export interface GlobeMarker {
  lng: number
  lat: number
  label: string
}

export interface GlobeColors {
  ocean: string
  rim: string
  graticule: string
  landLine: string
  dot: string // "r,g,b"
  marker: string
}

export interface DottedGlobeOptions {
  /** GeoJSON land (FeatureCollection | Feature | Polygon | MultiPolygon). If omitted it is fetched from landUrl. */
  land?: any
  /** tried in order; default = /data/ne_110m_land.json then the Natural Earth GitHub copy */
  landUrl?: string | string[]
  /** default: Kolkata Office. Pass null for no marker. */
  marker?: GlobeMarker | null
  onMarkerClick?: () => void
  onError?: (e: unknown) => void
  /** angular spacing of the halftone dots in degrees (default 1.4). Bigger = fewer dots = faster */
  dotSpacingDeg?: number
  /** auto-rotation speed, degrees per second (default 14) */
  rotateDegPerSec?: number
  /** cap for devicePixelRatio (default 2) */
  maxDpr?: number
  /** hold still while the page scrolls (default true) */
  pauseOnScroll?: boolean
  colors?: Partial<GlobeColors>
}

export interface DottedGlobeHandle {
  setPaused(paused: boolean): void
  destroy(): void
  /** debug/test helpers */
  setRotation(lambda: number, phi: number): void
  markerScreenPos(): { x: number; y: number; visible: boolean } | null
  stats(): { dots: number; renders: number; lastRenderMs: number; size: number }
}

const D2R = Math.PI / 180
const TAU = Math.PI * 2
const KOLKATA: GlobeMarker = { lng: 88.419, lat: 22.576, label: "Kolkata Office" }
const DEFAULT_LAND_URLS = [
  "/data/ne_110m_land.json",
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json",
]
const DEFAULT_COLORS: GlobeColors = {
  ocean: "#000000",
  rim: "rgba(255,255,255,0.38)",
  graticule: "rgba(255,255,255,0.07)",
  landLine: "rgba(255,255,255,0.28)",
  dot: "190,196,204",
  marker: "#34d399",
}

// ------------------------------------------------------------------ land → dots (one-time)
type Ring = number[][]
function polygonsOf(land: any): Ring[][] {
  const out: Ring[][] = []
  const visit = (g: any) => {
    if (!g) return
    if (g.type === "FeatureCollection") g.features.forEach((f: any) => visit(f.geometry))
    else if (g.type === "Feature") visit(g.geometry)
    else if (g.type === "Polygon") out.push(g.coordinates)
    else if (g.type === "MultiPolygon") g.coordinates.forEach((p: Ring[]) => out.push(p))
    else if (g.type === "GeometryCollection") g.geometries.forEach(visit)
  }
  visit(land)
  return out
}
function ringContains(ring: Ring, x: number, y: number): boolean {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0], yi = ring[i][1], xj = ring[j][0], yj = ring[j][1]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
/** Equal-area-ish lattice (longitude step widens toward the poles) → uniform dot density, no pole crowding. */
function buildDots(land: any, spacing: number): Float32Array {
  const polys = polygonsOf(land).map((rings) => {
    let x0 = 180, x1 = -180, y0 = 90, y1 = -90
    for (const [x, y] of rings[0]) {
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
    return { rings, x0, x1, y0, y1 }
  })
  const buf: number[] = []
  let row = 0
  for (let lat = -88; lat <= 88; lat += spacing, row++) {
    const cl = Math.cos(lat * D2R)
    const n = Math.max(1, Math.round((360 * cl) / spacing))
    const step = 360 / n
    for (let k = 0; k < n; k++) {
      const lon = -180 + (k + (row % 2) * 0.5) * step
      let land_ = false
      for (const p of polys) {
        if (lon < p.x0 || lon > p.x1 || lat < p.y0 || lat > p.y1) continue
        if (!ringContains(p.rings[0], lon, lat)) continue
        let hole = false
        for (let h = 1; h < p.rings.length; h++) if (ringContains(p.rings[h], lon, lat)) { hole = true; break }
        if (!hole) { land_ = true; break }
      }
      if (land_) buf.push(Math.cos(lat * D2R), Math.sin(lat * D2R), Math.cos(lon * D2R), Math.sin(lon * D2R))
    }
  }
  return new Float32Array(buf)
}

// ------------------------------------------------------------------ mount
export function mountDottedGlobe(host: HTMLElement, options: DottedGlobeOptions = {}): DottedGlobeHandle {
  const marker = options.marker === undefined ? KOLKATA : options.marker
  const col: GlobeColors = { ...DEFAULT_COLORS, ...(options.colors || {}) }
  const spacing = options.dotSpacingDeg ?? 1.4
  const reduceMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches
  const speed = reduceMotion ? 0 : options.rotateDegPerSec ?? 14
  const maxDpr = options.maxDpr ?? 2
  const pauseOnScroll = options.pauseOnScroll ?? true

  // the host must be square, otherwise the canvas height would depend on itself; a square host = a round globe
  if (getComputedStyle(host).aspectRatio === "auto") host.style.aspectRatio = "1 / 1"
  const canvas = document.createElement("canvas")
  canvas.style.cssText = "display:block;margin:0 auto;touch-action:pan-y;cursor:grab;max-width:100%"
  host.appendChild(canvas)
  const ctx = canvas.getContext("2d")!

  // ---- state
  let S = 0, R = 0, cx = 0, cy = 0, dpr = 1
  // start facing India from the east so the marker glides across the front, tilted to 20°N
  let lam = -(marker ? marker.lng + 35 : 0), phi = -20
  let dots: Float32Array = new Float32Array(0)
  let land: any = null
  let renders = 0, lastRenderMs = 0
  let markerPos: { x: number; y: number; visible: boolean } | null = null
  let markerHit = { x: 0, y: 0, r: 0, lx: 0, ly: 0, lw: 0, lh: 0 }
  let labelW = 0

  const projection = d3.geoOrthographic().clipAngle(90).precision(1)
  const path = d3.geoPath(projection, ctx)
  const graticule = d3.geoGraticule().step([15, 15])()

  // ---- bucket buffers (4 depth bands → 4 fills)
  const ALPHAS = [0.22, 0.45, 0.7, 0.92]
  let bx: Float32Array[] = []
  let bn = [0, 0, 0, 0]

  function resize() {
    const w = host.clientWidth
    const h = host.clientHeight || w
    const side = Math.max(10, Math.floor(Math.min(w, h || w)))
    dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    if (side === S && canvas.width === Math.round(side * dpr)) return
    S = side
    canvas.width = Math.round(S * dpr)
    canvas.height = Math.round(S * dpr)
    canvas.style.width = S + "px" // width === height → a perfect circle, never an ellipse
    canvas.style.height = S + "px"
    R = S * 0.44
    cx = cy = S / 2
    projection.scale(R).translate([cx, cy])
    renderOnce()
  }

  // ---- render
  function render(now: number) {
    const t0 = performance.now()
    const cl = Math.cos(lam * D2R), sl = Math.sin(lam * D2R), cp = Math.cos(phi * D2R), sp = Math.sin(phi * D2R)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, S, S)

    // sphere + rim
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, TAU)
    ctx.fillStyle = col.ocean
    ctx.fill()

    projection.rotate([lam, phi, 0])
    ctx.beginPath()
    path(graticule)
    ctx.strokeStyle = col.graticule
    ctx.lineWidth = 0.7
    ctx.stroke()
    if (land) {
      ctx.beginPath()
      path(land)
      ctx.strokeStyle = col.landLine
      ctx.lineWidth = 0.9
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, TAU)
    ctx.strokeStyle = col.rim
    ctx.lineWidth = 1.4
    ctx.stroke()

    // halftone dots: rotate unit vectors, drop the far hemisphere, bucket by depth
    const n = dots.length / 4
    if (bx.length !== 4 || bx[0].length < n * 2) bx = [0, 1, 2, 3].map(() => new Float32Array(n * 2 + 8))
    bn = [0, 0, 0, 0]
    for (let i = 0; i < n; i++) {
      const o = i * 4
      const cLat = dots[o], sLat = dots[o + 1], cLon = dots[o + 2], sLon = dots[o + 3]
      const c = cLon * cl - sLon * sl // cos(lon+λ)
      const s = sLon * cl + cLon * sl // sin(lon+λ)
      const x = c * cLat, y = s * cLat, z = sLat
      const depth = x * cp - z * sp // toward the viewer; <= 0 → far side, skip (this is the ghost-dot fix)
      if (depth <= 0) continue
      const b = depth < 0.15 ? 0 : depth < 0.4 ? 1 : depth < 0.7 ? 2 : 3
      const k = bn[b]++ * 2
      bx[b][k] = cx + R * y
      bx[b][k + 1] = cy - R * (z * cp + x * sp)
    }
    const r = Math.max(0.9, R * 0.0055)
    for (let b = 0; b < 4; b++) {
      if (!bn[b]) continue
      ctx.beginPath()
      const arr = bx[b]
      for (let k = 0; k < bn[b] * 2; k += 2) {
        ctx.moveTo(arr[k] + r, arr[k + 1])
        ctx.arc(arr[k], arr[k + 1], r, 0, TAU)
      }
      ctx.fillStyle = `rgba(${col.dot},${ALPHAS[b]})`
      ctx.fill()
    }

    // the ONE marker — same rotation math as the dots, so it is locked to India at every angle
    markerPos = null
    if (marker) {
      const la = marker.lat * D2R, lo = marker.lng * D2R
      const cLat = Math.cos(la), sLat = Math.sin(la)
      const c = Math.cos(lo) * cl - Math.sin(lo) * sl
      const s = Math.sin(lo) * cl + Math.cos(lo) * sl
      const x = c * cLat, y = s * cLat, z = sLat
      const depth = x * cp - z * sp
      const mx = cx + R * y
      const my = cy - R * (z * cp + x * sp)
      markerPos = { x: mx, y: my, visible: depth > 0 }
      if (depth > 0) {
        const a = Math.min(1, depth * 5) // fades out smoothly at the limb instead of popping
        const p = (now % 1800) / 1800
        ctx.globalAlpha = a
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 18)
        g.addColorStop(0, "rgba(52,211,153,0.55)")
        g.addColorStop(1, "rgba(52,211,153,0)")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(mx, my, 18, 0, TAU)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(mx, my, 5 + 13 * p, 0, TAU)
        ctx.strokeStyle = `rgba(52,211,153,${0.55 * (1 - p)})`
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(mx, my, 4.2, 0, TAU)
        ctx.fillStyle = col.marker
        ctx.fill()
        ctx.lineWidth = 1.6
        ctx.strokeStyle = "#fff"
        ctx.stroke()

        // label chip
        ctx.font = "600 12px system-ui, -apple-system, 'Segoe UI', sans-serif"
        if (!labelW) labelW = ctx.measureText(marker.label).width
        const lw = labelW + 22, lh = 24
        let lx = mx + 12
        if (lx + lw > S - 4) lx = mx - 12 - lw // flip to the left near the canvas edge
        const ly = my - lh / 2
        ctx.beginPath()
        ctx.roundRect(lx, ly, lw, lh, 12)
        ctx.fillStyle = "rgba(6,12,10,0.86)"
        ctx.fill()
        ctx.strokeStyle = "rgba(52,211,153,0.55)"
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.fillStyle = "#fff"
        ctx.textBaseline = "middle"
        ctx.fillText(marker.label, lx + 11, ly + lh / 2 + 0.5)
        ctx.globalAlpha = 1
        markerHit = { x: mx, y: my, r: 16, lx, ly, lw, lh }
      } else markerHit = { x: -999, y: -999, r: 0, lx: -999, ly: -999, lw: 0, lh: 0 }
    }
    renders++
    lastRenderMs = performance.now() - t0
  }
  function renderOnce() {
    if (S) render(performance.now())
  }
  function hitMarker(px: number, py: number) {
    if (!markerPos?.visible) return false
    const dx = px - markerHit.x, dy = py - markerHit.y
    if (dx * dx + dy * dy <= markerHit.r * markerHit.r) return true
    return px >= markerHit.lx && px <= markerHit.lx + markerHit.lw && py >= markerHit.ly && py <= markerHit.ly + markerHit.lh
  }

  // ---- scheduler: runs only when visible + tab visible + not paused; holds still while the page scrolls
  let raf = 0, last = 0, inView = true, tabVisible = !document.hidden, paused = false
  let dragging = false, idleUntil = 0, scrollUntil = 0, vel = 0
  const shouldRun = () => inView && tabVisible && !paused
  function loop(now: number) {
    raf = 0
    if (!shouldRun()) return
    const dt = Math.min(50, now - last)
    last = now
    if (!(pauseOnScroll && now < scrollUntil)) {
      if (!dragging) {
        if (Math.abs(vel) > 1) {
          lam += (vel * dt) / 1000
          vel *= Math.exp(-dt / 350) // inertia after a flick
        } else if (now >= idleUntil) lam += (speed * dt) / 1000
      }
      render(now)
    }
    raf = requestAnimationFrame(loop)
  }
  function start() {
    if (raf || !shouldRun()) return
    last = performance.now()
    raf = requestAnimationFrame(loop)
  }
  function stop() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  // ---- interaction (pointer events; NO wheel listener → page scroll is never hijacked)
  let sx = 0, sy = 0, lx = 0, ly = 0, lt = 0, moved = 0
  const localXY = (e: PointerEvent) => {
    const b = canvas.getBoundingClientRect()
    return [e.clientX - b.left, e.clientY - b.top] as const
  }
  const onDown = (e: PointerEvent) => {
    dragging = true
    moved = 0
    sx = lx = e.clientX
    sy = ly = e.clientY
    lt = performance.now()
    vel = 0
    canvas.setPointerCapture(e.pointerId)
    canvas.style.cursor = "grabbing"
  }
  const onMove = (e: PointerEvent) => {
    if (!dragging) {
      const [px, py] = localXY(e)
      canvas.style.cursor = hitMarker(px, py) ? "pointer" : "grab"
      return
    }
    const dx = e.clientX - lx, dy = e.clientY - ly
    moved = Math.max(moved, Math.hypot(e.clientX - sx, e.clientY - sy))
    lam += dx * 0.3
    phi = Math.max(-75, Math.min(75, phi - dy * 0.3))
    const now = performance.now()
    vel = (dx * 0.3 * 1000) / Math.max(8, now - lt)
    lx = e.clientX
    ly = e.clientY
    lt = now
    if (!raf) renderOnce()
  }
  const onUp = (e: PointerEvent) => {
    if (!dragging) return
    dragging = false
    canvas.style.cursor = "grab"
    idleUntil = performance.now() + 1200
    if (performance.now() - lt > 80) vel = 0
    if (moved < 5) {
      const [px, py] = localXY(e)
      if (hitMarker(px, py)) options.onMarkerClick?.()
    }
  }
  canvas.addEventListener("pointerdown", onDown)
  canvas.addEventListener("pointermove", onMove)
  canvas.addEventListener("pointerup", onUp)
  canvas.addEventListener("pointercancel", onUp)

  const onScroll = () => {
    scrollUntil = performance.now() + 160
  }
  if (pauseOnScroll) window.addEventListener("scroll", onScroll, { passive: true })
  const onVis = () => {
    tabVisible = !document.hidden
    tabVisible ? start() : stop()
  }
  document.addEventListener("visibilitychange", onVis)
  const io = new IntersectionObserver(
    (es) => {
      inView = es[es.length - 1].isIntersecting
      inView ? start() : stop()
    },
    { rootMargin: "120px" },
  )
  io.observe(host)
  const ro = new ResizeObserver(() => resize())
  ro.observe(host)

  // ---- land data
  const ready = (async () => {
    try {
      let data = options.land
      if (!data) {
        const urls = options.landUrl ? ([] as string[]).concat(options.landUrl) : DEFAULT_LAND_URLS
        let err: unknown
        for (const u of urls) {
          try {
            const res = await fetch(u)
            if (!res.ok) throw new Error(`${u}: ${res.status}`)
            data = await res.json()
            break
          } catch (e) {
            err = e
          }
        }
        if (!data) throw err
      }
      land = data
      dots = buildDots(data, spacing)
    } catch (e) {
      options.onError?.(e)
    }
    renderOnce()
    start()
  })()
  resize()
  void ready

  return {
    setPaused(p: boolean) {
      paused = p
      p ? stop() : start()
    },
    destroy() {
      stop()
      io.disconnect()
      ro.disconnect()

      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", onVis)
      canvas.remove()
    },
    setRotation(l: number, p: number) {
      lam = l
      phi = p
      renderOnce()
    },
    markerScreenPos: () => markerPos,
    stats: () => ({ dots: dots.length / 4, renders, lastRenderMs, size: S }),
  }
}

/**
 * Round, smooth, dotted globe with ONE "Kolkata Office" marker.
 *   <RotatingEarth className="w-full max-w-[640px]" onMarkerClick={() => setMapOpen(true)} paused={mapOpen} />
 * - paused: stop rendering while the expanded map is open (saves CPU)
 * - Land data: /data/ne_110m_land.json (put it in public/data) with a Natural Earth GitHub fallback
 * - The wheel is never captured, so page scrolling / Lenis stay smooth over the globe.
 */
export default function RotatingEarth({
  className = "",
  paused = false,
  onMarkerClick,
  width,
  height,
  ...options
}: {
  className?: string
  paused?: boolean
  onMarkerClick?: () => void
  width?: number
  height?: number
} & Omit<DottedGlobeOptions, "onMarkerClick">) {
  const hostRef = useRef<HTMLDivElement>(null)
  const handle = useRef<DottedGlobeHandle | null>(null)
  const clickRef = useRef(onMarkerClick)
  clickRef.current = onMarkerClick // always call the latest callback without remounting the canvas

  useEffect(() => {
    if (!hostRef.current) return
    const h = mountDottedGlobe(hostRef.current, { ...options, onMarkerClick: () => clickRef.current?.() })
    handle.current = h
    return () => {
      h.destroy()
      handle.current = null
    }
    // mount once; options are read at mount time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    handle.current?.setPaused(paused)
  }, [paused])

  // square host → the canvas is a perfect circle
  return <div ref={hostRef} className={className} style={{ aspectRatio: "1 / 1", width: "100%" }} />
}

export const DottedGlobe = RotatingEarth

