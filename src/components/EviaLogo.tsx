import React from "react";

interface EviaLogoProps {
  className?: string;
  iconOnly?: boolean;
  lightText?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Pure SVG representation of the premium golden wing icon from LOGO 1.png
 */
export function EviaLogoMark({ className = "w-9 h-9", colorGrad = "url(#evia-gold-gradient)" }: { className?: string; colorGrad?: string }) {
  return (
    <svg
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="evia-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9a761e" />
          <stop offset="25%" stopColor="#dfba48" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="75%" stopColor="#cdb864" />
          <stop offset="100%" stopColor="#9a761e" />
        </linearGradient>
      </defs>

      {/* Swoosh 1 (Top / Outer Wing) */}
      <path
        d="M 32 110 C 26 90, 31 52, 60 21 C 72 8, 86 2, 94 0 C 87 11, 78 28, 64 45 C 50 62, 42 81, 42 98 C 42 104, 43 107, 41 109 C 39 111, 35 111, 32 110 Z"
        fill={colorGrad}
      />

      {/* Swoosh 2 (Middle Wing) */}
      <path
        d="M 35 112 C 32 98, 36 74, 58 48 C 68 36, 80 30, 89 25 C 81 33, 73 45, 62 59 C 50 74, 45 89, 45 102 C 45 105, 46 108, 44 110 C 42 112, 38 113, 35 112 Z"
        fill={colorGrad}
      />

      {/* Swoosh 3 (Bottom Wing) */}
      <path
        d="M 40 114 C 38 104, 42 89, 56 71 C 63 63, 71 58, 77 54 C 71 60, 64 68, 56 78 C 49 88, 47 98, 47 106 C 47 108, 48 110, 46 111 C 44 112, 42 113, 40 114 Z"
        fill={colorGrad}
      />
    </svg>
  );
}

/**
 * Full Brand Logo Lockup featuring the Golden Wings and Serif Text (EVIA WEALTH - YOUR WEALTH ARTIST)
 */
export default function EviaLogo({ className = "", iconOnly = false, lightText = true, size = "md" }: EviaLogoProps) {
  // Proportional scaling
  const iconSizeClass =
    size === "sm"
      ? "w-7 h-7"
      : size === "lg"
      ? "w-14 h-14 md:w-16 md:h-16"
      : "w-9 h-9 md:w-10 md:h-10";

  if (iconOnly) {
    return <EviaLogoMark className={`${iconSizeClass} ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-3.5 select-none text-left ${className}`}>
      {/* Golden Wing Symbol */}
      <EviaLogoMark className={iconSizeClass} />

      {/* Premium Luxury Typography Lockup */}
      <div className="flex flex-col justify-center">
        {/* EVIA in Serif Luxury Display */}
        <span
          className={`font-serif font-medium leading-none tracking-[0.18em] transition-colors ${
            size === "sm"
              ? "text-[16px]"
              : size === "lg"
              ? "text-[28px] md:text-[34px] tracking-[0.2em]"
              : "text-[19px] md:text-[21px]"
          } ${lightText ? "text-white" : "text-black"}`}
          style={{ fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif" }}
        >
          EVIA
        </span>

        {/* — WEALTH — in gold/yellow serif */}
        <div className="flex items-center justify-center gap-1.5 -mt-0.5">
          <div className={`h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]/60 ${size === "lg" ? "w-8" : "w-4"}`} />
          <span
            className={`font-serif font-bold uppercase tracking-[0.25em] text-[#d4af37] ${
              size === "sm" ? "text-[8px]" : size === "lg" ? "text-[12px] md:text-[14px]" : "text-[10px] md:text-[11px]"
            }`}
            style={{ fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif" }}
          >
            WEALTH
          </span>
          <div className={`h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]/60 ${size === "lg" ? "w-8" : "w-4"}`} />
        </div>

        {/* YOUR WEALTH ARTIST in tracked-out modern caps */}
        <span
          className={`font-sans font-semibold uppercase tracking-[0.38em] text-neutral-500 mt-1 ${
            size === "sm" ? "text-[5px]" : size === "lg" ? "text-[8px] md:text-[9px]" : "text-[6px] md:text-[7px]"
          }`}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          YOUR WEALTH ARTIST
        </span>
      </div>
    </div>
  );
}
