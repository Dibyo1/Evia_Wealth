import React from "react";
import { ArrowRight } from "lucide-react";
import PortfolioGrowthCard from "../../components/ui/portfolio-growth-card.tsx";

interface HeroSectionProps {
  onReviewPortfolio: () => void;
}

export default function HeroSection({ onReviewPortfolio }: HeroSectionProps) {
  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      {/* Subtle emerald radial glow in background */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center mb-16 md:mb-20">
          {/* Left Column (55%) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Eyebrow */}
            <div className="gold-eyebrow-pill mb-6">
              <span className="gold-dot" />
              <span className="gold-eyebrow-text">
                EVIA WEALTH MANAGEMENT
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-[44px] sm:text-[56px] lg:text-[68px] font-bold tracking-[-0.03em] leading-[1.08] mb-6 gold-gradient-heading">
              Your Trusted
              <br />
              Investment
              <br />
              Partner
            </h1>

            {/* Paragraph */}
            <p className="text-[16px] md:text-[17px] leading-[1.65] text-neutral-300 max-w-[540px] mb-8 font-normal">
              Personalised wealth management engineered for senior executives, business leaders, and UHNI families across India. Delivering institutional expertise with radical transparency.
            </p>

            {/* CTA Button */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onReviewPortfolio}
                className="h-[50px] px-7 rounded-full gold-pill-btn flex items-center justify-center gap-2.5 active:scale-[0.98] group cursor-pointer"
              >
                <span>Review my portfolio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
              </button>
            </div>
          </div>

          {/* Right Column (45%) - Portfolio Growth Card */}
          <div className="lg:col-span-5 z-10 flex justify-center lg:justify-end w-full">
            <PortfolioGrowthCard className="w-full max-w-[472px]" loop={true} holdDuration={1.8} />
          </div>
        </div>

        {/* Bottom Three Stat Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Tile 1 */}
          <div className="rounded-2xl bg-[#0f0f11] border border-white/8 p-6 md:p-7 hover:border-white/15 transition-all">
            <h2 className="text-[28px] md:text-[32px] font-bold text-white tracking-tight mb-2">
              20+ Years
            </h2>
            <p className="text-[13px] text-neutral-400 leading-relaxed">
              Cumulative leadership experience managing billions at global institutions.
            </p>
          </div>

          {/* Tile 2 */}
          <div className="rounded-2xl bg-[#0f0f11] border border-white/8 p-6 md:p-7 hover:border-white/15 transition-all">
            <h2 className="text-[28px] md:text-[32px] font-bold text-white tracking-tight mb-2">
              Top 10
            </h2>
            <p className="text-[13px] text-neutral-400 leading-relaxed">
              Fastest-growing Portfolio Management Services (PMS) in India by SEBI AUM.
            </p>
          </div>

          {/* Tile 3 */}
          <div className="rounded-2xl bg-[#0f0f11] border border-white/8 p-6 md:p-7 hover:border-white/15 transition-all">
            <h2 className="text-[28px] md:text-[32px] font-bold text-[#34d399] tracking-tight mb-2">
              ₹1Cr → ₹1.73Cr
            </h2>
            <p className="text-[13px] text-neutral-400 leading-relaxed">
              Demonstrated 5-year capital compounding trajectory across equity market cycles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
