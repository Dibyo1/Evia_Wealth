import React, { useState } from "react";
import { User } from "lucide-react";

interface PersonPhotoProps {
  src?: string;
  initials: string;
  name: string;
  size?: "md" | "lg" | "xl";
  className?: string;
}

export default function PersonPhoto({
  src,
  initials,
  name,
  size = "lg",
  className = "",
}: PersonPhotoProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const dimensionClasses =
    size === "xl"
      ? "w-[160px] h-[160px] sm:w-[176px] sm:h-[176px] text-[36px]"
      : size === "lg"
      ? "w-28 h-28 sm:w-36 sm:h-36 text-[26px]"
      : "w-20 h-20 sm:w-24 sm:h-24 text-[18px]";

  const hasValidPhoto = Boolean(src && src.trim().length > 0 && !imageFailed);

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 border-2 border-[#d4af37]/40 shadow-[0_4px_24px_rgba(0,0,0,0.8)] ${dimensionClasses} ${className}`}
      style={{
        boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.3), 0 10px 30px rgba(0, 0, 0, 0.8)",
      }}
    >
      <style>{`
        .person-photo-effect {
          filter: grayscale(100%);
          transition: filter 350ms ease, transform 350ms ease;
        }
        @media (hover: hover) {
          .group:hover .person-photo-effect,
          .person-photo-effect:hover {
            filter: grayscale(0%);
            transform: scale(1.05);
          }
        }
      `}</style>

      {hasValidPhoto ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover object-center person-photo-effect"
        />
      ) : (
        /* Neutral Placeholder: Dark gold-tinted gradient background with initials and subtle silhouette watermark */
        <div className="w-full h-full person-photo-effect bg-gradient-to-br from-[#241e10] via-[#17140b] to-[#0c0b08] flex items-center justify-center relative select-none">
          {/* Subtle inner gold sheen / radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_70%)] pointer-events-none" />

          {/* Background subtle User silhouette */}
          <User
            className={`absolute text-[#d4af37]/10 pointer-events-none ${
              size === "lg" ? "w-20 h-20" : "w-12 h-12"
            }`}
            strokeWidth={1.2}
          />

          {/* Distinct Initials */}
          <span
            className="relative z-10 font-bold tracking-widest text-[#f5e8b7] uppercase font-sans drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            title={name}
          >
            {initials}
          </span>
        </div>
      )}
    </div>
  );
}
