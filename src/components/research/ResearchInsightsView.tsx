import React, { useEffect } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import {
  RESEARCH_HERO_DATA,
  LEADERSHIP_TEAM_DATA,
  ADVISORY_BOARD_DATA,
  TeamMember,
  AdvisoryMember,
} from "../../data/researchData";
import PersonPhoto from "./PersonPhoto";
import { useNavigation } from "../../context/NavigationContext";

interface ResearchInsightsViewProps {
  onReviewPortfolio: () => void;
  onLoginClick?: () => void;
}

export default function ResearchInsightsView({
  onReviewPortfolio,
}: ResearchInsightsViewProps) {
  const { navigate } = useNavigation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#34d399]/30 selection:text-emerald-300">
      {/* 1. Hero Section */}
      <section className="relative pt-[104px] pb-16 sm:pb-24 border-b border-white/10 overflow-hidden">
        {/* Full-width banner image background with dark gold/black gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={RESEARCH_HERO_DATA.bannerImage}
            alt="Research and Insights"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/90 to-black pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-[#d4c06e]/10 rounded-full blur-[140px] pointer-events-none" />
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
            <span className="text-[#f1e7b4] font-medium">{RESEARCH_HERO_DATA.title}</span>
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
              <span className="gold-eyebrow-text">{RESEARCH_HERO_DATA.eyebrow}</span>
            </div>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[36px] sm:text-[48px] md:text-[60px] font-bold tracking-tight gold-gradient-heading max-w-4xl mb-6 leading-[1.12]"
          >
            {RESEARCH_HERO_DATA.title}
          </motion.h1>

          {/* Lead Intro Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[17px] sm:text-[20px] text-[#e6d78a] max-w-4xl leading-[1.7] font-normal mb-8"
          >
            {RESEARCH_HERO_DATA.leadParagraph}
          </motion.p>
        </div>
      </section>

      {/* 2. LEADERSHIP TEAM – NGEN RESEARCH */}
      <section className="py-16 sm:py-24 relative border-b border-white/8">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="gold-eyebrow-pill mb-4">
              <span className="gold-dot" />
              <span className="gold-eyebrow-text">{LEADERSHIP_TEAM_DATA.eyebrow}</span>
            </div>

            <h2 className="text-[32px] sm:text-[44px] font-bold gold-gradient-heading mb-4 leading-tight">
              {LEADERSHIP_TEAM_DATA.sectionTitle}
            </h2>

            <p className="text-[15px] sm:text-[16px] text-[#c4c0b8] leading-[1.75] font-normal">
              {LEADERSHIP_TEAM_DATA.intro}
            </p>
          </div>

          {/* 3 Leadership Profiles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {LEADERSHIP_TEAM_DATA.members.map((member: TeamMember, index: number) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-[24px] bg-[#0c0d10] border border-white/10 hover:border-[#d4c06e]/40 p-7 sm:p-8 transition-all duration-300 shadow-xl group hover:shadow-[0_12px_40px_rgba(212,175,55,0.12)] relative overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle top-right corner glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4c06e]/5 rounded-full blur-[70px] pointer-events-none group-hover:bg-[#d4c06e]/12 transition-colors" />

                <div>
                  {/* Photo / Circular Avatar (approx 160-180px desktop) */}
                  <div className="mb-7 flex justify-center sm:justify-start">
                    <PersonPhoto
                      src={member.photoUrl}
                      initials={member.initials}
                      name={member.name}
                      size="xl"
                    />
                  </div>

                  {/* Name and Role */}
                  <h3 className="text-[22px] sm:text-[24px] font-bold text-white group-hover:text-[#f1e7b4] transition-colors leading-tight mb-2 font-['Poppins']">
                    {member.name}
                  </h3>

                  <div className="text-[14px] font-medium text-[#d9c56e] tracking-wide mb-6">
                    {member.role}
                  </div>

                  {/* Bio Paragraphs */}
                  <div className="space-y-3.5 text-[13.5px] sm:text-[14px] text-[#c4c0b8] leading-[1.75] font-normal">
                    {member.bio.map((paragraph: string, pIdx: number) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Bottom line accent */}
                <div className="mt-8 pt-5 border-t border-white/8 flex items-center justify-between text-xs text-neutral-500">
                  <span className="tracking-wider uppercase font-semibold text-[#d4af37]/80">
                    NGEN Research
                  </span>
                  <span className="text-[11px] text-neutral-400">Executive Leadership</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ADVISORY BOARD */}
      <section className="py-16 sm:py-24 relative">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="gold-eyebrow-pill mb-4">
              <span className="gold-dot" />
              <span className="gold-eyebrow-text">{ADVISORY_BOARD_DATA.eyebrow}</span>
            </div>

            <h2 className="text-[32px] sm:text-[44px] font-bold gold-gradient-heading mb-4 leading-tight">
              {ADVISORY_BOARD_DATA.sectionTitle}
            </h2>

            <p className="text-[15px] sm:text-[16px] text-[#c4c0b8] leading-[1.75] font-normal">
              {ADVISORY_BOARD_DATA.intro}
            </p>
          </div>

          {/* 6 Advisory Profiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ADVISORY_BOARD_DATA.members.map((member: AdvisoryMember, index: number) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="rounded-[24px] bg-[#0c0d10] border border-white/10 hover:border-[#d4c06e]/35 p-6 sm:p-7 transition-all duration-300 shadow-lg group hover:shadow-[0_10px_35px_rgba(212,175,55,0.09)] flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Subtle background corner glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#d4c06e]/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-[#d4c06e]/10 transition-colors" />

                {/* Circular Avatar (160-180px responsive on desktop) */}
                <div className="mb-5 flex justify-center">
                  <PersonPhoto
                    src={member.photoUrl}
                    initials={member.initials}
                    name={member.name}
                    size="xl"
                  />
                </div>

                {/* Name & Title */}
                <div className="w-full">
                  <h3 className="text-[19px] sm:text-[20px] font-bold text-white group-hover:text-[#f1e7b4] transition-colors font-['Poppins'] leading-tight mb-2">
                    {member.name}
                  </h3>
                  <div className="text-[13.5px] text-[#d9c56e] font-medium leading-relaxed max-w-[260px] mx-auto">
                    {member.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Consultation Strip */}
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-[#121318] via-[#0c0d10] to-[#121318] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h4 className="text-[18px] font-bold text-white mb-1">
                Access Exclusive Macroeconomic Research Reports
              </h4>
              <p className="text-[13.5px] text-neutral-400">
                Institutional clients and private banking members receive weekly deep-dive equity and multi-asset briefings.
              </p>
            </div>
            <button
              type="button"
              onClick={onReviewPortfolio}
              className="h-11 px-7 rounded-full gold-pill-btn text-xs tracking-widest uppercase flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>CONNECT WITH ADVISORS</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
