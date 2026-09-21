import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -480 : 480;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const testimonials = [
    {
      id: "1",
      quote: "Evia Wealth brought simplicity and clarity to my investments.",
      name: "Pooja Jauhari",
      role: "Founder & CEO, EmoMee",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      quote: "I am super happy with Evia Wealth because they invest my money better than I could.",
      name: "Brijesh Bharadwaj",
      role: "Co-Founder, Segwise",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      quote: "Radical transparency and institutional risk modeling that you typically only find at Tier-1 global investment desks.",
      name: "Vikram Singhania",
      role: "Managing Director, PeakScale Capital",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-white/6 overflow-hidden bg-black">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
        {/* Header with Divider and Carousel Controls */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="gold-eyebrow-pill">
              <span className="gold-dot" />
              <span className="gold-eyebrow-text">
                HEAR FROM OUR CLIENTS
              </span>
            </div>
            <div className="h-[1px] bg-white/10 flex-1 hidden sm:block" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full border border-white/15 bg-neutral-900/60 hover:border-[#cdb864]/50 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Previous testimonial"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full border border-white/15 bg-neutral-900/60 hover:border-[#cdb864]/50 hover:bg-white/10 text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Next testimonial"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((item) => {
            const isSelected = activeCardId === item.id;
            return (
              <div
                key={item.id}
                tabIndex={0}
                onClick={() => setActiveCardId(item.id)}
                onFocus={() => setActiveCardId(item.id)}
                className={`group snap-start shrink-0 w-[90vw] sm:w-[500px] md:w-[540px] rounded-[22px] bg-[#0e0e11] overflow-hidden flex flex-col sm:flex-row cursor-pointer outline-none transition-all duration-[350ms] ease-out ${
                  isSelected
                    ? "border border-[var(--gold-line)] shadow-[0_0_24px_rgba(212,175,55,0.10)]"
                    : "border border-white/8 hover:border-[var(--gold-line)] hover:shadow-[0_0_24px_rgba(212,175,55,0.10)] focus:border-[var(--gold-line)] focus:shadow-[0_0_24px_rgba(212,175,55,0.10)]"
                }`}
              >
                {/* Left Half: Portrait */}
                <div className="sm:w-[42%] h-[220px] sm:h-auto relative overflow-hidden bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover object-center transition-all duration-[350ms] ease-out ${
                      isSelected
                        ? "filter-none contrast-100"
                        : "filter grayscale contrast-[1.05] group-hover:filter-none group-hover:contrast-100 group-focus:filter-none group-focus:contrast-100"
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent via-transparent to-[#0e0e11]/80 pointer-events-none" />
                </div>

                {/* Right Half: Quote & Meta */}
                <div className="sm:w-[58%] p-6 sm:p-7 flex flex-col justify-between">
                  <div className="mb-6">
                    <span className="text-[#cdb864] text-2xl font-serif leading-none block mb-2">“</span>
                    <p className="text-[17px] sm:text-[18px] text-white font-semibold leading-[1.45] tracking-tight">
                      {item.quote}
                    </p>
                  </div>

                  <div>
                    <div className="text-[15px] font-bold text-white tracking-tight">
                      {item.name}
                    </div>
                    <div className="text-[13px] text-neutral-400">
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
