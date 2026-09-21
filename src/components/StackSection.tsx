import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, MessageSquare, Info, Check, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

interface StackSectionProps {
  onAnalyseClick: () => void;
  onTalkClick: () => void;
}

export default function StackSection({ onAnalyseClick, onTalkClick }: StackSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1WrapperRef = useRef<HTMLDivElement>(null);
  const card2WrapperRef = useRef<HTMLDivElement>(null);

  // Active bullet selection states
  const [activeBullet1, setActiveBullet1] = useState(0);
  const [activeBullet2, setActiveBullet2] = useState(0);

  // States to trigger chart draw-ins
  const [card1Drawn, setCard1Drawn] = useState(false);
  const [card2Drawn, setCard2Drawn] = useState(false);

  // IntersectionObserver to trigger chart draw-in when each card reaches the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === card1WrapperRef.current) {
            setCard1Drawn(true);
          } else if (entry.target === card2WrapperRef.current) {
            setCard2Drawn(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (card1WrapperRef.current) observer.observe(card1WrapperRef.current);
    if (card2WrapperRef.current) observer.observe(card2WrapperRef.current);

    return () => observer.disconnect();
  }, []);

  // Motion scroll-linked progress for Card 2 travel over Card 1
  // As Card 2 rises from viewport bottom to its sticky parking position (top ~135px):
  // Card 1 scales down from 1.0 to 0.94 and dims into dark grey (#1c1c20), peeking above Card 2.
  const { scrollYProgress: card2Progress } = useScroll({
    target: card2WrapperRef,
    offset: ["start end", "start 140px"],
  });

  const card1Scale = useTransform(card2Progress, [0, 1], [1, 0.94]);
  const card1DimOpacity = useTransform(card2Progress, [0, 1], [0, 0.88]);

  return (
    <section id="solutions" ref={containerRef} className="relative z-20 bg-black text-white pt-16 pb-24">
      {/* =================================================================== */}
      {/* STICKY SECTION HEADING (Behind the cards, sticky at top ~85px)      */}
      {/* =================================================================== */}
      <div className="sticky top-[85px] z-0 text-center max-w-[860px] mx-auto mb-16 sm:mb-20 px-4 pointer-events-none">
        <div className="gold-eyebrow-pill mb-4 inline-flex items-center gap-2">
          <span className="gold-dot" />
          <span className="gold-eyebrow-text">EVIA WEALTH STACK</span>
        </div>

        <h2 className="text-[34px] sm:text-[46px] md:text-[54px] font-bold tracking-[-0.03em] leading-[1.12] gold-gradient-heading">
          How Evia Wealth
          <br className="sm:hidden" /> can help you
        </h2>
      </div>

      {/* =================================================================== */}
      {/* STACKING FULL-BLEED SHEETS CONTAINER                                */}
      {/* =================================================================== */}
      <div className="relative w-full">
        {/* ================================================================= */}
        {/* CARD 1 TRACK: EXISTING INVESTMENTS                                */}
        {/* ================================================================= */}
        <div
          ref={card1WrapperRef}
          className="relative w-full mb-[50vh]"
        >
          {/* Sticky Sheet: w-full full-bleed, sticky at top-[85px], z-10 */}
          <div className="sticky top-[85px] z-10 w-full">
            <motion.div
              style={{
                scale: card1Scale,
                transformOrigin: "top center",
              }}
              className="relative w-full rounded-t-[32px] bg-white text-[#0a0a0a] shadow-[0_-12px_40px_rgba(0,0,0,0.5)] border-t border-neutral-200 overflow-hidden"
            >
              {/* Dark grey dimming overlay: scroll-linked to Card 2's rise */}
              <motion.div
                style={{ opacity: card1DimOpacity }}
                className="absolute inset-0 bg-[#1c1c20] pointer-events-none z-30 rounded-t-[32px]"
              />

              {/* Card 1 Inner Centered Content */}
              <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-10 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Column */}
                  <div className="lg:col-span-6 flex flex-col items-start">
                    {/* EXISTING INVESTMENTS pill */}
                    <span className="inline-block px-3 py-1 rounded-full bg-[#e6f7f0] text-[#0f9f6e] text-[11px] font-extrabold tracking-wider uppercase mb-4 border border-[#0f9f6e]/20">
                      EXISTING INVESTMENTS
                    </span>

                    {/* Headline */}
                    <h3 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold text-[#0a0a0a] tracking-tight leading-[1.16] mb-5 font-['Poppins']">
                      Analyse &amp; improve your current portfolio
                    </h3>

                    {/* Left List (3 items) */}
                    <div className="w-full space-y-2.5 mb-7">
                      {/* Item 1 */}
                      <div
                        onClick={() => setActiveBullet1(0)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          activeBullet1 === 0
                            ? "bg-neutral-50 border-neutral-300 shadow-xs"
                            : "bg-white border-transparent hover:bg-neutral-50/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a0a0a]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activeBullet1 === 0 ? "bg-[#0f9f6e]" : "bg-neutral-300"
                            }`}
                          />
                          <span>Negative returns on debt funds</span>
                        </div>
                        <p className="text-[12px] text-[#6b6558] mt-1 pl-4.5 leading-relaxed">
                          Holding underperforming fixed income instruments with steep exit loads.
                        </p>
                      </div>

                      {/* Item 2 */}
                      <div
                        onClick={() => setActiveBullet1(1)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          activeBullet1 === 1
                            ? "bg-neutral-50 border-neutral-300 shadow-xs"
                            : "bg-white border-transparent hover:bg-neutral-50/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a0a0a]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activeBullet1 === 1 ? "bg-[#0f9f6e]" : "bg-neutral-300"
                            }`}
                          />
                          <span>High hidden distribution commissions</span>
                        </div>
                        <p className="text-[12px] text-[#6b6558] mt-1 pl-4.5 leading-relaxed">
                          Regular mutual fund plans eroding 1.2% - 1.8% annual CAGR.
                        </p>
                      </div>

                      {/* Item 3 */}
                      <div
                        onClick={() => setActiveBullet1(2)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          activeBullet1 === 2
                            ? "bg-neutral-50 border-neutral-300 shadow-xs"
                            : "bg-white border-transparent hover:bg-neutral-50/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a0a0a]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activeBullet1 === 2 ? "bg-[#0f9f6e]" : "bg-neutral-300"
                            }`}
                          />
                          <span>Excessive equity portfolio overlap</span>
                        </div>
                        <p className="text-[12px] text-[#6b6558] mt-1 pl-4.5 leading-relaxed">
                          Multiple schemes holding duplicate high-beta equities.
                        </p>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={onAnalyseClick}
                        className="h-11 px-7 rounded-full bg-[#0a0a0a] text-white text-[12px] font-extrabold tracking-widest uppercase hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-lg group cursor-pointer"
                      >
                        <span>ANALYSE MY PORTFOLIO</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={onTalkClick}
                        className="h-11 px-6 rounded-full border border-neutral-300 text-[#0a0a0a] text-[12px] font-extrabold tracking-wider uppercase hover:bg-neutral-100 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-neutral-700" />
                        <span>TALK WITH US</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Diagnostic Comparison Card */}
                  <div className="lg:col-span-6 bg-[#f8f8f9] rounded-[20px] p-5 sm:p-6 border border-neutral-200/90 shadow-inner flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-extrabold tracking-wider uppercase text-[#0a0a0a]">
                          PORTFOLIO HEALTH DIAGNOSTIC
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold">
                          Live Benchmark
                        </span>
                      </div>

                      {/* Head-to-Head Comparison */}
                      <div className="grid grid-cols-2 gap-3 mb-5 relative">
                        {/* Current Portfolio */}
                        <div className="bg-white rounded-xl p-4 border border-red-100 shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                            CURRENT PORTFOLIO
                          </span>
                          <div className="text-[26px] sm:text-[30px] font-black text-red-600 tracking-tight leading-none">
                            -9.23%
                          </div>
                          <span className="text-[11px] text-neutral-500 font-medium mt-1 block">
                            Historical alpha lag
                          </span>
                        </div>

                        {/* Central VS Badge */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-neutral-900 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-md">
                          VS
                        </div>

                        {/* Optimised with Evia */}
                        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 shadow-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                            OPTIMISED WITH EVIA
                          </span>
                          <div className="text-[26px] sm:text-[30px] font-black text-emerald-600 tracking-tight leading-none">
                            +13.11%
                          </div>
                          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                            Backtested alpha
                          </span>
                        </div>
                      </div>

                      {/* Three Diagnostic Check Rows */}
                      <div className="space-y-2.5 bg-white rounded-xl p-4 border border-neutral-200/80 shadow-xs mb-4">
                        <div className="flex items-center justify-between text-[12px] font-medium text-neutral-800">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                              ✓
                            </span>
                            <span>Direct mutual funds</span>
                          </div>
                          <span className="font-bold text-[#0f9f6e]">Eliminated 1.4% annual commission</span>
                        </div>

                        <div className="flex items-center justify-between text-[12px] font-medium text-neutral-800">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                              ✓
                            </span>
                            <span>Tax harvesting</span>
                          </div>
                          <span className="font-bold text-[#0f9f6e]">Locked ₹1.8L tax savings</span>
                        </div>

                        <div className="flex items-center justify-between text-[12px] font-medium text-neutral-800">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                              ✓
                            </span>
                            <span>Overlap reduction</span>
                          </div>
                          <span className="font-bold text-[#0f9f6e]">Down to 12% scheme duplication</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-[10px] text-[#8e8a83] italic">
                      For illustrative purposes only. This service is offered by DIPL
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CARD 2 TRACK: PMS SOLUTIONS                                       */}
        {/* ================================================================= */}
        <div
          ref={card2WrapperRef}
          className="relative w-full pb-[20vh]"
        >
          {/* Sticky Sheet: w-full full-bleed, sticky at top-[135px], z-20 */}
          <div className="sticky top-[135px] z-20 w-full">
            <div className="relative w-full rounded-t-[32px] bg-white text-[#0a0a0a] shadow-[0_-16px_50px_rgba(0,0,0,0.7)] border-t border-neutral-200 overflow-hidden">
              {/* Card 2 Inner Centered Content */}
              <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-12 py-8 sm:py-10 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Left Column */}
                  <div className="lg:col-span-6 flex flex-col items-start">
                    {/* PMS SOLUTIONS pill */}
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold tracking-wider uppercase mb-4 border border-blue-200">
                      PMS SOLUTIONS
                    </span>

                    {/* Headline */}
                    <h3 className="text-[26px] sm:text-[32px] md:text-[36px] font-bold text-[#0a0a0a] tracking-tight leading-[1.16] mb-5 font-['Poppins']">
                      Targeted alpha through specialised strategies
                    </h3>

                    {/* Left List (3 items) */}
                    <div className="w-full space-y-2.5 mb-7">
                      {/* Item 1 */}
                      <div
                        onClick={() => setActiveBullet2(0)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          activeBullet2 === 0
                            ? "bg-neutral-50 border-neutral-300 shadow-xs"
                            : "bg-white border-transparent hover:bg-neutral-50/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a0a0a]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activeBullet2 === 0 ? "bg-blue-600" : "bg-neutral-300"
                            }`}
                          />
                          <span>Quantitative macro allocation</span>
                        </div>
                        <p className="text-[12px] text-[#6b6558] mt-1 pl-4.5 leading-relaxed">
                          Dynamic shift across equities, sovereign debt, and tactical gold.
                        </p>
                      </div>

                      {/* Item 2 */}
                      <div
                        onClick={() => setActiveBullet2(1)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          activeBullet2 === 1
                            ? "bg-neutral-50 border-neutral-300 shadow-xs"
                            : "bg-white border-transparent hover:bg-neutral-50/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a0a0a]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activeBullet2 === 1 ? "bg-blue-600" : "bg-neutral-300"
                            }`}
                          />
                          <span>Direct equity ownership</span>
                        </div>
                        <p className="text-[12px] text-[#6b6558] mt-1 pl-4.5 leading-relaxed">
                          Zero pooling; shares held directly in your individual demat.
                        </p>
                      </div>

                      {/* Item 3 */}
                      <div
                        onClick={() => setActiveBullet2(2)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          activeBullet2 === 2
                            ? "bg-neutral-50 border-neutral-300 shadow-xs"
                            : "bg-white border-transparent hover:bg-neutral-50/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-[14px] font-bold text-[#0a0a0a]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              activeBullet2 === 2 ? "bg-blue-600" : "bg-neutral-300"
                            }`}
                          />
                          <span>Radical transparency</span>
                        </div>
                        <p className="text-[12px] text-[#6b6558] mt-1 pl-4.5 leading-relaxed">
                          Real-time portal access to all transaction executions and costs.
                        </p>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={onAnalyseClick}
                        className="h-11 px-7 rounded-full bg-[#0a0a0a] text-white text-[12px] font-extrabold tracking-widest uppercase hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-lg group cursor-pointer"
                      >
                        <span>VIEW ALL STRATEGIES</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={onTalkClick}
                        className="h-11 px-6 rounded-full border border-neutral-300 text-[#0a0a0a] text-[12px] font-extrabold tracking-wider uppercase hover:bg-neutral-100 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-neutral-700" />
                        <span>TALK WITH US</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Light grey panel with strategy details & blue area chart */}
                  <div className="lg:col-span-6 bg-[#f8f8f9] rounded-[20px] p-5 sm:p-6 border border-neutral-200/90 shadow-inner flex flex-col justify-between">
                    <div className="bg-white rounded-xl p-5 border border-neutral-200/80 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-[#6b6558]">
                          FIXED INCOME &amp; EQUITY
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                          Active Strategy
                        </span>
                      </div>

                      <h4 className="text-[17px] sm:text-[19px] font-bold text-[#0a0a0a] mb-1">
                        Evia Dynamic Debt Strategy
                      </h4>
                      <p className="text-[12px] text-[#6b6558] mb-4 leading-normal">
                        Disciplined quantitative yield management across interest rate cycles
                      </p>

                      {/* Blue smooth area chart with draw-in */}
                      <div className="relative h-[130px] w-full">
                        <svg
                          className="w-full h-full overflow-visible"
                          viewBox="0 0 320 110"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id="pmsAreaBlue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          <path
                            d="M 10,90 C 80,85 140,55 200,45 S 270,30 310,18 L 310,105 L 10,105 Z"
                            fill="url(#pmsAreaBlue)"
                          />

                          <path
                            d="M 10,90 C 80,85 140,55 200,45 S 270,30 310,18"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="2.75"
                            strokeLinecap="round"
                            style={{
                              strokeDasharray: 350,
                              strokeDashoffset: card2Drawn ? 0 : 350,
                              transition: "stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
                            }}
                          />

                          {card2Drawn && (
                            <circle
                              cx="310"
                              cy="18"
                              r="4.5"
                              fill="#2563eb"
                              stroke="#ffffff"
                              strokeWidth="2"
                            />
                          )}
                        </svg>
                      </div>

                      {/* Footnote */}
                      <div className="mt-3 text-right text-[10px] text-[#8e8a83] italic">
                        For illustrative purposes only. This service is offered by DIPL
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
