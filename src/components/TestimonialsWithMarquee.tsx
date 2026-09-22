import React from "react";

// Import pristine vector assets from the assets/logos folder
import iwLogo from "../assets/logos/iw.svg";
import ngenLogo from "../assets/logos/ngen.svg";
import utiLogo from "../assets/logos/uti.svg";
import bandhanLogo from "../assets/logos/bandhan.svg";
import hdfcLogo from "../assets/logos/hdfc.svg";
import iciciLogo from "../assets/logos/icici.svg";
import kotakLogo from "../assets/logos/kotak.svg";
import nseLogo from "../assets/logos/nse.svg";

export default function TestimonialsWithMarquee() {
  const logoItems = [
    {
      name: "iWealth",
      src: iwLogo,
      heightClass: "h-12 w-auto",
    },
    {
      name: "NGen",
      src: ngenLogo,
      heightClass: "h-11 w-auto",
    },
    {
      name: "UTI Mutual Fund",
      src: utiLogo,
      heightClass: "h-12 w-auto",
    },
    {
      name: "Bandhan Mutual Fund",
      src: bandhanLogo,
      heightClass: "h-11 w-auto",
    },
    {
      name: "HDFC Mutual Fund",
      src: hdfcLogo,
      heightClass: "h-10 w-auto",
    },
    {
      name: "ICICI Prudential",
      src: iciciLogo,
      heightClass: "h-12 w-auto",
    },
    {
      name: "Kotak Mutual Fund",
      src: kotakLogo,
      heightClass: "h-10 w-auto",
    },
    {
      name: "NSE Mutual Fund Platform",
      src: nseLogo,
      heightClass: "h-11 w-auto",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-black relative border-t border-white/5 overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>

      <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="gold-eyebrow-pill mb-4">
            <span className="gold-dot" />
            <span className="gold-eyebrow-text">TESTIMONIALS</span>
          </div>
          <h2 className="text-[38px] sm:text-[48px] md:text-[54px] font-bold tracking-[-0.03em] leading-[1.12] gold-gradient-heading">
            Client Testimonials
          </h2>
        </div>

        {/* Centered Testimonial Block */}
        <div className="max-w-[640px] mx-auto flex flex-col items-center text-center mb-16">
          {/* Avatar Photo */}
          <div className="w-[90px] h-[90px] rounded-full overflow-hidden ring-1 ring-[#cdb864]/30 p-1 mb-6 bg-neutral-900 flex items-center justify-center shadow-lg">
            <img
              src="/sm.png"
              alt="Prof Sugata Mitra"
              className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          {/* Italicised Quote */}
          <p className="text-[17px] sm:text-[19px] text-[#ebe0a6]/95 italic font-light leading-relaxed mb-6">
            "As a researcher of systems and environments, I am astounded by how Evia Wealth has engineered an institutional-grade, multi-asset risk surveillance architecture. They have demystified complex market dynamics, replacing speculative noise with clean, transparent logic. For the first time in decades, my portfolio is managed with the exact precision, deep rigor, and continuous oversight that true scientific advisory demands."
          </p>

          {/* 5 gold stars */}
          <div className="flex items-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-[#cdb864]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Name */}
          <div className="text-[16px] font-bold text-white tracking-tight mb-1">
            Prof Sugata Mitra. <span className="text-[11px] font-normal text-neutral-500 uppercase tracking-wider ml-1.5">(Client Testimonial)</span>
          </div>

          {/* Title/role */}
          <div className="text-[13px] text-neutral-400">
            (Retd. 2019) Professor of Educational Technology, Newcastle University, UK
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Logo Marquee Strip */}
      <div className="w-full py-10 bg-[#0a0a0c]/40 border-y border-white/5 relative">
        {/* Left/Right Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-black via-black/80 to-transparent pointer-events-none z-10" />

        {/* Marquee animation container */}
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
          {/* First Row Set */}
          <div className="flex items-center gap-8 shrink-0 px-4">
            {logoItems.map((logo, idx) => (
              <div
                key={`m1-${idx}`}
                className="h-20 px-8 py-3 rounded-2xl bg-white border border-neutral-200/80 shadow-md flex items-center justify-center shrink-0 hover:scale-[1.03] transition-transform duration-300 min-w-[170px]"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className={`${logo.heightClass} shrink-0 select-none`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Second Row Set (Duplicates for smooth looping) */}
          <div className="flex items-center gap-8 shrink-0 px-4">
            {logoItems.map((logo, idx) => (
              <div
                key={`m2-${idx}`}
                className="h-20 px-8 py-3 rounded-2xl bg-white border border-neutral-200/80 shadow-md flex items-center justify-center shrink-0 hover:scale-[1.03] transition-transform duration-300 min-w-[170px]"
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className={`${logo.heightClass} shrink-0 select-none`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
