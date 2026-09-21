"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";

interface RotatingEarthProps {
  width?: number;
  height?: number;
  className?: string;
  onMarkerClick?: () => void;
  paused?: boolean;
}

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
  onMarkerClick,
  paused = false,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Geographic coordinates for Kolkata [longitude, latitude]
  const KOLKATA_COORDS: [number, number] = [88.419, 22.576];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // Set up responsive dimensions
    const containerWidth = Math.min(width, window.innerWidth - 40);
    const containerHeight = Math.min(height, window.innerHeight - 100);
    const radius = Math.min(containerWidth, containerHeight) / 2.45;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    // Create orthographic projection and path generator
    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point;
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }

      return inside;
    };

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry;

      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates;
        if (!pointInPolygon(point, coordinates[0])) {
          return false;
        }
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) {
            return false;
          }
        }
        return true;
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) {
              return true;
            }
          }
        }
        return false;
      }

      return false;
    };

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;

      const stepSize = dotSpacing * 0.08;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) {
            dots.push(point);
          }
        }
      }

      return dots;
    };

    interface DotData {
      lng: number;
      lat: number;
    }

    const allDots: DotData[] = [];
    let landFeatures: any = null;

    // Helper: Front-side visibility test (culls points on the hidden hemisphere)
    const isFrontFacing = (lng: number, lat: number): boolean => {
      const rot = projection.rotate();
      const center: [number, number] = [-rot[0], -rot[1]];
      return d3.geoDistance([lng, lat], center) < Math.PI / 2;
    };

    let lastMarkerPos: [number, number] | null = null;
    let isMarkerVisible = false;

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      // Draw ocean (globe sphere)
      context.beginPath();
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI);
      context.fillStyle = "#09090b";
      context.fill();
      context.strokeStyle = "rgba(255, 255, 255, 0.15)";
      context.lineWidth = 1.5 * scaleFactor;
      context.stroke();

      // Atmospheric glow rim
      const rimGrad = context.createRadialGradient(
        containerWidth / 2,
        containerHeight / 2,
        currentScale * 0.85,
        containerWidth / 2,
        containerHeight / 2,
        currentScale * 1.03
      );
      rimGrad.addColorStop(0, "rgba(52, 211, 153, 0)");
      rimGrad.addColorStop(1, "rgba(52, 211, 153, 0.12)");
      context.beginPath();
      context.arc(containerWidth / 2, containerHeight / 2, currentScale * 1.02, 0, 2 * Math.PI);
      context.fillStyle = rimGrad;
      context.fill();

      if (landFeatures) {
        // Draw graticule
        const graticule = d3.geoGraticule().step([20, 20]);
        context.beginPath();
        path(graticule());
        context.strokeStyle = "rgba(255, 255, 255, 0.07)";
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        // Draw land outlines
        context.beginPath();
        landFeatures.features.forEach((feature: any) => {
          path(feature);
        });
        context.strokeStyle = "rgba(255, 255, 255, 0.22)";
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        // Draw halftone dots with back-hemisphere culling (Fixes mirrored land bug)
        allDots.forEach((dot) => {
          if (isFrontFacing(dot.lng, dot.lat)) {
            const projected = projection([dot.lng, dot.lat]);
            if (
              projected &&
              projected[0] >= 0 &&
              projected[0] <= containerWidth &&
              projected[1] >= 0 &&
              projected[1] <= containerHeight
            ) {
              context.beginPath();
              context.arc(projected[0], projected[1], 1.15 * scaleFactor, 0, 2 * Math.PI);
              context.fillStyle = "rgba(255, 255, 255, 0.4)";
              context.fill();
            }
          }
        });
      }

      // Draw EXACTLY ONE Kolkata Office marker locked to coordinates [88.419, 22.576]
      const rot = projection.rotate();
      const center: [number, number] = [-rot[0], -rot[1]];
      const angDist = d3.geoDistance(KOLKATA_COORDS, center);
      isMarkerVisible = angDist < Math.PI / 2;

      if (isMarkerVisible) {
        const p = projection(KOLKATA_COORDS);
        if (p) {
          lastMarkerPos = [p[0], p[1]];
          // Smooth fade near the limb
          const limbOpacity = Math.max(0, Math.cos(angDist));

          const now = performance.now();
          const pulsePhase = (now % 2200) / 2200;
          const pulseRadius = (5 + pulsePhase * 18) * scaleFactor;
          const pulseAlpha = (1 - pulsePhase) * 0.75 * limbOpacity;

          // Outer pulse ring
          context.beginPath();
          context.arc(p[0], p[1], pulseRadius, 0, 2 * Math.PI);
          context.strokeStyle = `rgba(52, 211, 153, ${pulseAlpha})`;
          context.lineWidth = 1.6 * scaleFactor;
          context.stroke();

          // Soft radial glow
          const glowGrad = context.createRadialGradient(
            p[0],
            p[1],
            0,
            p[0],
            p[1],
            14 * scaleFactor
          );
          glowGrad.addColorStop(0, `rgba(52, 211, 153, ${0.85 * limbOpacity})`);
          glowGrad.addColorStop(0.5, `rgba(52, 211, 153, ${0.35 * limbOpacity})`);
          glowGrad.addColorStop(1, "rgba(52, 211, 153, 0)");
          context.fillStyle = glowGrad;
          context.beginPath();
          context.arc(p[0], p[1], 14 * scaleFactor, 0, 2 * Math.PI);
          context.fill();

          // Solid mint dot with crisp white border
          context.beginPath();
          context.arc(p[0], p[1], 4.5 * scaleFactor, 0, 2 * Math.PI);
          context.fillStyle = "#34d399";
          context.fill();
          context.strokeStyle = "#ffffff";
          context.lineWidth = 1.75 * scaleFactor;
          context.stroke();

          // Interactive Chip: "Kolkata Office"
          context.save();
          context.globalAlpha = limbOpacity;

          const labelText = "Kolkata Office";
          const fontSize = Math.max(11, Math.round(12 * scaleFactor));
          context.font = `600 ${fontSize}px Inter, sans-serif`;
          const metrics = context.measureText(labelText);

          const chipHeight = 22 * scaleFactor;
          const chipWidth = metrics.width + 16 * scaleFactor;
          const chipX = p[0] + 12 * scaleFactor;
          const chipY = p[1] - chipHeight / 2;

          // Chip rounded background
          context.fillStyle = "rgba(10, 10, 12, 0.9)";
          context.beginPath();
          if (context.roundRect) {
            context.roundRect(chipX, chipY, chipWidth, chipHeight, 6 * scaleFactor);
          } else {
            context.rect(chipX, chipY, chipWidth, chipHeight);
          }
          context.fill();
          context.strokeStyle = "rgba(52, 211, 153, 0.6)";
          context.lineWidth = 1;
          context.stroke();

          // Chip indicator dot
          context.beginPath();
          context.arc(chipX + 7 * scaleFactor, chipY + chipHeight / 2, 2.5 * scaleFactor, 0, 2 * Math.PI);
          context.fillStyle = "#34d399";
          context.fill();

          // Chip text
          context.fillStyle = "#ffffff";
          context.textBaseline = "middle";
          context.fillText(labelText, chipX + 13 * scaleFactor, chipY + chipHeight / 2);

          context.restore();
        }
      } else {
        lastMarkerPos = null;
      }
    };

    const loadWorldData = async () => {
      try {
        setIsLoading(true);

        // Try local offline GeoJSON first for instant reliability, fallback to raw github
        let response: Response | null = null;
        try {
          response = await fetch("/data/ne_110m_land.json");
        } catch {
          // ignore
        }

        if (!response || !response.ok) {
          response = await fetch(
            "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
          );
        }

        if (!response.ok) throw new Error("Failed to load land data");

        landFeatures = await response.json();

        // Generate dots for all land features
        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16);
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat });
          });
        });

        render();
        setIsLoading(false);
      } catch (err: any) {
        console.warn("Globe data loading fallback:", err?.message);
        setError("Failed to load land map data");
        setIsLoading(false);
      }
    };

    // Rotation state: initial rotation centering near India [lng: ~ -78, lat: ~ -20]
    const rotation: [number, number] = [-78, -20];
    projection.rotate(rotation);

    let autoRotate = true;
    let isDragging = false;
    const SPEED_DEG_PER_MS = 0.016; // ~16 deg/sec for smooth non-jittery rotation
    let lastTime = performance.now();
    let rotationTimer: d3.Timer | null = null;

    const rotate = () => {
      const now = performance.now();
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      if (autoRotate && !isDragging && !paused) {
        rotation[0] += SPEED_DEG_PER_MS * dt;
        projection.rotate(rotation);
        render();
      } else if (!paused) {
        render(); // render pulse animation even when user is holding or static
      }
    };

    const startTimer = () => {
      if (!rotationTimer) {
        lastTime = performance.now();
        rotationTimer = d3.timer(rotate);
      }
    };

    const stopTimer = () => {
      if (rotationTimer) {
        rotationTimer.stop();
        rotationTimer = null;
      }
    };

    // IntersectionObserver so D3 timer only runs when globe is on screen
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startTimer();
          } else {
            stopTimer();
          }
        }
      },
      { threshold: 0.05 }
    );
    visibilityObserver.observe(canvas);

    // Mouse & Touch interactions
    let startX = 0;
    let startY = 0;
    let startRotation = [...rotation];
    let pointerMoved = false;

    const getCanvasRelativePos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = containerWidth / rect.width;
      const scaleY = containerHeight / rect.height;
      return [(clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY];
    };

    const checkMarkerHit = (canvasX: number, canvasY: number): boolean => {
      if (!isMarkerVisible || !lastMarkerPos) return false;
      const [mx, my] = lastMarkerPos;
      // Allow clicking either the marker dot or the label chip area
      const dx = canvasX - mx;
      const dy = canvasY - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 24) return true;
      // Also check chip rectangle (right of marker)
      if (dx >= 0 && dx <= 110 && Math.abs(dy) <= 16) return true;
      return false;
    };

    const handlePointerDown = (clientX: number, clientY: number) => {
      autoRotate = false;
      isDragging = true;
      startX = clientX;
      startY = clientY;
      startRotation = [...rotation];
      pointerMoved = false;
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const [cx, cy] = getCanvasRelativePos(clientX, clientY);

      if (isDragging) {
        const dx = clientX - startX;
        const dy = clientY - startY;

        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
          pointerMoved = true;
        }

        const sensitivity = 0.35;
        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = startRotation[1] - dy * sensitivity;
        rotation[1] = Math.max(-85, Math.min(85, rotation[1]));

        projection.rotate(rotation);
        render();
      } else {
        // Update cursor to pointer if hovering over Kolkata marker
        if (checkMarkerHit(cx, cy)) {
          canvas.style.cursor = "pointer";
        } else {
          canvas.style.cursor = "grab";
        }
      }
    };

    const handlePointerUp = (clientX: number, clientY: number) => {
      const [cx, cy] = getCanvasRelativePos(clientX, clientY);
      const isClick = !pointerMoved;

      isDragging = false;

      if (isClick && checkMarkerHit(cx, cy)) {
        if (onMarkerClick) {
          onMarkerClick();
        }
      }

      // Resume auto rotation after brief pause
      setTimeout(() => {
        if (!isDragging) autoRotate = true;
      }, 1000);
    };

    // Mouse listeners
    const onMouseDown = (e: MouseEvent) => {
      handlePointerDown(e.clientX, e.clientY);
      canvas.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onMouseUp = (e: MouseEvent) => {
      handlePointerUp(e.clientX, e.clientY);
      canvas.style.cursor = "grab";
    };

    // Touch listeners
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handlePointerDown(touch.clientX, touch.clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        handlePointerMove(touch.clientX, touch.clientY);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        handlePointerUp(touch.clientX, touch.clientY);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const scaleDelta = event.deltaY > 0 ? 0.92 : 1.08;
      const newRadius = Math.max(radius * 0.7, Math.min(radius * 2.5, projection.scale() * scaleDelta));
      projection.scale(newRadius);
      render();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    // Load GeoJSON data
    loadWorldData();

    return () => {
      visibilityObserver.disconnect();
      stopTimer();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [width, height, onMarkerClick, paused]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-[#0e0e10] border border-white/10 rounded-2xl p-8 ${className}`}>
        <div className="text-center">
          <p className="text-rose-400 font-medium mb-1">Error loading Earth visualization</p>
          <p className="text-neutral-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-2xl bg-black transition-opacity duration-300"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Loading global network...
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 text-[11px] tracking-wide text-neutral-400 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 backdrop-blur-sm pointer-events-none flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Click Kolkata marker to expand map • Drag to rotate
      </div>
    </div>
  );
}
