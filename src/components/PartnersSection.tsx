import React, { useRef } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { CLIENT_PARTNERS } from "../data/siteData";

export default function PartnersSection() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="partners" className="py-24 md:py-36 bg-black relative border-t border-white/6 overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
        {/* Two-Column Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-14">
          {/* Left: H2 */}
          <div className="md:col-span-7">
            <h2 className="text-[38px] sm:text-[48px] md:text-[54px] font-bold tracking-[-0.03em] leading-[1.12] gold-gradient-heading">
              Dedicated client
              <br />
              partners you can trust
            </h2>
          </div>

          {/* Right: Bullet checks + Carousel Buttons */}
          <div className="md:col-span-5 flex flex-col md:items-end justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                <span>Craft solutions to your needs</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />
                <span>Keep you updated at all times</span>
              </div>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 rounded-full border border-white/15 bg-neutral-900/60 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Previous partner"
                aria-label="Previous partner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-9 h-9 rounded-full border border-white/15 bg-neutral-900/60 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Next partner"
                aria-label="Next partner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={carouselRef}
          className="flex items-stretch gap-5 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CLIENT_PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="snap-start shrink-0 w-[270px] sm:w-[290px] rounded-[22px] bg-[#0e0e11] border border-white/8 overflow-hidden flex flex-col hover:-translate-y-1.5 transition-all duration-300 shadow-xl group hover:border-[var(--gold-line)]"
            >
              {/* Grayscale Portrait with Fade */}
              <div className="relative h-[240px] w-full overflow-hidden bg-neutral-900">
                <img
                  src={partner.image}
                  alt={partner.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top filter grayscale contrast-105 group-hover:filter-none group-hover:scale-105 transition-all duration-[350ms] ease-out"
                  loading="lazy"
                />
                {/* Fade into dark card */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-[#0e0e11]/40 to-transparent" />

                {/* Over the fade: Name + Role + LinkedIn */}
                <div className="absolute bottom-3 inset-x-4 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="text-[17px] font-bold text-white tracking-tight leading-snug">
                      {partner.name}
                    </h3>
                    <div className="text-[12px] text-neutral-400">
                      {partner.role}
                    </div>
                  </div>

                  <span
                    className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center text-[11px] font-bold border border-white/10 shrink-0 transition-colors"
                    title="LinkedIn profile"
                  >
                    in
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-start">
                <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-3">
                  MANAGING PORTFOLIO FOR:
                </div>

                <ul className="space-y-2">
                  {partner.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-[12.5px] text-neutral-300 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] shrink-0 mt-1.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* View Disclosure link */}
        <div className="mt-8 text-center">
          <button className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer">
            <span>View Disclosure</span>
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
