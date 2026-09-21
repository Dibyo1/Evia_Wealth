import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";

interface StackSectionProps {
  onAnalyseClick: () => void;
  onTalkClick: () => void;
}

export default function StackSection({ onAnalyseClick, onTalkClick }: StackSectionProps) {
  // Main container for scroll progress of the cards stacking section
  const containerRef = useRef<HTMLDivElement>(null);

  // Track active steps inside each card
  const [activeStep1, setActiveStep1] = useState(0);
  const [activeStep2, setActiveStep2] = useState(0);

  // Track viewport size for smooth responsive sizing
  const [viewportSize, setViewportSize] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set up high-performance scroll-linked stacking values on the parent section target
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate dynamic stacking transitions for Card 2 entering and Card 1 scaling down
  // Card 2 rises from 85vh below the viewport up to 0vh to perfectly stack over Card 1.
  // This sweep happens smoothly over the middle interval of the section scroll range (0.35 to 0.65).
  const card2Y = useTransform(scrollYProgress, [0.35, 0.65], ["85vh", "0vh"]);
  
  // Card 1 scales down slightly and dims to 45% black overlay opacity during the Card 2 climb
  const card1Scale = useTransform(scrollYProgress, [0.35, 0.65], [1, 0.97]);
  const card1DimOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 0.45]);

  // Synchronise list item activation based on scroll progress
  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      // Step ranges for Card 1 active list item (while Card 1 is primary active)
      if (v < 0.12) {
        setActiveStep1(0);
      } else if (v < 0.24) {
        setActiveStep1(1);
      } else {
        setActiveStep1(2);
      }

      // Step ranges for Card 2 active list item (once Card 2 takes front position)
      if (v < 0.74) {
        setActiveStep2(0);
      } else if (v < 0.87) {
        setActiveStep2(1);
      } else {
        setActiveStep2(2);
      }
    });
  }, [scrollYProgress]);

  // --- CARD 1 VISUAL STATES (Existing Investments) ---
  const renderCard1Visual = () => {
    switch (activeStep1) {
      case 0:
        return (
          <div className="flex flex-col h-full justify-between p-4 bg-white rounded-2xl">
            <div className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
              PORTFOLIO DIAGNOSTIC
            </div>
            <div className="space-y-3 mt-3 relative">
              <div className="bg-[#fef2f2] rounded-xl p-3 border border-red-100 flex flex-col">
                <span className="text-[9px] font-bold text-neutral-400 uppercase">YOUR PORTFOLIO</span>
                <span className="text-[20px] font-extrabold text-red-500 leading-none mt-1">-9.23%</span>
                <span className="text-[10px] text-red-400 mt-1">Historical alpha lag</span>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center border border-white shadow-md z-10">
                VS
              </div>

              <div className="bg-[#f0fdf4] rounded-xl p-3 border border-emerald-100 flex flex-col">
                <span className="text-[9px] font-bold text-neutral-400 uppercase">MARKET BENCHMARK</span>
                <span className="text-[20px] font-extrabold text-[#3fb5a0] leading-none mt-1">+13.11%</span>
                <span className="text-[10px] text-emerald-500 mt-1">Standard index return</span>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col h-full justify-between p-4 bg-white rounded-2xl">
            <div>
              <div className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                FEE LEAKAGE ANALYSIS
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5 mb-3">[PLACEHOLDER - High commissions diagnostic]</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-[#fffbeb] p-2.5 rounded-lg border border-amber-100">
                  <div>
                    <div className="text-[9px] font-bold text-neutral-500 uppercase">HIDDEN DISTRIBUTOR FEES</div>
                    <div className="text-[14px] font-extrabold text-amber-600">1.4% / year</div>
                  </div>
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">LEAKING</span>
                </div>
                <div className="flex justify-between items-center bg-[#fafafa] p-2.5 rounded-lg border border-neutral-100">
                  <div>
                    <div className="text-[9px] font-bold text-neutral-500 uppercase">SCHEME OVERLAP</div>
                    <div className="text-[14px] font-extrabold text-neutral-800">54% duplication</div>
                  </div>
                  <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-mono font-bold">HIGH RISK</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
      default:
        return (
          <div className="flex flex-col h-full justify-between p-4 bg-white rounded-2xl relative">
            <div>
              <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-[10px] text-neutral-400 ml-1.5 font-medium">Evia Advisor Chat</span>
              </div>

              <div className="space-y-2">
                <div className="bg-neutral-100 text-neutral-800 text-[11px] p-2 rounded-lg max-w-[85%]">
                  Hi there! We analyzed your portfolio. Here are our recommendations:
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-2 space-y-1.5 shadow-xs">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-neutral-500 font-medium">Regular Mutual Funds</span>
                    <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">Exit these funds</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-neutral-500 font-medium">Direct Growth Plans</span>
                    <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Invest in these funds</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-2.5 right-2.5 w-6 h-6 rounded-full overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80"
                alt="Advisor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        );
    }
  };

  // --- CARD 2 VISUAL STATES (PMS Solutions) ---
  const renderCard2Visual = () => {
    switch (activeStep2) {
      case 0:
        return (
          <div className="flex flex-col h-full justify-between p-4 bg-white rounded-2xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold text-[#5457b8] uppercase">ACTIVE PMS STRATEGY</span>
              <span className="text-[9px] bg-indigo-50 text-[#5457b8] px-1.5 py-0.5 rounded font-bold">LIVE</span>
            </div>
            <div className="text-[14px] font-bold text-neutral-800 leading-tight">Evia Dynamic Debt Strategy</div>
            <p className="text-[10px] text-neutral-400 mb-2">Yield management across interest rate cycles</p>

            <div className="relative h-[90px] w-full mt-1">
              <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="pmsAreaOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0,70 C 40,65 80,40 120,35 S 160,20 200,10 L 200,80 L 0,80 Z" fill="url(#pmsAreaOrange)" />
                <path d="M 0,70 C 40,65 80,40 120,35 S 160,20 200,10" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                <circle cx="200" cy="10" r="3.5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col h-full justify-between p-4 bg-white rounded-2xl overflow-hidden">
            <div>
              <div className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase mb-3">ASSET ALLOCATION</div>
              <div className="grid grid-cols-2 gap-2 relative">
                <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-teal-100 text-center whitespace-nowrap">Equities</span>
                <span className="bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-orange-100 text-center whitespace-nowrap">Fixed Income</span>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-emerald-100 text-center whitespace-nowrap">Private Credit</span>
                <span className="bg-zinc-50 text-zinc-500 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-zinc-200 text-center whitespace-nowrap relative -right-3 translate-x-1.5">Early Stage IPO</span>
              </div>
            </div>
          </div>
        );
      case 2:
      default:
        return (
          <div className="flex flex-col h-full justify-between p-4 bg-white rounded-2xl">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">DIRECT DEMAT PORTAL</span>
                <span className="text-[9px] text-[#5457b8] font-bold uppercase">[PLACEHOLDER]</span>
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5 mb-3">[PLACEHOLDER - Live demat share transparency]</p>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-1 text-[11px]">
                  <span className="font-semibold text-neutral-800">HDFC Bank Ltd</span>
                  <span className="text-emerald-600 font-bold font-mono">+1.24%</span>
                </div>
                <div className="flex justify-between items-center border-b border-neutral-100 pb-1 text-[11px]">
                  <span className="font-semibold text-neutral-800">Reliance Industries</span>
                  <span className="text-emerald-600 font-bold font-mono">+0.85%</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-neutral-800">TCS Limited</span>
                  <span className="text-neutral-500 font-mono">0.00%</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section ref={containerRef} id="solutions" className="relative w-full h-[350vh] bg-black text-white">
      
      {/* 1. SECTION HEADING (Normal flow, scrolls away naturally once Card 1 hits the top) */}
      <div className="max-w-[860px] mx-auto text-center pt-24 pb-16 px-4">
        <h2 className="text-[34px] sm:text-[46px] md:text-[52px] font-semibold tracking-[-0.03em] leading-[1.12] bg-gradient-to-r from-[#ebe0a6] via-[#cdb864] to-[#a89537] bg-clip-text text-transparent">
          How Evia Wealth can help you
        </h2>
      </div>

      {/* 2. STICKY DECK WRAPPER (Cards reside here absolutely and overlap dynamically on scroll) */}
      <div className="sticky top-[96px] w-full px-4 sm:px-6 md:px-8 overflow-visible flex justify-center">
        <div className="relative w-full max-w-6xl min-h-[500px] max-h-[640px] md:h-[580px] overflow-visible">
          
          {/* =================================================================== */}
          {/* STACK LAYER 1: CARD 1 (Existing Investments)                        */}
          {/* =================================================================== */}
          <motion.div
            style={{
              scale: card1Scale,
              transformOrigin: "top center",
            }}
            className="absolute inset-x-0 top-0 rounded-t-[28px] bg-white text-[#0a0a0a] shadow-[0_-12px_40px_rgba(0,0,0,0.4)] border-t border-neutral-200 overflow-hidden h-full flex flex-col justify-between z-10"
          >
            {/* Dynamic black dimming overlay when Card 2 rises on top */}
            <motion.div
              style={{ opacity: card1DimOpacity }}
              className="absolute inset-0 bg-black pointer-events-none z-30 rounded-t-[28px]"
            />

            <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between h-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
                
                {/* Left Side: Header & Active Scroll List */}
                <div className="lg:col-span-7 flex flex-col h-full justify-between pr-4">
                  <div>
                    <span className="text-[#3fb5a0] font-mono tracking-widest text-[11px] uppercase font-bold block mb-2">
                      EXISTING INVESTMENTS
                    </span>
                    <h3 className="text-[28px] sm:text-[34px] font-semibold tracking-tight leading-[1.15] text-[#0f0f11] mb-8 font-['Poppins']">
                      Analyse &amp; improve your current portfolio
                    </h3>

                    {/* Left Scroll List with Left Highlight Bars */}
                    <div className="space-y-6">
                      <div className="pl-4 relative flex items-center min-h-[44px]">
                        {activeStep1 === 0 && (
                          <motion.div
                            layoutId="accentBarCard1"
                            className="absolute left-0 w-[2px] h-6 bg-[#3fb5a0] rounded-full"
                          />
                        )}
                        <span className={`text-[16px] sm:text-[18px] leading-snug transition-colors duration-300 ${activeStep1 === 0 ? 'text-[#0f0f11] font-medium' : 'text-[#8a8a8a] font-normal'}`}>
                          Negative returns on debt funds
                        </span>
                      </div>

                      <div className="pl-4 relative flex items-center min-h-[44px]">
                        {activeStep1 === 1 && (
                          <motion.div
                            layoutId="accentBarCard1"
                            className="absolute left-0 w-[2px] h-6 bg-[#3fb5a0] rounded-full"
                          />
                        )}
                        <span className={`text-[16px] sm:text-[18px] leading-snug transition-colors duration-300 ${activeStep1 === 1 ? 'text-[#0f0f11] font-medium' : 'text-[#8a8a8a] font-normal'}`}>
                          High hidden distribution commissions
                        </span>
                      </div>

                      <div className="pl-4 relative flex items-center min-h-[44px]">
                        {activeStep1 === 2 && (
                          <motion.div
                            layoutId="accentBarCard1"
                            className="absolute left-0 w-[2px] h-6 bg-[#3fb5a0] rounded-full"
                          />
                        )}
                        <span className={`text-[16px] sm:text-[18px] leading-snug transition-colors duration-300 ${activeStep1 === 2 ? 'text-[#0f0f11] font-medium' : 'text-[#8a8a8a] font-normal'}`}>
                          Excessive equity portfolio overlap
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 mt-8">
                    <button
                      type="button"
                      onClick={onAnalyseClick}
                      className="h-11 px-7 rounded-full bg-[#0a0a0a] text-white text-[14px] font-medium hover:bg-neutral-800 transition-all flex items-center gap-1.5 group cursor-pointer shadow-sm"
                    >
                      <span>Analyse my portfolio</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={onTalkClick}
                      className="h-11 px-6 rounded-full border border-neutral-300 bg-white text-[#0a0a0a] text-[14px] font-medium hover:bg-neutral-50 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-600 stroke-2 fill-none stroke-current" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <span>Talk with us</span>
                    </button>
                  </div>
                </div>

                {/* Right Side: Visual Diagnostic Mock */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#f2f2f2] rounded-[28px] p-5">
                  <div className="relative flex-1 min-h-[190px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep1}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <div className="h-full border border-neutral-200/60 rounded-[16px] overflow-hidden bg-white shadow-xs">
                          {renderCard1Visual()}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <span className="text-[10px] text-[#8e8a83] text-right mt-3 block">
                    For illustrative purposes only. This service is offered by DIPL
                  </span>
                </div>

              </div>
            </div>
          </motion.div>

          {/* =================================================================== */}
          {/* STACK LAYER 2: CARD 2 (PMS Solutions)                                */}
          {/* =================================================================== */}
          <motion.div
            style={{
              y: card2Y,
            }}
            className="absolute inset-x-0 top-0 rounded-t-[28px] bg-white text-[#0a0a0a] shadow-[0_-16px_50px_rgba(0,0,0,0.6)] border-t border-neutral-200 overflow-hidden h-full flex flex-col justify-between z-20"
          >
            <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between h-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">

                {/* Left Side: Header & Active Scroll List */}
                <div className="lg:col-span-7 flex flex-col h-full justify-between pr-4">
                  <div>
                    <span className="text-[#5457b8] font-mono tracking-widest text-[11px] uppercase font-bold block mb-2">
                      PMS SOLUTIONS
                    </span>
                    <h3 className="text-[28px] sm:text-[34px] font-semibold tracking-tight leading-[1.15] text-[#0f0f11] mb-8 font-['Poppins']">
                      Target alpha through specialised strategies
                    </h3>

                    {/* Left Scroll List with Left Highlight Bars */}
                    <div className="space-y-6">
                      <div className="pl-4 relative flex items-center min-h-[44px]">
                        {activeStep2 === 0 && (
                          <motion.div
                            layoutId="accentBarCard2"
                            className="absolute left-0 w-[2px] h-6 bg-[#5457b8] rounded-full"
                          />
                        )}
                        <span className={`text-[16px] sm:text-[18px] leading-snug transition-colors duration-300 ${activeStep2 === 0 ? 'text-[#0f0f11] font-medium' : 'text-[#8a8a8a] font-normal'}`}>
                          Quantitative macro allocation
                        </span>
                      </div>

                      <div className="pl-4 relative flex items-center min-h-[44px]">
                        {activeStep2 === 1 && (
                          <motion.div
                            layoutId="accentBarCard2"
                            className="absolute left-0 w-[2px] h-6 bg-[#5457b8] rounded-full"
                          />
                        )}
                        <span className={`text-[16px] sm:text-[18px] leading-snug transition-colors duration-300 ${activeStep2 === 1 ? 'text-[#0f0f11] font-medium' : 'text-[#8a8a8a] font-normal'}`}>
                          Direct equity ownership
                        </span>
                      </div>

                      <div className="pl-4 relative flex items-center min-h-[44px]">
                        {activeStep2 === 2 && (
                          <motion.div
                            layoutId="accentBarCard2"
                            className="absolute left-0 w-[2px] h-6 bg-[#5457b8] rounded-full"
                          />
                        )}
                        <span className={`text-[16px] sm:text-[18px] leading-snug transition-colors duration-300 ${activeStep2 === 2 ? 'text-[#0f0f11] font-medium' : 'text-[#8a8a8a] font-normal'}`}>
                          Radical transparency
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-3 mt-8">
                    <button
                      type="button"
                      onClick={onAnalyseClick}
                      className="h-11 px-7 rounded-full bg-[#0a0a0a] text-white text-[14px] font-medium hover:bg-neutral-800 transition-all flex items-center gap-1.5 group cursor-pointer shadow-sm"
                    >
                      <span>View all strategies</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      type="button"
                      onClick={onTalkClick}
                      className="h-11 px-6 rounded-full border border-neutral-300 bg-white text-[#0a0a0a] text-[14px] font-medium hover:bg-neutral-50 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-600 stroke-2 fill-none stroke-current" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <span>Talk with us</span>
                    </button>
                  </div>
                </div>

                {/* Right Side: Visual Diagnostic Mock */}
                <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#f2f2f2] rounded-[28px] p-5">
                  <div className="relative flex-1 min-h-[190px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep2}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        <div className="h-full border border-neutral-200/60 rounded-[16px] overflow-hidden bg-white shadow-xs">
                          {renderCard2Visual()}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <span className="text-[10px] text-[#8e8a83] text-right mt-3 block">
                    For illustrative purposes only. This service is offered by DIPL
                  </span>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
