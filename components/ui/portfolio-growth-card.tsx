"use client";

import React, { useEffect, useRef } from "react";
import { mountPortfolioChart, type PortfolioChartOptions } from "./portfolio-chart";

/**
 * Hero "Your Portfolio" animated growth card.
 * Drop next to portfolio-chart.ts (e.g. components/ui/) and use:
 *   <PortfolioGrowthCard className="w-full max-w-[472px]" />
 * The card is a single responsive SVG (472×384 design size); it scales with its container.
 * The animation starts when the card is ≥50% visible and replays on every re-entry.
 */
export default function PortfolioGrowthCard({
  className = "",
  ...options
}: { className?: string } & PortfolioChartOptions) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = mountPortfolioChart(ref.current, options);
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.autoplay, options.replayOnView, options.speed, options.loop, options.holdDuration]);

  return <div ref={ref} className={className} />;
}
