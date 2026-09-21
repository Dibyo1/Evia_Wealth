import React, { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { INSIGHTS_ARTICLES, InsightArticle } from "../data/siteData";

export default function InsightsSection() {
  const [activeArticle, setActiveArticle] = useState<InsightArticle | null>(null);

  // Fallback image in case network / CDN issue occurs
  const fallbackImages: Record<string, string> = {
    "article-1": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    "article-2": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    "article-3": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
  };

  return (
    <section className="py-24 md:py-36 bg-black relative border-t border-white/6">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto mb-16 md:mb-20">
          <div className="gold-eyebrow-pill mb-4">
            <span className="gold-dot" />
            <span className="gold-eyebrow-text">RESEARCH & INTELLIGENCE</span>
          </div>
          <h2 className="text-[38px] sm:text-[48px] md:text-[54px] font-bold tracking-[-0.03em] leading-[1.12] mb-4 gold-gradient-heading">
            Insights for our clients
          </h2>
          <p className="text-[15px] sm:text-[16px] text-neutral-400 leading-relaxed">
            Unbiased research, wealth creation frameworks, and institutional market perspectives.
          </p>
        </div>

        {/* 3 Articles Grid / Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INSIGHTS_ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="rounded-[22px] bg-[#0e0e11] border border-white/8 overflow-hidden flex flex-col shadow-xl hover:border-[var(--gold-line)] transition-all duration-300 group cursor-pointer"
            >
              {/* Image with Category Pill & Caption */}
              <div className="relative h-[220px] w-full overflow-hidden bg-neutral-900">
                <img
                  src={article.image}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter grayscale contrast-105 group-hover:filter-none group-hover:scale-105 transition-all duration-[350ms] ease-out"
                  loading="lazy"
                  onError={(e) => {
                    const fallback = fallbackImages[article.id] || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80";
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />

                {/* Category Pill */}
                <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold tracking-wider uppercase text-[#ebe0a6]">
                  {article.category}
                </div>

                {/* Optional Caption */}
                {article.caption && (
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-[11px] font-medium text-neutral-300 bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10 truncate">
                    {article.caption}
                  </div>
                )}
              </div>

              {/* Title & Divider & Footer */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <h3 className="text-[17px] sm:text-[18px] font-semibold text-white leading-snug tracking-tight mb-6 group-hover:text-[#ebe0a6] transition-colors">
                  {article.title}
                </h3>

                <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-neutral-400">
                    {article.readTime}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:bg-[#cdb864] group-hover:text-black group-hover:border-[#cdb864] transition-all">
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reader Dialog */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#111114] border border-[#cdb864]/30 rounded-3xl p-6 sm:p-7 shadow-2xl text-left relative overflow-hidden">
            {/* Header with Category & Close */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#cdb864] px-2.5 py-0.5 rounded-full bg-[#cdb864]/10 border border-[#cdb864]/30">
                {activeArticle.category}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close article"
                aria-label="Close article"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article Image Banner */}
            <div className="h-44 w-full rounded-2xl overflow-hidden mb-4 bg-neutral-900 border border-white/10">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-105"
                onError={(e) => {
                  const fallback = fallbackImages[activeArticle.id] || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80";
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
              />
            </div>

            <h3 className="text-xl font-bold text-white mb-2 leading-snug">
              {activeArticle.title}
            </h3>
            <p className="text-xs text-[#cdb864] mb-4 font-mono">
              {activeArticle.readTime} • Published by Evia Wealth Research Desk
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              Our investment advisory council conducts exhaustive empirical studies on portfolio optimization, macro asset allocation, fine art valuations, and capital preservation across domestic and international markets.
            </p>
            <button
              onClick={() => setActiveArticle(null)}
              className="w-full py-3 rounded-full bg-[#cdb864] hover:bg-[#d4c06e] text-black font-semibold text-xs transition-colors cursor-pointer"
            >
              Done reading
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
