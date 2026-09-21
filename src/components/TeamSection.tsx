import React, { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { TEAM_MEMBERS, TeamMember } from "../data/siteData";

export default function TeamSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleMember = (id: string) => {
    // Keep at least one expanded, or allow closing if needed. The prompt says:
    // "Punit Sharma should be expanded... user clicks Bikash -> Punit collapses, Bikash expands. Only one expanded at a time."
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="team" className="pt-[12vh] pb-32 md:pb-40 bg-black text-white relative m-0">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* =================================================================== */}
        {/* SECTION HEADING                                                     */}
        {/* =================================================================== */}
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <h2 className="text-[40px] sm:text-[52px] md:text-[58px] font-bold tracking-[-0.03em] leading-[1.12] bg-gradient-to-r from-[#ebe0a6] via-[#d4c06e] to-[#a89537] bg-clip-text text-transparent font-['Poppins']">
            Meet our team
            <br />
            of experts
          </h2>
        </div>

        {/* =================================================================== */}
        {/* TEAM MEMBERS DECK (min(92vw, 740px))                                */}
        {/* =================================================================== */}
        <LayoutGroup>
          <div className="w-[min(92vw,740px)] mx-auto space-y-4 md:space-y-5">
            {TEAM_MEMBERS.map((member) => {
              const isExpanded = expandedId === member.id;

              return (
                <motion.div
                  layout
                  key={member.id}
                  id={`team-member-card-${member.id}`}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ borderRadius: isExpanded ? "30px" : "24px" }}
                  className={`w-full overflow-hidden transition-all duration-300 border ${
                    isExpanded
                      ? "bg-[#f5f3ee] text-[#080808] border-[#d4c06e]/45 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                      : "bg-[#0b0c0f] text-white border-white/10 hover:border-white/20 hover:bg-[#101114] shadow-md"
                  }`}
                >
                  {/* CARD HEADER (Always visible, serves as the trigger button) */}
                  <button
                    type="button"
                    onClick={() => toggleMember(member.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`team-member-content-${member.id}`}
                    className="w-full text-left p-5 sm:p-6 md:p-7 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#cdb864] rounded-t-[24px]"
                  >
                    <div className="flex items-center gap-4 sm:gap-5">
                      {/* Portrait Circle with Size Change */}
                      <motion.div
                        layout="position"
                        className="relative shrink-0 overflow-hidden rounded-full bg-neutral-800"
                      >
                        <img
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className={`object-cover rounded-full transition-all duration-500 ${
                            isExpanded ? "w-14 h-14 sm:w-20 sm:h-20" : "w-11 h-11 sm:w-12 sm:h-12"
                          }`}
                        />
                      </motion.div>

                      {/* Name & Designation */}
                      <motion.div layout="position" className="space-y-0.5">
                        <h3
                          className={`font-semibold tracking-tight transition-colors duration-300 ${
                            isExpanded
                              ? "text-[20px] sm:text-[25px] font-bold text-black"
                              : "text-[16px] sm:text-[18px] text-white"
                          }`}
                        >
                          {member.name}
                        </h3>
                        <p
                          className={`text-[12px] sm:text-[14px] transition-colors duration-300 ${
                            isExpanded ? "text-neutral-600 font-medium" : "text-neutral-400"
                          }`}
                        >
                          {isExpanded ? member.fullRole : member.role}
                        </p>

                        {/* UNDERSTATED LINKEDIN BADGE (Only in expanded header) */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-sm bg-neutral-200/60 border border-neutral-300/40 text-[10px] font-medium text-neutral-700"
                          >
                            <svg className="w-3 h-3 text-[#0a66c2] fill-current" viewBox="0 0 24 24">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                            </svg>
                            <span>LinkedIn / Verified</span>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>

                    {/* ROTATING MINUS / PLUS ACTION BUTTON */}
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all shrink-0 duration-300 ${
                        isExpanded
                          ? "bg-black/5 hover:bg-black/10 text-black"
                          : "bg-white/5 hover:bg-white/10 text-neutral-400 group-hover:text-white"
                      }`}
                    >
                      <motion.div
                        animate={{ rotate: isExpanded ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <Plus className="w-4 h-4 sm:w-5 h-5" />
                      </motion.div>
                    </div>
                  </button>

                  {/* =================================================================== */}
                  {/* EXPANDABLE DETAIL SHEET                                             */}
                  {/* =================================================================== */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={`team-member-content-${member.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
                          opacity: { duration: 0.35, ease: "linear" },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-7 pt-2 sm:px-8 sm:pb-9 md:px-9 md:pb-10 space-y-6">
                          
                          {/* FACT SHEET 2x2 GRID with Elegant Internal Divider Lines */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl border border-neutral-300/50 overflow-hidden bg-neutral-200/20">
                            {member.facts.map((fact, index) => {
                              // Determine border classes for clean 2x2 grids
                              const borderClasses = `p-4 flex flex-col justify-between ${
                                index === 0
                                  ? "border-b sm:border-r border-neutral-300/40"
                                  : index === 1
                                  ? "border-b border-neutral-300/40"
                                  : index === 2
                                  ? "border-b sm:border-b-0 sm:border-r border-neutral-300/40"
                                  : ""
                              }`;

                              return (
                                <div key={index} className={borderClasses}>
                                  <span className="text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">
                                    {fact.label}
                                  </span>
                                  <span className="text-[15px] sm:text-[17px] font-black text-black leading-snug tracking-tight">
                                    {fact.value}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* BIOGRAPHY PARAGRAPH */}
                          <div className="text-[14px] sm:text-[15px] md:text-[16px] text-neutral-700 leading-relaxed font-normal border-t border-neutral-300/50 pt-5">
                            {member.bio}
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* =================================================================== */}
            {/* RESEARCH & QUANT COUNCIL BOTTOM ROW                                 */}
            {/* =================================================================== */}
            <div className="w-full rounded-[24px] bg-[#0b0c0f] border border-white/10 p-5 sm:p-6 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                
                {/* Overlapping small circular portraits */}
                <div className="flex -space-x-2.5 overflow-hidden shrink-0">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0b0c0f] object-cover"
                    referrerPolicy="no-referrer"
                    src="https://eviawealth.com/images/team-member/punit.jpg"
                    alt="Council member"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0b0c0f] object-cover"
                    referrerPolicy="no-referrer"
                    src="https://eviawealth.com/images/team-member/bikash.jpg"
                    alt="Council member"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0b0c0f] object-cover"
                    referrerPolicy="no-referrer"
                    src="https://eviawealth.com/images/team-member/narayan.jpg"
                    alt="Council member"
                  />
                </div>

                <span className="text-[13px] sm:text-[14px] text-neutral-400 font-semibold font-['Poppins']">
                  Research & Quant Council
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (expandedId !== "punit-sharma") {
                    setExpandedId("punit-sharma");
                  }
                }}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer group"
              >
                <span>See all members</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </LayoutGroup>

      </div>
    </section>
  );
}
