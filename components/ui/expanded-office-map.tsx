"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ArrowLeft, X, MapPin, ExternalLink, Compass } from "lucide-react";

interface ExpandedOfficeMapProps {
  onClose: () => void;
  className?: string;
}

export default function ExpandedOfficeMap({ onClose, className = "" }: ExpandedOfficeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const KOLKATA_COORDS: [number, number] = [88.419, 22.576]; // [lng, lat]

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let isMounted = true;
    let fallbackTimeout: NodeJS.Timeout | null = null;

    // Wait for container to be measured in DOM
    const initTimer = setTimeout(() => {
      if (!mapContainerRef.current || !isMounted) return;

      const container = mapContainerRef.current;
      const CARTO_DARK_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

      const FALLBACK_RASTER_STYLE: any = {
        version: 8,
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-tiles-layer",
            type: "raster",
            source: "osm-tiles",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      };

      try {
        const map = new maplibregl.Map({
          container: container,
          style: CARTO_DARK_STYLE,
          center: KOLKATA_COORDS,
          zoom: 16.5,
          pitch: 25,
          bearing: -10,
          scrollZoom: false, // Don't hijack page scroll unless user focuses
          attributionControl: { compact: true },
        });

        mapInstanceRef.current = map;

        // Fallback watchdog: if CARTO fails or takes > 3.5s, switch to dark raster OSM style
        fallbackTimeout = setTimeout(() => {
          if (isMounted && !map.isStyleLoaded()) {
            console.warn("CARTO GL style load timeout; switching to OSM raster fallback");
            setUsingFallback(true);
            map.setStyle(FALLBACK_RASTER_STYLE);
          }
        }, 3500);

        map.on("error", (e) => {
          console.warn("MapLibre event error:", e.error?.message);
          if (!mapLoaded && isMounted) {
            setUsingFallback(true);
            try {
              map.setStyle(FALLBACK_RASTER_STYLE);
            } catch (err) {
              console.error("Failed setting fallback style", err);
            }
          }
        });

        // Add navigation controls (zoom in/out, compass)
        map.addControl(new maplibregl.NavigationControl({ showCompass: true, visualizePitch: true }), "bottom-right");

        // Enable scroll zoom on click/focus
        map.on("click", () => {
          map.scrollZoom.enable();
        });

        map.on("load", () => {
          if (!isMounted) return;
          if (fallbackTimeout) clearTimeout(fallbackTimeout);
          setMapLoaded(true);
          map.resize();

          // Create custom mint pulsing marker element
          const el = document.createElement("div");
          el.className = "relative flex items-center justify-center cursor-pointer";
          el.style.width = "40px";
          el.style.height = "40px";
          el.innerHTML = `
            <div class="absolute w-10 h-10 rounded-full bg-emerald-500/20 animate-ping"></div>
            <div class="absolute w-6 h-6 rounded-full bg-emerald-500/40 border border-emerald-400/60"></div>
            <div class="relative w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-lg"></div>
          `;

          // Custom dark glass popup
          const popup = new maplibregl.Popup({
            offset: 20,
            closeButton: false,
            className: "evia-custom-popup",
            maxWidth: "320px",
          }).setHTML(`
            <div style="background: rgba(14, 14, 16, 0.95); backdrop-filter: blur(12px); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 12px; padding: 12px 14px; color: #fff; font-family: 'Inter', sans-serif;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 9999px; background: #34d399;"></span>
                <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #34d399;">Kolkata Office</span>
              </div>
              <div style="font-size: 13px; font-weight: 600; line-height: 1.4; color: #ffffff; margin-bottom: 4px;">
                Evia Wealth Private Limited
              </div>
              <div style="font-size: 11px; line-height: 1.5; color: rgba(255, 255, 255, 0.7);">
                Unit 521, 5th Floor, Regus Offices, Salt Lake Sector V, Bidhannagar, P.S Electronics Complex - 700091
              </div>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: rgba(255, 255, 255, 0.5);">
                <span>Phone: +91 9330183973</span>
                <span style="color: #34d399;">Active Office &bull;</span>
              </div>
            </div>
          `);

          new maplibregl.Marker({ element: el })
            .setLngLat(KOLKATA_COORDS)
            .setPopup(popup)
            .addTo(map);

          // Auto open popup after a brief moment
          setTimeout(() => {
            if (isMounted) {
              popup.addTo(map);
            }
          }, 300);
        });

        // ResizeObserver to ensure map fits perfectly when window or container size changes
        const resizeObserver = new ResizeObserver(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.resize();
          }
        });
        resizeObserver.observe(container);

        // Immediate and delayed resize passes
        requestAnimationFrame(() => map.resize());
        setTimeout(() => map.resize(), 150);
        setTimeout(() => map.resize(), 500);

      } catch (err) {
        console.error("Failed to construct MapLibre map:", err);
      }
    }, 40);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      data-lenis-prevent
      className={`relative w-full h-[520px] md:h-[560px] bg-black border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col ${className}`}
    >
      {/* Map Header Panel */}
      <div className="relative z-10 flex items-center justify-between px-5 py-3.5 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-200 border border-white/10 hover:border-emerald-500/40 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-400 transition-colors" />
            <span>Back to Globe</span>
          </button>
          <div className="h-4 w-[1px] bg-white/15 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs md:text-sm font-semibold text-white tracking-tight">
              Salt Lake Sector V, Kolkata
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[11px] text-neutral-400 bg-neutral-900/80 px-2.5 py-1 rounded-full border border-white/5">
            HQ Advisory Suite
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Close map"
            aria-label="Close map"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative flex-1 w-full h-full">
        <div
          ref={mapContainerRef}
          className={`w-full h-full ${usingFallback ? "filter contrast-110 brightness-90 invert hue-rotate-180" : ""}`}
        />

        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xs gap-3">
            <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
            <span className="text-xs text-neutral-400 font-medium tracking-wide">
              Loading street view & cartography...
            </span>
          </div>
        )}

        {/* Map overlay controls hint */}
        <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-[11px] text-neutral-400 max-w-[280px] shadow-lg pointer-events-none hidden sm:block">
          <div className="flex items-center gap-1.5 font-medium text-white mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Salt Lake Sector V, Kolkata</span>
          </div>
          <p className="text-[10px] text-neutral-400 leading-relaxed">
            Unit 521, 5th Floor, Regus Offices, Salt Lake Sector V, Bidhannagar, P.S Electronics Complex - 700091
          </p>
        </div>
      </div>
    </div>
  );
}
