import React, { useState, useMemo, useEffect } from "react";
import { ChevronRight, Search, X, FileText, ArrowUpRight, Building2 } from "lucide-react";
import { motion } from "motion/react";
import { AMCS_LIST, AMCItem } from "../data/amcsData";
import { useNavigation } from "../context/NavigationContext";

interface AmcsEmpanelledProps {
  onReviewPortfolio?: () => void;
  onLoginClick?: () => void;
}

export default function AmcsEmpanelled({ }: AmcsEmpanelledProps) {
  const { navigate, openDisclosureModal } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const filteredAmcs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return AMCS_LIST;
    return AMCS_LIST.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.number.includes(q) ||
        item.fullName.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#34d399]/30 selection:text-emerald-300">
      {/* 1. Hero Section */}
      <section className="relative pt-[104px] pb-16 sm:pb-24 border-b border-white/10 overflow-hidden">
        {/* Subtle dark gold glow behind hero */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] bg-[#d4c06e]/8 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/95 to-black" />
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
            <span className="text-[#c4c0b8]/80">Services</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#d4af37]/60" />
            <span className="text-[#f1e7b4] font-medium">List of AMCs Empanelled</span>
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
              <span className="gold-eyebrow-text">PARTNER ECOSYSTEM</span>
            </div>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[34px] sm:text-[46px] md:text-[56px] font-bold tracking-tight gold-gradient-heading max-w-4xl mb-5 leading-[1.14]"
          >
            AMCs Empanelled with Us
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[16px] sm:text-[18px] text-[#e6d78a]/90 max-w-3xl leading-[1.65] font-normal mb-8"
          >
            We are empanelled with the following 43 leading Asset Management Companies to offer a comprehensive, objective, and multi-asset wealth management architecture.
          </motion.p>

          {/* Quick Actions & Live Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/8"
          >
            {/* Search Filter Input matching newsletter pill styling */}
            <div className="relative flex-1 max-w-[440px]">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search AMC by name or number..."
                className="w-full h-11 pl-11 pr-10 rounded-full bg-[#111116] border border-white/10 text-white placeholder:text-neutral-500 text-[14px] focus:outline-none focus:border-[#d4af37]/60 focus:ring-1 focus:ring-[#d4af37]/30 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors p-1"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Counter badge & Commission Disclosure Link */}
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-neutral-400 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10">
                Showing <strong className="text-[#f1e7b4] font-semibold">{filteredAmcs.length}</strong> of {AMCS_LIST.length} AMCs
              </span>

              {/* Commission Disclosure button (Opens Interactive PDF Viewer Modal & Download) */}
              <button
                type="button"
                onClick={openDisclosureModal}
                className="inline-flex items-center gap-1.5 h-11 px-4 rounded-full bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.3)] text-[#f1e7b4] text-[13px] font-medium hover:bg-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.5)] transition-all cursor-pointer group shrink-0"
              >
                <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                <span className="hidden sm:inline">Commission Disclosure</span>
                <span className="sm:hidden">Disclosure</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#d4af37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Empanelled AMCs Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8">
          {filteredAmcs.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-[#0c0c0f] p-12 text-center max-w-lg mx-auto">
              <Building2 className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">No AMCs found</h3>
              <p className="text-sm text-neutral-400 mb-5">
                No asset management companies match &ldquo;{searchTerm}&rdquo;. Try another search keyword.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium tracking-wide uppercase transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredAmcs.map((amc, idx) => (
                <motion.div
                  key={amc.fullName}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(idx * 0.015, 0.35),
                    ease: "easeOut",
                  }}
                  className="group rounded-2xl bg-[#0c0c0f] border border-white/8 hover:border-[rgba(212,175,55,0.45)] hover:shadow-[0_8px_28px_rgba(212,175,55,0.12)] p-4 sm:p-4.5 flex items-center gap-3.5 transition-all duration-200 hover:-translate-y-0.5 cursor-default relative overflow-hidden"
                >
                  {/* Subtle inner corner glow on hover */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[rgba(212,175,55,0.06)] rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* AMC Number badge (small gold circle) */}
                  <div className="w-8 h-8 rounded-full bg-[rgba(212,175,55,0.12)] border border-[rgba(212,175,55,0.28)] text-[#f1e7b4] font-semibold text-[12.5px] flex items-center justify-center shrink-0 group-hover:border-[rgba(212,175,55,0.6)] group-hover:bg-[rgba(212,175,55,0.22)] group-hover:scale-105 transition-all font-mono shadow-[0_0_8px_rgba(212,175,55,0.1)]">
                    {amc.number}
                  </div>

                  {/* AMC Name */}
                  <div className="min-w-0 flex-1">
                    <span className="block text-[13.5px] sm:text-[14px] font-medium text-neutral-200 group-hover:text-white transition-colors leading-snug break-words">
                      {amc.name}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
