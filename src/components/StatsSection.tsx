import React from "react";
import { motion } from "framer-motion";

interface StatItem {
  id: string;
  value: string;
  label: React.ReactNode;
  icon: React.ReactNode;
  delay: number;
}

// 1. Happy Clients: Group of people with 3 stars on top
function HappyClientsIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 text-white"
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* 3 Stars at the top */}
      {/* Center Top Star (prominent) */}
      <polygon
        points="32,6 33.6,10.6 38.5,10.6 34.6,13.4 36.1,18 32,15.1 27.9,18 29.4,13.4 25.5,10.6 30.4,10.6"
        strokeWidth="1.8"
      />
      {/* Left Star */}
      <polygon
        points="19,12 20.2,15.2 23.6,15.2 20.8,17.2 21.9,20.5 19,18.4 16.1,20.5 17.2,17.2 14.4,15.2 17.8,15.2"
        strokeWidth="1.6"
      />
      {/* Right Star */}
      <polygon
        points="45,12 46.2,15.2 49.6,15.2 46.8,17.2 47.9,20.5 45,18.4 42.1,20.5 43.2,17.2 40.4,15.2 43.8,15.2"
        strokeWidth="1.6"
      />

      {/* Center Person (Foreground) */}
      <circle cx="32" cy="31" r="5.5" strokeWidth="2.2" />
      <path d="M21 48 C21 41.5 25.8 38.5 32 38.5 C38.2 38.5 43 41.5 43 48" strokeWidth="2.2" />

      {/* Left Person (Background) */}
      <circle cx="17.5" cy="34" r="4.5" strokeWidth="2" />
      <path d="M9.5 50.5 C9.5 45 13.5 42 18 42 C19.8 42 21.4 42.6 22.8 43.8" strokeWidth="2" />

      {/* Right Person (Background) */}
      <circle cx="46.5" cy="34" r="4.5" strokeWidth="2" />
      <path d="M41.2 43.8 C42.6 42.6 44.2 42 46 42 C50.5 42 54.5 45 54.5 50.5" strokeWidth="2" />
    </svg>
  );
}

// 2. Business Partners: Globe with Handshake across the front
function BusinessPartnersIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 text-white"
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Globe Upper Hemisphere / Outlines */}
      <path
        d="M14.5 33.5 C13 30 12 26 12 22 C12 11 21 2 32 2 C43 2 52 11 52 22 C52 26 51 30 49.5 33.5"
        strokeWidth="2.2"
      />
      {/* Longitudinal Ellipse */}
      <path
        d="M24 33 C22.8 29.5 22 25.5 22 22 C22 11.5 26.5 3.5 32 3.5 C37.5 3.5 42 11.5 42 22 C42 25.5 41.2 29.5 40 33"
        strokeWidth="1.8"
      />
      {/* Center Meridian Line */}
      <line x1="32" y1="2" x2="32" y2="34" strokeWidth="1.8" />
      {/* Parallels / Latitudes */}
      <path d="M14.5 15 C20 17.5 44 17.5 49.5 15" strokeWidth="1.8" />
      <path d="M14.5 28 C20 26 44 26 49.5 28" strokeWidth="1.8" />

      {/* Handshake in Foreground */}
      {/* Left Sleeve / Cuff */}
      <path d="M10 50 L16 41 L22 45 L16 54 Z" strokeWidth="2" />
      {/* Right Sleeve / Cuff */}
      <path d="M54 50 L48 41 L42 45 L48 54 Z" strokeWidth="2" />

      {/* Clasping Hands */}
      <path d="M20 43.5 L26 39 C28 37.5 30.5 38.5 32 40 L34 42" strokeWidth="2" />
      <path d="M44 43.5 L38 39 C36 37.5 33.5 38.5 32 40 L30 42" strokeWidth="2" />
      {/* Interlocking Fingers Grip */}
      <path d="M27.5 44 C29.5 47.5 34.5 47.5 36.5 44" strokeWidth="2" />
      <path d="M29 46.5 C30.5 49 33.5 49 35 46.5" strokeWidth="1.8" />
    </svg>
  );
}

// 3. Years of Cumulative Experience: Person on top + 3 stars below
function CumulativeExperienceIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 text-white"
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Person Icon at top */}
      {/* Head */}
      <circle cx="32" cy="18" r="6.5" strokeWidth="2.2" />
      {/* Shoulders */}
      <path d="M18 36 C18 29 24 26.5 32 26.5 C40 26.5 46 29 46 36" strokeWidth="2.2" />

      {/* 3 Stars underneath the person */}
      {/* Left Star */}
      <polygon
        points="20,43 21.2,46.2 24.6,46.2 21.8,48.2 22.9,51.5 20,49.4 17.1,51.5 18.2,48.2 15.4,46.2 18.8,46.2"
        strokeWidth="1.7"
      />
      {/* Center Star */}
      <polygon
        points="32,41 33.5,45 37.8,45 34.3,47.5 35.6,51.5 32,49 28.4,51.5 29.7,47.5 26.2,45 30.5,45"
        strokeWidth="1.9"
      />
      {/* Right Star */}
      <polygon
        points="44,43 45.2,46.2 48.6,46.2 45.8,48.2 46.9,51.5 44,49.4 41.1,51.5 42.2,48.2 39.4,46.2 42.8,46.2"
        strokeWidth="1.7"
      />
    </svg>
  );
}

// 4. Accreditation: Award Medal with Star + 2 Ribbon Tails
function AccreditationIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 text-white"
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Circular Medallion */}
      <circle cx="32" cy="23" r="14.5" strokeWidth="2.2" />

      {/* 5-Pointed Star inside Medallion */}
      <polygon
        points="32,13 34.2,19.2 40.8,19.2 35.5,23 37.5,29.2 32,25.4 26.5,29.2 28.5,23 23.2,19.2 29.8,19.2"
        strokeWidth="1.8"
      />

      {/* Left Ribbon Tail with swallowtail notch */}
      <path
        d="M25 36 L19.5 54 L25.5 50.5 L29.5 53.5 L28.5 37.5"
        strokeWidth="2.2"
      />

      {/* Right Ribbon Tail with swallowtail notch */}
      <path
        d="M39 36 L44.5 54 L38.5 50.5 L34.5 53.5 L35.5 37.5"
        strokeWidth="2.2"
      />
    </svg>
  );
}

const STATS_DATA: StatItem[] = [
  {
    id: "clients",
    value: "500+",
    label: "Happy Clients",
    icon: <HappyClientsIcon />,
    delay: 0,
  },
  {
    id: "partners",
    value: "50+",
    label: "Business Partners",
    icon: <BusinessPartnersIcon />,
    delay: 0.4,
  },
  {
    id: "experience",
    value: "43+",
    label: (
      <>
        Years of Cumulative
        <br />
        Experience
      </>
    ),
    icon: <CumulativeExperienceIcon />,
    delay: 0.8,
  },
  {
    id: "accreditation",
    value: "10+",
    label: "Accreditation",
    icon: <AccreditationIcon />,
    delay: 1.2,
  },
];

export default function StatsSection() {
  return (
    <div className="w-full relative mt-8 sm:mt-12 md:mt-16">
      {/* Inline styles for subtle, non-intrusive blue glowing animation with staggered delays */}
      <style>{`
        @keyframes eviaSubtleBlueGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(30, 90, 220, 0);
          }
          50% {
            box-shadow: 0 0 26px 4px rgba(30, 90, 220, 0.28), 0 0 10px 1px rgba(59, 130, 246, 0.22);
          }
        }
        .evia-blue-icon-glow {
          animation: eviaSubtleBlueGlow 3.2s ease-in-out infinite;
        }
      `}</style>

      {/* Four independent statistics distributed in a unified, open 4-column layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-y-14 gap-x-6 sm:gap-x-10 md:gap-x-12 items-start justify-items-center">
        {STATS_DATA.map((stat, idx) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.6,
              delay: idx * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center text-center w-full max-w-[240px]"
          >
            {/* Original Blue Box + White Line-Art Icon with Subtle Animated Glow */}
            <div
              className="w-[110px] h-[110px] sm:w-[116px] sm:h-[116px] md:w-[120px] md:h-[120px] rounded-[18px] sm:rounded-[20px] bg-gradient-to-b from-[#0f4492] to-[#0a3370] border border-[#2a68c4]/35 flex items-center justify-center p-3 select-none evia-blue-icon-glow transition-transform duration-300 hover:scale-[1.02]"
              style={{
                animationDelay: `${stat.delay}s`,
              }}
            >
              {stat.icon}
            </div>

            {/* Gold Gradient Number */}
            <div
              className="text-[38px] sm:text-[44px] md:text-[50px] lg:text-[54px] font-bold font-sans tracking-tight leading-none mt-6 sm:mt-7 mb-2.5"
              style={{
                background:
                  "linear-gradient(135deg, #ebe0a6 0%, #d4c06e 35%, #b9a13f 70%, #a89537 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {stat.value}
            </div>

            {/* Warm Cream / Gold Typography Label */}
            <div className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#f1e7b4] leading-snug tracking-normal">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
