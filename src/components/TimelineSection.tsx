import React, { useState, useEffect, useRef } from "react";
import { Check, ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";

/**
 * Step 01 Visual Component:
 * Continuous 5.5s autoplay cycle:
 * 0s: reset (empty chart)
 * 0.2s - 3.7s: line draws left-to-right (3.5s)
 * Dots pop in sequence:
 *  - Milestone 1 (~1.2s): Dot 1 pops (red), label "US Banking Crisis", chip: "Attractive small cap valuations"
 *  - Milestone 2 (~2.4s): Dot 2 pops (red), label "Israel conflict", chip: "War's GDP impact minimal"
 *  - Milestone 3 (~3.5s): Dot 3 pops (teal), label "India State elections", chip: "Driven by extreme bullishness"
 * 3.7s - 5.2s: hold for 1.5s
 * 5.2s - 5.5s: reset
 * Only animates when visible (IntersectionObserver).
 */
function Step01Visual({ isVisible }: { isVisible: boolean }) {
  const [cycleTime, setCycleTime] = useState(0); // in ms
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
        animRef.current = null;
      }
      return;
    }

    const CYCLE_DURATION = 5500;

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = (now - startRef.current) % CYCLE_DURATION;
      setCycleTime(elapsed);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, [isVisible]);

  // Total path length of the curve is ~390
  const totalLength = 390;
  // Line draws over 3500ms (from 200ms to 3700ms)
  let lineProgress = 0;
  if (cycleTime > 200) {
    lineProgress = Math.min((cycleTime - 200) / 3500, 1);
  }
  const strokeOffset = totalLength * (1 - lineProgress);

  // Milestone triggers
  const m1Active = cycleTime >= 1200 && cycleTime < 5200;
  const m2Active = cycleTime >= 2400 && cycleTime < 5200;
  const m3Active = cycleTime >= 3500 && cycleTime < 5200;

  // Chip text updates at each milestone
  let chipText = "Monitoring portfolio beta & valuation swings";
  if (m3Active) {
    chipText = "Driven by extreme bullishness";
  } else if (m2Active) {
    chipText = "War's GDP impact minimal";
  } else if (m1Active) {
    chipText = "Attractive small cap valuations";
  }

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Top-left chip with avatar + dynamic insight text */}
      <div className="flex items-center gap-2.5 bg-white rounded-full px-3 py-1.5 shadow-xs border border-neutral-200/60 w-fit mb-4 transition-all duration-300">
        <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden shrink-0">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
            alt="Advisor"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[11px] font-medium text-neutral-800 truncate max-w-[210px] sm:max-w-[260px]">
          {chipText}
        </span>
      </div>

      {/* SVG Line Chart with 3 Milestones */}
      <div className="relative w-full h-[155px] sm:h-[175px] my-auto">
        <svg
          viewBox="0 0 360 140"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Subtle horizontal grid lines */}
          <line x1="10" y1="30" x2="350" y2="30" stroke="#eaeaea" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="10" y1="75" x2="350" y2="75" stroke="#eaeaea" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="10" y1="120" x2="350" y2="120" stroke="#eaeaea" strokeWidth="1" strokeDasharray="3 3" />

          {/* Thin vertical guide lines above each dot */}
          {/* Milestone 1 (x: 75, y: 88) */}
          {m1Active && (
            <line
              x1="75"
              y1="20"
              x2="75"
              y2="88"
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="transition-opacity duration-300"
            />
          )}

          {/* Milestone 2 (x: 180, y: 98) */}
          {m2Active && (
            <line
              x1="180"
              y1="20"
              x2="180"
              y2="98"
              stroke="#ef4444"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="transition-opacity duration-300"
            />
          )}

          {/* Milestone 3 (x: 305, y: 35) */}
          {m3Active && (
            <line
              x1="305"
              y1="10"
              x2="305"
              y2="35"
              stroke="#2fa88a"
              strokeWidth="1"
              strokeDasharray="2 2"
              className="transition-opacity duration-300"
            />
          )}

          {/* Continuous smoothed trajectory path */}
          <path
            d="M 15,65 C 45,65 55,88 75,88 C 110,88 140,98 180,98 C 225,98 260,35 305,35 C 325,35 340,32 355,30"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: totalLength,
              strokeDashoffset: strokeOffset,
            }}
          />

          {/* Milestone 1 Dot: Mar 2023 (Red) */}
          {m1Active && (
            <g className="transition-all duration-300">
              <circle cx="75" cy="88" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}

          {/* Milestone 2 Dot: Apr 2023 (Red) */}
          {m2Active && (
            <g className="transition-all duration-300">
              <circle cx="180" cy="98" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}

          {/* Milestone 3 Dot: Dec 2023 (Teal) */}
          {m3Active && (
            <g className="transition-all duration-300">
              <circle cx="305" cy="35" r="4.5" fill="#2fa88a" stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}
        </svg>

        {/* Milestone Pop-in Labels */}
        {/* Milestone 1 Label */}
        <div
          className={`absolute left-[5%] top-[10px] pointer-events-none transition-all duration-300 ${
            m1Active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
        >
          <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">MAR 2023</div>
          <div className="text-[11px] font-bold text-[#ef4444] whitespace-nowrap">US Banking Crisis</div>
        </div>

        {/* Milestone 2 Label */}
        <div
          className={`absolute left-[38%] top-[10px] pointer-events-none transition-all duration-300 ${
            m2Active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
        >
          <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">APR 2023</div>
          <div className="text-[11px] font-bold text-[#ef4444] whitespace-nowrap">Israel conflict</div>
        </div>

        {/* Milestone 3 Label */}
        <div
          className={`absolute right-[5%] top-[2px] pointer-events-none transition-all duration-300 ${
            m3Active ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
        >
          <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider text-right">DEC 2023</div>
          <div className="text-[11px] font-bold text-[#2fa88a] whitespace-nowrap text-right">India State elections</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Step 02 Visual Component:
 * - Avatar + "Aman's Portfolio" + "18.1%" with green "+2.6%"
 * - Small card "Opportunity / Increase small cap allocation"
 * - Box "Rebalance benefit + 6.0%" with "Cost of Rebalance 0.4%" and "Tax of Rebalance 1.1%"
 * - Teal (#2fa88a) full-width bar "✓ Rebalance Needed"
 * - Animates once when card enters viewport.
 */
function Step02Visual({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="w-full flex flex-col justify-between space-y-3 select-none">
      {/* Top Row: Portfolio summary */}
      <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-neutral-200/60 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[11px]">
            AP
          </div>
          <div>
            <div className="text-[12px] font-bold text-neutral-900 leading-tight">Aman's Portfolio</div>
            <div className="text-[10px] text-neutral-400">Equity Growth Strategy</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[15px] font-black text-neutral-900 leading-tight">18.1%</div>
          <div className="text-[10px] font-bold text-[#2fa88a] flex items-center justify-end gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" />
            <span>+2.6% alpha</span>
          </div>
        </div>
      </div>

      {/* Opportunity Card */}
      <div
        className={`bg-white rounded-xl p-3 border border-neutral-200/60 shadow-xs transition-all duration-700 delay-150 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="text-[9px] font-bold uppercase tracking-wider text-[#2fa88a] mb-0.5">
          OPPORTUNITY DETECTED
        </div>
        <div className="text-[13px] font-bold text-neutral-900">
          Increase small cap allocation
        </div>
      </div>

      {/* Rebalance Benefit & Cost Box */}
      <div
        className={`bg-neutral-100 rounded-xl p-3 border border-neutral-200/70 transition-all duration-700 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex items-center justify-between text-[12px] font-bold text-neutral-900 mb-1.5">
          <span>Rebalance benefit</span>
          <span className="text-[#2fa88a] font-extrabold">+6.0%</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1.5 border-t border-neutral-200/60">
          <span>Cost of Rebalance 0.4%</span>
          <span>Tax of Rebalance 1.1%</span>
        </div>
      </div>

      {/* Teal Full-width Bar */}
      <div
        className={`w-full py-2.5 rounded-xl bg-[#2fa88a] text-white font-bold text-[12px] flex items-center justify-center gap-2 shadow-xs transition-all duration-700 delay-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <Check className="w-4 h-4 stroke-[3]" />
        <span>Rebalance Needed</span>
      </div>
    </div>
  );
}

/**
 * Step 03 Visual Component:
 * - Avatar + "Aman's Portfolio"
 * - Green row: "Small Cap allocation / Increased by 10.0%"
 * - Red row: "Large & Mid Cap allocation / Decreased by 10.0%"
 * - Animates once when card enters viewport.
 */
function Step03Visual({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="w-full flex flex-col justify-between space-y-3.5 select-none py-1">
      {/* Portfolio Header */}
      <div className="flex items-center gap-2.5 bg-white rounded-xl p-3 border border-neutral-200/60 shadow-xs">
        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[11px]">
          AP
        </div>
        <div>
          <div className="text-[13px] font-bold text-neutral-900 leading-tight">Aman's Portfolio</div>
          <div className="text-[10px] text-neutral-400">Automated Execution Mandate</div>
        </div>
      </div>

      {/* Green Row: Small Cap increased */}
      <div
        className={`bg-white rounded-xl p-3.5 border border-neutral-200/60 shadow-xs flex items-center justify-between transition-all duration-700 delay-150 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
        }`}
      >
        <div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">ASSET CLASS</div>
          <div className="text-[13px] font-bold text-neutral-900">Small Cap allocation</div>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-[#e8f7f2] text-[#2fa88a] text-[11px] font-extrabold flex items-center gap-1 border border-[#2fa88a]/20">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Increased by 10.0%</span>
        </div>
      </div>

      {/* Red Row: Large & Mid Cap decreased */}
      <div
        className={`bg-white rounded-xl p-3.5 border border-neutral-200/60 shadow-xs flex items-center justify-between transition-all duration-700 delay-300 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
        }`}
      >
        <div>
          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">ASSET CLASS</div>
          <div className="text-[13px] font-bold text-neutral-900">Large &amp; Mid Cap allocation</div>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-[#fee2e2] text-[#ef4444] text-[11px] font-extrabold flex items-center gap-1 border border-[#ef4444]/20">
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Decreased by 10.0%</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Step 04 Visual Component:
 * - "MAR 2023 / US Banking crisis" with small red sparkline
 * - Card: "Aman's portfolio rebalance" with teal progress bar "Small Cap" filling and "Increased by 10%"
 * - Grey box: "How it impacted? You've outperformed benchmark"
 * - Animates once when card enters viewport.
 */
function Step04Visual({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="w-full flex flex-col justify-between space-y-3 select-none">
      {/* Event Header with red sparkline */}
      <div className="bg-white rounded-xl p-3 border border-neutral-200/60 shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">MAR 2023</div>
          <div className="text-[12px] font-bold text-[#ef4444]">US Banking crisis</div>
        </div>
        {/* Red mini sparkline */}
        <svg className="w-16 h-6 overflow-visible" viewBox="0 0 64 24">
          <path
            d="M 2,6 L 16,14 L 32,8 L 48,18 L 62,20"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Aman's portfolio rebalance progress card */}
      <div
        className={`bg-white rounded-xl p-3.5 border border-neutral-200/60 shadow-xs transition-all duration-700 delay-150 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="flex items-center justify-between text-[12px] font-bold text-neutral-900 mb-2">
          <span>Aman's portfolio rebalance</span>
          <span className="text-[#2fa88a] font-extrabold">Increased by 10%</span>
        </div>
        {/* Teal progress bar */}
        <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className={`h-full bg-[#2fa88a] rounded-full transition-all duration-1000 ease-out ${
              isVisible ? "w-[78%]" : "w-0"
            }`}
          />
        </div>
        <div className="flex justify-between text-[9px] text-neutral-400 mt-1 font-medium">
          <span>Small Cap Target Allocation</span>
          <span>78% executed</span>
        </div>
      </div>

      {/* Impact summary grey box */}
      <div
        className={`bg-neutral-100 rounded-xl p-3 border border-neutral-200/70 transition-all duration-700 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-0.5">
          HOW IT IMPACTED?
        </div>
        <div className="text-[12px] font-bold text-neutral-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2fa88a]" />
          <span>You've outperformed benchmark by +4.8%</span>
        </div>
      </div>
    </div>
  );
}

export default function TimelineSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepVisibilities, setStepVisibilities] = useState([false, false, false, false]);

  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Scroll listener to update active step and scroll-linked line progress
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const firstCard = stepRefs[0].current;
      const lastCard = stepRefs[3].current;
      if (!firstCard || !lastCard) return;

      const firstRect = firstCard.getBoundingClientRect();
      const lastRect = lastCard.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.45;

      const totalDistance = lastRect.top - firstRect.top;
      if (totalDistance > 0) {
        const scrolledDistance = viewportCenter - firstRect.top;
        const progress = Math.min(Math.max(scrolledDistance / totalDistance, 0), 1);
        setLineProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver to set visibility and active step
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stepRefs.forEach((ref, idx) => {
            if (entry.target === ref.current) {
              if (entry.isIntersecting) {
                setActiveStep(idx);
                setStepVisibilities((prev) => {
                  const updated = [...prev];
                  updated[idx] = true;
                  return updated;
                });
              }
            }
          });
        });
      },
      { rootMargin: "-25% 0px -40% 0px", threshold: 0.1 }
    );

    stepRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const stepsData = [
    {
      num: "01",
      title: "We track the market's impact on your portfolio daily",
      stripSentence: "Your RM is busy searching for new clients & rarely tracks your portfolio",
      hasDisclosure: false,
      renderVisual: (vis: boolean) => <Step01Visual isVisible={vis} />,
    },
    {
      num: "02",
      title: "Instantly evaluates if your portfolio needs a change",
      stripSentence: "Delay action on your portfolio due to manual processes",
      hasDisclosure: false,
      renderVisual: (vis: boolean) => <Step02Visual isVisible={vis} />,
    },
    {
      num: "03",
      title: "Automatically capitalises on opportunities",
      stripSentence: "RMs need to reach out to you for every small decision",
      hasDisclosure: true,
      renderVisual: (vis: boolean) => <Step03Visual isVisible={vis} />,
    },
    {
      num: "04",
      title: "Transparently reports the changes and impact to you",
      stripSentence: "Send you long reports that have outdated insights",
      hasDisclosure: false,
      renderVisual: (vis: boolean) => <Step04Visual isVisible={vis} />,
    },
  ];

  return (
    <section
      id="how-we-do-things"
      className="relative z-20 bg-black pt-4 pb-28 sm:pb-36 text-white"
    >
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6">
        {/* =================================================================== */}
        {/* THE FOUR STEPS WITH LEFT TIMELINE RAIL                             */}
        {/* =================================================================== */}
        <div className="relative max-w-[1160px] mx-auto">
          {/* Continuous Left Timeline Rail Line (Desktop: md and above) */}
          <div className="hidden md:block absolute left-[15px] top-7 bottom-24 w-[1px] bg-[#222226] z-0">
            {/* Scroll-linked illuminated bright line portion */}
            <div
              className="w-full bg-gradient-to-b from-[#ebe0a6] via-[#cdb864] to-white transition-all duration-150"
              style={{ height: `${lineProgress * 100}%` }}
            />
          </div>

          {/* Steps Sequence */}
          <div className="space-y-[90px]">
            {stepsData.map((step, idx) => {
              const isStepActive = activeStep === idx;
              const isVisible = stepVisibilities[idx];

              return (
                <div
                  key={step.num}
                  ref={stepRefs[idx]}
                  className="relative flex items-start gap-4 sm:gap-6 lg:gap-10"
                >
                  {/* Left Timeline Rail Node: Numbered circle aligned to top of card */}
                  <div className="hidden md:flex flex-col items-center pt-1 z-10 shrink-0">
                    <div
                      className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                        isStepActive
                          ? "bg-white text-black scale-110 shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                          : idx < activeStep
                          ? "bg-[#333338] text-white"
                          : "bg-[#18181b] text-[#71717a] border border-white/10"
                      }`}
                    >
                      {step.num}
                    </div>
                  </div>

                  {/* Card + Attached Strip Group */}
                  <div className="flex-1 w-full max-w-[980px]">
                    {/* White Card: radius ~20px, 2 columns, white bg */}
                    <div className="relative z-10 w-full rounded-[20px] bg-white text-black p-6 sm:p-8 lg:p-9 shadow-[0_12px_32px_rgba(0,0,0,0.4)] border border-neutral-200/80">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-stretch">
                        {/* Left Column: Logo + Big Title */}
                        <div className="lg:col-span-5 flex flex-col justify-between">
                          <div>
                            {/* Evia Wealth Brand Lockup */}
                            <div className="flex items-center gap-2 mb-6 sm:mb-8">
                              <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-[#9c7820] via-[#dfba48] to-[#fde587] p-[1px] shadow-xs flex items-center justify-center">
                                <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                                  <span className="font-serif font-black text-[10px] bg-gradient-to-r from-[#edd379] to-[#d4af37] bg-clip-text text-transparent">
                                    EW
                                  </span>
                                </div>
                              </div>
                              <span className="text-[12px] font-bold tracking-[0.14em] uppercase text-black">
                                EVIA WEALTH
                              </span>
                            </div>

                            {/* Big Title (Poppins medium, about 30px, black) */}
                            <h3 className="font-medium text-[24px] sm:text-[28px] md:text-[30px] leading-[1.22] text-black tracking-[-0.02em] font-['Poppins']">
                              {step.title}
                            </h3>
                          </div>
                        </div>

                        {/* Right Column: Light Grey Panel (#f7f7f8) holding the visual */}
                        <div className="lg:col-span-7 bg-[#f7f7f8] rounded-[16px] p-5 sm:p-6 flex flex-col justify-between min-h-[220px]">
                          {/* Visual content */}
                          <div className="flex-1 flex flex-col justify-center">
                            {step.renderVisual(isVisible)}
                          </div>

                          {/* Tiny Footnote */}
                          <div className="mt-3 text-right text-[10px] text-[#8a8a8a] italic font-normal">
                            For illustrative purposes only
                          </div>
                        </div>
                      </div>

                      {/* Black "VS" Circle: ~26px, white text, bottom-LEFT straddling card's edge */}
                      <div className="absolute -bottom-[13px] left-6 sm:left-8 z-20 w-[26px] h-[26px] rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center border border-white/20 shadow-md select-none">
                        VS
                      </div>
                    </div>

                    {/* Attached Dark Strip Directly Under Card */}
                    {/* Sits behind card's bottom edge (card overlaps top by -mt-5), extends ~60px below */}
                    <div className="relative z-0 -mt-4 w-full rounded-[20px] bg-[#141414] text-white pt-8 pb-5 px-6 sm:px-8 border border-white/8 shadow-md">
                      <div className="text-[14px] sm:text-[15px] font-medium text-white mb-1">
                        Traditional wealth firms
                      </div>
                      <div className="text-[16px] sm:text-[19px] md:text-[20px] font-normal text-[#8a8a8a] leading-snug flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>{step.stripSentence}</span>
                        {step.hasDisclosure && (
                          <a
                            href="#disclosure"
                            onClick={(e) => e.preventDefault()}
                            className="inline-flex items-center gap-1 text-[13px] font-semibold text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
                          >
                            <span>View Disclosure</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
