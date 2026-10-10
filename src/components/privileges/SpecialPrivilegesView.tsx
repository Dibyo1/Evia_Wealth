import React, { useEffect } from "react";
import { ChevronRight, ArrowRight, ShieldCheck, Car, Calendar, FileText, Send, Sparkles, X, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { SPECIAL_PRIVILEGES_DATA } from "../../data/specialPrivilegesData";
import { useNavigation } from "../../context/NavigationContext";

interface SpecialPrivilegesViewProps {
  onReviewPortfolio: () => void;
  onLoginClick?: () => void;
}

export default function SpecialPrivilegesView({
  onReviewPortfolio,
}: SpecialPrivilegesViewProps) {
  const { navigate } = useNavigation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const getSectionIcon = (id: string) => {
    switch (id) {
      case "exclusive-events":
        return <Calendar className="w-4 h-4 text-[#d9c56e]" />;
      case "security-privacy":
        return <ShieldCheck className="w-4 h-4 text-[#d9c56e]" />;
      case "concierge-services":
        return <Car className="w-4 h-4 text-[#d9c56e]" />;
      case "reporting-insights":
        return <FileText className="w-4 h-4 text-[#d9c56e]" />;
      case "courier-services":
        return <Send className="w-4 h-4 text-[#d9c56e]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#d9c56e]" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#34d399]/30 selection:text-emerald-300 relative overflow-hidden">
      {/* 1. Hero Section with soft dark-green radial glow behind page title */}
      <section className="relative pt-[112px] pb-14 sm:pb-20 border-b border-white/[0.08] overflow-hidden">
        {/* Soft dark-green radial glow: rgba(16,185,129,0.10) fading to transparent behind page title */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[360px] sm:h-[460px] rounded-full blur-[140px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.02) 60%, transparent 80%)",
          }}
        />

        {/* Subtle warm gold accent aura */}
        <div className="absolute top-1/3 right-1/4 w-[380px] h-[280px] bg-[#d4c06e]/5 rounded-full blur-[110px] pointer-events-none" />

        <div className="relative z-10 max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* Breadcrumb + Close / Back Action */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-2 text-xs sm:text-sm text-[#c4c0b8]/75"
            >
              <button
                onClick={() => navigate("/")}
                className="hover:text-[#f1e7b4] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]/60" />
              <span className="text-[#f1e7b4] font-medium">Special Privileges</span>
            </motion.div>

            {/* Close / Return Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              onClick={() => navigate("/")}
              aria-label="Close Special Privileges and return to Home"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#d9c56e]/40 text-[#c4c0b8] hover:text-[#f1e7b4] text-xs font-medium transition-all duration-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Close</span>
            </motion.button>
          </div>

          {/* Section Eyebrow Pill: Mint dot + SPECIAL PRIVILEGES */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mb-5"
          >
            <div className="gold-eyebrow-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(212,175,55,0.3)] bg-[#121214] shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
              <span className="text-[11.5px] font-semibold tracking-wider text-[#e6d78a] uppercase">
                {SPECIAL_PRIVILEGES_DATA.eyebrow}
              </span>
            </div>
          </motion.div>

          {/* Large Gold Gradient Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-[34px] sm:text-[48px] md:text-[58px] font-bold tracking-tight max-w-4xl mb-6 leading-[1.14]"
            style={{
              background: "linear-gradient(90deg, #ebe0a6 0%, #d4c06e 35%, #b9a13f 70%, #a89537 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            {SPECIAL_PRIVILEGES_DATA.heading}
          </motion.h1>

          {/* Subheading: white/secondary gray body text (not gold) */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="text-[15.5px] sm:text-[17.5px] md:text-[18.5px] text-[rgba(255,255,255,0.7)] max-w-3xl leading-[1.75] font-normal"
          >
            {SPECIAL_PRIVILEGES_DATA.subheading}
          </motion.p>
        </div>
      </section>

      {/* 2. Content Sections: Dark Cards, Alternating Image/Text */}
      <section className="py-14 sm:py-20 relative">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 space-y-10 sm:space-y-14">
          {SPECIAL_PRIVILEGES_DATA.sections.map((section) => {
            const isConcierge = section.isConciergeCard;
            const isReverse = section.imagePosition === "left";

            // SECTION 3: Full-width banner card with dark/black-overlaid background photo
            if (isConcierge) {
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5 }}
                  className="rounded-[22px] sm:rounded-[24px] bg-[#0e0e0f] border border-white/[0.08] hover:border-[#d4c06e]/30 p-7 sm:p-10 md:p-12 transition-all duration-300 shadow-2xl relative overflow-hidden group"
                >
                  {/* Dark/black-overlaid background photo */}
                  <div
                    className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-20 transition-opacity duration-700 group-hover:opacity-25"
                    style={{
                      backgroundImage: `url(${section.image})`,
                    }}
                  />
                  {/* Dark gradient overlay to preserve high text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0f]/95 via-[#0e0e0f]/90 to-[#0e0e0f] pointer-events-none" />

                  {/* Ambient gold glow */}
                  <div className="absolute -top-10 right-1/4 w-80 h-80 bg-[#d4c06e]/5 rounded-full blur-[90px] pointer-events-none" />

                  <div className="relative z-10">
                    {/* Header: Solid gold (#d9c56e, Poppins 600, ~26px) + Subheading */}
                    <div className="max-w-3xl mb-8 sm:mb-10 text-left">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#e2d6a0]/10 border border-[#e2d6a0]/20 flex items-center justify-center">
                          {getSectionIcon(section.id)}
                        </div>
                        <span className="text-[11px] font-semibold text-[#d9c56e] tracking-widest uppercase">
                          {section.sectionNumber} / {section.tag}
                        </span>
                      </div>

                      <h2 className="text-[24px] sm:text-[26px] font-semibold text-[#d9c56e] leading-tight mb-2 font-['Poppins']">
                        {section.title}
                      </h2>
                      <p className="text-[16px] sm:text-[18px] text-[rgba(255,255,255,0.9)] font-medium">
                        {section.subtitle}
                      </p>
                    </div>

                    {/* Two logo chips side by side in white rounded rectangles with captions underneath in white text */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      {section.subCards?.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex flex-col justify-between bg-black/40 backdrop-blur-sm rounded-[18px] p-5 sm:p-6 border border-white/[0.08] hover:border-[#d4c06e]/25 transition-all duration-300"
                        >
                          <div>
                            {/* White rounded-rectangle chip holding partner logo */}
                            <div className="w-full h-[120px] sm:h-[130px] rounded-[12px] bg-white p-4 sm:p-5 flex items-center justify-center shadow-md mb-5 border border-black/5">
                              <img
                                src={sub.image}
                                alt={sub.alt}
                                referrerPolicy="no-referrer"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>

                            {/* Caption underneath in white text */}
                            <p className="text-[13.5px] sm:text-[14.5px] text-[rgba(255,255,255,0.85)] leading-[1.7] mb-5">
                              {sub.caption}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={onReviewPortfolio}
                            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#e6d78a] hover:text-[#f1e7b4] transition-colors cursor-pointer self-start group/btn"
                          >
                            <span>Connect with Relationship Manager</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            }

            // SECTIONS 1, 2, 4, 5: Alternating Split Cards
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5 }}
                className="rounded-[22px] sm:rounded-[24px] bg-[#0e0e0f] border border-white/[0.08] hover:border-[#d4c06e]/30 p-7 sm:p-10 md:p-12 transition-all duration-300 shadow-2xl relative overflow-hidden group"
              >
                {/* Subtle ambient gold glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4c06e]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[#d4c06e]/10 transition-colors" />

                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isReverse ? "lg:grid-flow-dense" : ""
                  }`}
                >
                  {/* Text Column */}
                  <div
                    className={`lg:col-span-7 flex flex-col justify-center text-left ${
                      isReverse ? "lg:col-start-6" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#e2d6a0]/10 border border-[#e2d6a0]/20 flex items-center justify-center">
                        {getSectionIcon(section.id)}
                      </div>
                      <span className="text-[11px] font-semibold text-[#d9c56e] tracking-widest uppercase">
                        {section.sectionNumber} / {section.tag}
                      </span>
                    </div>

                    {/* Sub-heading in solid gold (#d9c56e, Poppins 600, ~26px) — not full gradient */}
                    <h2 className="text-[24px] sm:text-[26px] font-semibold text-[#d9c56e] leading-tight mb-4 font-['Poppins']">
                      {section.title}
                    </h2>

                    {/* Body text in rgba(255,255,255,.7) */}
                    <p className="text-[14.5px] sm:text-[15.5px] text-[rgba(255,255,255,0.7)] leading-[1.8] font-normal mb-6">
                      {section.description}
                    </p>

                    <button
                      type="button"
                      onClick={onReviewPortfolio}
                      className="inline-flex items-center gap-2 text-[13.5px] font-medium text-[#e6d78a] hover:text-[#f1e7b4] transition-colors group/link cursor-pointer self-start"
                    >
                      <span>Explore this privilege</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Image Column */}
                  <div
                    className={`lg:col-span-5 w-full ${
                      isReverse ? "lg:col-start-1" : ""
                    }`}
                  >
                    {section.isWhiteContainer ? (
                      /* Logo / Graphic Image (portfolio-makeup or courier):
                         Inside white rounded container (radius 16px) with object-fit: contain so logos stay legible */
                      <div className="w-full aspect-[548/211] rounded-[16px] overflow-hidden bg-white p-3 sm:p-4 border border-[rgba(212,175,55,0.25)] shadow-lg flex items-center justify-center group-hover:border-[rgba(212,175,55,0.45)] transition-colors">
                        <img
                          src={section.image}
                          alt={section.alt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain object-center"
                        />
                      </div>
                    ) : (
                      /* Real Photo (event.jpg or security.jpg):
                         object-fit: cover, radius 16px, aspect-ratio 548/211, subtle gold-tinted border */
                      <div className="w-full aspect-[548/211] rounded-[16px] overflow-hidden border border-[rgba(212,175,55,0.22)] group-hover:border-[rgba(212,175,55,0.4)] transition-colors bg-neutral-900 shadow-lg relative">
                        <img
                          src={section.image}
                          alt={section.alt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
