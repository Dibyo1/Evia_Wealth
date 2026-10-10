import React, { useEffect } from "react";
import { ArrowRight, ChevronRight, Compass, Shield } from "lucide-react";
import { motion } from "motion/react";
import { SOLUTIONS_PAGES_DATA, SOLUTIONS_CATEGORIES_LIST, SolutionCard } from "../../data/solutionsData";
import { useNavigation } from "../../context/NavigationContext";

interface SolutionPageViewProps {
  solutionId: string;
  onReviewPortfolio: () => void;
  onLoginClick: () => void;
}

export default function SolutionPageView({
  solutionId,
  onReviewPortfolio,
}: SolutionPageViewProps) {
  const { navigate } = useNavigation();

  const data = SOLUTIONS_PAGES_DATA[solutionId] || SOLUTIONS_PAGES_DATA["investment-products"];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [solutionId]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#34d399]/30 selection:text-emerald-300">
      {/* 1. Hero Section */}
      <section className="relative pt-[104px] pb-20 sm:pb-28 border-b border-white/10 overflow-hidden">
        {/* Background Banner with deep black-and-gold gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={data.bannerImage}
            alt={data.categoryName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#d4c06e]/8 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* Breadcrumb Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs sm:text-sm text-[#c4c0b8]/70 mb-8"
          >
            <button
              onClick={() => navigate("/")}
              className="hover:text-[#f1e7b4] transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]/60" />
            <span className="text-[#c4c0b8]/90">Solutions</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]/60" />
            <span className="text-[#f1e7b4] font-medium">{data.categoryName}</span>
          </motion.div>

          {/* Section Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-4"
          >
            <div className="gold-eyebrow-pill">
              <span className="gold-dot" />
              <span className="gold-eyebrow-text">SOLUTIONS</span>
            </div>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            key={`heading-${data.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[34px] sm:text-[46px] md:text-[56px] font-bold tracking-tight gold-gradient-heading max-w-4xl mb-6 leading-[1.12]"
          >
            {data.heroHeading}
          </motion.h1>

          {/* Hero Intro Paragraph */}
          <motion.p
            key={`intro-${data.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[16px] sm:text-[18px] text-[#c4c0b8] max-w-3xl leading-[1.75] font-normal"
          >
            {data.heroIntro}
          </motion.p>
        </div>
      </section>

      {/* 2. Main Two-Column Layout */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT COLUMN: Sticky Sidebar */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              {/* About Our Company Card */}
              <div className="rounded-[24px] bg-[#0c0d10] border border-white/10 p-6 sm:p-7 shadow-xl relative overflow-hidden group hover:border-[#d4c06e]/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#e2d6a0]/10 border border-[#e2d6a0]/25 text-[#d9c56e] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-[19px] sm:text-[21px] font-bold gold-gradient-heading mb-3">
                  About Our Company
                </h3>
                <p className="text-[13.5px] sm:text-[14px] text-[#c4c0b8] leading-[1.7] mb-5">
                  The word EVIA is derived from the Greek Word Euboea, denoting a place of historical significance during ancient times as one of the largest trade routes connecting Greece with the rest of the world. Evia Wealth is built on similar pillars—empowering you to navigate the complexities of wealth management with confidence.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/", "about")}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#e6d78a] hover:text-[#f1e7b4] transition-colors cursor-pointer"
                >
                  <span>Learn more about our heritage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Solutions Quick Navigation List */}
              <div className="rounded-[24px] bg-[#0c0d10] border border-white/10 p-6 sm:p-7 shadow-xl">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/8">
                  <Shield className="w-4 h-4 text-[#d9c56e]" />
                  <h3 className="text-[16px] font-bold text-white uppercase tracking-wider text-xs">
                    Solutions Directory
                  </h3>
                </div>

                <nav className="space-y-1.5">
                  {SOLUTIONS_CATEGORIES_LIST.map((cat) => {
                    const isActive = cat.id === data.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => navigate(`/solutions/${cat.id}`)}
                        className={`w-full flex items-center justify-between text-left px-3.5 py-3 rounded-xl text-[14.5px] transition-all cursor-pointer ${
                          isActive
                            ? "bg-[rgba(212,175,55,0.14)] text-[#f1e7b4] font-semibold border-l-2 border-[#d4c06e] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                            : "text-[#cfc7a0]/80 hover:text-[#f1e7b4] hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d4c06e] shadow-[0_0_8px_#d4c06e]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
                          )}
                          <span>{cat.label}</span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isActive ? "text-[#d4c06e] translate-x-0.5" : "text-neutral-600"
                          }`}
                        />
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* RIGHT COLUMN: Alternating Sub-Item Solution Cards */}
            <main className="lg:col-span-8 space-y-8">
              {data.cards.map((card: SolutionCard, index: number) => {
                // Alternating layout: even = image left, odd = image right
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="rounded-[24px] bg-[#0c0d10] border border-white/10 hover:border-[#d4c06e]/35 p-6 sm:p-8 transition-all duration-300 shadow-xl group hover:shadow-[0_12px_40px_rgba(212,175,55,0.06)] relative overflow-hidden"
                  >
                    {/* Subtle golden ambient glow inside card on hover */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4c06e]/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-[#d4c06e]/10 transition-colors" />

                    <div
                      className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center ${
                        isEven ? "" : "md:flex md:flex-row-reverse"
                      }`}
                    >
                      {/* Card Image */}
                      <div className="md:col-span-5 w-full">
                        <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-white/10 relative bg-neutral-900 group-hover:border-[#d4c06e]/30 transition-colors">
                          <img
                            src={card.image}
                            alt={card.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>

                      {/* Card Text Content */}
                      <div className="md:col-span-7 flex flex-col justify-center text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] font-semibold text-[#d9c56e] tracking-wider uppercase">
                            {String(index + 1).padStart(2, "0")} / {data.categoryName}
                          </span>
                        </div>

                        <h3 className="text-[20px] sm:text-[23px] font-bold text-white group-hover:text-[#f1e7b4] transition-colors leading-tight mb-3">
                          {card.title}
                        </h3>

                        <p className="text-[14px] sm:text-[15px] text-[#c4c0b8] leading-[1.7] font-normal mb-5">
                          {card.description}
                        </p>

                        <button
                          type="button"
                          onClick={onReviewPortfolio}
                          className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#e6d78a] hover:text-[#f1e7b4] transition-colors group/link cursor-pointer self-start"
                        >
                          <span>Enquire about this solution</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
