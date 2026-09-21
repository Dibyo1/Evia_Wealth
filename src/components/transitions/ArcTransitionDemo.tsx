import React, { useState, useRef } from "react";
import CircularArcTransition from "./CircularArcTransition";
import {
  ArrowDown,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  ExternalLink,
  Sliders,
  Maximize2,
  Columns,
} from "lucide-react";

interface ArcTransitionDemoProps {
  onSwitchToFullSite: () => void;
}

export default function ArcTransitionDemo({ onSwitchToFullSite }: ArcTransitionDemoProps) {
  const [viewMode, setViewMode] = useState<"scroll" | "compare">("compare");
  const [technique, setTechnique] = useState<"scaled-circle" | "clip-path">("scaled-circle");
  const [sliderProgress, setSliderProgress] = useState<number>(0.5);
  const [liveProgress, setLiveProgress] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(2.2);

  // Render outgoing placeholder content (pinned underneath)
  const renderOutgoing = (compact = false) => (
    <div className={`w-full h-full flex flex-col items-center justify-center ${compact ? "p-4" : "p-6 md:p-12"} bg-[#101016] text-center relative overflow-hidden select-none`}>
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        <div className="gold-eyebrow-pill mb-3 scale-90 sm:scale-100">
          <span className="gold-dot" />
          <span className="gold-eyebrow-text">OUTGOING SECTION • PORTFOLIO STRATEGY</span>
        </div>

        <h2 className={`${compact ? "text-lg sm:text-xl" : "text-2xl sm:text-4xl md:text-5xl"} font-bold tracking-tight text-white mb-3 leading-tight`}>
          Multi-Asset Wealth Surveillance
        </h2>

        <p className={`${compact ? "text-xs mb-3" : "text-xs sm:text-sm mb-6"} text-neutral-400 max-w-md leading-relaxed`}>
          This section remains static underneath. Watch the solid black shape rise and mask it.
        </p>

        {/* 3 Metrics Cards */}
        <div className={`grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-lg text-left ${compact ? "mb-2" : "mb-6"}`}>
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#181822] border border-white/10">
            <div className="text-[10px] text-neutral-400">Total AUM</div>
            <div className="text-sm sm:text-lg font-bold text-white">₹2,450 Cr</div>
            <div className="text-[9px] text-[#34d399]">+18.2% YTD</div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#181822] border border-white/10">
            <div className="text-[10px] text-neutral-400">Sharpe Ratio</div>
            <div className="text-sm sm:text-lg font-bold text-white">1.84</div>
            <div className="text-[9px] text-neutral-400">Top decile</div>
          </div>
          <div className="p-2.5 sm:p-3 rounded-xl bg-[#181822] border border-white/10">
            <div className="text-[10px] text-neutral-400">Rebalance</div>
            <div className="text-sm sm:text-lg font-bold text-white">Continuous</div>
            <div className="text-[9px] text-[#cdb864]">Fiduciary</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render incoming placeholder content (reveals on solid black)
  const renderIncoming = (compact = false) => (
    <div className={`w-full h-full flex flex-col items-center justify-center ${compact ? "p-4" : "p-6 md:p-12"} bg-black text-center select-none`}>
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="gold-eyebrow-pill mb-4 scale-90 sm:scale-100">
          <span className="gold-dot" />
          <span className="gold-eyebrow-text">INCOMING SECTION • HOW WE ARE DIFFERENT</span>
        </div>

        <h2 className={`${compact ? "text-lg sm:text-2xl" : "text-2xl sm:text-4xl md:text-5xl"} font-bold tracking-tight mb-3 gold-gradient-heading leading-tight`}>
          How Evia Wealth Does Things Differently
        </h2>

        <p className={`${compact ? "text-xs mb-4" : "text-xs sm:text-sm mb-8"} text-neutral-300 max-w-lg leading-relaxed`}>
          The solid black shape has 100% covered the viewport. Now this new section content appears.
        </p>

        {/* 3 Pillar Cards */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl text-left ${compact ? "hidden sm:grid mb-2" : "mb-6"}`}>
          <div className="p-3.5 rounded-xl bg-[#0f0f14] border border-white/10">
            <div className="text-xs font-bold text-white mb-1">Zero Bias</div>
            <div className="text-[11px] text-neutral-400">Direct fiduciary fee-only advice</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0f0f14] border border-white/10">
            <div className="text-xs font-bold text-white mb-1">Deep PMS</div>
            <div className="text-[11px] text-neutral-400">Institutional mandates & equity</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0f0f14] border border-white/10">
            <div className="text-xs font-bold text-white mb-1">Daily Audits</div>
            <div className="text-[11px] text-neutral-400">Automated portfolio drift guards</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* ===================================================================== */}
      {/* TOP CONTROL & NAVIGATION BAR                                          */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-50 bg-[#0c0c10]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Title & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#cdb864]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#ebe0a6]">
                Dezerv Solid-Black Arc Transition
              </span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono hidden sm:inline">
              Flat Solid Fill • No Strokes • No Glow
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("compare")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "compare"
                  ? "bg-[#cdb864] text-black font-semibold shadow-md"
                  : "bg-white/5 text-neutral-300 hover:bg-white/10"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>0% / 50% / 100% Compare</span>
            </button>

            <button
              onClick={() => setViewMode("scroll")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "scroll"
                  ? "bg-[#cdb864] text-black font-semibold shadow-md"
                  : "bg-white/5 text-neutral-300 hover:bg-white/10"
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Live Scroll Scrub</span>
            </button>

            <div className="h-4 w-[1px] bg-white/15 mx-1" />

            {/* Technique Toggle */}
            <select
              value={technique}
              onChange={(e) => setTechnique(e.target.value as any)}
              className="bg-[#181820] border border-white/15 text-xs text-[#ebe0a6] rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="scaled-circle">Method: Scaled Circle Div</option>
              <option value="clip-path">Method: CSS clip-path</option>
            </select>

            <button
              onClick={onSwitchToFullSite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white border border-white/15 transition-all"
            >
              <span>Full Site</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MODE 1: SIDE-BY-SIDE STAGE COMPARISON (0% vs 50% vs 100%)             */}
      {/* ===================================================================== */}
      {viewMode === "compare" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header Explanation */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 gold-gradient-heading">
              Visual Verification: 0%, 50%, and 100% Scroll Stages
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Examine the shape at each distinct scroll phase. It is a <strong>100% solid flat black fill (#000000)</strong> with
              no stroke, no gradient, and no glow, physically masking the outgoing section beneath it.
            </p>
          </div>

          {/* Interactive Scrub Slider for Custom Percentages */}
          <div className="bg-[#111116] border border-white/10 rounded-2xl p-5 mb-10 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#cdb864]" />
                <span>Interactive Progress Slider</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#cdb864]">
                {Math.round(sliderProgress * 100)}% Progress
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={sliderProgress}
              onChange={(e) => setSliderProgress(parseFloat(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#cdb864]"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
              <span>0% (Off-screen)</span>
              <span>25%</span>
              <span>50% (Halfway)</span>
              <span>75%</span>
              <span>100% (Solid Black & Revealed)</span>
            </div>

            {/* Quick stage jump buttons */}
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setSliderProgress(0)}
                className={`px-3 py-1 rounded-md text-xs font-mono ${sliderProgress === 0 ? "bg-[#cdb864] text-black font-bold" : "bg-white/5 text-neutral-300 hover:bg-white/10"}`}
              >
                Set to 0%
              </button>
              <button
                onClick={() => setSliderProgress(0.35)}
                className={`px-3 py-1 rounded-md text-xs font-mono ${sliderProgress === 0.35 ? "bg-[#cdb864] text-black font-bold" : "bg-white/5 text-neutral-300 hover:bg-white/10"}`}
              >
                Set to 35% (Arc Rising)
              </button>
              <button
                onClick={() => setSliderProgress(0.50)}
                className={`px-3 py-1 rounded-md text-xs font-mono ${sliderProgress === 0.50 ? "bg-[#cdb864] text-black font-bold" : "bg-white/5 text-neutral-300 hover:bg-white/10"}`}
              >
                Set to 50% (Half Masked)
              </button>
              <button
                onClick={() => setSliderProgress(0.70)}
                className={`px-3 py-1 rounded-md text-xs font-mono ${sliderProgress === 0.70 ? "bg-[#cdb864] text-black font-bold" : "bg-white/5 text-neutral-300 hover:bg-white/10"}`}
              >
                Set to 70% (Total Blackout)
              </button>
              <button
                onClick={() => setSliderProgress(1.00)}
                className={`px-3 py-1 rounded-md text-xs font-mono ${sliderProgress === 1.00 ? "bg-[#cdb864] text-black font-bold" : "bg-white/5 text-neutral-300 hover:bg-white/10"}`}
              >
                Set to 100% (Revealed)
              </button>
            </div>
          </div>

          {/* 3 PREVIEW VIEWPORTS SIDE-BY-SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* STAGE 1: 0% PROGRESS */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <span className="text-xs font-bold text-[#ebe0a6] uppercase tracking-wider">
                  Stage 1 • 0% Progress
                </span>
                <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                  Off-Screen
                </span>
              </div>
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border-2 border-neutral-800 shadow-2xl bg-black">
                <CircularArcTransition
                  technique={technique}
                  circleMultiplier={multiplier}
                  forcedProgress={0}
                  outgoingContent={renderOutgoing(true)}
                  incomingContent={renderIncoming(true)}
                />
              </div>
              <div className="mt-3 p-3 rounded-xl bg-neutral-900/70 border border-white/5 text-[11px] text-neutral-300 leading-relaxed">
                <strong className="text-white">State at 0%:</strong> The solid black circle sits completely below the viewport edge (<code className="text-[#cdb864]">y &gt; H</code>). Outgoing section is 100% visible with zero black intrusion.
              </div>
            </div>

            {/* STAGE 2: 50% PROGRESS */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <span className="text-xs font-bold text-[#ebe0a6] uppercase tracking-wider">
                  Stage 2 • 50% Progress
                </span>
                <span className="text-[10px] font-mono text-[#cdb864] bg-[#cdb864]/10 px-2 py-0.5 rounded border border-[#cdb864]/30">
                  Halfway Masked
                </span>
              </div>
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border-2 border-[#cdb864]/40 shadow-2xl bg-black">
                <CircularArcTransition
                  technique={technique}
                  circleMultiplier={multiplier}
                  forcedProgress={0.5}
                  outgoingContent={renderOutgoing(true)}
                  incomingContent={renderIncoming(true)}
                />
              </div>
              <div className="mt-3 p-3 rounded-xl bg-neutral-900/70 border border-white/5 text-[11px] text-neutral-300 leading-relaxed">
                <strong className="text-white">State at 50%:</strong> The solid black shape has risen halfway up the screen. The lower half is <strong>100% solid flat black fill (#000000)</strong> cleanly covering the cards. No stroke, no glow.
              </div>
            </div>

            {/* STAGE 3: 100% PROGRESS */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <span className="text-xs font-bold text-[#ebe0a6] uppercase tracking-wider">
                  Stage 3 • 100% Progress
                </span>
                <span className="text-[10px] font-mono text-[#34d399] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Solid Blackout & Revealed
                </span>
              </div>
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border-2 border-neutral-800 shadow-2xl bg-black">
                <CircularArcTransition
                  technique={technique}
                  circleMultiplier={multiplier}
                  forcedProgress={1}
                  outgoingContent={renderOutgoing(true)}
                  incomingContent={renderIncoming(true)}
                />
              </div>
              <div className="mt-3 p-3 rounded-xl bg-neutral-900/70 border border-white/5 text-[11px] text-neutral-300 leading-relaxed">
                <strong className="text-white">State at 100%:</strong> The solid black shape covers 100% of the viewport (solid black). The new incoming section's content is revealed on top of this pure black canvas.
              </div>
            </div>
          </div>

          {/* LARGE INTERACTIVE VIEWPORT DRIVEN BY SLIDER */}
          <div className="mb-14">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#ebe0a6]">
                Live Dynamic Viewport (Controlled by Slider above: {Math.round(sliderProgress * 100)}%)
              </h3>
              <span className="text-xs text-neutral-400">
                Drag slider above or click buttons to scrub in real-time
              </span>
            </div>
            <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black">
              <CircularArcTransition
                technique={technique}
                circleMultiplier={multiplier}
                forcedProgress={sliderProgress}
                showDebugBadge={true}
                outgoingContent={renderOutgoing(false)}
                incomingContent={renderIncoming(false)}
              />
            </div>
          </div>

          {/* CTA to switch to natural scroll */}
          <div className="text-center py-8 border-t border-white/10">
            <p className="text-sm text-neutral-400 mb-4">
              Want to test how this feels when physically scrolling with your mouse or trackpad?
            </p>
            <button
              onClick={() => setViewMode("scroll")}
              className="gold-pill-btn px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl inline-flex items-center gap-2"
            >
              <span>Switch to Live Scroll Scrub Mode</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODE 2: LIVE PHYSICAL SCROLL SCRUB (300vh TRACK)                      */}
      {/* ===================================================================== */}
      {viewMode === "scroll" && (
        <div>
          {/* Scroll instruction banner */}
          <div className="pt-12 pb-8 px-4 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#cdb864]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#ebe0a6]">
                Natural Scroll Mode Active
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 gold-gradient-heading">
              Physical Scroll-Scrubbed Transition
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed mb-6">
              Scroll down to scrub the solid black arc upwards. Notice how scrolling down raises the shape
              to cover the outgoing section, and scrolling back up cleanly reverses it in real-time.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#ebe0a6] animate-bounce">
              <ArrowDown className="w-4 h-4" />
              <span>Scroll down to start scrubbing</span>
              <ArrowDown className="w-4 h-4" />
            </div>
          </div>

          {/* Pinned 300vh Scroll Transition */}
          <CircularArcTransition
            technique={technique}
            circleMultiplier={multiplier}
            trackHeight="300vh"
            onProgressChange={setLiveProgress}
            showDebugBadge={true}
            outgoingContent={renderOutgoing(false)}
            incomingContent={renderIncoming(false)}
          />

          {/* Footer after scroll finishes */}
          <div className="py-20 px-6 text-center border-t border-white/10 max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-[#ebe0a6] mb-3">
              Scrub Sequence Complete
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
              The solid black filled shape rose from off-screen, completely covered the viewport, and revealed the incoming section.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setViewMode("compare")}
                className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15"
              >
                Back to 0% / 50% / 100% Compare
              </button>
              <button
                onClick={onSwitchToFullSite}
                className="gold-pill-btn px-6 py-2.5 rounded-full text-xs font-semibold"
              >
                View Full Evia Wealth Site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
